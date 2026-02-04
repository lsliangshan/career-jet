<template>
  <view class="w-[100vw] h-[100vh] flex flex-row items-end justify-center">
    <CustomHeader bg-color="transparent" />

    <Layout :hasHeader="true">
      <view class="relative w-full h-full flex flex-col">
        <view class="w-full h-[290rpx] shrink-0"></view>
        <scroll-view
          type="custom"
          :scroll-y="true"
          class="w-full bg-[#fff] rounded-tl-[32rpx] rounded-tr-[32rpx] overflow-y-auto"
          :style="{
            height: `calc(100vh - 128rpx)`,
          }"
        >
          <view
            class="sticky top-0 left-0 z-[99] w-full h-[88rpx] bg-[#fff] border-b border-b-[1rpx] border-[#F0F0F0] flex flex-row items-center justify-center"
          >
            <text class="text-[36rpx] font-bold text-[#333]">确认角色</text>

            <view
              class="absolute right-[12rpx] top-0 z-[9] w-[88rpx] h-[88rpx] active:opacity-80 shrink-0 flex flex-row items-center justify-center transition-opacity duration-300"
              @click="closeModal"
            >
              <svg-icon
                :src="`/static/${iconThemeVersion}/icon_close.svg`"
                class="w-[32rpx] h-[32rpx]"
                color="#000"
              />
            </view>
          </view>

          <view
            class="relative w-full px-[24rpx] py-[24rpx] box-border flex flex-row"
            :style="{
              minHeight: `calc(100% - 88rpx - 100rpx - ${safeBottom}px)`,
            }"
          >
            <view class="w-full h-full flex flex-row flex-wrap gap-[24rpx]">
              <view
                class="relative w-[339rpx] border border-[1rpx] border-[#f0f0f0] rounded-[24rpx] overflow-hidden"
                :style="{
                  height: `${renderImageHeight + 64}rpx`,
                }"
                v-for="(role, index) in info.roles"
                :key="role.data.id"
              >
                <view
                  class="absolute left-0 bottom-0 z-[9] bg-[rgba(0,0,0,0.05)] w-full flex flex-col"
                >
                  <view
                    class="w-full h-[64rpx] px-[12rpx] py-[12rpx] box-border flex flex-row items-center"
                  >
                    <text
                      class="text-[28rpx] font-bold text-[#666] line-clamp-1 overflow-hidden text-ellipsis break-all"
                      >{{ role.data.name }}</text
                    >
                  </view>
                </view>

                <view
                  class="w-full h-full flex flex-row items-start justify-center"
                  v-if="imageUrls.has(role.data.id)"
                  @click="previewImage([imageUrls.get(role.data.id) || ''])"
                >
                  <image
                    :src="imageUrls.get(role.data.id)"
                    class="w-full"
                    :style="{ height: `${renderImageHeight}rpx` }"
                    mode="aspectFit"
                  ></image>
                </view>

                <view
                  class="absolute right-0 top-0 z-[99] w-[88rpx] h-[88rpx] opacity-0 flex flex-row items-center justify-center transition-all duration-300"
                  :class="[
                    loadingImageIds.has(role.data.id)
                      ? 'opacity-0 pointer-events-none'
                      : 'opacity-100 active:scale-95 pointer-events-auto',
                  ]"
                  @click="openRegenerateModal(role.data.id)"
                >
                  <view
                    class="w-[56rpx] h-[56rpx] rounded-[12rpx] bg-[#fff] flex flex-row items-center justify-center active:scale-95 transition-all duration-300"
                    :style="{
                      backgroundColor: ThemeColors.primary,
                    }"
                  >
                    <svg-icon
                      :src="`/static/${iconThemeVersion}/icon_regenerate.svg`"
                      class="w-[24rpx] h-[24rpx]"
                      color="#fff"
                    />
                  </view>
                </view>
                <view
                  class="absolute left-0 top-0 w-full h-full flex flex-row items-center justify-center"
                  v-if="loadingImageIds.has(role.data.id)"
                >
                  <div class="spinner mb-[60rpx]">
                    <div class="spinner-inner"></div>
                    <div class="spinner-inner"></div>
                  </div>
                </view>
              </view>
            </view>
          </view>

          <view
            class="sticky bottom-0 left-0 z-[99] w-full bg-[#fff] border-t border-t-[1rpx] border-[#f0f0f0] flex flex-row items-center justify-center gap-[24rpx]"
            :style="{
              height: `calc(${safeBottom}px + 100rpx)`,
              paddingBottom: `${safeBottom}px`,
            }"
          >
            <view
              class="h-[80rpx] px-[64rpx] rounded-[24rpx] box-border flex flex-row items-center justify-center transition-all duration-300"
              :class="[
                loadingImageIds.size === 0 && !isConfirming
                  ? 'opacity-100 active:scale-95'
                  : 'opacity-50',
              ]"
              :style="{
                backgroundColor: ThemeColors.primary,
              }"
              @click="handleConfirmRoles"
            >
              <text class="text-[32rpx] text-[#fff]">{{
                isConfirming ? "正在确认" : "确认"
              }}</text>
            </view>
          </view>

          <view
            class="sticky left-0 bottom-0 z-[99] w-full h-full flex flex-row items-end justify-center"
            v-if="regenerateModalVisible"
          >
            <view
              class="relative w-full h-full rounded-[24rpx] bg-[#fff] transition-all duration-300 shadow-[0_0_16rpx_2rpx_rgba(0,0,0,0.1)] flex flex-col"
              :class="[
                regenerateModalReady
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-full',
              ]"
            >
              <view
                class="w-full h-[88rpx] shrink-0 px-[24rpx] box-border border-b border-b-[1rpx] border-[#f0f0f0] flex flex-row items-center"
              >
                <text class="text-[32rpx] font-bold text-[#333]"
                  >重新生成角色【{{ regenerateModalRole?.name }}】</text
                >
              </view>
              <view
                class="w-full flex flex-row items-center justify-center"
                :style="{
                  height: `calc(100% - 88rpx - 100rpx - ${safeBottom}px)`,
                }"
              >
                <scroll-view
                  type="custom"
                  :scroll-y="true"
                  class="w-full h-full"
                >
                  <textarea
                    class="w-full min-h-full text-[34rpx] text-[#666] px-[24rpx] py-[32rpx] box-border"
                    :maxlength="-1"
                    auto-height
                    placeholder="请输入角色描述"
                    v-if="regenerateModalRole"
                    v-model="regenerateModalRole.prompt"
                  />
                </scroll-view>
              </view>
              <view
                class="sticky bottom-0 left-0 z-[99] w-full shrink-0 bg-[#fff] border-t border-t-[1rpx] border-[#f0f0f0] flex flex-row items-center justify-center gap-[24rpx]"
                :style="{
                  height: `calc(${safeBottom}px + 100rpx)`,
                  paddingBottom: `${safeBottom}px`,
                }"
              >
                <view
                  class="h-[80rpx] px-[64rpx] bg-[#eeeeee] rounded-[24rpx] box-border flex flex-row items-center justify-center gap-[12rpx] active:scale-95 transition-all duration-300"
                  @click="hideRegenerateModal"
                >
                  <text
                    class="text-[32rpx]"
                    :style="{
                      color: ThemeColors.primary,
                    }"
                    >取消</text
                  >
                </view>
                <view
                  class="h-[80rpx] px-[64rpx] rounded-[24rpx] box-border flex flex-row items-center justify-center gap-[12rpx] transition-all duration-300"
                  :class="[
                    isRegeneratingRole
                      ? 'opacity-50 pointer-events-none'
                      : 'opacity-100 active:scale-95 pointer-events-auto',
                  ]"
                  :style="{
                    backgroundColor: ThemeColors.primary,
                  }"
                  @click="handleRegenerateRole"
                >
                  <svg-icon
                    :src="`/static/${iconThemeVersion}/icon_generate.svg`"
                    class="w-[32rpx] h-[32rpx]"
                    color="#fff"
                  />
                  <text class="text-[32rpx] text-[#fff]">{{
                    isRegeneratingRole ? "正在生成" : "重新生成"
                  }}</text>
                </view>
              </view>

              <view
                class="absolute right-0 top-0 z-[99] w-[88rpx] h-[88rpx] flex flex-row items-center justify-center"
                @click="hideRegenerateModal"
              >
                <svg-icon
                  :src="`/static/${iconThemeVersion}/icon_close.svg`"
                  class="w-[32rpx] h-[32rpx]"
                  color="#000"
                />
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </Layout>
  </view>
