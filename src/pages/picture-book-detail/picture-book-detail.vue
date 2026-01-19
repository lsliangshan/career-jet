<template>
  <view class="picture-book-detail relative w-full h-full">
    <PageLoading v-if="!pageReady" />

    <template v-else-if="!!pbDetail">
      <PbHeader
        :scene-id="currentIndex > -1 ? pbDetail.scenes?.[currentIndex]?.id : ''"
        :pb-id="pbDetail?.id"
        :playing-scene-id="isPlayingAudioSceneId"
        :author-id="pbDetail?.authorId"
        v-if="pbDetail && pbDetail.scenes"
        @on-back="handleBack"
      />

      <PbCover :pbDetail="pbDetail" @on-start-reading="handleStartReading" />
    </template>

    <page-container
      :show="modalVisible"
      z-index="999"
      position="center"
      overlay-style="background-color: rgba(0,0,0,0.05);"
      custom-style="background-color: transparent;"
      @leave="handleLeave"
    >
      <view
        class="relative w-[100vw] h-[100vh] flex flex-row items-center justify-center"
        @longpress="handleLongPress"
        @touchend="handleTouchEnd"
      >
        <swiper
          class="swiper w-full h-full"
          :current="currentIndex"
          @change="handleSwiperChange"
        >
          <swiper-item v-for="(scene, index) in pbDetail?.scenes">
            <PbContent :info="scene" :total="pbDetail?.scenes?.length || 0" />
          </swiper-item>
        </swiper>

        <view
          class="absolute left-0 w-full px-[32rpx] box-border bg-[rgba(255,255,255,0.2)] shadow-[0_0_20rpx_20rpx_rgba(255,255,255,0.2)] flex flex-col items-center justify-center pointer-events-none transition-all duration-300"
          :class="[cleanScreen ? 'opacity-0' : 'opacity-100']"
          :style="{ bottom: `calc(${safeBottom}px + 88rpx + 32rpx + 24rpx)` }"
        >
          <view
            class="w-full rounded-[24rpx] px-[24rpx] pb-[24rpx] box-border flex flex-col bg-[rgba(0,0,0,0.2)] backdrop-blur-[12rpx]"
          >
            <view class="w-full py-[32rpx] box-border flex flex-col">
              <view class="w-full flex flex-row items-center">
                <text class="text-[#fff] text-[36rpx] leading-[1.2]">{{
                  pbDetail?.scenes?.[currentIndex]?.content
                }}</text>
              </view>
            </view>

            <view
              class="w-full flex flex-col items-center justify-center gap-[10rpx]"
            >
              <view
                class="w-full h-[32rpx] flex flex-row items-center justify-end"
              >
                <text class="text-[#fff] text-sm leading-[1.6]"
                  >{{ currentIndex + 1 }} /
                  {{ pbDetail?.scenes?.length || 0 }}</text
                >
              </view>
              <progress
                class="w-full"
                :percent="
                  Math.round(
                    ((currentIndex + 1) / (pbDetail?.scenes?.length || 1)) * 100
                  )
                "
                stroke-width="1"
                :activeColor="mainColor"
                active-mode="forwards"
              />
            </view>
          </view>
        </view>

        <view
          class="absolute left-0 w-full h-[88rpx] px-[32rpx] box-border flex flex-row items-center justify-end transition-all duration-300 gap-[12rpx]"
          :class="[cleanScreen ? 'opacity-0' : 'opacity-100']"
          :style="{ bottom: `calc(${safeBottom}px + 32rpx)` }"
          v-if="pbDetail?.scenes?.length"
        >
          <view
            class="h-[80rpx] bg-[rgba(0,0,0,0.3)] px-[32rpx] rounded-full backdrop-blur-md border border-white/20 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-[12rpx]"
            :class="[
              currentIndex > 0
                ? 'opacity-100 pointer-events-auto'
                : 'opacity-0 pointer-events-none',
            ]"
            @click="handlePrevious"
          >
            <image
              class="w-[32rpx] h-[32rpx] rotate-180"
              src="@static/icon_arrow_right.png"
            ></image>
            <text class="text-white/95 text-sm font-medium">{{
              pbDetail.config.language === "中文" ? "上一页" : "Previous"
            }}</text>
          </view>
          <view
            class="h-[80rpx] px-[32rpx] rounded-full backdrop-blur-md border border-white/20 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-[12rpx]"
            :class="[
              currentIndex < pbDetail?.scenes?.length - 1
                ? 'opacity-100 pointer-events-auto'
                : 'opacity-0 pointer-events-none',
            ]"
            :style="{
              backgroundColor: mainColor,
            }"
            @click="handleNext"
          >
            <text class="text-white/95 text-sm font-medium">{{
              pbDetail.config.language === "中文" ? "下一页" : "Next"
            }}</text>
            <image
              class="w-[32rpx] h-[32rpx]"
              src="@static/icon_arrow_right.png"
            ></image>
          </view>
        </view>

        <PbHeader
          class="transition-all duration-300"
          :class="[cleanScreen ? 'opacity-0' : 'opacity-100']"
          :author-id="pbDetail?.authorId"
          :scene-id="
            currentIndex > -1 ? pbDetail.scenes?.[currentIndex]?.id : ''
          "
          :pb-id="pbDetail?.id"
          :playing-scene-id="isPlayingAudioSceneId"
          @on-back="handleLeave"
          @on-play-audio="handlePlayAudio"
          v-if="pbDetail && pbDetail.scenes && currentIndex !== -1"
        />
      </view>
    </page-container>
  </view>
