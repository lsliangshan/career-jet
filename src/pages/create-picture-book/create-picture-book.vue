<template>
  <view
    class="w-full fixed top-0 left-0 z-10 bg-[rgba(248,248,245,0.5)] backdrop-blur-md border-none flex flex-col items-start"
    :style="{
      height: `calc(80rpx +  ${safeTop}px + 108rpx)`,
      paddingTop: `${safeTop}px`,
    }"
  >
    <view
      class="h-[80rpx] flex flex-row items-center justify-center"
      :style="{ width: `calc(${safeTitleWidth}px)` }"
    >
      <view
        class="w-[80rpx] h-[80rpx] shrink-0 flex flex-row items-center justify-center"
        @click="handleBack"
      >
        <svg-icon
          class="w-[32rpx] h-[32rpx]"
          :src="`/static/${iconThemeVersion}/icon_back.svg`"
          color="#000"
        />
      </view>
      <view
        class="z-[999] h-[80rpx] pr-[24rpx] box-border flex flex-row items-center"
        :style="{ width: `calc(${safeTitleWidth}px - 80rpx)` }"
      >
        <view
          class="w-full h-full box-border flex flex-row items-center justify-center gap-[8rpx]"
        >
          <text
            class="text-[36rpx] font-bold text-[#000] line-clamp-1 overflow-hidden text-ellipsis break-all"
          >
            {{ createPictureBookSteps[currentStepIndex].label }}
          </text>
        </view>
      </view>
    </view>

    <view
      class="w-full h-[108rpx] flex flex-row items-center justify-start px-[32rpx] box-border"
    >
      <view class="h-full flex flex-col items-start justify-center gap-[12rpx]">
        <view class="w-full h-[40rpx] flex flex-row items-center justify-start">
          <text
            class="font-bold text-[36rpx]"
            :style="{
              color: ThemeColors.primary,
            }"
            >步骤 {{ currentStepIndex + 1 }} /
            {{ createPictureBookSteps.length }}</text
          >
        </view>
        <view class="w-full h-[32rpx] flex flex-row items-center justify-start">
          <text class="text-[30rpx] font-medium text-[#666]">
            {{ createPictureBookSteps[currentStepIndex].desc || " " }}
          </text>
        </view>
      </view>
    </view>
  </view>
  <Layout :hasHeader="false">
    <swiper
      class="w-full h-full"
      :current="currentStepIndex"
      @change="handleChange"
    >
      <swiper-item
        v-for="(step, index) in createPictureBookSteps"
        :key="step.value"
      >
        <Configuration
          v-if="index === 0"
          @open-modal="openModal"
          @change-custom-theme="changeCustomTheme"
          @change-custom-story-style="changeCustomStoryStyle"
          @change-custom-picture-style="changeCustomPictureStyle"
          @change-story-length="changeStoryLength"
          @change-role-count="changeRoleCount"
          @change-scene-count="changeSceneCount"
          @generate-story="generateStory"
        />
        <ConfirmStory
          v-else-if="index === 1"
          @regenerate-story="handleRegenerateStory"
        />
        <ConfirmRoles v-else-if="index === 2" />
        <ConfirmScenes v-else-if="index === 3" />
        <ConfirmCover v-else-if="index === 4" />
        <ConfirmAudio v-else-if="index === 5" />
        <Finished v-else-if="index === 6" />
      </swiper-item>
    </swiper>
  </Layout>

  <page-container
    :show="modalVisible"
    z-index="999"
    round
    custom-style="background-color: transparent;"
    @leave="closeModal"
  >
    <ChooseThemeModal
      :active-index="modalData?.data?.selectedThemeIndexes"
      v-if="modalData?.component === EModalComponent.CHOOSE_THEME_MODAL"
      @on-close="closeModal"
      @on-confirm="handleThemeChange"
    />
    <ChooseRatioModal
      :active-index="modalData?.data?.selectedRatioIndex"
      v-else-if="modalData?.component === EModalComponent.CHOOSE_RATIO_MODAL"
      @on-close="closeModal"
      @on-confirm="handleRatioChange"
    />
    <ChooseStyleModal
      :active-index="modalData?.data?.selectedStyleIndex"
      :type="modalData?.data?.type"
      v-else-if="
        modalData?.component === EModalComponent.CHOOSE_STORY_STYLE_MODAL ||
        modalData?.component === EModalComponent.CHOOSE_PICTURE_STYLE_MODAL
      "
      @on-close="closeModal"
      @on-confirm="handleStyleChange"
    />
    <ChooseLanguageModal
      :active-index="modalData?.data?.selectedLanguageIndex"
      v-else-if="modalData?.component === EModalComponent.CHOOSE_LANGUAGE_MODAL"
      @on-close="closeModal"
      @on-confirm="handleLanguageChange"
    />
  </page-container>
