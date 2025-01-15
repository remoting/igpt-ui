<template>
  <div class="ly-new-header" @mousedown="dragWindow"></div>
  <div>
    <div class="ly-new-input">
      <van-cell-group title="输入您的问题">
        <van-field v-model="data.input" rows="3" @keydown.enter="onInputKeydown" autosize label="" type="textarea"
          placeholder="请输入...">
          <template #button>
            <div class="send_button" @click="send" style="width: 100%; height: 100%">
              <van-icon color="#1989fa" name="guide-o" size="18" />
            </div>
          </template>
        </van-field>
        <van-field class="ly-new-model" label="选择一个模型" label-align="top" placeholder="请选择">
          <template #input>
            <van-radio-group v-model="data.model" direction="horizontal">
              <van-radio v-for="item in model.list" :name="item.id" :key="item.id">
                {{ item.name }}
              </van-radio>
            </van-radio-group>
          </template>
        </van-field>
      </van-cell-group>
    </div>
  </div>
</template>
<script setup>
import { getCurrentWindow } from "@tauri-apps/api/window";
import { onMounted, reactive } from "vue";
import { showToast } from "vant";
import { useRouter } from "vue-router";
import useList from "./list.js";
import useSession from "./session.js";
import useModel from "@/stores/model.js";
const model = useModel();
const router = useRouter();
const session = useSession();
const list = useList();
const dragWindow = (e) => {
  const appWindow = getCurrentWindow();
  if (e.buttons === 1) {
    // Primary (left) button
    e.detail === 2
      ? appWindow.toggleMaximize() // Maximize on double click
      : appWindow.startDragging(); // Else start dragging
  }
};
const data = reactive({
  input: "",
  model: "",
});
onMounted(() => {
  try {
    setTimeout(() => {
      data.model = model.default();
    }, 100);
  } catch (e) { }
  document.querySelector(".van-field__control").focus();
  try {
  } catch (e) { }
});
const onInputKeydown = (e) => {
  if (e.keyCode == 13) {
    send();
  }
};
const send = () => {
  if (data.input == null || data.input.trim() == "") {
    showToast("请先输入您的问题");
    document.querySelector(".van-field__control").focus();
    return;
  }
  try {
    list.newItem({ model: data.model }, (err) => {
      if (err == null) {
        session.send(data.input);
        router.push({
          path: "/pc/home",
        });
      } else {
        showToast("系统故障");
      }
    });
  } catch (e) {
    showToast("系统故障");
  }
};
</script>
<style lang="scss">
.ly-new-header {
  height: 70px;
}

.ly-new-input {
  width: 90%;
  margin: 50px auto;

  .van-cell-group__title {
    color: black;
  }

  .ly-new-model {
    .van-cell__title {
      padding-bottom: 10px;
    }
  }
}
</style>
