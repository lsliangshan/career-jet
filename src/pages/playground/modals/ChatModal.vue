<template>
  <view class="w-full h-[800rpx] flex flex-col justify-between" >
    <view class="w-full h-full p-[32rpx] box-border" :style="{maxHeight: `calc(100% - 120rpx - 100rpx - 64rpx - ${safeBottom}px)`}">
      <view class="w-full max-h-full py-[32rpx] box-border rounded-[32rpx] overflow-hidden bg-[#07c160] shadow-[0_8rpx_32rpx_rgba(0,0,0,0.15)] flex flex-row">
        <view class="w-full h-full px-[32rpx] box-border overflow-auto">
          <textarea type="text" class="text-[#fff]" auto-height/>
        </view>
      </view>
    </view>

    <view class="w-full h-[120rpx] bg-red-500"></view>
    <view class="w-full" :style="{ height: `calc(100rpx + ${safeBottom}px)` }"></view>
  </view>
</template>

<script setup lang="ts">
import { ThemeColors } from '@/config/config';

interface Props {
  isSpeaking: boolean;
}

const props = defineProps<Props>();

const safeBottom = uni.getWindowInfo().safeAreaInsets?.bottom || 0;
</script>

<style scoped>

</style>