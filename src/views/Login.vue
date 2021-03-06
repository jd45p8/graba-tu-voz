<template>
  <v-col class="login d-flex justify-center">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="6" md="4" lg="3">
        <v-card outlined :loading="logginIn">
          <template slot="progress">
            <v-progress-linear indeterminate color="primary"></v-progress-linear>
          </template>
          <div class="mx-6 my-7">
            <h1 class="dark-text text-center header font-weight-light mb-7">Iniciar sesión</h1>
            <v-text-field
              v-model="email"
              :rules="[rules.required, rules.counter, rules.email]"
              label="Correo electrónico"
              type="email"
              outlined
            ></v-text-field>
            <v-text-field
              v-model="password"
              :rules="[rules.required, rules.min, rules.counter]"
              label="Contraseña"
              type="password"
              outlined
            ></v-text-field>
            <v-row justify="center" class="mt-3">
              <v-btn class="primary--text" text to="/join">Registrarse</v-btn>
              <v-btn
                color="primary"
                class="ml-2"
                :dark="!logginIn"
                depressed
                @click="login"
                :disabled="logginIn"
              >Ingresar</v-btn>
            </v-row>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
const axios = require("axios");
import { notificationBus } from "../main";

export default {
  name: "Join",
  data: function() {
    return {
      email: "",
      password: "",
      logginIn: false,
      rules: {
        required: value => !!value || "Requerido",
        counter: value => {
          return value.length <= 50 || "Maximo 50 caracteres";
        },
        email: value => {
          const pattern = /^[\w-\.]{5,30}@uninorte.edu.co$/;
          return pattern.test(value) || "Correo inválido";
        },
        min: value => {
          return value.length >= 8 || "8 caracteres mínimo";
        }
      }
    };
  },
  methods: {
    verifyEmail: function() {
      let email = this.email;
      return (
        this.rules.counter(email) === true && this.rules.email(email) === true
      );
    },
    verifyPassword: function() {
      let password = this.password;
      return (
        this.rules.min(password) === true &&
        this.rules.counter(password) === true
      );
    },
    login: async function() {
      const rules = this.rules;
      if (!this.verifyEmail() || !this.verifyPassword()) {
        return notificationBus.$emit("WARNING", "Verifique sus credenciales.");
      }
      this.logginIn = true;
      try {
        let response = await axios.post(`${window["URL_API"]}/login`, {
          email: this.email,
          password: this.password
        });
        localStorage.token = response.data.token;
        localStorage.email = this.email;
        localStorage.admin = this.admin;
        this.$emit("UPDATENAV");
        this.$router.push("userdashboard");
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
      this.logginIn = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.login {
  height: 100%;
}
</style>