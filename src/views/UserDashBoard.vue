<template>
  <div class="userdashboard">
    <record-modal :open="showRecordModal" :text="textToRecord" @closeModal="closeRecordModal" />
    <v-col class="mt-n5">
      <v-row>
        <template v-for="i in 10">
          <v-col class="pa-1" :key="i" cols="12" sm="6" md="4" lg="3">
            <v-expansion-panels>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <v-row align="center" class="dark-text">
                    <v-col cols="10">Frase {{i-1}}</v-col>
                    <v-col cols="2" class="blue-dark-text">1/5</v-col>
                  </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-card v-for="j in 4" :key="j" outlined :class="{'my-2': j > 1}">
                    <v-row no-gutters align="center" class="px-3">
                      <v-col cols="auto">
                        <h1 class="dark-text subtitle-2 font-weight-regular">G {{j}}</h1>
                      </v-col>
                      <v-col>
                        <audio-player :id="`player-${i}-${j}`" src=""></audio-player>                        
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
                      @click="openRecordModal((i-1).toString())"
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

export default {
  nane: "UserDashBoard",
  data: function() {
    return {
      showRecordModal: false,
      textToRecord: ""
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
    }
  },
  components: {
    RecordModal,
    AudioPlayer
  }
};
</script>