<template>
  <view class="relative w-full h-full">
    <view
      class="w-full h-full"
    >
      <swiper
        :current="currentIndex"
        class="w-full h-full"
        @change="handleChange"
      >
        <swiper-item>
          <home />
        </swiper-item>
        <swiper-item>
          <game />
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
import home from "./views/home/home.vue";
import game from "./views/game/game.vue";
import profile from "./views/profile/profile.vue";
import { useNavStore } from "@/stores/nav";
import { storeToRefs } from "pinia";
import { onShareAppMessage, onShareTimeline } from "@dcloudio/uni-app";

const navStore = useNavStore();
const { currentIndex } = storeToRefs(navStore);

function handleChange(e: any) {
  if (e.detail.source !== "touch") {
    return;
  }
  navStore.changeTab(e.detail.current);
}

onShareAppMessage(() => {
  return {
    title: "嘘…我的求职效率，全靠这个「小只」助手 🚀",
    path: `/pages/index/index`,
    imageUrl:
      "https://img.liangqy.com/crawlerjet/img/crawlerjet_share_without_qrcode.png",
  };
});

onShareTimeline(() => {
  return {
    title: "嘘…我的求职效率，全靠这个「小只」助手 🚀",
    imageUrl:
      "https://img.liangqy.com/crawlerjet/img/crawlerjet_share_without_qrcode.png",
  };
});
</script>

<style>
page {
  overflow: hidden;
}
</style>
