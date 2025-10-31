<template>
  <view class="relative w-full h-full">
    <CustomHeader title="我的" />

    <Layout hasHeader>
      <scroll-view class="w-full h-full" scroll-y>
        <view class="w-full p-[24rpx] box-border">
          <GeneralSettings />

          <view class="w-full h-[24rpx]"></view>

          <AccountSettings />

          <view
            class="w-full h-[64rpx] mt-[32rpx] flex flex-row items-center justify-center"
          >
            <view
              class="h-full px-[24rpx] box-border rounded-[16rpx] overflow-hidden bg-[#2B5AED] active:bg-[#234FCD] flex flex-row items-center justify-center"
              @click="handleLogin"
            >
              <text class="text-[28rpx] text-[#fff]">登录</text>
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
import { getWxUserInfo } from "@/request";

function handleLogin() {
  uni.login({
    provider: "weixin",
    onlyAuthorize: true,
    success: async (res) => {
      if (res.errMsg == "login:ok") {
        const result = await getWxUserInfo(res.code);
        console.log(">>>>>>>>> 登录成功: ", result);
      }
    },
    fail: (err) => {
      console.log(err);
    },
  });
}
</script>

<style scoped></style>
