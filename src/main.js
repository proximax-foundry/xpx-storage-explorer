import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router";
import filters from "@/filters";
import helpers from "@/helpers";

const app = createApp(App);

app.config.globalProperties.$filters = filters;
app.config.globalProperties.$helpers = helpers;
app.use(router).mount("#app");
