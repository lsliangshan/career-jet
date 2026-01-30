<template>
  <view
    class="w-full fixed top-0 left-0 z-10 bg-[rgba(248,248,245,0.5)] backdrop-blur-md border-none flex flex-row items-center"
    :style="{
      height: `calc(80rpx +  ${safeTop}px)`,
      paddingTop: `${safeTop}px`,
    }"
  >
    <view
      class="w-[80rpx] h-[80rpx] shrink-0 flex flex-row items-center justify-center"
      @click="handleBack"
    >
      <svg-icon
        class="w-[32rpx] h-[32rpx]"
        :src="`/static/${iconThemeVersion}/icon_back.svg`"
        color="#000"
      />
    </view>
    <view
      class="z-[999] h-[80rpx] pr-[24rpx] box-border flex flex-row items-center"
      :style="{ width: `calc(${safeTitleWidth}px - 80rpx)` }"
    >
      <view
        class="w-full h-full box-border flex flex-row items-center justify-center gap-[8rpx]"
      >
        <view
          class="h-[16rpx] rounded-full"
          v-for="(step, index) in createPictureBookSteps"
          :key="step.value"
          :style="{
            width: index === currentStepIndex ? '48rpx' : '16rpx',
            backgroundColor:
              index === currentStepIndex
                ? ThemeColors.primary
                : ThemeColors.text.disabled,
          }"
        ></view>
      </view>
    </view>
  </view>
  <Layout :hasHeader="false">
    <swiper
      class="w-full h-full"
      :current="currentStepIndex"
      @change="handleChange"
    >
      <swiper-item
        v-for="(step, index) in createPictureBookSteps"
        :key="step.value"
      >
        <view class="w-full h-full flex flex-col items-center justify-center">
          <text class="text-[32rpx] font-bold">{{ step.label }}</text>
        </view>
      </swiper-item>
    </swiper>
  </Layout>
</template>

<script setup lang="ts">
import Layout from "@/components/layout/layout.vue";
import { iconThemeVersion, ThemeColors } from "@/config/config";
import { ref } from "vue";

const safeBottom = uni.getWindowInfo().safeAreaInsets?.bottom || 0;
const safeTop = uni.getWindowInfo().safeAreaInsets?.top || 0;

const { left: safeTitleWidth } = uni.getMenuButtonBoundingClientRect();

const createPictureBookSteps = [
  {
    label: "参数设置",
    value: "config",
  },
  {
    label: "确认绘本故事",
    value: "confirm-story",
  },
  {
    label: "确认绘本角色",
    value: "confirm-roles",
    desc: "这些是故事里的主角们，满意吗？",
  },
  {
    label: "确认绘本场景",
    value: "confirm-scenes",
    desc: "这是绘本里的奇妙世界，满意吗？",
  },
  {
    label: "确认绘本封面",
    value: "confirm-cover",
    desc: "为你的故事选一个最漂亮的封面吧！",
  },
  {
    label: "确认绘本音频",
    value: "confirm-audio",
    desc: "为你的故事挑选一个好听的声音吧！",
  },
  {
    label: "完成",
    value: "finished",
  },
];

const currentStepIndex = ref(0);

function handleChange(e: any) {
  console.log(">>>> handleChange: ", e);
  currentStepIndex.value = e.detail.current;
}

function handleBack() {
  uni.navigateBack({
    fail: () => {
      uni.reLaunch({
        url: "/pages/index/index",
      });
    },
  });
}
</script>

<style lang="scss"></style>
