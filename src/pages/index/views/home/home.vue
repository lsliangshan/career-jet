<template>
  <view class="picture-book-list relative w-full h-full">
    <view class="w-full absolute bg-[transparent] border-none left-0 top-0 z-10 border-b border-[1rpx] flex flex-col"
      :style="{
        backgroundColor: 'transparent',
        height: `calc(176rpx + ${safeTop}px)`,
        paddingTop: `${safeTop}px`,
      }">
      <view class="relative w-full h-[88rpx] flex flex-row items-center"
        :style="{ width: `calc(${safeTitleWidth}px)` }">
        <view class="w-full h-full px-[24rpx] box-border flex flex-row items-center justify-center">
          <input type="text"
            class="w-full h-[80rpx] bg-[transparent] border border-[1rpx] border-[#d8d8d8] rounded-[40rpx] px-[24rpx] box-border"
            placeholder="搜索绘本故事" />
        </view>
      </view>

      <view class="w-full h-[88rpx] px-[24rpx] box-border">
        <scroll-view type="custom" scroll-x class="w-full h-full pt-[12rpx] box-border whitespace-nowrap">
          <view
            class="h-[64rpx] mr-[6rpx] px-[24rpx] box-border rounded-full transition-all duration-300 border border-gray-100 inline-flex flex-row items-center justify-center"
            :style="{
              backgroundColor: activeTheme === '全部' ? mainColor : 'white',
            }" @click="handleActiveTheme('全部')">
            <text class="text-[28rpx] font-medium" :class="[
              activeTheme === '全部' ? 'text-white' : 'text-[#4c739a]',
            ]">全部</text>
          </view>
          <view
            class="h-[64rpx] ml-[6rpx] mr-[6rpx] px-[24rpx] box-border rounded-full transition-all duration-300 border bg-white border-gray-100 inline-flex flex-row items-center justify-center"
            v-for="(item, i) in renderSubMoralities" :key="item.value" :style="{
              backgroundColor: activeTheme === item.value ? mainColor : 'white',
            }" @click="handleActiveTheme(item.value)">
            <text class="text-[28rpx] font-medium" :class="[
              activeTheme === item.value ? 'text-white' : 'text-[#4c739a]',
            ]">{{ item.name }}</text>
          </view>
        </scroll-view>
      </view>
    </view>

    <Layout :hasHeader="true" :gap="88">
      <PageLoading v-if="!pageReady" />

      <empty v-else-if="pageReady && pictureBooks.length === 0" />

      <view class="relative w-full h-full overflow-hidden" v-else>
        <refresher-success v-model="refresherSuccessVisible" :text="successTip" />
        <scroll-view type="custom" class="w-full h-full" scroll-y refresher-enabled refresher-default-style="none"
          :refresher-triggered="refresherTriggered" @refresherrefresh="refresherrefresh"
          @scrolltolower="onScrollToLower">
          <template #refresher>
            <view class="w-full h-[100rpx] pt-[24rpx] box-border flex flex-row items-center justify-center">
              <view class="w-[100rpx] h-[100rpx] rounded-[8rpx] flex flex-row items-center justify-center">
                <image class="w-[40rpx] h-[40rpx] animate-spin" src="@static/icon_loading.png" mode="aspectFit" />
              </view>
            </view>
          </template>

          <view class="w-full h-[24rpx]"></view>

          <grid-view type="masonry" :cross-axis-count="2" :main-axis-gap="12" :cross-axis-gap="12"
            :padding="[0, 12, 0, 12]" ref="waterfallRef">
            <view class="w-full" v-for="(pb, index) in pictureBooks" :key="pb.id" :style="{
              height: `${renderImageHeight(pb.config?.ratio) +
                (isHorizontalRatio(pb.config?.ratio) ? 154 : 0)
                }rpx`,
            }" @click="handleViewPictureBook(pb)">
              <view
                class="relative w-full rounded-tl-[24rpx] rounded-tr-[24rpx] overflow-hidden flex flex-row items-center justify-center"
                :class="[
                  isHorizontalRatio(pb.config.ratio)
                    ? ''
                    : 'rounded-bl-[24rpx] rounded-br-[24rpx]',
                ]" :style="{
                  height: `${renderImageHeight(pb.config?.ratio)}rpx`,
                }">
                <view class="absolute left-0 top-0 w-full h-full bg-[#e8e8e8] flex flex-row items-center justify-center"
                  v-if="!pb.cover?.url || errorImageIds.has(pb.id)">
                  <!-- <text class="text-[24rpx] text-[#c8c8c8]">{{
                    !pb.cover?.url ? "暂无封面" : "封面加载失败"
                  }}</text> -->
                  <image class="w-full h-full z-[9]"
                    :src="isHorizontalRatio(pb.config.ratio) ? 'https://img.liangqy.com/crawlerjet/picture_book/img/pb_default_horizontal.png' : 'https://img.liangqy.com/crawlerjet/picture_book/img/pb_default_vertical.png'"
                    mode="aspectFill" @error="handleImageError(pb.id)" />
                </view>
                <image class="w-full h-full z-[9]" :src="pb.cover?.url" mode="aspectFill"
                  @error="handleImageError(pb.id)" />
              </view>

              <view
                class="absolute z-[9] bottom-0 left-0 rounded-bl-[24rpx] rounded-br-[24rpx] p-[16rpx] box-border w-full flex flex-col gap-[8rpx]"
                :class="[
                  isHorizontalRatio(pb.config.ratio)
                    ? 'bg-[#fff]'
                    : 'bg-[rgba(0,0,0,0.2)]',
                ]">
                <view class="w-full h-[32rpx] flex flex-row items-center">
                  <view class="h-full px-[12rpx] box-border rounded-[12rpx] flex flex-row items-center justify-center"
                    :style="{
                      backgroundColor: mainColor,
                    }">
                    <text class="text-[20rpx] text-[#fff]">{{
                      pb.config.theme
                      }}</text>
                  </view>
                </view>
                <view class="w-full h-[36rpx] mt-[16rpx] flex flex-row items-center">
                  <text class="text-[30rpx] font-bold line-clamp-1 overflow-hidden text-ellipsis break-all" :class="[
                    isHorizontalRatio(pb.config.ratio)
                      ? 'text-[#181818]'
                      : 'text-[#fff]',
                  ]">{{ pb.title }}</text>
                </view>
                <view class="w-full h-[30rpx] flex flex-row items-center">
                  <text class="text-[24rpx]" :class="[
                    isHorizontalRatio(pb.config.ratio)
                      ? 'text-[#666]'
                      : 'text-[rgba(255,255,255,0.7)]',
                  ]">{{ pb.createAt }}</text>
                </view>
              </view>
            </view>
          </grid-view>

          <view class="w-full h-[112rpx] flex flex-row items-center justify-center" v-if="
            !isLoading && pictureBooks.length > 0 && pageIndex == totalPage
          ">
            <text class="text-[28rpx] text-[#888]">无更多数据</text>
          </view>
          <view class="w-full h-[112rpx] flex flex-row items-center justify-center gap-[16rpx]" v-else-if="
            isLoading || (pictureBooks.length > 0 && pageIndex < totalPage)
          ">
            <view class="w-[20rpx] h-[20rpx] rounded-[8rpx] flex flex-row items-center justify-center">
              <image class="w-full h-full animate-spin" src="@static/icon_loading.png" mode="aspectFit" />
            </view>
            <text class="text-[28rpx] text-[#888]">加载中</text>
          </view>

          <view class="w-full" :style="{ height: `calc(${safeBottom}px + 128rpx)` }"></view>
        </scroll-view>
      </view>
    </Layout>
  </view>
