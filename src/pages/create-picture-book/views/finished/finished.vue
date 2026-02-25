<template>
  <view class="w-full h-full flex flex-col items-center justify-center">
    <scroll-view scroll-y class="w-full h-full">
      <view class="w-full" :style="{ height: `${headerHeight}px` }"></view>

      <view
        class="w-full px-[32rpx] py-[32rpx] box-border flex flex-col gap-[24rpx]"
        :style="{
          minHeight: `calc(100% - ${headerHeight}px - 128rpx - 96rpx - ${safeBottom}px)`,
        }"
      >
        <view
          class="w-[500rpx] mx-auto mt-[32rpx] p-[24rpx] box-border bg-white border border-black/5 flex flex-col gap-[24rpx]"
          :class="[defaultTheme.shadow.main, defaultTheme.rounded.main]"
        >
          <view
            class="relative w-full"
            :style="{ height: renderImageHeight(formData!.ratio) + 'rpx' }"
          >
            <image
              class="w-full h-full overflow-hidden"
              :class="[defaultTheme.rounded.main]"
              :src="pbDetail?.cover?.url"
              mode="aspectFill"
              @error="handleImageError"
            />
            <view
              class="absolute left-0 top-0 w-full h-full bg-[#e8e8e8] flex flex-row items-center justify-center overflow-hidden"
              :class="[defaultTheme.rounded.main]"
              v-if="!pbDetail?.cover?.url || imageLoadError"
            >
              <image
                class="w-full h-full z-[9]"
                :src="
            isHorizontalRatio(formData!.ratio)
              ? 'https://img.liangqy.com/crawlerjet/picture_book/img/pb_default_horizontal.png'
              : 'https://img.liangqy.com/crawlerjet/picture_book/img/pb_default_vertical.png'
          "
                mode="aspectFill"
                @error="handleImageError"
              />
            </view>
            <view
              class="absolute left-0 top-0 w-full h-full z-[99] flex flex-row items-center justify-center"
              v-if="loadingImageIds.has(pbDetail?.cover?.id ?? '')"
            >
              <CustomLoader />
            </view>
          </view>

          <view
            class="w-full h-[48rpx] flex flex-row items-center justify-center"
          >
            <text class="text-[36rpx] text-[#000] font-bold">
              {{ pbDetail?.title }}
            </text>
          </view>

          <view
            class="w-full h-[80rpx] flex flex-row items-center justify-center"
          >
            <view
              class="h-full px-[24rpx] flex flex-row items-center justify-center gap-[12rpx] active:scale-95 transition-all duration-300"
              :class="[defaultTheme.rounded.button]"
              :style="{
                border: `1rpx solid ${ThemeColors.primary}`,
                backgroundColor: ThemeColors.primary100,
              }"
            >
              <button
                open-type="share"
                class="w-full h-full border-none after:border-none bg-transparent p-0 flex flex-row items-center justify-center"
              >
                <svg-icon
                  :src="`/static/${iconThemeVersion}/icon_share.svg`"
                  class="w-[32rpx] h-[32rpx]"
                  :color="ThemeColors.primary"
                />
                <text
                  class="text-[28rpx]"
                  :style="{ color: ThemeColors.primary }"
                >
                  分享给好友
                </text>
              </button>
            </view>
          </view>
        </view>
      </view>

      <view
        class="w-full px-[32rpx] box-border sticky left-0 bottom-0 bg-white bg-gradient-to-t from-background-light via-background-light to-transparent dark:from-background-dark dark:via-background-dark/95 z-40 flex flex-col items-center justify-center gap-[32rpx]"
        :style="{
          height: `calc(128rpx + 96rpx + ${safeBottom}px)`,
          paddingBottom: `${safeBottom}px`,
        }"
      >
        <view
          class="w-full h-[88rpx] py-4 active:scale-95 transition-all flex items-center justify-center gap-2"
          :class="[defaultTheme.rounded.button]"
          :style="{
            backgroundColor: ThemeColors.primary,
            boxShadow: `0 10px 15px -3px ${ThemeColors.primary300}`,
          }"
          @click="gotoPublish"
        >
          <svg-icon
            :src="`/static/${iconThemeVersion}/icon_publish.svg`"
            class="w-[32rpx] h-[32rpx]"
            :color="ThemeColors.text.white"
          />
          <text class="text-[34rpx] text-white font-bold">立即发布</text>
        </view>

        <view
          class="w-full h-[56rpx] flex flex-row items-center justify-center active:scale-96 transition-all duration-300"
          @click="gotoRead"
        >
          <text
            class="text-[28rpx]"
            :style="{
              color: ThemeColors.primary,
            }"
            >开始阅读</text
          >
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { iconThemeVersion, ThemeColors, defaultTheme } from "@/config/config";
import { type IPictureBook } from "@/types";
import { computed, inject, onMounted, ref, type Ref } from "vue";
import { type ICreatePictureBookFormData } from "../../types";
import CustomLoader from "@/components/custom-loader/custom-loader.vue";
import { usePictureBookStore } from "@/stores/picture_book";

