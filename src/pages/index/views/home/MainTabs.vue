<template>
  <view
    class="relative w-full h-full p-[8rpx] bg-white dark:bg-card-dark rounded-full shadow-sm border border-black/5 flex flex-row items-center"
  >
    <view
      class="absolute left-0 top-0 w-[33.33%] h-full p-[8rpx] box-border flex flex-row items-center justify-center transition-all duration-300"
      :style="{
        transform: `translateX(${modelValue * 100}%)`,
      }"
    >
      <view
        class="w-full h-full rounded-full"
        :style="{
          backgroundColor: ThemeColors.primary,
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
import { tabs, ThemeColors } from "@/config/config";

interface Props {
  modelValue: number;
}

defineProps<Props>();

const $emit = defineEmits<{
  (e: "update:modelValue", index: number): void;
}>();

function handleClick(index: number) {
  $emit("update:modelValue", index);
}
</script>

<style scoped></style>
