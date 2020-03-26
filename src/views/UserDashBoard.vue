.<template>
  <v-col class="userdashboard">
    <v-expansion-panels>
      <v-expansion-panel v-for="i in 10" :key="i">
        <v-expansion-panel-header>Grabación {{i-1}}</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-card v-for="i in 4" :key="i" outlined class="my-1 pa-2">Hola</v-card>
          <v-row justify="end">
            <v-btn depressed color="blue-dark" rounded dark>Hi</v-btn>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-col>
</template>

<script>
export default {
  nane: "UserDashBoard",
  data: function() {
    return {};
  }
};
</script>