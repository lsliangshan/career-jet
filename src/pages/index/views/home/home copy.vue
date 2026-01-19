<template>
  <view class="picture-book-list relative w-full h-full">
    <view
      class="w-full absolute bg-[transparent] border-none left-0 top-0 z-10 border-b border-[1rpx] flex flex-col"
      :style="{
        backgroundColor: 'transparent',
        height: `calc(176rpx + ${safeTop}px)`,
        paddingTop: `${safeTop}px`,
      }"
    >
      <view
        class="relative w-full h-[88rpx] flex flex-row items-center"
        :style="{ width: `calc(${safeTitleWidth}px)` }"
      >
        <view
          class="w-full h-full px-[24rpx] box-border flex flex-row items-center justify-center"
        >
          <input
            type="text"
            class="w-full h-[80rpx] bg-[transparent] border border-[1rpx] border-[#d8d8d8] rounded-[40rpx] px-[24rpx] box-border"
            placeholder="搜索绘本故事"
          />
        </view>
      </view>

      <view class="w-full h-[88rpx] px-[24rpx] box-border">
        <scroll-view
          type="custom"
          scroll-x
          class="w-full h-full pt-[12rpx] box-border whitespace-nowrap"
        >
          <view
            class="h-[64rpx] mr-[6rpx] px-[24rpx] box-border rounded-full transition-all duration-300 border border-gray-100 inline-flex flex-row items-center justify-center"
            v-for="(tab, key) in tabs"
            :key="key"
            :style="{
              backgroundColor: activeTheme === key ? mainColor : 'white',
            }"
            @click="handleActiveTheme(key)"
          >
            <text
              class="text-[28rpx] font-medium"
              :class="[activeTheme === key ? 'text-white' : 'text-[#4c739a]']"
              >{{ tab }}</text
            >
          </view>
        </scroll-view>
      </view>
    </view>

    <Layout :hasHeader="true" :gap="88">
      <PageLoading v-if="!pageReady" />

      <empty v-else-if="pageReady && pictureBooks.length === 0" />

      <view class="relative w-full h-full overflow-hidden" v-else>
        <refresher-success
          v-model="refresherSuccessVisible"
          :text="successTip"
        />
        <scroll-view
          type="nested"
          class="w-full h-full"
          scroll-y
          refresher-enabled
          refresher-default-style="none"
          :refresher-triggered="refresherTriggered"
          @refresherrefresh="refresherrefresh"
          @scrolltolower="onScrollToLower"
        >
          <template #refresher>
            <view
              class="w-full h-[100rpx] pt-[24rpx] box-border flex flex-row items-center justify-center"
            >
              <view
                class="w-[100rpx] h-[100rpx] rounded-[8rpx] flex flex-row items-center justify-center"
              >
                <image
                  class="w-[40rpx] h-[40rpx] animate-spin"
                  src="@static/icon_loading.png"
                  mode="aspectFit"
                />
              </view>
            </view>
          </template>

          <nested-scroll-body>
            <scroll-view
              type="custom"
              scroll-x
              :scroll-into-view="scrollToView"
              :scroll-with-animation="true"
              class="w-full h-full whitespace-nowrap"
              @touchstart="handleDragStart"
              @touchend="handleDragEnd"
            >
              <view
                v-for="value in Object.keys(tabs)"
                :id="`tab-${value}`"
                class="inline-block w-full h-full"
              >
                <!-- <view
                  class="w-full h-full flex flex-row items-center justify-center bg-[#fff]"
                >
                  <text class="text-[28rpx] font-medium">{{
                    tabs[value as keyof typeof tabs]
                  }}</text>
                </view> -->
                <PbList :type="(value as keyof typeof tabs)"></PbList>
              </view>
            </scroll-view>
          </nested-scroll-body>
        </scroll-view>
      </view>
    </Layout>
  </view>
</template>

<script setup lang="ts">
import Layout from "@/components/layout/layout.vue";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import type { IPictureBook } from "@/types";
import { usePictureBookStore } from "@/stores/picture_book";
import { mainColor, moralities, tabs } from "@/config/config";
import RefresherSuccess from "@/components/RefresherSuccess.vue";
import PageLoading from "@/components/page-loading/page-loading.vue";
import Empty from "@/components/empty/empty.vue";
import PbList from "./PbList.vue";

const safeTop = uni.getWindowInfo().safeAreaInsets?.top || 0;

const { left: safeTitleWidth } = uni.getMenuButtonBoundingClientRect();

const pictureBookStore = usePictureBookStore();

// 全部、阅读最多、收藏最多
const activeTheme = ref<keyof typeof tabs>("all");
const scrollToView = ref("tab-all");

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

watch(
  () => scrollToView.value,
  (newVal) => {
    activeTheme.value = newVal.split("-")[1] as keyof typeof tabs;
  }
);

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

function handleActiveTheme(value: keyof typeof tabs) {
  activeTheme.value = value;
  scrollToView.value = `tab-${value}`;
}

const clientX = ref(0);
const touchTs = ref(0);

function getNextViewId() {
  const tabList = Object.keys(tabs).map((item) => `tab-${item}`);
  const currentIndex = tabList.indexOf(scrollToView.value);
  if (currentIndex === tabList.length - 1 || currentIndex === -1) {
    return scrollToView.value;
  } else {
    return tabList[currentIndex + 1];
  }
}

function getPreviousViewId() {
  const tabList = Object.keys(tabs).map((item) => `tab-${item}`);
  const currentIndex = tabList.indexOf(scrollToView.value);
  if (currentIndex === 0 || currentIndex === -1) {
    return scrollToView.value;
  } else {
    return tabList[currentIndex - 1];
  }
}

function handleDragStart(e: any) {
  clientX.value = e.changedTouches[0].clientX;
  touchTs.value = Date.now();
}

function handleDragEnd(e: any) {
  const offsetClientX = e.changedTouches[0].clientX - clientX.value;
  const offsetTime = Date.now() - touchTs.value;
  if (offsetClientX >= 0) {
    if (offsetClientX > 100 || offsetTime < 300) {
      scrollToView.value = getPreviousViewId();
    } else {
      // reset
      const tmpView = scrollToView.value;
      scrollToView.value = "";
      setTimeout(() => {
        scrollToView.value = tmpView;
      }, 0);
    }
  } else {
    if (offsetClientX < -100 || offsetTime < 300) {
      scrollToView.value = getNextViewId();
    } else {
      // reset
      const tmpView = scrollToView.value;
      scrollToView.value = "";
      setTimeout(() => {
        scrollToView.value = tmpView;
      }, 0);
    }
  }
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
