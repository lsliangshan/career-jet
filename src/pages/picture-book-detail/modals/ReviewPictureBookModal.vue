<template>
  <view class="w-full max-h-[80vh] bg-white flex flex-col">
    <view
      class="w-full h-[128rpx] px-[32rpx] box-border flex flex-row items-center justify-between border-b border-b-[rgba(230,226,209,0.5)] border-b-[1rpx]"
    >
      <text class="text-[32rpx] text-[#333] font-bold">绘本审核</text>
      <view
        class="w-[128rpx] h-[128rpx] flex flex-row items-center justify-end active:scale-95 transition-all duration-300"
      >
        <text
          class="text-[32rpx] font-bold"
          :style="{ color: ThemeColors.primary }"
          @click="handleConfirm"
          >确定</text
        >
      </view>
    </view>
    <view class="w-full flex-1 flex flex-row items-start">
      <scroll-view
        class="w-full"
        scroll-y
        :style="{ maxHeight: `calc(80vh - 128rpx)` }"
      >
        <view
          class="w-full py-[24rpx] px-[24rpx] box-border flex flex-col gap-[12rpx]"
        >
          <view
            class="w-full h-[120rpx] flex flex-row items-center justify-center"
          >
            <CustomTabs
              :tabs="allActions"
              v-model="activeActionIndex"
              :colors="['green', 'red']"
            ></CustomTabs>
          </view>

          <view
            class="w-full bg-[rgba(0,0,0,0.04)] rounded-md flex flex-row items-center justify-center will-change-height transition-height duration-300 overflow-hidden"
            :style="{ height: activeActionIndex === 0 ? '0' : '300rpx' }"
          >
            <textarea
              class="w-full min-h-full text-[30rpx] text-[#666] px-[24rpx] py-[32rpx] box-border"
              :maxlength="-1"
              :style="{
                color: ThemeColors.text.title,
              }"
              :cursor-spacing="24"
              confirm-type="done"
              placeholder="请输入不通过的理由"
              v-model="rejectReason"
            />
          </view>
          <view class="w-full h-[48rpx]"></view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ThemeColors } from "@/config/config";
import CustomTabs from "@/components/custom-tabs/custom-tabs.vue";
import { ref } from "vue";

interface Props {}

const props = defineProps<Props>();

const $emit = defineEmits<{
  (
    e: "on-confirm",
    data:
      | {
          action: "approve";
        }
      | {
          action: "reject";
          rejectReson: string;
        }
  ): void;
}>();

const allActions = [
  {
    name: "通过",
    value: "approve",
  },
  {
    name: "不通过",
    value: "reject",
  },
];

const activeActionIndex = ref(0);

const rejectReason = ref("");

function handleConfirm() {
  if (activeActionIndex.value === 1 && !rejectReason.value) {
    // 审核不通过时，不通过理由是必填项
    uni.showToast({
      title: "请填写拒绝的理由",
      icon: "none",
    });
    return;
  }
  if (activeActionIndex.value === 0) {
    $emit("on-confirm", {
      action: "approve",
    });
  } else if (activeActionIndex.value === 1) {
    $emit("on-confirm", {
      action: "reject",
      rejectReson: rejectReason.value,
    });
  }
}
</script>

<style lang="scss" scoped></style>
