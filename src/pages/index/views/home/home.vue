<template>
  <view class="w-full h-full">
    <view
      class="w-full box-border fixed left-0 top-0 z-10 flex flex-col items-center justify-center"
      :style="{
        height: `calc(88rpxx + ${safeTop}px)`,
        paddingTop: `${safeTop}px`,
        backgroundColor: ThemeColors.bgCard,
      }"
    >
      <view
        class="relative w-full h-[88rpx] pl-[24rpx] pr-[24rpx] box-border flex flex-row items-center"
      >
        <view class="h-[88rpx] shrink-0 flex flex-row items-center">
          <!-- <text class="text-[32rpx]">大厅</text> -->
        </view>
      </view>
    </view>

    <Layout :hasHeader="true">
      <scroll-view type="custom" scroll-y class="w-full h-full">
        <view class="w-full h-[16rpx]"></view>
        <DailyTask></DailyTask>

        <QuickStart></QuickStart>

        <view
          class="w-full"
          :style="{
            height: `calc(164rpx + ${safeBottom}px)`,
          }"
        ></view>
      </scroll-view>
    </Layout>
  </view>
</template>

<script setup lang="ts">
import { ThemeColors } from "@/config/config";
import DailyTask from "./DailyTask.vue";
import Layout from "@/components/layout/layout.vue";
import QuickStart from "./QuickStart.vue";

const safeTop = uni.getWindowInfo().safeAreaInsets?.top || 0;
const safeBottom = uni.getWindowInfo().safeAreaInsets?.bottom || 0;
</script>

<style scoped></style>
