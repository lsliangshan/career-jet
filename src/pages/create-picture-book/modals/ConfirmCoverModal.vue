<template>
  <view class="w-[100vw] h-[100vh] flex flex-row items-end justify-center">
    <CustomHeader bg-color="transparent" />

    <Layout :hasHeader="true">
      <view class="relative w-full h-full flex flex-col">
        <view class="w-full h-[290rpx] shrink-0"></view>
        <scroll-view
          type="custom"
          :scroll-y="true"
          class="w-full bg-[#fff] rounded-tl-[32rpx] rounded-tr-[32rpx] overflow-y-auto"
          :style="{
            height: `calc(100vh - 128rpx)`,
          }"
        >
          <view
            class="sticky top-0 left-0 z-[99] w-full h-[88rpx] bg-[#fff] border-b border-b-[1rpx] border-[#F0F0F0] flex flex-row items-center justify-center"
          >
            <text class="text-[36rpx] font-bold text-[#333]">确认封面</text>

            <view
              class="absolute right-[12rpx] top-0 z-[9] w-[88rpx] h-[88rpx] active:opacity-80 shrink-0 flex flex-row items-center justify-center transition-opacity duration-300"
              @click="closeModal"
            >
              <image
                src="@static/icon_close_black.png"
                class="w-[32rpx] h-[32rpx]"
              ></image>
            </view>
          </view>

          <view
            class="relative w-full px-[24rpx] py-[24rpx] box-border flex flex-row"
            :style="{
              minHeight: `calc(100% - 88rpx - 100rpx - ${safeBottom}px)`,
            }"
          >
            <view class="w-full h-full flex flex-row flex-wrap gap-[24rpx]">
              <view
                class="relative w-full border border-[1rpx] border-[#f0f0f0] rounded-[24rpx] overflow-hidden"
                :style="{
                  height: `${renderImageHeight}rpx`,
                }"
              >
                <view
                  class="w-full h-full flex flex-row items-start justify-center"
                  v-if="coverImageUrl"
                  @click="previewImage([coverImageUrl])"
                >
                  <image
                    :src="coverImageUrl"
                    class="w-full"
                    :style="{ height: `${renderImageHeight}rpx` }"
                    mode="aspectFit"
                  ></image>
                </view>

                <view
                  class="absolute right-0 top-0 z-[99] w-[88rpx] h-[88rpx] opacity-0 flex flex-row items-center justify-center transition-all duration-300"
                  :class="[
                    isRegeneratingCover
                      ? 'opacity-0 pointer-events-none'
                      : 'opacity-100 active:scale-95 pointer-events-auto',
                  ]"
                  @click="openRegenerateModal()"
                >
                  <view
                    class="w-[56rpx] h-[56rpx] rounded-[12rpx] bg-[#fff] flex flex-row items-center justify-center active:scale-95 transition-all duration-300"
                    :style="{
                      backgroundColor: mainColor,
                    }"
                  >
                    <image
                      src="@static/icon_regenerate_white.png"
                      class="w-[24rpx] h-[24rpx]"
                    ></image>
                  </view>
                </view>
                <view
                  class="absolute left-0 top-0 w-full h-full flex flex-row items-center justify-center"
                  v-if="isRegeneratingCover"
                >
                  <div class="spinner mb-[60rpx]">
                    <div class="spinner-inner"></div>
                    <div class="spinner-inner"></div>
                  </div>
                </view>
              </view>
            </view>
          </view>

          <view
            class="sticky bottom-0 left-0 z-[99] w-full bg-[#fff] border-t border-t-[1rpx] border-[#f0f0f0] flex flex-row items-center justify-center gap-[24rpx]"
            :style="{
              height: `calc(${safeBottom}px + 100rpx)`,
              paddingBottom: `${safeBottom}px`,
            }"
          >
            <view
              class="h-[80rpx] px-[64rpx] rounded-[24rpx] box-border flex flex-row items-center justify-center transition-all duration-300"
              :class="[
                loadingImageIds.size === 0 && !isConfirming
                  ? 'opacity-100 active:scale-95'
                  : 'opacity-50',
              ]"
              :style="{
                backgroundColor: mainColor,
              }"
              @click="handleConfirmCover"
            >
              <text class="text-[32rpx] text-[#fff]">{{
                isConfirming ? "正在确认" : "确认"
              }}</text>
            </view>
          </view>

          <view
            class="sticky left-0 bottom-0 z-[99] w-full h-full flex flex-row items-end justify-center"
            v-if="regenerateModalVisible"
          >
            <view
              class="relative w-full h-full rounded-[24rpx] bg-[#fff] transition-all duration-300 shadow-[0_0_16rpx_2rpx_rgba(0,0,0,0.1)] flex flex-col"
              :class="[
                regenerateModalReady
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-full',
              ]"
            >
              <view
                class="w-full h-[88rpx] shrink-0 px-[24rpx] box-border border-b border-b-[1rpx] border-[#f0f0f0] flex flex-row items-center"
              >
                <text class="text-[32rpx] font-bold text-[#333]"
                  >重新生成封面</text
                >
              </view>
              <view
                class="w-full flex flex-row items-center justify-center"
                :style="{
                  height: `calc(100% - 88rpx - 100rpx - ${safeBottom}px)`,
                }"
              >
                <scroll-view
                  type="custom"
                  :scroll-y="true"
                  class="w-full h-full"
                >
                  <textarea
                    class="w-full min-h-full text-[34rpx] text-[#666] px-[24rpx] py-[32rpx] box-border"
                    :maxlength="-1"
                    auto-height
                    placeholder="请输入封面描述"
                    v-if="regenerateModalCover"
                    v-model="regenerateModalCover.prompt"
                  />
                </scroll-view>
              </view>
              <view
                class="sticky bottom-0 left-0 z-[99] w-full shrink-0 bg-[#fff] border-t border-t-[1rpx] border-[#f0f0f0] flex flex-row items-center justify-center gap-[24rpx]"
                :style="{
                  height: `calc(${safeBottom}px + 100rpx)`,
                  paddingBottom: `${safeBottom}px`,
                }"
              >
                <view
                  class="h-[80rpx] px-[64rpx] bg-[#eeeeee] rounded-[24rpx] box-border flex flex-row items-center justify-center gap-[12rpx] active:scale-95 transition-all duration-300"
                  @click="hideRegenerateModal"
                >
                  <text
                    class="text-[32rpx]"
                    :style="{
                      color: mainColor,
                    }"
                    >取消</text
                  >
                </view>
                <view
                  class="h-[80rpx] px-[64rpx] rounded-[24rpx] box-border flex flex-row items-center justify-center gap-[12rpx] transition-all duration-300"
                  :class="[
                    isRegeneratingCover
                      ? 'opacity-50 pointer-events-none'
                      : 'opacity-100 active:scale-95 pointer-events-auto',
                  ]"
                  :style="{
                    backgroundColor: mainColor,
                  }"
                  @click="handleRegenerateCover"
                >
                  <image
                    src="@static/icon_generate_white.png"
                    class="w-[32rpx] h-[32rpx]"
                  ></image>
                  <text class="text-[32rpx] text-[#fff]">{{
                    isRegeneratingCover ? "正在生成" : "重新生成"
                  }}</text>
                </view>
              </view>

              <view
                class="absolute right-0 top-0 z-[99] w-[88rpx] h-[88rpx] flex flex-row items-center justify-center"
                @click="hideRegenerateModal"
              >
                <image
                  src="@static/icon_close_black.png"
                  class="w-[32rpx] h-[32rpx]"
                ></image>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </Layout>
  </view>
