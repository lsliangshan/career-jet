<template>
  <view class="w-full h-full overflow-hidden">
    <refresher-success v-model="refresherSuccessVisible" :text="successTip" />
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

      <template v-if="renderPositions.length > 0">
        <view class="w-full h-[12rpx]"></view>
        <view
          class="w-full px-[24rpx] py-[12rpx] box-border"
          v-for="position in renderPositions"
          :key="position.number"
        >
          <PositionCard :info="position" :type="type" />
        </view>
      </template>

      <template v-else>
        <view
          class="w-full flex flex-row items-center justify-center"
          :style="{ height: `calc(100% - 200rpx)` }"
        >
          <Empty />
        </view>
      </template>

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
import { computed, nextTick, ref, watch } from "vue";
import PositionCard from "../../components/position-card.vue";
import RefresherSuccess from "@/components/RefresherSuccess.vue";
import { supportedPlatforms } from "@/config/config";
import Empty from "@/components/empty/empty.vue";

interface Props {
  type: SupportedPlatform;
  currentIndex: number;
}

const props = defineProps<Props>();

const safeBottom = uni.getWindowInfo().safeAreaInsets?.bottom || 0;

const refresherTriggered = ref(false);

const refresherSuccessVisible = ref(false);

const isInitialed = ref(false);

const isRefreshing = ref(false);

const successTip = ref("职位列表已更新");

const positionStore = usePositionStore();
const { positions } = storeToRefs(positionStore);

const renderPositions = computed(() => {
  return positions.value[props.type]?.list || [];
});

watch(
  () => props.currentIndex,
  (newVal) => {
    if (
      supportedPlatforms[props.currentIndex].type === props.type &&
      !isInitialed.value
    ) {
      nextTick(() => {
        doAutoRefresh();
        isInitialed.value = true;
      });
    }
  },
  {
    immediate: true,
  }
);

// 自动刷新
async function doAutoRefresh() {
  refresherrefresh();
}

// 下拉刷新
const refresherrefresh = async () => {
  if (isRefreshing.value) {
    return;
  }

  // 更新日期
  positionStore.updateDate();

  isRefreshing.value = true;
  refresherTriggered.value = true;

  const result = await positionStore.getPositionsByType({
    type: props.type,
    refresh: true,
  });

  if (result.code === 200) {
    successTip.value = `今日已更新 ${result.data.list.length} 个职位`;
  } else {
    successTip.value = "无更新职位";
  }

  nextTick(() => {
    const t = setTimeout(() => {
      clearTimeout(t);
      refresherTriggered.value = false;
      isRefreshing.value = false;
      refresherSuccessVisible.value = true;
    }, 500);
  });
};
</script>

<style scoped></style>
