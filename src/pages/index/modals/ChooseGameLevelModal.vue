<template>
  <view class="w-full">
    <view
      class="w-full h-[100rpx] border-b border-b-[#f8f8f8] border-b-[1rpx] flex flex-row items-center justify-center"
    >
      <text
        class="text-[32rpx] font-[500]"
        :style="{ color: ThemeColors.text.title }"
        >选择游戏难度级别</text
      >
    </view>
    <view class="w-full flex flex-col">
      <view
        class="w-full h-[100rpx] pl-[32rpx] pr-[32rpx] box-border flex flex-row items-center justify-between active:bg-[#fafafa]"
        v-for="item in supportedLevels"
        :key="`${item.level}`"
        @click="handleChangeGameLevel($event, item)"
      >
        <view class="w-full h-full flex flex-row items-center">
          <text
            class="text-[28rpx]"
            :style="{
              color:
                item.level === level.level
                  ? ThemeColors.primary
                  : ThemeColors.text.title,
            }"
          >
            {{ item.level }}级 - ({{ item.name }})
          </text>
        </view>
        <view
          class="h-full shrink-0 flex flex-row items-center justify-end"
          v-if="item.level === level.level"
        >
          <svg-icon
            :src="`/static/${iconThemeVersion}/icon_checked.svg`"
            class="w-[30rpx] h-[30rpx]"
            :color="ThemeColors.primary"
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
import {
  iconThemeVersion,
  supportedLevels,
  ThemeColors,
} from "@/config/config";
import { useProfileStore } from "@/stores/profile";
import type { ILevel } from "@/types";
import { storeToRefs } from "pinia";

const profileStore = useProfileStore();
const { level } = storeToRefs(profileStore);

const safeBottom = uni.getWindowInfo().safeAreaInsets?.bottom || 0;

function handleChangeGameLevel(e: any, levelData: ILevel) {
  profileStore.setGameLevel(levelData);

  uni.$emit("hide-modal");
}
</script>

<style scoped></style>
