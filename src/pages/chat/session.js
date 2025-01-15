import { reactive } from "vue";
import sqlite from "@/utils/sqlite.js";
import global from "@/utils/global.js";
import provider from "@/providers/index.js";
import useModel from "@/stores/model.js";
const model = useModel();
// {
//   model: "gemini-1.5-flash",
//   url: "http://google.lryj.com",
//   key: "AIzaSyCviQsQ9FRIt4m9zS3RDKpGWFwlD9ouNIY",
// }
const useSession = reactive({
  id: 0,
  subject: "",
  model: 0,
  messages: [],
  events: new Map(),
  pending: null,
  set: function (item, cb) {
    this.id = item.id;
    this.subject = item.subject;
    this.messages = [];
    this.model = item.model
    this.load(cb);
  },
  start: function (id, cb) {
    sqlite.query("select s.* from session s where s.id=?", id).then((rows) => {
      if (rows == null || rows.length <= 0) {
        // todo error
      } else {
        this.set(rows[0], cb);
      }
    });
  },
  reset: function () {
    this.id = 0;
    this.subject = "";
    this.messages = [];
    this.events = new Map();
    this.pending = null;
    this.model = 0;
  },
  on: function (name, cb) {
    const hasKey = this.events.has(name);
    if (!hasKey) {
      this.events.set(name, []);
    }
    this.events.get(name).push(cb);
  },
  off: function (name, cb) {
    const hasKey = this.events.has(name);
    if (!hasKey) {
      this.events.set(name, []);
    }
    const _cbs = this.events.get(name);
    let indexToRemove = _cbs.findIndex((item) => item === cb);
    if (indexToRemove !== -1) {
      _cbs.splice(indexToRemove, 1); // 删除找到的元素
    }
  },
  emit: function (name, data) {
    const hasKey = this.events.has(name);
    if (!hasKey) {
      this.events.set(name, []);
    }
    const _cbs = this.events.get(name);
    for (let i = 0; i < _cbs.length; i++) {
      try {
        _cbs[i](data);
      } catch (e) { }
    }
  },
  load: function (cb) {
    if (this.id <= 0) {
      return;
    }
    sqlite
      .query("select m.*,(select count(1) from message_b where mid=m.id) as bs from message m where m.sid=? order by m.id", this.id)
      .then((rows) => {
        this.messages = rows.map((item) => {
          item.complete = true;
          return item;
        });
        this.emit("answer", {});
        if (cb != null) {
          cb();
        }
      });
  },
  cancel: function () {
    if (this.pending != null) {
      this.pending.cancel();
    }
  },
  favorite: function (msg, cb) {
    let sql = ""
    let n = 0
    if (msg.favorite === 1) {
      sql = "update message set favorite=0 where id = ?";
      n = 0
    } else {
      sql = "update message set favorite=1 where id = ?";
      n = 1
    }
    sqlite
      .exec(sql, msg.id)
      .then((rel) => {
        let i = this.messages.findIndex((v) => v.id == msg.id)
        this.messages[i].favorite = n;
        cb != null && cb()
      })
      .catch((e) => {
        console.error(e);
      });
  },
  resend: async function (_id) {
    let rows = await sqlite.query("select * from message where id=?", _id);
    let msg = rows[0]
    await sqlite.exec("insert into message_b(mid,answer,answer_model,answer_time,prompt_tokens,completion_tokens) values(?,?,?,?,?,?)",
      msg.id, msg.answer, msg.answer_model, msg.answer_time, msg.prompt_tokens, msg.completion_tokens
    )
    await sqlite.exec("update message set answer=null,answer_model=null,answer_time=null,prompt_tokens=null,completion_tokens=null where id=?", msg.id)
    this.doSend(msg.question, msg.id)
  },
  history: async function (msg) {
    let rows = await sqlite.query("select * from message where sid=? and id < ? order by id desc limit ?", this.id, msg.id, 10)
    rows.sort((a, b) => {
      return a.id - b.id;
    });
    let _history = []
    for (let i = 0; i < rows.length; i++) {
      const element = rows[i];
      _history.push({ "role": "user", "content": element.question })
      _history.push({ "role": "assistant", "content": element.answer })
    }
    return _history;
  },
  send: async function (str) {
    let create_time = global.fmtTime();
    let rel = await sqlite.exec("insert into message(sid,question,answer,create_time,favorite) values(?,?,null,?,0)", this.id, str, create_time);
    // pending
    this.messages.push({
      id: rel.rowid,
      sid: this.id,
      complete: false,
      question: str,
      create_time: create_time,
    });
    this.emit("answer", { mid: rel.rowid });
    // 发送
    this.doSend(str, rel.rowid)
  },
  doSend: async function (str, mid) {
    const i = this.messages.findIndex((v) => v.id == mid)
    const element = this.messages[i];
    element.answer = ""
    element.complete = false
    let _model = model.getById(this.model);
    let _history = await this.history({ id: mid });
    let req = {
      prompt: str,
      model: {
        provider: _model.provider,
        config: JSON.parse(_model.config),
      },
      history: _history,
      system: "",
    };
    this.pending = provider.request(req, (result) => {
      // if (result.done) {
      //   debugger
      // }
      // console.log(result)
      if (result.err == null) {
        this.complete(mid, _model.id, result);
      } else {
        console.log("error:", result)
      }
    });
  },
  complete: function (mid, modelId, result) {
    const i = this.messages.findIndex((v) => v.id == mid)
    const element = this.messages[i];
    if (element.id == mid) {
      let oldVal = element.answer == null ? "" : element.answer;
      element.answer = oldVal + result.text;
      this.emit("answer", { mid: mid });
      if (result.done) {
        element.complete = true;
        sqlite.exec(
          "update message set answer=?,answer_model=?,answer_time=? where id=?",
          element.answer,
          modelId,
          global.fmtTime(),
          element.id
        ).then(() => {
          if (this.subject == "" || this.subject == "新的会话") {
            let _model = model.getById(this.model);
            let i = this.messages.findIndex((v) => v.id == mid)
            let msg = this.messages[i];
            let req = {
              model: {
                provider: _model.provider,
                config: JSON.parse(_model.config),
              },
              message: {
                question: msg.question,
                answer: msg.answer
              }
            }
            provider.subject(req, (_result) => {
              sqlite.exec("update session set subject=? where id=?", _result.subject, this.id).then(() => {
                this.emit("subject", { id: this.id, subject: _result.subject });
                this.subject = _result.subject
              })
            })
          }
        });
      }
      if (result.tokens != null) {
        sqlite.exec("update message set prompt_tokens=?,completion_tokens=? where id=?", result.tokens.prompt_tokens, result.tokens.completion_tokens, mid).then(() => { })
      }
      let content = element.answer;
      let html = global.mdRender(content == null ? "" : content);
      requestAnimationFrame(() => {
        let msg_r_ = document.getElementById("msg_r_" + mid);
        msg_r_.innerHTML = html;
      });
    }
  },
});
export default () => useSession;
