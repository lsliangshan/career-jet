<template>
  <view
    class="bg-white p-2.5 border border-black/5 flex flex-col"
    :class="[defaultTheme.shadow.main, defaultTheme.rounded.main]"
  >
    <view
      class="relative w-full"
      :style="{ height: renderImageHeight(ratio) + 'rpx' }"
    >
      <image
        class="w-full h-full overflow-hidden"
        :class="[defaultTheme.rounded.main]"
        :src="info.url"
        mode="aspectFill"
        @error="handleImageError"
        @load="hadnleImageLoaded"
      />
      <view
        class="absolute left-0 top-0 w-full h-full bg-[#e8e8e8] flex flex-row items-center justify-center"
        v-if="!info.url || imageLoadError"
      >
        <image
          class="w-full h-full z-[9]"
          :src="
            isHorizontalRatio(ratio)
              ? 'https://img.liangqy.com/crawlerjet/picture_book/img/pb_default_horizontal.png'
              : 'https://img.liangqy.com/crawlerjet/picture_book/img/pb_default_vertical.png'
          "
          mode="aspectFill"
          @error="handleImageError"
          @load="hadnleImageLoaded"
        />
      </view>
      <view
        class="absolute left-0 top-0 w-full h-full z-[99] flex flex-row items-center justify-center"
        v-if="isLoading"
      >
        <CustomLoader />
      </view>
    </view>

    <view class="mt-2.5 flex flex-row items-center">
      <text
        class="font-bold text-[32rpx]"
        :style="{
          color: ThemeColors.text.title,
        }"
        v-if="!!title"
        >{{ title }}</text
      >
      <text
        class="leading-[36rpx] text-[28rpx]"
        :style="{
          color: ThemeColors.text.body,
        }"
        v-if="!!content"
        >{{ content }}</text
      >
    </view>

    <view
      class="w-full h-[80rpx] mt-2.5 flex flex-row items-center justify-center"
    >
      <BtnRegenerate
        class="w-[240rpx] h-[80rpx]"
        :disabled="false"
        :isRegenerating="isRegenerating"
        :fontSize="28"
        :iconSize="28"
        @on-regenerate="handleRegenerate"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import CustomLoader from "../custom-loader/custom-loader.vue";
import BtnRegenerate from "../btn-regenerate/btn-regenerate.vue";
import { EEmitEvents } from "@/types";
import { ThemeColors, defaultTheme } from "@/config/config";

interface Props {
  type: "role" | "scene" | "cover";
  info: any;
  isLoading: boolean;
  ratio: string;
  regenerateHandler?: () => Promise<void>;
  title?: string;
  content?: string;
}

const props = defineProps<Props>();

const $emit = defineEmits<{
  (e: "on-regenerate"): void;
  (e: "image-loaded", id: string): void;
}>();

const imageLoadError = ref(false);

const isRegenerating = ref(false);

const isHorizontalRatio = computed(() => {
  return (ratio: string) => {
    return Number(ratio.split(":")[0]) > Number(ratio.split(":")[1]);
  };
});

const renderMinHeight = computed(() => {
  const r = ["16", "9"];
  const width = Number(r[0]);
  const height = Number(r[1]);

  return ((props.type === "cover" ? 702 : 338) * height) / width;
});

const renderMaxHeight = computed(() => {
  const r = ["3", "4"];
  const width = Number(r[0]);
  const height = Number(r[1]);

  return ((props.type === "cover" ? 702 : 338) * height) / width;
});

const renderImageHeight = computed(() => {
  return function (ratio: string) {
    const r = ratio ? ratio.split(":") : ["16", "9"];
    const width = Number(r[0]);
    const height = Number(r[1]);

    const newHeight = ((props.type === "cover" ? 702 : 338) * height) / width;
    return Math.min(
      Math.max(renderMinHeight.value, newHeight),
      renderMaxHeight.value
    );
  };
});

