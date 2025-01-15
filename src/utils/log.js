import { reactive } from "vue";
import { invoke } from "@tauri-apps/api/core";
const log = reactive({
    info: function (..._params) {
        return invoke("log4rs_info", {
            params: _params == null || _params.length <= 0 ? [] : _params,
        });
    },
    warn: function (..._params) {
        return invoke("log4rs_warn", {
            params: _params == null || _params.length <= 0 ? [] : _params,
        });
    },
});

export default log;
