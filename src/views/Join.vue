<template>
  <v-col class="join">
    <h1 class="dark-text text-center header font-weight-light">Formulario de registro</h1>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="5">
        <v-stepper depressed v-model="step" vertical>
          <v-stepper-step :complete="step > 1" color="blue-dark" step="1">Credenciales</v-stepper-step>
          <v-stepper-content step="1">
            <div class="mb-2 pt-1">
              <v-text-field
                v-model="form.email"
                :rules="[rules.required, rules.counter, rules.email]"
                label="Correo electrónico"
                type="email"
                outlined
              ></v-text-field>
              <v-text-field
                v-model="form.password"
                :rules="[rules.required, rules.min, rules.counter]"
                label="Contraseña"
                type="password"
                outlined
              ></v-text-field>
              <v-text-field
                v-model="password2"
                :rules="[rules.required, rules.passwordMatch, rules.counter]"
                label="Repetir contraseña"
                type="password"
                outlined
              ></v-text-field>
            </div>
            <v-btn @click="nextStep" color="blue-dark" class="mb-1" depressed dark>Continuar</v-btn>
          </v-stepper-content>

          <v-stepper-step :complete="step > 2" step="2">Participar en demostración</v-stepper-step>

          <v-stepper-content step="2">
            <div class="mb-2">
              <v-switch
                v-model="form.contact"
                class="mx-3"
                inset
                label="¿Estaría dispuesto a participar en una demostración de los proyectos que se desarrollen a partir de este conjunto de datos?"
              ></v-switch>
              <v-text-field
                v-if="form.contact"
                v-model="form.country"
                type="country"
                :rules="[rules.required]"
                label="País"
                outlined
              ></v-text-field>
              <v-text-field
                v-if="form.contact"
                v-model="form.state"
                type="state"
                :rules="[rules.required]"
                label="Estado"
                outlined
              ></v-text-field>
              <v-text-field
                v-if="form.contact"
                v-model="form.province"
                type="province"
                :rules="[rules.required]"
                label="Provincia"
                outlined
              ></v-text-field>
            </div>
            <v-btn @click="nextStep" color="blue-dark" class="mb-1" depressed dark>Continuar</v-btn>
            <v-btn @click="step = 1" class="ml-2" text>Anterior</v-btn>
          </v-stepper-content>
          <v-stepper-step :complete="step > 2" step="3">Política de datos</v-stepper-step>

          <v-stepper-content step="3">
            <div class="mb-5">
              <p>Presionando el botón aceptar a continuación finalizará su registro y acepta que usemos la infomración que suministre en esta plataforma para entrenar el o los modelos que sean necesarios, y únicamente intentaremos contactarlo si seleccionó que desea participar en la demostración.</p>
            </div>
            <v-btn @click="nextStep" color="blue-dark" class="mb-1" depressed dark>Aceptar</v-btn>
            <v-btn @click="step = 2" class="ml-2" text>Anterior</v-btn>
          </v-stepper-content>
        </v-stepper>
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
      form: {
        email: "",
        password: "",
        country: "",
        state: "",
        province: "",
        contact: false
      },
      password2: "",
      step: 1,
      rules: {
        required: value => !!value || "Requerido",
        counter: value => {
          return value.length <= 50 || "Maximo 50 caracteres";
        },
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Correo inválido";
        },
        min: value => {
          return value.length >= 8 || "8 caracteres mínimo";
        },
        passwordMatch: value =>
          value == this.form.password || "Las contraseñas no coinciden"
      }
    };
  },
  methods: {
    verifyEmail: function() {
      let email = this.form.email;
      return (
        this.rules.counter(email) === true && this.rules.email(email) === true
      );
    },
    verifyPassword: function() {
      let password = this.form.password;
      return (
        this.rules.min(password) === true &&
        this.rules.counter(password) === true
      );
    },
    verifyContactInformacion() {
      return (
        !this.form.contact ||
        (this.form.country.length > 0 &&
          this.form.state.length > 0 &&
          this.form.province.length > 0)
      );
    },
    nextStep: async function() {
      switch (this.step) {
        case 1:
          let match = this.rules.passwordMatch(this.password2) === true;
          if (this.verifyEmail() && this.verifyPassword() && match) {
            return (this.step += 1);
          }
          notificationBus.$emit("WARNING", "Debes llenar todos los campos.");
          break;

        case 2:
          if (this.verifyContactInformacion()) {
            return (this.step += 1);
          }
          notificationBus.$emit("WARNING", "Debes llenar todos los campos.");
          break;

        default:
          try {
            let form = this.form;
            if (!this.form.contact) {
              form = {
                email: form.email,
                password: form.password,
                contact: form.contact
              };
            }

            let response = await axios.post(`${window["URL_API"]}/user`, form);
            notificationBus.$emit("SUCCESS", response.data.message);
            this.$router.push("login");
          } catch (error) {
            if (error.response.status >= 500) {
              notificationBus.$emit("ERROR", error.response.data.message);
            } else {
              notificationBus.$emit("WARNING", error.response.data.message);
            }
          }
      }
    }
  }
};
</script>