</template>

<script setup lang="ts">
import Layout from "@/components/layout/layout.vue";
import {
  authors,
  iconThemeVersion,
  languages,
  moralities,
  ratios,
  ThemeColors,
} from "@/config/config";
import { computed, nextTick, onMounted, provide, ref } from "vue";
import Configuration from "./views/configuration/configuration.vue";
import ConfirmStory from "./views/confirm-story/confirm-story.vue";
import ConfirmRoles from "./views/confirm-roles/confirm-roles.vue";
import ConfirmScenes from "./views/confirm-scenes/confirm-scenes.vue";
import ConfirmCover from "./views/confirm-cover/confirm-cover.vue";
import ConfirmAudio from "./views/confirm-audio/confirm-audio.vue";
import Finished from "./views/finished/finished.vue";
import ChooseThemeModal from "./modals/ChooseThemeModal.vue";
import { EModalComponent } from "./modals/types";
import ChooseRatioModal from "./modals/ChooseRatioModal.vue";
import ChooseStyleModal from "./modals/ChooseStyleModal.vue";
import ChooseLanguageModal from "./modals/ChooseLanguageModal.vue";

import { usePictureBookStore } from "@/stores/picture_book";
import type { ICreatePictureBookFormData, IStory } from "./types";

const pictureBookStore = usePictureBookStore();

const safeBottom = uni.getWindowInfo().safeAreaInsets?.bottom || 0;
const safeTop = uni.getWindowInfo().safeAreaInsets?.top || 0;

const { left: safeTitleWidth } = uni.getMenuButtonBoundingClientRect();

const modalVisible = ref(false);
const modalData = ref<{
  component?: string;
  [key: string]: any;
}>();

const createPictureBookSteps = [
  {
    label: "参数设置",
    value: "config",
    desc: "在这里，你可以设置绘本的各种参数。",
  },
  {
    label: "确认绘本故事",
    value: "confirm-story",
    desc: "确认绘本故事，确保故事内容符合你的预期。",
  },
  {
    label: "确认绘本角色",
    value: "confirm-roles",
    desc: "这些是故事里的主角们，满意吗？",
  },
  {
    label: "确认绘本场景",
    value: "confirm-scenes",
    desc: "这是绘本里的奇妙世界，满意吗？",
  },
  {
    label: "确认绘本封面",
    value: "confirm-cover",
    desc: "为你的故事选一个最漂亮的封面吧！",
  },
  {
    label: "确认绘本音频",
    value: "confirm-audio",
    desc: "为你的故事挑选一个好听的声音吧！",
  },
  {
    label: "创作完成",
    value: "finished",
    desc: "绘本创作完成，你可以分享给你的朋友了！",
  },
];

const currentStepIndex = ref(1);

const formData = ref<ICreatePictureBookFormData>({
  theme: "诚实与正直",
  storyStyle: "李欧·李奥尼",
  pictureStyle: "李欧·李奥尼",
  length: 500,
  language: "中文",
  roleCount: 0,
  sceneCount: 0,
  ratio: "9:16",
});

const story = ref<IStory>({
  id: "83ad5cb679c510fe1f0a17a6",
  title: "凯凯和闪闪的小石头",
  content: [
    "凯凯在森林里玩耍，找到一颗闪着光的蓝色小石头。",
    "闪闪看到了，说：‘真好看！这是我的。’ 凯凯犹豫了一下。",
    "晚上，凯凯看着小石头，总觉得心里有什么东西硌着，不太舒服。",
    "第二天，凯凯找到了闪闪，把石头递过去：‘我想它属于发现它的地方。’",
  ],
});

