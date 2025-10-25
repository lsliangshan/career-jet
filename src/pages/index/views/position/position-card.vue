<template>
  <view
    class="w-full bg-[#fff] rounded-[12rpx] p-[24rpx] box-border flex flex-col gap-[24rpx] active:bg-[#f8f8f8] transition-all duration-300"
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
          <text class="text-[24rpx] text-[#888]">{{ info.companyName }}</text>
          <view
            class="h-[32rpx] px-[4rpx] box-border border border-[#426eff] shrink-0 rounded-full bg-[#426eff] flex flex-row items-center justify-center"
            v-if="info.propertyName"
          >
            <text class="text-[20rpx] text-[#fff] scale-[0.8]">{{
              info.propertyName
            }}</text>
          </view>
        </view>
        <text class="text-[32rpx] font-[500] leading-[60rpx] text-[#333]">{{
          info.name
        }}</text>
        <text class="text-[28rpx] font-[500] text-[#426eff]">{{
          info.salary60
        }}</text>
      </view>
    </view>

    <view
      class="w-full flex flex-row items-center gap-[12rpx] flex-wrap"
      v-if="info.showSkillTags && info.showSkillTags.length > 0"
    >
      <view
        class="h-[50rpx] pl-[24rpx] pr-[24rpx] box-border rounded-[12rpx] overflow-hidden flex flex-row items-center shrink-0 bg-[#f5f5f5]"
        v-for="(skillTag, index) in info.showSkillTags"
        :key="index"
      >
        <text class="text-[24rpx] font-[500] text-[#333]">{{
          skillTag.tag
        }}</text>
      </view>

      <view
        class="w-full h-[48rpx] mt-[12rpx] pt-[24rpx] border-t border-[#f5f5f5] flex flex-row items-center justify-between"
      >
        <view class="h-full flex flex-row items-center">
          <text class="text-[24rpx] font-[500] text-[#888]">{{
            info.publishTime
          }}</text>
        </view>

        <view class="h-full flex flex-row items-center">
          <text class="text-[24rpx] font-[500] text-[#c8c8c8]">查看详情</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface Props {
  info: any;
}

const props = defineProps<Props>();

const defaultCompanyLogo = "../../../../static/icon_company.png";

const renderImage = ref<string>(props.info.companyLogo || defaultCompanyLogo);

function handleImageError(e: any) {
  renderImage.value = defaultCompanyLogo;
}
</script>

<style scoped></style>
