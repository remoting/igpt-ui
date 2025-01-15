import { progressProps } from "vant";
import result from "./result";
//import fetch from "@/utils/fetch"

// \"usageMetadata\": {
//   \"promptTokenCount\": 52,
//   \"candidatesTokenCount\": 9,
//   \"totalTokenCount\": 61
// },


let fetch = window.fetch
const sendRequest = (req, callback) => {
  let prompt = req.prompt;
  let url = `${req.model.config.apiurl}/v1beta/models/${req.model.config.modelname}:streamGenerateContent?alt=sse&key=${req.model.config.apikey}`;
  let contents = [];
  if (req.history != null) {
    for (let i = 0; i < req.history.length; i++) {
      const element = req.history[i];
      contents.push({
        role: element.role,
        parts: [{
          "text": element.content
        }]
      })
    }
  }
  contents.push({
    role: "user",
    parts: [{
      text: prompt,
    }],
  })
  let params = {
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 4096,
    },
    contents: contents
  };
  return fetch(url, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  })
    .then((response) => {
      result(response, resultParsing, callback)
    })
    .catch((err) => {
      callback({
        err: err,
        text: "",
        done: true,
      });
    });
};
const resultParsing = (d, callback) => {
  if (
    d != null &&
    d.candidates != null &&
    d.candidates.length > 0 &&
    d.candidates[0].content != null && d.candidates[0].content.parts != null && d.candidates[0].content.parts.length > 0
  ) {
    const content = d.candidates[0].content.parts[0].text;
    if (d.usageMetadata != null) {
      callback({
        err: null,
        text: content,
        done: false,
        tokens: {
          prompt_tokens: d.usageMetadata.promptTokenCount,
          completion_tokens: d.usageMetadata.totalTokenCount
        }
      });
    } else {
      callback({
        err: null,
        text: content,
        done: false
      });
    }
  } else {
    callback({
      err: null,
      text: "",
      done: true,
    });
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

  let url = `${req.model.config.apiurl}/v1beta/models/${req.model.config.modelname}:generateContent?key=${req.model.config.apikey}`;
  let params = {
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 4096,
    },
    contents: [
      {
        role: "user",
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
  };
  fetch(url, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  })
    .then((response) => {
      if (response.ok) {
        response.text()
          .then((value) => {
            try {
              const d = JSON.parse(value);
              if (d != null &&
                d.candidates != null &&
                d.candidates.length > 0 &&
                d.candidates[0].content != null) {
                const content = d.candidates[0].content;
                if (content.parts != null && content.parts.length > 0) {
                  if (content.parts[0].text != null) {
                    callback({
                      subject: content.parts[0].text
                    });
                  }
                }
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
