<template>
  <view class="w-full max-h-[80vh] bg-white flex flex-col">
    <view
      class="w-full h-[128rpx] px-[32rpx] box-border flex flex-row items-center justify-between border-b border-b-[rgba(230,226,209,0.5)] border-b-[1rpx]"
    >
      <text class="text-[32rpx] text-[#333] font-bold">选择音色</text>
      <view
        class="w-[128rpx] h-[128rpx] flex flex-row items-center justify-end active:scale-95 transition-all duration-300"
      >
        <text
          class="text-[32rpx] font-bold"
          :style="{ color: mainColor }"
          @click="handleConfirm"
          >确定</text
        >
      </view>
    </view>
    <view class="w-full flex-1 flex flex-row items-start">
      <scroll-view
        class="w-full"
        scroll-y
        :style="{ maxHeight: `calc(80vh - 128rpx)` }"
      >
        <view
          class="w-full py-[24rpx] px-[24rpx] box-border flex flex-col gap-[12rpx]"
        >
          <view
            class="w-full px-[24rpx] py-[24rpx] box-border rounded-[16rpx] flex flex-row items-center justify-center gap-[24rpx] transition-all duration-300"
            v-for="item in renderVoiceTypes"
            :key="item.value"
            :style="{
              backgroundColor:
                voiceType === item.value
                  ? 'rgba(255, 123, 172, 0.1)'
                  : 'transparent',
            }"
            @click="handleItemClick(item.value)"
          >
            <view class="flex-1 flex flex-row items-center justify-between">
              <text
                class="leading-[48rpx] text-[30rpx] font-[500] text-[#666]"
                >{{ item.name }}</text
              >

              <view
                class="w-[96rpx] h-[96rpx] flex flex-row items-center justify-center active:scale-95 transition-all duration-300"
                @click.stop="handlePlayClick(item)"
              >
                <svg-icon
                  :src="`/static/${iconThemeVersion}/icon_play_circle.svg`"
                  class="w-[48rpx] h-[48rpx]"
                  :color="ThemeColors.primary"
                  v-if="currentAudioUrl !== item.audio"
                />
                <svg-icon
                  :src="`/static/${iconThemeVersion}/icon_pause_circle.svg`"
                  class="w-[48rpx] h-[48rpx]"
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
</template>

<script setup lang="ts">
import {
  voiceTypes,
  mainColor,
  iconThemeVersion,
  ThemeColors,
} from "@/config/config";
import type { IPBAudio } from "@/types";
import { computed, onMounted, ref } from "vue";

interface Props {
  currentVoiceType: number;
  audios: IPBAudio[];
}

const props = defineProps<Props>();

const $emit = defineEmits<{
  (
    e: "on-confirm",
    data: {
      voiceType: number;
    }
  ): void;
}>();

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
  $emit("on-confirm", {
    voiceType: voiceType.value,
  });
}
</script>

<style lang="scss" scoped></style>
