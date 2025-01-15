import frame from "./frame/routers.js";
import MobileHome from "./mobile/home.vue";
import MobileLayout from "./pc/layout.vue";
import PcHome from "./pc/home.vue";
import PcLayout from "./pc/layout.vue";
import PcSetting from "./pc/setting.vue";
import setting from "./setting/setting.vue";
import model from "./setting/model.vue";
import New from "./chat/new.vue";
const routers = [
  {
    path: "/pc",
    component: PcLayout,
    children: [
      {
        path: "home",
        component: PcHome,
      },
      {
        path: "new",
        component: New,
      },
      {
        path: "setting",
        component: PcSetting,
        children: [
          {
            path: "home",
            component: setting
          },
          {
            path: "model",
            component: model,
          }
        ]
      }
    ],
  },
  {
    path: "/mobile",
    component: MobileLayout,
    children: [
      {
        path: "home",
        component: MobileHome,
      },
    ],
  },
];

export default function () {
  return [...frame, ...routers];
}