</template>

<script setup lang="ts">
import Layout from "@/components/layout/layout.vue";
import { computed, nextTick, onMounted, ref } from "vue";
import type { IPictureBook } from "@/types";
import { usePictureBookStore } from "@/stores/picture_book";
import { mainColor, moralities } from "@/config/config";
import RefresherSuccess from "@/components/RefresherSuccess.vue";
import PageLoading from "@/components/page-loading/page-loading.vue";
import Empty from "@/components/empty/empty.vue";

const safeBottom = uni.getWindowInfo().safeAreaInsets?.bottom || 0;

const safeTop = uni.getWindowInfo().safeAreaInsets?.top || 0;

const { left: safeTitleWidth } = uni.getMenuButtonBoundingClientRect();

const pictureBookStore = usePictureBookStore();

const activeTheme = ref<string>('全部');

const refresherSuccessVisible = ref(false);
const isRefreshing = ref(false);
const successTip = ref("已更新");
const refresherTriggered = ref(false);

const pageReady = ref(false);
const isLoading = ref(false);

const pageIndex = ref(1);
const pageSize = ref(20);
const totalCount = ref(0);
const totalPage = ref(1);

const pictureBooks = ref<IPictureBook[]>([]);

// 加载失败的图片id列表
const errorImageIds = ref<Set<string>>(new Set());

