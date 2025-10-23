<template>
  <view
    class="w-full h-[100rpx] fixed left-0 z-10 pl-[32rpx] pr-[32rpx] box-border flex flex-row items-center justify-center"
    :style="{ bottom: safeBottom + 'px' }"
  >
    <view
      class="w-full h-full bg-[#fff] rounded-[50rpx] overflow-hidden flex flex-row items-center justify-between"
    >
      <view
        class="w-full h-full flex flex-col items-center justify-center"
        v-for="(item, index) in tabbars"
        :key="item.name"
        @click="changeTab(index)"
      >
        <image
          :src="index === activeIndex ? item.activeIcon : item.icon"
          class="w-[48rpx] h-[48rpx]"
        />
        <text
          class="text-[24rpx]"
          :class="[index === activeIndex ? 'text-[#000]' : 'text-[#c8c8c8]']"
          >{{ item.label }}</text
        >
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { tabbars } from "@/config/config";
import { ref } from "vue";

const activeIndex = ref(0);

const safeBottom = uni.getSystemInfoSync().safeAreaInsets?.bottom || 0;

function changeTab(index: number) {
  activeIndex.value = index;
}
</script>

<style scoped></style>
