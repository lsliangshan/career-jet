<template>
  <view
    class="w-full h-[100rpx] fixed left-0 z-10 pl-[32rpx] pr-[32rpx] box-border flex flex-row items-center justify-center"
    :style="{ bottom: safeBottom != 0 ? safeBottom + 'px' : '32rpx' }"
  >
    <view
      class="w-full h-full bg-[#fff] rounded-[50rpx] overflow-hidden shadow-[0_0_30rpx_2rpx_rgba(0,0,0,0.1)] flex flex-row items-center justify-between"
    >
      <view
        class="w-full h-full flex flex-col items-center justify-center"
        v-for="(item, index) in tabbars"
        :key="item.name"
        @click="changeTab(index)"
      >
        <svg-icon
          :src="item.icon"
          class="w-[48rpx] h-[48rpx]"
          :color="
            index === currentIndex
              ? ThemeColors.primary
              : ThemeColors.text.label
          "
        />
        <text
          class="text-[24rpx] transition-all duration-300"
          :style="{
            color:
              index === currentIndex
                ? ThemeColors.primary
                : ThemeColors.text.label,
          }"
          >{{ item.label }}</text
        >
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { tabbars, ThemeColors } from "@/config/config";
import { useNavStore } from "@/stores/nav";
import { storeToRefs } from "pinia";

const navStore = useNavStore();
const { currentIndex } = storeToRefs(navStore);

const safeBottom = uni.getWindowInfo().safeAreaInsets?.bottom || 0;

function changeTab(index: number) {
  navStore.changeTab(index);
}
</script>

<style scoped></style>
