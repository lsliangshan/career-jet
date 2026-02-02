<template>
  <view class="w-full bg-white flex flex-col">
    <view
      class="w-full h-[128rpx] px-[32rpx] box-border flex flex-row items-center justify-between border-b border-b-[rgba(230,226,209,0.5)] border-b-[1rpx]"
    >
      <text class="text-[32rpx] text-[#333] font-bold"
        >重新生成角色【{{ role?.name }}】</text
      >
      <view
        class="w-[128rpx] h-[128rpx] flex flex-row items-center justify-end active:opacity-80 transition-all duration-300"
        @click="closeModal"
      >
        <svg-icon
          :src="`/static/${iconThemeVersion}/icon_close.svg`"
          class="w-[48rpx] h-[48rpx]"
          :color="ThemeColors.text.body"
        ></svg-icon>
      </view>
    </view>

    <view class="w-full flex-1 flex flex-row items-start">
      <scroll-view
        class="w-full"
        scroll-y
        :style="{ maxHeight: `calc(80vh - 128rpx)` }"
      >
        <textarea
          class="w-full min-h-full text-[34rpx] text-[#666] px-[24rpx] py-[32rpx] box-border"
          :maxlength="-1"
          auto-height
          placeholder="请输入角色描述"
          v-model="role.prompt"
        />
      </scroll-view>
    </view>

    <view
      class="w-full h-[108rpx] px-[32rpx] box-border flex flex-row items-center justify-center shrink-0"
    >
      <view
        class="h-[88rpx] px-[64rpx] rounded-[24rpx] box-border flex flex-row items-center justify-center gap-[12rpx] transition-all duration-300"
        :style="{
          backgroundColor: ThemeColors.primary,
        }"
        @click="handleConfirm"
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
  </view>
</template>

<script setup lang="ts">
import type { IRoleItem } from "@/types";
import { iconThemeVersion, ThemeColors } from "@/config/config";
import { ref } from "vue";

interface Props {
  role: IRoleItem;
}

const props = defineProps<Props>();

const $emit = defineEmits<{
  (e: "on-close"): void;
  (e: "on-confirm", params: { role: IRoleItem }): void;
}>();

const safeBottom = uni.getWindowInfo().safeAreaInsets?.bottom || 0;

const isRegenerating = ref(false);

function closeModal() {
  $emit("on-close");
}

function handleConfirm() {
  $emit("on-confirm", {
    role: props.role,
  });
}
</script>

<style scoped></style>
