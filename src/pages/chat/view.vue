<template>
  <div class="ly-chat-view">
    <div style="height: 10px; overflow: hidden"></div>
    <div class="ly-chat-message" :id="'msg_' + msg.id" v-for="(msg, i) in session.messages" :key="msg.id">
      <div class="ly-chat-message-send">
        <div class="ly-chat-message-avatar">
          <div v-if="user.avatar != null && user.avatar != ''">
            <img :src="user.avatar" />
          </div>
          <van-icon v-else name="manager-o" size="23" />
        </div>
        <div class="ly-chat-message-content">
          <div class="message">
            <div v-html="markdown(msg.question)" :id="'msg_s_' + msg.id"></div>
            <div class="message_opts">
              <div style="font-size: 12px; margin-right: 20px;cursor: pointer;" @click="copy(msg.question)">
                <van-icon name="notes-o" /> 复制
              </div>
              <div :style="'font-size: 12px;margin-right: 20px;cursor: pointer;'" @click="favorite(msg)">
                <van-icon name="delete-o" /> 删除
              </div>
              <div><van-icon name="tosend" /> {{ msg.create_time }}</div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="msg.answer != null || msg.complete === false" class="ly-chat-message-reverse">
        <div class="ly-chat-message-avatar">
          <!-- gpt icon -->
          <!-- <gemini></gemini> -->
          <chatgpt></chatgpt>
        </div>
        <div class="ly-chat-message-content">
          <div class="message">
            <div v-html="markdown(msg.answer)" :id="'msg_r_' + msg.id"></div>
            <div class="message_opts">
              <template v-if="msg.complete === false">
                <div class="icon-stop">
                  <van-loading @click="stop(msg.id)" />
                  <van-icon name="pause-circle-o" />
                </div>
              </template>
              <template v-else>
                <div :style="'font-size: 12px;margin-right: 20px;cursor: pointer;'">
                  {{ msg.bs }}
                </div>
                <div :style="'font-size: 12px;margin-right: 20px;cursor: pointer;'" @click="redo(msg)">
                  <van-icon name="replay" /> 重新生成
                </div>
                <div style="font-size: 12px; margin-right: 20px;cursor: pointer;" @click="copy(msg.answer)">
                  <van-icon name="notes-o" /> 复制
                </div>
                <div :style="'font-size: 12px;margin-right: 20px;cursor: pointer;' +
                  (msg.favorite > 0 ? 'color:rgb(119 34 74);' : ' ')
                  " @click="favorite(msg)">
                  <van-icon name="star-o" /> 收藏
                </div>
                <div :style="'font-size: 12px;margin-right: 20px;cursor: pointer;'" @click="favorite(msg)">
                  <van-icon name="delete-o" /> 删除
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="height: 20px; overflow: hidden"></div>
  </div>
</template>
<script setup>
import { onMounted, onUnmounted, reactive } from "vue";
import useSession from "./session";
import useList from "./list";
import useUser from "@/stores/user";
import global from "@/utils/global";
import chatgpt from "../../icons/chatgpt.vue";
const user = useUser();
const session = useSession();
const list = useList();
const copy = async (content) => {
  await global.clipboard().writeText(content)
  global.toast("复制成功")
};
const redo = async (msg) => {
  await session.resend(msg.id)
}
const favorite = (msg) => {
  session.favorite(msg, () => {
    global.toast("操作成功")
  })
};
const markdown = (content) => {
  return global.mdRender(content == null ? "" : content);
};
const scroll = (d) => {
  requestAnimationFrame(() => {
    try {
      var div = document.querySelector(".ly-chat-main");
      div.scrollTop = div.scrollHeight;
    } catch (e) {
      console.log(e);
    }
  });
};
const subject = (d) => {
  list.subject(d.id, d.subject)
}
onMounted(() => {
  session.on("answer", scroll);
  session.on("subject", subject);
  scroll();
});
onUnmounted(() => {
  session.off("subject", subject);
});
</script>
<style lang="scss">
.ly-chat-view {
  box-sizing: border-box;
  bottom: 0px;
  top: 0px;
  width: 100%;
  position: absolute;

  .hljs {
    border-radius: 5px;
  }

  .ly-chat-message-send {
    display: flex;
    justify-content: flex-end;
    padding: 10px 10px 0 10px;

    .ly-chat-message-avatar {
      width: 30px;
      height: 30px;
      overflow: hidden;
      border-radius: 15px;
      border: 1px #afafaf solid;
      order: 2;
      flex-shrink: 0;
      background: white;
      text-align: center;

      i {
        margin-top: 3px;
      }

      img {
        width: 30px;
        height: 30px;
      }
    }

    .ly-chat-message-content {
      max-width: calc(100% - 80px);
      flex: 1;
      padding: 0px 10px 0 40px;
      order: 1;
      display: flex;
      justify-content: flex-end;

      .message {
        background-color: #ddebfd;
        padding: 10px;
        color: black;
        border-radius: 6px;
        font-size: 14px;
        box-shadow: rgb(231 231 231 / 61%) 0px 3px 8px;
        min-width: 100px;
        overflow: auto;

        p {
          margin-block: 5px;
        }

        .message_opts {
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid #e5e5e5;
          display: flex;
          height: 15px;
          overflow: hidden;
        }
      }
    }
  }

  .ly-chat-message-reverse {
    display: flex;
    padding: 10px 10px 0 10px;

    .ly-chat-message-avatar {
      order: 1;
      flex-shrink: 0;
      background: white;
    }

    .ly-chat-message-content {
      max-width: calc(100% - 80px);
      flex: 1;
      flex-basis: 100px;
      padding: 0px 40px 0 10px;
      order: 2;
      display: flex;
      justify-content: flex-start;

      .message {
        background-color: #f0f1f4;
        padding: 10px;
        color: black;
        border-radius: 6px;
        font-size: 14px;
        box-shadow: rgb(231 231 231 / 61%) 0px 3px 8px;
        min-width: 100px;

        .message_opts {
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid #e5e5e5;
          display: flex;
          height: 15px;
          overflow: hidden;

          .icon-stop {
            width: 20px;
            height: 20px;
            position: relative;
            cursor: pointer;

            .van-loading {
              position: absolute;

              .van-loading__spinner--circular {
                width: 16px;
                height: 16px;
                color: red;
                z-index: 15;
              }
            }

            .van-icon-pause-circle-o {
              position: absolute;
              font-size: 16px;
              color: black;
            }
          }
        }
      }

      .loading {
        width: 14px;
        height: 14px;
      }

      p {
        margin-block: 5px;
      }
    }
  }
}
</style>
