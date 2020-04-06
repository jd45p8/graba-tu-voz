<template>
  <div class="userdashboard">
    <record-modal
      :show.sync="showRecordModal"
      :text="textToRecord"
      @AUTHERROR="authenticationError"
      @UPLOADED="updateRecordings"
    />
    <delete-dialog
      ref="deleteDialog"
      :show.sync="showDeleteDialog"
      @DELETE="deleteRecording"
    />
    <v-col class="mt-n5">
      <v-row>
        <template v-for="(phrase, p_key) in phrases">
          <v-col class="pa-1" :key="p_key" cols="12" sm="6" md="4" lg="3">
            <v-skeleton-loader type="card-heading" v-if="loading" class="elevation-1 py-2"></v-skeleton-loader>
            <v-expansion-panels v-else>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <v-row align="center" class="dark-text">
                    <v-col cols="10">Frase {{phrase.text}}</v-col>
                    <v-col cols="2" class="blue-dark-text">{{phrase.recordings.length}}/5</v-col>
                  </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-card
                    v-for="(recording, key) in phrase.recordings"
                    :key="key"
                    outlined
                    class="mb-2"
                  >
                    <v-row no-gutters align="center" class="pl-3">
                      <v-col cols="auto">
                        <span class="dark-text subtitle-2 font-weight-regular">{{key}}</span>
                      </v-col>
                      <v-col>
                        <audio-player
                          :id="`player-${p_key}-${key}`"
                          :src="`${URL_API}/recording/${recording._id}`"
                          :auth="true"
                          v-on:AUTHERROR="authenticationError"
                        ></audio-player>
                      </v-col>
                      <v-col cols="auto">
                        <v-btn
                          @click="openDeleteDialog(phrase, p_key, key)"
                          color="grey darken-1"
                          fab
                          small
                          text
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card>
                  <v-row justify="center">
                    <v-btn
                      @click="openRecordModal(phrase.text)"
                      color="blue-dark"
                      dark
                      fab
                      depressed
                    >
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </template>
      </v-row>
    </v-col>
  </div>
</template>

<script>
import RecordModal from "../components/RecordModal.vue";
import AudioPlayer from "../components/AudioPlayer.vue";
import DeleteDialog from "../components/DeleteDialog.vue";
import { notificationBus } from "../main";
import router from "../router";

const axios = require("axios");

export default {
  nane: "UserDashBoard",
  data: function() {
    return {
      showRecordModal: false,
      showDeleteDialog: false,
      URL_API: window["URL_API"],
      loading: false,
      textToRecord: "",
      phrases: [
        {
          _id: 0,
          text: "...",
          recordings: []
        }
      ]
    };
  },
  methods: {
    openRecordModal: function(text) {
      this.textToRecord = text;
      this.showRecordModal = true;
    },
    openDeleteDialog: function(phrase, phrase_key, recording_key) {
      let deleteDialog = this.$refs.deleteDialog;
      deleteDialog.$data.phrase = phrase;
      deleteDialog.$data.phrase_key = phrase_key;
      deleteDialog.$data.recording_key = recording_key;
      this.showDeleteDialog = true;
    },
    authenticationError(error) {
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      this.$emit("UPDATENAV");
      this.$router.push("login");
      notificationBus.$emit("WARNING", error.response.data.message);
    },
    showError(error) {
      if (error.response) {
        if (error.response.status >= 500) {
          return notificationBus.$emit("ERROR", error.response.data.message);
        }
        this.authenticationError(error);
      } else {
        notificationBus.$emit("ERROR", "Algo ha salido mal.");
      }
    },
    deleteRecording: async function(recording_id, phrase_key, recording_key) {
      try {
        let response = await axios({
          method: "delete",
          url: `${window["URL_API"]}/recording/${recording_id}`,
          headers: {
            Authorization: `Bearer ${localStorage.token}`
          }
        });
        this.phrases[phrase_key].recordings.splice(recording_key, 1);
        notificationBus.$emit("SUCCESS", response.data.message);
      } catch (error) {
        this.showError(error);
      }
    },
    updatePhrases: async function() {
      try {
        let response = await axios({
          method: "get",
          url: `${window["URL_API"]}/phrase/all`,
          headers: {
            Authorization: `Bearer ${localStorage.token}`
          }
        });

        let phrases = response.data;
        phrases.sort((a, b) => {
          return a.text < b.text ? -1 : 1;
        });
        phrases.forEach(e => (e.recordings = []));
        this.phrases = phrases;
      } catch (error) {
        this.phrases = [];
        this.showError(error);
      }
    },
    updateRecordings: async function() {
      try {
        let response = await axios({
          method: "get",
          url: `${window["URL_API"]}/recording/list`,
          headers: {
            Authorization: `Bearer ${localStorage.token}`
          }
        });

        let data = response.data;
        data.sort((a, b) => {
          return a.text < b.text ? -1 : 1;
        });
        let i = 0;
        let j = 0;
        while (i < data.length && j < this.phrases.length) {
          if (this.phrases[j].text == data[i].text) {
            if (!this.phrases[j].recordings.some(r => r._id == data[i]._id)) {
              this.phrases[j].recordings.push(data[i]);
            }
            i++;
          } else {
            j++;
          }
        }
      } catch (error) {
        this.showError(error);
      }
    }
  },
  mounted: async function() {
    this.loading = true;
    await this.updatePhrases();
    if (this.phrases.length > 0) {
      await this.updateRecordings();
    }
    this.loading = false;
  },
  components: {
    RecordModal,
    AudioPlayer,
    DeleteDialog
  }
};
</script>