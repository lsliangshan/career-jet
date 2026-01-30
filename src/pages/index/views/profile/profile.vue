<template>
  <view class="relative w-full h-full">
    <CustomHeader title="" bgColor="transparent" title-align="start" />

    <Layout hasHeader>
      <view class="relative w-full h-full overflow-hidden">
        <refresher-success
          v-model="refresherSuccessVisible"
          :text="successTip"
        />
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
                class="w-[100rpx] h-[100rpx] rounded-[8rpx] flex flex-row items-center justify-center"
              >
                <CustomLoader :size="40" :color="ThemeColors.primary" />
              </view>
            </view>
          </template>

          <BaseInfo @on-logout="handleLogout" />

          <view class="w-full h-[24rpx]"></view>

          <VipCard v-if="isLoggedIn" :points="userSummary?.points || 0" />

          <view class="w-full h-[24rpx]"></view>

          <view class="w-full px-[32rpx] py-[24rpx] box-border">
            <template v-if="isLoggedIn">
              <DraftManagement />

              <view class="w-full h-[24rpx]"></view>
            </template>

            <GeneralSettings />

            <view class="w-full h-[24rpx]"></view>

            <HistorySettings />

            <view class="w-full h-[24rpx]"></view>
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
    </Layout>
  </view>
</template>

<script setup lang="ts">
import CustomHeader from "@/components/custom-header/custom-header.vue";
import Layout from "@/components/layout/layout.vue";
import BaseInfo from "./base-info.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { nextTick, ref } from "vue";
import RefresherSuccess from "@/components/RefresherSuccess.vue";
import GeneralSettings from "./general-settings.vue";
import { ThemeColors } from "@/config/config";
import HistorySettings from "./history-settings.vue";
import CustomLoader from "@/components/custom-loader/custom-loader.vue";
import VipCard from "./vip-card.vue";
import DraftManagement from "./draft-management.vue";

const userStore = useUserStore();
const { isLoggedIn, userSummary } = storeToRefs(userStore);

const safeBottom = uni.getWindowInfo().safeAreaInsets?.bottom || 0;

const refresherTriggered = ref(false);

const refresherSuccessVisible = ref(false);

const isRefreshing = ref(false);

const successTip = ref("我的信息已更新");

// 下拉刷新
const refresherrefresh = async () => {
  if (isRefreshing.value) {
    return;
  }

  isRefreshing.value = true;
  refresherTriggered.value = true;

  nextTick(() => {
    const t = setTimeout(() => {
      clearTimeout(t);
      refresherTriggered.value = false;
      isRefreshing.value = false;
      refresherSuccessVisible.value = true;
    }, 500);
  });
};

function handleLogout() {
  userStore.logout();
}
</script>

<style scoped></style>
