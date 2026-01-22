<template>
  <view
    class="w-full h-[200rpx] px-[32rpx] box-border flex flex-row items-center justify-center gap-[24rpx]"
    :style="{ backgroundColor: ThemeColors.bgCard }"
    @click="handleEditProfile"
  >
    <view
      class="w-[120rpx] h-[120rpx] shrink-0 rounded-[16rpx] overflow-hidden"
      :style="{ backgroundColor: ThemeColors.bg }"
    >
      <image
        class="w-full h-full"
        :src="renderAvatar"
        mode="aspectFill"
        @click.stop="previewImage"
      ></image>
    </view>

    <view class="w-full flex flex-col">
      <text
        class="text-[28rpx] font-[500]"
        :style="{ color: ThemeColors.text.title }"
        v-if="isLoggedIn"
        >{{ loginInfo?.nickname || "匿名用户" }}</text
      >
      <text
        class="text-[28rpx] font-[500]"
        :style="{ color: ThemeColors.text.label }"
        v-else
        >还未登录</text
      >
    </view>

    <view
      class="h-full shrink-0 flex flex-row items-center justify-center"
      v-if="!isLoggedIn"
    >
      <view
        class="h-[64rpx] px-[24rpx] box-border rounded-[8rpx] overflow-hidden flex flex-row items-center justify-center transition-opacity duration-300"
        @click.stop="handleLogin"
        :class="[
          isLoginLoading
            ? 'bg-[#c8c8c8] pointer-events-none'
            : 'bg-[#07c160] active:bg-[#069149]',
        ]"
      >
        <text
          class="text-[28rpx]"
          :style="{ color: ThemeColors.text.white }"
          v-if="!isLoginLoading"
          >登录</text
        >
        <view
          class="h-[30rpx] flex flex-row items-center justify-center gap-[8rpx]"
          v-else
        >
          <CustomLoader :size="24" color="#fff" />
          <text class="text-[28rpx]" :style="{ color: ThemeColors.text.white }"
            >登录中...</text
          >
        </view>
      </view>
    </view>
    <view
      class="h-full shrink-0 flex flex-row items-center justify-center"
      v-else
    >
      <view
        class="h-[48rpx] px-[24rpx] box-border rounded-[8rpx] overflow-hidden flex flex-row items-center justify-center"
      >
        <svg-icon
          :src="`/static/${iconThemeVersion}/icon_arrow_right.svg`"
          class="w-[30rpx] h-[30rpx]"
          :color="ThemeColors.text.disabled"
        />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { iconThemeVersion, ThemeColors } from "@/config/config";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import CustomLoader from "@/components/custom-loader/custom-loader.vue";

const userStore = useUserStore();
const { loginInfo, isLoggedIn } = storeToRefs(userStore);

const isLoginLoading = ref(false);

const renderAvatar = computed(() => {
  return (
    loginInfo.value?.avatar ||
    "https://img.liangqy.com/crawlerjet/img/default_avatar_male.png"
  );
});

async function handleLogin() {
  if (isLoginLoading.value) {
    return;
  }
  isLoginLoading.value = true;
  await userStore
    .login()
    .then(() => {
      uni.showToast({
        title: "登录成功",
        icon: "success",
      });
      isLoginLoading.value = false;
    })
    .catch(() => {
      uni.showToast({
        title: "登录失败",
        icon: "error",
      });
      isLoginLoading.value = false;
    });
}

function handleEditProfile() {
  if (!isLoggedIn.value) {
    return;
  }
  uni.navigateTo({
    url: "/pages/profile-detail/profile-detail",
  });
}

function previewImage() {
  uni.previewImage({
    urls: [renderAvatar.value],
  });
}
</script>

<style scoped></style>
