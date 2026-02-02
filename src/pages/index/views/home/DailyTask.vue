<template>
  <view
    class="w-full h-[400rpx] px-[32rpx] box-border mb-[48rpx] flex flex-col items-center justify-center"
  >
    <view
      class="relative w-full h-full rounded-[24rpx] overflow-hidden bg-[#fff] dark:bg-card-dark shadow-xl flex flex-row items-center justify-center"
    >
      <view
        class="absolute left-0 top-0 w-full h-full rounded-[24rpx] overflow-hidden flex flex-row items-center justify-center"
      >
        <image
          class="w-full h-full"
          src="https://img.liangqy.com/crawlerjet/img/unnamed.png"
          mode="aspectFill"
        ></image>
      </view>

      <view
        class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"
      ></view>

      <view
        class="absolute left-0 top-0 w-full h-full p-[24rpx] box-border flex flex-col gap-[16rpx]"
      >
        <view class="w-full h-[32rpx] flex flex-row items-center">
          <view
            class="h-full px-[12rpx] box-border flex flex-row items-center justify-center rounded-[16rpx]"
            :style="{
              backgroundColor: ThemeColors.primary,
            }"
          >
            <text class="text-[20rpx] font-bold text-white">每日灵感</text>
          </view>
        </view>
        <view class="w-[70%] flex flex-row items-center">
          <text class="text-2xl font-bold text-white leading-tight"
            >今天想创作什么样的魔法故事？</text
          >
        </view>
        <view class="w-[70%] flex flex-row items-center">
          <text class="text-white/70 text-sm"
            >开启您的想象力，记录下每一个闪光的瞬间。</text
          >
        </view>

        <view class="w-full h-[64rpx] mt-[24rpx] flex flex-row items-center">
          <view
            class="h-full px-[24rpx] box-border flex flex-row items-center justify-center gap-[12rpx] rounded-[32rpx] active:scale-95 transition-all duration-300"
            :style="{
              backgroundColor: ThemeColors.primary,
            }"
            @click="handleCreatePictureBook"
          >
            <svg-icon
              class="w-[28rpx] h-[28rpx]"
              :src="`/static/${iconThemeVersion}/icon_generate.svg`"
              color="#fff"
            ></svg-icon>
            <text class="text-[24rpx] font-bold text-white">立即创作</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { iconThemeVersion, ThemeColors } from "@/config/config";
import { validateLoggedIn } from "@/utils/user";

function handleCreatePictureBook() {
  validateLoggedIn();
  uni.navigateTo({
    url: "/pages/create-picture-book/create-picture-book",
  });
}
</script>

<style scoped></style>
