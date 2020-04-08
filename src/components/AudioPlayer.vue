<template>
  <div class="audioplayer">
    <v-slider
      v-model="sliderPosition"
      hide-details
      class="align-center"
      track-color="gray"
      :max="maxSlider"
      @change="updatePlayerCurrentTime"
      @start="player.pause()"
    >
      <template v-slot:prepend>
        <v-btn @click="togglePlay" color="grey darken-1" fab small text :loading="loading">
          <v-icon>{{isPlaying ? 'mdi-pause' : 'mdi-play'}}</v-icon>
        </v-btn>
      </template>
      <template v-slot:append>
        <h1 class="dark-text subtitle-2 font-weight-regular" style="width: max-content">{{textTime}}</h1>
      </template>
    </v-slider>
  </div>
</template>

<script>
import { notificationBus } from "../main";
const axios = require("axios");

export default {
  name: "AudioPlayer",
  data: function() {
    return {
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      textTime: "0:00",
      downloaded: false,
      sliderPosition: 0,
      maxSlider: 1000,
      player: document.createElement("audio"),
      loading: false
    };
  },
  props: {
    src: {
      required: true,
      type: String
    },
    auth: {
      type: Boolean,
      default: false
    },
    metaDuration: {
      type: Number
    }
  },
  methods: {
    togglePlay: async function() {
      if (this.isPlaying) {
        this.player.pause();
      } else {
        if (this.auth && !this.downloaded) {
          await this.getAudioWithAuth();
        }
        this.player.play();
      }
    },
    updatePlayerCurrentTime: function() {
      this.player.currentTime =
        (this.sliderPosition / this.maxSlider) * this.duration;
    },
    updateTextTime: function() {
      let currentMin = Math.floor(this.currentTime / 60);
      let currentSeg = Math.floor(this.currentTime % 60);
      let current = `${currentMin}:${
        currentSeg > 9 ? currentSeg : `0${currentSeg}`
      }`;

      let maxMin = Math.floor(this.duration / 60);
      let maxSeg = Math.floor(this.duration % 60);
      let max = `${maxMin}:${maxSeg > 9 ? maxSeg : `0${maxSeg}`}`;

      if (this.duration > 0 && this.duration != Infinity) {
        this.sliderPosition =
          this.maxSlider * (this.currentTime / this.duration);
        this.textTime = `${current} / ${max}`;
      } else {
        this.textTime = "0:00 / 0:00";
      }
    },
    getAudioWithAuth: async function() {
      this.loading = true;
      try {
        let response = await axios({
          method: "get",
          url: this.src,
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${localStorage.token}`
          }
        });
        this.player.src = URL.createObjectURL(response.data);
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
      this.downloaded = true;
      this.loading = false;
    }
  },
  watch: {
    currentTime: function() {
      this.updateTextTime();
    },
    duration: function() {
      this.updateTextTime();
    },
    src: function() {
      if (this.metaDuration) {
        this.duration = this.metaDuration;
      }

      if (!this.auth) {
        this.player.src = this.src;
        this.downloaded = true;
      } else {
        this.downloaded = false;
      }
    }
  },
  mounted: function() {
    this.player.volume = 1;
    this.player.preload = "auto";
    if (!this.auth) {
      this.player.src = this.src;
    }

    if (this.metaDuration) {
      this.duration = this.metaDuration;
    }

    this.player.onplay = e => {
      this.isPlaying = true;
    };

    this.player.onended = e => {
      this.isPlaying = false;
    };

    this.player.onpause = e => {
      this.isPlaying = false;
    };

    this.player.ontimeupdate = e => {
      this.currentTime = this.player.currentTime;
    };

    this.player.ondurationchange = e => {
      this.duration = this.player.duration;
    };
  }
};
</script>