const pictureBookStore = usePictureBookStore();

const $emit = defineEmits<{
  (e: "on-publish", params: any): void;
}>();

const formData = inject<Ref<ICreatePictureBookFormData>>("formData");
const pbDetail = inject<Ref<IPictureBook>>("pbDetail");

const imageLoadError = ref(false);

const pbPublished = ref(false);

// 正在加载图片的id列表
const loadingImageIds = ref<Set<string>>(new Set());

const safeTop = uni.getWindowInfo().safeAreaInsets?.top || 0;
const safeBottom = uni.getWindowInfo().safeAreaInsets?.bottom || 0;

const headerHeight = computed(() => {
  return safeTop + uni.upx2px(168);
});

const isHorizontalRatio = computed(() => {
  return (ratio: string) => {
    return Number(ratio.split(":")[0]) > Number(ratio.split(":")[1]);
  };
});

const renderMinHeight = computed(() => {
  const r = ["16", "9"];
  const width = Number(r[0]);
  const height = Number(r[1]);

  return (500 * height) / width;
});

const renderMaxHeight = computed(() => {
  const r = ["3", "4"];
  const width = Number(r[0]);
  const height = Number(r[1]);

  return (500 * height) / width;
});

const renderImageHeight = computed(() => {
  return function (ratio: string) {
    const r = ratio ? ratio.split(":") : ["16", "9"];
    const width = Number(r[0]);
    const height = Number(r[1]);

    const newHeight = (500 * height) / width;
    return Math.min(
      Math.max(renderMinHeight.value, newHeight),
      renderMaxHeight.value
    );
  };
});

onMounted(() => {});

async function gotoRead() {
  if (!pbDetail?.value) {
    return;
  }
  if (
    Number(pbDetail.value.config.ratio.split(":")[0]) >
    Number(pbDetail.value.config.ratio.split(":")[1])
  ) {
    uni.redirectTo({
      url: `/pages/picture-book-detail-horizontal/picture-book-detail-horizontal?id=${pbDetail.value.id}`,
    });
  } else {
    uni.redirectTo({
      url: `/pages/picture-book-detail/picture-book-detail?id=${pbDetail.value.id}`,
    });
  }
}

async function gotoPublish() {
  const res = await pictureBookStore.submitReviewPictureBook({
    pbId: pbDetail?.value.id,
  });

  if (res.code !== 200) {
    uni.showToast({
      title: res.message || "提审失败，请稍后再试",
      icon: "none",
    });
    return;
  }
  uni.showToast({
    title: "提审成功",
    icon: "success",
  });
  pbPublished.value = true;
}

function handleImageError() {
  imageLoadError.value = true;
}
</script>

<style scoped></style>
