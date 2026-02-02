<template>
  <view
    class="w-full h-full rounded-[24rpx] bg-gray-200 flex flex-row items-center justify-center gap-[12rpx] transition-all duration-300"
    :class="[
      isRegenerating || disabled
        ? 'opacity-50 pointer-events-none'
        : 'opacity-100 active:scale-95 pointer-events-auto',
    ]"
    @click="handleClick"
  >
    <svg-icon
      :src="`/static/${iconThemeVersion}/icon_generate.svg`"
      :style="{
        width: `${props.iconSize}rpx`,
        height: `${props.iconSize}rpx`,
      }"
      :color="isRegenerating ? ThemeColors.text.body : ThemeColors.primary"
    ></svg-icon>
    <text
      :style="{
        color: isRegenerating ? ThemeColors.text.body : ThemeColors.primary,
        fontSize: `${props.fontSize}rpx`,
      }"
      >{{ isRegenerating ? "正在生成..." : "重新生成" }}</text
    >
  </view>
</template>

<script setup lang="ts">
import { iconThemeVersion, ThemeColors } from "@/config/config";
import { nextTick, ref } from "vue";

interface Props {
  disabled: boolean;
  clickHandler: () => Promise<void>;
  fontSize?: number;
  iconSize?: number;
}

const props = withDefaults(defineProps<Props>(), {
  fontSize: 32,
  iconSize: 32,
});

const isRegenerating = ref(false);

async function handleClick() {
  if (props.disabled || isRegenerating.value) {
    return;
  }
  isRegenerating.value = true;
  await props.clickHandler();
  nextTick(() => {
    isRegenerating.value = false;
  });
}
</script>
