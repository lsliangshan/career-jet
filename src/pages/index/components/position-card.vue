<template>
  <view
    class="w-full rounded-[12rpx] p-[24rpx] box-border flex flex-col gap-[24rpx] active:bg-[#f8f8f8] transition-all duration-300"
    :style="{
      backgroundColor: ThemeColors.bgCard,
    }"
    @click="handleClick"
  >
    <view class="w-full flex flex-row items-center gap-[36rpx]">
      <view
        class="w-[120rpx] h-[120rpx] shrink-0 rounded-[8rpx] overflow-hidden bg-gray-100 flex flex-row items-center justify-center"
      >
        <image
          class="w-[88rpx] h-[88rpx] rounded-[4rpx] overflow-hidden"
          mode="aspectFit"
          :src="renderImage"
          @error="handleImageError"
        ></image>
      </view>

      <view class="w-full flex flex-col">
        <view class="w-full flex flex-row items-center gap-[8rpx]">
          <text
            class="text-[24rpx]"
            :style="{
              color: ThemeColors.text.label,
            }"
            >{{ info.companyName }}</text
          >
          <view
            class="h-[32rpx] px-[4rpx] shrink-0 rounded-full flex flex-row items-center justify-center"
            :style="{
              backgroundColor: ThemeColors.primary200,
            }"
            v-if="info.propertyName"
          >
            <text
              class="text-[20rpx] scale-[0.8]"
              :style="{
                color: ThemeColors.primary,
              }"
              >{{ info.propertyName }}</text
            >
          </view>
        </view>
        <text
          class="text-[32rpx] font-[500] leading-[60rpx]"
          :style="{
            color: ThemeColors.text.title,
          }"
          >{{ info.name }}</text
        >
        <text
          class="text-[28rpx] font-[500]"
          :style="{
            color: ThemeColors.accent,
          }"
          >{{ info.salary60 }}</text
        >
      </view>
    </view>

    <view
      class="w-full flex flex-row items-center gap-[12rpx] flex-wrap"
      v-if="info.showSkillTags && info.showSkillTags.length > 0"
    >
      <view
        class="h-[50rpx] pl-[24rpx] pr-[24rpx] box-border rounded-[12rpx] overflow-hidden flex flex-row items-center shrink-0"
        :style="{
          backgroundColor: ThemeColors.primary100,
        }"
        key="city"
      >
        <text
          class="text-[24rpx] font-[500]"
          :style="{
            color: ThemeColors.primary800,
          }"
          >{{ info.workCity }}</text
        >
      </view>
      <view
        class="h-[50rpx] pl-[24rpx] pr-[24rpx] box-border rounded-[12rpx] overflow-hidden flex flex-row items-center shrink-0"
        :style="{
          backgroundColor: ThemeColors.bg,
        }"
        v-for="(skillTag, index) in info.showSkillTags"
        :key="index"
      >
        <text
          class="text-[24rpx] font-[500]"
          :style="{
            color: ThemeColors.text.title,
          }"
          >{{ skillTag.tag }}</text
        >
      </view>
    </view>

    <view
      class="w-full h-[48rpx] mt-[12rpx] pt-[24rpx] border-t flex flex-row items-center justify-between"
      :style="{
        borderColor: ThemeColors.border,
      }"
    >
      <view class="h-full flex flex-row items-center">
        <text
          class="text-[24rpx] font-[500]"
          :style="{
            color: ThemeColors.text.disabled,
          }"
          >{{ info.publishTime }}</text
        >
      </view>

      <view class="h-full flex flex-row items-center">
        <text
          class="text-[24rpx] font-[500]"
          :style="{
            color: ThemeColors.text.disabled,
          }"
          >查看详情</text
        >
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { SupportedPlatform } from "@/types";
import { ref } from "vue";
import { ThemeColors } from "@/config/config";

interface Props {
  info: any;
  type: SupportedPlatform;
}

const props = defineProps<Props>();

const defaultCompanyLogo = "../../../static/icon_company.png";

const renderImage = ref<string>(props.info.companyLogo || defaultCompanyLogo);

function handleImageError(e: any) {
  renderImage.value = defaultCompanyLogo;
}

function handleClick() {
  uni.navigateTo({
    url: `/pages/position-detail/position-detail?number=${props.info.number}&type=${props.type}`,
  });
}
</script>

<style scoped></style>