</template>

<script setup lang="ts">
import CustomHeader from "@/components/custom-header/custom-header.vue";
import Layout from "@/components/layout/layout.vue";
import { EConfirmAction } from "../types";
import type {
  IConfirmRoleData,
  IConfirmRoleInfo,
  IConfirmRoleItem,
} from "./types";
import {
  requestCustomUrl,
  requestGenerateRoleOrScene,
  requestGetImageUrls,
} from "@/request";
import { computed, nextTick, onMounted, ref } from "vue";
import { previewImage } from "@/utils";
import { iconThemeVersion, ThemeColors } from "@/config/config";

interface Props {
  info: IConfirmRoleInfo;
  ratio: string;
  pictureStyle: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (
    e: "on-confirm",
    params: {
      action: EConfirmAction;
      data: any;
    }
  ): void;
  (
    e: "on-cancel",
    params: {
      id: string;
    }
  ): void;
}>();

const safeBottom = uni.getWindowInfo().safeAreaInsets?.bottom || 0;

const imageUrls = ref<Map<string, string>>(new Map());

// 正在加载图片的id列表
const loadingImageIds = ref<Set<string>>(new Set());

// 是否确认中
const isConfirming = ref(false);

const regenerateModalVisible = ref(false);
const regenerateModalReady = ref(false);
const regenerateModalRole = ref<IConfirmRoleData | null>(null);
// 重新生成中
const isRegeneratingRole = ref(false);

