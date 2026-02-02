<template>
  <view class="w-full h-full flex flex-col items-center justify-center">
    <scroll-view scroll-y class="w-full h-full">
      <view class="w-full" :style="{ height: `${headerHeight}px` }"></view>

      <view
        class="w-full px-[32rpx] py-[24rpx] box-border flex flex-col gap-[24rpx]"
        :style="{
          minHeight: `calc(100% - ${headerHeight}px - 128rpx - ${safeBottom}px)`,
        }"
      >
        <view
          class="relative w-full rounded-[24rpx] bg-white p-[32rpx] box-border shadow-sm border border-black/[0.03] flex flex-col gap-[32rpx]"
          :class="[
            isConfirming ? 'pointer-events-none' : 'pointer-events-auto',
          ]"
        >
          <view
            class="w-full flex flex-col items-start justify-start gap-[24rpx]"
          >
            <view class="w-full flex flex-row items-center">
              <textarea
                class="w-full text-[42rpx] font-bold leading-[52rpx]"
                :style="{
                  color: ThemeColors.text.title,
                }"
                confirm-type="done"
                auto-height
                placeholder="请输入故事标题"
                v-model="renderStoryTitle"
              />
            </view>
            <view class="w-full flex flex-row items-center">
              <textarea
                class="w-full text-[32rpx] leading-[42rpx]"
                :style="{
                  color: ThemeColors.text.body,
                }"
                :maxlength="-1"
                confirm-type="done"
                auto-height
                placeholder="请输入故事内容"
                v-model="renderStoryContent"
              />
            </view>
          </view>

          <view
            class="w-full h-[100rpx] flex flex-row items-center justify-center gap-[24rpx]"
          >
            <view
              class="w-[50%] h-[88rpx] rounded-[24rpx] bg-gray-200 flex flex-row items-center justify-center gap-[12rpx] transition-all duration-300"
              :class="[
                isRegenerating || isConfirming
                  ? 'opacity-50 pointer-events-none'
                  : 'opacity-100 active:scale-95 pointer-events-auto',
              ]"
              @click="handleRegenerateStory"
            >
              <svg-icon
                :src="`/static/${iconThemeVersion}/icon_generate.svg`"
                class="w-[32rpx] h-[32rpx]"
                :color="
                  isRegenerating ? ThemeColors.text.body : ThemeColors.primary
                "
              ></svg-icon>
              <text
                class="text-[32rpx]"
                :style="{
                  color: isRegenerating
                    ? ThemeColors.text.body
                    : ThemeColors.primary,
                }"
                >{{ isRegenerating ? "重新生成中..." : "重新生成" }}</text
              >
            </view>
          </view>

          <view
            class="absolute left-0 top-0 w-full h-full rounded-[24rpx] bg-white/30 backdrop-blur-sm z-[99] flex flex-row items-center justify-center"
            :style="{
              height: `calc(100% - 132rpx)`,
            }"
            v-if="isRegenerating"
          >
            <CustomLoader></CustomLoader>
          </view>
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
          <view class="w-full flex flex-col items-start justify-start">
            <!-- <text class="leading-[40rpx] text-[28rpx] text-[#888]"
              >提示：AI
              已经根据您的参数生成了精彩的故事内容。您可以直接确认，或进行微调以更符合您的期待。</text
            > -->
            <text class="leading-[40rpx] text-[28rpx] text-[#888]"
              >提示：输入4个连续的"-"，可以作为故事内容分页的分隔符。</text
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
          class="w-full h-[88rpx] py-4 rounded-[24rpx] shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          :class="[
            isRegenerating || isConfirming
              ? 'pointer-events-none'
              : 'pointer-events-auto',
          ]"
          :style="{
            backgroundColor:
              isRegenerating || isConfirming
                ? ThemeColors.text.disabled
                : ThemeColors.primary,
            boxShadow: `0 10px 15px -3px ${
              isRegenerating || isConfirming
                ? ThemeColors.text.disabled
                : ThemeColors.primary300
            }`,
          }"
          @click="handleConfirmStory"
        >
          <CustomLoader
            v-if="isConfirming"
            color="#fff"
            :size="32"
          ></CustomLoader>
          <text class="text-[34rpx] text-white font-bold">{{
            isConfirming ? "正在确认故事..." : "确认故事，下一步"
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
import { iconThemeVersion, ThemeColors } from "@/config/config";
import { computed, inject, nextTick, ref, watch, type Ref } from "vue";
import type { ICreatePictureBookFormData, IStory } from "../../types";
import CustomLoader from "@/components/custom-loader/custom-loader.vue";
import { usePictureBookStore } from "@/stores/picture_book";

const pictureBookStore = usePictureBookStore();

const story = inject<Ref<IStory>>("story");
const formData = inject<Ref<ICreatePictureBookFormData>>("formData");

const $emit = defineEmits<{
  (e: "on-confirmed", params: any): void;
  (e: "regenerate-story", params: { story: IStory }): void;
}>();

const renderStoryTitle = ref("");
const renderStoryContent = ref("");

// 重新生成中
const isRegenerating = ref(false);

// 确认中
const isConfirming = ref(false);

const safeTop = uni.getWindowInfo().safeAreaInsets?.top || 0;
const safeBottom = uni.getWindowInfo().safeAreaInsets?.bottom || 0;

const headerHeight = computed(() => {
  return safeTop + uni.upx2px(168);
});

watch(
  () => story?.value,
  (newVal) => {
    renderStoryTitle.value = newVal?.title || "";
    renderStoryContent.value = Array.isArray(newVal?.content)
      ? newVal?.content.join("\n----\n")
      : newVal?.content || "";
  },
  {
    immediate: true,
  }
);

async function handleConfirmStory() {
  if (isConfirming.value || isRegenerating.value || !story?.value.id) {
    return;
  }
  isConfirming.value = true;
  const res = await pictureBookStore.confirmStory({
    pbId: story.value.id,
    title: renderStoryTitle.value,
    content: renderStoryContent.value,
  });
  if (res.code === 200 && res.data) {
    uni.showToast({
      title: "确认成功",
      icon: "success",
    });
    $emit("on-confirmed", res.data);
  } else {
    uni.showToast({
      title: "确认失败，请稍后再试",
      icon: "none",
    });
  }
  nextTick(() => {
    isConfirming.value = false;
  });
}

async function handleRegenerateStory() {
  if (isRegenerating.value || isConfirming.value || !story?.value.id) {
    return;
  }
  isRegenerating.value = true;
  const res = await pictureBookStore.regenerateStory({ pbId: story.value.id });

  if (res.code === 200 && res.data) {
    uni.showToast({
      title: "重新生成成功",
      icon: "success",
    });
    $emit("regenerate-story", {
      story: {
        id: res.data.id,
        title: res.data.story.title,
        content: res.data.story.content,
      },
    });
  } else {
    uni.showToast({
      title: "生成故事失败，请稍后再试",
      icon: "none",
    });
  }
  nextTick(() => {
    isRegenerating.value = false;
  });
}
</script>

<style>
::-webkit-scrollbar {
  display: none !important;
}
</style>
