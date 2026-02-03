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
          class="w-full mt-[32rpx] rounded-[24rpx] flex flex-col gap-[24rpx]"
        >
          <view
            class="rounded-[32rpx] flex items-center transition-all"
            v-for="(voice, index) in voiceTypes"
            :key="`${voice.value}`"
            :class="[
              selectedVoiceTypeIndex === index ? 'sticky left-0 bg-white' : '',
            ]"
            :style="{
              top:
                selectedVoiceTypeIndex === index
                  ? `${headerHeight + 12}px`
                  : '0',
            }"
            @click="handleSelectVoiceType(index)"
          >
            <view
              class="rounded-[32rpx] p-4 w-full h-full border-2 flex items-center gap-4 transition-all"
              :style="{
                backgroundColor:
                  selectedVoiceTypeIndex === index
                    ? ThemeColors.primary100
                    : '#fff',
                borderColor:
                  selectedVoiceTypeIndex === index
                    ? ThemeColors.primary
                    : 'transparent',
              }"
            >
              <view
                class="w-[80rpx] h-[80rpx] flex flex-row items-center justify-center active:scale-95 transition-all duration-300"
                @click.stop="handlePlayClick(voice)"
              >
                <svg-icon
                  :src="`/static/${iconThemeVersion}/icon_play_circle.svg`"
                  class="w-full h-full"
                  :color="
                    selectedVoiceTypeIndex === index
                      ? ThemeColors.primary
                      : ThemeColors.text.disabled
                  "
                  v-if="currentPlayVoiceType !== voice.value"
                />
                <svg-icon
                  :src="`/static/${iconThemeVersion}/icon_pause_circle.svg`"
                  class="w-full h-full"
                  :color="
                    selectedVoiceTypeIndex === index
                      ? ThemeColors.primary
                      : ThemeColors.text.disabled
                  "
                  v-else
                />
              </view>
              <view class="flex-1 flex flex-col items-start">
                <h3 class="font-bold text-[30rpx]">{{ voice.name }}</h3>
                <span class="mt-0.5 text-[28rpx] text-[#888]">{{
                  voice.gender.toLowerCase() === "male" ? "男声" : "女声"
                }}</span>
              </view>
              <view class="radio-outer">
                <view class="radio-inner"></view>
              </view>
            </view>
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
          <view class="w-full flex flex-row items-start justify-start">
            <text class="leading-[40rpx] text-[28rpx] text-[#888]"
              >提示：整本绘本将使用同一种音色生成。</text
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
          @click="handleConfirmAudio"
        >
          <text class="text-[34rpx] text-white font-bold"
            >确认配音，下一步</text
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
import { computed, onMounted, ref } from "vue";
import { voiceTypes } from "@/config/config";

const $emit = defineEmits<{
  (e: "confirm-audio"): void;
}>();

const safeTop = uni.getWindowInfo().safeAreaInsets?.top || 0;
const safeBottom = uni.getWindowInfo().safeAreaInsets?.bottom || 0;

const selectedVoiceTypeIndex = ref<number>(0);

const currentPlayVoiceType = ref<number>(0);

const audioContext = ref<any>(null);

onMounted(() => {
  audioContext.value = uni.createInnerAudioContext();
  audioContext.value.autoplay = true;
  audioContext.value.onEnded(() => {
    currentPlayVoiceType.value = 0;
  });
});

const headerHeight = computed(() => {
  return safeTop + uni.upx2px(168);
});

function handleConfirmAudio() {
  $emit("confirm-audio");
}

function handlePlayAudio(voiceType: number) {
  currentPlayVoiceType.value = voiceType;
  audioContext.value.src =
    voiceTypes.find((v) => v.value === voiceType)?.audio || "";
  audioContext.value.play();
}

function handleStopAudio() {
  audioContext.value.stop();
  currentPlayVoiceType.value = 0;
}

function handlePlayClick(voice: any) {
  if (currentPlayVoiceType.value === voice.value) {
    handleStopAudio();
  } else {
    handlePlayAudio(voice.value);
  }
}

function handleSelectVoiceType(index: number) {
  selectedVoiceTypeIndex.value = index;
}
</script>

<style scoped></style>
