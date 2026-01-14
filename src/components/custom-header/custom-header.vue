<template>
  <view
    class="w-full absolute left-0 top-0 z-10 border-b border-[1rpx] flex flex-row items-center justify-start"
    :style="{
      backgroundColor: bgColor,
      height: `calc(88rpx + ${safeTop}px)`,
      paddingTop: `${safeTop}px`,
      borderColor: bgColor,
    }"
  >
    <view
      class="relative w-full h-[88rpx] flex flex-row items-center"
      :style="{ width: `calc(${safeTitleWidth}px)` }"
    >
      <view
        class="absolute left-0 top-0 w-[88rpx] h-[88rpx] shrink-0 flex flex-row items-center justify-center"
        @click="handleBack"
        v-if="showBack"
      >
        <image class="w-[40rpx] h-[40rpx]" src="@static/icon_back.png"></image>
      </view>
      <view
        class="w-full h-full box-border flex flex-row items-center justify-center"
        :class="[
          showBack ? 'pl-[88rpx]' : 'pl-0',
          titleAlign === 'start'
            ? 'justify-start'
            : titleAlign === 'center'
            ? 'justify-center'
            : 'justify-end',
          !showBack && titleAlign == 'start' ? 'pl-[32rpx]' : 'pl-0',
        ]"
      >
        <text
          class="text-[32rpx] font-bold text-[#000] line-clamp-1 overflow-hidden text-ellipsis break-all"
          >{{ title }}</text
        >
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from "vue";

interface Props {
  title?: string;
  showBack?: boolean;
  titleAlign?: "start" | "center" | "end";
  bgColor?: string;
}

withDefaults(defineProps<Props>(), {
  title: "",
  showBack: false,
  titleAlign: "center",
  bgColor: "#fff",
});

const safeTop = uni.getWindowInfo().safeAreaInsets?.top || 0;

const { left: safeTitleWidth } = uni.getMenuButtonBoundingClientRect();

onMounted(() => {
  // nextTick(() => {
  //   safeTop.value = uni.getWindowInfo().safeArea?.top || 88;
  // });
});

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

<style scoped></style>
