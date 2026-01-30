<template>
  <view class="relative w-full flex flex-row items-center justify-center">
    <view
      class="w-full rounded-[24rpx] bg-white p-4 inner-radius shadow-sm border border-black/5"
    >
      <view class="flex items-center justify-between mb-4">
        <view class="flex flex-row items-center gap-2">
          <svg-icon
            :src="`/static/${iconThemeVersion}/icon_pb_draft.svg`"
            class="w-[36rpx] h-[36rpx]"
            :color="ThemeColors.text.title"
          />
          <text class="text-base font-bold">绘本草稿</text>
          <text class="text-xs text-black/40 dark:text-white/40 font-medium"
            >{{ totalCount }}个未完成</text
          >
        </view>
        <view
          class="h-full pl-[24rpx] flex flex-row items-center justify-center"
        >
          <text
            class="text-[24rpx] font-bold"
            :style="{ color: ThemeColors.primary }"
            @click="handleViewAll"
            >查看全部</text
          >
        </view>
      </view>
      <view
        class="relative min-h-[502rpx] flex gap-3 overflow-x-auto hide-scrollbar pb-1"
      >
        <scroll-view
          class="w-full transition-all duration-300"
          scroll-x
          :class="[
            pageReady
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none',
          ]"
        >
          <view class="flex flex-row items-center gap-[32rpx]">
            <view
              class="flex-shrink-0 w-[256rpx]"
              v-for="pb in draftPictureBooks"
              :key="pb.id"
            >
              <view
                class="relative w-full h-[342rpx] rounded-lg bg-cover opacity-80 bg-center mb-2 shadow-inner border border-black/5 overflow-hidden"
              >
                <view
                  class="absolute left-0 top-0 w-full h-full bg-[#e8e8e8] flex flex-row items-center justify-center"
                  v-if="!pb.cover?.url || errorImageIds.has(pb.id)"
                >
                  <image
                    class="w-full h-full z-[9]"
                    :src="
                      isHorizontalRatio(pb.config.ratio)
                        ? 'https://img.liangqy.com/crawlerjet/picture_book/img/pb_default_horizontal.png'
                        : 'https://img.liangqy.com/crawlerjet/picture_book/img/pb_default_vertical.png'
                    "
                    mode="widthFix"
                    @error="handleImageError(pb.id)"
                  />
                </view>
                <image
                  class="w-full h-full z-[9]"
                  :src="pb.cover?.url"
                  mode="aspectFill"
                  @error="handleImageError(pb.id)"
                />
              </view>
              <text
                class="text-[26rpx] font-bold text-center line-clamp-1 mb-2"
              >
                {{ pb.title }}
              </text>
              <button
                class="w-full py-1.5 text-[24rpx] font-bold rounded-full border active:scale-95 transition-all duration-300"
                :style="{
                  backgroundColor: ThemeColors.primary100,
                  color: ThemeColors.primary,
                  borderColor: ThemeColors.primary,
                }"
                @click="handleViewPictureBook(pb)"
              >
                继续创作
              </button>
            </view>
          </view>
        </scroll-view>

        <view
          class="absolute left-0 top-0 w-full h-full rounded-[24rpx] bg-black/20 z-10 flex flex-row items-center justify-center"
          v-if="!pageReady"
        >
          <CustomLoader></CustomLoader>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { iconThemeVersion, ThemeColors } from "@/config/config";
import { computed, nextTick, onMounted, ref } from "vue";
import { usePictureBookStore } from "@/stores/picture_book";
import { IPictureBook } from "@/types";
import CustomLoader from "@/components/custom-loader/custom-loader.vue";

const pictureBookStore = usePictureBookStore();

const pageReady = ref(false);
const isLoading = ref(false);

const draftPictureBooks = ref<IPictureBook[]>([]);

const pageIndex = ref(1);
const pageSize = ref(20);
const totalCount = ref(0);
const totalPage = ref(1);

// 加载失败的图片id列表
const errorImageIds = ref<Set<string>>(new Set());

const isHorizontalRatio = computed(() => {
  return (ratio: string) => {
    return Number(ratio.split(":")[0]) > Number(ratio.split(":")[1]);
  };
});

onMounted(() => {
  nextTick(async () => {
    await getMyDraftPictureBooks();
  });
});

async function getMyDraftPictureBooks() {
  if (isLoading.value) {
    return;
  }

  isLoading.value = true;

  const res = await pictureBookStore.getMyPictureBooks({
    type: "draft",
    pageIndex: pageIndex.value,
    pageSize: pageSize.value,
  });

  if (res.code == 200 && res.data) {
    totalCount.value = res.data.totalCount;
    totalPage.value = res.data.totalPage;

    if (res.data.pageIndex == 1) {
      draftPictureBooks.value = [];
    }

    draftPictureBooks.value = [
      ...draftPictureBooks.value,
      ...(res.data.list || []),
    ];
  }

  isLoading.value = false;
  nextTick(() => {
    pageReady.value = true;
  });
}

function handleImageError(id: string) {
  errorImageIds.value.add(id);
}

function handleViewAll() {
  uni.navigateTo({
    url: `/pages/picture-book-list/picture-book-list?type=draft`,
  });
}

function handleViewPictureBook(pb: IPictureBook) {
  uni.navigateTo({
    url: `/pages/edit-picture-book/edit-picture-book?id=${pb.id}`,
  });
}
</script>

<style scoped></style>
