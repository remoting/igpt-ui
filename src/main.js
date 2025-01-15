import { createApp, h, resolveComponent } from "vue";
import vant from "vant";
import application from './app.vue';
import router from "./router.js"
import useApi from "@/stores/api.js";

const startApp = () => {
    //const app = createApp(application);
    const app = createApp({
        render: () => {
            return h(resolveComponent("router-view"));
        },
    });
    // Object.keys(ElementPlusIconsVue).forEach(function (key) {
    //     app.component("el-icon-" + ElementPlusIconsVue[key].name, ElementPlusIconsVue[key]);
    // }); 
    app.use(vant)
    app.use(router()).mount('#app')
    window.document.getElementById("preloader").style.display = "none"
}
//startApp();
// useApi((_api) => {
//     if (_api._isInit == false) {
//         let obj = window.document.getElementById("preloader").querySelector(".jumper");
//         obj.style.color = "red"
//         obj.innerHTML = _api._err
//     } else {
//         startApp();
//     }
// });

window.document.addEventListener("DOMContentLoaded", () => {
    console.log("D", window.__LY_SDK__)
})