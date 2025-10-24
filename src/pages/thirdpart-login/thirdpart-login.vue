<template>
  <view class="relative w-full h-full">
    <CustomHeader show-back :title="renderTitle" />

    <Layout hasHeader>
      <view class="w-full">
        <view
          class="w-full h-[100rpx] pl-[24rpx] pr-[24rpx] box-border flex flex-row items-center bg-[#fff]"
        >
          <view class="w-[100rpx] h-full shrink-0 flex flex-row items-center">
            <text class="text-[28rpx] text-[#333]">手机号</text>
          </view>
          <view class="w-full h-full">
            <input
              class="h-full pl-[24rpx] pr-[24rpx] box-border"
              :style="{ width: `calc(100% - 100rpx)` }"
              ref="inputRef"
              type="number"
              :value="phonenum"
              focus
              placeholder="请输入"
              @input="handlePhonenumChange"
            />
          </view>
        </view>
        <view
          class="w-full h-[100rpx] pl-[24rpx] pr-[24rpx] box-border flex flex-row items-center bg-[#fff]"
        >
          <view class="w-[100rpx] h-full shrink-0 flex flex-row items-center">
            <text class="text-[28rpx] text-[#333]">验证码</text>
          </view>
          <view class="relative w-full h-full flex flex-row items-center">
            <input
              class="h-full pl-[24rpx] pr-[24rpx] box-border"
              type="number"
              :value="verifyCode"
              placeholder="请输入"
              @input="handleVerifyCodeChange"
            />
            <view
              class="absolute right-0 h-[64rpx] pl-[24rpx] pr-[24rpx] box-border flex flex-row items-center justify-center border-[1rpx] border-solid rounded-[8rpx] overflow-hidden"
              :class="[
                canGetVerifyCode
                  ? 'border-[#42b983] active:border-[#36ad6a]'
                  : 'border-[#c8c8c8] pointer-events-none',
              ]"
              @click="handleGetVerifyCode"
            >
              <text
                class="text-[28rpx]"
                :class="[
                  canGetVerifyCode
                    ? 'text-[#42b983]'
                    : 'text-[#c8c8c8] pointer-events-none',
                ]"
              >
                {{
                  verifyCodeTimer ? `${verifyCodeTimerCount}s` : "获取验证码"
                }}
              </text>
            </view>
          </view>
        </view>

        <view
          class="w-full h-[120rpx] pl-[24rpx] pr-[24rpx] box-border flex flex-row items-center justify-center"
        >
          <view
            class="h-[64rpx] pl-[24rpx] pr-[24rpx] box-border flex flex-row items-center justify-center rounded-[8rpx] overflow-hidden"
            :class="[
              canLogin
                ? 'bg-[#42b983] active:bg-[#36ad6a]'
                : 'bg-[#c8c8c8] pointer-events-none',
            ]"
            @click="handleLogin"
          >
            <text class="text-[28rpx] text-[#fff]">登录</text>
          </view>
        </view>
      </view>
    </Layout>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from "@dcloudio/uni-app";
import { CustomLoginInfo, ThirdPartLoginType } from "../index/stores/tlogin";
import { computed, ref } from "vue";
import CustomHeader from "@/components/custom-header/custom-header.vue";
import Layout from "@/components/layout/layout.vue";
import { useTLoginStore } from "../index/stores/tlogin";

const loginType = ref(ThirdPartLoginType.ZHAOPIN);

const tLoginStore = useTLoginStore();

const customLoginInfo = ref<CustomLoginInfo>();

// 手机号
const phonenum = ref("");
// 验证码
const verifyCode = ref("");

const verifyCodeTimer = ref<NodeJS.Timeout | null>(null);

const maxVerifyCodeTimerCount = 5;
const verifyCodeTimerCount = ref(maxVerifyCodeTimerCount);

const renderTitle = computed(() => {
  if (loginType.value === ThirdPartLoginType.ZHAOPIN) {
    return "智联招聘登录";
  } else if (loginType.value === ThirdPartLoginType.BOSS) {
    return "Boss直聘登录";
  }
  return "";
});

const canGetVerifyCode = computed(() => {
  return phonenum.value && !verifyCodeTimer.value;
});

const canLogin = computed(() => {
  return phonenum.value && verifyCode.value;
});

onLoad((options) => {
  const type = options?.type as ThirdPartLoginType | undefined;
  if (!type) {
    uni.navigateBack();
    return;
  }
  loginType.value = type;
  customLoginInfo.value = tLoginStore.getCustomLoginInfo(type);
  phonenum.value = customLoginInfo.value?.phonenum || "";
});

function handleGetVerifyCode() {
  if (!phonenum.value) {
    uni.showToast({
      title: "请输入手机号",
      icon: "none",
    });
    return;
  }
  startVerifyCodeTimer();
  uni.showToast({
    title: "获取验证码",
    icon: "none",
  });
}

function startVerifyCodeTimer() {
  verifyCodeTimer.value = setInterval(() => {
    verifyCodeTimerCount.value--;
    if (verifyCodeTimerCount.value <= 0) {
      stopVerifyCodeTimer();
    }
  }, 1000);
}

function stopVerifyCodeTimer() {
  if (verifyCodeTimer.value) {
    clearInterval(verifyCodeTimer.value);
    verifyCodeTimer.value = null;
    verifyCodeTimerCount.value = maxVerifyCodeTimerCount;
  }
}

function handleLogin() {
  if (!canLogin.value) {
    return;
  }
  uni.showToast({
    title: "登录中...",
    icon: "none",
  });
}

function handlePhonenumChange(e: any) {
  phonenum.value = e.detail.value;
}

function handleVerifyCodeChange(e: any) {
  verifyCode.value = e.detail.value;
}
</script>

<style scoped></style>
