<template>
  <div class="userdashboard">
    <record-modal
      :open="showRecordModal"
      :text="textToRecord"
      @closeModal="closeRecordModal"
      v-on:AUTHERROR="authenticationError"
    />
    <v-col class="mt-n5">
      <v-row>
        <template v-for="phrase in phrases">
          <v-col class="pa-1" :key="phrase._id" cols="12" sm="6" md="4" lg="3">
            <v-skeleton-loader type="card-heading" v-if="loading" class="elevation-1 py-2"></v-skeleton-loader>
            <v-expansion-panels v-else>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <v-row align="center" class="dark-text">
                    <v-col cols="10">Frase {{phrase.text}}</v-col>
                    <v-col cols="2" class="blue-dark-text">1/5</v-col>
                  </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-card v-for="j in 4" :key="j" outlined :class="{'my-2': j > 1}">
                    <v-row no-gutters align="center" class="px-3">
                      <v-col cols="auto">
                        <span class="dark-text subtitle-2 font-weight-regular">G {{j}}</span>
                      </v-col>
                      <v-col>
                        <audio-player :id="`player-${phrase._id}-${j}`" src></audio-player>
                      </v-col>
                      <v-col cols="auto">
                        <v-btn color="grey darken-1" fab small text>
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
import { notificationBus } from "../main";
import router from "../router";

const axios = require("axios");

export default {
  nane: "UserDashBoard",
  data: function() {
    return {
      showRecordModal: false,
      loading: false,
      textToRecord: "",
      phrases: [
        {
          _id: 0,
          text: "..."
        }
      ]
    };
  },
  methods: {
    openRecordModal: function(text) {
      this.textToRecord = text;
      this.showRecordModal = true;
    },
    closeRecordModal: function() {
      this.showRecordModal = false;
      this.textToRecord = "";
    },
    authenticationError(error) {
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      this.$emit("UPDATENAV");
      this.$router.push("login");
      notificationBus.$emit("WARNING", error.response.data.message);
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
        this.phrases = response.data;
      } catch (error) {
        this.phrases = [];
        if (error.response) {
          if (error.response.status >= 500) {
            return notificationBus.$emit("ERROR", error.response.data.message);
          }
          this.authenticationError(error);
        } else {
          notificationBus.$emit("ERROR", "Algo ha salido mal.");
        }
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
        console.log(response.data);
      } catch (error) {
        if (error.response) {
          if (error.response.status >= 500) {
            return notificationBus.$emit("ERROR", error.response.data.message);
          }
          this.authenticationError(error);
        } else {
          notificationBus.$emit("ERROR", "Algo ha salido mal.");
        }
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
    AudioPlayer
  }
};
</script>