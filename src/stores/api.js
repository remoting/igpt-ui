import { reactive } from "vue";
import { invoke } from "@tauri-apps/api/core";

const api = reactive({
    _isInit: false,
    _err: "",
    _init: function (cb) {
        if (this._isInit == false) {
            invoke("get_command_registry").then((resp) => {
                this._parsing(resp)
                if (cb != null) {
                    cb(this)
                }
            }).catch((err) => {
                this._err = err
                if (cb != null) {
                    cb(this)
                }
            })
        }
        return this;
    },
    _prefix: "app_lib/controller/",
    _parsing: function (resp) {
        resp.forEach(_path => {
            const path = _path.replace(this._prefix, "");
            const parts = path.split('/');
            let current = this;
            parts.forEach((part, index) => {
                if (!current[part]) {
                    current[part] = index === parts.length - 1 ? (args) => this._call(path, args) : {};
                }
                current = current[part];
            });
        });
        this._isInit = true
    },
    _call: function (name, _args) {
        _args = _args || {}
        return invoke("invoke_dynamic_command", {
            name: this._prefix + name,
            args: _args,
        });
    }
})

export default (cb) => api._init(cb)