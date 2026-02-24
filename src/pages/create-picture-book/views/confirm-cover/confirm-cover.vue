<template>
  <view class="w-full h-full flex flex-col items-center justify-center">
    <scroll-view scroll-y class="w-full h-full">
      <view class="w-full" :style="{ height: `${headerHeight}px` }"></view>

      <view
        class="w-full px-[32rpx] py-[32rpx] box-border flex flex-col gap-[24rpx]"
        :style="{
          minHeight: `calc(100% - ${headerHeight}px - 128rpx - ${safeBottom}px)`,
        }"
      >
        <view class="w-full">
          <ImageCard
            type="cover"
            :info="cover?.[0]"
            :ratio="formData!.ratio"
            :isLoading="loadingImageIds.has(cover?.[0]?.id ?? '')"
            :content="cover?.[0]?.prompt ?? ''"
          />
          <!-- <grid-view
            type="masonry"
            :cross-axis-count="2"
            :main-axis-gap="12"
            :cross-axis-gap="12"
            :padding="[0, 0, 0, 0]"
          >
            <view class="w-full" v-for="(c, index) in cover" :key="c.id">
              <ImageCard
                type="cover"
                :info="c"
                :ratio="formData!.ratio"
                :isLoading="loadingImageIds.has(c.id)"
                :content="c.prompt"
              />
            </view>
          </grid-view> -->
        </view>

        <view class="w-full flex flex-row items-start gap-[12rpx]">
          <view
            class="w-[40rpx] h-[40rpx] shrink-0 flex flex-row items-center justify-center"
          >
            <svg-icon
              :src="`/static/${iconThemeVersion}/icon_info.svg`"
              class="w-[32rpx] h-[32rpx]"
              :color="ThemeColors.primary"
            ></svg-icon>
          </view>
          <view class="w-full flex flex-row items-start justify-start">
            <text class="leading-[40rpx] text-[28rpx] text-[#888]"
              >提示：好的封面能吸引更多小朋友阅读哦。</text
            >
          </view>
        </view>
      </view>

      <view
        class="w-full px-[32rpx] box-border sticky left-0 bottom-0 bg-white bg-gradient-to-t from-background-light via-background-light to-transparent dark:from-background-dark dark:via-background-dark/95 z-40 flex flex-row items-center justify-center"
        :style="{
          height: `calc(128rpx + ${safeBottom}px)`,
          paddingBottom: `${safeBottom}px`,
        }"
      >
        <view
          class="w-full h-[88rpx] py-4 rounded-[24rpx] transition-all flex items-center justify-center gap-2"
          :class="[
            regeneratingImageIds.size === 0 &&
            loadingImageIds.size === 0 &&
            !isConfirming
              ? 'pointer-events-auto active:scale-95'
              : 'pointer-events-none',
            defaultTheme.shadow.main,
          ]"
          :style="{
            backgroundColor:
              regeneratingImageIds.size === 0 &&
              loadingImageIds.size === 0 &&
              !isConfirming
                ? ThemeColors.primary
                : ThemeColors.text.disabled,
            boxShadow: `0 10px 15px -3px ${
              regeneratingImageIds.size === 0 &&
              loadingImageIds.size === 0 &&
              !isConfirming
                ? ThemeColors.primary300
                : ThemeColors.text.disabled
            }`,
          }"
          @click="handleConfirmCover"
        >
          <CustomLoader
            v-if="isConfirming"
            color="#fff"
            :size="32"
          ></CustomLoader>
          <text class="text-[34rpx] text-white font-bold">{{
            isConfirming ? "正在确认封面..." : "确认封面，下一步"
          }}</text>
          <svg-icon
            :src="`/static/${iconThemeVersion}/icon_next.svg`"
            class="w-[32rpx] h-[32rpx]"
            :color="ThemeColors.text.white"
            v-if="!isConfirming"
          ></svg-icon>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { iconThemeVersion, ThemeColors, defaultTheme } from "@/config/config";