onMounted(() => {
  uni.$on(EEmitEvents.CANCEL_REGENERATE_ROLE, handleCancelRegenerateRole);
  uni.$on(EEmitEvents.REGENERATE_ROLE_RESPONSE, handleRegenerateRoleResponse);
  uni.$on(EEmitEvents.START_REGENERATE_ROLE, handleStartRegenerateRole);
  uni.$on(EEmitEvents.REGENERATE_ROLE_ERROR, handleRegenerateRoleError);

  uni.$on(EEmitEvents.CANCEL_REGENERATE_SCENE, handleCancelRegenerateScene);
  uni.$on(EEmitEvents.REGENERATE_SCENE_RESPONSE, handleRegenerateSceneResponse);
  uni.$on(EEmitEvents.START_REGENERATE_SCENE, handleStartRegenerateScene);
  uni.$on(EEmitEvents.REGENERATE_SCENE_ERROR, handleRegenerateSceneError);

  uni.$on(EEmitEvents.CANCEL_REGENERATE_COVER, handleCancelRegenerateCover);
  uni.$on(EEmitEvents.REGENERATE_COVER_RESPONSE, handleRegenerateCoverResponse);
  uni.$on(EEmitEvents.START_REGENERATE_COVER, handleStartRegenerateCover);
  uni.$on(EEmitEvents.REGENERATE_COVER_ERROR, handleRegenerateCoverError);
});

function handleCancelRegenerateRole(e: any) {
  if (props.info.id !== e.role.id) {
    return;
  }

  if (isRegenerating.value) {
    return;
  }
}

function handleStartRegenerateRole(e: any) {
  if (props.info.id !== e.role.id) {
    return;
  }
  isRegenerating.value = true;
}

function handleRegenerateRoleResponse(e: any) {
  if (props.info.id !== e.role.id) {
    return;
  }

  isRegenerating.value = false;
}

function handleRegenerateRoleError(e: any) {
  if (props.info.id !== e.role.id) {
    return;
  }
  isRegenerating.value = false;
}

function handleCancelRegenerateScene(e: any) {
  if (props.info.id !== e.scene.id) {
    return;
  }

  if (isRegenerating.value) {
    return;
  }
}

function handleStartRegenerateScene(e: any) {
  if (props.info.id !== e.scene.id) {
    return;
  }
  isRegenerating.value = true;
}

function handleRegenerateSceneResponse(e: any) {
  if (props.info.id !== e.scene.id) {
    return;
  }

  isRegenerating.value = false;
}

function handleRegenerateSceneError(e: any) {
  if (props.info.id !== e.scene.id) {
    return;
  }
  isRegenerating.value = false;
}

function handleCancelRegenerateCover(e: any) {
  if (props.info.id !== e.cover.id) {
    return;
  }

  if (isRegenerating.value) {
    return;
  }
}

function handleStartRegenerateCover(e: any) {
  if (props.info.id !== e.cover.id) {
    return;
  }
  isRegenerating.value = true;
}

function handleRegenerateCoverResponse(e: any) {
  if (props.info.id !== e.cover.id) {
    return;
  }

  isRegenerating.value = false;
}

function handleRegenerateCoverError(e: any) {
  if (props.info.id !== e.cover.id) {
    return;
  }
  isRegenerating.value = false;
}

function handleImageError() {
  imageLoadError.value = true;
}

function hadnleImageLoaded() {
  if (props.info.url) {
    $emit("image-loaded", props.info.id);
  }
}

async function handleRegenerate() {
  if (isRegenerating.value) {
    return;
  }

  if (props.type === "role") {
    uni.$emit(EEmitEvents.OPEN_REGENERATE_ROLE_MODAL, {
      role: props.info,
    });
  } else if (props.type === "scene") {
    uni.$emit(EEmitEvents.OPEN_REGENERATE_SCENE_MODAL, {
      scene: props.info,
    });
  } else if (props.type === "cover") {
    uni.$emit(EEmitEvents.OPEN_REGENERATE_COVER_MODAL, {
      cover: props.info,
    });
  }
}
</script>

<style scoped></style>
