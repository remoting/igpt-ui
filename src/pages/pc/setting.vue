<template>
  <div class="ly-chat-header" @mousedown="dragWindow">
    <div class="header-icon"></div>
    <div class="header-text">
      <div class="title">系统设置</div>
    </div>
    <div class="header-right"></div>
  </div>
  <div class="ly-chat-body">
    <router-view />
  </div>
</template>
<script setup>
import { getCurrentWindow } from "@tauri-apps/api/window";
const dragWindow = (e) => {
  const appWindow = getCurrentWindow();
  if (e.buttons === 1) {
    // Primary (left) button
    e.detail === 2
      ? appWindow.toggleMaximize() // Maximize on double click
      : appWindow.startDragging(); // Else start dragging
  }
};
</script>
