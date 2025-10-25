<template>
  <scroll-view class="w-full h-full" scroll-y>
    <view class="w-full h-[12rpx]"></view>
    <view
      class="w-full px-[24rpx] py-[12rpx] box-border"
      v-for="position in renderPositions"
      :key="position.id"
    >
      <PositionCard :info="position" :type="type" />
    </view>

    <view
      class="w-full"
      :style="{
        height: `calc(100rpx + 32rpx + ${
          safeBottom == 0 ? '32rpx' : safeBottom + 'px'
        })`,
      }"
    ></view>
  </scroll-view>
</template>

<script setup lang="ts">
import { SupportedPlatform } from "@/types";
import { usePositionStore } from "../../stores/position";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import PositionCard from "./position-card.vue";

interface Props {
  type: SupportedPlatform;
}

const props = defineProps<Props>();

const safeBottom = uni.getSystemInfoSync().safeAreaInsets?.bottom || 0;

const positionStore = usePositionStore();
const { zhaopinPositions, bossPositions } = storeToRefs(positionStore);

const renderPositions = computed(() => {
  if (props.type === SupportedPlatform.ZHAOPIN) {
    return zhaopinPositions.value.list;
  } else if (props.type === SupportedPlatform.BOSS) {
    return bossPositions.value.list;
  }
  return [];
});
</script>

<style scoped></style>