const isHorizontalRatio = computed(() => {
  return (ratio: string) => {
    return Number(ratio.split(":")[0]) > Number(ratio.split(":")[1]);
  };
});

const renderImageHeight = computed(() => {
  return function (ratio: string) {
    const r = ratio ? ratio.split(":") : ["16", "9"];
    const width = Number(r[0]);
    const height = Number(r[1]);

    return (378 * height) / width;
  };
});

const renderSubMoralities = computed(() => {
  return moralities.filter((item) => item.children.length > 0).flatMap((item) => {
    return item.children.map((child) => {
      return {
        name: child.name,
        value: child.en_name,
      };
    });
  }).flat();
});

onMounted(() => {
  nextTick(async () => {
    await getMyPictureBooks();
  });
});

// 下拉刷新
async function refresherrefresh() {
  if (isRefreshing.value) {
    return;
  }

  isRefreshing.value = true;
  refresherTriggered.value = true;

  pageIndex.value = 1;

  await getMyPictureBooks();

  nextTick(() => {
    const t = setTimeout(() => {
      clearTimeout(t);
      refresherTriggered.value = false;
      isRefreshing.value = false;
      refresherSuccessVisible.value = true;
    }, 500);
  });
}

// 上拉加载更多
async function onScrollToLower() {
  if (pageIndex.value >= totalPage.value || isLoading.value) {
    return;
  }
  pageIndex.value++;
  await getMyPictureBooks();
}

async function getMyPictureBooks() {
  if (isLoading.value) {
    return;
  }

  isLoading.value = true;

  const res = await pictureBookStore.getMyPictureBooks({
    pageIndex: pageIndex.value,
    pageSize: pageSize.value,
  });

  if (res.code == 200 && res.data) {
    totalCount.value = res.data.totalCount;
    totalPage.value = res.data.totalPage;

    if (res.data.pageIndex == 1) {
      pictureBooks.value = [];
    }

    pictureBooks.value = [...pictureBooks.value, ...(res.data.list || [])];
  }

  pageReady.value = true;
  isLoading.value = false;
}

function handleViewPictureBook(pb: IPictureBook) {
  console.log(">>> 跳转：", pb);
  if (
    Number(pb.config.ratio.split(":")[0]) >
    Number(pb.config.ratio.split(":")[1])
  ) {
    uni.navigateTo({
      url: `/pages/picture-book-detail-horizontal/picture-book-detail-horizontal?id=${pb.id}`,
      complete: () => {
        refresherSuccessVisible.value = false;
      },
    });
  } else {
    uni.navigateTo({
      url: `/pages/picture-book-detail/picture-book-detail?id=${pb.id}`,
      complete: () => {
        refresherSuccessVisible.value = false;
      },
    });
  }
}

function handleImageError(id: string) {
  console.log(">>>>>> handleImageError: ", id);
  errorImageIds.value.add(id);
}

function handleActiveTheme(value: string) {
  activeTheme.value = value;
}
</script>

<style>
.picture-book-list {
  background: #f0f0f0;
  /* background: linear-gradient(135deg, #ffe6ee 0%, #e6f0ff 100%); */
}

::-webkit-scrollbar {
  display: none !important;
}
</style>
