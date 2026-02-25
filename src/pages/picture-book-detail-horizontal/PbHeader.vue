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
      <svg-icon
        :src="`/static/${iconThemeVersion}/icon_back.svg`"
        :style="{
          width: `${calcSize(36)}rpx`,
          height: `${calcSize(36)}rpx`,
          marginRight: `${calcSize(8)}rpx`,
        }"
        color="#fff"
      />
    </view>

    <view
      class="flex flex-row items-center justify-center"
      :style="{
        height: `${calcSize(80)}rpx`,
        gap: `${calcSize(16)}rpx`,
      }"
    >
      <view
        class="rounded-full backdrop-blur-md transition-all active:scale-95 flex flex-row items-center justify-center shrink-0"
        v-if="isMyPictureBook && isReview && isSuperAdmin"
        :style="{
          backgroundColor: ThemeColors.primary,
          width: `${calcSize(80)}rpx`,
          height: `${calcSize(80)}rpx`,
        }"
        @click="handleReview"
      >
        <svg-icon
          :src="`/static/${iconThemeVersion}/icon_review.svg`"
          class="w-[36rpx] h-[36rpx]"
          color="#fff"
        />
      </view>

      <!-- <view
        class="rounded-full rounded-full bg-black/20 backdrop-blur-md transition-all active:scale-95 flex flex-row items-center justify-center"
        :style="{
          width: `${calcSize(80)}rpx`,
          height: `${calcSize(80)}rpx`,
        }"
        v-if="isMyPictureBook"
      >
        <svg-icon
          :src="`/static/${iconThemeVersion}/icon_settings.svg`"
          :style="{
            width: `${calcSize(42)}rpx`,
            height: `${calcSize(42)}rpx`,
          }"
          color="#fff"
        />
      </view> -->

      <view
        class="rounded-full rounded-full bg-black/20 backdrop-blur-md transition-all active:scale-95 flex flex-row items-center justify-center"
        :style="{
          width: `${calcSize(80)}rpx`,
          height: `${calcSize(80)}rpx`,
        }"
        v-if="sceneId && hasAudio"
        @click="handlePlayAudio"
      >
        <svg-icon
          :src="`/static/${iconThemeVersion}/icon_volume.svg`"
          :style="{
            width: `${calcSize(42)}rpx`,
            height: `${calcSize(42)}rpx`,
          }"
          :color="
            playingSceneId === sceneId || autoplayWithAudio
              ? ThemeColors.primary
              : '#fff'
          "
        />
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
        <svg-icon
          :src="`/static/${iconThemeVersion}/icon_like.svg`"
          :style="{
            width: `${calcSize(38)}rpx`,
            height: `${calcSize(38)}rpx`,
          }"
          :color="likeStatus ? ThemeColors.primary : '#fff'"
        />
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
          <svg-icon
            :src="`/static/${iconThemeVersion}/icon_share.svg`"
            :style="{
              width: `${calcSize(40)}rpx`,
              height: `${calcSize(40)}rpx`,
              marginRight: `${calcSize(8)}rpx`,
            }"
            color="#fff"
          />
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, type Ref, ref } from "vue";
import { usePictureBookStore } from "@/stores/picture_book";
import { UserRole, useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { iconThemeVersion, ThemeColors } from "@/config/config";

interface Props {
  pbId: string;
  sceneId: string;
  // 正在播放的场景ID
  playingSceneId?: string;
  authorId?: string;
  hasAudio: boolean;
  isReview?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isReview: false,
});

const $emit = defineEmits<{
  (e: "on-back"): void;
  (e: "on-play-audio", sceneId: string): void;
  (e: "on-review", pbId: string): void;
}>();

const autoplayWithAudio = inject<Ref<boolean>>("autoplayWithAudio");

const { left: safeTitleWidth } = uni.getMenuButtonBoundingClientRect();

const userStore = useUserStore();
const pictureBookStore = usePictureBookStore();

const { loginInfo } = storeToRefs(userStore);

const likeStatus = ref<boolean>(false);

const isMyPictureBook = computed(() => {
  return props.authorId === loginInfo.value?.id;
});

const isSuperAdmin = computed(() => {
  return loginInfo.value?.role == UserRole.SUPER_ADMIN;
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

function handleReview() {
  $emit("on-review", props.pbId);
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
