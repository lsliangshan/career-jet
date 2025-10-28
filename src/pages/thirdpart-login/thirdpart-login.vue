<template>
  <view class="relative w-full h-full">
    <CustomHeader show-back :title="renderTitle" />

    <Layout hasHeader>
      <template v-if="loginType === SupportedPlatform.BOSS">
        <QrcodeLogin :type="loginType" />
      </template>
      <template v-else>
        <SmscodeLogin :type="loginType" />
      </template>
    </Layout>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from "@dcloudio/uni-app";
import { computed, getCurrentInstance, provide, ref } from "vue";
import CustomHeader from "@/components/custom-header/custom-header.vue";
import Layout from "@/components/layout/layout.vue";
import QrcodeLogin from "./qrcode-login.vue";
import SmscodeLogin from "./smscode-login.vue";
import { SupportedPlatform } from "@/types";

const instance = getCurrentInstance()?.proxy as any;
const eventChannel = instance?.getOpenerEventChannel();

provide("eventChannel", eventChannel);

const loginType = ref(SupportedPlatform.ZHAOPIN);

const renderTitle = computed(() => {
  if (loginType.value === SupportedPlatform.ZHAOPIN) {
    return "智联招聘登录";
  } else if (loginType.value === SupportedPlatform.BOSS) {
    return "Boss直聘登录";
  }
  return "";
});

onLoad((options) => {
  const type = options?.type as SupportedPlatform | undefined;
  if (!type) {
    uni.navigateBack();
    return;
  }
  loginType.value = type;
});
</script>

<style scoped></style>
