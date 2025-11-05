<template>
  <view class="relative w-full h-full">
    <CustomHeader title="我的" />

    <Layout hasHeader>
      <scroll-view class="w-full h-full" scroll-y>
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
            class="w-full h-[80rpx] mt-[64rpx] flex flex-row items-center justify-center"
            v-if="isLoggedIn"
          >
            <view
              class="w-full h-full px-[24rpx] box-border rounded-[8rpx] overflow-hidden bg-[#ff3333] active:bg-[#e62e2e] flex flex-row items-center justify-center"
              @click="handleLogout"
            >
              <text class="text-[28rpx] text-[#fff]">退出登录</text>
            </view>
          </view>
        </view>
      </scroll-view>
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

const userStore = useUserStore();
const { isLoggedIn } = storeToRefs(userStore);

const subscriberStore = useSubscriberStore();
const { subscriber } = storeToRefs(subscriberStore);

function handleLogout() {
  userStore.logout();
}
</script>

<style scoped></style>
