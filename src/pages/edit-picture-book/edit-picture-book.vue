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
              class="w-[72rpx] h-[72rpx] z-[9] bg-[#f0f0f0] rounded-[50%] p-[20rpx] box-border border border-[6rpx] flex flex-row items-center justify-center"
              v-for="(step, index) in allSteps"
              :key="step.id"
              :style="{
                borderColor:
                  allSteps[currentStepIndex].id === step.id
                    ? 'rgba(255, 123, 172, 0.4)'
                    : 'white',
              }"
            >
              <image
                :src="index < currentStepIndex ? step.activeIcon : step.icon"
                mode="aspectFill"
                class="w-full h-full"
              ></image>
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
import { iconThemeVersion, mainColor } from "@/config/config";

const pictureBookStore = usePictureBookStore();

const currentStepIndex = ref(1);

const allSteps = [
  {
    id: EEditPictureBookStep.ROLES,
    title: "角色",
    icon: "/static/icon_role_normal.png",
    activeIcon: "/static/icon_role_finish.png",
  },
  {
    id: EEditPictureBookStep.SCENES,
    title: "场景",
    icon: "/static/icon_scene_normal.png",
    activeIcon: "/static/icon_scene_finish.png",
  },
  {
    id: EEditPictureBookStep.COVER,
    title: "封面",
    icon: "/static/icon_cover_normal.png",
    activeIcon: "/static/icon_cover_finish.png",
  },
  {
    id: EEditPictureBookStep.AUDIO,
    title: "音频",
    icon: "/static/icon_audio_normal.png",
    activeIcon: "/static/icon_audio_finish.png",
  },
  {
    id: EEditPictureBookStep.FINISHED,
    title: "完成",
    icon: "/static/icon_complete_normal.png",
    activeIcon: "/static/icon_complete_finish.png",
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
  if (!pbDetail.value?.roles) {
    currentStepIndex.value = 0;
    return;
  }
  if (!pbDetail.value?.scenes) {
    currentStepIndex.value = 1;
    return;
  }
  if (!pbDetail.value?.cover) {
    currentStepIndex.value = 2;
    return;
  }
  currentStepIndex.value = 3;
}
</script>

<style></style>
