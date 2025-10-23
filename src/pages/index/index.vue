<template>
  <view class="relative w-full h-full">
    <view class="w-full h-full">
      <swiper
        :current="currentIndex"
        class="w-full h-full"
        @change="handleChange"
      >
        <swiper-item>
          <position />
        </swiper-item>
        <swiper-item>
          <deliver />
        </swiper-item>
        <swiper-item>
          <profile />
        </swiper-item>
      </swiper>
    </view>

    <BottomNav />
  </view>
</template>

<script setup lang="ts">
import BottomNav from "./components/bottom-nav.vue";
import { tabbars } from "@/config/config";
import position from "./views/position/position.vue";
import deliver from "./views/deliver/deliver.vue";
import profile from "./views/profile/profile.vue";
import { useNavStore } from "./stores/nav";
import { storeToRefs } from "pinia";

const navStore = useNavStore();
const { currentIndex } = storeToRefs(navStore);

function handleChange(e: any) {
  if (e.detail.source !== "touch") {
    return;
  }
  navStore.changeTab(e.detail.current);
}
</script>

<style>
page {
  overflow: hidden;
}
</style>
