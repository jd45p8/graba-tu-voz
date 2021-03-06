<template>
  <div class="recordmodal">
    <v-dialog :value="show" persistent max-width="400px">
      <v-card :loading="uploading" class="d-flex flex-column">
        <template slot="progress">
          <v-progress-linear indeterminate color="primary"></v-progress-linear>
        </template>
        <v-card-title class="headline">Grabar</v-card-title>
        <v-card-text class="subtitle-1">Debes grabar tu voz diciendo: "{{text}}"</v-card-text>

        <audio-player ref="recorderPlayer" v-if="audioSrc" class="px-7" :src="audioSrc"></audio-player>

        <v-btn
          :color="recording ? 'red' : 'primary'"
          v-else
          fab
          depressed
          x-large
          class="mx-auto white--text"
          @click="startRecording"
          :loading="stopping"
        >
          <v-icon>{{recording? 'mdi-stop':'mdi-microphone'}}</v-icon>
        </v-btn>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="dark-text"
            text
            @click="closeModal"
            :disabled="recording || uploading"
          >Cancelar</v-btn>
          <v-btn
            class="primary--text mr-2"
            text
            @click="uploadAudio"
            :disabled="!audioSrc || uploading"
          >Enviar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import AudioPlayer from "../components/AudioPlayer.vue";
import { notificationBus } from "../main";

const axios = require("axios");
const RecordRTC = require("recordrtc");

export default {
  name: "RecordModal",
  data: function() {
    return {
      recording: false,
      shouldStop: false,
      stopping: false,
      audioSrc: "",
      audioBlob: null,
      uploading: false,
      audioConstraints: {
        sampleSize: 24,
        chanelCount: 1
      }
    };
  },
  methods: {
    closeModal: function() {
      this.$emit("update:show", false);
      this.recording = false;
      this.shouldStop = false;
      this.stopping = false;
      this.audioSrc = "";
    },
    startRecording: async function() {
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
                this.audioSrc = blobUrl;
                stream.getAudioTracks()[0].stop();
              });
              this.recording = false;
              this.shouldStop = false;
              this.stopping = false;
            }
          }
        });
        this.recording = true;

        recorder.startRecording();
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
    uploadAudio: async function() {
      this.uploading = true;
      let form = new FormData();
      form.append("file", this.audioBlob);
      form.append("text", this.text);

      try {
        let response = await axios({
          method: "post",
          url: `${window["URL_API"]}/recording`,
          headers: {
            Authorization: `Bearer ${localStorage.token}`
          },
          data: form
        });
        this.$emit("UPLOADED");
        notificationBus.$emit("SUCCESS", response.data.message);
      } catch (error) {
        if (error.response) {
          let type = error.response.status >= 500 ? "ERROR" : "WARNING";
          if (error.response.status != 401) {
            notificationBus.$emit(type, error.response.data.message);
          } else {
            this.$emit("AUTHERROR", error);
          }
        } else {
          notificationBus.$emit("ERROR", "Algo ha salido mal.");
        }
      }
      this.closeModal();
      this.uploading = false;
    }
  },
  props: {
    show: {
      type: Boolean,
      required: true
    },
    text: {
      type: String,
      required: true
    }
  },
  components: {
    AudioPlayer
  }
};
</script>