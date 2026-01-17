<template>
  <view
    class="absolute left-0 z-[99] h-[80rpx] px-[24rpx] box-border flex flex-row items-center justify-between"
    :style="{
      top: `calc(${safeTop}px)`,
      width: `calc(${safeTitleWidth}px)`,
    }"
  >
    <view
      class="w-[80rpx] h-[80rpx] rounded-full rounded-full bg-black/20 backdrop-blur-md transition-all active:scale-95 flex flex-row items-center justify-center"
      @click="handleBack"
    >
      <image
        class="w-[36rpx] h-[36rpx] mr-[8rpx]"
        src="@static/icon_back_white.png"
      ></image>
    </view>

    <view
      class="h-[80rpx] flex flex-row items-center justify-center gap-[16rpx]"
    >
      <view
        class="w-[80rpx] h-[80rpx] rounded-full rounded-full bg-black/20 backdrop-blur-md transition-all active:scale-95 flex flex-row items-center justify-center"
        v-if="sceneId"
        @click="handlePlayAudio"
      >
        <image
          v-if="playingSceneId === sceneId"
          class="w-[38rpx] h-[38rpx] animate-pulse"
          src="@static/icon_volume_red.png"
        ></image>
        <image
          v-else
          class="w-[38rpx] h-[38rpx]"
          src="@static/icon_volume.png"
        ></image>
      </view>

      <view
        class="w-[80rpx] h-[80rpx] rounded-full rounded-full bg-black/20 backdrop-blur-md transition-all active:scale-95 flex flex-row items-center justify-center"
        v-if="sceneId"
      >
        <image class="w-[38rpx] h-[38rpx]" src="@static/icon_like.png"></image>
      </view>

      <view
        class="w-[80rpx] h-[80rpx] rounded-full rounded-full bg-black/20 backdrop-blur-md transition-all active:scale-95 flex flex-row items-center justify-center"
      >
        <button
          open-type="share"
          class="w-full h-full border-none after:border-none bg-transparent p-0 flex flex-row items-center justify-center"
        >
          <image
            class="w-[40rpx] h-[40rpx] mr-[8rpx]"
            src="@static/icon_share.png"
          ></image>
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
interface Props {
  sceneId: string;
  // 正在播放的场景ID
  playingSceneId?: string;
}

const props = defineProps<Props>();

const $emit = defineEmits<{
  (e: "on-back"): void;
  (e: "on-play-audio", sceneId: string): void;
}>();

const safeTop = uni.getWindowInfo().safeAreaInsets?.top || 88;
const safeBottom = uni.getWindowInfo().safeAreaInsets?.bottom || 0;

const { left: safeTitleWidth } = uni.getMenuButtonBoundingClientRect();

function handleBack() {
  $emit("on-back");
}

function handlePlayAudio() {
  $emit("on-play-audio", props.sceneId);
}
</script>

<style scoped></style>
