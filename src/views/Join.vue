<template>
  <v-col class="join">
    <h1 class="dark-text text-center header font-weight-light">Formulario de registro</h1>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="5">
        <v-stepper class="elevation-0" v-model="step" vertical>
          <v-stepper-step :complete="step > 1" color="blue-dark" step="1">Credenciales</v-stepper-step>
          <v-stepper-content step="1">
            <div class="mb-5">
              <v-text-field
                v-model="email"
                :rules="[rules.required, rules.counter, rules.email]"
                label="Correo electrónico"
              ></v-text-field>
              <v-text-field
                v-model="password"
                :rules="[rules.required, rules.min, rules.counter]"
                label="Contraseña"
                type="password"
              ></v-text-field>
              <v-text-field
                v-model="password2"
                :rules="[rules.required, rules.passwordMatch, rules.counter]"
                label="Repetir contraseña"
                type="password"
              ></v-text-field>
            </div>
            <v-btn @click="step = 2" color="blue-dark" class="mb-1" dark rounded>Continuar</v-btn>
          </v-stepper-content>

          <v-stepper-step :complete="step > 2" step="2">Participar en demostración</v-stepper-step>

          <v-stepper-content step="2">
            <div class="mb-5">
              <v-switch
                v-model="demo"
                class="mx-3"
                inset
                hide-details
                label="¿Estaría dispuesto a participar en una demostración de los proyectos que se desarrollen a partir de este conjunto de datos?"
              ></v-switch>
              <v-text-field
                v-if="demo"
                v-model="country"
                type="country"
                :rules="[rules.required]"
                label="País"
              ></v-text-field>
              <v-text-field
                v-if="demo"
                v-model="state"
                type="state"
                :rules="[rules.required]"
                label="Estado"
              ></v-text-field>
              <v-text-field
                v-if="demo"
                v-model="province"
                type="province"
                :rules="[rules.required]"
                label="Provincia"
              ></v-text-field>
            </div>
            <v-btn @click="step = 3" color="blue-dark" class="mb-1" dark rounded>Continuar</v-btn>
            <v-btn @click="step = 1" class="ml-2" text rounded>Anterior</v-btn>
          </v-stepper-content>
          <v-stepper-step :complete="step > 2" step="3">Política de datos</v-stepper-step>

          <v-stepper-content step="3">
            <div class="mb-5">
              <p>Usaremos su información para entrenar el o los modelos que sean necesarios y únicamente intentaremos contactarlo si seleccionó que desea participar en la demostración.</p>
            </div>
            <v-btn @click="step = 1" color="blue-dark" class="mb-1" dark rounded>Finalizar</v-btn>
            <v-btn @click="step = 2" class="ml-2" text rounded>Anterior</v-btn>
          </v-stepper-content>
        </v-stepper>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
export default {
  name: "Join",
  data: function() {
    return {
      username: "",
      email: "",
      password: "",
      password2: "",
      country: "",
      state: "",
      province: "",
      demo: false,
      step: 1,
      rules: {
        required: value => !!value || "Requerido",
        counter: value => {
          if (value == undefined) {
            return true;
          }
          return value.length <= 50 || "Maximo 50 caracteres";
        },
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Correo inválido";
        },
        min: value => {
          if (value == undefined) {
            return true;
          }
          return value.length >= 8 || "8 caracteres mínimo";
        },
        passwordMatch: value =>
          value == this.password || "Las contraseñas no coinciden"
      }
    };
  }
};
</script>
