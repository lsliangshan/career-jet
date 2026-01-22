<template>
  <view class="w-full h-full flex flex-row items-center justify-center">
    <svg-icon
      class="animate-spin"
      :style="{ width: `${size || 48}rpx`, height: `${size || 48}rpx` }"
      :src="`/static/${iconThemeVersion}/icon_loading.svg`"
      :color="color || ThemeColors.primary"
    />
  </view>
</template>

<script setup lang="ts">
import { iconThemeVersion, ThemeColors } from "@/config/config";

defineProps<{
  color?: string;
  size?: number;
}>();
</script>

<style scoped></style>
