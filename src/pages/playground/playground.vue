<template>
  <view class="playground_page w-full h-full">
    <CustomHeader show-back :title="`今日挑战 - 等级${questionDetail?.level}`" />

    <Layout :hasHeader="true">

    <scroll-view type="custom" scroll-y class="w-full h-full">
      <view class="w-full h-[32rpx]"></view>
      <view class="w-full h-[386rpx] px-[32rpx] box-border" @click="previewImage(questionDetail?.image ? [questionDetail?.image] : [])">
        <view class="relative w-full h-full rounded-[24rpx] overflow-hidden bg-[#fff] shadow-[0_8rpx_32rpx_rgba(0,0,0,0.15)] flex flex-row items-center justify-center">
          <image class="w-full h-full" :src="questionDetail?.image" mode="aspectFit"></image>
          <view class="absolute bottom-[32rpx] right-[32rpx] w-[80rpx] h-[80rpx] bg-[#fff] shadow-[0_4rpx_24rpx_rgba(0,0,0,0.1)] rounded-[50%] flex flex-row items-center justify-center">
            <image
              class="w-[42rpx] h-[42rpx]"
              src="@static/icon_magnify_black.png"
              mode="aspectFit"
            />
          </view>
        </view>
      </view>

      <view class="w-full h-[88rpx] mt-[32rpx] flex flex-row items-center justify-center">
        <text class="text-[40rpx] font-[600]" :style="{color: ThemeColors.primary}">观察并描述</text>
      </view>
      <view class="w-full h-[48rpx] mt-[12rpx] flex flex-row items-center justify-center">
        <text class="text-[28rpx] text-[#666666]">仔细观察图片，然后描述你看到的内容</text>
      </view>

      <view class="w-full h-[64rpx] mt-[40rpx] px-[32rpx] box-border flex flex-row items-center gap-[24rpx]">
        
        <view class="w-[40rpx] h-[40rpx] rounded-[12rpx] overflow-hidden flex flex-row items-center justify-center"
        style="background: linear-gradient(135deg, #4A90E2 0%, #2C6DB5 100%);">
          <image
              class="w-[32rpx] h-[32rpx]"
              src="@static/icon_eye_white.png"
              mode="aspectFit"
            />
        </view>

        <text class="text-[32rpx] text-[#333] font-[700]">观察提示</text>
      </view>
      
      <view class="w-full px-[32rpx] box-border mt-[32rpx]">
        <view class="w-full p-[32rpx] box-border rounded-[40rpx] overflow-hidden bg-[#fff] shadow-[0_4rpx_24rpx_rgba(0,0,0,0.08)] flex flex-col items-center justify-center gap-[32rpx]">
          <view class="w-full h-[48rpx] flex flex-row items-center gap-[24rpx]">
            <view class="w-[48rpx] h-[48rpx] flex flex-row items-center justify-center">
              <image
              class="w-[32rpx] h-[32rpx]"
              src="@static/icon_light.png"
              mode="aspectFit"
            />
            </view>
            <text class="text-[32rpx] text-[#666666]">图片中主要的物体是什么？</text>
          </view>
          <view class="w-full h-[48rpx] flex flex-row items-center gap-[24rpx]">
            <view class="w-[48rpx] h-[48rpx] flex flex-row items-center justify-center">
              <image
              class="w-[32rpx] h-[32rpx]"
              src="@static/icon_color.png"
              mode="aspectFit"
            />
            </view>
            <text class="text-[32rpx] text-[#666666]">注意物体的颜色、形状和大小</text>
          </view>
          <view class="w-full h-[48rpx] flex flex-row items-center gap-[24rpx]">
            <view class="w-[48rpx] h-[48rpx] flex flex-row items-center justify-center">
              <image
              class="w-[32rpx] h-[32rpx]"
              src="@static/icon_location.png"
              mode="aspectFit"
            />
            </view>
            <text class="text-[32rpx] text-[#666666]">物体在什么位置？周围有什么？</text>
          </view>
        </view>
      </view>

      <view class="w-full h-[200rpx] mt-[40rpx] flex flex-row items-center justify-center">
        <view class="relative w-[200rpx] h-[200rpx] rounded-full flex flex-row items-center justify-center" @click="startDescribe">
          <span class="absolute left-0 top-0 inline-flex h-full w-full animate-beat rounded-full opacity-75"
          :style="{
            backgroundColor: ThemeColors.primary
          }"></span>
          <view class="start_btn_bg z-9 w-[190rpx] h-[190rpx] rounded-[50%] overflow-hidden shadow-[0_12rpx_50rpx_rgba(255,154,60,0.3)] flex flex-col items-center justify-center gap-[12rpx]">
            <view class="w-[80rpx] h-[80rpx] flex flex-row items-center justify-center">
              <image
              class="w-full h-full"
              src="@static/icon_mic_white.png"
              mode="aspectFit"
            />
            </view>
            <text class="text-[30rpx] text-[#fff] font-[700]">{{ isRecording ? '停止描述' : '开始描述' }}</text>
          </view>
        </view>
        
        
      </view>
    </scroll-view>
  </Layout>
  </view>
</template>

<script setup lang="ts">
import { ThemeColors } from "@/config/config";
import CustomHeader from "@/components/custom-header/custom-header.vue";
import Layout from "@/components/layout/layout.vue";
import type { IQuestion } from "@/types";
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { useQuestionStore } from "@/stores/question";
import { previewImage } from '@/utils';
import TencentAsrService from "@/services/tencent_asr";

const questionStore = useQuestionStore();

const safeTop = uni.getWindowInfo().safeAreaInsets?.top || 0;

const questionId = ref<string>("");
const questionDetail = ref<IQuestion | null>(null);

const tencentAsrService = new TencentAsrService();

const isRecording = ref<boolean>(false);

onLoad(async (options: any) => {
  questionId.value = options.id;

  await getQuestionDetailById();

  console.log('>>>>>>>>> import.meta.env: ', import.meta.env)

  tencentAsrService.onResult((result) => {
    console.log('>>>>>>> result', result);
  });
  tencentAsrService.onError((error) => {
    console.log('>>>>>>> error', error);
  });
  tencentAsrService.onStatus((status) => {
    if (status === '正在录音识别中...') {
      isRecording.value = true;
    } else if (status === '识别结束') {
      isRecording.value = false;
    }
    console.log('>>>>>>> status', status);
  });
});

async function getQuestionDetailById() {
  questionDetail.value = await questionStore.getQuestionDetailById(questionId.value);
  console.log('>>>>>>> questionDetail', questionDetail.value);
}

function startDescribe() {
  if (isRecording.value) {
    tencentAsrService.stopRecognition();
  } else {
    tencentAsrService.startRecognition();
  }
}

</script>

<style scoped>
.playground_page {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}
.start_btn_bg {
  background: linear-gradient(135deg, #FF9A3C 0%, #FF7A1C 100%);
}
</style>