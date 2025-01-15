<template></template>
<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import global from "../../utils/global";
const router = useRouter();
onMounted(() => {
  //可以判断是否登录，未登录时跳转地址逻辑可以放在这里
  global.loadingOn();
  if (global.isMobile()) {
    router.push("/mobile/home");
  } else {
    router.push("/pc/home");
  }
});
</script>
