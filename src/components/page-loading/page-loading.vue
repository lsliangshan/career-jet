<template>
  <view
    class="w-full h-full flex flex-col items-center justify-center gap-[24rpx]"
  >
    <image
      class="w-[48rpx] h-[48rpx] animate-spin"
      src="@static/icon_loading.png"
      mode="aspectFit"
    />
    <!-- <text class="text-[24rpx]" :style="{ color: ThemeColors.text.disabled }"
      >加载中...</text
    > -->
  </view>
</template>

<script setup lang="ts">
import { ThemeColors } from "@/config/config";
</script>

<style scoped></style>
