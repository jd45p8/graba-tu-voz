<template>
  <div ref="notifications" class="notifications">
    <v-snackbar
      v-for="m in messages"
      :key="messages.indexOf(m)"
      v-model="m.show"
      :timeout="m.timeout"
      color="dark"
    >{{m.text}}
    <v-btn @click="m.show = false" fab text small dark>
      <v-icon :color="m.color">mdi-close</v-icon>
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
  mounted() {
    notificationBus.$on("ERROR", e => {
      let message = {
        show: true,
        text: e,
        timeout: 3000,
        color: 'error'
      };
      this.messages.push(message);
      setTimeout(() => {
        this.messages.splice(this.messages.indexOf(message), 1);
      }, 3000);
    });

    notificationBus.$on("WARNING", w => {
      let message = {
        show: true,
        text: w,
        timeout: 3000,
        color: 'warning'
      };
      this.messages.push(message);
      setTimeout(() => {
        this.messages.splice(this.messages.indexOf(message), 1);
      }, 3000);
    });

    notificationBus.$on("SUCCESS", w => {
      let message = {
        show: true,
        text: w,
        timeout: 3000,
        color: 'success'
      };
      this.messages.push(message);
      setTimeout(() => {
        this.messages.splice(this.messages.indexOf(message), 1);
      }, 3000);
    });

  }
};
</script>