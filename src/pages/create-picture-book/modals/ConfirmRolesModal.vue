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
            class="relative w-full px-[24rpx] py-[24rpx] box-border flex flex-row flex-wrap gap-[24rpx]"
            :style="{
              minHeight: `calc(100% - 88rpx - 100rpx - ${safeBottom}px)`,
            }"
          >
            <view
              class="relative w-[339rpx] border border-[1rpx] border-[#f0f0f0] rounded-[24rpx] overflow-hidden"
              :style="{
                height: `${renderImageHeight + 140}rpx`,
              }"
              v-for="(role, index) in info.roles"
              :key="role.data.id"
            >
              <view
                class="absolute left-0 bottom-0 z-[9] bg-[rgba(0,0,0,0.2)] w-full pb-[24rpx] box-border flex flex-col"
              >
                <view
                  class="w-full h-[48rpx] px-[24rpx] box-border flex flex-row items-center"
                >
                  <text
                    class="text-[28rpx] font-bold text-[#333] line-clamp-1 overflow-hidden text-ellipsis break-all"
                    >{{ role.data.name }}</text
                  >
                </view>
                <view
                  class="w-full min-h-[36rpx] px-[24rpx] box-border flex flex-row items-center"
                >
                  <text
                    class="text-[24rpx] text-[#666] line-clamp-2 overflow-hidden text-ellipsis break-all"
                    >{{ role.data.prompt }}</text
                  >
                </view>
              </view>

              <view
                class="w-full h-full flex flex-row items-start justify-center"
                v-if="imageUrls.has(role.data.taskId)"
                @click="previewImage([imageUrls.get(role.data.taskId) || ''])"
              >
                <image
                  :src="imageUrls.get(role.data.taskId)"
                  class="w-full"
                  :style="{ height: `${renderImageHeight}rpx` }"
                  mode="aspectFit"
                ></image>
              </view>

              <view
                class="absolute right-0 top-0 z-[99] w-[64rpx] h-[64rpx] flex flex-row items-center justify-center"
              >
                <checkbox-group
                  @change="handleChangeRole($event, role.data.taskId)"
                >
                  <checkbox
                    :value="role.data.taskId"
                    :checked="selectedRoleIds.includes(role.data.taskId)"
                  />
                </checkbox-group>
              </view>

              <view
                class="absolute left-0 top-0 w-full h-full flex flex-row items-center justify-center"
                v-if="!imageUrls.has(role.data.taskId)"
              >
                <div class="spinner mb-[60rpx]">
                  <div class="spinner-inner"></div>
                  <div class="spinner-inner"></div>
                </div>
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
              class="h-[80rpx] px-[64rpx] rounded-[24rpx] bg-[#FF7BAC] box-border flex flex-row items-center justify-center transition-all duration-300"
              :class="[
                selectedRoleIds.length > 0
                  ? 'opacity-100 active:scale-95'
                  : 'opacity-50',
              ]"
              @click="handleConfirmRoles"
            >
              <text class="text-[32rpx] text-[#fff]"
                >确认
                {{
                  selectedRoleIds.length > 0
                    ? " · " + selectedRoleIds.length
                    : ""
                }}</text
              >
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
import type { EConfirmAction } from "../types";
import type { IConfirmRoleInfo, IConfirmRoleItem } from "./types";
import { requestGetImageUrls } from "@/request";
import { computed, onMounted, ref } from "vue";
import { previewImage } from "@/utils";

interface Props {
  info: any;
  ratio: string;
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

const renderImageHeight = computed(() => {
  const ratio = props.ratio.split(":");
  const width = Number(ratio[0]);
  const height = Number(ratio[1]);
  return (339 * height) / width;
});

onMounted(() => {
  listImageUrls();
});

function closeModal() {
  uni.showModal({
    title: "提示",
    content: "点击关闭会放弃当前故事内容，是否继续？",
    confirmText: "确定",
    confirmColor: "#FF7BAC",
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

async function listImageUrls() {
  const res = await requestGetImageUrls({
    taskIds: props.info.roles.map((role: IConfirmRoleItem) => role.data.taskId),
  }).then((res: any) => {
    console.log(">>> 获取图片: ", res);
    if (res.code === 200 && res.data && res.data.list) {
      res.data.list.forEach((item: any) => {
        imageUrls.value.set(item.taskId, item.url);
      });
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
  let roles = props.info.roles.map((role: IConfirmRoleItem) => role.data);

  roles = roles.map((role: any) => {
    return {
      ...role,
      url: imageUrls.value.get(role.taskId),
    };
  });

  let confirmedRoles = roles.filter((role: any) =>
    selectedRoleIds.value.includes(role.taskId)
  );
  let unconfirmedRoles = roles.filter(
    (role: any) => !selectedRoleIds.value.includes(role.taskId)
  );

  console.log("【已确认角色】", confirmedRoles);
  console.log("【未确认角色】", unconfirmedRoles);
}
</script>

<style scoped></style>
