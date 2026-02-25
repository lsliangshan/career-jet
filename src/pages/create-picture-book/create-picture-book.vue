<template>
  <page-loading v-if="!pageReady" />
  <template v-else>
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
        <view
          class="h-full flex flex-col items-start justify-center gap-[12rpx]"
        >
          <view
            class="w-full h-[40rpx] flex flex-row items-center justify-start"
          >
            <text
              class="font-bold text-[36rpx]"
              :style="{
                color: ThemeColors.primary,
              }"
              >步骤 {{ currentStepIndex + 1 }} /
              {{ createPictureBookSteps.length }}</text
            >
          </view>
          <view
            class="w-full h-[32rpx] flex flex-row items-center justify-start"
          >
            <text class="text-[30rpx] font-medium text-[#666]">
              {{ createPictureBookSteps[currentStepIndex].desc || " " }}
            </text>
          </view>
        </view>
      </view>
    </view>
    <Layout :hasHeader="false">
      <Configuration
        v-if="currentStepIndex === 0"
        @open-modal="openModal"
        @change-custom-theme="changeCustomTheme"
        @change-custom-story-style="changeCustomStoryStyle"
        @change-custom-picture-style="changeCustomPictureStyle"
        @change-story-length="changeStoryLength"
        @change-role-count="changeRoleCount"
        @change-scene-count="changeSceneCount"
        @on-generated="handleGeneratedStory"
      />
      <ConfirmStory
        v-else-if="currentStepIndex === 1"
        @regenerate-story="handleRegenerateStory"
        @on-confirmed="handleConfirmedStory"
      />
      <ConfirmRoles
        v-else-if="currentStepIndex === 2"
        @on-confirmed="handleConfirmedRoles"
      />
      <ConfirmScenes
        v-else-if="currentStepIndex === 3"
        @on-confirmed="handleConfirmedScenes"
      />
      <ConfirmCover
        v-else-if="currentStepIndex === 4"
        @on-confirmed="handleConfirmedCover"
      />
      <ConfirmAudio
        v-else-if="currentStepIndex === 5"
        @on-confirmed="handleConfirmedAudio"
      />
      <Finished v-else-if="currentStepIndex === 6" />
      <!-- <swiper
      class="w-full h-full"
      :current="currentStepIndex"
      @change="handleChange"
    >
      <swiper-item
        v-for="(step, index) in createPictureBookSteps"
        :key="step.value"
      >
        <Configuration
          v-if="index === 0 && currentStepIndex === index"
          @open-modal="openModal"
          @change-custom-theme="changeCustomTheme"
          @change-custom-story-style="changeCustomStoryStyle"
          @change-custom-picture-style="changeCustomPictureStyle"
          @change-story-length="changeStoryLength"
          @change-role-count="changeRoleCount"
          @change-scene-count="changeSceneCount"
          @on-generated="handleGeneratedStory"
        />
        <ConfirmStory
          v-else-if="index === 1 && currentStepIndex === index"
          @regenerate-story="handleRegenerateStory"
          @on-confirmed="handleConfirmedStory"
        />
        <ConfirmRoles
          v-else-if="index === 2 && currentStepIndex === index"
          @on-confirmed="handleConfirmedRoles"
        />
        <ConfirmScenes
          v-else-if="index === 3 && currentStepIndex === index"
          @on-confirmed="handleConfirmedScenes"
        />
        <ConfirmCover
          v-else-if="index === 4 && currentStepIndex === index"
          @on-confirmed="handleConfirmedCover"
        />
        <ConfirmAudio
          v-else-if="index === 5 && currentStepIndex === index"
          @on-confirmed="handleConfirmedAudio"
        />
        <Finished v-else-if="index === 6 && currentStepIndex === index" />
      </swiper-item>
    </swiper> -->
    </Layout>
  </template>

  <page-container
    :show="modalVisible"
    z-index="999"
    round
    custom-style="background-color: transparent;"
    @leave="closeModal"
    @beforeleave="handleBeforeLeave"
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

    <RegenerateRoleModal
      :role="modalData.data.role"
      :ratio="formData.ratio"
      :pictureStyle="formData.pictureStyle"
      v-else-if="
        modalData?.component === EModalComponent.REGENERATE_ROLE_MODAL &&
        modalData.data.role
      "
      @on-close="closeModal"
      @on-confirm="handleConfirmRegeneratedRole"
    />
    <RegenerateSceneModal
      :scene="modalData.data.scene"
      :ratio="formData.ratio"
      :pictureStyle="formData.pictureStyle"
      v-else-if="
        modalData?.component === EModalComponent.REGENERATE_SCENE_MODAL &&
        modalData.data.scene
      "
      @on-close="closeModal"
      @on-confirm="handleConfirmRegeneratedScene"
    />
    <RegenerateCoverModal
      :cover="modalData.data.cover"
      :ratio="formData.ratio"
      :pictureStyle="formData.pictureStyle"
      v-else-if="
        modalData?.component === EModalComponent.REGENERATE_COVER_MODAL &&
        modalData.data.cover
      "
      @on-close="closeModal"
      @on-confirm="handleConfirmRegeneratedCover"
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
  createPictureBookSteps,
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
import RegenerateRoleModal from "./modals/RegenerateRoleModal.vue";
import RegenerateSceneModal from "./modals/RegenerateSceneModal.vue";
import RegenerateCoverModal from "./modals/RegenerateCoverModal.vue";
import { type ICreatePictureBookFormData, type IStory } from "./types";
import {
  type ICoverItem,
  type IRoleItem,
  type ISceneItem,
  EEmitEvents,
  type IPictureBook,
} from "@/types";
import { onLoad, onShareAppMessage } from "@dcloudio/uni-app";
import { usePictureBookStore } from "@/stores/picture_book";
import { navigateBack } from "@/utils/router";

