<template>
  <view
    class="w-full h-full flex flex-col items-center justify-center gap-[24rpx]"
  >
    <image
      class="w-[300rpx] h-[300rpx]"
      :src="`/static/${iconThemeVersion}/icon_empty.png`"
      mode="aspectFit"
    />
    <text class="text-[24rpx]" :style="{ color: ThemeColors.text.disabled }"
      >暂无数据</text
    >
  </view>
</template>

<script setup lang="ts">
import { ThemeColors } from "@/config/config";
import { iconThemeVersion } from "@/config/config";
</script>

<style scoped></style>
