<template>
  <view class="w-[100vw] h-[100vh] flex flex-row items-end justify-center">
    <CustomHeader bg-color="transparent" />

    <Layout :hasHeader="true">
      <view class="relative w-full h-full flex flex-col">
        <view class="w-full h-[290rpx] shrink-0"></view>
        <scroll-view
          type="custom"
          :scroll-y="!isRegenerating"
          class="w-full bg-[#fff] rounded-tl-[32rpx] rounded-tr-[32rpx]"
          :class="[isRegenerating ? 'overflow-hidden' : 'overflow-y-auto']"
          :style="{
            height: `calc(100vh - 128rpx)`,
          }"
        >
          <view
            class="sticky top-0 left-0 z-[99] w-full h-[88rpx] bg-[#fff] border-b border-b-[1rpx] border-[#F0F0F0] flex flex-row items-center justify-center"
          >
            <text class="text-[36rpx] font-bold text-[#333]">确认故事内容</text>

            <view
              class="absolute right-[12rpx] top-0 z-[9] w-[88rpx] h-[88rpx] shrink-0 flex flex-row items-center justify-center transition-opacity duration-300"
              :class="[
                isRegenerating || isConfirming
                  ? 'opacity-50 pointer-events-none'
                  : 'opacity-100 active:opacity-80 pointer-events-auto',
              ]"
              @click="closeModal"
            >
              <image
                src="@static/icon_close_black.png"
                class="w-[32rpx] h-[32rpx]"
              ></image>
            </view>
          </view>
          <view class="relative w-full pb-[24rpx] box-border">
            <view
              class="w-full min-h-[88rpx] flex flex-row items-start gap-[24rpx] px-[24rpx] box-border"
            >
              <view
                class="w-full flex flex-row items-center py-[20rpx] box-border"
              >
                <textarea
                  class="w-full text-[36rpx] font-bold text-[#333]"
                  :class="[
                    isRegenerating || isConfirming
                      ? 'pointer-events-none'
                      : 'pointer-events-auto',
                  ]"
                  confirm-type="done"
                  auto-height
                  placeholder="请输入故事标题"
                  @focus="editStoryTitle"
                  @blur="stopEditStoryTitle"
                  v-model="renderStoryTitle"
                />
              </view>
            </view>
            <view
              class="w-full min-h-[88rpx] flex flex-row items-start gap-[24rpx] px-[24rpx] box-border"
            >
              <view
                class="w-full flex flex-row items-center py-[20rpx] box-border"
              >
                <textarea
                  class="w-full text-[34rpx] text-[#666]"
                  :class="[
                    isRegenerating || isConfirming
                      ? 'pointer-events-none'
                      : 'pointer-events-auto',
                  ]"
                  :maxlength="-1"
                  :auto-height="true"
                  placeholder="请输入故事内容"
                  @focus="editStoryContent"
                  @blur="stopEditStoryContent"
                  v-model="renderStoryContent"
                />
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
              class="h-[80rpx] px-[64rpx] rounded-[24rpx] bg-[#f0f0f0] box-border flex flex-row items-center justify-center gap-[16rpx] transition-opacity duration-300"
              :class="[
                isRegenerating || isConfirming
                  ? 'pointer-events-none'
                  : 'active:opacity-80 pointer-events-auto',
                isRegenerating
                  ? 'opacity-80'
                  : isConfirming
                  ? 'opacity-5'
                  : 'opacity-100',
              ]"
              @click="doRegenerateStory"
            >
              <image
                src="@static/icon_generate_red.png"
                class="w-[32rpx] h-[32rpx]"
              ></image>
              <text class="text-[32rpx] text-[#FF7BAC]">{{
                isRegenerating ? "重新生成中..." : "重新生成"
              }}</text>
            </view>
            <view
              class="h-[80rpx] px-[64rpx] rounded-[24rpx] bg-[#FF7BAC] box-border flex flex-row items-center justify-center transition-opacity duration-300"
              :class="[
                isRegenerating || isConfirming
                  ? 'pointer-events-none'
                  : 'active:opacity-80 pointer-events-auto',
                isRegenerating
                  ? 'opacity-3'
                  : isConfirming
                  ? 'opacity-50'
                  : 'opacity-100',
              ]"
              @click="doConfirmStory"
            >
              <text class="text-[32rpx] text-[#fff]">{{
                isConfirming ? "确认中..." : "确认"
              }}</text>
            </view>
          </view>
          <view
            class="absolute top-[88rpx] left-0 z-[9] w-full bg-[#fff] transition-opacity duration-300 flex flex-col items-center justify-center gap-[24rpx]"
            :class="[regeneratingVisible ? 'opacity-100' : 'opacity-0']"
            :style="{
              height: `calc(100% - 88rpx - 100rpx - ${safeBottom}px)`,
            }"
            v-if="isRegenerating"
          >
            <div class="spinner">
              <div class="spinner-inner"></div>
              <div class="spinner-inner"></div>
            </div>
            <text class="text-[32rpx] text-[#888]">正在重新生成故事...</text>
          </view>
        </scroll-view>
      </view>
    </Layout>
  </view>
</template>

