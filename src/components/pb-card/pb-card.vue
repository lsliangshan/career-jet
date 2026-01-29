<template>
  <view
    class="bg-white dark:bg-card-dark p-2.5 rounded-2xl shadow-sm border border-black/5 flex flex-col"
  >
    <view
      class="w-full"
      :style="{ height: renderImageHeight(info.config?.ratio) + 'rpx' }"
    >
      <image
        class="w-full h-full rounded-2xl overflow-hidden"
        :src="info.cover?.url"
        mode="aspectFill"
      />
    </view>

    <view class="px-0.5 mt-2.5">
      <text class="font-bold text-sm dark:text-white">{{ info.title }}</text>
      <view
        class="flex items-center gap-1 mt-0.5 opacity-60 dark:text-white/60 mt-[8rpx]"
      >
        <template v-if="type === 'all'">
          <text class="text-[10px] font-bold">{{ info.createAt }}</text>
        </template>
        <template v-else-if="type === 'like'">
          <svg-icon
            :src="`/static/${iconThemeVersion}/icon_like.svg`"
            class="w-[24rpx] h-[24rpx]"
            :color="ThemeColors.primary"
          ></svg-icon>
          <text class="text-[10px] font-bold">{{ info.likes }}</text>
        </template>
        <template v-else-if="type === 'view'">
          <svg-icon
            :src="`/static/${iconThemeVersion}/icon_eye.svg`"
            class="w-[28rpx] h-[28rpx]"
          ></svg-icon>
          <text class="text-[10px] font-bold">{{ info.views }}</text>
        </template>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { iconThemeVersion, ThemeColors } from "@/config/config";
import type { IPictureBook } from "@/types";
import { computed } from "vue";

interface Props {
  info: IPictureBook;
  type: string;
}

const props = defineProps<Props>();

const renderMinHeight = computed(() => {
  const r = ["16", "9"];
  const width = Number(r[0]);
  const height = Number(r[1]);

  return (338 * height) / width;
});

const renderMaxHeight = computed(() => {
  const r = ["3", "4"];
  const width = Number(r[0]);
  const height = Number(r[1]);

  return (338 * height) / width;
});

const renderImageHeight = computed(() => {
  return function (ratio: string) {
    const r = ratio ? ratio.split(":") : ["16", "9"];
    const width = Number(r[0]);
    const height = Number(r[1]);

    const newHeight = (338 * height) / width;
    return Math.min(
      Math.max(renderMinHeight.value, newHeight),
      renderMaxHeight.value
    );
  };
});
</script>

<style scoped></style>
