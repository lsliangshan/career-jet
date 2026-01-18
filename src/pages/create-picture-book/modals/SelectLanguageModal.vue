<template>
  <view class="w-full max-h-[80vh] bg-white flex flex-col">
    <view
      class="w-full h-[128rpx] px-[32rpx] box-border flex flex-row items-center justify-between border-b border-b-[rgba(230,226,209,0.5)] border-b-[1rpx]">
      <text class="text-[32rpx] text-[#333] font-bold">选择语言</text>
      <view
        class="w-[128rpx] h-[128rpx] flex flex-row items-center justify-end active:scale-95 transition-all duration-300">
        <text class="text-[32rpx] font-bold" :style="{ color: mainColor }" @click="handleConfirm">确定</text>
      </view>
    </view>
    <view class="w-full flex-1 flex flex-row items-start">
      <scroll-view class="w-full" scroll-y :style="{ height: `calc(80vh - 128rpx)` }">
        <view class="w-full py-[24rpx] px-[24rpx] box-border flex flex-col gap-[24rpx]">
          <view
            class="w-full px-[24rpx] py-[12rpx] box-border rounded-[16rpx] flex flex-row items-center justify-center gap-[24rpx] transition-all duration-300"
            v-for="(item, index) in languages" :key="item.en_name" :style="{
              backgroundColor: selectedLanguageIndex === index ? 'rgba(255, 123, 172, 0.1)' : 'transparent',
            }" @click="handleItemClick(index)">
            <view class="w-[160rpx] h-[107rpx] border border-[1rpx] border-[#f0f0f0] rounded-[16rpx] overflow-hidden">
              <image :src="item.avatar" lazy-load @click="previewImage([item.avatar])" class="w-full h-full" mode="aspectFill"></image>
            </view>
            <view class="flex-1 flex flex-col justify-center">
              <text class="leading-[48rpx] text-[30rpx] font-[500] text-[#666]">{{ item.name }}</text>
              <text class="leading-[32rpx] text-[24rpx] text-[#958a50]">{{ item.en_name }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { languages, mainColor } from "@/config/config";
import { previewImage } from "@/utils";
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

const selectedLanguageIndex = ref<number>(0);

watch(() => props.activeIndex, (newVal) => {
  selectedLanguageIndex.value = newVal;
}, {
  immediate: true,
  deep: true,
});

function handleItemClick(index: number) {
  selectedLanguageIndex.value = index;
}

function handleConfirm() {
  $emit('on-confirm', {
    index: selectedLanguageIndex.value,
    value: languages[selectedLanguageIndex.value].name,
  });
}
</script>

<style lang="scss" scoped></style>