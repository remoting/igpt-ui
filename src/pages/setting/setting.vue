<template>
  <van-cell-group inset title="模型设置">
    <van-cell v-if="model.list.length === 0" title="暂无模型" />
    <van-cell
      v-else
      v-for="item in model.list"
      :key="item.id"
      :title="item.name"
      is-link
      :label="model.providerName(item)"
      value=""
      @click="goto(item)"
      center
    />
  </van-cell-group>
  <div style="text-align: center; padding: 16px">
    <van-button
      type="primary"
      icon="plus"
      size="small"
      style="width: 60%"
      @click="addModel"
      >添加模型</van-button
    >
  </div>
  <div class="van-block">
    <h2 class="van-block__title"></h2>
  </div>
</template>
<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import useModel from "@/stores/model.js";
import global from "@/utils/global.js";
const model = useModel();
const router = useRouter();
const goto = (item) => {
  router.push({
    path: global.path("/setting/model"),
    query: {
      id: item.id,
    },
  });
};
const addModel = () => {
  router.push({
    path: global.path("/setting/model"),
  });
};
onMounted(() => {});
</script>
<style lang="scss">
.van-block {
  .van-block__title {
    color: #969799;
    margin: 0;
    padding: 32px 16px 16px;
    font-size: 14px;
    font-weight: 400;
    line-height: 16px;
  }
}
</style>
