import Vue from "vue";
import VueRouter from "vue-router";

import { notificationBus } from "../main";
const axios = require("axios");

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home.vue"),
    meta: {
      shownName: "Inicio"
    }
  },
  {
    path: '/support',
    name: 'SuppoRT',
    meta: {
      shownName: 'Soporte'
    },
    beforeEnter: function(to, from, next) {
      window.open(window['URL_SUPPORT'], '_blank');
      if (!from.name) {
        router.push('/');
      }
    }
  },
  {
    path: "/join",
    name: "Join",
    component: () => import("../views/Join.vue"),
    meta: {
      guest: true,
      shownName: "Unirse"
    }
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
    meta: {
      guest: true,
      shownName: "Iniciar sesión"
    }
  },
  {
    path: "/userdashboard",
    name: "UserDashBoard",
    component: () => import("../views/UserDashBoard.vue"),
    meta: {
      requiresAuth: true,
      shownName: "Grabaciones"
    }
  }, {
    path: "/logout",
    mane: "Logout",
    meta: {
      requiresAuth: true,
      shownName: "Cerrar sesión"
    },
    beforeEnter: async function (to, from, next) {
      try {
        let response = await axios({
          method: "post",
          url: `${window["URL_API"]}/logout`,
          headers: {
            Authorization: `Bearer ${localStorage.token}`
          }
        });
        notificationBus.$emit("SUCCESS", response.data.message);
      } catch (error) {
        if (error.response) {
          if (error.response.status >= 500) {
            notificationBus.$emit("ERROR", error.response.data.message);
          } else {
            notificationBus.$emit("WARNING", error.response.data.message);
          }
        } else {
          notificationBus.$emit("ERROR", "Algo ha salido mal.");
        }
      }

      localStorage.removeItem("token");
      localStorage.removeItem("email");
      router.go("login");
    }
  },
  {
    path: "*",
    beforeEnter: function (to, from, next) {
      next({
        name: 'Home'
      });
      if (!from.matched.some(r => from.path == r.path)) {
        setTimeout(() => {
          notificationBus.$emit("WARNING", "Sitio no encontrado.");
        }, 0);
      }
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(r => r.meta.requiresAuth)) {
    if (!localStorage.token) {
      return next({
        name: "Login"
      });
    }
  }

  if (to.matched.some(r => r.meta.guest)) {
    if (localStorage.token) {
      return next({
        name: "UserDashBoard"
      });
    }
  }

  next()
});

export default router;