const allRoles = ref<IConfirmRoleData[]>([]);

const renderImageHeight = computed(() => {
  const ratio = props.ratio.split(":");
  const width = Number(ratio[0]);
  const height = Number(ratio[1]);
  return (339 * height) / width;
});

onMounted(() => {
  resetData();
  allRoles.value = props.info.roles.map((role: IConfirmRoleItem) => role.data);
  listImageUrls(
    props.info.roles.map((role: IConfirmRoleItem) => role.data.taskId)
  );
});

function closeModal() {
  uni.showModal({
    title: "提示",
    content: "点击关闭会放弃当前故事内容，是否继续？",
    confirmText: "确定",
    confirmColor: ThemeColors.primary,
    cancelText: "取消",
    cancelColor: "#666",
    success: (res) => {
      if (res.confirm) {
        emit("on-cancel", {
          id: props.info.id,
        });
      }
    },
  });
}

function getIdByTaskId(taskId: string) {
  return allRoles.value.find((role: IConfirmRoleData) => role.taskId === taskId)
    ?.id;
}

async function listImageUrls(taskIds: string[]) {
  loadingImageIds.value.clear();
  allRoles.value.forEach((role: IConfirmRoleData) => {
    loadingImageIds.value.add(role.id);
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
      imageUrls.value.set(id, url);
    }
  });
}

function resetData() {
  isConfirming.value = false;
  regenerateModalVisible.value = false;
  regenerateModalReady.value = false;
  regenerateModalRole.value = null;
  isRegeneratingRole.value = false;
  imageUrls.value.clear();
  loadingImageIds.value.clear();
}

