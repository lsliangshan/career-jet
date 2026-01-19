<template>
  <PageLoading v-if="!pageReady" />
  <template v-else>
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
        :style="{
          height: `${
            renderImageHeight(pb.config?.ratio) +
            (isHorizontalRatio(pb.config?.ratio) ? 154 : 0)
          }rpx`,
        }"
        @click="handleViewPictureBook(pb)"
      >
        <view
          class="relative w-full rounded-tl-[24rpx] rounded-tr-[24rpx] overflow-hidden flex flex-row items-center justify-center"
          :class="[
            isHorizontalRatio(pb.config.ratio)
              ? ''
              : 'rounded-bl-[24rpx] rounded-br-[24rpx]',
          ]"
          :style="{
            height: `${renderImageHeight(pb.config?.ratio)}rpx`,
          }"
        >
          <view
            class="absolute left-0 top-0 w-full h-full bg-[#e8e8e8] flex flex-row items-center justify-center"
            v-if="!pb.cover?.url || errorImageIds.has(pb.id)"
          >
            <!-- <text class="text-[24rpx] text-[#c8c8c8]">{{
          !pb.cover?.url ? "暂无封面" : "封面加载失败"
        }}</text> -->
            <image
              class="w-full h-full z-[9]"
              :src="
                isHorizontalRatio(pb.config.ratio)
                  ? 'https://img.liangqy.com/crawlerjet/picture_book/img/pb_default_horizontal.png'
                  : 'https://img.liangqy.com/crawlerjet/picture_book/img/pb_default_vertical.png'
              "
              mode="aspectFill"
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

        <view
          class="absolute z-[9] bottom-0 left-0 rounded-bl-[24rpx] rounded-br-[24rpx] p-[16rpx] box-border w-full flex flex-col gap-[8rpx]"
          :class="[
            isHorizontalRatio(pb.config.ratio)
              ? 'bg-[#fff]'
              : 'bg-[rgba(0,0,0,0.2)]',
          ]"
        >
          <view class="w-full h-[32rpx] flex flex-row items-center">
            <view
              class="h-full px-[12rpx] box-border rounded-[12rpx] flex flex-row items-center justify-center"
              :style="{
                backgroundColor: mainColor,
              }"
            >
              <text class="text-[20rpx] text-[#fff]">{{
                pb.config.theme
              }}</text>
            </view>
          </view>
          <view class="w-full h-[36rpx] mt-[16rpx] flex flex-row items-center">
            <text
              class="text-[30rpx] font-bold line-clamp-1 overflow-hidden text-ellipsis break-all"
              :class="[
                isHorizontalRatio(pb.config.ratio)
                  ? 'text-[#181818]'
                  : 'text-[#fff]',
              ]"
              >{{ pb.title }}</text
            >
          </view>
          <view class="w-full h-[30rpx] flex flex-row items-center">
            <text
              class="text-[24rpx]"
              :class="[
                isHorizontalRatio(pb.config.ratio)
                  ? 'text-[#666]'
                  : 'text-[rgba(255,255,255,0.7)]',
              ]"
              >{{ pb.createAt }}</text
            >
          </view>
        </view>
      </view>
    </grid-view>

    <view
      class="w-full h-[112rpx] flex flex-row items-center justify-center"
      v-if="!isLoading && pictureBooks.length > 0 && pageIndex == totalPage"
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
        <image
          class="w-full h-full animate-spin"
          src="@static/icon_loading.png"
          mode="aspectFit"
        />
      </view>
      <text class="text-[28rpx] text-[#888]">加载中</text>
    </view>

    <view
      class="w-full"
      :style="{ height: `calc(${safeBottom}px + 128rpx)` }"
    ></view>
  </template>
</template>

<script setup lang="ts">
import { moralities, tabs, mainColor } from "@/config/config";
import { IPictureBook } from "@/types";
import { computed, nextTick, onMounted, ref } from "vue";
import { usePictureBookStore } from "@/stores/picture_book";

interface Props {
  type: keyof typeof tabs;
}

const props = defineProps<Props>();

const pictureBookStore = usePictureBookStore();

const safeBottom = uni.getWindowInfo().safeAreaInsets?.bottom || 0;

const pageReady = ref(false);

const pageIndex = ref(1);
const pageSize = ref(20);
const totalCount = ref(0);
const totalPage = ref(1);

const pictureBooks = ref<IPictureBook[]>([]);

const isLoading = ref(false);

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
  return moralities
    .filter((item) => item.children.length > 0)
    .flatMap((item) => {
      return item.children.map((child) => {
        return {
          name: child.name,
          value: child.en_name,
        };
      });
    })
    .flat();
});

onMounted(() => {
  nextTick(async () => {
    await getPictureBooks();
  });
});

async function getPictureBooks() {
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
        // refresherSuccessVisible.value = false;
      },
    });
  } else {
    uni.navigateTo({
      url: `/pages/picture-book-detail/picture-book-detail?id=${pb.id}`,
      complete: () => {
        // refresherSuccessVisible.value = false;
      },
    });
  }
}

function handleImageError(id: string) {
  console.log(">>>>>> handleImageError: ", id);
  errorImageIds.value.add(id);
}
</script>

<style scoped></style>
