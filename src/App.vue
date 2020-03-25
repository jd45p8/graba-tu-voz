<template>
  <v-app>
    <v-app-bar app color="white">
      <div class="d-flex align-center">
        <v-img
          alt="Graba tu voz - logo"
          class="shrink mr-2"
          contain
          src="./assets/logo-colorfull.png"
          transition="scale-transition"
          width="30"
        />
        <h1 class="dark-text display-1 hidden-sm-and-down">raba tu voz</h1>
      </div>

      <v-spacer></v-spacer>

      <v-btn href="https://github.com/vuetifyjs/vuetify/releases/latest" target="_blank" text>
        <span class="mr-2">Iniciar sesión</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content class="my-4">
      <router-view></router-view>
    </v-content>
    <v-footer color="white" class="justify-center">
      <p>Desarrollado por José Polo <a href="https://www.github.com/jd45p8">@jd45p8</a></p>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "App"
};
</script>

<style lang="scss">
$color-blue-dark: #4f81c7ff;
$color-blue-light: #00a8b5ff;
$color-green-light: #2bb883ff;
$color-dark: #333333ff;

.dark-text {
  color: $color-dark;
}

.blue-dark-text {
  color: $color-blue-dark;
}

.blue-light-text {
  color: $color-blue-light;
}

.green-light-text {
  color: $color-green-light;
}

.dark {
  background-color: $color-dark !important;
}

.blue-dark {
  background-color: $color-blue-dark !important;
}

.blue-light {
  background-color: $color-blue-light !important;
}

.green-light {
  background-color: $color-green-light !important;
}
</style>
