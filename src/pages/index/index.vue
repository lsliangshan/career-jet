<template>
  <view class="relative w-full h-full">
    <view class="w-full h-full">
      <swiper
        :current="currentIndex"
        class="w-full h-full"
        @change="handleChange"
      >
        <swiper-item>
          <home />
        </swiper-item>
        <!-- <swiper-item>
          <game />
        </swiper-item> -->
        <swiper-item>
          <profile />
        </swiper-item>
      </swiper>
    </view>
    <BottomNav />

    <page-container
      :show="modalVisible"
      z-index="999"
      round
      @leave="handleLeave"
    >
      <view class="w-full" :style="{ backgroundColor: ThemeColors.bgCard }">
        <ChooseGameLevelModal
          v-if="
            modalData?.component === EModalComponent.CHOOSE_GAME_LEVEL_MODAL
          "
        />
      </view>
    </page-container>
  </view>
</template>

<script setup lang="ts">
import BottomNav from "./components/bottom-nav.vue";
import home from "./views/home/home.vue";
import profile from "./views/profile/profile.vue";
import { useNavStore } from "@/stores/nav";
import { storeToRefs } from "pinia";
import { onShareAppMessage, onShareTimeline } from "@dcloudio/uni-app";
import { onMounted, ref } from "vue";
import { ThemeColors } from "@/config/config";
import ChooseGameLevelModal from "./modals/ChooseGameLevelModal.vue";
import { EModalComponent } from "./modals/types";

const navStore = useNavStore();
const { currentIndex } = storeToRefs(navStore);

const modalVisible = ref(false);
const modalData = ref<{
  component?: string;
  [key: string]: any;
}>();

onMounted(() => {
  uni.$on("show-modal", (e: any) => {
    if (e.component === EModalComponent.CHOOSE_GAME_LEVEL_MODAL) {
      modalVisible.value = true;
      modalData.value = e;
    }
  });

  uni.$on("hide-modal", () => {
    modalVisible.value = false;
  });
});

function handleLeave() {
  modalVisible.value = false;
}

function handleChange(e: any) {
  if (e.detail.source !== "touch") {
    return;
  }
  navStore.changeTab(e.detail.current);
}

onShareAppMessage(() => {
  return {
    title: "解锁孩子的观察力与表达力！这个AI小工具太会了！🚀",
    path: `/pages/index/index`,
    imageUrl: "https://img.liangqy.com/crawlerjet/img/description_share.png",
  };
});

onShareTimeline(() => {
  return {
    title: "解锁孩子的观察力与表达力！这个AI小工具太会了！🚀",
    imageUrl: "https://img.liangqy.com/crawlerjet/img/description_share.png",
  };
});
</script>

<style>
page {
  overflow: hidden;
}
</style>
