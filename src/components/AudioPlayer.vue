<template>
  <div class="audioplayer">
    <v-slider
      v-model="sliderPosition"
      hide-details
      class="align-center blue-dark-text"
      track-color="gray"
      color="blue-dark"
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
export default {
  name: "AudioPlayer",
  data: function() {
    return {
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      textTime: "0:00",
      sliderPosition: 0,
      maxSlider: 1000,
      player: document.createElement('audio'),
      loading: false
    };
  },
  props: {
    src: {
      required: true,
      type: String
    }
  },
  methods: {
    togglePlay: function() {
      if (this.isPlaying) {
        this.player.pause();
      } else {
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
      }else{
        this.textTime = "0:00 / 0:00"
      }
    }
  },
  watch: {
    currentTime: function() {
      this.updateTextTime();
    },
    duration: function() {
      this.updateTextTime();
    },
    src: async function() {
      // Actualiza la duración de la grabación
      this.loading = true;
      this.player.src = this.src;
      let tempPlayer = document.createElement('audio');
      tempPlayer.preload = 'auto';
      tempPlayer.muted = true;
      tempPlayer.src = this.src;
      tempPlayer.muted = true;
      tempPlayer.ondurationchange = e =>{
        if (tempPlayer.duration != Infinity) {
          tempPlayer.ondurationchange = null;
          tempPlayer.pause();
          this.duration = tempPlayer.duration;
          this.loading = false;
          return;
        }
      }
      tempPlayer.play();
    }
  },
  mounted: function() {
    this.player.volume = 1;
    this.player.preload = 'auto';
    this.duration = this.player.duration;

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
}
</script>