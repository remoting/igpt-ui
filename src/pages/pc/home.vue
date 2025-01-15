<template>
  <template v-if="session.id !== 0">
    <div class="ly-chat-header" @mousedown="dragWindow">
      <div class="header-icon">
        <!-- <van-icon  name="chat-o" :badge="session.messages.length" size="20" /> -->
      </div>
      <div class="header-text">
        <div class="subject">{{ session.subject }}</div>
        <div class="info">共有 {{ session.messages.length }} 条对话</div>
      </div>
      <div class="header-right">
        <van-button icon="setting-o" size="small"></van-button>
        <!-- <van-button icon="share-o" size="small"></van-button> -->
      </div>
    </div>
    <div class="ly-chat-main">
      <lyChatView></lyChatView>
    </div>
    <div class="ly-chat-footer">
      <div class="ly-chat-input-actions">
        <div class="ly-chat-input-action">
          <van-button icon="setting-o" size="small"></van-button>
        </div>
        <div class="ly-chat-input-action">
          <van-button icon="edit" size="small"></van-button>
        </div>
        <!-- <div class="ly-chat-input-action">
        <van-button icon="edit" size="small"></van-button>
      </div>
      <div class="ly-chat-input-action">
        <van-button icon="edit" size="small"></van-button>
      </div>
      <div class="ly-chat-input-action">
        <van-button icon="edit" size="small"></van-button>
      </div>
      <div class="ly-chat-input-action">
        <van-button icon="edit" size="small"></van-button>
      </div> -->
      </div>
      <div class="ly-chat-input-panel">
        <textarea @keydown.enter="onInputKeydown" id="chat-input" placeholder="Enter 发送，Shift + Enter 换行" rows="3"
          style="font-size: 14px" v-model="data.input"></textarea><button @click="send">
          <div class="button_icon-button-icon">
            <van-icon name="guide-o" />
          </div>
          <div class="button_icon-button-text">发送</div>
        </button>
      </div>
    </div>
  </template>
  <template v-else>
    <div class="ly-chat-header" @mousedown="dragWindow">
      <div class="header-icon"></div>
      <div class="header-text">
        <div class="title">欢迎使用</div>
      </div>
      <div class="header-right"></div>
    </div>
    <div class="ly-chat-body">
      <div class="ly-pc-home">
        <h1 style="text-align: center;padding-top: 100px;">
          欢迎使用
        </h1>
      </div>
    </div>
  </template>
</template>
<script setup>
import { getCurrentWindow } from "@tauri-apps/api/window";
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import useSession from "../chat/session";
import lyChatView from "../chat/view.vue";
import global from "@/utils/global";
const session = useSession();
const router = useRouter();
const data = reactive({
  input: "",
});
const dragWindow = (e) => {
  const appWindow = getCurrentWindow();
  if (e.buttons === 1) {
    // Primary (left) button
    e.detail === 2
      ? appWindow.toggleMaximize() // Maximize on double click
      : appWindow.startDragging(); // Else start dragging
  }
};
const send = () => {
  session.send(data.input);
  data.input = "";
};
const onInputKeydown = (e) => {
  if (e.keyCode == 13) {
    if (e.shiftKey) {
      console.log("Shift + Enter pressed");
    } else {
      e.preventDefault();
      send();
    }
  }
};
onMounted(() => {
  global.loadingOff();
  if (session.id == null || session.id == 0) {
    router.push("/pc/new")
  }
});
</script>
