<template>
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
</template>

<script setup lang="ts">
import { computed } from "vue";

const $emit = defineEmits<{
  (e: "on-back"): void;
}>();

const { left: safeTitleWidth } = uni.getMenuButtonBoundingClientRect();

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

function handleBack() {
  $emit("on-back");
}
</script>

<style scoped></style>
