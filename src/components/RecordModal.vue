<template>
  <div class="recordmodal">
    <v-dialog :value="open" persistent max-width="400px">
      <v-card :loading="uploading" class="d-flex flex-column" color="white">
        <v-card-title class="headline justify-center">Grabar</v-card-title>
        <v-card-text class="subtitle-1">Debes grabar tu voz diciendo: "{{text}}"</v-card-text>

        <audio-player ref="recorderPlayer" v-if="audioSrc" class="px-7" :src="audioSrc"></audio-player>

        <v-btn
          :class="{'blue-dark':!recording, 'red':recording}"
          v-else
          dark
          fab
          depressed
          x-large
          class="mx-auto"
          @click="startRecording"
        >
          <v-icon>{{recording? 'mdi-stop':'mdi-microphone'}}</v-icon>
        </v-btn>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="dark-text" text @click="closeModal" :disabled="uploading">Cancelar</v-btn>
          <v-btn
            class="blue-dark-text mr-2"
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

export default {
  name: "RecordModal",
  data: function() {
    return {
      recording: false,
      shouldStop: false,
      audioSrc: "",
      audioBlob: null,
      uploading: false,
      recordingOptions: {
        sampleSize: 32,
        chanelcount: 1,
        samplerate: "44100",
        mimeType: "video/webm;codecs=vp9"
      }
    };
  },
  methods: {
    closeModal: function() {
      this.$emit("closeModal");
      this.recording = false;
      this.shouldStop = false;
      this.audioSrc = "";
    },
    startRecording: async function() {
      var handleSuccess = stream => {
        const chunks = [];
        const recorder = new MediaRecorder(stream, this.recordingOptions);
        this.recording = true;

        recorder.ondataavailable = e => {
          if (e.data.size > 0) {
            chunks.push(e.data);
          }

          if (this.shouldStop) {
            recorder.stop();
            this.recording = false;
            this.shouldStop = false;
          }
        };

        recorder.onstop = e => {
          this.audioBlob = new Blob(chunks, { type: "audio/wave; codecs=0" });
          this.audioSrc = URL.createObjectURL(this.audioBlob);
          stream.getAudioTracks()[0].stop();
        };

        recorder.start(100);
        setTimeout(() => {
          if (chunks.length == 0) {
            recorder.stop();
            stream.getAudioTracks()[0].stop();
            this.closeModal();
            alert(
              "¡No se ha podido iniciar la grabación! Compruebe el micrófono."
            );
          }
        }, 1000);
      };

      if (!this.recording) {
        var permision = await this.checkPermision();

        if (permision != "denied") {
          navigator.mediaDevices
            .getUserMedia({ audio: true, video: false })
            .then(handleSuccess);
        } else {
          alert("¡No ha sido posible obtener acceso al micrófono!");
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
        notificationBus.$emit("SUCCESS", response.data.message);
        this.closeModal();
      } catch (error) {
        if (error.response.status >= 500) {
          notificationBus.$emit("ERROR", error.response.data.message);
        } else {
          notificationBus.$emit("WARNING", error.response.data.message);
        }
      }
      this.uploading = false;
    },
    checkPermision: function() {
      const self = this;
      return new Promise((resolve, reject) => {
        navigator.permissions.query({ name: "microphone" }).then(result => {
          resolve(result.state);
        });
      });
    }
  },
  props: {
    open: {
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