</template>

<script setup lang="ts">
import CustomHeader from "@/components/custom-header/custom-header.vue";
import Layout from "@/components/layout/layout.vue";
import { EConfirmAction } from "../types";
import type { IConfirmCoverData, IConfirmCoverInfo } from "./types";
import {
  requestCustomUrl,
  requestGenerateCover,
  requestGetImageUrls,
} from "@/request";
import { computed, nextTick, onMounted, ref } from "vue";
import { previewImage } from "@/utils";
import { mainColor } from "@/config/config";

interface Props {
  info: IConfirmCoverInfo;
  ratio: string;
  pictureStyle: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (
    e: "on-confirm",
    params: {
      action: EConfirmAction;
      data: any;
    }
  ): void;
  (
    e: "on-cancel",
    params: {
      id: string;
    }
  ): void;
}>();

const safeBottom = uni.getWindowInfo().safeAreaInsets?.bottom || 0;

const coverImageUrl = ref<string | undefined>();

// 正在加载图片的id列表
const loadingImageIds = ref<Set<string>>(new Set());

// 是否确认中
const isConfirming = ref(false);

const regenerateModalVisible = ref(false);
const regenerateModalReady = ref(false);
const regenerateModalCover = ref<IConfirmCoverData | null>(null);
// 重新生成中
const isRegeneratingCover = ref(false);

