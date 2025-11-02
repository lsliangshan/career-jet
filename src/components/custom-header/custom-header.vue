<template>
  <view
    class="w-full box-border fixed left-0 top-0 z-10 border-b border-[1rpx] flex flex-row items-center justify-center bg-[#fff]"
    :style="{
      height: `calc(88rpx + ${safeTop}px)`,
      paddingTop: `${safeTop}px`,
      borderColor: ThemeColors.border,
    }"
  >
    <view
      class="relative w-full h-[88rpx] pl-[32rpx] pr-[32rpx] box-border flex flex-row items-center"
    >
      <view
        class="absolute left-0 top-0 w-[88rpx] h-[88rpx] shrink-0 flex flex-row items-center justify-center"
        @click="handleBack"
        v-if="showBack"
      >
        <image class="w-[40rpx] h-[40rpx]" src="@static/icon_back.png"></image>
      </view>
      <view class="w-full h-full flex flex-row items-center justify-center">
        <text class="text-[32rpx] font-bold text-[#000]">{{ title }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ThemeColors } from "@/config/config";

interface Props {
  title?: string;
  showBack?: boolean;
}

withDefaults(defineProps<Props>(), {
  title: "",
  showBack: false,
});

const safeTop = uni.getSystemInfoSync().safeAreaInsets?.top || 0;

function handleBack() {
  uni.navigateBack({
    fail: () => {
      uni.reLaunch({
        url: "/pages/index/index",
      });
    },
  });
}
</script>

<style scoped></style>
