<template>
  <view>
    <view class="w-full h-[64rpx] mb-[12rpx] flex flex-row items-center">
      <text
        class="text-[24rpx] text-shadow-[0_0_10rpx_rgba(255,255,255,0.1)]"
        :style="{
          color: ThemeColors.text.label,
        }"
        >我的订阅</text
      >
    </view>
    <view class="w-full rounded-[8rpx] overflow-hidden flex flex-col">
      <view
        class="h-[200rpx] w-full pl-[24rpx] pr-[24rpx] box-border active:bg-[#fafafa] flex flex-row items-center gap-[24rpx]"
        :style="{
          backgroundColor: ThemeColors.bgCard,
        }"
      >
        <view class="flex flex-row items-center shrink-0">
          <image
            class="w-[120rpx] h-[120rpx] mr-[12rpx]"
            src="https://img.liangqy.com/crawlerjet/img/icon_robot.png"
          ></image>
        </view>
        <view class="h-full flex flex-col justify-center shrink-0">
          <view class="h-[64rpx] flex flex-row items-center">
            <text
              class="text-[30rpx] font-[500]"
              :style="{
                color: ThemeColors.text.title,
              }"
              >投递助手</text
            >
          </view>
          <view class="h-[36rpx] flex flex-row items-center">
            <text
              class="text-[24rpx]"
              :style="{
                color:
                  Number(subscriber?.endTime) < new Date().getTime()
                    ? ThemeColors.error
                    : ThemeColors.accent,
              }"
              >{{
                Number(subscriber?.endTime) < new Date().getTime()
                  ? "已过期"
                  : "有效期至"
              }}:
              {{
                subscriber?.endTime
                  ? formatDate(Number(subscriber?.endTime), "YYYY-MM-DD")
                  : "未设置"
              }}</text
            >
          </view>
          <view
            class="h-[36rpx] mt-[12rpx] flex flex-row items-center gap-[12rpx]"
          >
            <view
              class="h-full px-[12rpx] box-border rounded-[8rpx] overflow-hidden flex flex-row items-center justify-center shrink-0"
              :style="{ backgroundColor: `${ThemeColors.primary100}` }"
            >
              <text
                class="text-[20rpx]"
                :style="{
                  color: ThemeColors.primary,
                }"
                >{{ subscriber?.job }}</text
              >
            </view>
            <view
              class="h-full px-[12rpx] box-border rounded-[8rpx] overflow-hidden flex flex-row items-center justify-center shrink-0"
              :style="{ backgroundColor: `${ThemeColors.primary100}` }"
            >
              <text
                class="text-[20rpx]"
                :style="{
                  color: ThemeColors.primary,
                }"
                >{{ subscriber?.city }}</text
              >
            </view>
          </view>
        </view>
      </view>

      <view
        class="w-full h-[1rpx] flex flex-row items-center justify-center"
        :style="{
          backgroundColor: ThemeColors.bgCard,
        }"
      >
        <view
          class="h-full"
          :style="{
            width: `calc(100% - 48rpx)`,
            backgroundColor: ThemeColors.bg,
          }"
        ></view>
      </view>

      <view
        class="relative w-full h-[140rpx] flex flex-row items-center justify-around gap-[32rpx]"
        :style="{
          backgroundColor: ThemeColors.bgCard,
        }"
      >
        <view class="h-full flex flex-col items-center justify-center">
          <text class="text-[40rpx]" :style="{ color: ThemeColors.primary }">{{
            autoDeliveredInfo?.totalTimes || 0
          }}</text>
          <text class="text-[20rpx]" :style="{ color: ThemeColors.text.label }"
            >自动投递次数</text
          >
        </view>
        <view
          class="absolute left-50% transform -translate-x-1/2 w-[1rpx] h-full flex flex-row items-center justify-center"
        >
          <view
            class="h-[64rpx] w-[1rpx]"
            :style="{
              backgroundColor: ThemeColors.bg,
            }"
          ></view>
        </view>
        <view class="h-full flex flex-col items-center justify-center">
          <text class="text-[40rpx]" :style="{ color: ThemeColors.primary }">{{
            autoDeliveredInfo?.totalCount || 0
          }}</text>
          <text class="text-[20rpx]" :style="{ color: ThemeColors.text.label }"
            >自动投递职位数量</text
          >
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useSubscriberStore } from "../../stores/subscriber";
import { storeToRefs } from "pinia";
import { ThemeColors } from "@/config/config";
import { formatDate } from "@/utils/date";
import { useDeliverStore } from "../../stores/deliver";

const subscriberStore = useSubscriberStore();
const { subscriber } = storeToRefs(subscriberStore);

const deliverStore = useDeliverStore();
const { autoDeliveredInfo } = storeToRefs(deliverStore);
</script>

<style scoped></style>
