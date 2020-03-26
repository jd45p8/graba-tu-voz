<template>
  <v-app>
    <v-app-bar app dense hide-on-scroll="true" elevation="3" color="white">
      <v-app-bar-nav-icon color="black" class="d-flex d-md-none"></v-app-bar-nav-icon>
      <!-- <div class="align-center d-none d-md-flex">
        <v-img
          alt="Graba tu voz - logo"
          class="shrink mr-2"
          contain
          src="./assets/logo-colorfull.png"
          transition="scale-transition"
          width="22"
        />
        <h1 class="title dark-text">Graba tu voz</h1>
      </div> -->
      <h1 class="title dark-text">Graba tu voz</h1>

      <v-spacer></v-spacer>
      
      <div class="align-center d-none d-md-flex">
        <router-link class="dark-link mx-2" to="join">Registrarse</router-link>      
        <router-link class="dark-link mx-2" to="join">Iniciar sesión</router-link>
      </div>
      <!-- <v-btn outlined class="ma-1 ma-md-2">Participar</v-btn> -->
      <!-- <v-btn rounded dark class="blue-dark  ma-1 ma-sm-1 ma-md-2">Registrarse</v-btn>
      <v-btn rounded dark class="blue-light ma-1 ma-md-2">Ingresar</v-btn> -->
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
$color-dark: #000000d4;

.dark-text {
  color: $color-dark !important;
}

.blue-dark-text {
  color: $color-blue-dark !important;
}

.blue-light-text {
  color: $color-blue-light !important;
}

.green-light-text {
  color: $color-green-light !important;
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

.dark-link {
  color: $color-dark !important;
  font-weight: 400;
  text-decoration: none !important;
  &:hover {
    color: $color-blue-dark !important;
  }
}
</style>
