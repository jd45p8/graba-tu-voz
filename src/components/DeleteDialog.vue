<template>
  <v-dialog :value="show" persistent class="deletedialog" max-width="400px">
    <v-card>
      <v-card-title class="headline">Eliminar</v-card-title>
      <v-card-text>¿Realmente desea eliminar la pista {{recording_key}} de la frase {{phrase.text}}?</v-card-text>
      <v-card-actions>
        <v-btn class="blue-dark-text ml-2" @click="close" text>Cancelar</v-btn>
        <v-btn class="dark-text" @click="deleteRecording" text>Eliminar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "DeleteDialog",
  data: function() {
    return {
      phrase: {
        text: ""
      },
      phrase_key: 0,
      recording_key: 0
    };
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    deleteRecording: function() {
      this.$emit(
        "DELETE",
        this.phrase.recordings[this.recording_key]._id,
        this.phrase_key,
        this.recording_key
      );
      this.close();
    },
    close: function() {
      this.$emit("update:show", false);
    }
  }
};
</script>