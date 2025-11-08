<template>
  <view
    class="w-full fixed left-0 top-0 z-10 border-b border-[1rpx] flex flex-row items-center justify-start bg-[#fff]"
    :style="{
      height: `calc(88rpx + ${safeTop}px)`,
      paddingTop: `${safeTop}px`,
      borderColor: ThemeColors.border,
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
          class="text-[32rpx] font-bold text-[#000] clamp-1 overflow-hidden text-ellipsis whitespace-nowrap break-all"
          >{{ title }}</text
        >
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ThemeColors } from "@/config/config";
import { onMounted, ref } from "vue";

interface Props {
  title?: string;
  showBack?: boolean;
  titleAlign?: "start" | "center" | "end";
}

withDefaults(defineProps<Props>(), {
  title: "",
  showBack: false,
  titleAlign: "center",
});

const safeTop = ref(uni.getWindowInfo().safeAreaInsets?.top || 0);

const { left: safeTitleWidth } = uni.getMenuButtonBoundingClientRect();

onMounted(() => {
  safeTop.value = uni.getWindowInfo().safeAreaInsets?.top || 0;
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
