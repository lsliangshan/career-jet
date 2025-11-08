<template>
  <view class="relative w-full h-full bg-[#fff]">
    <view
      class="absolute opacity-0 w-full h-full flex flex-col items-center justify-center gap-[64rpx] transition-all duration-300"
      :class="[isReady && !hasError ? 'opacity-100' : 'opacity-0']"
      v-if="!isLoggedIn"
    >
      <image
        class="w-[300rpx] h-[300rpx] z-[99]"
        :show-menu-by-longpress="true"
        :src="qrcodeImage"
      ></image>

      <view class="w-full flex flex-row items-center justify-center">
        <tex class="text-[24rpx] text-[#888]">长按图片登录</tex>
      </view>
    </view>

    <view
      class="absolute left-0 top-0 z-[99] w-full h-full flex flex-col gap-[24rpx]"
      v-else
    >
      <view
        class="w-full h-[200rpx] mt-[40rpx] flex flex-row items-center justify-center"
      >
        <image
          class="w-[200rpx] h-[200rpx] rounded-[32rpx] overflow-hidden"
          :src="loginInfo?.avatar"
        ></image>
      </view>
      <view class="w-full flex flex-row items-center justify-center">
        <text
          class="text-[28rpx] font-[500]"
          :style="{ color: ThemeColors.text.title }"
          >{{ loginInfo?.username }}</text
        >
      </view>

      <view
        class="w-full h-[120rpx] pl-[24rpx] pr-[24rpx] box-border flex flex-row items-center justify-center"
      >
        <view
          class="h-[64rpx] pl-[24rpx] pr-[24rpx] bg-[#ff3333] active:bg-[#e62e2e] box-border flex flex-row items-center justify-center rounded-[8rpx] overflow-hidden"
          @click="handleLogout"
        >
          <text class="text-[28rpx] text-[#fff]">退出登录</text>
        </view>
      </view>
    </view>

    <view
      class="absolute left-0 top-0 z-[9] w-full h-full flex flex-row items-center justify-center gap-[64rpx] transition-all duration-300"
      :class="[isLoading ? 'opacity-100' : 'opacity-0']"
    >
      <view
        class="w-[100rpx] h-[100rpx] bg-[#000] rounded-[8rpx] flex flex-row items-center justify-center"
      >
        <image
          src="../../static/icon_loading_white.png"
          class="w-[40rpx] h-[40rpx] animate-spin"
        ></image>
      </view>
    </view>

    <view
      class="absolute w-full h-full opacity-0 flex flex-col items-center justify-center gap-[64rpx] transition-all duration-300"
      :class="[
        isReady && hasError
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none',
      ]"
    >
      <image
        class="w-[300rpx] h-[300rpx]"
        src="../../static/icon_error.png"
      ></image>

      <view class="w-full flex flex-row items-center justify-center">
        <text class="text-[24rpx] text-[#888]">登录失败，请重试</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, ref } from "vue";
import { SupportedPlatform } from "@/types";
import { useStreamingRequest } from "@/utils/sse";
import { useTLoginStore } from "@/pages/index/stores/tlogin";
import { storeToRefs } from "pinia";
import { ThemeColors } from "@/config/config";

const tLoginStore = useTLoginStore();
const { customLoginInfo } = storeToRefs(tLoginStore);

const eventChannel = inject("eventChannel") as any;

interface Props {
  type: SupportedPlatform;
}

const props = defineProps<Props>();

const loginType = ref(SupportedPlatform.BOSS);

const qrcodeImage = ref("");

const isLoading = ref(true);
const isReady = ref(false);
const hasError = ref(false);

const loginInfo = computed(() => {
  return customLoginInfo.value[loginType.value];
});

const isLoggedIn = computed(() => {
  return loginInfo.value?.expireAt && loginInfo.value.expireAt > Date.now();
});

onMounted(() => {
  loginType.value = props.type;
  if (!isLoggedIn.value) {
    connectSSE();
  } else {
    isLoading.value = false;
    isReady.value = true;
  }
});

function connectSSE() {
  const { sendStreamRequest } = useStreamingRequest();
  sendStreamRequest({
    url: `https://napi.liangqy.com/crawlerjet/third/qrcode/login?type=${props.type}`,
    method: "GET",
    onMessage: (data: any) => {
      console.log("data: ", Object.prototype.toString.call(data), data);
      if (data.eventName === "init-qrcode") {
        qrcodeImage.value = data.data.miniQrcode;
        hasError.value = false;
        isLoading.value = false;
        isReady.value = true;
      } else if (data.eventName === "login-result") {
        if (data.code == 200) {
          // 登录成功
          tLoginStore.setCustomLoginInfo({
            type: props.type,
            phonenum: "",
            cookie: data.cookies,
            username: decodeURIComponent(data.data.username),
            userId: data.data.userId,
            avatar: decodeURIComponent(data.data.avatar),
          });

          eventChannel.emit("loginSuccess", {
            type: props.type,
            phonenum: "",
            cookie: data.cookies,
            username: decodeURIComponent(data.data.username),
            userId: data.data.userId,
            avatar: decodeURIComponent(data.data.avatar),
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
            title: data.message || "登录失败",
            icon: "none",
          });
        }
      }
    },
    onError: (error: any) => {
      console.error("error: ", error);
    },
    onComplete: () => {
      console.log("complete");
    },
  });
}

function handleLogout() {
  tLoginStore.removeCustomLoginInfo(loginType.value);

  uni.navigateBack({
    complete: () => {
      uni.showToast({
        title: "退出登录成功",
        icon: "none",
      });
    },
  });
}
</script>

<style scoped></style>
