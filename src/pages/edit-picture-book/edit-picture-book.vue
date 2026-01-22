<template>
  <view class="w-full h-full flex flex-row items-center justify-center">
    <CustomHeader title="编辑绘本" show-back title-align="start" />

    <Layout hasHeader>
      <scroll-view type="custom" scroll-y class="w-full h-full overflow-y-auto">
        <view class="sticky left-0 top-0 w-full bg-[#fff] z-[99] flex flex-col">
          <view
            class="relative w-[80vw] h-[128rpx] mx-auto flex flex-row items-center justify-between"
          >
            <view
              class="absolute left-[10rpx] top-[60rpx] h-[8rpx] bg-[#f0f0f0]"
              :style="{ width: `calc(100% - 20rpx)` }"
            ></view>
            <view
              class="w-[88rpx] h-[88rpx] z-[9] bg-[#f0f0f0] rounded-[50%] p-[20rpx] box-border border border-[6rpx] flex flex-row items-center justify-center"
              v-for="(step, index) in allSteps"
              :key="step.id"
              :style="{
                borderColor:
                  allSteps[currentStepIndex].id === step.id
                    ? 'rgba(43,140,238,1)'
                    : 'white',
              }"
            >
              <svg-icon
                :src="step.icon"
                class="w-full h-full"
                :color="
                  currentStepIndex > index ? ThemeColors.primary : '#c8c8c8'
                "
              />
            </view>
          </view>

          <view class="w-full h-[88rpx] flex flex-row items-center justify-center">
            <view class="h-[64rpx] px-[24rpx] box-border border border-[1rpx] border-[rgba(43,140,238,0.2)] bg-[rgba(43,140,238,0.1)] rounded-[32rpx] flex flex-row items-center justify-between gap-[12rpx]"
            >
              <text class="text-[28rpx] font-medium text-[rgba(43,140,238,1)]">步骤 {{ currentStepIndex + 1 }}: </text>
              <text class="text-[28rpx] font-medium text-[rgba(43,140,238,1)]">{{ allSteps[currentStepIndex].title }}</text>
            </view>
          </view>
        </view>

        <view class="page-bg w-full p-[24rpx] box-border">
          <view
            class="w-full h-full px-[32rpx] py-[32rpx] box-border bg-[#fff] rounded-[24rpx] flex flex-col gap-[32rpx] transition-all duration-300"
          >
            <view
              class="w-full h-[60rpx] flex flex-row items-center justify-start gap-[16rpx]"
            >
              <view
                class="w-[42rpx] h-[42rpx] flex flex-row items-center justify-center"
              >
                <svg-icon
                  :src="`/static/${iconThemeVersion}/icon_pb_settings.svg`"
                  class="w-full h-full"
                  color="#000"
                />
              </view>
              <text class="text-[36rpx] font-bold text-[#333]">绘本配置</text>
            </view>
          </view>
        </view>

        <view class="w-full h-[100rpx] bg-[#c8c8c8]">
          <view class="w-[100rpx] h-[100rpx]">
            <svg-icon src="/static/audio.svg" :colors="['#ff3333', '#fff']" />
          </view>
        </view>

        <view class="w-[40rpx] h-[40rpx]"> </view>
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
import type { IPictureBook } from "@/types";
import { usePictureBookStore } from "@/stores/picture_book";
import { iconThemeVersion, ThemeColors } from "@/config/config";

const pictureBookStore = usePictureBookStore();

const currentStepIndex = ref(0);

const allSteps = [
  {
    id: EEditPictureBookStep.ROLES,
    title: "确认角色",
    icon: `/static/${iconThemeVersion}/icon_role_confirm.svg`,
  },
  {
    id: EEditPictureBookStep.SCENES,
    title: "确认场景",
    icon: `/static/${iconThemeVersion}/icon_scene_confirm.svg`,
  },
  {
    id: EEditPictureBookStep.COVER,
    title: "确认封面",
    icon: `/static/${iconThemeVersion}/icon_cover_confirm.svg`,
  },
  {
    id: EEditPictureBookStep.AUDIO,
    title: "确认音频",
    icon: `/static/${iconThemeVersion}/icon_audio_confirm.svg`,
  },
  {
    id: EEditPictureBookStep.FINISHED,
    title: "完成",
    icon: `/static/${iconThemeVersion}/icon_checked.svg`,
  },
];

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
  if (!pbDetail.value?.roles || pbDetail.value?.roles.length === 0) {
    currentStepIndex.value = 0;
    return;
  }
  if (!pbDetail.value?.scenes || pbDetail.value?.scenes.length === 0) {
    currentStepIndex.value = 1;
    return;
  }
  if (
    !pbDetail.value?.cover ||
    Object.keys(pbDetail.value?.cover).length === 0
  ) {
    currentStepIndex.value = 2;
    return;
  }
  currentStepIndex.value = 3;
}
</script>

<style></style>
