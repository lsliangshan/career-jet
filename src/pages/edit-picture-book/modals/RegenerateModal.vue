<template>
  <view class="w-full h-full flex flex-row items-end justify-center">
    <view
      class="relative w-full h-full rounded-[24rpx] bg-[#fff] transition-all duration-300 shadow-[0_0_16rpx_2rpx_rgba(0,0,0,0.1)] flex flex-col"
    >
      <view
        class="w-full h-[88rpx] shrink-0 px-[24rpx] box-border border-b border-b-[1rpx] border-[#f0f0f0] flex flex-row items-center"
      >
        <text class="text-[32rpx] font-bold text-[#333]"
          >重新生成{{ renderType }}</text
        >
      </view>
      <view class="w-full h-[30vh] flex flex-row items-center justify-center">
        <scroll-view type="custom" :scroll-y="true" class="w-full h-full">
          <textarea
            class="w-full min-h-full text-[34rpx] text-[#666] px-[24rpx] py-[32rpx] box-border"
            :maxlength="-1"
            auto-height
            placeholder="请输入角色描述"
            v-model="info.prompt"
          />
        </scroll-view>
      </view>
      <view
        class="sticky bottom-0 left-0 z-[99] w-full shrink-0 bg-[#fff] border-t border-t-[1rpx] border-[#f0f0f0] flex flex-row items-center justify-center gap-[24rpx]"
        :style="{
          height: `calc(${safeBottom}px + 100rpx)`,
          paddingBottom: `${safeBottom}px`,
        }"
      >
        <view
          class="h-[80rpx] px-[64rpx] bg-[#eeeeee] rounded-[24rpx] box-border flex flex-row items-center justify-center gap-[12rpx] active:scale-95 transition-all duration-300"
          @click="closeModal"
        >
          <text
            class="text-[32rpx]"
            :style="{
              color: ThemeColors.primary,
            }"
            >取消</text
          >
        </view>
        <view
          class="h-[80rpx] px-[64rpx] rounded-[24rpx] box-border flex flex-row items-center justify-center gap-[12rpx] transition-all duration-300"
          :class="[
            isRegenerating
              ? 'opacity-50 pointer-events-none'
              : 'opacity-100 active:scale-95 pointer-events-auto',
          ]"
          :style="{
            backgroundColor: ThemeColors.primary,
          }"
          @click="handleRegenerate"
        >
          <svg-icon
            :src="`/static/${iconThemeVersion}/icon_generate.svg`"
            class="w-[32rpx] h-[32rpx]"
            color="#fff"
          />
          <text class="text-[32rpx] text-[#fff]">{{
            isRegenerating ? "正在生成" : "重新生成"
          }}</text>
        </view>
      </view>

      <view
        class="absolute right-0 top-0 z-[99] w-[88rpx] h-[88rpx] flex flex-row items-center justify-center"
        @click="closeModal"
      >
        <svg-icon
          :src="`/static/${iconThemeVersion}/icon_close.svg`"
          class="w-[32rpx] h-[32rpx]"
          color="#000"
        />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { iconThemeVersion, ThemeColors } from "@/config/config";
import { requestGenerateRoleOrScene } from "@/request";
import type { IPictureBook } from "@/types";
import { computed, inject, nextTick, type Ref, ref } from "vue";

interface Props {
  info: any;
  type: "role" | "scene" | "cover";
  ratio: string;
  pictureStyle: string;
}

const props = defineProps<Props>();

const $emit = defineEmits<{
  (e: "on-close"): void;
  (
    e: "on-start-regenerate",
    params: {
      type: "role" | "scene" | "cover";
      id: string;
    }
  ): void;
  (
    e: "on-regenerate",
    params: {
      type: "role" | "scene" | "cover";
      id: string;
      data: any;
    }
  ): void;
}>();

const pbDetail = inject<Ref<IPictureBook | undefined>>("pbDetail");

const safeBottom = uni.getWindowInfo().safeAreaInsets?.bottom || 0;

// 重新生成中
const isRegenerating = ref(false);

const renderType = computed(() => {
  if (props.type === "role") {
    return `角色【${props.info.name}】`;
  } else if (props.type === "scene") {
    return `场景【${props.info.index}】`;
  } else if (props.type === "cover") {
    return "封面";
  }
});

function closeModal() {
  $emit("on-close");
}

async function handleRegenerate() {
  if (!props.info) {
    return;
  }
  if (isRegenerating.value) {
    return;
  }
  isRegenerating.value = true;
  $emit("on-start-regenerate", {
    type: props.type,
    id: props.info.id,
  });

  let requestParams: any = {
    id: props.info.id,
    prompt: `a children's book illustation style by ${props.pictureStyle}, ${props.info.prompt}`,
    ratio: props.ratio,
  };
  if (props.type === "scene") {
    // requestParams.imageUrls = [props.info.url];
  }

  const res = await requestGenerateRoleOrScene({
    id: props.info.id,
    prompt: `a children's book illustation style by ${props.pictureStyle}, ${props.info.prompt}`,
    ratio: props.ratio,
  });

  if (res.code === 200) {
    closeModal();

    $emit("on-regenerate", {
      type: props.type,
      id: props.info.id,
      data: res.data,
    });
  } else {
    uni.showToast({
      title: "生成角色失败，请稍后再试",
      icon: "none",
    });
  }
  nextTick(() => {
    isRegenerating.value = false;
  });
}
</script>

<style scoped></style>
