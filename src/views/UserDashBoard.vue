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
      :phrase="deleteDialogContent.phrase"
      :phrase_key="deleteDialogContent.phrase_key"
      :recording_key="deleteDialogContent.recording_key"
      @DELETED="removeRecording"
      @AUTHERROR="authenticationError"
    />
    <v-col class="mt-n5">
      <v-row>
        <template v-for="(phrase, p_key) in phrases">
          <v-col class="pa-1" :key="p_key" cols="12" sm="6" md="4" lg="3">
            <v-skeleton-loader type="card-heading" v-if="loading" class="elevation-1 py-2"></v-skeleton-loader>
            <v-expansion-panels v-else>
              <v-expansion-panel>
                <v-expansion-panel-header
                  :disable-icon-rotate="phrase.recordings.length >= phrase.maxRecordings"
                >
                  <template v-slot:actions v-if="phrase.recordings.length >= phrase.maxRecordings">
                    <v-icon class="success--text">mdi-check</v-icon>
                  </template>

                  <template v-slot="{ open }">
                    <v-row align="center" class="dark-text">
                      <v-col
                        :cols="recordingsCount == 0 && !open ? 'auto' : ''"
                      >Frase: {{phrase.text}}</v-col>

                      <v-col
                        v-if="recordingsCount == 0 && !open"
                        class="text--secondary text-truncate caption text-center"
                      >Click aquí para grabar</v-col>

                      <v-col
                        v-if="phrase.recordings.length < phrase.maxRecordings"
                        cols="auto"
                        class="primary--text"
                      >{{phrase.recordings.length}}/{{phrase.maxRecordings}}</v-col>
                    </v-row>
                  </template>
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
                        <span class="dark-text subtitle-2 font-weight-regular">{{key + 1}}</span>
                      </v-col>
                      <v-col>
                        <audio-player
                          :id="`player-${p_key}-${key}`"
                          :src="`${URL_API}/recording/${recording._id}`"
                          :metaDuration="recording.duration"
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
                  <v-row v-if="phrase.recordings.length < phrase.maxRecordings" justify="center">
                    <v-btn
                      @click="openRecordModal(phrase.text)"
                      color="primary"
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
      deleteDialogContent: {
        phrase: {
          text: ""
        },
        phrase_key: 0,
        recording_key: 0
      },
      phrases: [
        {
          _id: 0,
          text: "...",
          recordings: []
        }
      ],
      phrasesIndexes: {},
      recordingsCount: 0
    };
  },
  methods: {
    openRecordModal: function(text) {
      this.textToRecord = text;
      this.showRecordModal = true;
    },
    openDeleteDialog: function(phrase, phrase_key, recording_key) {
      let deleteDialog = this.$refs.deleteDialog;
      this.deleteDialogContent.phrase = phrase;
      this.deleteDialogContent.phrase_key = phrase_key;
      this.deleteDialogContent.recording_key = recording_key;
      this.showDeleteDialog = true;
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
        if (error.response.status != 401) {
          return notificationBus.$emit(type, error.response.data.message);
        }
        this.authenticationError(error);
      } else {
        notificationBus.$emit("ERROR", "Algo ha salido mal.");
      }
    },
    removeRecording: function(phrase_key, recording_key) {
      this.phrases[phrase_key].recordings.splice(recording_key, 1);
      this.recordingsCount -= 1;
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
        phrases.forEach((e, index) => {
          e.recordings = []
          this.phrasesIndexes[e.text] = index;
        });
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

        let index = this.phrasesIndexes;
        let data = response.data;
        this.recordingsCount = data.length;
        data.sort((a, b) => {
          return index[a.text] < index[b.text] ? -1 : 1;
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