const selectedThemeIndexes = ref<number[]>([0, 0]);
const selectedStoryStyleIndex = ref<number>(0);
const selectedPictureStyleIndex = ref<number>(0);
const selectedLanguageIndex = ref<number>(0);
const selectedRatioIndex = ref<number>(0);

provide("formData", formData);
provide("selectedThemeIndexes", selectedThemeIndexes);
provide("selectedStoryStyleIndex", selectedStoryStyleIndex);
provide("selectedPictureStyleIndex", selectedPictureStyleIndex);
provide("selectedLanguageIndex", selectedLanguageIndex);
provide("selectedRatioIndex", selectedRatioIndex);
provide("story", story);

const renderStoryStyles = computed(() => {
  return [
    ...authors,
    {
      name: "自定义",
      en_name: "Custom",
      avatar:
        "https://img.liangqy.com/crawlerjet/picture_book/img/author/custom.jpg",
    },
  ];
});

const renderPictureStyles = computed(() => {
  return [
    ...authors,
    {
      name: "自定义",
      en_name: "Custom",
      avatar:
        "https://img.liangqy.com/crawlerjet/picture_book/img/author/custom.jpg",
    },
  ];
});

onMounted(() => {
  initData();
});

function initData() {
  selectedLanguageIndex.value = languages.findIndex(
    (item) => item.name === formData.value.language
  );
  if (selectedLanguageIndex.value === -1) {
    selectedLanguageIndex.value = 0;
  }

  selectedStoryStyleIndex.value = renderStoryStyles.value.findIndex(
    (item) => item.name === formData.value.storyStyle
  );
  if (selectedStoryStyleIndex.value === -1) {
    selectedStoryStyleIndex.value = 0;
  }

  selectedPictureStyleIndex.value = renderPictureStyles.value.findIndex(
    (item) => item.name === formData.value.pictureStyle
  );
  if (selectedPictureStyleIndex.value === -1) {
    selectedPictureStyleIndex.value = 0;
  }

  selectedRatioIndex.value = ratios.findIndex(
    (item) => item === formData.value.ratio
  );
  if (selectedRatioIndex.value === -1) {
    selectedRatioIndex.value = 8;
  }
}

function handleChange(e: any) {
  console.log(">>>> handleChange: ", e);
  currentStepIndex.value = e.detail.current;
}

function handleBack() {
  uni.navigateBack({
    fail: () => {
      uni.reLaunch({
        url: "/pages/index/index",
      });
    },
  });
}

function closeModal() {
  modalVisible.value = false;
}

function showSelectThemeModal() {
  modalData.value = {
    component: EModalComponent.CHOOSE_THEME_MODAL,
    data: {
      selectedThemeIndexes: [0, 0],
    },
  };
  nextTick(() => {
    modalData.value = {
      component: EModalComponent.CHOOSE_THEME_MODAL,
      data: {
        selectedThemeIndexes: selectedThemeIndexes.value,
      },
    };
    modalVisible.value = true;
  });
}

function showSelectStoryStyleModal() {
  modalData.value = {
    component: EModalComponent.CHOOSE_STORY_STYLE_MODAL,
    data: {
      selectedStyleIndex: 0,
      type: "storyStyle",
    },
  };
  nextTick(() => {
    modalData.value = {
      component: EModalComponent.CHOOSE_STORY_STYLE_MODAL,
      data: {
        selectedStyleIndex: selectedStoryStyleIndex.value,
        type: "storyStyle",
      },
    };
    modalVisible.value = true;
  });
}

function showSelectPictureStyleModal() {
  modalData.value = {
    component: EModalComponent.CHOOSE_PICTURE_STYLE_MODAL,
    data: {
      selectedStyleIndex: 0,
      type: "pictureStyle",
    },
  };
  nextTick(() => {
    modalData.value = {
      component: EModalComponent.CHOOSE_PICTURE_STYLE_MODAL,
      data: {
        selectedStyleIndex: selectedPictureStyleIndex.value,
        type: "pictureStyle",
      },
    };
    modalVisible.value = true;
  });
}

