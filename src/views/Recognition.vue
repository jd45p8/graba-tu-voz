<template>
  <div class="recognition">
    <v-col class="mt-n5">
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card :loading="uploading" class="d-flex flex-column" outlined>
            <template slot="progress">
              <v-progress-linear indeterminate color="primary"></v-progress-linear>
            </template>
            <v-card-title class="headline">Reconocimiento</v-card-title>
            <v-card-text
              class="subtitle-1"
              v-if="!recording"
            >Grabe su voz cuando se indique diciendo los dígitos de su PIN</v-card-text>
            <v-card-text class="subtitle-1" v-else>
              Diga el
              <span class="title primary--text">{{recordingStep}}</span> dígito
            </v-card-text>
            <v-card-actions>
              <v-btn
                :color="recording ? 'red' : 'primary'"
                fab
                depressed
                x-large
                class="mx-auto mb-3 white--text"
                @click="startRecording"
                :disabled="uploading"
                :loading="stopping"
              >
                <v-icon>{{recording? 'mdi-stop':'mdi-microphone'}}</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- Hablantes -->
      <v-row class="mx-md-4 mx-1 mt-4" v-if="speakers.length > 0">
        <h1 class="headline font-weight-medium grey--text text--darken-3">Hablantes</h1>
      </v-row>
      <v-row class="mx-md-4 mx-1 mt-2" no-gutters>
        <template v-for="(speaker, index) in speakers">
          <v-col class="py-2 pa-sm-2" :key="index" cols="12" sm="6" md="4" lg="3">
            <v-skeleton-loader type="card-heading" v-if="uploading" class="elevation-1 py-2"></v-skeleton-loader>
            <v-card
              outlined
              v-else
              :class="{'primary': speaker.label == selectedSpeaker}"
              :dark="speaker.label == selectedSpeaker"
            >
              <v-card-title>{{speaker.label}}</v-card-title>
              <v-card-subtitle>Probabilidad: {{speaker.probability*100}}%</v-card-subtitle>
            </v-card>
          </v-col>
        </template>
      </v-row>
      <!-- Hablantes -->

      <!-- Texto -->
      <v-row class="mx-md-4 mx-1 mt-4" v-if="texts.length > 0">
        <h1 class="headline font-weight-medium grey--text text--darken-3">Texto</h1>
      </v-row>
      <v-row class="mx-md-4 mx-1 mt-2" no-gutters>
        <template v-for="(text, index) in texts">
          <v-col class="py-2 pa-sm-2" :key="index" cols="12" sm="6" md="4" lg="3">
            <v-skeleton-loader type="card-heading" v-if="uploading" class="elevation-1 py-2"></v-skeleton-loader>
            <v-card outlined v-else>
              <v-card-title>{{text.label}}</v-card-title>
              <v-card-subtitle>Probabilidad: {{text.probability*100}}%</v-card-subtitle>
            </v-card>
          </v-col>
        </template>
      </v-row>
      <!-- Texto -->
    </v-col>
  </div>
</template>

<script>
import { notificationBus } from "../main";

const axios = require("axios");
const RecordRTC = require("recordrtc");

export default {
  
  name: "Recognition",
  data: function () {
    return {
      timeRecorded: 0,
      recording: false,
      shouldStop: false,
      stopping: false,
      audioBlob: null,
      uploading: false,
      speakers: [],
      texts:[],
      selectedSpeaker: '',
      audioConstraints: {
        sampleSize: 24,
        chanelCount: 1
      },
      recordingSteps: ["primer", "segundo", "tercer", "cuarto"],
      recordingStep: "",
      stepLengthMils: 1250
    }
  },
  methods: {
    startRecording: async function() {
      this.audioBlobs = [];

      var handleSuccess = async stream => {
        const recorder = new RecordRTC(stream, {
          type: "audio",
          mimeType: "audio/wav",
          recorderType: RecordRTC.StereoAudioRecorder,
          timeSlice: 100,
          sampleRate: 44100,
          numberOfAudioChannels: 1,
          disableLogs: true,
          ondataavailable: async e => {
            if (this.shouldStop && !this.stopping) {
              this.stopping = true;
              await new Promise((resolve, reject) => {
                setTimeout(resolve, 1000);
              });
              recorder.stopRecording(blobUrl => {
                this.audioBlob = recorder.getBlob();
                stream.getAudioTracks()[0].stop();
                this.timeRecorded = performance.now() - this.timeRecorded;
                this.sendAudio();
              });
              this.recording = false;
              this.shouldStop = false;
              this.stopping = false;
            }
          }
        });
        this.recording = true;

        this.timeRecorded = performance.now();
        recorder.startRecording();
        this.countDownRecording();
      };

      if (!this.recording) {
        try {
          navigator.mediaDevices
            .getUserMedia({ audio: true, video: false })
            .then(handleSuccess)
            .catch(e => {
              notificationBus.$emit(
                "ERROR",
                "Al parecer no se pudo acceder al micrófono."
              );
            });
        } catch (error) {
          notificationBus.$emit(
            "ERROR",
            "No se cuenta con acceso al micrófono."
          );
        }
      } else if (!this.shouldStop) {
        this.shouldStop = true;
      }
    },
    countDownRecording: async function() {
      for (let i in this.recordingSteps) {
        this.recordingStep = this.recordingSteps[i];
        await new Promise((resolve, reject) => {
          setTimeout(resolve, this.stepLengthMils);
        });

        if (!this.recording || this.stopping) {
          break;
        }
      }
      if (this.recording && !this.shouldStop) {
        this.shouldStop = true;
      }
    },
    sendAudio: async function() {
      let expectedSegs = this.stepLengthMils * this.recordingSteps.length /1000 + 1;      
      if (this.timeRecorded <= expectedSegs * 1000) {
        return notificationBus.$emit("WARNING", "Debe grabar los 4 dígitos.");
      }

      let step = (this.stepLengthMils/1000)*44100;

      this.uploading = true;
      let form = new FormData();      
      form.append("file", this.audioBlob);
      form.append("phraseSamples", step);
      
      try {
        let response = await axios({
          method: "post",
          url: `${window["URL_API"]}/recognition/speaker`,
          headers: {
            Authorization: `Bearer ${localStorage.token}`
          },
          data: form
        });
        this.$emit("UPLOADED");
        notificationBus.$emit("SUCCESS", response.data.message);
        this.speakers = response.data.speakers;
        this.texts = response.data.texts;
        this.selectedSpeaker = response.data.selectedSpeaker;
      } catch (error) {
        console.log(error)
        this.showError(error)
      }
      this.uploading = false;
    },
    authenticationError(error) {
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("admin");
      this.$emit("UPDATENAV");
      this.$router.push("login");
      notificationBus.$emit("WARNING", error.response.data.message);
    },
    showError(error) {
      if (error.response) {
        let type = error.response.status >= 500 ? "ERROR" : "WARNING";
        if (error.response.status != 401 && error.response.status != 403) {
          return notificationBus.$emit(type, error.response.data.message);
        }
        this.authenticationError(error);
      } else {
        notificationBus.$emit("ERROR", "Algo ha salido mal.");
      }
    }
  }  
}
</script>