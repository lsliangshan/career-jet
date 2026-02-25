<template>
  <view class="w-full bg-white flex flex-col max-h-[80vh]">
    <view
      class="w-full h-[128rpx] px-[32rpx] box-border flex flex-row items-center justify-between border-b border-b-[rgba(230,226,209,0.5)] border-b-[1rpx]"
    >
      <text class="text-[32rpx] text-[#333] font-bold">选择主题</text>
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
      <view class="w-[275rpx] h-full bg-gray-50">
        <scroll-view class="w-full" scroll-y>
          <view
            class="w-full h-[100rpx] px-[24rpx] box-border flex flex-row items-center rounded-[4rpx] border-l border-l-[6rpx]"
            v-for="(item, index) in renderMoralities"
            :key="item.en_name"
            :style="{
              borderLeftColor:
                selectedThemeIndexes[0] === index
                  ? ThemeColors.primary
                  : 'transparent',
              backgroundColor:
                selectedThemeIndexes[0] === index ? 'white' : 'transparent',
            }"
            @click="handleParentItemClick(index)"
          >
            <text
              class="text-[28rpx] transition-all duration-300"
              :style="{
                color:
                  selectedThemeIndexes[0] === index
                    ? ThemeColors.primary
                    : '#666',
              }"
              >{{ item.name }}</text
            >
          </view>
        </scroll-view>
      </view>
      <view class="flex-1 h-full">
        <scroll-view
          class="w-full"
          scroll-y
          :style="{
            maxHeight: `calc(80vh - 128rpx - 108rpx - ${safeBottom}px)`,
          }"
        >
          <view
            class="w-full py-[24rpx] px-[24rpx] box-border flex flex-col gap-[24rpx]"
          >
            <view
              class="w-full bg-gray-50 px-[24rpx] py-[12rpx] box-border rounded-[16rpx] flex flex-col justify-center transition-all duration-300 border border-[2rpx]"
              v-for="(item, index) in renderMoralityChild"
              :key="item.en_name"
              :style="{
                backgroundColor:
                  selectedThemeIndexes[1] === index
                    ? ThemeColors.primary100
                    : 'bg-gray-50',
                borderColor:
                  selectedThemeIndexes[1] === index
                    ? ThemeColors.primary
                    : 'transparent',
              }"
              @click="handleItemClick(index)"
            >
              <text
                class="leading-[48rpx] text-[30rpx] font-[500] text-[#666]"
                >{{ item.name }}</text
              >
              <text class="leading-[32rpx] text-[24rpx] text-[#958a50]">{{
                item.description
              }}</text>
            </view>
          </view>
        </scroll-view>
      </view>
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
import { ThemeColors, iconThemeVersion, moralities } from "@/config/config";
import { computed, ref, watch } from "vue";

interface Props {
  activeIndex: number[];
}

const props = defineProps<Props>();

const $emit = defineEmits<{
  (
    e: "on-confirm",
    data: {
      index: number[];
      value: string;
    }
  ): void;
  (e: "on-close"): void;
}>();

const safeBottom = uni.getWindowInfo().safeAreaInsets?.bottom || 0;

const selectedThemeIndexes = ref<number[]>([0, 0]);

const renderMoralities = computed(() => {
  return [
    ...moralities,
    {
      name: "自定义",
      en_name: "Custom",
      description: "自定义输入",
      en_description: "Custom Input",
      children: [
        {
          name: "自定义输入",
          en_name: "Custom Input",
          description: "自定义输入",
          en_description: "Custom Input",
        },
      ],
    },
  ];
});

const renderMoralityChild = computed(() => {
  return renderMoralities.value[selectedThemeIndexes.value[0]].children;
});

watch(
  () => props.activeIndex,
  (newVal) => {
    selectedThemeIndexes.value = [...newVal];
  },
  {
    immediate: true,
    deep: true,
  }
);

function handleParentItemClick(index: number) {
  selectedThemeIndexes.value[0] = index;
  selectedThemeIndexes.value[1] = 0;
}

function handleItemClick(index: number) {
  selectedThemeIndexes.value[1] = index;
}

function handleConfirm() {
  $emit("on-confirm", {
    index: selectedThemeIndexes.value,
    value:
      selectedThemeIndexes.value[0] === renderMoralities.value.length - 1
        ? ""
        : renderMoralityChild.value[selectedThemeIndexes.value[1]].name,
  });
}

function handleClose() {
  $emit("on-close");
}
</script>

<style scoped></style>
