import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: '#4f81c7',
                secondary: '#00a8b5',
                success: '#2bb883',
                accent: '#5d97e8'
            }
        }
    }
});
