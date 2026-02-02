<template>
  <view class="w-full h-full flex flex-col items-center justify-center">
    <scroll-view scroll-y class="w-full h-full">
      <view class="w-full" :style="{ height: `${headerHeight}px` }"></view>

      <view
        class="w-full px-[32rpx] py-[32rpx] box-border flex flex-col gap-[24rpx]"
        :style="{
          minHeight: `calc(100% - ${headerHeight}px - 128rpx - ${safeBottom}px)`,
        }"
      >
        <view class="w-full">
          <grid-view
            type="masonry"
            :cross-axis-count="2"
            :main-axis-gap="12"
            :cross-axis-gap="12"
            :padding="[0, 0, 0, 0]"
            ref="waterfallRef"
          >
            <view class="w-full" v-for="(role, index) in roles" :key="role.id">
              <ImageCard
                type="role"
                :info="role"
                :ratio="formData!.ratio"
                :isLoading="!role.url"
                :title="role.name"
                :regenerateHandler="() => handleRegenerateRole(role)"
              />
            </view>
          </grid-view>
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
          <view class="w-full flex flex-row items-start justify-start">
            <text class="leading-[40rpx] text-[28rpx] text-[#888]"
              >提示：AI
              已经根据您的故事生成了符合风格的角色形象。如果不满意，可以点击重新生成来获取新的方案。</text
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
          :style="{
            backgroundColor: ThemeColors.primary,
            boxShadow: `0 10px 15px -3px ${ThemeColors.primary300}`,
          }"
          @click="handleConfirmRoles"
        >
          <text class="text-[34rpx] text-white font-bold"
            >确认角色，下一步</text
          >
          <svg-icon
            :src="`/static/${iconThemeVersion}/icon_next.svg`"
            class="w-[32rpx] h-[32rpx]"
            :color="ThemeColors.text.white"
          ></svg-icon>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { iconThemeVersion, ThemeColors } from "@/config/config";
import type { IRoleItem } from "@/types";
import { computed, inject, ref, type Ref } from "vue";
import type { ICreatePictureBookFormData } from "../../types";
import ImageCard from "@/components/image-card/image-card.vue";

const $emit = defineEmits<{
  (e: "confirm-roles"): void;
  (e: "regenerate-role", params: { role: IRoleItem }): void;
}>();

const cachedPromises = ref<Map<string, Promise<void>>>(new Map());

const roles = inject<Ref<IRoleItem[]>>("roles");
const formData = inject<Ref<ICreatePictureBookFormData>>("formData");

const safeTop = uni.getWindowInfo().safeAreaInsets?.top || 0;
const safeBottom = uni.getWindowInfo().safeAreaInsets?.bottom || 0;

const headerHeight = computed(() => {
  return safeTop + uni.upx2px(168);
});

function handleConfirmRoles() {
  $emit("confirm-roles");
}

function handleRegenerateRole(e: any): Promise<void> {
  return new Promise((resolve) => {
    $emit("regenerate-role", { role: e });
    cachedPromises.value.set(
      e.id,
      new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 4000);
      })
    );
  });
}
</script>

<style scoped></style>
