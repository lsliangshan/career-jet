<template>
  <view
    class="absolute left-0 top-0 w-[100vw] h-[100vh] transition-all duration-300"
  >
    <view
      class="absolute left-0 top-0 w-full h-full flex flex-row items-center justify-center"
    >
      <image
        class="w-full h-full"
        :src="pbDetail?.cover?.url"
        mode="aspectFill"
      ></image>
    </view>

    <view
      class="absolute left-0 w-full px-[32rpx] box-border flex flex-row items-center justify-center"
      :style="{ bottom: `calc(${safeBottom}px + 88rpx)` }"
    >
      <view
        class="w-full bg-[rgba(0,0,0,0.2)] backdrop-blur-[12rpx] border border-[2rpx] border-[rgba(255,255,255,0.3)] shadow-2xl rounded-[32rpx] p-[32rpx] box-border flex flex-col"
      >
        <view class="w-full h-[48rpx] mb-[32rpx] flex flex-row items-center">
          <view
            class="h-full px-[16rpx] box-border rounded-[24rpx] flex flex-row items-center justify-center"
            :style="{
              backgroundColor: mainColor,
            }"
          >
            <text class="text-[24rpx] text-[#fff]">{{
              pbDetail?.config.theme
            }}</text>
          </view>
        </view>

        <view class="w-full mb-[12rpx] flex flex-row items-center">
          <text
            class="text-2xl leading-tight font-bold text-[#fff] drop-shadow-md"
            >{{ pbDetail?.title }}</text
          >
        </view>

        <view
          class="w-full h-[48rpx] mb-[32rpx] flex flex-row items-center gap-[12rpx]"
        >
          <image
            class="w-[42rpx] h-[42rpx] rounded-full border border-[1rpx] border-[rgba(255,255,255,0.3)]"
            :src="renderAvatar"
            mode="aspectFill"
            @error="handleAvatarError"
          ></image>
          <text class="text-base text-[rgba(255,255,255,0.8)] drop-shadow-md">{{
            pbDetail?.author?.nickname
          }}</text>
        </view>

        <view
          class="w-full h-[108rpx] flex flex-row items-center justify-center"
        >
          <view
            class="relative flex w-full h-full items-center justify-center gap-[16rpx] overflow-hidden rounded-full transition-all active:scale-95 shadow-lg shadow-primary/20"
            :style="{ backgroundColor: mainColor }"
            @click="handleStartReading"
          >
            <image
              class="w-[32rpx] h-[32rpx] mb-[4rpx]"
              src="@static/icon_start_reading2.png"
            ></image>
            <text class="text-lg font-bold text-[#fff]">{{
              pbDetail?.config.language === "中文"
                ? "开始阅读"
                : "Start Reading"
            }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { IPictureBook } from "@/types";
import { DEFAULT_AVATAR, mainColor } from "@/config/config";
import { nextTick, onBeforeMount, ref } from "vue";

interface Props {
  pbDetail: IPictureBook;
}

const props = defineProps<Props>();

const $emit = defineEmits<{
  (e: "on-start-reading"): void;
}>();

const safeBottom = uni.getWindowInfo().safeAreaInsets?.bottom || 0;

const renderAvatar = ref();

onBeforeMount(() => {
  nextTick(() => {
    setTimeout(() => {
      renderAvatar.value = props.pbDetail.author?.avatar || DEFAULT_AVATAR;
    }, 400);
  });
});

function handleAvatarError() {
  renderAvatar.value = DEFAULT_AVATAR;
}

function handleStartReading() {
  $emit("on-start-reading");
}
</script>

<style scoped></style>
