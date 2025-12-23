<template>
  <view class="relative w-full h-full">
    <CustomHeader title="我的" title-align="start" />

    <Layout hasHeader>
      <view class="relative w-full h-full overflow-hidden">
        <refresher-success v-model="refresherSuccessVisible" :text="successTip" />
        <scroll-view type="custom" class="w-full h-full" scroll-y refresher-enabled refresher-default-style="none"
          :refresher-triggered="refresherTriggered" @refresherrefresh="refresherrefresh">
          <template #refresher>
            <view class="w-full h-[100rpx] flex flex-row items-center justify-center">
              <view class="w-[100rpx] h-[100rpx] rounded-[8rpx] flex flex-row items-center justify-center">
                <image class="w-[40rpx] h-[40rpx] animate-spin" src="@static/icon_loading.png" mode="aspectFit" />
              </view>
            </view>
          </template>

          <BaseInfo />

          <view class="w-full h-[24rpx]"></view>

          <view class="w-full p-[24rpx] box-border">
            <view class="w-full rounded-[8rpx] overflow-hidden flex flex-col">
              <view class="flex flex-row items-center">
                <view
                  class="h-[100rpx] w-full pl-[24rpx] pr-[24rpx] box-border active:bg-[#fafafa] flex flex-row items-center justify-between"
                  :style="{
                    backgroundColor: ThemeColors.bgCard,
                  }">
                  <view class="flex flex-row items-center">
                    <!-- <image class="w-[30rpx] h-[30rpx] mr-[12rpx]" src="@static/icon_keyword.png"></image> -->
                    <text class="text-[28rpx]" :style="{
                      color: ThemeColors.text.title,
                    }">总积分</text>
                  </view>
                  <view class="h-full shrink-0 flex flex-row items-center justify-center">
                    <text class="text-[28rpx] mr-[12rpx]" :style="{
                      color: ThemeColors.primary,
                    }">{{ userSummary?.points }}</text>
                  </view>
                </view>
              </view>
            </view>

            <view class="w-full h-[24rpx]"></view>

            <GeneralSettings />
            
            <view class="w-full h-[24rpx]"></view>

            <HistorySettings />

            <view class="w-full h-[24rpx]"></view>

            <view class="w-full px-[12rpx] box-border h-[80rpx] mt-[64rpx] flex flex-row items-center justify-center"
              v-if="isLoggedIn">
              <view
                class="w-full h-full rounded-[40rpx] overflow-hidden bg-[#ff3333] active:bg-[#e62e2e] flex flex-row items-center justify-center"
                @click="handleLogout">
                <text class="text-[28rpx] text-[#fff]">退出登录</text>
              </view>
            </view>
          </view>

          <view class="w-full" :style="{
            height: `calc(100rpx + 32rpx + ${safeBottom == 0 ? '32rpx' : safeBottom + 'px'
              })`,
          }"></view>
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
import { nextTick, onMounted, ref } from "vue";
import RefresherSuccess from "@/components/RefresherSuccess.vue";
import GeneralSettings from "./general-settings.vue";
import { ThemeColors } from "@/config/config";
import HistorySettings from "./history-settings.vue";
import { useQuestionStore } from "@/stores/question";

const userStore = useUserStore();
const { isLoggedIn, userSummary } = storeToRefs(userStore);

const questionStore = useQuestionStore();

const safeBottom = uni.getWindowInfo().safeAreaInsets?.bottom || 0;

const refresherTriggered = ref(false);

const refresherSuccessVisible = ref(false);

const isRefreshing = ref(false);

const successTip = ref("我的信息已更新");

onMounted(async () => {
  nextTick(async () => {
    if (isLoggedIn.value) {
    await questionStore.getUserAnswerHistory();
  }
  })
})

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
