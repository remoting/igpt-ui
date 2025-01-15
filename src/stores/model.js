import { reactive } from "vue";
import sqlite from "@/utils/sqlite.js";
const provider = [
    { name: "openai", title: "OpenAI" },
    { name: "gemini", title: "Google Gemini" },
    { name: "claude", title: "Anthropic Claude" },
    { name: "azure", title: "Microsoft Azure" },
]
const useModel = reactive({
    list: [],
    init: function (cb) {
        sqlite.query("select * from model")
            .then((rows) => {
                this.list = rows;
                cb != null && cb();
            })
            .catch((e) => {
                cb != null && cb(e)
            });
    },
    getById: function (id) {
        for (let i = 0; i < this.list.length; i++) {
            const element = this.list[i];
            if (element.id == id) {
                return element;
            }
        }
        return null;
    },
    default: function () {
        for (let i = 0; i < this.list.length; i++) {
            const element = this.list[i];
            if (element.default == 1) {
                return element.id;
            }
        }
        if (this.list.length > 0) {
            return this.list[0].id;
        }
        return null;
    },
    providerName: function (item) {
        if (item == null) {
            return "";
        }
        for (let i = 0; i < provider.length; i++) {
            if (provider[i].name == item) {
                return provider[i].title;
            }
        }
        return item.name;
    },
    provider: () => {
        return provider;
    }
})
export default () => useModel