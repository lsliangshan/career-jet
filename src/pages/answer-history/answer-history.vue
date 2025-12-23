<template>
  <view class="answer_history w-full h-full">
    <CustomHeader show-back :title="`回答记录`" />

    <Layout :hasHeader="true">
      <PageLoading v-if="!pageReady" />

      <empty v-else-if="pageReady && answers.length === 0" />

      <scroll-view type="custom" scroll-y class="relative w-full h-full flex flex-col" v-else>
        <view class="w-full h-[32rpx]"></view>

        <view class="w-full mb-[64rpx] px-[32rpx] box-border flex flex-col gap-[64rpx]" v-for="(answer, index) in answers" :key="answer.id">
          <view
            class="max-w-[calc(100%-32rpx)] ml-[32rpx] flex flex-col gap-[16rpx]">
            <view class="w-full h-[64rpx] flex flex-row items-center justify-end gap-[32rpx]">
              <text class="text-[24rpx] text-[#888]">{{ answer?.createAt }}</text>
              <view class="w-[64rpx] h-[64rpx] rounded-[12rpx] overflow-hidden bg-[#fff] shadow-[0_8rpx_32rpx_rgba(0,0,0,0.15)] flex flex-row items-center justify-center">
                
                <image class="w-full h-full" :src="renderAvatar" mode="aspectFill" @error="handleAvatarError" @click="previewImage([renderAvatar])" />
              </view>
            </view>
            <view class="w-full p-[32rpx] box-border rounded-[32rpx] overflow-hidden bg-[#07c160] shadow-[0_8rpx_32rpx_rgba(0,0,0,0.15)] transition-all duration-300 will-change-height">
              <view class="flex flex-col gap-[16rpx]">
                <text class="text-[#222] text-[30rpx]">{{
                  answer?.answer
                  }}</text>
              </view>
            </view>
          </view>

          <view
            class="max-w-[calc(100%-32rpx)] flex flex-col gap-[16rpx]">
            <view class="w-full h-[64rpx] flex flex-row items-center justify-start gap-[16rpx]">
              <view class="w-[64rpx] h-[64rpx] rounded-[12rpx] overflow-hidden bg-[#fff] shadow-[0_8rpx_32rpx_rgba(0,0,0,0.15)] flex flex-row items-center justify-center">
                <image class="w-full h-full" :src="renderAIAvatar" mode="aspectFill" @click="previewImage([renderAIAvatar])" />
                
              </view>
              <text class="text-[24rpx] text-[#888]">灵境画猜</text>
            </view>
            <view class="w-full p-[32rpx] box-border rounded-[32rpx] overflow-hidden bg-[#ffffff] shadow-[0_8rpx_32rpx_rgba(0,0,0,0.15)] transition-all duration-300 will-change-height">
              <view class="flex flex-col gap-[16rpx]">
                <view class="w-full flex flex-row items-baseline gap-[12rpx]">
                  <text class="text-[green] text-[48rpx]">{{ answer?.aiAnswer?.total_score }}分</text>
                  <text class="text-[#222] text-[24rpx]">{{
                    renderScore(answer?.aiAnswer?.total_score || 0)
                    }}</text>
                </view>
                <text class="text-[#222] text-[30rpx]">{{
                  answer?.aiAnswer?.response_text
                  }}</text>
              </view>
            </view>
          </view>
        </view>

        <view class="fixed left-0 bottom-0 w-full bg-[transparent] flex flex-row items-start" :style="{height: `calc(100rpx + ${safeBottom}px)`}" v-if="canContinue">
          <view class="w-full h-[100rpx] flex flex-row items-center justify-center">
            <view class="h-[80rpx] px-[24rpx] box-border rounded-[12rpx] overflow-hidden bg-[#ff7a1c] shadow-[0_8rpx_32rpx_rgba(0,0,0,0.15)] active:bg-[#ff9a3c] active:scale-95 transition-all duration-300 flex flex-row items-center justify-center"> 
              <text class="text-[28rpx] text-[#fff]">继续描述</text>
            </view>
          </view>
        </view>

        <view class="w-full" :style="{height: `calc(132rpx + ${safeBottom}px)`}"></view>
        
      </scroll-view>
    </Layout>
  </view>
</template>

<script setup lang="ts">
import CustomHeader from "@/components/custom-header/custom-header.vue";
import Layout from "@/components/layout/layout.vue";
import PageLoading from "@/components/page-loading/page-loading.vue";
import { DEFAULT_AI_AVATAR, DEFAULT_AVATAR } from "@/config/config";
import { requestGetAnswers } from "@/request";
import {type LoginInfo, useUserStore } from "@/stores/user";
import type { IAnswer } from "@/types";
import { getDescriptionByScore } from "@/utils/qa";
import { onLoad } from "@dcloudio/uni-app";
import { storeToRefs } from "pinia";
import { computed, nextTick, type Ref, ref } from "vue";
import { previewImage } from "@/utils";

const safeBottom = uni.getWindowInfo().safeAreaInsets?.bottom || 0;

const userStore = useUserStore();
const { loginInfo }: { loginInfo: Ref<LoginInfo> } = storeToRefs(userStore);

const questionId = ref<string>("");

const pageReady = ref(false);

const answers = ref<IAnswer[]>([]);

// 是否显示继续描述按钮
const canContinue = ref(false);

const renderAvatar = ref();
const renderAIAvatar = ref(DEFAULT_AI_AVATAR);

const renderScore = computed(() => {
  return function (score: number) {
    return getDescriptionByScore(score);
  };
});

onLoad((options: any) => {
  questionId.value = options.questionId;
  canContinue.value = options?.canContinue ? (options.canContinue == '1') : false;
  nextTick(() => {
    setTimeout(() => {
      renderAvatar.value = loginInfo.value?.avatar || DEFAULT_AVATAR;
      getAnswerHistory();
    }, 400);
  });
});

async function getAnswerHistory() {
  const res = await requestGetAnswers({
    userId: loginInfo.value?.id,
    questionId: questionId.value,
  });
  if (res.code == 200 && res.data && res.data.list) {
    answers.value = res.data.list || [];
  }

  pageReady.value = true;
}

function handleAvatarError() {
  renderAvatar.value = DEFAULT_AVATAR;
}
</script>

<style scoped>
.answer_history {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}
</style>
