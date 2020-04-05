<template>
  <div class="userdashboard">
    <record-modal :open="showRecordModal" :text="textToRecord" @closeModal="closeRecordModal" />
    <v-col class="mt-n5">
      <v-row>
        <template v-for="phrase in phrases">
          <v-col class="pa-1" :key="phrase._id" cols="12" sm="6" md="4" lg="3">
            <v-skeleton-loader type="card-heading" v-if="phrase.loading" class="elevation-1 py-2"></v-skeleton-loader>
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
      textToRecord: "",
      phrases: [
        {
          _id: 0,
          text: "...",
          loading: true
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
    authenticationError() {
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      this.$emit("UPDATENAV");
      this.$router.push("Login");
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
        this.phrases.forEach(e => {
          e.loading = false;
        });
      } catch (error) {
        if (error.response.status >= 500) {
          return notificationBus.$emit("ERROR", error.response.data.message);
        }
        this.authenticationError();
      }
    },
    updateRecordings: function() {

    }
  },
  mounted() {
    this.updatePhrases();
  },
  components: {
    RecordModal,
    AudioPlayer
  }
};
</script>