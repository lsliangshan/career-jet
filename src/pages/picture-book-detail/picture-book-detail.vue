<template>
  <view class="picture-book-detail relative w-full h-full">
    <PageLoading v-if="!pageReady" />

    <template v-else>
      <view
        class="absolute left-0 top-0 w-full h-full flex flex-row items-center justify-center"
      >
        <image
          class="w-full h-full"
          :src="pbDetail?.cover?.url"
          mode="aspectFill"
        ></image>
      </view>

      <view
        class="absolute left-0 w-full px-[32rpx] box-border flex flex-row items-center justify-center"
        :style="{ bottom: `calc(${safeBottom}px + 88rpx)` }"
      >
        <view
          class="w-full bg-[rgba(255,255,255,0.2)] backdrop-blur-[24rpx] border border-[2rpx] border-[rgba(255,255,255,0.3)] shadow-2xl rounded-[32rpx] p-[32rpx] box-border flex flex-col"
        >
          <view class="w-full h-[48rpx] mb-[32rpx] flex flex-row items-center">
            <view
              class="h-full px-[16rpx] box-border rounded-[24rpx] flex flex-row items-center justify-center"
              :style="{
                backgroundColor: mainColor,
              }"
            >
              <text class="text-[24rpx] text-[#fff]">{{
                pbDetail?.config.theme
              }}</text>
            </view>
          </view>

          <view class="w-full mb-[12rpx] flex flex-row items-center">
            <text
              class="text-2xl leading-tight font-bold text-[#fff] drop-shadow-md"
              >{{ pbDetail?.title }}</text
            >
          </view>

          <view
            class="w-full h-[48rpx] mb-[32rpx] flex flex-row items-center gap-[12rpx]"
          >
            <image
              class="w-[42rpx] h-[42rpx] rounded-full border border-[1rpx] border-[rgba(255,255,255,0.3)]"
              :src="renderAvatar"
              mode="aspectFill"
              @error="handleAvatarError"
            ></image>
            <text
              class="text-base text-[rgba(255,255,255,0.8)] drop-shadow-md"
              >{{ pbDetail?.author?.nickname }}</text
            >
          </view>

          <view
            class="w-full h-[108rpx] flex flex-row items-center justify-center"
          >
            <view
              class="relative flex w-full h-full items-center justify-center overflow-hidden rounded-full transition-all active:scale-95 shadow-lg shadow-primary/20"
              :style="{ backgroundColor: mainColor }"
            >
              <text class="text-lg font-bold text-[#fff]">Start Reading</text>
            </view>
          </view>
        </view>
      </view>
    </template>
  </view>
</template>

<script setup lang="ts">
import { usePictureBookStore } from "@/stores/picture_book";
import { IPictureBook } from "@/types";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { nextTick, ref } from "vue";
import PageLoading from "@/components/page-loading/page-loading.vue";
import { mainColor, DEFAULT_AI_AVATAR, DEFAULT_AVATAR } from "@/config/config";

const safeBottom = uni.getWindowInfo().safeAreaInsets?.bottom || 0;

const pictureBookStore = usePictureBookStore();

const renderAvatar = ref();

const id = ref("");

const pbDetail = ref<IPictureBook | null>(null);

const pageReady = ref(false);

onLoad((options: any) => {
  id.value = options.id;
  initPbDetail();
});

onShow(() => {
  nextTick(() => {
    setTimeout(() => {
      renderAvatar.value = pbDetail.value?.author?.avatar || DEFAULT_AVATAR;
    }, 400);
  });
});

function initPbDetail() {
  pictureBookStore
    .getPictureBookDetail({
      id: id.value,
    })
    .then((res: any) => {
      console.log(">>>>>> res: ", res);
      if (res.code !== 200) {
        uni.navigateBack({
          fail: () => {
            uni.reLaunch({
              url: "/pages/index/index",
            });
          },
        });
        uni.showToast({
          title: res.message || "获取绘本详情失败",
          icon: "none",
        });
        return;
      }
      pbDetail.value = res.data as IPictureBook;

      const t = setTimeout(() => {
        clearTimeout(t);
        pageReady.value = true;
      }, 500);
    });
}

function handleAvatarError() {
  renderAvatar.value = DEFAULT_AVATAR;
}
</script>

<style scoped>
.picture-book-detail {
  background: linear-gradient(135deg, #ffe6ee 0%, #e6f0ff 100%);
}
</style>
