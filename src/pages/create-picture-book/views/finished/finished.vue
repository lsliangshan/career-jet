<template>
  <view class="w-full h-full flex flex-col items-center justify-center">
    <scroll-view scroll-y class="w-full h-full">
      <view class="w-full" :style="{ height: `${headerHeight}px` }"></view>

      <view
        class="w-full px-[32rpx] py-[24rpx] box-border flex flex-col gap-[24rpx]"
        :style="{
          minHeight: `calc(100% - ${headerHeight}px - 128rpx - ${safeBottom}px)`,
        }"
      >
        <view
          class="w-full min-h-[300rpx] rounded-[24rpx] bg-white p-6 shadow-sm border border-black/[0.03]"
        ></view>

        <view class="w-full flex flex-row items-start gap-[12rpx]">
          <view
            class="w-[40rpx] h-[40rpx] shrink-0 flex flex-row items-center justify-center"
          >
            <svg-icon
              :src="`/static/${iconThemeVersion}/icon_info.svg`"
              class="w-[32rpx] h-[32rpx]"
              :color="ThemeColors.primary"
            ></svg-icon>
          </view>
          <view class="w-full flex flex-row items-start justify-start">
            <text class="leading-[40rpx] text-[28rpx] text-[#888]"
              >提示：AI
              已经根据您的参数生成了精彩的故事内容。您可以直接确认，或进行微调以更符合您的期待。</text
            >
          </view>
        </view>
      </view>

      <view
        class="w-full px-[32rpx] box-border sticky left-0 bottom-0 bg-white bg-gradient-to-t from-background-light via-background-light to-transparent dark:from-background-dark dark:via-background-dark/95 z-40 flex flex-row items-center justify-center"
        :style="{
          height: `calc(128rpx + ${safeBottom}px)`,
          paddingBottom: `${safeBottom}px`,
        }"
      >
        <view
          class="w-full h-[88rpx] py-4 rounded-[24rpx] shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          :style="{
            backgroundColor: ThemeColors.primary,
            boxShadow: `0 10px 15px -3px ${ThemeColors.primary300}`,
          }"
          @click="handleFinished"
        >
          <text class="text-[34rpx] text-white font-bold"
            >创作完成，去阅读</text
          >
          <svg-icon
            :src="`/static/${iconThemeVersion}/icon_next.svg`"
            class="w-[32rpx] h-[32rpx]"
            :color="ThemeColors.text.white"
          ></svg-icon>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { iconThemeVersion, ThemeColors } from "@/config/config";
import { computed } from "vue";

const $emit = defineEmits<{
  (e: "finished"): void;
}>();

const safeTop = uni.getWindowInfo().safeAreaInsets?.top || 0;
const safeBottom = uni.getWindowInfo().safeAreaInsets?.bottom || 0;

const headerHeight = computed(() => {
  return safeTop + uni.upx2px(168);
});

function handleFinished() {
  $emit("finished");
}
</script>

<style scoped></style>
