<template>
  <view
    class="absolute left-0 top-0 z-[99] box-border flex flex-row items-center justify-between"
    :style="{
      width: `calc(${safeTitleWidth}px)`,
      height: `${calcSize(80)}rpx`,
      padding: `${calcSize(24)}rpx`,
      top: `${calcSize(12)}rpx`,
    }"
  >
    <view
      class="rounded-full rounded-full bg-black/20 backdrop-blur-md transition-all active:scale-95 flex flex-row items-center justify-center"
      :style="{
        width: `${calcSize(80)}rpx`,
        height: `${calcSize(80)}rpx`,
      }"
      @click="handleBack"
    >
      <image
        class="mr-[8rpx]"
        :style="{
          width: `${calcSize(36)}rpx`,
          height: `${calcSize(36)}rpx`,
        }"
        src="@static/icon_back_white.png"
      ></image>
    </view>

    <view
      class="flex flex-row items-center justify-center"
      :style="{
        height: `${calcSize(80)}rpx`,
        gap: `${calcSize(16)}rpx`,
      }"
    >
      <view
        class="rounded-full rounded-full bg-black/20 backdrop-blur-md transition-all active:scale-95 flex flex-row items-center justify-center"
        :style="{
          width: `${calcSize(80)}rpx`,
          height: `${calcSize(80)}rpx`,
        }"
        v-if="sceneId"
        @click="handlePlayAudio"
      >
        <image
          v-if="playingSceneId === sceneId"
          :style="{
            width: `${calcSize(42)}rpx`,
            height: `${calcSize(42)}rpx`,
          }"
          class="animate-pulse"
          src="
            @static/icon_volume_red.png
          "
        ></image>
        <image
          v-else
          :style="{
            width: `${calcSize(42)}rpx`,
            height: `${calcSize(42)}rpx`,
          }"
          src="
            @static/icon_volume.png
          "
        ></image>
      </view>

      <view
        class="rounded-full rounded-full bg-black/20 backdrop-blur-md transition-all active:scale-95 flex flex-row items-center justify-center"
        :style="{
          width: `${calcSize(80)}rpx`,
          height: `${calcSize(80)}rpx`,
        }"
        v-if="sceneId"
        @click="toggleLike"
      >
        <image
          :style="{
            width: `${calcSize(38)}rpx`,
            height: `${calcSize(38)}rpx`,
          }"
          src="@static/icon_like_red.png"
          v-if="likeStatus"
        ></image>
        <image
          :style="{
            width: `${calcSize(38)}rpx`,
            height: `${calcSize(38)}rpx`,
          }"
          src="@static/icon_like_white.png"
          v-else
        ></image>
      </view>

      <view
        class="rounded-full rounded-full bg-black/20 backdrop-blur-md transition-all active:scale-95 flex flex-row items-center justify-center"
        :style="{
          width: `${calcSize(80)}rpx`,
          height: `${calcSize(80)}rpx`,
        }"
      >
        <button
          open-type="share"
          class="w-full h-full border-none after:border-none bg-transparent p-0 flex flex-row items-center justify-center"
        >
          <image
            :style="{
              width: `${calcSize(40)}rpx`,
              height: `${calcSize(40)}rpx`,
              marginRight: `${calcSize(8)}rpx`,
            }"
            src="@static/icon_share.png"
          ></image>
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { usePictureBookStore } from "@/stores/picture_book";

interface Props {
  pbId: string;
  sceneId: string;
  // 正在播放的场景ID
  playingSceneId?: string;
}

const props = defineProps<Props>();

const $emit = defineEmits<{
  (e: "on-back"): void;
  (e: "on-play-audio", sceneId: string): void;
}>();

const { left: safeTitleWidth } = uni.getMenuButtonBoundingClientRect();

const pictureBookStore = usePictureBookStore();

const likeStatus = ref<boolean>(false);

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
  getPictureBookLikeStatus();
});

function getPictureBookLikeStatus() {
  pictureBookStore
    .getPictureBookLikeStatus({
      pbId: props.pbId,
    })
    .then((res: any) => {
      if (res.code === 200) {
        likeStatus.value = res.data.like;
      }
    });
}

function handleBack() {
  $emit("on-back");
}

function handlePlayAudio() {
  $emit("on-play-audio", props.sceneId);
}

function toggleLike() {
  likeStatus.value = !likeStatus.value;
  pictureBookStore
    .togglePictureBookLikeStatus({
      like: likeStatus.value,
      pbId: props.pbId,
    })
    .then((res: any) => {
      if (res.code === 200) {
        // likeStatus.value = res.data.like;
        uni.showToast({
          title: likeStatus.value ? "点赞成功" : "取消点赞成功",
          icon: "none",
        });
      } else {
        likeStatus.value = !likeStatus.value;
        uni.showToast({
          title: likeStatus.value ? "点赞失败" : "取消点赞失败",
          icon: "none",
        });
      }
    });
}
</script>

<style scoped></style>
