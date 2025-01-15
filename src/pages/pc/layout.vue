<template>
  <div class="pc-container">
    <div class="pc-left-panel">
      <div class="logo" @mousedown="dragWindow" @click="goto('/pc/new')">
        <div style="text-align: left; padding-left: 20px">
          <div style="
              vertical-align: top;
              display: inline-block;
              padding-top: 16px;
            ">
            <van-icon name="home-o" size="30" />
          </div>
          <div style="
              line-height: 60px;
              font-size: 25px;
              margin-left: 10px;
              vertical-align: top;
              display: inline-block;
            ">
            智能助手
          </div>
        </div>
      </div>
      <ly-list class="session"></ly-list>
      <div class="setting">
        <div class="left">
          <div style="width: 50px; overflow: hidden">
            <van-button icon="setting-o" size="small" @click="goto('/pc/setting/home')"></van-button>
            <!-- <van-button icon="share-o" size="small"></van-button>
            <van-button icon="search" size="small"></van-button> -->
          </div>
        </div>
        <div class="right">
          <div style="width: 82px; overflow: hidden">
            <van-button icon="add-o" size="small" @click="goto('/pc/new')">新聊天</van-button>
          </div>
        </div>
      </div>
    </div>
    <div class="pc-resizer"></div>
    <div class="pc-right-panel">
      <router-view />
    </div>
  </div>
  <van-overlay :show="loading.status" class="ly-vant-overlay-wrapper">
    <van-loading />
  </van-overlay>
</template>
<script setup>
import { getCurrentWindow } from "@tauri-apps/api/window";
import { onMounted, onUnmounted, reactive } from "vue";
import { useRouter } from "vue-router";
import useLoading from "@/stores/loading.js";
import lyList from "../chat/list.vue";
import useSession from "../chat/session";
const session = useSession();
const loading = useLoading();
const router = useRouter();
const goto = (url) => {
  session.reset();
  router.push({
    path: url,
  });
};
const data = {
  isResizing: false,
  startX: 0,
  startWidth: 0,
  resizer: null,
  leftPanel: null,
  MAX_WIDTH: 800,
  MIN_WIDTH: 100,
};
const dragWindow = (e) => {
  const appWindow = getCurrentWindow();
  if (e.buttons === 1) {
    // Primary (left) button
    e.detail === 2
      ? appWindow.toggleMaximize() // Maximize on double click
      : appWindow.startDragging(); // Else start dragging
  }
};
const handleMouseDown = (e) => {
  if (e.button !== 0) return;
  data.isResizing = true;
  data.startX = e.clientX;
  data.startWidth = data.leftPanel.offsetWidth;
  try {
    const element = document.querySelector(".ly-chat-main");
    element.style.userSelect = 'none';
    element.style.webkitUserSelect = 'none';
  } catch (e) { }
  try {
    const element = document.querySelector(".ly-chat-body");
    element.style.userSelect = 'none';
    element.style.webkitUserSelect = 'none';
  } catch (e) { }
  //document.body.classList.add("ly-no-select");
  data.resizer.classList.add("active");

  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
};
const handleMouseMove = (e) => {
  if (!data.isResizing) return;

  const dx = e.clientX - data.startX;
  let newWidth = data.startWidth + dx;

  // 限制最大宽度
  newWidth = Math.min(newWidth, data.MAX_WIDTH);
  newWidth = Math.max(newWidth, data.MIN_WIDTH);
  requestAnimationFrame(() => {
    // if (newWidth <= data.COLLAPSE_THRESHOLD) {
    //   // 当宽度小于阈值时，切换到图标模式
    //   collapsePanel();
    // } else {
    //   // 当宽度大于阈值时，切换到展开模式
    //   expandPanel(newWidth);
    // }
    data.leftPanel.style.width = `${newWidth}px`;
    des();
  });
};
const handleMouseUp = (e) => {
  if (!data.isResizing) return;

  data.isResizing = false;
  //document.body.classList.remove("ly-no-select");
  try {
    const element = document.querySelector(".ly-chat-main");
    element.style.userSelect = 'auto';
    element.style.webkitUserSelect = 'auto';
  } catch (e) { }
  try {
    const element = document.querySelector(".ly-chat-body");
    element.style.userSelect = 'auto';
    element.style.webkitUserSelect = 'auto';
  } catch (e) { }
  data.resizer.classList.remove("active");

  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", handleMouseUp);
};
const init = () => {
  data.resizer = document.querySelector(".pc-resizer");
  data.leftPanel = document.querySelector(".pc-left-panel");
  data.resizer.addEventListener("mousedown", handleMouseDown);
  // load left width
  const savedWidth = localStorage.getItem("leftPanelWidth");
  if (savedWidth) {
    data.leftPanel.style.width = savedWidth;
  }
};
const des = () => {
  // save left width
  localStorage.setItem("leftPanelWidth", data.leftPanel.style.width);
};
onMounted(() => {
  init();
});
onUnmounted(() => {
  des();
});
</script>
<style lang="scss">
.pc-container {
  display: flex;
  height: 100%;
  background-color: #fff;

  .pc-left-panel {
    width: 240px;
    background-color: #f3f3f6;
    position: relative;
    transition: width 0.09s ease-out;
    will-change: width;
    overflow: hidden;

    .logo {
      height: 55px;
      min-width: 160px;
      padding-top: 15px;
    }

    .session {
      position: absolute;
      top: 70px;
      bottom: 60px;
      width: 100%;
      overflow: auto;
    }

    .setting {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 60px;
      display: flex;
      box-sizing: border-box;
      padding-top: 15px;
      overflow: hidden;

      .left {
        flex: 1;
      }

      .right {
        text-align: right;
        width: 80px;
        padding-right: 10px;
        overflow: hidden;
      }

      .van-button--small {
        height: 30px;
        margin-left: 10px;
        border-radius: 10px;
      }
    }
  }

  /* 分割条 */
  .pc-resizer {
    width: 1px;
    background-color: #e7e7e7;
    position: relative;
    cursor: col-resize;
    transition: all 0.09s ease-out;
  }

  .pc-resizer::after {
    content: "";
    position: absolute;
    width: 5px;
    left: -2px;
    top: 0;
    bottom: 0;
    cursor: col-resize;
  }

  .pc-resizer:hover::after {
    background-color: #90b5d359;
    z-index: 10;
  }

  /* 悬停和拖动时的样式 */
  .pc-resizer:hover,
  .pc-resizer.active::after {
    background-color: #90b5d3ab;
    z-index: 10;
  }

  .pc-right-panel {
    flex: 1;
    position: relative;
    box-sizing: border-box;
  }
}

