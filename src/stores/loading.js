import { reactive } from "vue";
const useLoading = reactive({
    status: false,
    on: function () {
        this.status = true
    },
    off: function () {
        this.status = false
    }
})
export default () => useLoading