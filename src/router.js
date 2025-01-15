import { createRouter, createWebHistory, createWebHashHistory } from "vue-router";
import routers from "./pages/routers.js";
import useUser from "./stores/user.js";
const config = {
    login: "/login",
    anonymousPath: [
        /^\/$/,
        /^\/login(.)*/,
        /^\/logout(.)*/,
        /^\/reload(.)*/,
        /^\/top(.)*/,
        /^\/403(.)*/,
        /^\/404(.)*/,
        /^\/reg(.)*/,
        /^\/forget(.)*/,
    ]
}
const toLoginPage = (to, next) => {
    next({
        path: config.login,
    });
};
const Auth = (router) => {
    router.beforeEach((to, from, next) => {
        let user = useUser();
        if (user == null || user.token == null || user.token == "") {
            let isAnonymouPath = false;
            for (let i = 0; i < config.anonymousPath.length; i++) {
                if (config.anonymousPath[i].test(to.path)) {
                    isAnonymouPath = true;
                    break;
                }
            }
            if (isAnonymouPath) {
                next();
            } else {
                user.info(function (isOk, data) {
                    if (isOk) {
                        next()
                    } else {
                        toLoginPage(to, next);
                    }
                })
            }
        } else {
            next();
        }
    });
    router.afterEach(() => { });
    return router
}
const initRouter = () => {
    return createRouter({
        history: createWebHashHistory(),
        routes: [
            ...routers(),
            {
                path: "/:pathMatch(.*)*",
                redirect: to => {
                    return { path: '/404', query: { q: to.params.searchText } }
                },
            }
        ],
    })
}
export default function () {
    return Auth(initRouter());
}