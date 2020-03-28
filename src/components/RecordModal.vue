<template>
  <div class="recordmodal">
    <v-dialog :value="open" persistent max-width="400px">
      <v-card class="d-flex flex-column" color="white">
        <v-card-title class="headline justify-center">Grabar</v-card-title>
        <v-card-text class="subtitle-1">Debes grabar tu voz diciendo: "{{text}}"</v-card-text>

        <v-btn
          :class="{'blue-dark':!recording, 'red':recording}"
          v-if="!finishedRecording"
          dark
          fab
          depressed
          x-large
          class="mx-auto"
          @click="startRecording"
        >
          <v-icon>{{recording? 'mdi-stop':'mdi-microphone'}}</v-icon>
        </v-btn>

        <audio
          v-if="finishedRecording"
          class="mx-auto"
          :src="audioSrc"
          controls
          controlslist="nodownload"
        ></audio>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="dark-text" text @click="closeModal">Cancelar</v-btn>
          <v-btn class="blue-dark-text mr-2" text @click="closeModal">Enviar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "RecordModal",
  data: function() {
    return {
      recording: false,
      shouldStop: false,
      finishedRecording: false,
      audioSrc: ""
    };
  },
  methods: {
    closeModal: function() {
      this.$emit("closeModal");
      this.recording = false;
      this.shouldStop = false;
      this.finishedRecording = false;
    },
    startRecording: async function() {
      var handleSuccess = stream => {
        const options = {
          sampleSize: 32,
          chanelcount: 1,
          samplerate: "44100",
          mimeType: "video/webm;codecs=vp9"
        };
        const chunks = [];
        const recorder = new MediaRecorder(stream, options);

        this.recording = true;
        this.shouldStop = false;

        recorder.ondataavailable = e => {
          if (e.data.size > 0) {
            chunks.push(e.data);
          }

          if (this.shouldStop && this.recording) {
            recorder.stop();
            this.recording = false;
            this.finishedRecording = true;
            this.shouldStop = false;
          }
        };

        recorder.onstop = e => {
          this.audioSrc = URL.createObjectURL(
            new Blob(chunks, { type: "audio/wav; codecs=0" })
          );
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
  }
};
</script>

<style lang="scss" scoped>
audio {
  width: 90%;
}
</style>