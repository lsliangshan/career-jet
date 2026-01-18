<template>
  <view class="w-full max-h-[80vh] bg-white flex flex-col">
    <view
      class="w-full h-[128rpx] px-[32rpx] box-border flex flex-row items-center justify-between border-b border-b-[rgba(230,226,209,0.5)] border-b-[1rpx]">
      <text class="text-[32rpx] text-[#333] font-bold">选择比例</text>
      <view
        class="w-[128rpx] h-[128rpx] flex flex-row items-center justify-end active:scale-95 transition-all duration-300">
        <text class="text-[32rpx] font-bold" :style="{ color: mainColor }" @click="handleConfirm">确定</text>
      </view>
    </view>
    <view class="w-full flex-1 flex flex-row items-start">
      <scroll-view class="w-full" scroll-y :style="{ maxHeight: `calc(80vh - 128rpx)` }">
        <view class="w-full py-[24rpx] px-[24rpx] box-border flex flex-col gap-[12rpx]">
          <view
            class="w-full px-[24rpx] py-[24rpx] box-border rounded-[16rpx] flex flex-row items-center justify-center gap-[24rpx] transition-all duration-300"
            v-for="(item, index) in ratios" :key="item" :style="{
              backgroundColor: selectedRatioIndex === index ? 'rgba(255, 123, 172, 0.1)' : 'transparent',
            }" @click="handleItemClick(index)">
            <view class="flex-1 flex flex-col justify-center">
              <text class="leading-[48rpx] text-[30rpx] font-[500] text-[#666]">{{ item }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ratios, mainColor } from "@/config/config";
import { ref, watch } from "vue";

interface Props {
  activeIndex: number;
}

const props = defineProps<Props>();

const $emit = defineEmits<{
  (e: 'on-confirm', data: {
    index: number;
    value: string;
  }): void;
}>();

const selectedRatioIndex = ref<number>(0);

watch(() => props.activeIndex, (newVal) => {
  selectedRatioIndex.value = newVal;
}, {
  immediate: true,
  deep: true,
});

function handleItemClick(index: number) {
  selectedRatioIndex.value = index;
}

function handleConfirm() {
  $emit('on-confirm', {
    index: selectedRatioIndex.value,
    value: ratios[selectedRatioIndex.value],
  });
}
</script>

<style lang="scss" scoped></style>