<template>
  <view class="w-full h-full flex flex-col items-center justify-center">
    <scroll-view scroll-y class="w-full h-full">
      <view class="w-full" :style="{ height: `${headerHeight}px` }"></view>

      <view
        class="w-full px-[32rpx] py-[24rpx] box-border flex flex-col gap-[24rpx]"
        :style="{
          minHeight: `calc(100% - ${headerHeight}px - 128rpx)`,
        }"
      >
        <view
          class="w-full h-[108rpx] bg-white rounded-[24rpx] py-[24rpx] px-[16rpx] box-border shadow-sm border border-[rgba(255,255,255,0.03)] flex flex-row items-center justify-between"
          @click="openModal(EModalComponent.CHOOSE_THEME_MODAL, {})"
        >
          <view class="w-full h-full flex flex-row items-center gap-[16rpx]">
            <view
              class="w-[64rpx] h-[64rpx] box-border rounded-full flex flex-row items-center justify-center shrink-0"
              :style="{ backgroundColor: ThemeColors.primary200 }"
            >
              <svg-icon
                :src="`/static/${iconThemeVersion}/icon_start_read.svg`"
                class="w-[34rpx] h-[34rpx]"
                :color="ThemeColors.primary"
              ></svg-icon>
            </view>
            <text class="text-[32rpx] font-bold shrink-0">绘本名称</text>
          </view>

          <view
            class="h-full flex flex-row items-center justify-end gap-[8rpx] shrink-0"
          >
            <view class="h-full flex flex-row items-center justify-end">
              <text
                class="text-[28rpx]"
                :style="{ color: ThemeColors.text.body }"
                v-if="selectedThemeIndexes[0] !== moralities.length"
                >{{ formData.theme }}</text
              >
              <input
                type="text"
                class="w-[300rpx] h-full px-[16rpx] box-border text-right"
                placeholder="请输入绘本主题"
                placeholder-class="custom-input-placeholder"
                @change="changeCustomTheme"
                @click.stop
                v-else
              />
            </view>
            <view
              class="w-[32rpx] h-full flex flex-row items-center justify-center"
            >
              <svg-icon
                :src="`/static/${iconThemeVersion}/icon_arrow_right.svg`"
                class="w-[24rpx] h-[24rpx]"
                :color="ThemeColors.text.disabled"
              ></svg-icon>
            </view>
          </view>
        </view>

        <view
          class="w-full h-[108rpx] bg-white rounded-[24rpx] py-[24rpx] px-[16rpx] box-border shadow-sm border border-[rgba(255,255,255,0.03)] flex flex-row items-center justify-between"
          @click="openModal(EModalComponent.CHOOSE_STORY_STYLE_MODAL, {})"
        >
          <view class="w-full h-full flex flex-row items-center gap-[16rpx]">
            <view
              class="w-[64rpx] h-[64rpx] box-border rounded-full flex flex-row items-center justify-center shrink-0"
              :style="{ backgroundColor: ThemeColors.primary200 }"
            >
              <svg-icon
                :src="`/static/${iconThemeVersion}/icon_story.svg`"
                class="w-[40rpx] h-[40rpx]"
                :color="ThemeColors.primary"
              ></svg-icon>
            </view>
            <text class="text-[32rpx] font-bold">故事风格</text>
          </view>

          <view
            class="h-full flex flex-row items-center justify-end gap-[8rpx] shrink-0"
          >
            <view class="h-full flex flex-row items-center justify-end">
              <text
                class="text-[28rpx]"
                :style="{ color: ThemeColors.text.body }"
                v-if="selectedStoryStyleIndex !== authors.length"
                >{{ formData.storyStyle }}</text
              >
              <input
                type="text"
                class="w-[300rpx] h-full px-[16rpx] box-border text-right"
                placeholder="请输入故事风格"
                placeholder-class="custom-input-placeholder"
                @change="changeCustomStoryStyle"
                @click.stop
                v-else
              />
            </view>
            <view
              class="w-[32rpx] h-full flex flex-row items-center justify-center"
            >
              <svg-icon
                :src="`/static/${iconThemeVersion}/icon_arrow_right.svg`"
                class="w-[24rpx] h-[24rpx]"
                :color="ThemeColors.text.disabled"
              ></svg-icon>
            </view>
          </view>
        </view>

        <view
          class="w-full h-[108rpx] bg-white rounded-[24rpx] py-[24rpx] px-[16rpx] box-border shadow-sm border border-[rgba(255,255,255,0.03)] flex flex-row items-center justify-between"
          @click="openModal(EModalComponent.CHOOSE_PICTURE_STYLE_MODAL, {})"
        >
          <view class="w-full h-full flex flex-row items-center gap-[16rpx]">
            <view
              class="w-[64rpx] h-[64rpx] box-border rounded-full flex flex-row items-center justify-center shrink-0"
              :style="{ backgroundColor: ThemeColors.primary200 }"
            >
              <svg-icon
                :src="`/static/${iconThemeVersion}/icon_cover_confirm.svg`"
                class="w-[40rpx] h-[40rpx]"
                :color="ThemeColors.primary"
              ></svg-icon>
            </view>
            <text class="text-[32rpx] font-bold">插画风格</text>
          </view>

          <view
            class="h-full flex flex-row items-center justify-end gap-[8rpx] shrink-0"
          >
            <view class="h-full flex flex-row items-center justify-end">
              <text
                class="text-[28rpx]"
                :style="{ color: ThemeColors.text.body }"
                v-if="selectedPictureStyleIndex !== authors.length"
                >{{ formData.pictureStyle }}</text
              >
              <input
                type="text"
                class="w-[300rpx] h-full px-[16rpx] box-border text-right"
                placeholder="请输入插画风格"
                placeholder-class="custom-input-placeholder"
                @change="changeCustomPictureStyle"
                @click.stop
                v-else
              />
            </view>
            <view
              class="w-[32rpx] h-full flex flex-row items-center justify-center"
            >
              <svg-icon
                :src="`/static/${iconThemeVersion}/icon_arrow_right.svg`"
                class="w-[24rpx] h-[24rpx]"
                :color="ThemeColors.text.disabled"
              ></svg-icon>
            </view>
          </view>
        </view>

        <view
          class="w-full h-[108rpx] bg-white rounded-[24rpx] py-[24rpx] px-[16rpx] box-border shadow-sm border border-[rgba(255,255,255,0.03)] flex flex-row items-center justify-between"
          @click="openModal(EModalComponent.CHOOSE_RATIO_MODAL, {})"
        >
          <view class="w-full h-full flex flex-row items-center gap-[16rpx]">
            <view
              class="w-[64rpx] h-[64rpx] box-border rounded-full flex flex-row items-center justify-center shrink-0"
              :style="{ backgroundColor: ThemeColors.primary200 }"
            >
              <svg-icon
                :src="`/static/${iconThemeVersion}/icon_ratio.svg`"
                class="w-[40rpx] h-[40rpx]"
                :color="ThemeColors.primary"
              ></svg-icon>
            </view>
            <text class="text-[32rpx] font-bold">绘本比例</text>
          </view>

          <view
            class="h-full flex flex-row items-center justify-end gap-[8rpx] shrink-0"
          >
            <view class="h-full flex flex-row items-center justify-end">
              <text
                class="text-[28rpx]"
                :style="{ color: ThemeColors.text.body }"
                >{{ formData.ratio }}</text
              >
            </view>
            <view
              class="w-[32rpx] h-full flex flex-row items-center justify-center"
            >
              <svg-icon
                :src="`/static/${iconThemeVersion}/icon_arrow_right.svg`"
                class="w-[24rpx] h-[24rpx]"
                :color="ThemeColors.text.disabled"
              ></svg-icon>
            </view>
          </view>
        </view>

        <view
          class="w-full h-[108rpx] bg-white rounded-[24rpx] py-[24rpx] px-[16rpx] box-border shadow-sm border border-[rgba(255,255,255,0.03)] flex flex-row items-center justify-between"
          @click="openModal(EModalComponent.CHOOSE_LANGUAGE_MODAL, {})"
        >
          <view class="w-full h-full flex flex-row items-center gap-[16rpx]">
            <view
              class="w-[64rpx] h-[64rpx] box-border rounded-full flex flex-row items-center justify-center shrink-0"
              :style="{ backgroundColor: ThemeColors.primary200 }"
            >
              <svg-icon
                :src="`/static/${iconThemeVersion}/icon_language.svg`"
                class="w-[40rpx] h-[40rpx]"
                :color="ThemeColors.primary"
              ></svg-icon>
            </view>
            <text class="text-[32rpx] font-bold">绘本语言</text>
          </view>

          <view
            class="h-full flex flex-row items-center justify-end gap-[8rpx] shrink-0"
          >
            <view class="h-full flex flex-row items-center justify-end">
              <text
                class="text-[28rpx]"
                :style="{ color: ThemeColors.text.body }"
                >{{ formData.language }}</text
              >
            </view>
            <view
              class="w-[32rpx] h-full flex flex-row items-center justify-center"
            >
              <svg-icon
                :src="`/static/${iconThemeVersion}/icon_arrow_right.svg`"
                class="w-[24rpx] h-[24rpx]"
                :color="ThemeColors.text.disabled"
              ></svg-icon>
            </view>
          </view>
        </view>

        <view
          class="w-full h-[108rpx] bg-white rounded-[24rpx] py-[24rpx] px-[16rpx] box-border shadow-sm border border-[rgba(255,255,255,0.03)] flex flex-row items-center justify-between"
        >
          <view class="w-full h-full flex flex-row items-center gap-[16rpx]">
            <view
              class="w-[64rpx] h-[64rpx] box-border rounded-full flex flex-row items-center justify-center shrink-0"
              :style="{ backgroundColor: ThemeColors.primary200 }"
            >
              <svg-icon
                :src="`/static/${iconThemeVersion}/icon_number.svg`"
                class="w-[40rpx] h-[40rpx]"
                :color="ThemeColors.primary"
              ></svg-icon>
            </view>
            <text class="text-[32rpx] font-bold">故事长度</text>
          </view>

          <view
            class="relative w-[330rpx] h-[92rpx] shrink-0 bg-gray-50 rounded-[24rpx] p-[6rpx] box-border border border-[rgba(255,255,255,0.03)] flex flex-row items-center justify-between"
          >
            <view
              class="absolute left-0 top-0 w-[116rpx] h-full p-[8rpx] box-border flex flex-row items-center justify-center transition-all duration-300"
              :style="{
                transform: `translateX(${storyLength * 106}rpx)`,
              }"
            >
              <view
                class="w-full h-full rounded-[16rpx]"
                :style="{
                  backgroundColor: ThemeColors.primary,
                }"
              ></view>
            </view>
            <view
              class="w-full h-full z-[9] rounded-[16rpx] flex flex-row items-center justify-center"
              v-for="(item, index) in storyLengthOptions"
              :key="index"
              @click="handleStoryLengthClick(item.value)"
            >
              <text
                class="text-[32rpx] font-[500] transition-all duration-300"
                :style="{
                  color:
                    storyLength === item.value
                      ? ThemeColors.text.white
                      : ThemeColors.text.body,
                }"
                >{{ item.label }}</text
              >
            </view>
          </view>
        </view>

        <view
          class="w-full h-[108rpx] bg-white rounded-[24rpx] py-[24rpx] px-[16rpx] box-border shadow-sm border border-[rgba(255,255,255,0.03)] flex flex-row items-center justify-between"
        >
          <view class="w-full h-full flex flex-row items-center gap-[16rpx]">
            <view
              class="w-[64rpx] h-[64rpx] box-border rounded-full flex flex-row items-center justify-center shrink-0"
              :style="{ backgroundColor: ThemeColors.primary200 }"
            >
              <svg-icon
                :src="`/static/${iconThemeVersion}/icon_number.svg`"
                class="w-[40rpx] h-[40rpx]"
                :color="ThemeColors.primary"
              ></svg-icon>
            </view>
            <text class="text-[32rpx] font-bold"
              >角色个数<text class="text-[#958a50] text-[28rpx]"
                >（{{
                  formData.roleCount === 0
                    ? "不限制"
                    : formData.roleCount + "个"
                }}）</text
              ></text
            >
          </view>

          <view
            class="relative w-[300rpx] h-[92rpx] shrink-0 bg-gray-50 rounded-[24rpx] p-[6rpx] box-border border border-[rgba(255,255,255,0.03)] flex flex-row items-center justify-between"
          >
            <view
              class="w-full h-[88rpx] flex flex-row items-center justify-center"
            >
              <slider
                class="w-full"
                block-size="20"
                :activeColor="ThemeColors.primary"
                :min="0"
                :max="5"
                step="1"
                :value="formData.roleCount"
                @changing="handleRoleCountChange"
                @change="handleRoleCountChange"
              >
              </slider>
            </view>
          </view>
        </view>

        <view
          class="w-full h-[108rpx] bg-white rounded-[24rpx] py-[24rpx] px-[16rpx] box-border shadow-sm border border-[rgba(255,255,255,0.03)] flex flex-row items-center justify-between"
        >
          <view class="w-full h-full flex flex-row items-center gap-[16rpx]">
            <view
              class="w-[64rpx] h-[64rpx] box-border rounded-full flex flex-row items-center justify-center shrink-0"
              :style="{ backgroundColor: ThemeColors.primary200 }"
            >
              <svg-icon
                :src="`/static/${iconThemeVersion}/icon_number.svg`"
                class="w-[40rpx] h-[40rpx]"
                :color="ThemeColors.primary"
              ></svg-icon>
            </view>
            <text class="text-[32rpx] font-bold"
              >场景个数<text class="text-[#958a50] text-[28rpx]"
                >（{{
                  formData.sceneCount === 0
                    ? "不限制"
                    : formData.sceneCount + "个"
                }}）</text
              ></text
            >
          </view>

          <view
            class="relative w-[300rpx] h-[92rpx] shrink-0 bg-gray-50 rounded-[24rpx] p-[6rpx] box-border border border-[rgba(255,255,255,0.03)] flex flex-row items-center justify-between"
          >
            <view
              class="w-full h-[88rpx] flex flex-row items-center justify-center"
            >
              <slider
                class="w-full"
                block-size="20"
                :activeColor="ThemeColors.primary"
                :min="0"
                :max="20"
                step="1"
                :value="formData.sceneCount"
                @changing="handleSceneCountChange"
                @change="handleSceneCountChange"
              >
              </slider>
            </view>
          </view>
        </view>
      </view>

      <view
        class="w-full h-[128rpx] px-[32rpx] box-border sticky left-0 bottom-0 bg-white bg-gradient-to-t from-background-light via-background-light to-transparent dark:from-background-dark dark:via-background-dark/95 z-40 flex flex-row items-center justify-center"
      >
        <view
          class="w-full h-[88rpx] py-4 rounded-[24rpx] shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          :style="{
            backgroundColor: ThemeColors.primary,
            boxShadow: `0 10px 15px -3px ${ThemeColors.primary300}`,
          }"
          @click="handleGenerateStory"
        >
          <text class="text-[34rpx] text-white font-bold">生成故事</text>
          <svg-icon
            :src="`/static/${iconThemeVersion}/icon_generate.svg`"
            class="w-[32rpx] h-[32rpx]"
            :color="ThemeColors.text.white"
          ></svg-icon>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import {
  authors,
  iconThemeVersion,
  moralities,
  ThemeColors,
} from "@/config/config";
import { computed, inject, onMounted, ref } from "vue";
import { EModalComponent } from "../../modals/types";

