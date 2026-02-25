<template>
  <view
    class="absolute left-0 z-[99] h-[80rpx] px-[24rpx] box-border flex flex-row items-center justify-between"
    :style="{
      top: `calc(${safeTop}px)`,
      width: `calc(${safeTitleWidth}px)`,
    }"
  >
    <view
      class="w-[80rpx] h-[80rpx] rounded-full rounded-full bg-black/20 backdrop-blur-md transition-all active:scale-95 flex flex-row items-center justify-center shrink-0"
      @click="handleBack"
    >
      <svg-icon
        :src="`/static/${iconThemeVersion}/icon_back.svg`"
        class="w-[36rpx] h-[36rpx] mr-[8rpx]"
        color="#fff"
      />
    </view>

    <view
      class="h-[80rpx] flex flex-row items-center justify-center gap-[16rpx]"
    >
      <view
        class="w-[80rpx] h-[80rpx] rounded-full backdrop-blur-md transition-all active:scale-95 flex flex-row items-center justify-center shrink-0"
        v-if="isMyPictureBook && isReview && isSuperAdmin"
        :style="{
          backgroundColor: ThemeColors.primary,
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
        class="w-[80rpx] h-[80rpx] rounded-full rounded-full bg-black/20 backdrop-blur-md transition-all active:scale-95 flex flex-row items-center justify-center shrink-0"
        v-if="isMyPictureBook"
      >
        <svg-icon
          :src="`/static/${iconThemeVersion}/icon_settings.svg`"
          class="w-[42rpx] h-[42rpx]"
          color="#fff"
        />
      </view> -->

      <view
        class="w-[80rpx] h-[80rpx] rounded-full rounded-full bg-black/20 backdrop-blur-md transition-all active:scale-95 flex flex-row items-center justify-center shrink-0"
        v-if="sceneId && hasAudio"
        @click="handlePlayAudio"
      >
        <svg-icon
          :src="`/static/${iconThemeVersion}/icon_volume.svg`"
          class="w-[38rpx] h-[38rpx]"
          :color="
            playingSceneId === sceneId || autoplayWithAudio
              ? ThemeColors.primary
              : '#fff'
          "
        />
      </view>

      <view
        class="w-[80rpx] h-[80rpx] rounded-full rounded-full bg-black/20 backdrop-blur-md transition-all active:scale-95 flex flex-row items-center justify-center shrink-0"
        v-if="sceneId"
        @click="toggleLike"
      >
        <svg-icon
          :src="`/static/${iconThemeVersion}/icon_like.svg`"
          class="w-[38rpx] h-[38rpx]"
          :color="likeStatus ? ThemeColors.primary : '#fff'"
        />
      </view>

      <view
        class="w-[80rpx] h-[80rpx] rounded-full rounded-full bg-black/20 backdrop-blur-md transition-all active:scale-95 flex flex-row items-center justify-center shrink-0"
      >
        <button
          open-type="share"
          class="w-full h-full border-none after:border-none bg-transparent p-0 flex flex-row items-center justify-center"
        >
          <svg-icon
            :src="`/static/${iconThemeVersion}/icon_share.svg`"
            class="w-[40rpx] h-[40rpx] mr-[8rpx]"
            color="#fff"
          />
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, type Ref, ref } from "vue";
import { UserRole, useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { usePictureBookStore } from "@/stores/picture_book";
import { iconThemeVersion, ThemeColors } from "@/config/config";

interface Props {
  pbId: string;
  sceneId: string;
  // 正在播放的场景ID
  playingSceneId?: string;
  authorId?: string;
  hasAudio: boolean;
  isReview: boolean;
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

const userStore = useUserStore();
const pictureBookStore = usePictureBookStore();

const { loginInfo } = storeToRefs(userStore);

const likeStatus = ref<boolean>(false);

const safeTop = uni.getWindowInfo().safeAreaInsets?.top || 88;

const { left: safeTitleWidth } = uni.getMenuButtonBoundingClientRect();

const isMyPictureBook = computed(() => {
  return props.authorId === loginInfo.value?.id;
});

const isSuperAdmin = computed(() => {
  return loginInfo.value?.role == UserRole.SUPER_ADMIN;
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
