<template>
  <v-col class="settings mt-n5">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="p-1" :loading="updatingPin" outlined>
          <v-card-title class="headline">PIN</v-card-title>
          <v-card-text class="py-0">
            <p
              class="subtitle-1"
            >Código númerico de 4 dígitos que se usará para identificarse por voz en el sistema</p>
            <v-text-field
              :rules="[rules.required, rules.isValid]"
              v-model="pin"
              label="PIN"
              type="password"
              outlined
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              class="dark-text"
              :disabled="pinStatus == 'disabled' || updatingPin"
              text
              @click="disablePin"
            >Desactivar</v-btn>
            <v-btn
              depressed
              class="primary mr-2"
              @click="sendPin"
              :disabled="updatingPin"
              :dark="!updatingPin"
            >{{pinStatus != "enabled" ? "Activar": "Actualizar"}}</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
const axios = require("axios");
import { notificationBus } from "../main";

export default {
  name: "Settings",
  data: function () {
    return {
      pin: "",
      pinStatus: "disabled",
      updatingPin: false,
      rules: {
        required: value => !!value || "Requerido",
        isValid: value => {
          const pattern = /^\d{4}$/;
          return pattern.test(value) || "Debe ingresar 4 dígitos"
        }
      }
    }
  },
  methods: {
    authenticationError: function(error) {
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("admin");
      this.$emit("UPDATENAV");
      this.$router.push("login");
      notificationBus.$emit("WARNING", error.response.data.message);
    },
    showError: function(error) {
      if (error.response) {
        let type = error.response.status >= 500 ? "ERROR" : "WARNING";
        if (error.response.status != 401) {
          return notificationBus.$emit(type, error.response.data.message);
        }
        this.authenticationError(error);
      } else {
        notificationBus.$emit("ERROR", "Algo ha salido mal.");
      }
    },
    sendPin: async function() {
      this.updatingPin = true;
      if (this.rules.isValid(this.pin) === true) {     
        try{
          let response = await axios({
            method: "post",
            url: `${window["URL_API"]}/pin/enable`,
            data: {
              pin: this.pin
            },
            headers: {
              Authorization: `Bearer ${localStorage.token}`
            }
          });
          if (response.status == 200) {
            notificationBus.$emit("SUCCESS", response.data.message);
            this.pinStatus = "enabled";
          } else {
            notificationBus.$emit("SUCCESS", response.data.message);
          }         
        } catch (error) {
          this.showError(error);
        }
      } else {
        notificationBus.$emit("WARNING", "El PIN no es válido.")
      }
      this.updatingPin = false;
    },
    disablePin: async function() {    
      this.updatingPin = true;
      try{
        let response = await axios({
          method: "post",
          url: `${window["URL_API"]}/pin/disable`,
          data: {
            pin: this.pin
          },
          headers: {
            Authorization: `Bearer ${localStorage.token}`
          }
        });
        if (response.status == 200) {
          notificationBus.$emit("SUCCESS", response.data.message);
          this.pinStatus = "disabled";
        } else {
          notificationBus.$emit("SUCCESS", response.data.message);
        }         
      } catch (error) {
        this.showError(error);
      }
      this.updatingPin = false;
    },
    retrieveStatus: async function() {
      this.updatingPin = true;
      try{
        let response = await axios({
          method: "get",
          url: `${window["URL_API"]}/pin/status`,
          headers: {
            Authorization: `Bearer ${localStorage.token}`
          }
        });

        this.pinStatus = response.data.status;
      } catch (error) {
        this.showError(error);
      }

      this.updatingPin = false;
    }
  },
  mounted: function() {
    this.retrieveStatus();
  }
}
</script>
