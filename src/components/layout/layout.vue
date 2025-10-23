<template>
  <view
    class="absolute left-0 w-full"
    :style="{
      top: hasHeader ? `calc(88rpx + ${safeTop}px)` : '0',
      height: hasHeader ? `calc(100% - ${safeTop}px - 88rpx)` : '100%',
    }"
  >
    <slot />
  </view>
</template>

<script setup lang="ts">
interface Props {
  hasHeader: boolean;
}

defineProps<Props>();

const safeTop = uni.getSystemInfoSync().safeAreaInsets?.top || 0;
</script>

<style scoped></style>
