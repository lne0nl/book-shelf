import { createApp } from "vue";
import { createPinia } from "pinia";
import VueLazyLoad from "@jambonn/vue-lazyload";

import App from "./App.vue";

const app = createApp(App);

app.use(createPinia());
app.use(VueLazyLoad);

app.mount("#app");