const pictureBookStore = usePictureBookStore();

const safeTop = uni.getWindowInfo().safeAreaInsets?.top || 0;

const { left: safeTitleWidth } = uni.getMenuButtonBoundingClientRect();

const pageReady = ref(false);

const modalVisible = ref(false);
const modalData = ref<{
  component?: string;
  [key: string]: any;
}>();

const currentStepIndex = ref(6);

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
  id: "",
  title: "",
  content: [],
});

const pbId = ref<string>("");

const pbDetail = ref<IPictureBook | undefined>();
const roles = ref<IRoleItem[]>([]);
const scenes = ref<ISceneItem[]>([]);
const cover = ref<ICoverItem[]>([]);

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
provide("roles", roles);
provide("scenes", scenes);
provide("cover", cover);
provide("pbDetail", pbDetail);

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

onLoad(async (options: any) => {
  if (options.id) {
    pbId.value = options.id;
  }
  if (pbId.value) {
    await initPbDetail();
  }

  if (options.action) {
    const stepIndex = createPictureBookSteps.findIndex(
      (item) => item.value === options.action
    );
    if (stepIndex !== -1) {
      currentStepIndex.value = stepIndex;
    }
  }

  nextTick(() => {
    pageReady.value = true;
  });
});

onMounted(() => {
  initData();

  uni.hideShareMenu({
    // hideShareItems: ["shareAppMessage", "shareTimeline"],
  } as UniApp.HideShareMenuOptions);

  uni.$on(
    EEmitEvents.OPEN_REGENERATE_ROLE_MODAL,
    handleOpenRegenerateRoleModal
  );
  uni.$on(
    EEmitEvents.OPEN_REGENERATE_SCENE_MODAL,
    handleOpenRegenerateSceneModal
  );
  uni.$on(
    EEmitEvents.OPEN_REGENERATE_COVER_MODAL,
    handleOpenRegenerateCoverModal
  );
});

async function initPbDetail() {
  const res = await pictureBookStore.getPictureBookDetail({
    id: pbId.value,
  });

  if (res.code !== 200) {
    uni.showToast({
      title: res.message || "获取绘本详情失败",
      icon: "none",
    });
    navigateBack();
    return;
  }

  pbDetail.value = res.data as IPictureBook;

  story.value = {
    id: pbDetail.value?.id || "",
    title: pbDetail.value?.title || "",
    content: pbDetail.value?.content || "",
  };

  roles.value = pbDetail.value?.roles || [];
  scenes.value = pbDetail.value?.scenes || [];
  cover.value = pbDetail.value?.cover ? [pbDetail.value.cover] : [];
}

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

function handleBack() {
  navigateBack();
}

function closeModal() {
  modalVisible.value = false;
}

