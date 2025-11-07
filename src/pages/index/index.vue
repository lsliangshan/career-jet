<template>
  <view class="relative w-full h-full">
    <view
      class="w-full h-full"
      v-if="followedPosition !== '' && followedCity !== ''"
    >
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
    <view class="w-full h-full" v-else>
      <CustomHeader title="请先关注职位和城市" />
      <Layout hasHeader>
        <GeneralSettings :show-header="false"></GeneralSettings>
      </Layout>
    </view>
    <BottomNav />
  </view>
</template>

<script setup lang="ts">
import BottomNav from "./components/bottom-nav.vue";
import position from "./views/position/position.vue";
import deliver from "./views/deliver/deliver.vue";
import profile from "./views/profile/profile.vue";
import { useNavStore } from "./stores/nav";
import { storeToRefs } from "pinia";
import { useProfileStore } from "./stores/profile";
import GeneralSettings from "./views/profile/general-settings.vue";
import CustomHeader from "@/components/custom-header/custom-header.vue";
import Layout from "@/components/layout/layout.vue";
import { onMounted } from "vue";
import { onShareAppMessage, onShareTimeline } from "@dcloudio/uni-app";

const profileStore = useProfileStore();
const { followedPosition, followedCity } = storeToRefs(profileStore);

const navStore = useNavStore();
const { currentIndex } = storeToRefs(navStore);

onMounted(() => {
  if (!followedPosition.value || !followedCity.value) {
    uni.showToast({
      title: "请先关注职位和城市",
      icon: "none",
      duration: 5000,
    });
  }
});

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
