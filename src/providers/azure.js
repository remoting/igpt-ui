import result from "./result";
//import fetch from "@/utils/fetch"
let fetch = window.fetch
const sendRequest = (req, callback) => {
  let prompt = req.prompt;
  let url = `${req.model.config.apiurl}/openai/deployments/${req.model.config.modelname}/chat/completions?api-version=${req.model.config.apiversion}`
  let params = {
    "model": req.model.config.modelname,
    "messages": [
      { "role": "user", "content": prompt }
    ],
    "stream": true
  }
  fetch(url, {
    method: "POST",
    headers: {
      "accept": "application/json",
      "Content-Type": "application/json",
      "api-key": req.model.config.apikey,
    },
    body: JSON.stringify(params)
  }).then((response) => {
    result(response, resultParsing, callback)
  });
};
const resultParsing = (d, callback) => {
  if (
    d != null &&
    d.choices != null &&
    d.choices.length > 0 &&
    d.choices[0].delta != null && d.choices[0].delta.content != null
  ) {
    const content = d.choices[0].delta.content;
    if (d.usage != null) {
      callback({
        err: null,
        text: content,
        done: false,
        tokens: {
          prompt_tokens: d.usage.prompt_tokens,
          completion_tokens: d.usage.completion_tokens
        }
      });
    } else {
      callback({
        err: null,
        text: content,
        done: false
      });
    }
  }
};
const subject = (req, callback) => {
  let prompt = "已下我会提供一段聊天对话，请根据对话内容生成对话标题，尽可能包含对话内容的信息量同时标题尽量简略。";
  prompt += "\r\n # 具体要求："
  prompt += "\r\n - 1，标题文字长度不能超过 50 个中文。"
  prompt += "\r\n - 2，直接生成内容不要生成多个了给我做选择，一次性生成你建议的标题。"
  prompt += "\r\n - 3，标题式用在用户界面上显示的，用于给聊天内容做标题总结。"
  prompt += "\r\n ------------"
  prompt += "\r\n - 用户提问：\r\n" + req.message.question;
  prompt += "\r\n - GTP回答：\r\n" + req.message.answer;
  let url = `${req.model.config.apiurl}/openai/deployments/${req.model.config.modelname}/chat/completions?api-version=${req.model.config.apiversion}`
  let params = {
    "model": req.model.config.modelname,
    "messages": [
      { "role": "user", "content": prompt }
    ],
    "stream": false
  }
  fetch(url, {
    method: "POST",
    headers: {
      "accept": "application/json",
      "Content-Type": "application/json",
      "api-key": req.model.config.apikey,
    },
    body: JSON.stringify(params)
  })
    .then((response) => {
      if (response.ok) {
        response.text()
          .then((value) => {
            try {
              const d = JSON.parse(value);
              if (
                d != null &&
                d.choices != null &&
                d.choices.length > 0 &&
                d.choices[0].message != null
              ) {
                const content = d.choices[0].message.content;
                callback({
                  subject: content
                });
              }
            } catch (error) {
              callback({
                subject: "",
              });
            }
          }).catch(e => {
            callback({
              subject: "",
            });
          });
      } else {
        callback({
          subject: "",
        });
      }
    })
    .catch((err) => {
      callback({
        subject: "",
      });
    });
}
export default {
  request: sendRequest,
  subject: subject
};
