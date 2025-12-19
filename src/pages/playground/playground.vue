<template>
  <view class="playground_page w-full h-full">
    <CustomHeader
      show-back
      :title="`${getTypeLabel()} - 等级${level}`"
    />

    <Layout :hasHeader="true">
      <scroll-view type="custom" scroll-y class="relative w-full h-full">
        <page-loading v-if="!isReady"></page-loading>
        <template v-else>
          <view class="w-full h-[32rpx]"></view>
        <view
          class="w-full h-[386rpx] px-[32rpx] box-border"
          @click="
            previewImage(questionDetail?.image ? [questionDetail?.image] : [])
          "
        >
          <view
            class="relative w-full h-full rounded-[24rpx] overflow-hidden bg-[#fff] shadow-[0_8rpx_32rpx_rgba(0,0,0,0.15)] flex flex-row items-center justify-center"
          >
            <image
              class="w-full h-full"
              :src="questionDetail?.image"
              mode="aspectFill"
            ></image>
            <!-- <view class="absolute bottom-[32rpx] right-[32rpx] w-[80rpx] h-[80rpx] bg-[#fff] shadow-[0_4rpx_24rpx_rgba(0,0,0,0.1)] rounded-[50%] flex flex-row items-center justify-center"
            @click.stop="handleViewAnswerHistory">
              <image
                class="w-[42rpx] h-[42rpx]"
                src="@static/icon_answer_history.png"
                mode="aspectFit"
              />

              <view class="absolute right-0 -top-[84rpx] h-[64rpx] px-[20rpx] box-border rounded-[8rpx] whitespace-nowrap bg-[#000] flex flex-row items-center justify-center">
                <text class="text-[24rpx] text-[#fff]">点击查看答题历史</text>
                <view class="absolute right-[28rpx] top-[54rpx] w-[24rpx] h-[24rpx] flex flex-row items-center justify-center">
                  <image
                    class="w-full h-full"
                    src="@static/icon_caret_down.png"
                    mode="aspectFit"
                  />
                </view>
              </view>
            </view> -->
            <AnswerHistory :question-id="questionId" />
          </view>
        </view>

        <view
          class="w-full h-[88rpx] mt-[32rpx] flex flex-row items-center justify-center"
        >
          <text
            class="text-[40rpx] font-[600]"
            :style="{ color: ThemeColors.primary }"
            >观察并描述</text
          >
        </view>
        <view
          class="w-full h-[48rpx] mt-[12rpx] flex flex-row items-center justify-center"
        >
          <text class="text-[28rpx] text-[#666666]"
            >仔细观察图片，然后描述你看到的内容</text
          >
        </view>

        <view
          class="w-full h-[64rpx] mt-[40rpx] px-[32rpx] box-border flex flex-row items-center gap-[24rpx]"
        >
          <view
            class="w-[40rpx] h-[40rpx] rounded-[12rpx] overflow-hidden flex flex-row items-center justify-center"
            style="
              background: linear-gradient(135deg, #4a90e2 0%, #2c6db5 100%);
            "
          >
            <image
              class="w-[32rpx] h-[32rpx]"
              src="@static/icon_eye_white.png"
              mode="aspectFit"
            />
          </view>

          <text class="text-[32rpx] text-[#333] font-[700]">观察提示</text>
        </view>

        <view class="w-full px-[32rpx] box-border mt-[32rpx]">
          <view
            class="w-full p-[32rpx] box-border rounded-[40rpx] overflow-hidden bg-[#fff] shadow-[0_4rpx_24rpx_rgba(0,0,0,0.08)] flex flex-col items-center justify-center gap-[32rpx]"
          >
            <view
              class="w-full h-[48rpx] flex flex-row items-center gap-[24rpx]"
            >
              <view
                class="w-[48rpx] h-[48rpx] flex flex-row items-center justify-center"
              >
                <image
                  class="w-[32rpx] h-[32rpx]"
                  src="@static/icon_light.png"
                  mode="aspectFit"
                />
              </view>
              <text class="text-[32rpx] text-[#666666]"
                >图片中主要的物体是什么？</text
              >
            </view>
            <view
              class="w-full h-[48rpx] flex flex-row items-center gap-[24rpx]"
            >
              <view
                class="w-[48rpx] h-[48rpx] flex flex-row items-center justify-center"
              >
                <image
                  class="w-[32rpx] h-[32rpx]"
                  src="@static/icon_color.png"
                  mode="aspectFit"
                />
              </view>
              <text class="text-[32rpx] text-[#666666]"
                >注意物体的颜色、形状和大小</text
              >
            </view>
            <view
              class="w-full h-[48rpx] flex flex-row items-center gap-[24rpx]"
            >
              <view
                class="w-[48rpx] h-[48rpx] flex flex-row items-center justify-center"
              >
                <image
                  class="w-[32rpx] h-[32rpx]"
                  src="@static/icon_location.png"
                  mode="aspectFit"
                />
              </view>
              <text class="text-[32rpx] text-[#666666]"
                >物体在什么位置？周围有什么？</text
              >
            </view>
          </view>
        </view>

        <view
          class="w-full h-[200rpx] mt-[40rpx] flex flex-row items-center justify-center"
          v-if="!modalVisible"
        >
          <view
            class="relative w-[200rpx] h-[200rpx] rounded-full flex flex-row items-center justify-center"
            @touchstart="startDescribe"
            @touchend="handleEndDescribe"
          >
            <span
              class="absolute left-0 top-0 inline-flex h-full w-full animate-beat rounded-full opacity-75"
              :style="{
                backgroundColor: ThemeColors.primary,
              }"
            ></span>
            <view
              class="start_btn_bg z-9 w-[190rpx] h-[190rpx] rounded-[50%] overflow-hidden shadow-[0_12rpx_50rpx_rgba(255,154,60,0.3)] flex flex-col items-center justify-center gap-[12rpx]"
            >
              <view
                class="w-[80rpx] h-[80rpx] flex flex-row items-center justify-center"
              >
                <image
                  class="w-full h-full"
                  src="@static/icon_mic_white.png"
                  mode="aspectFit"
                />
              </view>
              <text class="text-[30rpx] text-[#fff] font-[700]">按住描述</text>
            </view>
          </view>
        </view>
        </template>
      </scroll-view>
    </Layout>

    <page-container
      :show="modalVisible"
      z-index="999"
      :custom-style="
        modalData?.component === EModalComponent.CHAT_MODAL
          ? 'background-color: transparent;'
          : ''
      "
      round
    >
      <ChatModal
        v-if="modalData?.component === EModalComponent.CHAT_MODAL"
        :is-speaking="isSpeaking"
        :info="questionDetail"
      />
    </page-container>
  </view>