const $emit = defineEmits<{
  (e: "open-modal", params: { component: string; data: any }): void;
  (e: "change-custom-theme", value: string): void;
  (e: "change-custom-story-style", value: string): void;
  (e: "change-custom-picture-style", value: string): void;
  (e: "change-story-length", value: number): void;
  (e: "change-role-count", value: number): void;
  (e: "change-scene-count", value: number): void;
  (e: "generate-story"): void;
}>();

const formData = inject<any>("formData");
const selectedThemeIndexes = inject<any>("selectedThemeIndexes");
const selectedStoryStyleIndex = inject<any>("selectedStoryStyleIndex");
const selectedPictureStyleIndex = inject<any>("selectedPictureStyleIndex");

const safeTop = uni.getWindowInfo().safeAreaInsets?.top || 0;

const storyLength = ref<number>(1);
const storyLengthOptions = [
  {
    label: "短",
    value: 0,
  },
  {
    label: "中",
    value: 1,
  },
  {
    label: "长",
    value: 2,
  },
];

const headerHeight = computed(() => {
  return safeTop + uni.upx2px(168);
});
const offsetTop = computed(() => {
  return safeTop + uni.upx2px(280);
});

onMounted(() => {
  initStoryLength();
});

function initStoryLength() {
  if (formData.value.length <= 100) {
    storyLength.value = 0;
  } else if (formData.value.length <= 500) {
    storyLength.value = 1;
  } else {
    storyLength.value = 2;
  }
}

function openModal(component: string, data: any) {
  $emit("open-modal", {
    component,
    data,
  });
}

function changeCustomTheme(e: any) {
  $emit("change-custom-theme", e.detail.value);
}

function changeCustomStoryStyle(e: any) {
  $emit("change-custom-story-style", e.detail.value);
}

function changeCustomPictureStyle(e: any) {
  $emit("change-custom-picture-style", e.detail.value);
}

function handleStoryLengthClick(value: number) {
  storyLength.value = value;
  $emit("change-story-length", value === 0 ? 100 : value === 1 ? 500 : 1000);
}

function handleRoleCountChange(e: any) {
  $emit("change-role-count", Number(e.detail.value));
}

function handleSceneCountChange(e: any) {
  $emit("change-scene-count", Number(e.detail.value));
}

function handleGenerateStory() {
  $emit("generate-story");
}
</script>

<style scoped></style>
