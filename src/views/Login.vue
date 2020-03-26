<template>
  <div class="login d-flex justify-center">
    <v-row align="center" justify="center">
      <v-col cols="11" sm="6" md="4" lg="3">
        <v-card class="px-6 py-5 elevation'0">
          <h1 class="dark-text text-center header font-weight-light">Iniciar sesión</h1>
          <v-text-field
            v-model="email"
            :rules="[rules.required, rules.counter, rules.email]"
            label="Correo electrónico"
            full-width
          ></v-text-field>
          <v-text-field
            v-model="password"
            :rules="[rules.required, rules.min, rules.counter]"
            label="Contraseña"
            type="password"
            full-width
          ></v-text-field>
          <v-row justify="center" class="mt-3">
            <v-btn color="blue-dark" dark rounded to="/userdashboard">Ingresar</v-btn>
            <v-btn class="ml-2" rounded text to="/join">Registrarse</v-btn>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "Join",
  data: function() {
    return {
      email: "",
      password: "",
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
        }
      }
    };
  }
};
</script>

<style lang="scss" scoped>
.login {
  height: 100%;
}
</style>