function handleConfirmRoles() {
  return new Promise(async (resolve) => {
    if (isConfirming.value) {
      return;
    }

    let roles = allRoles.value.map((role: any) => {
      return {
        ...role,
        url: imageUrls.value.get(role.id),
      };
    });

    if (roles.length > 0) {
      isConfirming.value = true;

      const res = await requestCustomUrl({
        url: props.info.confirmUrl,
        method: "POST",
        data: {
          id: props.info.id,
          confirmed: roles,
          unconfirmed: [],
        },
      });

      // const res = {
      //   code: 200,
      //   message: "请确认故事场景",
      //   action: "confirm-scenes",
      //   data: {
      //     id: "044822301617c9743c8fbb02",
      //     confirmUrl:
      //       "https://wf.qyflows.com/webhook-waiting/624814/pb-confirm-scene",
      //     scenes: [
      //       {
      //         code: 200,
      //         msg: "success",
      //         data: {
      //           taskId: "2be22498de264684989d8c5ee02aa890",
      //           recordId: "2be22498de264684989d8c5ee02aa890",
      //           index: 1,
      //           id: "scene1",
      //           script:
      //             "在蓝蓝的小河边，三个好朋友快乐地生活着，他们是小蜗牛悠悠、小青蛙呱呱和小老鼠吱吱。",
      //           content:
      //             "三个动物朋友在河边的集体画面，背景是清澈的小河和翠绿的草地，阳光明媚。",
      //           prompt:
      //             "全景画面，三个动物朋友在小河边，背景是清澈的小河和翠绿的草地，阳光明媚，充满生机。",
      //           prompt_en:
      //             "Wide shot of three animal friends by the riverbank, with the background of a clear river and lush green grass under bright sunlight, full of vitality.",
      //         },
      //       },
      //       {
      //         code: 200,
      //         msg: "success",
      //         data: {
      //           taskId: "dd3de57bdb11bfa179ee88779d34fb61",
      //           recordId: "dd3de57bdb11bfa179ee88779d34fb61",
      //           index: 2,
      //           id: "scene2",
      //           script: "他们在草丛里发现了一块亮闪闪、圆润润的蓝色小石头。",
      //           content:
      //             "三位朋友在草丛中找到一块小蓝石头，石头在阳光下闪闪发光。",
      //           prompt:
      //             "特写画面，小蓝石头在草丛中被找到，蓝色在阳光下闪闪发光，引人注目。",
      //           prompt_en:
      //             "Close-up of the small blue stone found among the grass, glistening in the sunlight, drawing attention.",
      //         },
      //       },
      //       {
      //         code: 200,
      //         msg: "success",
      //         data: {
      //           taskId: "3b28d50eacb694ca7577e23eb40c214d",
      //           recordId: "3b28d50eacb694ca7577e23eb40c214d",
      //           index: 3,
      //           id: "scene3",
      //           script: "悠悠把石头放在壳里，非常珍重地保护着它。",
      //           content: "悠悠把小石头放在壳里，壳内光滑湿润，小心翼翼地照看。",
      //           prompt:
      //             "特写画面，悠悠将小石头放在它的小螺旋壳中，壳内呈现潮湿光滑的质感。",
      //           prompt_en:
      //             "Close-up of Youyou placing the small stone into its spiral shell, with the interior showing a moist and smooth texture.",
      //         },
      //       },
      //       {
      //         code: 200,
      //         msg: "success",
      //         data: {
      //           taskId: "8f0c4118a1788bd6eef717eaf0effd48",
      //           recordId: "8f0c4118a1788bd6eef717eaf0effd48",
      //           index: 4,
      //           id: "scene4",
      //           script: "呱呱把石头顶在头上，如同王冠。",
      //           content:
      //             "呱呱把小石头稳稳地放在头上，仿佛戴上了一顶王冠，显得高贵。",
      //           prompt:
      //             "特写画面，小青蛙呱呱把小石头顶在头上，显得骄傲和喜悦，像是戴了一顶蓝色的王冠。",
      //           prompt_en:
      //             "Close-up of little frog Guagua balancing the small stone on its head, appearing proud and joyful, as if wearing a blue crown.",
      //         },
      //       },
      //       {
      //         code: 200,
      //         msg: "success",
      //         data: {
      //           taskId: "586f9edde618435b37788330feab0db8",
      //           recordId: "586f9edde618435b37788330feab0db8",
      //           index: 5,
      //           id: "scene5",
      //           script: "当呱呱要传给吱吱时，石头不见了，朋友们都很伤心。",
      //           content: "朋友们伤心地寻找丢失的小石头，四处张望却一无所获。",
      //           prompt:
      //             "中景画面，三个朋友在小河边伤心地寻找石头，神情落寞，画面有些阴郁。",
      //           prompt_en:
      //             "Medium shot of the three friends sadly searching for the lost stone by the riverbank, looking around with forlorn expressions, the scene slightly gloomy.",
      //         },
      //       },
      //       {
      //         code: 200,
      //         msg: "success",
      //         data: {
      //           taskId: "608e101cb851e70689a82df2ff82cddf",
      //           recordId: "608e101cb851e70689a82df2ff82cddf",
      //           index: 6,
      //           id: "scene6",
      //           script: "吱吱承认石头在自己这里。",
      //           content: "吱吱犹豫地将小石头从口袋里拿出，低着头。",
      //           prompt:
      //             "特写画面，吱吱低着头，将小石头从口袋里拿出来，显得愧疚。",
      //           prompt_en:
      //             "Close-up of Zhizhi with its head down, taking the small stone out of its pocket, looking guilty.",
      //         },
      //       },
      //       {
      //         code: 200,
      //         msg: "success",
      //         data: {
      //           taskId: "83f7a4b237f2c94a43f93b7cc8c6e735",
      //           recordId: "83f7a4b237f2c94a43f93b7cc8c6e735",
      //           index: 7,
      //           id: "scene7",
      //           script: "朋友们原谅了吱吱，三个好朋友重新团聚，沐浴在阳光下。",
      //           content:
      //             "三位朋友在阳光下再次围成圈，看着中间的小石头，露出微笑。",
      //           prompt:
      //             "全景画面，三个朋友团聚在阳光下，围绕着中间的蓝色小石头，开心和解。",
      //           prompt_en:
      //             "Wide shot of the three friends reunited under the sun, circling around the small blue stone in the center, happily reconciled.",
      //         },
      //       },
      //     ],
      //   },
      // };

      resetData();

      if (res.code === 409) {
        uni.showToast({
          title: "角色确认失败，请稍后再试",
          icon: "none",
        });
        emit("on-cancel", {
          id: props.info.id,
        });
        return;
      }
      if (res.code !== 200) {
        uni.showToast({
          title: "角色确认失败，请重新确认",
          icon: "none",
        });
        return;
      }

      handleAllConfirmed(res);

      nextTick(() => {
        isConfirming.value = false;
      });
    }

    resolve(true);
  });
}

