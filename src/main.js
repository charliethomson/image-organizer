import { createApp } from "vue";

import routes from "./routes";
import App from "./app.vue";

import "./plugins/configure-ynetwork";

import "vue-global-api/ref";
import "vue-global-api/reactive";
import "vue-global-api/computed";
import "vue-global-api/watch";
import "vue-global-api/watchEffect";
import { key, store } from "./store";

const app = createApp(App);

app.use(routes);
app.use(store, key);

app.mount("#app");
