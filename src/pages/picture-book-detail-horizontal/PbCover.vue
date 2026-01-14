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
      class="absolute left-0 top-0 w-[50vw] box-border h-full flex flex-row items-end justify-center z-[9]"
      :style="{
        padding: `${calcSize(32)}rpx`,
      }"
    >
      <view
        class="w-full bg-[rgba(0,0,0,0.2)] backdrop-blur-[12rpx] border border-[2rpx] border-[rgba(255,255,255,0.3)] shadow-2xl rounded-[32rpx] box-border flex flex-col"
        :style="{
          padding: `${calcSize(32)}rpx`,
        }"
      >
        <view
          class="w-full flex flex-row items-center"
          :style="{
            height: `${calcSize(48)}rpx`,
            marginBottom: `${calcSize(32)}rpx`,
          }"
        >
          <view
            class="h-full box-border rounded-[24rpx] flex flex-row items-center justify-center"
            :style="{
              backgroundColor: mainColor,
              padding: `0 ${calcSize(16)}rpx`,
            }"
          >
            <text
              class="text-[#fff]"
              :style="{
                fontSize: `${calcSize(24)}rpx`,
              }"
              >{{ pbDetail?.config.theme }}</text
            >
          </view>
        </view>

        <view
          class="w-full flex flex-row items-center"
          :style="{
            marginBottom: `${calcSize(12)}rpx`,
          }"
        >
          <text
            class="font-bold text-[#fff] drop-shadow-md"
            :style="{
              fontSize: `${calcSize(52)}rpx`,
            }"
            >{{ pbDetail?.title }}</text
          >
        </view>

        <view
          class="w-full flex flex-row items-center"
          :style="{
            height: `${calcSize(48)}rpx`,
            marginBottom: `${calcSize(32)}rpx`,
            gap: `${calcSize(12)}rpx`,
          }"
        >
          <image
            class="rounded-full border border-[1rpx] border-[rgba(255,255,255,0.3)]"
            :style="{
              width: `${calcSize(42)}rpx`,
              height: `${calcSize(42)}rpx`,
            }"
            :src="renderAvatar"
            mode="aspectFill"
            @error="handleAvatarError"
          ></image>
          <text
            class="text-[rgba(255,255,255,0.8)] drop-shadow-md"
            :style="{
              fontSize: `${calcSize(32)}rpx`,
            }"
            >{{ pbDetail?.author?.nickname }}</text
          >
        </view>

        <view
          class="w-full flex flex-row items-center justify-center"
          :style="{
            height: `${calcSize(108)}rpx`,
          }"
        >
          <view
            class="relative flex w-full h-full items-center justify-center overflow-hidden rounded-full transition-all active:scale-95 shadow-lg shadow-primary/20"
            :style="{ backgroundColor: mainColor, gap: `${calcSize(16)}rpx` }"
            @click="handleStartReading"
          >
            <image
              :style="{
                width: `${calcSize(32)}rpx`,
                height: `${calcSize(32)}rpx`,
                marginBottom: `${calcSize(4)}rpx`,
              }"
              src="@static/icon_start_reading2.png"
            ></image>
            <text
              class="font-bold text-[#fff]"
              :style="{
                fontSize: `${calcSize(36)}rpx`,
              }"
              >{{
                pbDetail?.config.language === "中文"
                  ? "开始阅读"
                  : "Start Reading"
              }}</text
            >
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { IPictureBook } from "@/types";
import { DEFAULT_AVATAR, mainColor } from "@/config/config";
import { computed, nextTick, onBeforeMount, ref } from "vue";

interface Props {
  pbDetail: IPictureBook;
}

const props = defineProps<Props>();

const $emit = defineEmits<{
  (e: "on-start-reading"): void;
}>();

const safeBottom = uni.getWindowInfo().safeAreaInsets?.bottom || 0;

const renderAvatar = ref();

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
