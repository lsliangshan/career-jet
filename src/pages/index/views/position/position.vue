<template>
  <view class="relative w-full h-full flex flex-row items-center">
    <view
      class="w-full box-border fixed left-0 top-0 z-10 flex flex-col items-center justify-center bg-[#fff]"
      :style="{
        height: `calc(88rpx + 80rpx + ${safeTop}px)`,
        paddingTop: `${safeTop}px`,
      }"
    >
      <view
        class="relative w-full h-[88rpx] pl-[24rpx] pr-[24rpx] box-border flex flex-row items-center"
      >
        <view class="h-[88rpx] shrink-0 flex flex-row items-center">
          <image
            class="max-h-[60rpx] max-w-[170rpx]"
            src="https://img.liangqy.com/crawlerjet/img/icon_daily_positions.png"
          ></image>
        </view>

        <view class="ml-[12rpx]">
          <text
            class="webfont mr-[12rpx] text-[24rpx] text-[#888]"
            v-if="renderDate"
            >x
          </text>
          <text class="webfont text-[32rpx] text-[#333]">{{ renderDate }}</text>
        </view>
      </view>
      <view
        class="w-full h-[80rpx] pl-[24rpx] box-border border-t border-[#fafafa] flex flex-row items-end gap-[12rpx]"
      >
        <view
          class="h-[56rpx] pl-[24rpx] pr-[24rpx] box-border rounded-tl-[12rpx] rounded-tr-[12rpx] overflow-hidden flex flex-row items-center transition-all duration-300"
          v-for="(platform, index) in supportedPlatforms"
          :key="platform.name"
          :class="[currentIndex === index ? 'bg-[#FF6B00]' : 'bg-[#fff]']"
          @click="handleChangePlatform(index)"
        >
          <text
            class="text-[28rpx] transition-all duration-300"
            :class="[currentIndex === index ? 'text-[#fff]' : 'text-[#333]']"
            >{{ platform.label }}</text
          >
        </view>
      </view>
    </view>

    <Layout :hasHeader="true" :gap="80">
      <swiper
        class="w-full h-full"
        :current="currentIndex"
        @change="handleChange"
      >
        <swiper-item
          v-for="platform in supportedPlatforms"
          :key="platform.name"
        >
          <PositionList :type="platform.type" />
        </swiper-item>
      </swiper>
    </Layout>
  </view>
</template>

<script setup lang="ts">
import { usePositionStore } from "../../stores/position";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { supportedPlatforms } from "@/config/config";
import Layout from "@/components/layout/layout.vue";
import PositionList from "./position-list.vue";

const safeTop = uni.getSystemInfoSync().safeAreaInsets?.top || 0;

const positionStore = usePositionStore();
const { zhaopinPositions, bossPositions } = storeToRefs(positionStore);

const currentIndex = ref<number>(0);

const renderDate = computed(() => {
  if (currentIndex.value === 0) {
    return zhaopinPositions.value.date;
  } else if (currentIndex.value === 1) {
    return bossPositions.value.date;
  }
  return "";
});

function handleChange(e: any) {
  currentIndex.value = e.detail.current;
}

function handleChangePlatform(index: number) {
  currentIndex.value = index;
}
</script>

<style scoped></style>
