<template>
  <view class="relative w-[100vw] h-[100vh]">
    <view
      class="absolute left-0 top-0 w-full h-full flex flex-row items-center justify-center"
    >
      <image class="w-full h-full" :src="info?.url" mode="aspectFill"></image>
    </view>

    <!-- <view
      class="absolute left-0 w-full px-[32rpx] box-border flex flex-col items-center justify-center"
      :style="{ bottom: `calc(${safeBottom}px + 88rpx)` }"
    >
      <view class="w-full py-[32rpx] box-border flex flex-col">
        <view class="w-full flex flex-row items-center">
          <text
            class="text-white/95 text-lg font-medium leading-[1.6] text-shadow-[0_4rpx_20rpx_rgba(0,0,0,0.8),_0_2rpx_6rpx_rgba(0,0,0,0.9)]"
            >{{ info.content }}</text
          >
        </view>
      </view>

      <view class="w-full h-[10rpx] flex flex-row items-center justify-center">
        <progress
        class="w-full"
          :percent="Math.round((info.index / total) * 100)"
          stroke-width="3"
          :activeColor="ThemeColors.primary"
          active-mode="forwards"
        />
      </view>
    </view> -->
  </view>
</template>

<script setup lang="ts">
import type { ISceneItem } from "@/types";

interface Props {
  info: ISceneItem; // 当前页码
  total: number;
}

const props = defineProps<Props>();

const safeBottom = uni.getWindowInfo().safeAreaInsets?.bottom || 0;
</script>

<style scoped></style>
