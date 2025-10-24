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
              :disabled="!!isLoggedIn"
              placeholder="请输入"
              @input="handlePhonenumChange"
            />
          </view>
        </view>
        <view
          class="w-full h-[100rpx] pl-[24rpx] pr-[24rpx] box-border flex flex-row items-center bg-[#fff]"
          v-if="!isLoggedIn"
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
          v-if="!isLoggedIn"
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
        <view
          class="w-full h-[120rpx] pl-[24rpx] pr-[24rpx] box-border flex flex-row items-center justify-center"
          v-else
        >
          <view
            class="h-[64rpx] pl-[24rpx] pr-[24rpx] bg-[#ff3333] active:bg-[#e62e2e] box-border flex flex-row items-center justify-center rounded-[8rpx] overflow-hidden"
            @click="handleLogout"
          >
            <text class="text-[28rpx] text-[#fff]">退出登录</text>
          </view>
        </view>
      </view>
    </Layout>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from "@dcloudio/uni-app";
import { ThirdPartLoginType } from "../index/stores/tlogin";
import { computed, ref } from "vue";
import CustomHeader from "@/components/custom-header/custom-header.vue";
import Layout from "@/components/layout/layout.vue";
import { useTLoginStore } from "../index/stores/tlogin";
import { requestThirdPartLogin, requestThirdPartSmsCode } from "@/request";
import { storeToRefs } from "pinia";

const loginType = ref(ThirdPartLoginType.ZHAOPIN);

const tLoginStore = useTLoginStore();
const { customLoginInfo } = storeToRefs(tLoginStore);

const sessionId = ref("");

const isLoginLoading = ref(false);

const loginInfo = computed(() => {
  return customLoginInfo.value[loginType.value];
});

const isLoggedIn = computed(() => {
  return loginInfo.value?.expireAt && loginInfo.value.expireAt > Date.now();
});

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
  // customLoginInfo.value = tLoginStore.getCustomLoginInfo(type);

  phonenum.value = loginInfo.value?.phonenum || "";
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

  requestThirdPartSmsCode({
    phonenum: phonenum.value,
    type: loginType.value,
  }).then((res: any) => {
    if (res.code == 200 && res.data && res.data.sessionId) {
      sessionId.value = res.data.sessionId;
      uni.showToast({
        title: "验证码发送成功",
        icon: "none",
      });
    } else {
      uni.showToast({
        title: res.message || "验证码发送失败",
        icon: "none",
      });
      stopVerifyCodeTimer();
    }
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
  if (!sessionId.value) {
    uni.showToast({
      title: "请先获取验证码",
      icon: "none",
    });
    return;
  }
  if (!verifyCode.value) {
    uni.showToast({
      title: "请输入验证码",
      icon: "none",
    });
    return;
  }
  if (isLoginLoading.value) {
    return;
  }

  isLoginLoading.value = true;

  requestThirdPartLogin({
    sessionId: sessionId.value,
    code: verifyCode.value,
    type: loginType.value,
  }).then((res: any) => {
    if (
      res.code == 200 &&
      res.data &&
      res.data.cookies &&
      res.data.cookies.length > 0
    ) {
      // 登录成功
      tLoginStore.setCustomLoginInfo({
        type: loginType.value,
        phonenum: phonenum.value,
        cookie: res.data.cookies,
      });

      uni.navigateBack({
        complete: () => {
          uni.showToast({
            title: "登录成功",
            icon: "none",
          });
        },
      });
    } else {
      uni.showToast({
        title: res.message || "登录失败",
        icon: "none",
      });
    }

    isLoginLoading.value = false;
  });
}

function handleLogout() {
  tLoginStore.removeCustomLoginInfo(loginType.value);
  uni.showToast({
    title: "退出登录成功",
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
