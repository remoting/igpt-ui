<template>
  <div>s</div>
</template>
<script setup>
import { onMounted, reactive } from "vue";
import fetch from "@/utils/fetch";
onMounted(() => {
  fetch("http://test.tauri.app/data.json", {
    method: "GET",
  }).then((d) => {
    debugger;
    console.log(d);
  });
});
</script>
