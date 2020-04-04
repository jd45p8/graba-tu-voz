<template>
  <div class="home">
    <v-img
      alt="Graba tu voz logo"
      src="../assets/logo-colorfull.png"
      class="align-center d-flex"
      contain
      max-height="200"
      height="50%"
    />
    <v-col>
      <!-- Fila de bienvenida -->
      <v-row justify="center" class="mx-1">
        <v-col lg="6" md="6" sm="8">
          <v-row justify="center">
            <h1 class="display-2 text-center">
              ¡Bienvenido a
              <b class="blue-dark-text">Graba </b>
              <b class="green-light-text">tu </b>
              <b class="blue-light-text">voz</b>!
            </h1>
          </v-row>
          <v-row justify="center" class="mt-6">
            <p class="font-weight-light title text-center text-md-left">
              Un proyecto para la recolección de voces en
              <b>español</b> para el entrenamiento de un modelo de reconocimiento de voz, que será implementado por estudiantes de ingeniería de sistemas en su proyecto final.
            </p>
          </v-row>
        </v-col>
      </v-row>
      <!-- Fila con el porqué deben apoyarnos -->
      <v-row justify="center" class="mx-md-4 mx-lg-8 mx-xl-12">
        <v-col cols="12" sm="6" md="4" class="flex-wrap">
          <v-card dark class="blue-dark pa-3 d-flex flex-column" height="100%">
            <div class="my-auto">
              <h1 class="display-2 text-center">Únete</h1>
              <h2 class="font-weight-light subtitle-1 mt-2">Para identificar una persona por su voz, se necesita separar las voces de distintos individuos, por lo que necesitamos tomar algunos de tus datos para participar.</h2>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="4" class="flex-wrap">
          <v-card dark class="green-light pa-3 d-flex flex-column" height="100%">
            <div class="my-auto">
              <h1 class="display-2 text-center">Graba</h1>
              <h2 class="font-weight-light subtitle-1 mt-2">Los conjuntos de datos de voz en español no son abundantes, y es aún más dificil obtenerlos separados por individuos, por eso te invitamos a grabar tu voz para apoyar nuestro proyecto.</h2>
            </div>  
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="4" class="flex-wrap">
          <v-card dark class="blue-light pa-3 d-flex flex-column" height="100%">
            <div class="my-auto">
              <h1 class="display-2 text-center">Apoya</h1>
              <h2 class="font-weight-light subtitle-1 mt-2">La realización de proyectos como este, ayudan al desarrollo de soluciones para público hispano, que permitan brindar una mejor experiencia a todos estos usuarios.</h2>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home"
};
</script>

