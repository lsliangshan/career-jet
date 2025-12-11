<template>
  <view class="answer_history w-full h-full">
    <CustomHeader show-back :title="`答题历史`" />

    <Layout :hasHeader="true">
      <PageLoading v-if="!pageReady" />

      <empty v-else-if="pageReady && answers.length === 0" />

      <scroll-view type="custom" scroll-y class="relative w-full h-full flex flex-col" v-else>
        <view class="w-full h-[32rpx]"></view>

        <view class="w-full mt-[32rpx] px-[32rpx] box-border flex flex-col gap-[32rpx]" v-for="(answer, index) in answers" :key="answer.id">
          <view
            class="max-w-[calc(100%-32rpx)] ml-[32rpx] py-[32rpx] box-border rounded-[32rpx] overflow-hidden bg-[#07c160] shadow-[0_8rpx_32rpx_rgba(0,0,0,0.15)] flex flex-row">
            <view class="w-full px-[32rpx] box-border transition-all duration-300 will-change-height">
              <view class="flex flex-col gap-[16rpx]">
                <text class="text-[#222] text-[30rpx]">{{
                  answer?.answer
                  }}</text>
              </view>
            </view>
          </view>
          <view
            class="max-w-[calc(100%-32rpx)] py-[32rpx] box-border rounded-[32rpx] overflow-hidden bg-[#ffffff] shadow-[0_8rpx_32rpx_rgba(0,0,0,0.15)] flex flex-row">
            <view class="w-full px-[32rpx] box-border transition-all duration-300 will-change-height">
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
      </scroll-view>
    </Layout>
  </view>
</template>

<script setup lang="ts">
import CustomHeader from "@/components/custom-header/custom-header.vue";
import Layout from "@/components/layout/layout.vue";
import PageLoading from "@/components/page-loading/page-loading.vue";
import { requestGetAnswers } from "@/request";
import { useUserStore } from "@/stores/user";
import type { IAnswer } from "@/types";
import { getDescriptionByScore } from "@/utils/qa";
import { onLoad } from "@dcloudio/uni-app";
import { storeToRefs } from "pinia";
import { computed, nextTick, ref } from "vue";

const userStore = useUserStore();
const { loginInfo } = storeToRefs(userStore);

const questionId = ref<string>("");

const pageReady = ref(false);

const answers = ref<IAnswer[]>([]);

const renderScore = computed(() => {
  return function (score: number) {
    return getDescriptionByScore(score);
  };
});

onLoad((options: any) => {
  questionId.value = options.questionId;
  nextTick(() => {
    setTimeout(() => {
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
</script>

<style scoped>
.answer_history {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}
</style>