import { EEmitEvents, type ICoverItem } from "@/types";
import { computed, inject, nextTick, onMounted, ref, type Ref } from "vue";
import { type IStory, type ICreatePictureBookFormData } from "../../types";
import ImageCard from "@/components/image-card/image-card.vue";
import { requestGetImageUrls } from "@/request";
import { usePictureBookStore } from "@/stores/picture_book";
import CustomLoader from "@/components/custom-loader/custom-loader.vue";

const $emit = defineEmits<{
  (e: "on-confirmed", params: any): void;
}>();

const pictureBookStore = usePictureBookStore();

const cover = inject<Ref<ICoverItem[]>>("cover");
const formData = inject<Ref<ICreatePictureBookFormData>>("formData");
const story = inject<Ref<IStory>>("story");

// 正在加载图片的id列表
const loadingImageIds = ref<Set<string>>(new Set());

// 正在重新生成的图片的id列表
const regeneratingImageIds = ref<Set<string>>(new Set());

// 是否确认中
const isConfirming = ref(false);

const safeTop = uni.getWindowInfo().safeAreaInsets?.top || 0;
const safeBottom = uni.getWindowInfo().safeAreaInsets?.bottom || 0;

const headerHeight = computed(() => {
  return safeTop + uni.upx2px(168);
});

onMounted(() => {
  uni.$on(EEmitEvents.START_REGENERATE_COVER, handleStartRegenerateCover);
  uni.$on(EEmitEvents.REGENERATE_COVER_RESPONSE, handleRegenerateCoverResponse);
  uni.$on(EEmitEvents.REGENERATE_COVER_ERROR, handleRegenerateCoverError);
  listImageUrls(cover?.value?.map((cover: ICoverItem) => cover.taskId) ?? []) ??
    [];
});

function handleStartRegenerateCover(e: any) {
  if (!cover?.value) {
    return;
  }
  const index = cover.value.findIndex((c: ICoverItem) => c.id === e.cover.id);
  if (index === -1) {
    return;
  }
  regeneratingImageIds.value.add(e.cover.id);
}

function handleRegenerateCoverResponse(e: any) {
  if (!cover?.value) {
    return;
  }
  const index = cover.value.findIndex((c: ICoverItem) => c.id === e.cover.id);
  if (index === -1) {
    return;
  }
  regeneratingImageIds.value.delete(e.cover.id);
}

function handleRegenerateCoverError(e: any) {
  if (!cover?.value) {
    return;
  }
  const index = cover.value.findIndex((c: ICoverItem) => c.id === e.cover.id);
  if (index === -1) {
    return;
  }
  regeneratingImageIds.value.delete(e.cover.id);
}

async function handleConfirmCover() {
  if (
    loadingImageIds.value.size > 0 ||
    regeneratingImageIds.value.size > 0 ||
    !cover?.value ||
    isConfirming.value
  ) {
    return;
  }

  isConfirming.value = true;

  const res = await pictureBookStore.confirmCover({
    pbId: story?.value?.id ?? "",
    confirmed: cover.value,
  });

  if (res.code !== 200) {
    uni.showToast({
      title: "封面确认失败，请重新确认",
      icon: "none",
    });
  } else {
    $emit("on-confirmed", res.data);
  }

  nextTick(() => {
    isConfirming.value = false;
  });
}

function getIdByTaskId(taskId: string) {
  return cover?.value?.find((c: ICoverItem) => c.taskId === taskId)?.id ?? null;
}

async function listImageUrls(taskIds: string[]) {
  loadingImageIds.value.clear();
  if (!cover?.value) {
    return;
  }
  cover.value.forEach((c: ICoverItem) => {
    loadingImageIds.value.add(c.id);
  });
  const images: Map<string, string> = await requestGetImageUrls({
    taskIds,
  });

  images.forEach((url, taskId) => {
    const id = getIdByTaskId(taskId);

    if (id) {
      if (loadingImageIds.value.has(id)) {
        loadingImageIds.value.delete(id);
      }
      cover.value = cover.value?.map((c: ICoverItem) => {
        if (c.id === id) {
          return { ...c, url };
        }
        return c;
      });
    }
  });
}
</script>

<style scoped></style>
