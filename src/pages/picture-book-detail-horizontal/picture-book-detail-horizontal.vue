<template>
  <view class="picture-book-detail-horizontal relative w-full h-full">
    <PageLoading v-if="!pageReady" />

    <template v-else-if="!!pbDetail">
      <view
        class="absolute left-0 top-0 z-[99] box-border flex flex-row items-center justify-between"
        :style="{
          width: `calc(${safeTitleWidth}px)`,
          height: `${calcSize(80)}rpx`,
          padding: `${calcSize(24)}rpx`,
          top: `${calcSize(12)}rpx`,
        }"
      >
        <view
          class="rounded-full rounded-full bg-black/20 backdrop-blur-md transition-all active:scale-95 flex flex-row items-center justify-center"
          :style="{
            width: `${calcSize(80)}rpx`,
            height: `${calcSize(80)}rpx`,
          }"
          @click="handleBack"
        >
          <image
            class="mr-[8rpx]"
            :style="{
              width: `${calcSize(36)}rpx`,
              height: `${calcSize(36)}rpx`,
            }"
            src="@static/icon_back_white.png"
          ></image>
        </view>

        <view
          class="flex flex-row items-center justify-center"
          :style="{
            height: `${calcSize(80)}rpx`,
            gap: `${calcSize(16)}rpx`,
          }"
        >
          <view
            class="rounded-full rounded-full bg-black/20 backdrop-blur-md transition-all active:scale-95 flex flex-row items-center justify-center"
            :style="{
              width: `${calcSize(80)}rpx`,
              height: `${calcSize(80)}rpx`,
            }"
          >
            <image
              :style="{
                width: `${calcSize(38)}rpx`,
                height: `${calcSize(38)}rpx`,
              }"
              src="@static/icon_like.png"
            ></image>
          </view>
          <view
            class="rounded-full rounded-full bg-black/20 backdrop-blur-md transition-all active:scale-95 flex flex-row items-center justify-center"
            :style="{
              width: `${calcSize(80)}rpx`,
              height: `${calcSize(80)}rpx`,
            }"
          >
            <image
              :style="{
                width: `${calcSize(40)}rpx`,
                height: `${calcSize(40)}rpx`,
                marginRight: `${calcSize(8)}rpx`,
              }"
              src="@static/icon_share.png"
            ></image>
          </view>
        </view>
      </view>

      <PbCover
        :class="[
          currentIndex === -1
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none',
        ]"
        :pbDetail="pbDetail"
        @on-start-reading="handleStartReading"
      />

      <view
        class="absolute left-0 top-0 w-full h-full flex flex-row items-center justify-center"
        :class="[
          currentIndex >= 0 && currentIndex < pbDetail?.content.length
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none',
        ]"
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
          class="absolute w-[50vw] bg-[rgba(0,0,0,0.2)] backdrop-blur-[24rpx] box-border flex flex-col items-center justify-end pointer-events-none transition-all duration-300"
          :style="{
            padding: `${calcSize(32)}rpx`,
            borderRadius: `${calcSize(24)}rpx`,
            left: `${calcSize(64)}rpx`,
            bottom: `${calcSize(32)}rpx`,
          }"
        >
          <view class="w-full flex flex-col max-h-[80vh]">
            <view class="w-full flex flex-row items-center">
              <text
                class="text-white/95 leading-[1.2]"
                :style="{
                  fontSize: `${calcSize(42)}rpx`,
                }"
                >{{ pbDetail?.scenes?.[currentIndex]?.content }}</text
              >
            </view>
          </view>

          <view
            class="w-full flex flex-col items-center justify-center shrink-0"
            :style="{
              gap: `${calcSize(10)}rpx`,
            }"
          >
            <view
              class="w-full flex flex-row items-center justify-end"
              :style="{
                height: `${calcSize(32)}rpx`,
              }"
            >
              <text
                class="text-white/95 font-medium leading-[1.6] text-shadow-[0_4rpx_20rpx_rgba(0,0,0,0.8),_0_2rpx_6rpx_rgba(0,0,0,0.9)]"
                :style="{
                  fontSize: `${calcSize(24)}rpx`,
                }"
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

        <view
          class="absolute flex flex-row items-center justify-end transition-all duration-300"
          :style="{
            bottom: `${calcSize(32)}rpx`,
            right: `${calcSize(32)}rpx`,
            height: `${calcSize(88)}rpx`,
            gap: `${calcSize(12)}rpx`,
          }"
          v-if="pbDetail?.scenes?.length"
        >
          <view
            class="rounded-full backdrop-blur-md border border-white/20 active:scale-95 transition-all shadow-lg flex items-center justify-center"
            :style="{
              height: `${calcSize(64)}rpx`,
              padding: `0 ${calcSize(24)}rpx`,
              gap: `${calcSize(12)}rpx`,
              backgroundColor: 'rgba(0,0,0,0.3)',
            }"
            :class="[
              currentIndex > 0
                ? 'opacity-100 pointer-events-auto'
                : 'opacity-0 pointer-events-none',
            ]"
            @click="handlePrevious"
          >
            <image
              class="rotate-180"
              :style="{
                width: `${calcSize(32)}rpx`,
                height: `${calcSize(32)}rpx`,
              }"
              src="@static/icon_arrow_right.png"
            ></image>
            <text
              class="text-white/95 font-medium"
              :style="{
                fontSize: `${calcSize(24)}rpx`,
              }"
              >{{
                pbDetail.config.language === "中文" ? "上一页" : "Previous"
              }}</text
            >
          </view>
          <view
            class="rounded-full backdrop-blur-md border border-white/20 active:scale-95 transition-all shadow-lg flex items-center justify-center"
            :style="{
              height: `${calcSize(64)}rpx`,
              padding: `0 ${calcSize(24)}rpx`,
              gap: `${calcSize(12)}rpx`,
              backgroundColor: mainColor,
            }"
            :class="[
              currentIndex < pbDetail?.scenes?.length - 1
                ? 'opacity-100 pointer-events-auto'
                : 'opacity-0 pointer-events-none',
            ]"
            @click="handleNext"
          >
            <text
              class="text-white/95 font-medium"
              :style="{
                fontSize: `${calcSize(24)}rpx`,
              }"
              >{{
                pbDetail.config.language === "中文" ? "下一页" : "Next"
              }}</text
            >
            <image
              :style="{
                width: `${calcSize(32)}rpx`,
                height: `${calcSize(32)}rpx`,
              }"
              src="@static/icon_arrow_right.png"
            ></image>
          </view>
        </view>
      </view>
    </template>
  </view>
