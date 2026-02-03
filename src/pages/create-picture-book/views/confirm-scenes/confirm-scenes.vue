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
          >
            <view
              class="w-full"
              v-for="(scene, index) in scenes"
              :key="scene.id"
            >
              <ImageCard
                type="scene"
                :info="scene"
                :ratio="formData!.ratio"
                :isLoading="loadingImageIds.has(scene.id)"
                :content="scene.content"
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
              已根据故事情节生成了对应的插画场景。您可以调整画面或修改文字描述后再确认。</text
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
          class="w-full h-[88rpx] py-4 rounded-[24rpx] shadow-lg transition-all flex items-center justify-center gap-2"
          :class="[
            regeneratingImageIds.size === 0 &&
            loadingImageIds.size === 0 &&
            !isConfirming
              ? 'pointer-events-auto active:scale-95'
              : 'pointer-events-none',
          ]"
          :style="{
            backgroundColor:
              regeneratingImageIds.size === 0 &&
              loadingImageIds.size === 0 &&
              !isConfirming
                ? ThemeColors.primary
                : ThemeColors.text.disabled,
            boxShadow: `0 10px 15px -3px ${
              regeneratingImageIds.size === 0 &&
              loadingImageIds.size === 0 &&
              !isConfirming
                ? ThemeColors.primary300
                : ThemeColors.text.disabled
            }`,
          }"
          @click="handleConfirmScenes"
        >
          <CustomLoader
            v-if="isConfirming"
            color="#fff"
            :size="32"
          ></CustomLoader>
          <text class="text-[34rpx] text-white font-bold">{{
            isConfirming ? "正在确认场景..." : "确认场景，下一步"
          }}</text>
          <svg-icon
            :src="`/static/${iconThemeVersion}/icon_next.svg`"
            class="w-[32rpx] h-[32rpx]"
            :color="ThemeColors.text.white"
            v-if="!isConfirming"
          ></svg-icon>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { iconThemeVersion, ThemeColors } from "@/config/config";
import { EEmitEvents, type ISceneItem } from "@/types";
import { computed, inject, nextTick, onMounted, ref, type Ref } from "vue";
import { type IStory, type ICreatePictureBookFormData } from "../../types";
import ImageCard from "@/components/image-card/image-card.vue";
import { requestGetImageUrls } from "@/request";
import { usePictureBookStore } from "@/stores/picture_book";
import CustomLoader from "@/components/custom-loader/custom-loader.vue";

const $emit = defineEmits<{
  (e: "on-confirmed", params: any): void;
}>();

const pictureBookStore = usePictureBookStore();

const scenes = inject<Ref<ISceneItem[]>>("scenes");
const formData = inject<Ref<ICreatePictureBookFormData>>("formData");
const story = inject<Ref<IStory>>("story");

// 正在加载图片的id列表
const loadingImageIds = ref<Set<string>>(new Set());

// 正在重新生成的图片的id列表
const regeneratingImageIds = ref<Set<string>>(new Set());

// 是否确认中
const isConfirming = ref(false);

const safeTop = uni.getWindowInfo().safeAreaInsets?.top || 0;
const safeBottom = uni.getWindowInfo().safeAreaInsets?.bottom || 0;

const headerHeight = computed(() => {
  return safeTop + uni.upx2px(168);
});

onMounted(() => {
  uni.$on(EEmitEvents.START_REGENERATE_SCENE, handleStartRegenerateScene);
  uni.$on(EEmitEvents.REGENERATE_SCENE_RESPONSE, handleRegenerateSceneResponse);
  uni.$on(EEmitEvents.REGENERATE_SCENE_ERROR, handleRegenerateSceneError);
  listImageUrls(
    scenes?.value?.map((scene: ISceneItem) => scene.taskId) ?? []
  ) ?? [];
});

function handleStartRegenerateScene(e: any) {
  if (!scenes?.value) {
    return;
  }
  const index = scenes.value.findIndex(
    (scene: ISceneItem) => scene.id === e.scene.id
  );
  if (index === -1) {
    return;
  }
  regeneratingImageIds.value.add(e.scene.id);
}

function handleRegenerateSceneResponse(e: any) {
  if (!scenes?.value) {
    return;
  }
  const index = scenes.value.findIndex(
    (scene: ISceneItem) => scene.id === e.scene.id
  );
  if (index === -1) {
    return;
  }
  regeneratingImageIds.value.delete(e.scene.id);
}

function handleRegenerateSceneError(e: any) {
  if (!scenes?.value) {
    return;
  }
  const index = scenes.value.findIndex(
    (scene: ISceneItem) => scene.id === e.scene.id
  );
  if (index === -1) {
    return;
  }
  regeneratingImageIds.value.delete(e.scene.id);
}

async function handleConfirmScenes() {
  if (
    loadingImageIds.value.size > 0 ||
    regeneratingImageIds.value.size > 0 ||
    !scenes?.value ||
    isConfirming.value
  ) {
    return;
  }

  isConfirming.value = true;

  const res = await pictureBookStore.confirmScenes({
    pbId: story?.value?.id ?? "",
    confirmed: scenes.value,
  });

  if (res.code !== 200) {
    uni.showToast({
      title: "场景确认失败，请重新确认",
      icon: "none",
    });
  } else {
    $emit("on-confirmed", res.data);
  }

  nextTick(() => {
    isConfirming.value = false;
  });
}

function getIdByTaskId(taskId: string) {
  return (
    scenes?.value?.find((scene: ISceneItem) => scene.taskId === taskId)?.id ??
    null
  );
}

async function listImageUrls(taskIds: string[]) {
  loadingImageIds.value.clear();
  if (!scenes?.value) {
    return;
  }
  scenes.value.forEach((scene: ISceneItem) => {
    loadingImageIds.value.add(scene.id);
  });
  const images: Map<string, string> = await requestGetImageUrls({
    taskIds,
  });

  images.forEach((url, taskId) => {
    const id = getIdByTaskId(taskId);

    if (id) {
      if (loadingImageIds.value.has(id)) {
        loadingImageIds.value.delete(id);
      }
      scenes.value = scenes.value?.map((scene: ISceneItem) => {
        if (scene.id === id) {
          return { ...scene, url };
        }
        return scene;
      });
    }
  });
}
</script>

<style scoped></style>
