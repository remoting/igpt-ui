import { reactive } from "vue";
// import http from "@/utils/http.js"
const useUser = reactive({
    id: "",
    name: "",
    email: "",
    token: "",
    menus: [],
    tenantId: "",
    tenants: [],
    logout: function () {
        this.id = ""
        this.name = ""
        this.token = ""
        this.email = ""
        this.tenantId = ""
        this.menus = []
        this.tenants = []
    }, 
    info(cb) {
        // http.post('/api/user/info').then((res) => {
        //     var self = {}
        //     if (res.data.code === 0) {
        //         this.id = res.data.data.id
        //         this.email = res.data.data.email
        //         this.name = res.data.data.name
        //         this.token = res.data.token
        //         this.tenants = res.data.data.tenants
        //         this.menus = res.data.data.menus
        //         this.tenantId = res.data.data.tenantId
        //         cb(true, self)
        //     } else {
        //         cb(false, res.data.message)
        //     }
        // }).catch((err) => {
        //     cb(false, err)
        // })

        this.id = "admin"
        this.email = "admin@admin.com"
        this.name = "admin"
        this.token = "admin"
        cb(true, self)
        //cb(false, err)
    }
})
export default function () {
    return useUser
}