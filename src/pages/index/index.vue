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

    <page-container
      :show="platformModalVisible"
      z-index="999"
      round
      @leave="handleLeave"
    >
      <view class="w-full" :style="{ backgroundColor: ThemeColors.bgCard }">
        <FollowedPlatformsModal
          v-if="platformModalData?.component === 'FollowedPlatformsModal'"
        />
      </view>
    </page-container>
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
import { onMounted, ref } from "vue";
import { onShareAppMessage, onShareTimeline } from "@dcloudio/uni-app";
import { ThemeColors } from "@/config/config";
import FollowedPlatformsModal from "./modals/FollowedPlatformModal.vue";
import { EModalComponent } from "./modals/types";

const profileStore = useProfileStore();
const { followedPosition, followedCity } = storeToRefs(profileStore);

const navStore = useNavStore();
const { currentIndex } = storeToRefs(navStore);

const platformModalVisible = ref(false);

const platformModalData = ref<{
  component?: string;
  [key: string]: any;
}>();

onMounted(() => {
  if (!followedPosition.value || !followedCity.value) {
    uni.showToast({
      title: "请先关注职位和城市",
      icon: "none",
      duration: 5000,
    });
  }

  uni.$on("show-modal", (e: any) => {
    if (e.component === EModalComponent.FOLLOWED_PLATFORMS_MODAL) {
      platformModalVisible.value = true;
      platformModalData.value = e;
    }
  });
});

function handleLeave() {
  platformModalVisible.value = false;
}

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
