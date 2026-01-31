<template>
  <view class="w-full h-full flex flex-col items-center justify-center">
    <scroll-view scroll-y class="w-full h-full">
      <view class="w-full" :style="{ height: `${headerHeight}px` }"></view>

      <view class="w-full h-[100rpx] flex flex-row items-center justify-start">
        <text class="text-[32rpx] font-bold">完成创作</text>
      </view>
      <view
        class="w-full h-[3000rpx] bg-grey-400 flex flex-row items-center justify-start"
      >
        <text class="text-[32rpx] font-bold">完成创作</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { computed } from "vue";

const safeTop = uni.getWindowInfo().safeAreaInsets?.top || 0;

const headerHeight = computed(() => {
  return safeTop + uni.upx2px(168);
});
</script>

<style scoped></style>
