<template>
  <view
    class="absolute bottom-[32rpx] right-[32rpx] w-[80rpx] h-[80rpx] bg-[#fff] shadow-[0_4rpx_24rpx_rgba(0,0,0,0.1)] rounded-[50%] flex flex-row items-center justify-center"
    @click.stop="handleViewAnswerHistory">
    <image class="w-[42rpx] h-[42rpx]" src="@static/icon_answer_history.png" mode="aspectFit" />

    <view
      class="absolute right-0 -top-[84rpx] h-[64rpx] px-[20rpx] box-border rounded-[8rpx] whitespace-nowrap pointer-events-none bg-[#000] flex flex-row items-center justify-center transition-opacity duration-300"
      :class="[answerHistoryTipVisible ? 'opacity-100' : 'opacity-0']">
      <text class="text-[24rpx] text-[#fff]">点击查看答题历史</text>
      <view class="absolute right-[28rpx] top-[54rpx] w-[24rpx] h-[24rpx] flex flex-row items-center justify-center">
        <image class="w-full h-full" src="@static/icon_caret_down.png" mode="aspectFit" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  questionId: string; // 题目ID
}

const props = defineProps<Props>();

const answerHistoryTipVisible = ref(true);

function handleViewAnswerHistory() {
  answerHistoryTipVisible.value = false;
  uni.navigateTo({
    url: `/pages/answer-history/answer-history?questionId=${props.questionId}`,
  });
}
</script>

<style scoped></style>