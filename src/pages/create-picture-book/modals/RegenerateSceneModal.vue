<template>
  <view class="w-full bg-white flex flex-col">
    <view
      class="w-full h-[128rpx] px-[32rpx] box-border flex flex-row items-center justify-between border-b border-b-[rgba(230,226,209,0.5)] border-b-[1rpx]"
    >
      <text class="text-[32rpx] text-[#333] font-bold"
        >重新生成场景 No.{{ scene?.index + 1 }}</text
      >
      <view
        class="w-[128rpx] h-[128rpx] flex flex-row items-center justify-end active:opacity-80 transition-all duration-300"
        @click="closeModal"
      >
        <svg-icon
          :src="`/static/${iconThemeVersion}/icon_close.svg`"
          class="w-[48rpx] h-[48rpx]"
          :color="ThemeColors.text.body"
        ></svg-icon>
      </view>
    </view>

    <view class="w-full flex-1 flex flex-row items-start">
      <scroll-view
        class="w-full"
        scroll-y
        :style="{ maxHeight: `calc(80vh - 128rpx)` }"
      >
        <textarea
          class="w-full min-h-full text-[34rpx] text-[#666] px-[24rpx] py-[32rpx] box-border"
          :maxlength="-1"
          auto-height
          placeholder="请输入场景描述"
          v-model="scene.prompt"
        />
      </scroll-view>
    </view>

    <view
      class="w-full px-[32rpx] box-border flex flex-row items-center justify-center shrink-0"
      :style="{
        height: `calc(108rpx + ${safeBottom}px)`,
        paddingBottom: `${safeBottom}px`,
      }"
    >
      <view
        class="h-[88rpx] px-[64rpx] rounded-[24rpx] box-border flex flex-row items-center justify-center gap-[12rpx] active:scale-95 transition-all duration-300"
        :style="{
          backgroundColor: isRegenerating
            ? ThemeColors.text.disabled
            : ThemeColors.primary,
          boxShadow: `0 10px 15px -3px ${
            isRegenerating ? ThemeColors.text.disabled : ThemeColors.primary300
          }`,
        }"
        @click="handleConfirm"
      >
        <CustomLoader
          v-if="isRegenerating"
          color="#fff"
          :size="32"
        ></CustomLoader>
        <svg-icon
          :src="`/static/${iconThemeVersion}/icon_generate.svg`"
          class="w-[32rpx] h-[32rpx]"
          color="#fff"
          v-else
        />
        <text class="text-[32rpx] text-[#fff]">{{
          isRegenerating ? "正在生成" : "重新生成"
        }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { EEmitEvents, type ISceneItem } from "@/types";
import { iconThemeVersion, ThemeColors } from "@/config/config";
import { nextTick, ref } from "vue";
import CustomLoader from "@/components/custom-loader/custom-loader.vue";
import { requestGenerateRoleOrScene } from "@/request";

interface Props {
  scene: ISceneItem;
  ratio: string;
  pictureStyle: string;
}

const props = defineProps<Props>();

const $emit = defineEmits<{
  (e: "on-close"): void;
  (e: "on-confirm", params: { scene: ISceneItem }): void;
}>();

const safeBottom = uni.getWindowInfo().safeAreaInsets?.bottom || 0;

const isRegenerating = ref(false);

function closeModal() {
  $emit("on-close");
}

async function handleConfirm() {
  if (isRegenerating.value) {
    return;
  }
  isRegenerating.value = true;

  uni.$emit(EEmitEvents.START_REGENERATE_SCENE, {
    scene: props.scene,
  });

  const res = await requestGenerateRoleOrScene({
    id: props.scene.id,
    prompt: `a children's book illustation style by ${props.pictureStyle}, ${props.scene.prompt}`,
    ratio: props.ratio,
    imageUrls: props.scene.roleUrls,
  });

  if (res.code === 200) {
    closeModal();

    const newScene = {
      ...props.scene,
      taskId: res.data.taskId,
      url: res.data.url,
    };

    uni.$emit(EEmitEvents.REGENERATE_SCENE_RESPONSE, {
      scene: newScene,
    });

    $emit("on-confirm", {
      scene: newScene,
    });
  } else {
    uni.$emit(EEmitEvents.REGENERATE_SCENE_ERROR, {
      scene: props.scene,
    });
    uni.showToast({
      title: "生成场景失败，请稍后再试",
      icon: "none",
    });
  }
  nextTick(() => {
    isRegenerating.value = false;
  });
}
</script>

<style scoped></style>
