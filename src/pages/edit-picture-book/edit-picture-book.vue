<template>
  <view class="w-full h-full flex flex-row items-center justify-center">
    <CustomHeader title="编辑绘本" show-back title-align="start" />

    <Layout hasHeader>
      <PageLoading v-if="!pageReady" />
      <scroll-view
        type="custom"
        scroll-y
        class="w-full h-full overflow-y-auto transition-all duration-300"
        :class="{
          'opacity-0 pointer-events-none': !pageVisible,
          'opacity-100 pointer-events-auto': pageVisible,
        }"
        v-else
      >
        <view
          class="sticky left-0 top-0 w-full bg-[#fff] z-[999] flex flex-col"
        >
          <view
            class="relative w-[80vw] h-[128rpx] mx-auto flex flex-row items-center justify-between"
          >
            <view
              class="absolute left-[10rpx] top-[60rpx] h-[8rpx] bg-[#f0f0f0]"
              :style="{ width: `calc(100% - 20rpx)` }"
            ></view>
            <view
              class="w-[88rpx] h-[88rpx] z-[9] bg-[#f0f0f0] rounded-[50%] p-[20rpx] box-border border border-[6rpx] flex flex-row items-center justify-center"
              v-for="(step, index) in allSteps"
              :key="step.id"
              :style="{
                borderColor:
                  allSteps[currentStepIndex].id === step.id
                    ? 'rgba(43,140,238,1)'
                    : 'white',
              }"
            >
              <svg-icon
                :src="step.icon"
                class="w-full h-full"
                :color="
                  currentStepIndex > index ? ThemeColors.primary : '#c8c8c8'
                "
              />
            </view>
          </view>

          <view
            class="w-full h-[88rpx] flex flex-row items-center justify-center"
          >
            <view
              class="h-[64rpx] px-[24rpx] box-border border border-[1rpx] border-[rgba(43,140,238,0.2)] bg-[rgba(43,140,238,0.1)] rounded-[32rpx] flex flex-row items-center justify-between gap-[12rpx]"
            >
              <text class="text-[28rpx] font-medium text-[rgba(43,140,238,1)]"
                >步骤 {{ currentStepIndex + 1 }}:
              </text>
              <text
                class="text-[28rpx] font-medium text-[rgba(43,140,238,1)]"
                >{{ allSteps[currentStepIndex].title }}</text
              >
            </view>
          </view>
        </view>

        <view
          class="page-bg w-full p-[24rpx] box-border"
          :style="{
            minHeight: `calc(100vh - 128rpx - 128rpx)`,
          }"
        >
          <view class="w-full h-full flex flex-row flex-wrap gap-[24rpx]">
            <view
              class="relative w-[339rpx] border border-[1rpx] border-[#f0f0f0] rounded-[24rpx] overflow-hidden flex flex-col"
              :style="{
                minHeight: `${
                  currentStepIndex === EStepIndex.SCENES
                    ? renderImageHeight + 144
                    : renderImageHeight + 64
                }rpx`,
              }"
              v-for="(item, index) in renderList"
              :key="item.data.id"
            >
              <view
                class="w-full h-full bg-white flex flex-row items-start justify-center"
                v-if="imageUrls.has(item.data.id)"
                :style="{ height: `${renderImageHeight}rpx` }"
                @click="previewImage([imageUrls.get(item.data.id) || ''])"
              >
                <image
                  :src="imageUrls.get(item.data.id)"
                  class="w-full"
                  :style="{ height: `${renderImageHeight}rpx` }"
                  mode="aspectFit"
                ></image>
              </view>

              <view
                class="absolute left-0 bottom-0 z-[9] bg-[#d8d8d8] w-full flex flex-col"
                v-if="currentStepIndex === EStepIndex.ROLES"
              >
                <view
                  class="w-full h-[64rpx] px-[12rpx] py-[12rpx] box-border flex flex-row items-center"
                >
                  <text
                    class="text-[28rpx] font-bold text-[#666] line-clamp-1 overflow-hidden text-ellipsis break-all"
                    >{{ item.data.name }}</text
                  >
                </view>
              </view>

              <tempalte v-else-if="currentStepIndex === EStepIndex.SCENES">
                <view
                  class="z-[9] bg-[rgba(0,0,0,0.05)] w-full flex-1 flex flex-col"
                >
                  <view
                    class="w-full min-h-[64rpx] px-[12rpx] py-[12rpx] box-border flex flex-row items-center"
                  >
                    <text class="text-[28rpx] text-[#666]">{{
                      item.data.content
                    }}</text>
                  </view>
                </view>

                <view
                  class="absolute left-[20rpx] top-[20rpx] z-[99] h-[56rpx] bg-[#f0f0f0] rounded-[12rpx] px-[12rpx] box-border flex flex-row items-center justify-center transition-all duration-300"
                >
                  <text class="text-[28rpx] text-[#666]"
                    >场景: {{ item.data.index }}</text
                  >
                </view>
              </tempalte>

              <view
                class="absolute right-0 top-0 z-[99] w-[88rpx] h-[88rpx] opacity-0 flex flex-row items-center justify-center transition-all duration-300"
                :class="[
                  loadingImageIds.has(item.data.id)
                    ? 'opacity-0 pointer-events-none'
                    : 'opacity-100 active:scale-95 pointer-events-auto',
                ]"
                @click="openRegenerateModal(item.data)"
              >
                <view
                  class="w-[56rpx] h-[56rpx] rounded-[12rpx] bg-[#fff] flex flex-row items-center justify-center active:scale-95 transition-all duration-300"
                  :style="{
                    backgroundColor: regeneratingIds.has(item.data.id)
                      ? '#ccc'
                      : ThemeColors.primary,
                  }"
                >
                  <svg-icon
                    :src="`/static/${iconThemeVersion}/icon_regenerate.svg`"
                    :class="[
                      regeneratingIds.has(item.data.id) ? 'animate-spin' : '',
                    ]"
                    class="w-[24rpx] h-[24rpx]"
                    color="#fff"
                  />
                </view>
              </view>
              <view
                class="absolute left-0 top-0 w-full h-full bg-white flex flex-row items-center justify-center"
                v-if="loadingImageIds.has(item.data.id)"
              >
                <CustomLoading
                  :size="40"
                  :color="ThemeColors.primary"
                  class="mb-[60rpx]"
                />
              </view>
            </view>
          </view>
        </view>

        <view class="w-[40rpx] h-[40rpx]"> </view>

        <view
          class="sticky bottom-0 left-0 z-[999] w-full bg-[#fff] flex flex-col justify-start"
          :style="{
            height: `calc(128rpx + ${safeBottom}px)`,
          }"
        >
          <view
            class="w-full h-[128rpx] px-[64rpx] box-border flex flex-row items-center justify-center"
          >
            <view
              class="w-full h-[100rpx] shadow-[0_0_16rpx_2rpx_rgba(0,0,0,0.15)] bg-[rgb(43,140,238)] active:scale-95 rounded-[50rpx] flex flex-row items-center justify-center transition-all duration-300"
              @click="handleNextStep"
            >
              <text class="text-[32rpx] font-medium text-[#fff]">{{
                allSteps[currentStepIndex].title
              }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </Layout>

    <page-container
      :show="modalVisible"
      z-index="999"
      :loading="isLoading"
      round
      @leave="closeModal"
    >
      <RegenerateModal
        :info="modalData?.data?.info"
        :type="modalData?.data?.type"
        :ratio="pbDetail?.config?.ratio || '16:9'"
        :pictureStyle="pbDetail?.config?.pictureStyle || ''"
        v-if="modalData?.component === EModalComponent.REGENERATE_MODAL"
        @on-close="closeModal"
        @on-start-regenerate="handleStartRegenerate"
        @on-regenerate="handleRegenerate"
      />
    </page-container>
  </view>
</template>

<script setup lang="ts">
import CustomHeader from "@/components/custom-header/custom-header.vue";
import Layout from "@/components/layout/layout.vue";
import { EEditPictureBookStep } from "./type";
import { computed, nextTick, onMounted, provide, ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { EConfirmAction, type IPictureBook } from "@/types";
import { usePictureBookStore } from "@/stores/picture_book";
import { iconThemeVersion, ThemeColors } from "@/config/config";
import PageLoading from "@/components/page-loading/page-loading.vue";
import { previewImage } from "@/utils";
import { requestCustomUrl, requestGetImageUrls } from "@/request";
import CustomLoading from "@/components/custom-loader/custom-loader.vue";
import RegenerateModal from "./modals/RegenerateModal.vue";
import { EModalComponent, EStepIndex } from "./modals/types";

const safeBottom = uni.getWindowInfo().safeAreaInsets?.bottom || 0;

const pictureBookStore = usePictureBookStore();

// 当前选中的步骤索引
const currentStepIndex = ref<EStepIndex>(EStepIndex.ROLES);

const imageUrls = ref<Map<string, string>>(new Map());

// 正在加载图片的id列表
const loadingImageIds = ref<Set<string>>(new Set());

const allSteps = [
  {
    id: EEditPictureBookStep.ROLES,
    title: "确认角色",
    icon: `/static/${iconThemeVersion}/icon_role_confirm.svg`,
  },
  {
    id: EEditPictureBookStep.SCENES,
    title: "确认场景",
    icon: `/static/${iconThemeVersion}/icon_scene_confirm.svg`,
  },
  {
    id: EEditPictureBookStep.COVER,
    title: "确认封面",
    icon: `/static/${iconThemeVersion}/icon_cover_confirm.svg`,
  },
  {
    id: EEditPictureBookStep.AUDIO,
    title: "确认音频",
    icon: `/static/${iconThemeVersion}/icon_audio_confirm.svg`,
  },
  {
    id: EEditPictureBookStep.FINISHED,
    title: "完成",
    icon: `/static/${iconThemeVersion}/icon_checked.svg`,
  },
];

const id = ref<string>("");

const pbDetail = ref<IPictureBook | undefined>();

const stepData = ref<any>({});

const pageReady = ref(false);
const pageVisible = ref(false);

const isLoading = ref(false);
const regeneratingIds = ref<Set<string>>(new Set());

const isConfirming = ref(false);

const modalVisible = ref(false);
const modalData = ref<{
  component?: string;
  [key: string]: any;
}>();

const renderImageHeight = computed(() => {
  const ratio = pbDetail.value?.config?.ratio
    ? pbDetail.value?.config?.ratio?.split(":")
    : ["16", "9"];
  const width = Number(ratio[0]);
  const height = Number(ratio[1]);
  return (339 * height) / width;
});

// const renderList = computed(() => {
//   if (currentStepIndex.value === EStepIndex.ROLES) {
//     return stepData.value.roles;
//   } else if (currentStepIndex.value === EStepIndex.SCENES) {
//     return stepData.value.scenes;
//   } else if (currentStepIndex.value === EStepIndex.COVER) {
//     return stepData.value.cover;
//   } else {
//     return [];
//   }
// });
const renderList = ref<any[]>([]);

provide("pbDetail", pbDetail);

onLoad((options: any) => {
  id.value = options.id;
});

onMounted(async () => {
  await initData();
});

async function initData() {
  await Promise.all([initPbDetail(), editPictureBook()]);
  // if (renderList.value?.length > 0) {
  //   listImageUrls(renderList.value.map((item: any) => item.data.taskId));
  // }
  nextTick(() => {
    pageReady.value = true;
    const t = setTimeout(() => {
      clearTimeout(t);
      pageVisible.value = true;
    }, 50);
  });
}

function getIdByTaskId(taskId: string) {
  return renderList.value.find((item: any) => item.data.taskId === taskId)?.data
    .id;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function listImageUrls(taskIds: string[]) {
  loadingImageIds.value.clear();
  renderList.value.forEach((item: any) => {
    loadingImageIds.value.add(item.data.id);
  });
  const images: Map<string, string> = await requestGetImageUrls({
    taskIds,
  });

  // const images: Map<string, string> = new Map([
  //   [
  //     "15a75bcb819f76f89d49a6ebef5fd8ef",
  //     "https://tempfile.aiquickdraw.com/workers/nano/image_1769149174431_t56b35.png",
  //   ],
  //   [
  //     "07d3829115181d92db2cd218f3e3ad26",
  //     "https://tempfile.aiquickdraw.com/workers/nano/image_1769149174624_cqiewh.png",
  //   ],
  // ]);

  // await sleep(3000);
  images.forEach((url, taskId) => {
    const id = getIdByTaskId(taskId);

    if (id) {
      if (loadingImageIds.value.has(id)) {
        loadingImageIds.value.delete(id);
      }
      imageUrls.value.set(id, url);

      if (currentStepIndex.value === EStepIndex.ROLES) {
        stepData.value.roles = stepData.value.roles.map((item: any) => {
          if (item.data.taskId === taskId) {
            item.data.url = url;
          }
          return item;
        });
      } else if (currentStepIndex.value === EStepIndex.SCENES) {
        stepData.value.scenes = stepData.value.scenes.map((item: any) => {
          if (item.data.taskId === taskId) {
            item.data.url = url;
          }
          return item;
        });
      } else if (currentStepIndex.value === EStepIndex.COVER) {
        stepData.value.cover = stepData.value.cover.map((item: any) => {
          if (item.data.id === id) {
            item.data = {
              ...item.data,
              taskId: taskId,
              url: url,
              recordId: taskId,
            };
          }
          return item;
        });
      }
    }
  });
}

async function editPictureBook() {
  const res = await pictureBookStore.editPictureBook({
    pbId: id.value,
  });

  // const res = {
  //   code: 200,
  //   message: "成功",
  //   action: "confirm-scenes",
  //   data: {
  //     scenes: [
  //       {
  //         code: 200,
  //         msg: "成功",
  //         data: {
  //           taskId: "7167b15f849e3df58730eb63cae2c482",
  //           recordId: "7167b15f849e3df58730eb63cae2c482",
  //           id: "s1",
  //           index: 1,
  //           content:
  //             "小栗色兔子该上床睡觉了，可是他紧紧地抓住 大栗色兔子的耳朵不放。\n\n他要大兔子好好听他说。\n“猜猜我有多爱你？”他说。\n大兔子说：“喔，这我可猜不出来。”",
  //           prompt:
  //             "夜晚的卧室，小兔子紧紧抓着大兔子的长耳朵，仰头望着大兔子，表情期待。大兔子低头温柔地看着小兔子，背景有温暖的床头灯。卡通绘本风格，柔和色调。",
  //           prompt_en:
  //             "A nighttime bedroom scene where the little rabbit tightly holds the big rabbit's long ears, looking up expectantly. The big rabbit gazes down gently, with warm bedside lamp lighting. Cartoon picture book style with soft color palette.",
  //           roleIds: ["r1", "r2"],
  //           roleUrls: [
  //             "https://tempfile.aiquickdraw.com/workers/nano/image_1769414799383_yuzdcn.png",
  //             "https://tempfile.aiquickdraw.com/workers/nano/image_1769414790325_a8x6wu.png",
  //           ],
  //         },
  //       },
  //       {
  //         code: 200,
  //         msg: "成功",
  //         data: {
  //           taskId: "e04de75d3fce76f944c556bb33208f23",
  //           recordId: "e04de75d3fce76f944c556bb33208f23",
  //           id: "s2",
  //           index: 2,
  //           content:
  //             "小兔子说：“这么多。”他把手臂张开，开的不能再开。\n\n大兔子的手臂要长得多，“我爱你有这么多。”他说。",
  //           prompt:
  //             "小兔子站在草地上尽力张开短短的手臂，表情认真。大兔子蹲下身张开更长的双臂，形成温暖拥抱的姿势。阳光透过树叶斑驳洒落。水彩风格。",
  //           prompt_en:
  //             "The little rabbit stands on grass stretching his short arms as wide as possible with a serious expression. The big rabbit crouches down with even wider arm span, forming a warm hugging gesture. Dappled sunlight filters through leaves. Watercolor style.",
  //           roleIds: ["r1", "r2"],
  //           roleUrls: [
  //             "https://tempfile.aiquickdraw.com/workers/nano/image_1769414799383_yuzdcn.png",
  //             "https://tempfile.aiquickdraw.com/workers/nano/image_1769414790325_a8x6wu.png",
  //           ],
  //         },
  //       },
  //     ],
  //   },
  // };

  if (res.code === 200) {
    let imageTaskIds: string[] = [];
    if (res.action === EConfirmAction.CONFIRM_ROLES) {
      currentStepIndex.value = EStepIndex.ROLES;
      renderList.value = res.data.roles || [];
      imageTaskIds = res.data.roles.map((item: any) => item.data.taskId);
    } else if (res.action === EConfirmAction.CONFIRM_SCENES) {
      renderList.value = res.data.scenes || [];
      currentStepIndex.value = EStepIndex.SCENES;
      imageTaskIds = res.data.scenes.map((item: any) => item.data.taskId);
    } else if (res.action === EConfirmAction.CONFIRM_COVER) {
      renderList.value = res.data.cover;
      currentStepIndex.value = EStepIndex.COVER;
      imageTaskIds = res.data.cover.map((item: any) => item.data.taskId);
    } else if (res.action === EConfirmAction.CONFIRM_AUDIO) {
      renderList.value = [];
      currentStepIndex.value = EStepIndex.AUDIO;
    }

    if (imageTaskIds.length > 0) {
      listImageUrls(imageTaskIds);
    }
    stepData.value = res.data;
  }
}

function handleStartRegenerate(params: {
  type: "role" | "scene" | "cover";
  id: string;
}) {
  if (!regeneratingIds.value.has(params.id)) {
    regeneratingIds.value.add(params.id);
  }
}

function handleRegenerate(params: {
  type: "role" | "scene" | "cover";
  id: string;
  data: any;
}) {
  if (regeneratingIds.value.has(params.id)) {
    regeneratingIds.value.delete(params.id);
  }

  if (params.type === "role") {
    imageUrls.value.set(params.data.id, params.data.url);
    loadingImageIds.value.delete(params.data.id);

    stepData.value.roles = stepData.value.roles.map((item: any) => {
      if (item.data.id === params.data.id) {
        item.data = {
          ...item.data,
          taskId: params.data.taskId,
          url: params.data.url,
        };
      }
      return item;
    });

    renderList.value = stepData.value.roles;
  } else if (params.type === "scene") {
    imageUrls.value.set(params.data.id, params.data.url);
    loadingImageIds.value.delete(params.data.id);

    stepData.value.scenes = stepData.value.scenes.map((item: any) => {
      if (item.data.id === params.data.id) {
        item.data = {
          ...item.data,
          taskId: params.data.taskId,
          url: params.data.url,
        };
      }
      return item;
    });

    renderList.value = stepData.value.scenes;
  } else if (params.type === "cover") {
    imageUrls.value.set(params.data.id, params.data.url);
    loadingImageIds.value.delete(params.data.id);

    stepData.value.cover = stepData.value.cover.map((item: any) => {
      if (item.data.id === params.data.id) {
        item.data = {
          ...item.data,
          taskId: params.data.taskId,
          url: params.data.url,
        };
      }
      return item;
    });

    renderList.value = stepData.value.cover;
  }
}

function resetData() {
  isConfirming.value = false;
  regeneratingIds.value.clear();
  imageUrls.value.clear();
  loadingImageIds.value.clear();
}

async function handleConfirmRoles() {
  const res = await pictureBookStore.confirmRoles({
    pbId: id.value,
    confirmed: stepData.value.roles,
  });

  resetData();

  if (res.code === 409) {
    uni.showToast({
      title: "确认失败，请稍后再试",
      icon: "none",
    });

    throw new Error("确认失败，请稍后再试");
  }
  if (res.code !== 200) {
    uni.showToast({
      title: "确认失败，请重新确认",
      icon: "none",
    });
    throw new Error("确认失败，请重新确认");
  }
  stepData.value = res.data;
  currentStepIndex.value = EStepIndex.SCENES;
}

async function handleConfirmScenes() {
  const res = await pictureBookStore.confirmScenes({
    pbId: id.value,
    confirmed: stepData.value.scenes,
  });

  resetData();

  if (res.code === 409) {
    uni.showToast({
      title: "确认失败，请稍后再试",
      icon: "none",
    });

    throw new Error("确认失败，请稍后再试");
  }
  if (res.code !== 200) {
    uni.showToast({
      title: "确认失败，请重新确认",
      icon: "none",
    });
    throw new Error("确认失败，请重新确认");
  }
  stepData.value = res.data;
  currentStepIndex.value = EStepIndex.COVER;
}

async function handleConfirmCover() {
  const res = await pictureBookStore.confirmCover({
    pbId: id.value,
    confirmed: stepData.value.cover,
  });

  resetData();

  if (res.code === 409) {
    uni.showToast({
      title: "确认失败，请稍后再试",
      icon: "none",
    });

    throw new Error("确认失败，请稍后再试");
  }
  if (res.code !== 200) {
    uni.showToast({
      title: "确认失败，请重新确认",
      icon: "none",
    });
    throw new Error("确认失败，请重新确认");
  }
  stepData.value = res.data;
  currentStepIndex.value = EStepIndex.AUDIO;
}

async function handleNextStep() {
  if (isConfirming.value) {
    return;
  }
  isConfirming.value = true;

  if (currentStepIndex.value === EStepIndex.ROLES) {
    await handleConfirmRoles();
  } else if (currentStepIndex.value === EStepIndex.SCENES) {
    await handleConfirmScenes();
  } else if (currentStepIndex.value === EStepIndex.COVER) {
    await handleConfirmCover();
  }

  nextTick(() => {
    isConfirming.value = false;
  });
}

function handleAllConfirmed(res: any) {
  stepData.value = res.data;
  if (res.action === EConfirmAction.CONFIRM_ROLES) {
    currentStepIndex.value = 0;
  } else if (res.action === EConfirmAction.CONFIRM_SCENES) {
    currentStepIndex.value = 1;
  } else if (res.action === EConfirmAction.CONFIRM_COVER) {
    currentStepIndex.value = 2;
  }
}

function initPbDetail() {
  pictureBookStore
    .getPictureBookDetail({
      id: id.value,
    })
    .then((res: any) => {
      if (res.code !== 200) {
        uni.navigateBack({
          fail: () => {
            uni.reLaunch({
              url: "/pages/index/index",
            });
          },
        });
        uni.showToast({
          title: res.message || "获取绘本详情失败",
          icon: "none",
        });
        return;
      }
      pbDetail.value = res.data as IPictureBook;

      initStep();

      const t = setTimeout(() => {
        clearTimeout(t);
        pageReady.value = true;
      }, 500);
    });
}

function initStep() {
  if (!pbDetail.value?.roles || pbDetail.value?.roles.length === 0) {
    currentStepIndex.value = EStepIndex.ROLES;
    return;
  }
  if (!pbDetail.value?.scenes || pbDetail.value?.scenes.length === 0) {
    currentStepIndex.value = EStepIndex.SCENES;
    return;
  }
  if (
    !pbDetail.value?.cover ||
    Object.keys(pbDetail.value?.cover).length === 0
  ) {
    currentStepIndex.value = EStepIndex.COVER;
    return;
  }
  currentStepIndex.value = EStepIndex.AUDIO;
}

function closeModal() {
  const t = setTimeout(() => {
    clearTimeout(t);
    modalVisible.value = false;
    modalData.value = undefined;
  }, 200);
}

function openRegenerateModal(info: any) {
  if (regeneratingIds.value.has(info.id)) {
    return;
  }
  let type: "role" | "scene" | "cover" = "role";
  if (currentStepIndex.value === 0) {
    type = "role";
  } else if (currentStepIndex.value === 1) {
    type = "scene";
  } else if (currentStepIndex.value === 2) {
    type = "cover";
  }
  modalData.value = {
    component: EModalComponent.REGENERATE_MODAL,
    data: { info, type },
  };
  modalVisible.value = true;
}
</script>

<style></style>
