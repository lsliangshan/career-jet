<template>
  <view
    class="w-full h-full bg-gray-200 flex flex-row items-center justify-center gap-[12rpx] transition-all duration-300"
    :class="[
      isRegenerating || disabled
        ? 'opacity-50 pointer-events-none'
        : 'opacity-100 active:scale-95 pointer-events-auto',
      defaultTheme.rounded.button,
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
import { defaultTheme, iconThemeVersion, ThemeColors } from "@/config/config";

interface Props {
  disabled: boolean;
  isRegenerating: boolean;
  fontSize?: number;
  iconSize?: number;
}

const props = withDefaults(defineProps<Props>(), {
  fontSize: 32,
  iconSize: 32,
});

const $emit = defineEmits<{
  (e: "on-regenerate"): void;
}>();

async function handleClick() {
  if (props.disabled || props.isRegenerating) {
    return;
  }
  $emit("on-regenerate");
}
</script>
