<template>
  <view class="w-full">
    <view
      class="w-full h-[100rpx] border-b border-b-[#f8f8f8] border-b-[1rpx] flex flex-row items-center justify-center"
    >
      <text
        class="text-[32rpx] font-[500]"
        :style="{ color: ThemeColors.text.title }"
        >选择关注的平台</text
      >
    </view>
    <view class="w-full flex flex-col">
      <view
        class="w-full h-[100rpx] pl-[32rpx] pr-[32rpx] box-border flex flex-row items-center justify-between active:bg-[#fafafa]"
        v-for="platform in supportedPlatforms"
        :key="platform.name"
      >
        <view class="w-full h-full flex flex-row items-center">
          <image
            class="w-[30rpx] h-[30rpx] mr-[12rpx] rounded-[4rpx] overflow-hidden"
            :src="platform.icon"
          ></image>
          <text class="text-[28rpx]" :style="{ color: ThemeColors.text.title }">
            {{ platform.label }}
          </text>
        </view>
        <view class="h-full shrink-0 flex flex-row items-center justify-end">
          <switch
            class="scale-75 origin-right"
            :checked="followedPlatforms.includes(platform.type)"
            @change="handleChangeFollowedPlatform($event, platform.type)"
          />
        </view>
      </view>
    </view>
    <view
      class="w-full"
      :style="{ height: `calc(64rpx + ${safeBottom}px)` }"
    ></view>
  </view>
</template>

<script setup lang="ts">
import { supportedPlatforms, ThemeColors } from "@/config/config";
import { useProfileStore } from "../stores/profile";
import { storeToRefs } from "pinia";
import { SupportedPlatform } from "@/types";

const profileStore = useProfileStore();
const { followedPlatforms } = storeToRefs(profileStore);

const safeBottom = uni.getSystemInfoSync().safeAreaInsets?.bottom || 0;

function handleChangeFollowedPlatform(e: any, type: SupportedPlatform) {
  if (e.detail.value) {
    profileStore.addFollowedPlatform(type);
  } else {
    profileStore.removeFollowedPlatform(type);
  }
}
</script>

<style scoped></style>
