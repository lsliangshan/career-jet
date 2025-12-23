<template>
  <view class="question-history w-full h-full">
    <CustomHeader show-back :title="`历史记录`" />

    <Layout :hasHeader="true">
      <PageLoading v-if="!pageReady" />

      <empty v-else-if="pageReady && userAnswerHistory.length === 0" />

      <view class="relative w-full h-full overflow-hidden" v-else>
        <refresher-success v-model="refresherSuccessVisible" :text="successTip" />
        <scroll-view type="custom" class="w-full h-full" scroll-y refresher-enabled refresher-default-style="none"
          :refresher-triggered="refresherTriggered" @refresherrefresh="refresherrefresh" @scrolltolower="onScrollToLower">
          <template #refresher>
            <view class="w-full h-[100rpx] pt-[24rpx] box-border flex flex-row items-center justify-center">
              <view class="w-[100rpx] h-[100rpx] rounded-[8rpx] flex flex-row items-center justify-center">
                <image class="w-[40rpx] h-[40rpx] animate-spin" src="@static/icon_loading.png" mode="aspectFit" />
              </view>
            </view>
          </template>

          <view class="w-full h-[24rpx]"></view>

          <view class="w-full flex flex-col gap-[24rpx]">
            <view class="w-full px-[32rpx] box-border flex flex-row items-center" v-for="answer in userAnswerHistory" :key="answer.id" @click="handleViewAnswer(answer)">
              <view class="w-full h-full px-[32rpx] py-[24rpx] box-border rounded-[24rpx] overflow-hidden shadow-[0_0rpx_4rpx_rgba(0,0,0,0.15)] bg-[#fff] active:bg-[#f8f8f8] active:scale-95 transition-all duration-300 flex flex-row items-center gap-[24rpx]">
                <view class="h-[120rpx] w-[214rpx] bg-[#f8f8f8] rounded-[12rpx] overflow-hidden border border-[1rpx] border-[#f8f8f8] box-border" @click.stop="previewImage([answer.question.image])">
                  <image class="w-full h-full" :src="answer.question.image" mode="aspectFill" />
                </view>
                <view class="w-full flex flex-col gap-[12rpx]">
                  <text class="text-[28rpx] text-[#222] font-[500]">{{ answer.question.title }}</text>
                  <text class="text-[24rpx] text-[#888]">{{ answer.createAt }}</text>
                </view>
                <view class="h-[120rpx] w-[80rpx] flex flex-row items-center justify-center">
                  <image class="w-[32rpx] h-[32rpx]" src="@static/icon_arraw_right.png" mode="aspectFit" />
                </view>
              </view>
            </view>
          </view>

          <view class="w-full h-[112rpx] flex flex-row items-center justify-center" v-if="!isLoading && userAnswerHistory.length > 0 && pageIndex == totalPage">
            <text class="text-[24rpx] text-[#888]">无更多数据</text>
          </view>
          <view class="w-full h-[112rpx] flex flex-row items-center justify-center gap-[16rpx]" v-else-if="isLoading || (userAnswerHistory.length > 0 && pageIndex < totalPage)">
            <view class="w-[20rpx] h-[20rpx] rounded-[8rpx] flex flex-row items-center justify-center">
              <image class="w-full h-full animate-spin" src="@static/icon_loading.png" mode="aspectFit" />
            </view>
            <text class="text-[24rpx] text-[#888]">加载中</text>
          </view>
          

          <view class="w-full" :style="{ height: `calc(${safeBottom}px)` }"></view>
        </scroll-view>
      </view>
    </Layout>
  </view>
</template>

<script setup lang="ts">
import CustomHeader from "@/components/custom-header/custom-header.vue";
import Layout from "@/components/layout/layout.vue";
import PageLoading from "@/components/page-loading/page-loading.vue";
import Empty from "@/components/empty/empty.vue";
import { useQuestionStore } from "@/stores/question";
import type { IAnswerHistory } from "@/types";
import { nextTick, onMounted, ref } from "vue";
import { previewImage } from "@/utils";

const questionStore = useQuestionStore();

const safeBottom = uni.getWindowInfo().safeAreaInsets?.bottom || 0;

const refresherSuccessVisible = ref(false);
const isRefreshing = ref(false);
const successTip = ref("答题历史已更新");
const refresherTriggered = ref(false);

const pageReady = ref(false);
const isLoading = ref(false);

const userAnswerHistory = ref<IAnswerHistory[]>([]);

const pageIndex = ref(1);
const pageSize = ref(20);
const totalCount = ref(0);
const totalPage = ref(1);

onMounted(() => {
  nextTick(async () => {
    await getUserAnswerHistory();
  });
});

// 下拉刷新
async function refresherrefresh () {
  if (isRefreshing.value) {
    return;
  }

  isRefreshing.value = true;
  refresherTriggered.value = true;

  pageIndex.value = 1;

  await getUserAnswerHistory();

  nextTick(() => {
    const t = setTimeout(() => {
      clearTimeout(t);
      refresherTriggered.value = false;
      isRefreshing.value = false;
      refresherSuccessVisible.value = true;
    }, 500);
  });
};

// 上拉加载更多
async function onScrollToLower() {
  if (pageIndex.value >= totalPage.value || isLoading.value) {
    return
  }
  pageIndex.value++
  await getUserAnswerHistory()
}

async function getUserAnswerHistory() {
  if (isLoading.value) {
    return;
  }

  isLoading.value = true;

  const res = await questionStore.getUserAnswerHistory({
    pageIndex: pageIndex.value,
    pageSize: pageSize.value,
  });
  
  if (res.code == 200 && res.data) {
    totalCount.value = res.data.totalCount;
    totalPage.value = res.data.totalPage;

    if (res.data.pageIndex == 1) {
      userAnswerHistory.value = [];
    }
    
    userAnswerHistory.value = [
      ...userAnswerHistory.value,
      ...(res.data.list || []),
    ];
  }

  pageReady.value = true;
  isLoading.value = false;
}

function handleViewAnswer(answer: IAnswerHistory) {
  uni.navigateTo({
    url: `/pages/answer-history/answer-history?questionId=${answer.question.id}&canContinue=1`,
    complete: () => {
      refresherSuccessVisible.value = false;
    },
  });
}
</script>

<style scoped>
.question-history {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}
</style>
