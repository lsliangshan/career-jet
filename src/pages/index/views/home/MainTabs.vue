<template>
  <view
    class="w-full h-full p-[8rpx] bg-white dark:bg-card-dark rounded-full shadow-sm border border-black/5 flex flex-row items-center"
  >
    <view
      v-for="(tab, index) in tabs"
      :key="index"
      class="w-full h-full flex flex-row items-center justify-center rounded-full"
      :style="{
        backgroundColor: modelValue === index ? ThemeColors.primary : 'white',
      }"
      @click="handleClick(index)"
    >
      <text
        class="text-[28rpx] font-medium"
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
