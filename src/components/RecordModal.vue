<template>
  <div class="recordmodal">
    <v-dialog :value="open" persistent max-width="400px">
      <v-card class="d-flex flex-column">
        <v-card-title class="headline justify-center">Grabar</v-card-title>
        <v-card-text class="subtitle-1">Debes grabar tu voz diciendo: "{{text}}"</v-card-text>

        <v-btn
          color="blue-dark"
          v-if="!finishedRecording"
          dark
          fab
          depressed
          x-large
          class="mx-auto"
          @click="startRecording"
        >
          <v-icon v-if="!recording">mdi-microphone</v-icon>
          <v-icon v-if="recording">mdi-stop</v-icon>
        </v-btn>

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
      finishedRecording: false
    };
  },
  methods: {
    closeModal: function() {
      this.$emit("closeModal");
    },
    startRecording: async function() {
      const self = this;

      var handleSuccess = function(stream) {
        const options = { mimeType: "video/webm;codecs=vp9" };
        const chunks = [];
        const recorder = new MediaRecorder(stream, options);

        self.recording = true;
        self.shouldStop = false;

        recorder.ondataavailable = function(e) {
          if (e.data.size > 0) {
            chunks.push(e.data);
          }

          console.log(e.data);

          if (self.shouldStop && self.recording) {
            recorder.stop();
            self.recording = false;
            self.finishedRecording = true;
            self.shouldStop = false;
          }
        };

        recorder.onstop = function(e) {
          console.log("Finished");
        };

        recorder.start();
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
      console.log(`${this.recording}  ${this.shouldStop}`)
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