</template>

<script setup lang="ts">
import { usePictureBookStore } from "@/stores/picture_book";
import type { IPictureBook } from "@/types";
import { onLoad, onShareAppMessage, onShareTimeline } from "@dcloudio/uni-app";
import { nextTick, ref, watch } from "vue";
import PageLoading from "@/components/page-loading/page-loading.vue";
import PbCover from "./PbCover.vue";
import PbContent from "./PbContent.vue";
import { mainColor } from "@/config/config";
import PbHeader from "./PbHeader.vue";
import { navigateBack } from "@/utils";

const safeBottom = uni.getWindowInfo().safeAreaInsets?.bottom || 0;

// const { left: safeTitleWidth } = uni.getMenuButtonBoundingClientRect();

const pictureBookStore = usePictureBookStore();

const id = ref("");

const modalVisible = ref(false);

const pbDetail = ref<IPictureBook | null>(null);

// 当前阅读的页码，-1表示未开始阅读，显示封面
const currentIndex = ref(-1);

const pageReady = ref(false);

const cleanScreen = ref(false);

const audioContext = ref<any>(null);
const isPlayingAudioSceneId = ref<string | undefined>();

const audios = ref<
  {
    sceneId: string;
    url: string;
  }[]
>([]);

watch(
  () => currentIndex.value,
  (val) => {
    handleStopAudio();
  }
);

onLoad((options: any) => {
  id.value = options.id;
  initPbDetail();

  nextTick(() => {
    audioContext.value = uni.createInnerAudioContext();
    audioContext.value.autoplay = true;
    audioContext.value.onEnded(() => {
      isPlayingAudioSceneId.value = undefined;
    });
  });

  pictureBookStore
    .getAudiosByPbIdAndVoiceType({
      pbId: id.value,
      voiceType: 502001,
    })
    .then((res: any) => {
      if (res.code === 200 && res.data && res.data.audios) {
        audios.value = res.data.audios;
      }
    });

  pictureBookStore.setPictureBookViews({
    pbId: id.value,
  });
});

function initPbDetail() {
  pictureBookStore
    .getPictureBookDetail({
      id: id.value,
    })
    .then((res: any) => {
      if (res.code !== 200) {
        uni.navigateBack({
          fail: () => {
            uni.reLaunch({
              url: "/pages/index/index",
            });
          },
        });
        uni.showToast({
          title: res.message || "获取绘本详情失败",
          icon: "none",
        });
        return;
      }
      pbDetail.value = res.data as IPictureBook;

      const t = setTimeout(() => {
        clearTimeout(t);
        pageReady.value = true;
      }, 500);
    });
}

function handleStartReading() {
  currentIndex.value = 0;
  modalVisible.value = true;
}

function handleBack() {
  if (currentIndex.value === -1) {
    navigateBack();
  } else {
    currentIndex.value = -1;
  }
}

function handleSwiperChange(e: any) {
  currentIndex.value = e.detail.current;
}

function handleNext() {
  if (currentIndex.value < pbDetail.value!.scenes!.length - 1) {
    currentIndex.value++;
  }
}

function handlePrevious() {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
}

function handleLeave() {
  currentIndex.value = -1;
  modalVisible.value = false;
}

function handleLongPress(e: any) {
  cleanScreen.value = true;
}

function handleTouchEnd(e: any) {
  cleanScreen.value = false;
}

function handlePlayAudio(sceneId: string) {
  if (isPlayingAudioSceneId.value && isPlayingAudioSceneId.value === sceneId) {
    // 暂停播放音频
    audioContext.value.pause();
    isPlayingAudioSceneId.value = undefined;
    return;
  }
  if (isPlayingAudioSceneId.value) {
    handleStopAudio();
  }
  isPlayingAudioSceneId.value = sceneId;
  const audio = audios.value.find((ad) => ad.sceneId === sceneId);
  if (audio) {
    audioContext.value.src = audio.url;
  }

  // 播放音频
  audioContext.value.play();
}

function handleStopAudio() {
  audioContext.value.stop();
  isPlayingAudioSceneId.value = undefined;
}

onShareAppMessage(() => {
  return {
    title: pbDetail.value?.title,
    path: "/pages/picture-book-detail/picture-book-detail?id=" + id.value,
    imageUrl: pbDetail.value?.cover?.url || "",
  };
});

onShareTimeline(() => {
  return {
    title: pbDetail.value?.title,
    imageUrl: pbDetail.value?.cover?.url || "",
  };
});
</script>

<style scoped>
.picture-book-detail {
  background: linear-gradient(135deg, #ffe6ee 0%, #e6f0ff 100%);
}

.swiper {
  background-image: url("https://img.liangqy.com/crawlerjet/picture_book/img/pb_bg.jpg");
}
</style>
