<template>
  <view
    class="relative p-[8rpx] bg-white dark:bg-card-dark rounded-full border border-black/5 flex flex-row items-center"
    :style="{
      width: width,
      height: height,
    }"
    :class="defaultTheme.shadow.main"
  >
    <view
      class="absolute left-0 top-0 h-full p-[8rpx] box-border flex flex-row items-center justify-center transition-all duration-300"
      :style="{
        transform: `translateX(${modelValue * 100}%)`,
        width: `${100 / tabs.length}%`,
      }"
    >
      <view
        class="w-full h-full rounded-full transition-colors duration-300 delay-100"
        :style="{
          backgroundColor: renderColor,
        }"
      ></view>
    </view>
    <view
      v-for="(tab, index) in tabs"
      :key="index"
      class="w-full h-full z-[9] flex flex-row items-center justify-center"
      @click="handleClick(index)"
    >
      <text
        class="text-[28rpx] font-medium transition-all duration-300"
        :style="{
          color: modelValue === index ? 'white' : ThemeColors.text.body,
        }"
        >{{ tab.name }}</text
      >
    </view>
  </view>
</template>

<script setup lang="ts">
import { ThemeColors, defaultTheme } from "@/config/config";
import { computed } from "vue";

interface Props {
  modelValue: number;
  tabs: any;
  width?: any;
  height?: any;
  colors?: any[];
}

const props = withDefaults(defineProps<Props>(), {
  width: "60vw",
  height: "88rpx",
  colors: () => [ThemeColors.primary],
});

const $emit = defineEmits<{
  (e: "update:modelValue", index: number): void;
}>();

const renderColor = computed(() => {
  if (props.modelValue >= props.colors.length) {
    return props.colors[0];
  }
  return props.colors[props.modelValue];
});

function handleClick(index: number) {
  $emit("update:modelValue", index);
}
</script>

<style scoped></style>
