<template></template>
<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
// import user from "@/stores/user.js";
// import http from "@/utils/http.js";
const router = useRouter();
const uinfo = user();

onMounted(() => {
  //   http
  //     .post("/api/user/logout")
  //     .then((res) => {
  //       uinfo.logout();
  //       router.push("/");
  //     })
  //     .catch((err) => {
  //       uinfo.logout();
  //       router.push("/");
  //     });
});
</script>
