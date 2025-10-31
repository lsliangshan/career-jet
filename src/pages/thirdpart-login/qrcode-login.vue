<template>
  <view class="relative w-full h-full bg-[#fff]">
    <view
      class="absolute opacity-0 w-full h-full flex flex-col items-center justify-center gap-[64rpx] transition-all duration-300"
      :class="[isReady && !hasError ? 'opacity-100' : 'opacity-0']"
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
import { requestThirdPartSmsCode } from "@/request";
import { onMounted, ref } from "vue";
import { SupportedPlatform } from "@/types";

interface Props {
  type: SupportedPlatform;
}

const props = defineProps<Props>();

const qrcodeImage = ref("");

const isLoading = ref(true);
const isReady = ref(false);
const hasError = ref(false);

const sessionId = ref("");

onMounted(() => {
  handleGetQrcodeImage();
});

function handleGetQrcodeImage() {
  isLoading.value = true;
  requestThirdPartSmsCode({
    phonenum: "",
    type: props.type,
  }).then((res: any) => {
    if (res.code == 200 && res.data && res.data.sessionId) {
      qrcodeImage.value = res.data.result;
      sessionId.value = res.data.sessionId;
      hasError.value = false;
    } else {
      hasError.value = true;
    }

    isLoading.value = false;
    isReady.value = true;
  });
}
</script>

<style scoped></style>
