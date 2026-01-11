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
              <image
                src="@static/icon_close_black.png"
                class="w-[32rpx] h-[32rpx]"
              ></image>
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
                  class="absolute left-0 bottom-0 z-[9] bg-[rgba(0,0,0,0.2)] w-full flex flex-col"
                >
                  <view
                    class="w-full h-[64rpx] px-[24rpx] box-border flex flex-row items-center"
                  >
                    <text
                      class="text-[28rpx] font-bold text-[#333] line-clamp-1 overflow-hidden text-ellipsis break-all"
                      >{{ role.data.name }}</text
                    >
                  </view>
                  <!-- <view
                  class="w-full min-h-[36rpx] px-[24rpx] box-border flex flex-row items-center"
                >
                  <text
                    class="text-[24rpx] text-[#666] line-clamp-2 overflow-hidden text-ellipsis break-all"
                    >{{ role.data.prompt }}</text
                  >
                </view> -->
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
                      backgroundColor: mainColor,
                    }"
                  >
                    <image
                      src="@static/icon_regenerate_white.png"
                      class="w-[24rpx] h-[24rpx]"
                    ></image>
                  </view>
                </view>

                <!-- <view
                class="absolute right-0 top-0 z-[99] w-[64rpx] h-[64rpx] flex flex-row items-center justify-center"
                v-if="confirmedRoleIds.has(role.data.id)"
              >
                <image
                  src="@static/icon_tag_confirmed.png"
                  class="w-[48rpx] h-[48rpx]"
                ></image>
              </view>

              <view
                class="absolute right-0 top-0 z-[99] w-[64rpx] h-[64rpx] flex flex-row items-center justify-center"
                v-else
              >
                <checkbox-group
                  @change="handleChangeRole($event, role.data.id)"
                >
                  <checkbox
                    :value="role.data.id"
                    :disabled="
                      !imageUrls.has(role.data.id) ||
                      loadingImageIds.has(role.data.id)
                    "
                    :checked="selectedRoleIds.includes(role.data.id)"
                  />
                </checkbox-group>
              </view> -->

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
                selectedRoleIds.length > 0 && !isConfirming
                  ? 'opacity-100 active:scale-95'
                  : 'opacity-50',
              ]"
              :style="{
                backgroundColor: mainColor,
              }"
              @click="handleConfirmRoles"
            >
              <text class="text-[32rpx] text-[#fff]"
                >{{ isConfirming ? "正在确认" : "确认" }}
                {{
                  selectedRoleIds.length > 0
                    ? " · " + selectedRoleIds.length
                    : ""
                }}</text
              >
            </view>
          </view>

          <view
            class="absolute left-0 top-0 z-[99] w-full h-full flex flex-row items-end justify-center"
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
                      color: mainColor,
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
                    backgroundColor: mainColor,
                  }"
                  @click="handleRegenerateRole"
                >
                  <image
                    src="@static/icon_generate_white.png"
                    class="w-[32rpx] h-[32rpx]"
                  ></image>
                  <text class="text-[32rpx] text-[#fff]">{{
                    isRegeneratingRole ? "正在生成" : "重新生成"
                  }}</text>
                </view>
              </view>

              <view
                class="absolute right-0 top-0 z-[99] w-[88rpx] h-[88rpx] flex flex-row items-center justify-center"
                @click="hideRegenerateModal"
              >
                <image
                  src="@static/icon_close_black.png"
                  class="w-[32rpx] h-[32rpx]"
                ></image>
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
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { previewImage } from "@/utils";
import { mainColor } from "@/config/config";

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
      data: IConfirmRoleInfo;
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

const selectedRoleIds = ref<string[]>([]);

// 已经确认的角色
const confirmedRoleIds = ref<Set<string>>(new Set());

// 已确认的角色列表
const confirmedRoles = ref<IConfirmRoleData[]>([]);
// 未确认的角色列表
const unconfirmedRoles = ref<IConfirmRoleData[]>([]);

// 正在加载图片的id列表
const loadingImageIds = ref<Set<string>>(new Set());

// 是否确认中
const isConfirming = ref(false);

