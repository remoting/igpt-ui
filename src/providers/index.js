import gemini from "./gemini";
import openai from "./openai";
import azure from "./azure";
import claude from "./claude";
const provider = new Map();
provider.set("gemini", gemini);
provider.set("openai", openai);
provider.set("azure", azure);
provider.set("claude", claude);
export default {
  request: (e, cb) => {
    let p = provider.get(e.model.provider);
    if (p != null) {
      return p.request(e, cb);
    }
  },
  subject: (e, cb) => {
    let p = provider.get(e.model.provider);
    if (p != null) {
      p.subject(e, cb);
    }
  }
};
