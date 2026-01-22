<template>
  <view
    class="w-full h-full bg-transparent flex flex-row justify-end"
    @click="handleClose"
  >
    <view class="w-[50vw] h-full bg-white flex flex-col" @click.stop>
      <view
        class="w-full box-border flex flex-row items-center justify-between border-b border-b-[rgba(230,226,209,0.5)] border-b-[1rpx]"
        :style="{
          height: `${calcSize(128 + 96)}rpx`,
          padding: `calc(${calcSize(96)}rpx) ${calcSize(32)}rpx 0 ${calcSize(
            32
          )}rpx`,
        }"
      >
        <text
          class="text-[#333] font-bold"
          :style="{
            fontSize: `${calcSize(32)}rpx`,
          }"
          >选择音色</text
        >
        <view
          class="flex flex-row items-center justify-end active:scale-95 transition-all duration-300"
          :style="{
            width: `${calcSize(128)}rpx`,
            height: `${calcSize(128)}rpx`,
          }"
        >
          <text
            class="font-bold"
            :style="{ color: mainColor, fontSize: `${calcSize(32)}rpx` }"
            @click="handleConfirm"
            >确定</text
          >
        </view>
      </view>
      <view class="w-full flex-1 flex flex-row items-start">
        <scroll-view
          class="w-full"
          scroll-y
          :style="{ maxHeight: `calc(100vh - 128rpx)` }"
        >
          <view
            class="w-full box-border flex flex-col"
            :style="{
              padding: `${calcSize(24)}rpx`,
              gap: `${calcSize(12)}rpx`,
            }"
          >
            <view
              class="w-full box-border rounded-[16rpx] flex flex-row items-center justify-center transition-all duration-300"
              v-for="item in renderVoiceTypes"
              :key="item.value"
              :style="{
                backgroundColor:
                  voiceType === item.value
                    ? 'rgba(255, 123, 172, 0.1)'
                    : 'transparent',
                padding: `${calcSize(24)}rpx`,
                gap: `${calcSize(24)}rpx`,
              }"
              @click="handleItemClick(item.value)"
            >
              <view class="flex-1 flex flex-row items-center justify-between">
                <text
                  class="text-[#666] font-[500]"
                  :style="{
                    fontSize: `${calcSize(30)}rpx`,
                    lineHeight: `${calcSize(48)}rpx`,
                  }"
                  >{{ item.name }}</text
                >

                <view
                  class="flex flex-row items-center justify-center active:scale-95 transition-all duration-300"
                  :style="{
                    width: `${calcSize(96)}rpx`,
                    height: `${calcSize(96)}rpx`,
                  }"
                  @click.stop="handlePlayClick(item)"
                >
                  <svg-icon
                    :src="`/static/${iconThemeVersion}/icon_play_circle.svg`"
                    :style="{
                      width: `${calcSize(48)}rpx`,
                      height: `${calcSize(48)}rpx`,
                    }"
                    :color="ThemeColors.primary"
                    v-if="currentAudioUrl !== item.audio"
                  />
                  <svg-icon
                    :src="`/static/${iconThemeVersion}/icon_pause_circle.svg`"
                    :style="{
                      width: `${calcSize(48)}rpx`,
                      height: `${calcSize(48)}rpx`,
                    }"
                    :color="ThemeColors.primary"
                    v-else
                  />
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import {
  voiceTypes,
  mainColor,
  ThemeColors,
  iconThemeVersion,
} from "@/config/config";
import type { IPBAudio } from "@/types";
import { computed, onMounted, ref } from "vue";

interface Props {
  currentVoiceType: number;
  audios: IPBAudio[];
}

const props = defineProps<Props>();

const $emit = defineEmits<{
  (e: "on-close"): void;
  (
    e: "on-confirm",
    data: {
      voiceType: number;
    }
  ): void;
}>();

const safeTop = uni.getWindowInfo().safeAreaInsets?.top || 0;

const sampleAudioContext = ref<any>(null);
const currentAudioUrl = ref<string | undefined>();

const voiceType = ref<number>(props.currentVoiceType);

const renderVoiceTypes = computed(() => {
  const t = voiceTypes.filter((item) => {
    return props.audios.some(
      (audio: IPBAudio) => audio.voiceType === item.value
    );
  });
  return t;
});

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

onMounted(() => {
  if (props.currentVoiceType === 0) {
    voiceType.value = renderVoiceTypes.value[0].value;
  }

  sampleAudioContext.value = uni.createInnerAudioContext();
  sampleAudioContext.value.autoplay = true;
  sampleAudioContext.value.onEnded(() => {
    currentAudioUrl.value = undefined;
  });
});

function handlePlayClick(item: any) {
  if (currentAudioUrl.value === item.audio) {
    sampleAudioContext.value.stop();
    currentAudioUrl.value = undefined;
    return;
  }
  currentAudioUrl.value = item.audio;
  sampleAudioContext.value.src = item.audio;
  sampleAudioContext.value.play();
}

function handleItemClick(value: number) {
  voiceType.value = value;
}

function handleConfirm() {
  sampleAudioContext.value.stop();
  currentAudioUrl.value = undefined;
  $emit("on-confirm", {
    voiceType: voiceType.value,
  });
}

function handleClose() {
  sampleAudioContext.value.stop();
  currentAudioUrl.value = undefined;
  $emit("on-close");
}
</script>

<style lang="scss" scoped></style>