</template>

<script setup lang="ts">
import { usePictureBookStore } from "@/stores/picture_book";
import type { IPictureBook } from "@/types";
import { onLoad } from "@dcloudio/uni-app";
import { computed, ref } from "vue";
import PageLoading from "@/components/page-loading/page-loading.vue";
import PbCover from "./PbCover.vue";
import PbContent from "./PbContent.vue";
import { mainColor } from "@/config/config";

const safeTop = uni.getWindowInfo().safeAreaInsets?.top || 88;
const safeBottom = uni.getWindowInfo().safeAreaInsets?.bottom || 0;

const { left: safeTitleWidth } = uni.getMenuButtonBoundingClientRect();

const pictureBookStore = usePictureBookStore();

const id = ref("");

const pbDetail = ref<IPictureBook | null>(null);

// 当前阅读的页码，-1表示未开始阅读，显示封面
const currentIndex = ref(-1);

const pageReady = ref(false);

const calcSize = computed(() => {
  const dpr = Number(
    (
      uni.getWindowInfo().windowWidth / uni.getSystemInfoSync().windowHeight
    ).toFixed(2)
  );
  return function (size: number) {
    return Math.round(size / dpr);
  };
});

onLoad((options: any) => {
  id.value = options.id;
  initPbDetail();
});

function initPbDetail() {
  pictureBookStore
    .getPictureBookDetail({
      id: id.value,
    })
    .then((res: any) => {
      console.log(">>>>>> res: ", res);
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
}

function handleBack() {
  if (currentIndex.value === -1) {
    uni.navigateBack({
      fail: () => {
        uni.reLaunch({
          url: "/pages/index/index",
        });
      },
    });
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
</script>

<style scoped>
.picture-book-detail-horizontal {
  background: linear-gradient(135deg, #ffe6ee 0%, #e6f0ff 100%);
}

.swiper {
  background-image: url("https://ww4.sinaimg.cn/mw690/005UJ76vgy1hx8iycyzdyj30rp1o00xt.jpg");
}
</style>
