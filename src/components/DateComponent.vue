<template>
  <v-dialog v-model="openModal" persistent max-width="400px">
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="tempDate"
        :label="label"
        outlined
        v-on="on"
        @input="updateDate"
        readonly
        class="pt-1"
      ></v-text-field>
    </template>
    <v-date-picker v-model="tempDate" locale="ES" :min="min" :max="max"  show-current="false" scrollable full-width>
      <v-spacer></v-spacer>
      <v-btn class="dark-text" text @click="openModal = false">Cancelar</v-btn>
      <v-btn @click="returnDate" class="ml-2" color="primary" depressed>Aceptar</v-btn>
    </v-date-picker>
  </v-dialog>
</template>

<script>
export default {
  name: "DateComponent",
  data: function() {
    return {
      openModal: false, 
      tempDate: this.date
    }
  },
  methods: {
    returnDate: function() {
      this.updateDate();
      this.openModal = false;
    },
    updateDate: function() {
      this.$emit("update:date", this.tempDate);
    }
  },
  props: {
    date: {
      type: String,
      required: true
    },
    label: {
      type: String
    },
    min: {
      type: String
    },
    max: {
      type: String
    }
  }
}
</script>