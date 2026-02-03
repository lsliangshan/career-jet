<template>
  <view class="w-full bg-white flex flex-col">
    <view
      class="w-full h-[128rpx] px-[32rpx] box-border flex flex-row items-center justify-between border-b border-b-[rgba(230,226,209,0.5)] border-b-[1rpx]"
    >
      <text class="text-[32rpx] text-[#333] font-bold">选择比例</text>
      <view
        class="w-[128rpx] h-[128rpx] flex flex-row items-center justify-end active:opacity-80 transition-all duration-300"
        @click="handleClose"
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
        <view
          class="w-full py-[24rpx] px-[24rpx] box-border flex flex-col gap-[24rpx]"
        >
          <view
            class="w-full bg-gray-50 px-[24rpx] py-[12rpx] box-border rounded-[16rpx] flex flex-col justify-center transition-all duration-300 border border-[2rpx]"
            v-for="(item, index) in ratios"
            :key="item"
            :style="{
              backgroundColor:
                selectedRatioIndex === index
                  ? ThemeColors.primary100
                  : 'bg-gray-50',
              borderColor:
                selectedRatioIndex === index
                  ? ThemeColors.primary
                  : 'transparent',
            }"
            @click="handleItemClick(index)"
          >
            <text class="leading-[64rpx] text-[30rpx] font-[500] text-[#666]">{{
              item
            }}</text>
          </view>
        </view>
      </scroll-view>
    </view>
    <view
      class="w-full px-[32rpx] box-border flex flex-row items-center justify-center shrink-0"
      :style="{
        height: `calc(108rpx + ${safeBottom}px)`,
        paddingBottom: `${safeBottom}px`,
      }"
    >
      <view
        class="w-full h-[88rpx] rounded-[16rpx] flex flex-row items-center justify-center active:scale-95 transition-all duration-300"
        :style="{
          backgroundColor: ThemeColors.primary,
        }"
        @click="handleConfirm"
      >
        <text class="text-[32rpx] font-bold text-white">确定</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { iconThemeVersion, ratios, ThemeColors } from "@/config/config";
import { ref, watch } from "vue";

interface Props {
  activeIndex: number;
}

const props = defineProps<Props>();

const $emit = defineEmits<{
  (
    e: "on-confirm",
    data: {
      index: number;
      value: string;
    }
  ): void;
  (e: "on-close"): void;
}>();

const safeBottom = uni.getWindowInfo().safeAreaInsets?.bottom || 0;

const selectedRatioIndex = ref<number>(0);

watch(
  () => props.activeIndex,
  (newVal) => {
    selectedRatioIndex.value = newVal;
  },
  {
    immediate: true,
    deep: true,
  }
);

function handleItemClick(index: number) {
  selectedRatioIndex.value = index;
}

function handleConfirm() {
  $emit("on-confirm", {
    index: selectedRatioIndex.value,
    value: ratios[selectedRatioIndex.value],
  });
}

function handleClose() {
  $emit("on-close");
}
</script>

<style lang="scss" scoped></style>