.ly-vant-overlay-wrapper {
  display: flex;
  align-items: center;
  height: 100%;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.1);

  .van-loading {
    color: rgba(255, 0, 0);
    z-index: 1000000;
  }
}

.ly-chat-header {
  position: absolute;
  left: 0px;
  right: 0px;
  height: 70px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: var(--van-border-color);
  //box-shadow: 0px 1px 0px 0px var(--van-border-color);
  box-shadow: 0px 0px 10px 2px var(--van-border-color);
  z-index: 2;
  display: flex;

  .header-icon {
    width: 0px;
    padding-left: 10px;
    padding-top: 10px;
    line-height: 48px;
  }

  .header-text {
    flex: 1;
    padding-top: 15px;
    min-width: 100px;
    overflow: hidden;

    .subject {
      font-weight: bold;
      font-size: 20px;
    }

    .info {
      font-size: 12px;
    }

    .title {
      font-size: 20px;
      line-height: 40px;
      vertical-align: middle;
    }
  }

  .header-right {
    padding-top: 20px;
    text-align: right;
    min-width: 100px;
    padding-right: 15px;
    overflow: hidden;

    .van-button--small {
      height: 35px;
      width: 35px;
      margin-left: 15px;
      border-radius: 10px;
    }
  }
}

.ly-chat-main {
  position: absolute;
  bottom: 160px;
  top: 80px;
  left: 0px;
  right: 0px;
  overflow: auto;
  user-select: auto;
  -webkit-user-select: auto;
}

.ly-chat-footer {
  position: absolute;
  height: 149px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  background: white;
  box-shadow: 0px 0px 10px 2px var(--van-border-color);
  padding: 10px 20px 20px;
  box-sizing: border-box;
  padding-bottom: var(--safe-inset);

  .ly-chat-input-actions {
    height: 36px;
    display: flex;

    .ly-chat-input-action {
      margin-right: 5px;
      margin-bottom: 15px;

      button {
        border-radius: 15px;
        width: 40px;
        height: 25px;
        padding-top: 5px;
        padding-bottom: 5px;
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.05);
      }
    }
  }

  .ly-chat-input-panel {
    height: 83px;
    cursor: text;
    display: flex;
    border-radius: 10px;
    border: 1px solid #dedede;

    textarea {
      height: 100%;
      width: 100%;
      border-radius: 10px;
      border: none;
      box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.03);
      background-color: white;
      color: black;
      font-family: inherit;
      padding: 10px 90px 10px 14px;
      resize: none;
      outline: none;
      box-sizing: border-box;
      min-height: 68px;
    }

    button {
      background-color: #315ef8;
      color: #fff;
      position: absolute;
      right: 30px;
      bottom: 32px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      overflow: hidden;
      -webkit-user-select: none;
      -moz-user-select: none;
      user-select: none;
      outline: none;
      border: none;
      padding: 8px;

      .button_icon-button-icon {
        width: 14px;
        height: 14px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .button_icon-button-text {
        padding-right: 5px;
        padding-left: 8px;
        margin-left: 5px;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}

.ly-chat-body {
  position: absolute;
  top: 70px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  overflow: auto;
  background-color: #eff2f5;
}
</style>
