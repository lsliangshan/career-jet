<template>
  <view class="w-full bg-white flex flex-col">
    <view
      class="w-full h-[128rpx] px-[32rpx] box-border flex flex-row items-center justify-between border-b border-b-[rgba(230,226,209,0.5)] border-b-[1rpx]">
      <text class="text-[32rpx] text-[#333] font-bold">选择主题</text>
      <view class="w-[128rpx] h-[128rpx] flex flex-row items-center justify-end active:scale-95 transition-all duration-300">
        <text class="text-[32rpx] font-bold" :style="{ color: mainColor }" @click="handleConfirm">确定</text>
      </view>
    </view>
    <view class="w-full flex-1 flex flex-row items-start">
      <view class="w-[275rpx] h-full border-r border-r-[rgba(230,226,209,0.5)] border-r-[1rpx]" :style="{
        backgroundColor: 'rgb(253,252,245)',
      }">
        <scroll-view class="w-full h-full" scroll-y>
          <view
            class="w-full h-[100rpx] px-[24rpx] box-border flex flex-row items-center border-b border-b-[rgba(230,226,209,0.5)] border-b-[1rpx]"
            v-for="(item, index) in renderMoralities" :key="item.en_name" @click="handleParentItemClick(index)">
            <text class="text-[28rpx] transition-all duration-300"
            :style="{ color: selectedThemeIndexes[0] === index ? mainColor : '#666' }">{{ item.name }}</text>
          </view>
        </scroll-view>
      </view>
      <view class="flex-1 h-full">
        <scroll-view class="w-full h-full" scroll-y>
          <view class="w-full py-[24rpx] px-[24rpx] box-border flex flex-col gap-[24rpx]">
            <view class="w-full px-[24rpx] py-[12rpx] box-border rounded-[16rpx] flex flex-col justify-center transition-all duration-300" v-for="(item, index) in renderMoralityChild"
              :key="item.en_name"
              :style="{
                backgroundColor: selectedThemeIndexes[1] === index ? 'rgba(255, 123, 172, 0.1)' : 'transparent',
              }"
              @click="handleItemClick(index)"
              >
              <text class="leading-[48rpx] text-[30rpx] font-[500] text-[#666]">{{ item.name }}</text>
              <text class="leading-[32rpx] text-[24rpx] text-[#958a50]">{{ item.description }}</text>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { mainColor, moralities } from "@/config/config";
import { computed, ref, watch } from "vue";

interface Props {
  activeIndex: number[];
}

const props = defineProps<Props>();

const $emit = defineEmits<{
  (e: 'on-confirm', data: {
    index: number[];
    value: string;
  }): void;
}>();

const selectedThemeIndexes = ref<number[]>([0, 0]);

const renderMoralities = computed(() => {
  return [
    ...moralities,
    {
      name: '自定义',
      en_name: 'Custom',
      description: '自定义输入',
      en_description: 'Custom Input',
      children: [
        {
          name: '自定义输入',
          en_name: 'Custom Input',
          description: '自定义输入',
          en_description: 'Custom Input',
        }
      ]
    },

  ];
});

const renderMoralityChild = computed(() => {
  return renderMoralities.value[selectedThemeIndexes.value[0]].children;
});

watch(() => props.activeIndex, (newVal) => {
  selectedThemeIndexes.value = [...newVal];
}, {
  immediate: true,
  deep: true,
});

function handleParentItemClick(index: number) {
  selectedThemeIndexes.value[0] = index;
  selectedThemeIndexes.value[1] = 0;
}

function handleItemClick(index: number) {
  selectedThemeIndexes.value[1] = index;
}

function handleConfirm() {
  $emit('on-confirm', {
    index: selectedThemeIndexes.value,
    value: selectedThemeIndexes.value[0] === renderMoralities.value.length - 1 ? '' : renderMoralityChild.value[selectedThemeIndexes.value[1]].name,
  });
}
</script>

<style lang="scss" scoped></style>