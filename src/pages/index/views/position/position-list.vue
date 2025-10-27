<template>
  <view class="w-full h-full overflow-hidden">
    <refresher-success
      v-model="refresherSuccessVisible"
      text="职位列表已更新"
    />
    <scroll-view
      class="w-full h-full"
      scroll-y
      refresher-enabled
      refresher-default-style="none"
      :refresher-triggered="refresherTriggered"
      @refresherrefresh="refresherrefresh"
    >
      <template #refresher>
        <view
          class="w-full h-[100rpx] flex flex-row items-center justify-center"
        >
          <view
            class="w-[100rpx] h-[100rpx] rounded-[8rpx] flex flex-row items-end justify-center"
          >
            <image
              class="w-[40rpx] h-[40rpx] animate-spin"
              src="@static/icon_loading.png"
              mode="aspectFit"
            />
          </view>
        </view>
      </template>
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
  </view>
</template>

<script setup lang="ts">
import { SupportedPlatform } from "@/types";
import { usePositionStore } from "../../stores/position";
import { storeToRefs } from "pinia";
import { computed, nextTick, ref } from "vue";
import PositionCard from "./position-card.vue";
import RefresherSuccess from "@/components/RefresherSuccess.vue";

interface Props {
  type: SupportedPlatform;
}

const props = defineProps<Props>();

const safeBottom = uni.getSystemInfoSync().safeAreaInsets?.bottom || 0;

const refresherTriggered = ref(false);

const refresherSuccessVisible = ref(false);

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

// 下拉刷新
const refresherrefresh = async () => {
  refresherTriggered.value = true;

  nextTick(() => {
    const t = setTimeout(() => {
      clearTimeout(t);
      refresherTriggered.value = false;

      refresherSuccessVisible.value = true;
    }, 3500);
  });
};
</script>

<style scoped></style>
