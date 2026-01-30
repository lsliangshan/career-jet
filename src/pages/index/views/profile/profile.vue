<template>
  <view
    class="w-full fixed top-0 left-0 z-10 bg-[rgba(248,248,245,0.5)] backdrop-blur-md border-none flex flex-col"
    :style="{
      height: `calc(80rpx +  ${safeTop}px)`,
      paddingTop: `${safeTop}px`,
    }"
  >
    <view
      class="z-[999] w-full h-[80rpx] px-[24rpx] box-border flex flex-row items-center"
      :style="{ width: `calc(${safeTitleWidth}px)` }"
    >
      <view
        class="w-full h-full px-[24rpx] box-border flex flex-row items-center justify-start"
      >
        <text class="text-[36rpx] font-bold"></text>
      </view>
    </view>
  </view>
  <Layout :hasHeader="false">
    <template>
      <refresher-success
        :offset-y="headerHeight"
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
        @refresherpulling="refresherpulling"
        @refresherrestore="refresherrestore"
        @refresherabort="refresherabort"
      >
        <template #refresher>
          <view
            class="w-full h-[100rpx] pt-[24rpx] box-border flex flex-row items-center justify-center"
          >
            <view
              class="w-[100rpx] h-[100rpx] rounded-[8rpx] flex flex-row items-center justify-center transition-opacity duration-300"
              :class="[refresherVisible ? 'opacity-100' : 'opacity-0']"
              :style="{
                marginTop: `${offsetTop}px`,
              }"
            >
              <CustomLoader :size="40" :color="ThemeColors.primary" />
            </view>
          </view>
        </template>

        <view class="w-full" :style="{ height: `${headerHeight}px` }"></view>
        <view class="w-full h-[24rpx]"></view>

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
  </Layout>
</template>

<script setup lang="ts">
import Layout from "@/components/layout/layout.vue";
import BaseInfo from "./base-info.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, nextTick, ref } from "vue";
import RefresherSuccess from "@/components/RefresherSuccess.vue";
import GeneralSettings from "./general-settings.vue";
import { ThemeColors } from "@/config/config";
import CustomLoader from "@/components/custom-loader/custom-loader.vue";
import VipCard from "./vip-card.vue";
import DraftManagement from "./draft-management.vue";

const userStore = useUserStore();
const { isLoggedIn, userSummary } = storeToRefs(userStore);

const safeBottom = uni.getWindowInfo().safeAreaInsets?.bottom || 0;
const safeTop = uni.getWindowInfo().safeAreaInsets?.top || 0;

const { left: safeTitleWidth } = uni.getMenuButtonBoundingClientRect();

const refresherTriggered = ref(false);

const refresherSuccessVisible = ref(false);

const refresherVisible = ref(false);

const isRefreshing = ref(false);

const successTip = ref("我的信息已更新");

const headerHeight = computed(() => {
  return safeTop + uni.upx2px(80);
});
const offsetTop = computed(() => {
  return safeTop + uni.upx2px(280);
});

function refresherpulling() {
  refresherVisible.value = true;
}

function refresherrestore() {
  refresherVisible.value = false;
}

function refresherabort() {
  refresherVisible.value = false;
}

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
