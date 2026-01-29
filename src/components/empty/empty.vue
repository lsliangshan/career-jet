<template>
  <view
    class="w-full h-full flex flex-col items-center justify-center gap-[24rpx]"
  >
    <svg-icon :src="`/static/${iconThemeVersion}/empty.svg`"></svg-icon>
    <text
      class="text-[36rpx] font-bold"
      :style="{ color: ThemeColors.text.title }"
      v-if="text"
      >{{ text }}</text
    >
    <text
      class="text-[28rpx]"
      :style="{ color: ThemeColors.text.disabled }"
      v-if="description"
      >{{ description }}</text
    >
    <slot name="action"></slot>
  </view>
</template>

<script setup lang="ts">
import { ThemeColors } from "@/config/config";
import { iconThemeVersion } from "@/config/config";

defineProps<{
  text?: string;
  description?: string;
}>();
</script>

<style scoped></style>
