<template>
  <view>
    <view
      class="w-full h-[64rpx] mb-[12rpx] flex flex-row items-center"
      v-if="showHeader"
    >
      <text
        class="text-[24rpx] text-shadow-[0_0_10rpx_rgba(255,255,255,0.1)]"
        :style="{
          color: ThemeColors.text.label,
        }"
        >通用设置</text
      >
    </view>
    <view class="w-full rounded-[8rpx] overflow-hidden flex flex-col">
      <view
        class="flex flex-row items-center border-t border-t-[1rpx] border-t-[#f8f8f8]"
      >
        <view
          class="h-[100rpx] w-full pl-[24rpx] pr-[24rpx] box-border active:bg-[#fafafa] flex flex-row items-center justify-between"
          :style="{
            backgroundColor: ThemeColors.bgCard,
          }"
          @click="handleCreatePictureBook"
        >
          <view class="flex flex-row items-center gap-[12rpx]">
            <svg-icon
              :src="`/static/${iconThemeVersion}/icon_generate.svg`"
              class="w-[28rpx] h-[28rpx]"
              color="#000"
            />
            <text
              class="text-[28rpx]"
              :style="{
                color: ThemeColors.text.title,
              }"
              >制作绘本</text
            >
          </view>
          <view
            class="h-full shrink-0 flex flex-row items-center justify-center"
          >
            <svg-icon
              :src="`/static/${iconThemeVersion}/icon_arrow_right.svg`"
              class="w-[30rpx] h-[30rpx]"
              :color="ThemeColors.text.disabled"
            />
          </view>
        </view>
      </view>

      <view
        class="flex flex-row items-center border-t border-t-[1rpx] border-t-[#f8f8f8]"
      >
        <view
          class="h-[100rpx] w-full pl-[24rpx] pr-[24rpx] box-border active:bg-[#fafafa] flex flex-row items-center justify-between"
          :style="{
            backgroundColor: ThemeColors.bgCard,
          }"
          @click="handleViewMyPictureBooks('draft')"
        >
          <view class="flex flex-row items-center gap-[12rpx]">
            <svg-icon
              :src="`/static/${iconThemeVersion}/icon_pb_draft.svg`"
              class="w-[28rpx] h-[28rpx]"
              color="#000"
            />
            <text
              class="text-[28rpx]"
              :style="{
                color: ThemeColors.text.title,
              }"
              >我的草稿</text
            >
          </view>
          <view
            class="h-full shrink-0 flex flex-row items-center justify-center"
          >
            <svg-icon
              :src="`/static/${iconThemeVersion}/icon_arrow_right.svg`"
              class="w-[30rpx] h-[30rpx]"
              :color="ThemeColors.text.disabled"
            />
          </view>
        </view>
      </view>

      <view
        class="flex flex-row items-center border-t border-t-[1rpx] border-t-[#f8f8f8]"
      >
        <view
          class="h-[100rpx] w-full pl-[24rpx] pr-[24rpx] box-border active:bg-[#fafafa] flex flex-row items-center justify-between"
          :style="{
            backgroundColor: ThemeColors.bgCard,
          }"
          @click="handleViewMyPictureBooks('final')"
        >
          <view class="flex flex-row items-center gap-[12rpx]">
            <svg-icon
              :src="`/static/${iconThemeVersion}/icon_pb_list.svg`"
              class="w-[26rpx] h-[26rpx]"
              color="#000"
            />
            <text
              class="text-[28rpx]"
              :style="{
                color: ThemeColors.text.title,
              }"
              >我的绘本</text
            >
          </view>
          <view
            class="h-full shrink-0 flex flex-row items-center justify-center"
          >
            <svg-icon
              :src="`/static/${iconThemeVersion}/icon_arrow_right.svg`"
              class="w-[30rpx] h-[30rpx]"
              :color="ThemeColors.text.disabled"
            />
          </view>
        </view>
      </view>

      <!-- <view
        class="w-full h-[1rpx] flex flex-row items-center justify-center"
        :style="{
          backgroundColor: ThemeColors.bgCard,
        }"
      >
        <view
          class="h-full"
          :style="{
            width: `calc(100% - 48rpx)`,
            backgroundColor: ThemeColors.bg,
          }"
        ></view>
      </view> -->
    </view>
  </view>
</template>

<script setup lang="ts">
import { iconThemeVersion, ThemeColors } from "@/config/config";

interface Props {
  showHeader?: boolean;
}
withDefaults(defineProps<Props>(), {
  showHeader: true,
});

function handleCreatePictureBook() {
  uni.navigateTo({
    url: "/pages/create-picture-book/create-picture-book",
  });
}

function handleViewMyPictureBooks(type: "draft" | "final") {
  uni.navigateTo({
    url: `/pages/picture-book-list/picture-book-list?type=${type}`,
  });
}
</script>

<style scoped></style>
