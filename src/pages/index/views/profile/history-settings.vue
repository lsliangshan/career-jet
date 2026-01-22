<template>
  <view>
    <view
      class="w-full h-[64rpx] mb-[12rpx] flex flex-row items-center"
      v-if="showHeader"
    >
      <text
        class="text-[24rpx] text-shadow-[0_0_10rpx_rgba(255,255,255,0.1)]"
        :style="{
          color: ThemeColors.text.label,
        }"
        >历史记录</text
      >
    </view>
    <view class="w-full rounded-[8rpx] overflow-hidden flex flex-col">
      <view class="flex flex-row items-center">
        <!-- <view
          class="h-[100rpx] w-full pl-[24rpx] pr-[24rpx] box-border active:bg-[#fafafa] flex flex-row items-center justify-between"
          :style="{
            backgroundColor: ThemeColors.bgCard,
          }"
          @click="handleViewAnswerHistory"
        >
          <view class="flex flex-row items-center">
            <image
              class="w-[30rpx] h-[30rpx] mr-[12rpx]"
              :src="`@static/${iconThemeVersion}/icon_keyword.png`"
            ></image>
            <text
              class="text-[28rpx]"
              :style="{
                color: ThemeColors.text.title,
              }"
              >灵境画猜</text
            >
          </view>
          <view
            class="h-full shrink-0 flex flex-row items-center justify-center"
          >
            <text
              class="text-[28rpx] mr-[12rpx]"
              :style="{
                color: ThemeColors.text.label,
              }"
              >已答
              <text class="text-[green]">{{ totalHistoryCount }}</text> 题</text
            >
            <image
              class="w-[30rpx] h-[30rpx]"
              :src="`@static/${iconThemeVersion}/icon_arraw_right.png`"
            ></image>
          </view>
        </view> -->
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ThemeColors } from "@/config/config";

interface Props {
  showHeader?: boolean;
}
withDefaults(defineProps<Props>(), {
  showHeader: true,
});
</script>

<style scoped></style>
