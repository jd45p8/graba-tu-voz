<template>
  <div class="recordmodal">
    <v-dialog :value="open" persistent max-width="400px">
      <v-card class="d-flex flex-column">
        <v-card-title class="headline justify-center">Grabar</v-card-title>
        <v-card-text class="subtitle-1">Debes grabar tu voz diciendo: "{{text}}"</v-card-text>

        <v-btn color="blue-dark" dark fab depressed x-large class="mx-auto" @click="startRecording">
          <v-icon>mdi-microphone</v-icon>
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
      status: ""
    };
  },
  methods: {
    closeModal: function() {
      this.$emit("closeModal");
    },
    startRecording: async function() {
      var handleSuccess = stream => {
        var context = new AudioContext();
        var input = context.createMediaStreamSource(stream);
        var processor = context.createScriptProcessor(1024, 1, 1);

        input.connect(processor);
        processor.connect(context.destination);

        processor.onaudioprocess = e => {
          console.log(e.inputBuffer);
        };
      };

      var permision = await this.checkPermision()

      if (permision != "denied") {
        navigator.mediaDevices
          .getUserMedia({ audio: true, video: false })
          .then(handleSuccess);
      } else {
        alert("¡No ha sido posible obtener acceso al micrófono!");
      }
    },
    checkPermision: function() {
      const self = this;
      return new Promise((resolve, reject) => {
        navigator.permissions.query({ name: "microphone" }).then(result => {
          resolve(result.state)
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