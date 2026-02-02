<template>
  <view
    class="bg-white dark:bg-card-dark p-2.5 rounded-2xl shadow-sm border border-black/5 flex flex-col"
  >
    <view
      class="relative w-full"
      :style="{ height: renderImageHeight(ratio) + 'rpx' }"
    >
      <image
        class="w-full h-full rounded-xl overflow-hidden"
        :src="info.url"
        mode="aspectFill"
        @error="handleImageError"
      />
      <view
        class="absolute left-0 top-0 w-full h-full bg-[#e8e8e8] flex flex-row items-center justify-center"
        v-if="!info.url || imageLoadError"
      >
        <image
          class="w-full h-full z-[9]"
          :src="
            isHorizontalRatio(ratio)
              ? 'https://img.liangqy.com/crawlerjet/picture_book/img/pb_default_horizontal.png'
              : 'https://img.liangqy.com/crawlerjet/picture_book/img/pb_default_vertical.png'
          "
          mode="aspectFill"
          @error="handleImageError"
        />
      </view>
      <view
        class="absolute left-0 top-0 w-full h-full z-[99] flex flex-row items-center justify-center"
        v-if="isLoading"
      >
        <CustomLoader />
      </view>
    </view>

    <view class="px-0.5 mt-2.5">
      <text class="font-bold text-sm dark:text-white" v-if="!!title">{{
        title
      }}</text>
      <text class="text-[10px] font-bold" v-if="!!content">{{ content }}</text>
    </view>

    <view class="w-full h-[80rpx] mt-2.5 flex flex-row items-center">
      <BtnRegenerate
        class="w-[240rpx] h-[80rpx]"
        :disabled="false"
        :fontSize="28"
        :iconSize="28"
        :clickHandler="handleRegenerate"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import CustomLoader from "../custom-loader/custom-loader.vue";
import BtnRegenerate from "../btn-regenerate/btn-regenerate.vue";

interface Props {
  type: "role" | "scene" | "cover";
  info: any;
  isLoading: boolean;
  ratio: string;
  regenerateHandler?: () => Promise<void>;
  title?: string;
  content?: string;
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

function handleImageError() {
  imageLoadError.value = true;
}

async function handleRegenerate() {
  if (!props.regenerateHandler) {
    return Promise.resolve();
  }
  return await props.regenerateHandler();
}
</script>

<style scoped></style>
