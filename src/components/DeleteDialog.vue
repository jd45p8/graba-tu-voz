<template>
  <v-dialog :value="show" persistent class="deletedialog" max-width="400px">
    <v-card :loading="deleting">
      <template slot="scope">
        <v-progress-linear indeterminate color="primary"></v-progress-linear>
      </template>
      <v-card-title class="headline">Eliminar</v-card-title>
      <v-card-text
        class="subtitle-1"
      >¿Desea eliminar la pista {{recording_key}} de la frase {{phrase.text}}?</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="primary--text ml-2" @click="close" :disabled="deleting" text>Cancelar</v-btn>
        <v-btn class="dark-text" @click="deleteRecording" :disabled="deleting" text>Eliminar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { notificationBus } from "../main";

const axios = require("axios");

export default {
  name: "DeleteDialog",
  data: function() {
    return {
      deleting: false
    };
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    phrase: {
      type: Object,
      required: true
    },
    phrase_key: {
      type: Number,
      required: true
    },
    recording_key: {
      type: Number,
      required: true
    }
  },
  methods: {
    notifyParentDeletion: function() {
      this.$emit("DELETED", this.phrase_key, this.recording_key);
      this.close();
    },
    deleteRecording: async function() {
      this.deleting = true;
      try {
        let response = await axios({
          method: "delete",
          url: `${window["URL_API"]}/recording/${
            this.phrase.recordings[this.recording_key]._id
          }`,
          headers: {
            Authorization: `Bearer ${localStorage.token}`
          }
        });
        notificationBus.$emit("SUCCESS", response.data.message);
        this.notifyParentDeletion();
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
      this.deleting = false;
    },
    close: function() {
      this.$emit("update:show", false);
    }
  }
};
</script>