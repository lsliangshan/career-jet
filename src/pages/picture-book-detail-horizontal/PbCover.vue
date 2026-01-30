<template>
  <view
    class="absolute left-0 top-0 w-[100vw] h-[100vh] transition-all duration-300"
  >
    <view
      class="absolute left-0 top-0 w-full h-full flex flex-row items-center justify-center"
    >
      <image
        class="w-full h-full"
        :src="pbDetail?.cover?.url"
        mode="aspectFill"
      ></image>
    </view>

    <view
      class="absolute left-0 top-0 w-[50vw] box-border h-full flex flex-row items-end justify-center z-[9]"
      :style="{
        padding: `${calcSize(32)}rpx`,
      }"
    >
      <view
        class="w-full bg-[rgba(0,0,0,0.2)] backdrop-blur-[12rpx] border border-[2rpx] border-[rgba(255,255,255,0.3)] shadow-2xl rounded-[32rpx] box-border flex flex-col"
        :style="{
          padding: `${calcSize(32)}rpx`,
        }"
      >
        <view
          class="w-full flex flex-row items-center"
          :style="{
            height: `${calcSize(48)}rpx`,
            marginBottom: `${calcSize(32)}rpx`,
          }"
        >
          <view
            class="h-full box-border rounded-[24rpx] flex flex-row items-center justify-center"
            :style="{
              backgroundColor: ThemeColors.primary,
              padding: `0 ${calcSize(16)}rpx`,
            }"
          >
            <text
              class="text-[#fff]"
              :style="{
                fontSize: `${calcSize(24)}rpx`,
              }"
              >{{ pbDetail?.config.theme }}</text
            >
          </view>
        </view>

        <view
          class="w-full flex flex-row items-center"
          :style="{
            marginBottom: `${calcSize(12)}rpx`,
          }"
        >
          <text
            class="font-bold text-[#fff] drop-shadow-md"
            :style="{
              fontSize: `${calcSize(52)}rpx`,
            }"
            >{{ pbDetail?.title }}</text
          >
        </view>

        <view
          class="w-full flex flex-row items-center"
          :style="{
            height: `${calcSize(48)}rpx`,
            marginBottom: `${calcSize(32)}rpx`,
            gap: `${calcSize(12)}rpx`,
          }"
        >
          <image
            class="rounded-full border border-[1rpx] border-[rgba(255,255,255,0.3)]"
            :style="{
              width: `${calcSize(42)}rpx`,
              height: `${calcSize(42)}rpx`,
            }"
            :src="renderAvatar"
            mode="aspectFill"
            @error="handleAvatarError"
          ></image>
          <text
            class="text-[rgba(255,255,255,0.8)] drop-shadow-md"
            :style="{
              fontSize: `${calcSize(32)}rpx`,
            }"
            >{{ pbDetail?.author?.nickname }}</text
          >
        </view>

        <view
          class="w-full flex flex-row items-center justify-center"
          :style="{
            height: `${calcSize(108)}rpx`,
          }"
        >
          <view
            class="relative flex w-full h-full items-center justify-center overflow-hidden rounded-full transition-all active:scale-95 shadow-lg shadow-primary/20"
            :style="{
              backgroundColor: ThemeColors.primary,
              gap: `${calcSize(16)}rpx`,
            }"
            @click="handleStartReading"
          >
            <svg-icon
              :src="`/static/${iconThemeVersion}/icon_start_read.svg`"
              :style="{
                width: `${calcSize(32)}rpx`,
                height: `${calcSize(32)}rpx`,
                marginBottom: `${calcSize(4)}rpx`,
              }"
              color="#fff"
            />
            <text
              class="font-bold text-[#fff]"
              :style="{
                fontSize: `${calcSize(36)}rpx`,
              }"
              >{{
                pbDetail?.config.language === "中文"
                  ? "开始阅读"
                  : "Start Reading"
              }}</text
            >
          </view>
        </view>

        <view
          class="w-full flex flex-row items-center justify-center"
          :style="{
            marginTop: `${calcSize(32)}rpx`,
          }"
          v-if="hasAudio"
        >
          <view
            class="box-border flex flex-col items-center justify-center active:scale-95 transition-all duration-300"
            :style="{
              padding: `${calcSize(16)}rpx ${calcSize(24)}rpx`,
              borderRadius: `${calcSize(16)}rpx`,
              gap: `${calcSize(12)}rpx`,
            }"
            @click="handleStartReadingWithAudio"
          >
            <view
              class="bg-white flex flex-row items-center justify-center rounded-full"
              :style="{
                width: `${calcSize(64)}rpx`,
                height: `${calcSize(64)}rpx`,
              }"
            >
              <svg-icon
                :src="`/static/${iconThemeVersion}/icon_volume.svg`"
                :style="{
                  width: `${calcSize(32)}rpx`,
                  height: `${calcSize(32)}rpx`,
                }"
                :color="ThemeColors.primary"
              />
            </view>
            <text
              class="text-[#fff]"
              :style="{
                fontSize: `${calcSize(28)}rpx`,
              }"
              >{{
                pbDetail?.config.language === "中文" ? "听绘本" : "Listen"
              }}</text
            >
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { IPictureBook } from "@/types";
import { DEFAULT_AVATAR, iconThemeVersion, ThemeColors } from "@/config/config";
import { computed, nextTick, onBeforeMount, ref } from "vue";

interface Props {
  pbDetail: IPictureBook;
  hasAudio: boolean;
}

const props = defineProps<Props>();

const $emit = defineEmits<{
  (e: "on-start-reading"): void;
  (e: "on-start-reading-with-audio"): void;
}>();

const renderAvatar = ref();

const calcSize = computed(() => {
  const dpr = Number(
    (
      uni.getWindowInfo().windowWidth / uni.getSystemInfoSync().windowHeight
    ).toFixed(2)
  );
  return function (size: number) {
    return Math.round(size / dpr);
  };
});

onBeforeMount(() => {
  nextTick(() => {
    setTimeout(() => {
      renderAvatar.value = props.pbDetail.author?.avatar || DEFAULT_AVATAR;
    }, 400);
  });
});

function handleAvatarError() {
  renderAvatar.value = DEFAULT_AVATAR;
}

function handleStartReading() {
  $emit("on-start-reading");
}

function handleStartReadingWithAudio() {
  $emit("on-start-reading-with-audio");
}
</script>

<style scoped></style>
