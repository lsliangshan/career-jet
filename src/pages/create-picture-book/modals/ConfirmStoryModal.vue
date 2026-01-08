<template>
  <view class="w-[100vw] h-[100vh] flex flex-row items-end justify-center">
    <CustomHeader bg-color="transparent" />

    <Layout :hasHeader="true">
      <view class="relative w-full h-full flex flex-col">
        <view class="w-full h-[290rpx] shrink-0"></view>
        <view
          class="w-full bg-[#fff] rounded-tl-[32rpx] rounded-tr-[32rpx] flex flex-row items-center justify-center"
          :style="{
            height: `calc(100vh - 128rpx)`,
          }"
        >
          Confirm Story Modal
        </view>
      </view>
    </Layout>
  </view>
</template>

<script setup lang="ts">
import CustomHeader from "@/components/custom-header/custom-header.vue";
import Layout from "@/components/layout/layout.vue";

const safeBottom = uni.getWindowInfo().safeAreaInsets?.bottom || 0;
</script>

<style scoped></style>