function handleAllConfirmed(e: any) {
  emit("on-confirm", {
    action: e.action as EConfirmAction,
    data: e.data as any,
  });
}

function showRegenerateModal(role: IConfirmRoleData) {
  regenerateModalRole.value = role;
  regenerateModalVisible.value = true;
  nextTick(() => {
    regenerateModalReady.value = true;
  });
}

function hideRegenerateModal() {
  regenerateModalReady.value = false;
  setTimeout(() => {
    regenerateModalVisible.value = false;
  }, 300);
}

function openRegenerateModal(id: string) {
  const role = props.info.roles.find(
    (role: IConfirmRoleItem) => role.data.id === id
  );
  if (!role) {
    return;
  }
  showRegenerateModal(role.data);
}

async function handleRegenerateRole() {
  if (!regenerateModalRole.value) {
    return;
  }
  if (isRegeneratingRole.value) {
    return;
  }
  isRegeneratingRole.value = true;
  const res = await requestGenerateRoleOrScene({
    id: regenerateModalRole.value.id,
    prompt: `a children's book illustation style by ${props.pictureStyle}, ${regenerateModalRole.value.prompt}`,
    ratio: props.ratio,
  });

  if (res.code === 200) {
    hideRegenerateModal();

    // 更新角色图片
    imageUrls.value.set(regenerateModalRole.value.id, res.data.url);
    loadingImageIds.value.delete(regenerateModalRole.value.id);
    const newRole = {
      ...regenerateModalRole.value,
      taskId: res.data.taskId,
      url: res.data.url,
    };
    allRoles.value = allRoles.value.map((role: IConfirmRoleData) => {
      if (role.id === newRole.id) {
        return newRole;
      }
      return role;
    });
  } else {
    uni.showToast({
      title: "生成角色失败，请稍后再试",
      icon: "none",
    });
  }
  nextTick(() => {
    isRegeneratingRole.value = false;
  });
}
</script>

<style scoped></style>
