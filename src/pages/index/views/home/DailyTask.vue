<template>
  <view class="w-full px-[24rpx] py-[32rpx] box-border">
    <view class="daily_card w-full rounded-[32rpx] overflow-hidden px-[32rpx] py-[32rpx] box-border flex flex-col gap-[24rpx]">

      <view class="w-full h-[96rpx] flex flex-row items-center gap-[32rpx]">
        <view class="w-[96rpx] h-[96rpx] bg-[rgba(255,255,255,0.2)] rounded-[16rpx] overflow-hidden flex flex-row items-center justify-center">

        </view>
        <view class="h-full flex flex-row items-center">
          <text class="text-[48rpx] text-[#fff] font-[500]">今日挑战</text>
        </view>
      </view>

      <view class="w-full h-[56rpx] flex flex-row items-center">
        <text class="text-[40rpx] text-[#fff]">今日挑战图片</text>
      </view>

      <view class="w-full h-[168rpx] px-[24rpx] box-border rounded-[24rpx] overflow-hidden bg-[rgba(255,255,255,0.15)] flex flex-row items-center justify-center gap-[32rpx]">
        <view class="question_img w-[120rpx] h-[120rpx] bg-[rgba(255,255,255,0.2)] rounded-[16rpx] overflow-hidden flex flex-row items-center justify-center shrink-0">

        </view>

        <view class="w-full h-full flex flex-col items-start justify-center gap-[8rpx]">
          <view class="w-full h-[50rpx] flex flex-row items-center">
            <text class="text-[36rpx] text-[#fff] font-[600]">森林</text>
          </view>
          <view class="w-full h-[40rpx] flex flex-row items-center">
            <text class="text-[28rpx] text-[rgba(255,255,255,0.9)]">描述这片茂密的森林</text>
          </view>
        </view>
      </view>

      <view class="w-full h-[44rpx] flex flex-row items-center gap-[48rpx] my-[12rpx]">
        <view class="h-full flex flex-row items-center gap-[12rpx]">
          <view class="w-[40rpx] h-[40rpx] flex flex-row items-center justify-center bg-[#fff]"></view>
          <view class="h-full flex flex-row items-center">
            <text class="text-[32rpx] text-[#fff]">3天</text>
          </view>
        </view>
        <view class="h-full flex flex-row items-center gap-[12rpx]">
          <view class="w-[40rpx] h-[40rpx] flex flex-row items-center justify-center bg-[#fff]"></view>
          <view class="h-full flex flex-row items-center">
            <text class="text-[32rpx] text-[#fff]">2倍奖励</text>
          </view>
        </view>

      </view>

      <view class="w-full h-[112rpx] rounded-[32rpx] overflow-hidden bg-[#fff] animate-pulse"></view>

    </view>
  </view>
</template>

<script setup lang="ts">

</script>

<style scoped>
.daily_card {
  background: linear-gradient(135deg, #FF9A3C 0%, #FF7A1C 100%);
}
.question_img {
  background: linear-gradient(135deg, #FFD93D 0%, #FFB347 100%);
}
</style>