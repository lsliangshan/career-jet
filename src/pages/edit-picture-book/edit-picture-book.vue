<template>
  <view class="w-full h-full flex flex-row items-center justify-center">
    <CustomHeader title="编辑绘本" show-back title-align="start" />

    <Layout hasHeader>
      <scroll-view type="custom" scroll-y class="w-full h-full overflow-y-auto">
        <view class="page-bg w-full p-[24rpx] box-border">
          <view
            class="w-full h-full px-[32rpx] py-[32rpx] box-border bg-[#fff] rounded-[24rpx] flex flex-col gap-[32rpx] transition-all duration-300"
          >
            <view
              class="w-full h-[60rpx] flex flex-row items-center justify-start gap-[16rpx]"
            >
              <view
                class="w-[36rpx] h-[36rpx] flex flex-row items-center justify-center"
              >
                <image
                  src="@static/icon_keyword.png"
                  mode="aspectFill"
                  class="w-full h-full"
                ></image>
              </view>
              <text class="text-[36rpx] font-bold text-[#333]">绘本配置</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </Layout>
  </view>
</template>

<script setup lang="ts">
import CustomHeader from "@/components/custom-header/custom-header.vue";
import Layout from "@/components/layout/layout.vue";
import { EEditPictureBookStep } from "./type";
import { onMounted, ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { IPictureBook } from "@/types";
import { usePictureBookStore } from "@/stores/picture_book";

const pictureBookStore = usePictureBookStore();

const step = ref(EEditPictureBookStep.ROLES);

const id = ref<string>("");

const pbDetail = ref<IPictureBook | undefined>();

const pageReady = ref(false);

onLoad((options: any) => {
  id.value = options.id;
});

onMounted(() => {
  initPbDetail();
});

function initPbDetail() {
  pictureBookStore
    .getPictureBookDetail({
      id: id.value,
    })
    .then((res: any) => {
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

      initStep();

      const t = setTimeout(() => {
        clearTimeout(t);
        pageReady.value = true;
      }, 500);
    });
}

function initStep() {
  if (!pbDetail.value?.roles) {
    step.value = EEditPictureBookStep.ROLES;
    return;
  }
  if (!pbDetail.value?.scenes) {
    step.value = EEditPictureBookStep.SCENES;
    return;
  }
  if (!pbDetail.value?.cover) {
    step.value = EEditPictureBookStep.COVER;
    return;
  }
  step.value = EEditPictureBookStep.AUDIO;
}
</script>

<style scoped></style>
