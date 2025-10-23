<template>
  <view class="relative w-full h-full">
    <CustomHeader title="我的" />

    <Layout hasHeader>
      <scroll-view class="w-full h-full" scroll-y>
        <view class="w-full p-[24rpx] box-border">
          <view class="w-full h-[64rpx] mb-[12rpx] flex flex-row items-center">
            <text
              class="text-[24rpx] text-[#888] text-shadow-[0_0_10rpx_rgba(255,255,255,0.1)]"
              >通用设置</text
            >
          </view>
          <view class="w-full rounded-[8rpx] overflow-hidden flex flex-col">
            <view class="flex flex-row items-center">
              <view
                class="h-[100rpx] w-full pl-[24rpx] pr-[24rpx] box-border bg-[#fff] active:bg-[#fafafa] flex flex-row items-center justify-between"
                @click="handleEditFollowedPosition"
              >
                <view class="flex flex-row items-center">
                  <image
                    class="w-[30rpx] h-[30rpx] mr-[12rpx]"
                    src="@static/icon_keyword.png"
                  ></image>
                  <text class="text-[28rpx] text-[#000]">关注的职位</text>
                </view>
                <view
                  class="h-full shrink-0 flex flex-row items-center justify-center"
                >
                  <text class="text-[28rpx] text-[#888] mr-[12rpx]">{{
                    followedPosition
                  }}</text>
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
              >
                <view class="flex flex-row items-center">
                  <image
                    class="w-[36rpx] h-[36rpx] mr-[12rpx]"
                    src="@static/icon_city.png"
                  ></image>
                  <text class="text-[28rpx] text-[#000]">关注的城市</text>
                </view>
                <view
                  class="h-full shrink-0 flex flex-row items-center justify-center"
                >
                  <text class="text-[28rpx] text-[#888] mr-[12rpx]">{{
                    followedCity
                  }}</text>
                  <image
                    class="w-[30rpx] h-[30rpx]"
                    src="@static/icon_arraw_right.png"
                  ></image>
                </view>
              </view>
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
import { useProfileStore } from "../../stores/profile";
import { storeToRefs } from "pinia";

const profileStore = useProfileStore();
const { followedPosition, followedCity } = storeToRefs(profileStore);

function handleEditFollowedPosition() {
  uni.navigateTo({
    url: "/pages/edit-followed-data/edit-followed-data?type=followedPosition",
  });
}
</script>

<style scoped></style>