function handleBeforeLeave() {
  if (modalData.value?.component === EModalComponent.REGENERATE_ROLE_MODAL) {
    uni.$emit(EEmitEvents.CANCEL_REGENERATE_ROLE, {
      role: modalData.value.data.role,
    });
  }
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

function showRegenerateRoleModal(data: any) {
  modalData.value = {
    component: EModalComponent.REGENERATE_ROLE_MODAL,
    data: {
      role: null,
    },
  };
  nextTick(() => {
    modalData.value = {
      component: EModalComponent.REGENERATE_ROLE_MODAL,
      data: {
        role: data.role,
      },
    };
    modalVisible.value = true;
  });
}

function showRegenerateSceneModal(data: any) {
  // modalData.value = {
  //   component: EModalComponent.REGENERATE_SCENE_MODAL,
  //   data: {
  //     scene: null,
  //   },
  // };
  nextTick(() => {
    modalData.value = {
      component: EModalComponent.REGENERATE_SCENE_MODAL,
      data: {
        scene: data.scene,
      },
    };
    modalVisible.value = true;
  });
}

function showRegenerateCoverModal(data: any) {
  // modalData.value = {
  //   component: EModalComponent.REGENERATE_COVER_MODAL,
  //   data: {
  //     cover: null,
  //   },
  // };
  nextTick(() => {
    modalData.value = {
      component: EModalComponent.REGENERATE_COVER_MODAL,
      data: {
        cover: data.cover,
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
  } else if (params.component === EModalComponent.REGENERATE_ROLE_MODAL) {
    showRegenerateRoleModal(params.data);
  } else if (params.component === EModalComponent.REGENERATE_SCENE_MODAL) {
    showRegenerateSceneModal(params.data);
  } else if (params.component === EModalComponent.REGENERATE_COVER_MODAL) {
    showRegenerateCoverModal(params.data);
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

async function handleGeneratedStory(e: any) {
  story.value = {
    id: e.id,
    title: e.story.title,
    content: e.story.content,
  };
  currentStepIndex.value = 1;
}

function handleRegenerateStory(e: any) {
  story.value = e.story;
  currentStepIndex.value = 1;
}

function handleConfirmedStory(e: any) {
  roles.value = e.roles.map((item: any) => item.data);
  currentStepIndex.value = 2;
}

function handleConfirmedRoles(e: any) {
  scenes.value = e.scenes.map((item: any) => item.data);
  currentStepIndex.value = 3;
}

function handleConfirmedScenes(e: any) {
  cover.value = e.cover.map((item: any) => item.data);
  currentStepIndex.value = 4;
}

function handleConfirmedCover(e: any) {
  pbDetail.value = e;
  currentStepIndex.value = 5;
}

function handleConfirmedAudio(e: any) {
  currentStepIndex.value = 6;
}

function handleOpenRegenerateRoleModal(e: any) {
  openModal({
    component: EModalComponent.REGENERATE_ROLE_MODAL,
    data: {
      role: e.role,
    },
  });
}

function handleOpenRegenerateSceneModal(e: any) {
  openModal({
    component: EModalComponent.REGENERATE_SCENE_MODAL,
    data: {
      scene: e.scene,
    },
  });
}

function handleOpenRegenerateCoverModal(e: any) {
  openModal({
    component: EModalComponent.REGENERATE_COVER_MODAL,
    data: {
      cover: e.cover,
    },
  });
}

function handleConfirmRegeneratedRole(e: any) {
  // 重新生成角色
  roles.value = roles.value.map((item: IRoleItem) => {
    if (item.id === e.role.id) {
      return e.role;
    }
    return item;
  });
}

function handleConfirmRegeneratedScene(e: any) {
  // 重新生成场景
  scenes.value = scenes.value.map((item: ISceneItem) => {
    if (item.id === e.scene.id) {
      return e.scene;
    }
    return item;
  });
}

function handleConfirmRegeneratedCover(e: any) {
  // 重新生成封面
  cover.value = cover.value.map((item: ICoverItem) => {
    if (item.id === e.cover.id) {
      return e.cover;
    }
    return item;
  });
}

onShareAppMessage(() => {
  return {
    title: pbDetail?.value?.title,
    path:
      "/pages/picture-book-detail/picture-book-detail?id=" +
      pbDetail?.value?.id,
    imageUrl: pbDetail?.value?.cover?.url || "",
  };
});
</script>

<style lang="scss">
:deep(.custom-input-placeholder) {
  color: #c8c8c8;
}
</style>