const renderImageHeight = computed(() => {
  const ratio = props.ratio.split(":");
  const width = Number(ratio[0]);
  const height = Number(ratio[1]);
  return (702 * height) / width;
});

onMounted(() => {
  console.log(">>>>>>> props.info: ", props.info);
  listImageUrls([props.info?.cover.data.taskId]);
});

function closeModal() {
  uni.showModal({
    title: "提示",
    content: "点击关闭会放弃当前故事内容，是否继续？",
    confirmText: "确定",
    confirmColor: mainColor,
    cancelText: "取消",
    cancelColor: "#666",
    success: (res) => {
      if (res.confirm) {
        emit("on-cancel", {
          id: props.info.id,
        });
      }
    },
  });
}

async function listImageUrls(taskIds: string[]) {
  const images: Map<string, string> = await requestGetImageUrls({
    taskIds,
  });

  coverImageUrl.value = images.get(props.info.cover.data.taskId);
}

function handleConfirmCover() {
  return new Promise(async (resolve) => {
    if (isConfirming.value || !coverImageUrl.value) {
      return;
    }

    isConfirming.value = true;

    const cover = {
      ...props.info.cover,
    };
    cover.data.url = coverImageUrl.value;

    const res = await requestCustomUrl({
      url: props.info.confirmUrl,
      method: "POST",
      data: {
        id: props.info.id,
        confirmed: {
          ...cover,
        },
      },
    });

    if (res.code === 409) {
      uni.showToast({
        title: "封面确认失败，请稍后再试",
        icon: "none",
      });
      emit("on-cancel", {
        id: props.info.id,
      });
      return;
    }
    if (res.code !== 200) {
      uni.showToast({
        title: "封面确认失败，请重新确认",
        icon: "none",
      });
      return;
    }

    handleAllConfirmed(res);

    nextTick(() => {
      isConfirming.value = false;
    });

    resolve(true);
  });
}

function handleAllConfirmed(e: any) {
  emit("on-confirm", {
    action: e.action as EConfirmAction,
    data: e.data as any,
  });
}

function showRegenerateModal() {
  regenerateModalCover.value = props.info.cover.data;
  regenerateModalVisible.value = true;
  nextTick(() => {
    regenerateModalReady.value = true;
  });
}

function hideRegenerateModal() {
  regenerateModalReady.value = false;
  setTimeout(() => {
    regenerateModalVisible.value = false;
  }, 300);
}

function openRegenerateModal() {
  showRegenerateModal();
}

async function handleRegenerateCover() {
  if (!regenerateModalCover.value) {
    return;
  }
  if (isRegeneratingCover.value) {
    return;
  }
  isRegeneratingCover.value = true;
  const res = await requestGenerateCover({
    id: props.info.id,
    prompt: `a children's book illustation style by ${props.pictureStyle}, ${regenerateModalCover.value.prompt}`,
  });
  console.log(">>> 重新生成返回: ", res);
  if (res.code === 200) {
    hideRegenerateModal();

    // 更新角色图片
    coverImageUrl.value = res.data.url;
    regenerateModalCover.value = {
      ...regenerateModalCover.value,
      taskId: res.data.taskId,
      recordId: res.data.recordId,
      prompt: res.data.prompt,
      url: res.data.url,
    } as IConfirmCoverData;
  } else {
    uni.showToast({
      title: "生成封面失败，请稍后再试",
      icon: "none",
    });
  }
  nextTick(() => {
    isRegeneratingCover.value = false;
  });
}
</script>

<style scoped></style>
