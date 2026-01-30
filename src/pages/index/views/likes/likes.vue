<template>
  <view
    class="w-full fixed top-0 left-0 z-10 bg-[rgba(248,248,245,0.5)] backdrop-blur-md border-none flex flex-col"
    :style="{
      height: `calc(80rpx +  ${safeTop}px)`,
      paddingTop: `${safeTop}px`,
    }"
  >
    <view
      class="z-[999] w-full h-[80rpx] px-[24rpx] box-border flex flex-row items-center"
      :style="{ width: `calc(${safeTitleWidth}px)` }"
    >
      <view
        class="w-full h-full px-[24rpx] box-border flex flex-row items-center justify-start"
      >
        <text class="text-[36rpx] font-bold">我的收藏</text>
      </view>
    </view>
  </view>
  <Layout :hasHeader="false">
    <PageLoading v-if="!pageReady" />

    <template v-else>
      <refresher-success
        :offset-y="headerHeight"
        v-model="refresherSuccessVisible"
        :text="successTip"
      />
      <scroll-view
        type="custom"
        class="w-full h-full"
        scroll-y
        refresher-enabled
        refresher-default-style="none"
        :refresher-triggered="refresherTriggered"
        @refresherrefresh="refresherrefresh"
        @refresherpulling="refresherpulling"
        @refresherrestore="refresherrestore"
        @refresherabort="refresherabort"
        @scrolltolower="onScrollToLower"
      >
        <template #refresher>
          <view
            class="w-full h-[100rpx] pt-[24rpx] box-border flex flex-row items-center justify-center"
          >
            <view
              class="w-[100rpx] h-[100rpx] rounded-[8rpx] flex flex-row items-center justify-center transition-opacity duration-300"
              :class="[refresherVisible ? 'opacity-100' : 'opacity-0']"
              :style="{
                marginTop: `${offsetTop}px`,
              }"
            >
              <CustomLoader :size="40" :color="ThemeColors.primary" />
            </view>
          </view>
        </template>

        <empty
          text="还没有收藏故事哦"
          description="去探索奇妙的世界并发现你喜爱的故事吧！"
          v-if="pageReady && pictureBooks.length === 0"
        >
          <template #action>
            <view
              class="w-full h-[64rpx] mt-[32rpx] flex flex-row items-center justify-center"
            >
              <view
                class="py-4 px-10 box-border rounded-[16px] shadow-lg shadow-primary/20 transition-transform active:scale-95"
                :style="{ backgroundColor: ThemeColors.primary }"
              >
                <text class="text-[30rpx] text-[#fff] font-bold"
                  >去发现故事</text
                >
              </view>
            </view>
          </template>
        </empty>

        <template v-else>
          <view class="w-full" :style="{ height: `${headerHeight}px` }"></view>
          <view class="w-full h-[24rpx]"></view>

          <grid-view
            type="masonry"
            :cross-axis-count="2"
            :main-axis-gap="12"
            :cross-axis-gap="12"
            :padding="[0, 12, 0, 12]"
            ref="waterfallRef"
          >
            <view
              class="w-full"
              v-for="(pb, index) in pictureBooks"
              :key="pb.id"
            >
              <PbCard type="favorite" :info="pb" />
            </view>
          </grid-view>

          <view
            class="w-full h-[112rpx] flex flex-row items-center justify-center"
            v-if="
              !isLoading && pictureBooks.length > 0 && pageIndex == totalPage
            "
          >
            <text class="text-[28rpx] text-[#888]">无更多数据</text>
          </view>
          <view
            class="w-full h-[112rpx] flex flex-row items-center justify-center gap-[16rpx]"
            v-else-if="
              isLoading || (pictureBooks.length > 0 && pageIndex < totalPage)
            "
          >
            <view
              class="w-[20rpx] h-[20rpx] rounded-[8rpx] flex flex-row items-center justify-center"
            >
              <CustomLoader :size="20" :color="ThemeColors.text.disabled" />
            </view>
            <text class="text-[28rpx] text-[#888]">加载中</text>
          </view>

          <view
            class="w-full"
            :style="{ height: `calc(${safeBottom}px + ${safeTop}px + 80rpx)` }"
          ></view>
        </template>
      </scroll-view>
    </template>
  </Layout>
</template>

<script setup lang="ts">
import { ThemeColors } from "@/config/config";
import type { IPictureBook } from "@/types";
import { computed, nextTick, onMounted, ref } from "vue";
import { usePictureBookStore } from "@/stores/picture_book";
import RefresherSuccess from "@/components/RefresherSuccess.vue";
import PageLoading from "@/components/page-loading/page-loading.vue";
import Empty from "@/components/empty/empty.vue";
import CustomLoader from "@/components/custom-loader/custom-loader.vue";
import PbCard from "@/components/pb-card/pb-card.vue";
import empty from "@/components/empty/empty.vue";
import Layout from "@/components/layout/layout.vue";

const pictureBookStore = usePictureBookStore();

const safeBottom = uni.getWindowInfo().safeAreaInsets?.bottom || 0;
const safeTop = uni.getWindowInfo().safeAreaInsets?.top || 0;

const { left: safeTitleWidth } = uni.getMenuButtonBoundingClientRect();

const pageReady = ref(false);

const refresherSuccessVisible = ref(false);
const isRefreshing = ref(false);
const successTip = ref("已更新");
const refresherTriggered = ref(false);

const refresherVisible = ref(false);

const pageIndex = ref(1);
const pageSize = ref(20);
const totalCount = ref(0);
const totalPage = ref(1);

const pictureBooks = ref<IPictureBook[]>([]);

const isLoading = ref(false);

const headerHeight = computed(() => {
  return safeTop + uni.upx2px(80);
});
const offsetTop = computed(() => {
  return safeTop + uni.upx2px(280);
});

onMounted(() => {
  nextTick(async () => {
    await getMyFavoritePictureBooks();
  });
});

async function getMyFavoritePictureBooks() {
  if (isLoading.value) {
    return;
  }

  isLoading.value = true;

  const res = await pictureBookStore.getMyFavoritePictureBooks({
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

function refresherpulling() {
  refresherVisible.value = true;
}

function refresherrestore() {
  refresherVisible.value = false;
}

function refresherabort() {
  refresherVisible.value = false;
}

// 下拉刷新
async function refresherrefresh() {
  if (isRefreshing.value) {
    return;
  }

  isRefreshing.value = true;
  refresherTriggered.value = true;

  pageIndex.value = 1;

  await getMyFavoritePictureBooks();

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
  await getMyFavoritePictureBooks();
}
</script>

<style scoped></style>
