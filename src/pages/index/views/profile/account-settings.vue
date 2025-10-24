<template>
  <view>
    <view class="w-full h-[64rpx] mb-[12rpx] flex flex-row items-center">
      <text
        class="text-[24rpx] text-[#888] text-shadow-[0_0_10rpx_rgba(255,255,255,0.1)]"
        >账号设置</text
      >
    </view>
    <view class="w-full rounded-[8rpx] overflow-hidden flex flex-col">
      <view class="flex flex-row items-center">
        <view
          class="h-[100rpx] w-full pl-[24rpx] pr-[24rpx] box-border bg-[#fff] active:bg-[#fafafa] flex flex-row items-center justify-between"
          @click="handleZhaopinLogin"
        >
          <view class="flex flex-row items-center">
            <image
              class="w-[30rpx] h-[30rpx] mr-[12rpx]"
              src="https://img09.zhaopin.com/2012/other/mobile/clive/resources/imgs/zhaopin.png"
            ></image>
            <text class="text-[28rpx] text-[#000]">智联招聘</text>
          </view>
          <view
            class="h-full shrink-0 flex flex-row items-center justify-center"
          >
            <text class="text-[28rpx] text-[#888] mr-[12rpx]">智联账号</text>
            <image
              class="w-[30rpx] h-[30rpx]"
              src="@static/icon_arraw_right.png"
            ></image>
          </view>
        </view>
      </view>

      <view
        class="w-full h-[1rpx] bg-[#fff] flex flex-row items-center justify-center"
      >
        <view
          class="h-full bg-[#f8f8f8]"
          :style="{ width: `calc(100% - 48rpx)` }"
        ></view>
      </view>

      <view class="flex flex-row items-center">
        <view
          class="h-[100rpx] w-full pl-[24rpx] pr-[24rpx] box-border bg-[#fff] active:bg-[#fafafa] flex flex-row items-center justify-between"
          @click="handleBossLogin"
        >
          <view class="flex flex-row items-center">
            <image
              class="w-[30rpx] h-[30rpx] mr-[12rpx]"
              src="https://img09.zhaopin.com/2012/other/mobile/clive/resources/imgs/boss.jpg"
            ></image>
            <text class="text-[28rpx] text-[#000]">Boss直聘</text>
          </view>
          <view
            class="h-full shrink-0 flex flex-row items-center justify-center"
          >
            <text class="text-[28rpx] text-[#888] mr-[12rpx]">Boss账号</text>
            <image
              class="w-[30rpx] h-[30rpx]"
              src="@static/icon_arraw_right.png"
            ></image>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useTLoginStore } from "../../stores/tlogin";
import { storeToRefs } from "pinia";

const tLoginStore = useTLoginStore();
const { getCustomLoginInfo } = storeToRefs(tLoginStore);

function handleZhaopinLogin() {
  uni.navigateTo({
    url: "/pages/thirdpart-login/thirdpart-login?type=zhaopin",
  });
}

function handleBossLogin() {
  uni.navigateTo({
    url: "/pages/thirdpart-login/thirdpart-login?type=boss",
  });
}
</script>

<style scoped></style>
