<template>
  <view class="w-full flex flex-col items-center justify-center gap-[24rpx]">
    <view class="w-full flex flex-row items-center justify-center">
      <view
        class="w-[180rpx] h-[180rpx] border border-[12rpx] border-white box-border bg-white shrink-0 shadow-md rounded-full overflow-hidden"
      >
        <image
          class="w-full h-full"
          :src="renderAvatar"
          mode="aspectFill"
          @click.stop="previewImage"
        ></image>
      </view>
    </view>

    <view class="w-full flex flex-row items-center justify-center">
      <view
        class="px-[24rpx] box-border flex flex-row items-center justify-center gap-[12rpx]"
        :style="{
          marginLeft: isLoggedIn ? '60rpx' : '0',
        }"
        @click="handleEditProfile"
      >
        <text
          class="text-2xl font-[500]"
          :style="{ color: ThemeColors.text.title }"
          v-if="isLoggedIn"
          >{{ loginInfo?.nickname || "匿名用户" }}</text
        >
        <text
          class="text-2xl font-[500]"
          :style="{ color: ThemeColors.text.title }"
          v-else
          >未登录</text
        >

        <view
          class="w-[48rpx] h-[48rpx] shrink-0 flex flex-row items-center justify-center"
          v-if="isLoggedIn"
        >
          <svg-icon
            :src="`/static/${iconThemeVersion}/icon_pb_draft.svg`"
            class="w-[36rpx] h-[36rpx]"
            :color="ThemeColors.text.disabled"
          />
        </view>
      </view>
    </view>

    <view
      class="w-full h-full mt-[24rpx] shrink-0 flex flex-row items-center justify-center"
    >
      <view
        class="w-full h-[72rpx] flex flex-row items-center justify-center"
        v-if="!isLoggedIn"
      >
        <view
          class="h-full px-[32rpx] box-border rounded-full overflow-hidden active:scale-95 transition-all duration-300 flex flex-row items-center justify-center gap-[12rpx]"
          @click.stop="handleLogin"
          :class="[
            isLoginLoading
              ? 'bg-[#c8c8c8] pointer-events-none'
              : 'bg-[#07c160] active:bg-[#069149]',
          ]"
        >
          <text class="text-[28rpx] text-white" v-if="!isLoginLoading"
            >点击登录</text
          >
          <view
            class="h-[30rpx] flex flex-row items-center justify-center gap-[8rpx]"
            v-else
          >
            <CustomLoader :size="24" color="#fff" />
            <text class="text-[28rpx] text-white">登录中...</text>
          </view>
        </view>
      </view>

      <view
        class="w-full h-[72rpx] flex flex-row items-center justify-center"
        v-else
      >
        <view
          class="h-full px-[32rpx] box-border rounded-full overflow-hidden active:scale-95 transition-all duration-300 flex flex-row items-center justify-center gap-[12rpx]"
          :style="{ backgroundColor: ThemeColors.error }"
          @click="handleLogout"
        >
          <view
            class="h-[32rpx] w-[32rpx] flex flex-row items-center justify-center"
          >
            <svg-icon
              :src="`/static/${iconThemeVersion}/icon_logout.svg`"
              class="w-[30rpx] h-[30rpx]"
              color="#fff"
            />
          </view>

          <text class="text-[28rpx] text-white">退出登录</text>
        </view>
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
import { navigateToProfileDetail } from "@/utils/router";

const $emit = defineEmits<{
  (e: "on-logout"): void;
}>();

const userStore = useUserStore();
const { loginInfo, isLoggedIn } = storeToRefs(userStore);

const isLoginLoading = ref(false);

const renderAvatar = computed(() => {
  return (
    loginInfo.value?.avatar ||
    "https://img.liangqy.com/crawlerjet/img/default_avatar_male.png"
  );
});

function handleLogout() {
  $emit("on-logout");
}

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
  navigateToProfileDetail();
}

function previewImage() {
  uni.previewImage({
    urls: [renderAvatar.value],
  });
}
</script>

<style scoped></style>