function showSelectLanguageModal() {
  modalData.value = {
    component: EModalComponent.CHOOSE_LANGUAGE_MODAL,
    data: {
      selectedLanguageIndex: -1,
    },
  };
  nextTick(() => {
    modalData.value = {
      component: EModalComponent.CHOOSE_LANGUAGE_MODAL,
      data: {
        selectedLanguageIndex: selectedLanguageIndex.value,
      },
    };
    modalVisible.value = true;
  });
}

function showSelectRatioModal() {
  modalData.value = {
    component: EModalComponent.CHOOSE_RATIO_MODAL,
    data: {
      selectedRatioIndex: -1,
    },
  };
  nextTick(() => {
    modalData.value = {
      component: EModalComponent.CHOOSE_RATIO_MODAL,
      data: {
        selectedRatioIndex: selectedRatioIndex.value,
      },
    };
    modalVisible.value = true;
  });
}

function openModal(params: { component: string; data: any }) {
  if (params.component === EModalComponent.CHOOSE_THEME_MODAL) {
    showSelectThemeModal();
  } else if (params.component === EModalComponent.CHOOSE_STORY_STYLE_MODAL) {
    showSelectStoryStyleModal();
  } else if (params.component === EModalComponent.CHOOSE_PICTURE_STYLE_MODAL) {
    showSelectPictureStyleModal();
  } else if (params.component === EModalComponent.CHOOSE_LANGUAGE_MODAL) {
    showSelectLanguageModal();
  } else if (params.component === EModalComponent.CHOOSE_RATIO_MODAL) {
    showSelectRatioModal();
  }
}

function handleStyleChange(e: any) {
  if (e.type === "storyStyle") {
    selectedStoryStyleIndex.value = e.index;
    formData.value.storyStyle = e.value;
  } else if (e.type === "pictureStyle") {
    selectedPictureStyleIndex.value = e.index;
    formData.value.pictureStyle = e.value;
  }
  closeModal();
}

function handleThemeChange(e: any) {
  selectedThemeIndexes.value = [...e.index];
  formData.value.theme = e.value;
  closeModal();
}

function handleLanguageChange(e: any) {
  selectedLanguageIndex.value = e.index;
  formData.value.language = e.value;
  closeModal();
}

function handleRatioChange(e: any) {
  selectedRatioIndex.value = e.index;
  formData.value.ratio = e.value;
  closeModal();
}

function changeCustomTheme(e: any) {
  if (selectedThemeIndexes.value[0] === moralities.length) {
    formData.value.theme = e;
  }
}

function changeCustomStoryStyle(e: any) {
  if (selectedStoryStyleIndex.value === renderStoryStyles.value.length - 1) {
    formData.value.storyStyle = e;
  }
}

function changeCustomPictureStyle(e: any) {
  if (
    selectedPictureStyleIndex.value ===
    renderPictureStyles.value.length - 1
  ) {
    formData.value.pictureStyle = e;
  }
}

function changeStoryLength(value: number) {
  formData.value.length = value;
}

function changeRoleCount(value: number) {
  formData.value.roleCount = value;
}

function changeSceneCount(value: number) {
  formData.value.sceneCount = value;
}

async function generateStory() {
  const res = await pictureBookStore.generateStory(formData.value);
  console.log(">>> generateStory res: ", res);
  if (res.code === 200 && res.data) {
    story.value = {
      id: res.data.id,
      title: res.data.story.title,
      content: res.data.story.content,
    };
    currentStepIndex.value = 1;
    uni.showToast({
      title: "生成故事成功",
      icon: "success",
    });
  } else {
    uni.showToast({
      title: "生成故事失败，请稍后再试",
      icon: "none",
    });
    currentStepIndex.value = 0;
  }
}

function handleRegenerateStory(e: any) {
  story.value = e.story;
  currentStepIndex.value = 1;
}
</script>

<style lang="scss">
:deep(.custom-input-placeholder) {
  color: #c8c8c8;
}
</style>