const regenerateModalVisible = ref(false);
const regenerateModalReady = ref(false);
const regenerateModalRole = ref<IConfirmRoleData | null>(null);
// 重新生成中
const isRegeneratingRole = ref(false);

const renderImageHeight = computed(() => {
  const ratio = props.ratio.split(":");
  const width = Number(ratio[0]);
  const height = Number(ratio[1]);
  return (339 * height) / width;
});

watch(
  () => unconfirmedRoles.value,
  (newVal) => {
    console.log("【unconfirmedRoles】", newVal);
    if (newVal && newVal.length > 0) {
      listImageUrls(newVal.map((role: IConfirmRoleData) => role.taskId));
    }
  },
  {
    deep: true,
    immediate: true,
  }
);

onMounted(() => {
  unconfirmedRoles.value = props.info.roles.map(
    (role: IConfirmRoleItem) => role.data
  );
  // listImageUrls(
  //   props.info.roles.map((role: IConfirmRoleItem) => role.data.taskId)
  // );
});

function closeModal() {
  uni.showModal({
    title: "提示",
    content: "点击关闭会放弃当前故事内容，是否继续？",
    confirmText: "确定",
    confirmColor: mainColor,
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
  return [...confirmedRoles.value, ...unconfirmedRoles.value].find(
    (role: IConfirmRoleData) => role.taskId === taskId
  )?.id;
}

async function listImageUrls(taskIds: string[]) {
  loadingImageIds.value.clear();
  unconfirmedRoles.value.forEach((role: IConfirmRoleData) => {
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

function handleChangeRole(e: any, taskId: string) {
  const id = e.detail.value[0];
  if (id) {
    if (selectedRoleIds.value.includes(id)) {
      selectedRoleIds.value = selectedRoleIds.value.filter(
        (item) => item !== id
      );
    } else {
      selectedRoleIds.value.push(id);
    }
  } else {
    if (selectedRoleIds.value.includes(taskId)) {
      selectedRoleIds.value = selectedRoleIds.value.filter(
        (item) => item !== taskId
      );
    }
  }
}

function handleConfirmRoles() {
  return new Promise(async (resolve) => {
    if (isConfirming.value) {
      return;
    }

    let roles = unconfirmedRoles.value.map((role: any) => {
      return {
        ...role,
        url: imageUrls.value.get(role.id),
      };
    });

    let confirmed = roles.filter((role: any) =>
      selectedRoleIds.value.includes(role.id)
    );
    let unconfirmed = roles.filter(
      (role: any) => !selectedRoleIds.value.includes(role.id)
    );

    if (unconfirmed.length > 0) {
      isConfirming.value = true;

      const res = await requestCustomUrl({
        url: props.info.confirmUrl,
        method: "POST",
        data: {
          id: props.info.id,
          confirmed: confirmed,
          unconfirmed: unconfirmed,
        },
      });

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

      confirmed.forEach((role: any) => {
        confirmedRoleIds.value.add(role.id);
      });
      selectedRoleIds.value = [];

      if (
        res.action === EConfirmAction.CONFIRM_ROLES &&
        res.data.roles &&
        res.data.roles.length > 0
      ) {
        console.log("【确认其他角色】", res.data.roles);
        // 有待确认的角色
        unconfirmedRoles.value = res.data.roles.map(
          (role: IConfirmRoleItem) => role.data
        );
      } else {
        handleAllConfirmed(res);
        resolve(true);
      }
      nextTick(() => {
        isConfirming.value = false;
      });
    }

    resolve(true);
  });
}

function handleAllConfirmed(e: any) {
  console.log("【所有角色已确认】", e);
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
  console.log(">>> 重新生成返回: ", res);
  if (res.code === 200) {
    hideRegenerateModal();

    // 更新角色图片
    imageUrls.value.set(regenerateModalRole.value.id, res.data.url);
    loadingImageIds.value.delete(regenerateModalRole.value.id);
    const role = {
      ...regenerateModalRole.value,
      taskId: res.data.taskId,
      url: res.data.url,
    };
    unconfirmedRoles.value = unconfirmedRoles.value.filter(
      (item: any) => item.id !== role.id
    );
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
