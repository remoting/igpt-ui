import Index from "./index.vue";
import NotFound from "./404.vue";
import NotAuthorized from "./403.vue";
import Layout from "./layout.vue";
export default [
  {
    path: "/",
    name: "Index",
    component: Index,
  },
  {
    path: "/404",
    name: "NotFound",
    component: NotFound,
  },
  {
    path: "/403",
    name: "NotAuthorized",
    component: NotAuthorized,
  },
];
