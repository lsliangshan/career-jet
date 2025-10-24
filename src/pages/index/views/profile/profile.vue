<template>
  <view class="relative w-full h-full">
    <CustomHeader title="我的" />

    <Layout hasHeader>
      <scroll-view class="w-full h-full" scroll-y>
        <view class="w-full p-[24rpx] box-border">
          <GeneralSettings />

          <view class="w-full h-[24rpx]"></view>

          <AccountSettings />
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
</script>

<style scoped></style>
