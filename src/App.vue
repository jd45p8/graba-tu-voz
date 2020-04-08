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
        >{{ link.shownName }}</router-link>
      </div>
    </v-app-bar>

    <v-navigation-drawer app v-model="mobileNavOpened" temporary>
      <v-list shaped>
        <v-subheader>
          <h1 class="title dark-text">Graba tu voz</h1>
        </v-subheader>
        <v-list-item-group class="primary--text">
          <v-list-item v-for="link in links" :key="links.indexOf(link)" :to="link.route">
            <v-list-item-content>
              <v-list-item-title>{{link.shownName}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <notifications></notifications>

    <v-content class="my-4">
      <router-view v-on:UPDATENAV="updateLinks"></router-view>
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
import Notifications from "./components/Notifications";

export default {
  name: "App",
  data: function() {
    return {
      mobileNavOpened: false,
      links: []
    };
  },
  methods: {
    toggleMobileNav: function() {
      this.mobileNavOpened = !this.mobileNavOpened;
    },
    updateLinks: function() {
      this.links = [];
      if (localStorage.token) {
        this.$router.options.routes.forEach(r => {
          if (r.meta && (r.meta.requiresAuth || !r.meta.guest)) {
            this.links.push({
              shownName: r.meta.shownName,
              route: r.path
            });
          }
        });
      } else {
        this.$router.options.routes.forEach(r => {
          if (r.meta && (r.meta.guest || !r.meta.requiresAuth)) {
            this.links.push({
              shownName: r.meta.shownName,
              route: r.path
            });
          }
        });
      }
    }
  },
  components: {
    Notifications
  },
  mounted() {
    this.updateLinks();
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

.dark {
  background-color: $color-dark !important;
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
