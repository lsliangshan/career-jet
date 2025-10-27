<template>
  <view class="relative w-full h-full">
    <CustomHeader show-back :title="renderTitle" />

    <Layout hasHeader>
      <template v-if="loginType === ThirdPartLoginType.BOSS">
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
import { ThirdPartLoginType } from "../index/stores/tlogin";
import { computed, ref } from "vue";
import CustomHeader from "@/components/custom-header/custom-header.vue";
import Layout from "@/components/layout/layout.vue";
import QrcodeLogin from "./qrcode-login.vue";
import SmscodeLogin from "./smscode-login.vue";

const loginType = ref(ThirdPartLoginType.ZHAOPIN);

const renderTitle = computed(() => {
  if (loginType.value === ThirdPartLoginType.ZHAOPIN) {
    return "智联招聘登录";
  } else if (loginType.value === ThirdPartLoginType.BOSS) {
    return "Boss直聘登录";
  }
  return "";
});

onLoad((options) => {
  const type = options?.type as ThirdPartLoginType | undefined;
  if (!type) {
    uni.navigateBack();
    return;
  }
  loginType.value = type;
});
</script>

<style scoped></style>
