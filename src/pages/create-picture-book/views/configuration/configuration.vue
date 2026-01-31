<template>
  <view class="w-full h-full flex flex-col items-center justify-center">
    <scroll-view scroll-y class="w-full h-full">
      <view class="w-full" :style="{ height: `${headerHeight}px` }"></view>

      <view
        class="w-full px-[32rpx] py-[24rpx] box-border flex flex-col gap-[24rpx]"
      >
        <view
          class="w-full h-[108rpx] bg-white rounded-[24rpx] p-[24rpx] box-border shadow-sm border border-[rgba(255,255,255,0.03)] flex flex-row items-center justify-between"
          @click="openModal(EModalComponent.CHOOSE_THEME_MODAL, {})"
        >
          <view class="w-full h-full flex flex-row items-center gap-[16rpx]">
            <view
              class="w-[80rpx] h-[80rpx] box-border rounded-full flex flex-row items-center justify-center shrink-0"
              :style="{ backgroundColor: ThemeColors.primary200 }"
            >
              <svg-icon
                :src="`/static/${iconThemeVersion}/icon_start_read.svg`"
                class="w-[32rpx] h-[32rpx]"
                :color="ThemeColors.primary"
              ></svg-icon>
            </view>
            <text class="text-[32rpx] font-bold">绘本名称</text>
          </view>

          <view
            class="h-full flex flex-row items-center justify-end gap-[8rpx] shrink-0"
          >
            <view class="h-full flex flex-row items-center justify-end">
              <text
                class="text-[28rpx]"
                :style="{ color: ThemeColors.text.body }"
                >{{ formData.theme }}</text
              >
            </view>
            <view
              class="w-[32rpx] h-full flex flex-row items-center justify-center"
            >
              <svg-icon
                :src="`/static/${iconThemeVersion}/icon_arrow_right.svg`"
                class="w-[24rpx] h-[24rpx]"
                :color="ThemeColors.text.disabled"
              ></svg-icon>
            </view>
          </view>
        </view>

        <view
          class="w-full h-[108rpx] bg-white rounded-[24rpx] p-[24rpx] box-border shadow-sm border border-[rgba(255,255,255,0.03)] flex flex-row items-center justify-between"
          @click="openModal(EModalComponent.CHOOSE_RATIO_MODAL, {})"
        >
          <view class="w-full h-full flex flex-row items-center gap-[16rpx]">
            <view
              class="w-[80rpx] h-[80rpx] box-border rounded-full flex flex-row items-center justify-center shrink-0"
              :style="{ backgroundColor: ThemeColors.primary200 }"
            >
              <svg-icon
                :src="`/static/${iconThemeVersion}/icon_ratio.svg`"
                class="w-[32rpx] h-[32rpx]"
                :color="ThemeColors.primary"
              ></svg-icon>
            </view>
            <text class="text-[32rpx] font-bold">绘本比例</text>
          </view>

          <view
            class="h-full flex flex-row items-center justify-end gap-[8rpx] shrink-0"
          >
            <view class="h-full flex flex-row items-center justify-end">
              <text
                class="text-[28rpx]"
                :style="{ color: ThemeColors.text.body }"
                >{{ formData.ratio }}</text
              >
            </view>
            <view
              class="w-[32rpx] h-full flex flex-row items-center justify-center"
            >
              <svg-icon
                :src="`/static/${iconThemeVersion}/icon_arrow_right.svg`"
                class="w-[24rpx] h-[24rpx]"
                :color="ThemeColors.text.disabled"
              ></svg-icon>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { iconThemeVersion, ThemeColors } from "@/config/config";
import { computed, inject, ref } from "vue";
import { EModalComponent } from "../../modals/types";

const $emit = defineEmits<{
  (e: "open-modal", params: { component: string; data: any }): void;
}>();

const formData = inject<any>("formData");

const safeTop = uni.getWindowInfo().safeAreaInsets?.top || 0;

const headerHeight = computed(() => {
  return safeTop + uni.upx2px(168);
});
const offsetTop = computed(() => {
  return safeTop + uni.upx2px(280);
});

function openModal(component: string, data: any) {
  $emit("open-modal", {
    component,
    data,
  });
}
</script>

<style scoped></style>
