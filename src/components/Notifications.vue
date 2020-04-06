<template>
  <div ref="notifications" class="notifications">
    <v-snackbar
      v-for="m in messages"
      :key="messages.indexOf(m)"
      v-model="m.show"
      :timeout="m.timeout"
      left
    >{{m.text}}
    <v-btn @click="m.show = false" fab text small dark>
      <v-icon >mdi-close</v-icon>
    </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { notificationBus } from "../main";

export default {
  name: "Notifications",
  data: function() {
    return {
      messages: []
    };
  },
  methods: {
    pushSnackbar: function(m) {
      let message = {
        show: true,
        text: m,
        timeout: 3000,
      };
      this.messages.unshift(message);
      setTimeout(() => {
        this.messages.splice(this.messages.indexOf(message), 1);
      }, 3000);
    }
  },
  mounted() {
    notificationBus.$on("ERROR", this.pushSnackbar);
    notificationBus.$on("WARNING", this.pushSnackbar);
    notificationBus.$on("SUCCESS", this.pushSnackbar);
  }
};
</script>