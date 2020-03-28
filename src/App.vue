<template>
  <v-app>
    <v-app-bar app dense hide-on-scroll elevation="3" color="white">
      <v-app-bar-nav-icon v-on:click="toggleMobileNav" class="d-flex d-md-none dark-text"></v-app-bar-nav-icon>
      <h1 class="title dark-text">Graba tu voz</h1>

      <v-spacer></v-spacer>

      <div class="align-center d-none d-md-flex">
        <router-link
          v-for="link in links"
          :key="links.indexOf(link)"
          class="dark-link mx-2"
          :to="link.route"
        >{{ link.name }}</router-link>
      </div>
    </v-app-bar>

    <v-navigation-drawer app v-model="mobileNavOpened" temporary>
      <v-list shaped>
        <v-subheader>
          <h1 class="title dark-text">Graba tu voz</h1>
        </v-subheader>
        <v-list-item-group class="blue-dark-text">
          <v-list-item v-for="link in links" :key="links.indexOf(link)" :to="link.route">
            <v-list-item-content>
              <v-list-item-title>{{link.name}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-content class="my-4">
      <router-view></router-view>
    </v-content>
    <v-footer color="white" class="justify-center">
      <p>
        Desarrollado por José Polo
        <a href="https://www.github.com/jd45p8">@jd45p8</a>
      </p>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data: function() {
    return {
      mobileNavOpened: false,
      links: [
        {
          name: "Inicio",
          route: "/"
        },
        {
          name: "Registrarse",
          route: "/join"
        },
        {
          name: "Iniciar sesión",
          route: "/login"
        }
      ]
    };
  },
  methods: {
    toggleMobileNav: function() {
      this.mobileNavOpened = !this.mobileNavOpened;
    }
  }
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
