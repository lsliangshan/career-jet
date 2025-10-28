<template>
  <view class="w-full h-full overflow-hidden">
    <refresher-success v-model="refresherSuccessVisible" :text="successTip" />
    <scroll-view
      type="custom"
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

      <template v-if="Object.keys(renderPositions).length > 0">
        <view
          class="w-full"
          v-for="deliverDate in Object.keys(renderPositions)"
          :key="deliverDate"
        >
          <sticky-header>
            <view class="w-full h-[24rpx]"></view>
            <view
              class="header w-full h-[80rpx] px-[32rpx] box-border flex flex-row items-center gap-[12rpx]"
              :style="{
                backgroundColor: ThemeColors.bg,
              }"
            >
              <view
                class="w-[40rpx] h-[40rpx] flex flex-row items-center justify-center"
              >
                <image
                  class="w-[40rpx] h-[40rpx]"
                  src="@static/icon_timeline.png"
                  mode="aspectFit"
                />
              </view>
              <view class="h-[64rpx] flex flex-row items-center justify-center">
                <text
                  class="text-[26rpx] font-[500]"
                  :style="{
                    color: ThemeColors.primary,
                  }"
                  >{{ deliverDate }}</text
                >
              </view>
            </view>
          </sticky-header>
          <list-view>
            <view class="w-full h-[12rpx]"></view>
            <view
              class="w-full px-[24rpx] py-[12rpx] box-border"
              v-for="position in renderPositions[deliverDate]"
              :key="position.number"
            >
              <PositionCard :info="position" :type="type" />
            </view>
          </list-view>
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
import { storeToRefs } from "pinia";
import { computed, nextTick, ref, watch } from "vue";
import PositionCard from "../../components/position-card.vue";
import RefresherSuccess from "@/components/RefresherSuccess.vue";
import { supportedPlatforms, ThemeColors } from "@/config/config";
import { useDeliverStore } from "../../stores/deliver";

interface Props {
  type: SupportedPlatform;
  currentIndex: number;
}

const props = defineProps<Props>();

const safeBottom = uni.getSystemInfoSync().safeAreaInsets?.bottom || 0;

const refresherTriggered = ref(false);

const refresherSuccessVisible = ref(false);

const isInitialed = ref(false);

const isRefreshing = ref(false);

const successTip = ref("职位列表已更新");

const deliverStore = useDeliverStore();
const { deliverRecords } = storeToRefs(deliverStore);

const renderPositions = computed(() => {
  console.log(">>>>>>> deliverRecords22: ", deliverRecords.value[props.type]);
  return deliverRecords.value[props.type] || {};
});

// 自动刷新
async function doAutoRefresh() {
  refresherrefresh();
}

// 下拉刷新
const refresherrefresh = async () => {
  if (isRefreshing.value) {
    return;
  }

  isRefreshing.value = true;
  refresherTriggered.value = true;

  // const result = await positionStore.getPositionsByType({
  //   type: props.type,
  //   refresh: true,
  // });

  // if (result.code === 200) {
  //   successTip.value = `今日已更新 ${result.data.list.length} 个职位`;
  // } else {
  //   successTip.value = "无更新职位";
  // }

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
