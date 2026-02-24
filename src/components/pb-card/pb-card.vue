<template>
  <view
    class="bg-white dark:bg-card-dark p-2.5 rounded-2xl border border-black/5 flex flex-col"
    :class="defaultTheme.shadow.main"
    @click="handleViewPictureBook(info)"
  >
    <view
      class="relative w-full"
      :style="{ height: renderImageHeight(info.config?.ratio) + 'rpx' }"
    >
      <image
        class="w-full h-full rounded-xl overflow-hidden"
        :src="info.cover?.url"
        mode="aspectFill"
        @error="handleImageError"
      />
      <view
        class="absolute left-0 top-0 w-full h-full bg-[#e8e8e8] flex flex-row items-center justify-center"
        v-if="!info.cover?.url || imageLoadError"
      >
        <image
          class="w-full h-full z-[9]"
          :src="
            isHorizontalRatio(info.config.ratio)
              ? 'https://img.liangqy.com/crawlerjet/picture_book/img/pb_default_horizontal.png'
              : 'https://img.liangqy.com/crawlerjet/picture_book/img/pb_default_vertical.png'
          "
          mode="aspectFill"
          @error="handleImageError"
        />
      </view>
    </view>

    <view class="px-0.5 mt-2.5">
      <text class="font-bold text-sm dark:text-white">{{ info.title }}</text>
      <view
        class="flex items-center gap-1 mt-0.5 opacity-60 dark:text-white/60 mt-[8rpx]"
      >
        <template v-if="type === 'all' || type === 'draft'">
          <text class="text-[10px] font-bold">{{ info.createAt }}</text>
        </template>
        <template v-else-if="type === 'favorite'">
          <text class="text-[10px] font-bold">{{ info.likeTime }}</text>
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
          <text class="text-[10px] font-bold"
            >{{ formatReadCount(info.views) }}阅读</text
          >
        </template>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { iconThemeVersion, ThemeColors, defaultTheme } from "@/config/config";
import type { IPictureBook } from "@/types";
import { computed, ref } from "vue";
import { formatReadCount } from "@/utils";
import {
  navigateToEditPictureBook,
  navigateToPictureBookDetail,
} from "@/utils/router";

interface Props {
  info: IPictureBook;
  type: string;
}

const props = defineProps<Props>();

const imageLoadError = ref(false);

const isHorizontalRatio = computed(() => {
  return (ratio: string) => {
    return Number(ratio.split(":")[0]) > Number(ratio.split(":")[1]);
  };
});

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

function handleViewPictureBook(pb: IPictureBook) {
  if (props.type === "draft") {
    navigateToEditPictureBook(pb);
    return;
  }
  navigateToPictureBookDetail(pb);
}

function handleImageError() {
  imageLoadError.value = true;
}
</script>

<style scoped></style>