</template>

<script setup lang="ts">
import { GameType, ThemeColors } from "@/config/config";
import CustomHeader from "@/components/custom-header/custom-header.vue";
import Layout from "@/components/layout/layout.vue";
import type { IQuestion } from "@/types";
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { useQuestionStore } from "@/stores/question";
import { previewImage } from "@/utils";

import ChatModal from "./modals/ChatModal.vue";
import { EModalComponent } from "./modals/types";
import AnswerHistory from "./components/AnswerHistory.vue";
import { useProfileStore } from "@/stores/profile";
import { storeToRefs } from "pinia";
import PageLoading from "@/components/page-loading/page-loading.vue";

const questionStore = useQuestionStore();
const profileStore = useProfileStore();
const { level: profileLevel } = storeToRefs(profileStore);

const safeTop = uni.getWindowInfo().safeAreaInsets?.top || 0;
const safeBottom = uni.getWindowInfo().safeAreaInsets?.bottom || 0;

const isReady = ref(false);

const isSpeaking = ref(false);

const questionId = ref<string>("");
const questionDetail = ref<IQuestion>();

const type = ref<GameType>(GameType.normal);
const level = ref<number>(1);

const modalVisible = ref(false);
const modalData = ref<{
  component?: string;
  [key: string]: any;
}>();

onLoad(async (options: any) => {
  questionId.value = options?.id;
  type.value = options?.type as GameType;
  level.value = options?.level | profileLevel.value;

  if (options?.id) {
    await getQuestionDetailById();
  } else if (options?.level) {
    await getQuestionDetailByLevel();
  }

  uni.$on("close-modal", (e: any) => {
    closeModal(e?.component as EModalComponent);
  });
});

function getTypeLabel() {
  return type.value === GameType.daily ? "今日挑战" : "快速挑战";
}

async function getQuestionDetailById() {
  questionDetail.value = await questionStore.getQuestionDetailById(
    questionId.value
  );
  level.value = questionDetail.value!.level;
  isReady.value = true;
}

async function getQuestionDetailByLevel() {
  const result = await questionStore.getQuestionDetailByLevel(level.value);
  if (result && result.list && result.list.length > 0) {
    questionDetail.value = result.list[0];
    questionId.value = questionDetail.value?.id || "";
  }
  isReady.value = true;
}

function startDescribe() {
  isSpeaking.value = true;
  openModal(EModalComponent.CHAT_MODAL);
}

function handleEndDescribe(e: any) {
  isSpeaking.value = false;
}

function openModal(component: EModalComponent) {
  modalData.value = {
    component,
  };
  modalVisible.value = true;
}

function closeModal(component?: EModalComponent) {
  if (
    component &&
    component !== (modalData.value?.component as EModalComponent)
  ) {
    return;
  }
  modalData.value = {};
  modalVisible.value = false;
}

function handleViewAnswerHistory() {}
</script>

<style scoped>
.playground_page {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}
.start_btn_bg {
  background: linear-gradient(135deg, #ff9a3c 0%, #ff7a1c 100%);
}
</style>
