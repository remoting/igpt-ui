<template>
  <div class="ky-container">
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <div :key="route.path">
          <component :is="Component" />
        </div>
      </transition>
    </router-view>
  </div>
</template>
<script setup>
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
</script>
