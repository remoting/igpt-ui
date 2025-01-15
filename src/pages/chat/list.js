import { reactive } from "vue";
import sqlite from "@/utils/sqlite.js";
import global from "@/utils/global.js";
import log from "@/utils/log.js";
import useSession from "./session";
const session = useSession();
const useList = reactive({
    list: [],
    load: function (cb) {
        sqlite
            .query(
                "select s.*,(select count(id) from message where sid=s.id) as count from session s"
            )
            .then((rows) => {
                this.list = rows;
                cb != null && cb();
            })
            .catch((e) => {
                cb != null && cb()
            });
    },
    deleteItem: function (id, cb) {
        sqlite
            .exec("delete from message where sid=?", id)
            .then(() => {
                sqlite.exec("delete from session where id=?", id).then(() => {
                    this.load(cb);
                });
            })
            .catch((e) => {
                console.error(e);
            });
    },
    newItem: function (params, cb) {
        let subject = "新的会话";
        global.loadingOn();
        let create_time = global.fmtTime();
        sqlite
            .exec(
                "insert into session(subject,model,create_time) values(?,?,?)",
                subject,
                params.model,
                create_time
            )
            .then((rel) => {
                this.load(() => {
                    session.start(rel.rowid, () => {
                        if (cb != null) {
                            cb(null);
                        }
                    });
                });
            })
            .catch((e) => {
                log.info("创建会话失败", e);
                global.loadingOff();
                if (cb != null) {
                    cb(e);
                }
            });
    },
    subject: function (id, subject) {
        let i = this.list.findIndex((v) => v.id === id)
        this.list[i].subject = subject
    }
});
export default () => useList;
