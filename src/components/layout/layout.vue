<template>
  <view
    class="absolute left-0 w-full"
    :style="{
      top: hasHeader ? `calc(88rpx + ${safeTop}px + ${gap || 0}rpx)` : '0',
      height: hasHeader
        ? `calc(100% - ${safeTop}px - 88rpx - ${gap || 0}rpx)`
        : '100%',
    }"
  >
    <slot />
  </view>
</template>

<script setup lang="ts">
interface Props {
  hasHeader: boolean;
  gap?: number;
}

defineProps<Props>();

const safeTop = uni.getSystemInfoSync().safeAreaInsets?.top || 0;
</script>

<style scoped></style>
