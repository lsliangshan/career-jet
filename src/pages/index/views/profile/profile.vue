<template>
  <view class="relative w-full h-full">
    <CustomHeader title="我的" title-align="start" />

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
                <image
                  class="w-[40rpx] h-[40rpx] animate-spin"
                  src="@static/icon_loading.png"
                  mode="aspectFit"
                />
              </view>
            </view>
          </template>

          <BaseInfo />

          <view class="w-full h-[24rpx]"></view>

          <view class="w-full p-[24rpx] box-border">
            <GeneralSettings />

            <view class="w-full h-[24rpx]"></view>

            <AccountSettings />

            <template v-if="isLoggedIn && subscriber && subscriber.id">
              <view class="w-full h-[24rpx]"></view>

              <SubscribeSettings />
            </template>

            <view
              class="w-full h-[64rpx] flex flex-row items-center justify-center"
            >
              <view
                class="w-[200rpx] h-full bg-red-500 flex flex-row items-center justify-center rounded-[8rpx] overflow-hidden active:bg-[#e62e2e]"
                @click="handleWs"
              >
                <text class="text-[28rpx] text-[#fff]">点击</text>
              </view>
            </view>

            <view
              class="w-full h-[80rpx] mt-[64rpx] flex flex-row items-center justify-center"
              v-if="isLoggedIn"
            >
              <view
                class="w-full h-full px-[24rpx] box-border rounded-[32rpx] overflow-hidden bg-[#ff3333] active:bg-[#e62e2e] flex flex-row items-center justify-center"
                @click="handleLogout"
              >
                <text class="text-[28rpx] text-[#fff]">退出登录</text>
              </view>
            </view>
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
import GeneralSettings from "./general-settings.vue";
import AccountSettings from "./account-settings.vue";
import SubscribeSettings from "./subscribe-settings.vue";
import BaseInfo from "./base-info.vue";
import { useUserStore } from "../../stores/user";
import { storeToRefs } from "pinia";
import { useSubscriberStore } from "../../stores/subscriber";
import { nextTick, ref } from "vue";
import { useDeliverStore } from "../../stores/deliver";
import RefresherSuccess from "@/components/RefresherSuccess.vue";

const userStore = useUserStore();
const { isLoggedIn } = storeToRefs(userStore);

const subscriberStore = useSubscriberStore();
const { subscriber } = storeToRefs(subscriberStore);

const deliverStore = useDeliverStore();

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

  await deliverStore.getMyAutoDeliveredInfo();

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

function handleWs() {
  const socketTask: UniApp.SocketTask = uni.connectSocket({
    url: "wss://127.0.0.1:4000/crawlerjet-third-qrcode-login2?type=boss",
    success: (res) => {
      console.log(">>>>>> res", res);
    },
  });

  socketTask.onOpen(() => {
    console.log(">>>>>> onOpen");
  });

  socketTask.onMessage((res) => {
    console.log(">>>>>> onMessage", res);
  });

  socketTask.onClose(() => {
    console.log(">>>>>> onClose");
  });

  socketTask.onError((err) => {
    console.log(">>>>>> onError", err);
  });
}
</script>

<style scoped></style>
