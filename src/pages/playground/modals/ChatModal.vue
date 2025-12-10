<template>
  <view class="w-[100vw] h-[100vh] flex flex-row items-end justify-center">
    <view class="relative w-full h-[800rpx] flex flex-col justify-between" >
    <view class="w-full h-full p-[32rpx] box-border" :style="{maxHeight: `calc(100% - 120rpx - 100rpx - ${safeBottom}px)`}">
      <view class="relative w-full max-h-full pt-[32rpx] box-border rounded-[32rpx] overflow-hidden bg-[#07c160] shadow-[0_8rpx_32rpx_rgba(0,0,0,0.15)] flex flex-row transition-all duration-300 will-change-height" :style="{paddingBottom: isRecording ? '72rpx' : '32rpx'}">
        <view class="w-full max-h-full px-[32rpx] box-border overflow-auto">
          <textarea type="text" class="text-[#222] text-[30rpx]" :cursor-spacing="32" v-model="asrText" :disabled="isRecording" :focus="focused" auto-height @blur="handleBlur"/>
        </view>

        <view class="absolute left-0 bottom-0 w-full h-[72rpx] pr-[24rpx] box-border flex flex-row items-center justify-end" v-if="isRecording">
          <image src="https://img09.zhaopin.cn/2012/other/mobile/images/sound-wave.gif" class="w-[50rpx] h-[50rpx]"></image>
          <image src="https://img09.zhaopin.cn/2012/other/mobile/images/sound-wave.gif" class="w-[50rpx] h-[50rpx]"></image>
        </view>
      </view>
      
    </view>

    <view class="absolute left-0 w-full h-[120rpx] pr-[32rpx] box-border flex flex-row items-center justify-end gap-[32rpx]" :style="{bottom: `calc(100rpx + ${safeBottom}px)`}">
      <view class="h-[88rpx] px-[32rpx] box-border rounded-[44rpx] bg-[rgba(255,255,255,0.2)] active:bg-[rgba(255,255,255,0.3)] flex flex-row items-center justify-center transition-all duration-300" @click="closeModal">
        <text class="text-[#fff] text-[32rpx]">取消</text>
      </view>
      <view class="h-[88rpx] px-[64rpx] box-border bg-[#fff] active:bg-[#f5f5f5] rounded-[44rpx] flex flex-row items-center justify-center transition-all duration-300" @click="sendMessage">
        <text class="text-[#222] text-[32rpx]">发送</text>
      </view>
    </view>
    <view class="absolute left-0 bottom-0 w-full" :style="{ height: `calc(100rpx + ${safeBottom}px)` }">
      
    </view>
  </view>
  </view>
</template>

<script setup lang="ts">
import { EModalComponent } from './types';
import { nextTick, onMounted, ref, watch } from 'vue';
import TencentAsrService from "@/services/tencent_asr";
import type { AsrResult } from "@/services/tencent_asr";
import type { IQuestion } from '@/types';
import { requestAnswerQuestion } from '@/request';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';

interface Props {
  isSpeaking: boolean;
  info?: IQuestion;
}

const props = defineProps<Props>();

const userStore = useUserStore();
const { loginInfo, isLoggedIn } = storeToRefs(userStore);

const safeBottom = uni.getWindowInfo().safeAreaInsets?.bottom || 0;

const tencentAsrService = new TencentAsrService();

const asrText = ref('');
const asrDuration = ref(0);
const asrResult = ref<AsrResult>();

const isRecording = ref<boolean>(false);

const focused = ref(false);;

watch(() => props.isSpeaking, (newVal) => {
  if (!newVal) {
    stopRecognize(); 
  }
});

onMounted(() => {
  tencentAsrService.onResult((result: AsrResult) => {
    // console.log('>>>>>>> result', result);
    asrResult.value = result;
    if (!result.isFinal) {
      asrText.value = result.text || '';
      asrDuration.value = result.endTime || 0;
    }
  });
  tencentAsrService.onError((error) => {
    // console.log('>>>>>>> error', error);
  });
  tencentAsrService.onStatus((status) => {
    if (status === '正在录音识别中...') {
      isRecording.value = true;
    } else if (status === '识别结束') {
      isRecording.value = false;
    }
  });
  const t = setTimeout(async () => {
    clearTimeout(t);
    await startRecognize();
   }, 300)
})

async function startRecognize() {
  if (props.isSpeaking) {
    await tencentAsrService.startRecognition();
    isRecording.value = tencentAsrService.getStatus().isRecording;
  } else {
    focused.value = true;
  }
}

function stopRecognize() {
  nextTick(() => {
    tencentAsrService.stopRecognition();
  })
}

function closeModal() {
  uni.$emit('close-modal', {
    component: EModalComponent.CHAT_MODAL,
  });
}

async function sendMessage() {
  if (!asrText.value) {
    uni.showToast({
      title: '请输入内容',
      icon: 'none',
    });
    focused.value = true;
    return;
  }

  if (!props.info) { 
    return;
  }

  if (!isLoggedIn.value) {
    uni.showToast({
      title: '请先登录',
      icon: 'none',
    });
    return;
  }

  const res = await requestAnswerQuestion({
    userId: loginInfo.value.id,
    questionId: props.info.id,
    answer: asrText.value,
    answerTime: 0,
    thinkingTime: 0,
  });

  console.log('>>>>>>> 答题返回: ', res)
}

function handleBlur() {
  focused.value = false;
}
</script>

<style scoped>

</style>