<script setup lang="ts">
import CustomHeader from "@/components/custom-header/custom-header.vue";
import Layout from "@/components/layout/layout.vue";
import type { IConfirmRoleInfo, IConfirmStoryInfo } from "./types";
import { nextTick, onMounted, ref, watch } from "vue";
import { requestCustomUrl } from "@/request";
import { EConfirmAction } from "../types";

interface Props {
  info: IConfirmStoryInfo;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (
    e: "on-confirm",
    params: {
      action: EConfirmAction;
      data: IConfirmRoleInfo;
    }
  ): void;
  (
    e: "on-cancel",
    params: {
      id: string;
    }
  ): void;
  (
    e: "on-regenerate",
    params: {
      id: string;
    }
  ): void;
}>();

const safeBottom = uni.getWindowInfo().safeAreaInsets?.bottom || 0;

const renderStoryTitle = ref("");
const renderStoryContent = ref("");

const storyTitleEditMode = ref(false);
const storyContentEditMode = ref(false);

// 是否正在重新生成
const isRegenerating = ref(false);
const regeneratingVisible = ref(false);

// 是否正在确认故事
const isConfirming = ref(false);

watch(
  () => props.info.story.title,
  (newVal) => {
    renderStoryTitle.value = newVal;
  },
  {
    immediate: true,
  }
);
watch(
  () => props.info.story.content,
  (newVal) => {
    renderStoryContent.value = newVal;
  },
  {
    immediate: true,
  }
);

onMounted(() => {
  uni.$on("regenerate-story-response", (e: any) => {
    regeneratingVisible.value = false;
    nextTick(() => {
      isRegenerating.value = false;
    });
  });
});

function editStoryTitle() {
  storyTitleEditMode.value = true;
}
function stopEditStoryTitle() {
  storyTitleEditMode.value = false;
}

function editStoryContent() {
  storyContentEditMode.value = true;
}
function stopEditStoryContent() {
  storyContentEditMode.value = false;
}

function closeModal() {
  uni.showModal({
    title: "提示",
    content: "点击关闭会放弃当前故事内容，是否继续？",
    confirmText: "确定",
    confirmColor: "#FF7BAC",
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

function doRegenerateStory() {
  if (isRegenerating.value) {
    return;
  }

  emit("on-regenerate", {
    id: props.info.id,
  });

  isRegenerating.value = true;
  nextTick(() => {
    regeneratingVisible.value = true;
  });
}

async function doConfirmStory() {
  if (isConfirming.value) {
    uni.showToast({
      title: "正在确认故事，请稍后再试",
      icon: "none",
    });
    return;
  }

  isConfirming.value = true;

  const confirmUrl = props.info.confirmUrl;
  console.log(
    ">>> confirm: ",
    JSON.stringify({
      id: props.info.id,
      title: renderStoryTitle.value,
      content: renderStoryContent.value,
    })
  );

  // 确认故事
  // const res = await requestCustomUrl({
  //   url: confirmUrl,
  //   method: "POST",
  //   data: {
  //     id: props.info.id,
  //     title: renderStoryTitle.value,
  //     content: renderStoryContent.value,
  //   },
  // });

  const res = {
    code: 200,
    message: "请确认故事角色",
    action: "confirm-roles",
    data: {
      id: "7d21b8c5013c34cccfe917cf",
      confirmUrl:
        "https://wf.qyflows.com/webhook-waiting/618789/pb-confirm-role",
      roles: [
        {
          code: 200,
          msg: "success",
          data: {
            taskId: "ce285fda77da69e4a7fd48f8ee8db59a",
            recordId: "ce285fda77da69e4a7fd48f8ee8db59a",
            id: "r2BvP6S8jKd3Lz9Nq1WmX4cR7",
            name: "示例精灵工匠",
            prompt:
              "一位身穿沾满机油棕色皮围裙的老年精灵工匠，戴着单眼放大镜，眼神敏锐，胡须微翘，背景为纯白色。",
            prompt_en:
              "An elderly elf craftsman wearing a brown leather apron stained with engine oil, wearing a monocular magnifying glass, with a keen gaze and slightly curled beard, on a pure white background.",
          },
        },
        {
          code: 200,
          msg: "success",
          data: {
            taskId: "a9fff88e6cd5cd61a3e128041ede15ae",
            recordId: "a9fff88e6cd5cd61a3e128041ede15ae",
            id: "1234P6S8jKd3Lz9Nq1WmX4323",
            name: "米洛",
            prompt: "一位身穿沾满机油棕色皮围裙的小老鼠。",
            prompt_en:
              "A small gray mouse named Milo, with soft, sleek gray fur and small, round black eyes full of curiosity and gentleness. He has a small, cute build with slightly puffed cheeks, perhaps from storing food. Standing on green grass, pure white background, overall appearance is adorable, kind, and helpful.",
          },
        },
      ],
    },
  };

  if (res.code !== 200) {
    uni.showToast({
      title: "故事确认失败，请重新确认",
      icon: "none",
    });
    return;
  }

  emit("on-confirm", {
    action: res.action as EConfirmAction,
    data: res.data as IConfirmRoleInfo,
  });
}
</script>

<style scoped></style>
