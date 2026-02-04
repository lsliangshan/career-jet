<template>
  <view class="relative w-full h-full">
    <CustomHeader show-back title="个人资料" />

    <Layout hasHeader>
      <scroll-view class="w-full h-full" scroll-y>
        <view class="w-full" :style="{ backgroundColor: ThemeColors.bgCard }">
          <view
            class="w-full h-[100rpx] px-[32rpx] bg-[#fff] active:bg-[#f8f8f8] box-border flex flex-row items-center justify-between transition-all duration-300"
          >
            <view class="h-full flex flex-row items-center shrink-0">
              <text
                class="text-[30rpx] font-[500]"
                :style="{ color: ThemeColors.text.title }"
                >头像</text
              >
            </view>
            <view class="w-full h-full">
              <button
                class="w-full h-full bg-transparent"
                open-type="chooseAvatar"
                @chooseavatar="handleChooseAvatar"
              >
                <view
                  class="absolute top-0 left-0 w-full h-full flex flex-row items-center justify-end gap-[12rpx]"
                >
                  <image
                    class="w-[64rpx] h-[64rpx] rounded-[12rpx] overflow-hidden"
                    :class="[renderAvatar ? 'opacity-100' : 'opacity-0']"
                    :src="renderAvatar"
                    mode="aspectFill"
                  ></image>

                  <svg-icon
                    :src="`/static/${iconThemeVersion}/icon_arrow_right.svg`"
                    class="w-[32rpx] h-[32rpx]"
                    :color="ThemeColors.text.disabled"
                  />
                </view>
              </button>
            </view>
          </view>

          <view
            class="h-[1rpx]"
            :style="{
              width: 'calc(100% - 64rpx)',
              backgroundColor: ThemeColors.border,
              marginLeft: '32rpx',
            }"
          ></view>

          <view
            class="w-full h-[100rpx] px-[32rpx] bg-[#fff] active:bg-[#f8f8f8] box-border flex flex-row items-center justify-between transition-all duration-300"
          >
            <view class="h-full flex flex-row items-center shrink-0">
              <text
                class="text-[30rpx] font-[500]"
                :style="{ color: ThemeColors.text.title }"
                >昵称</text
              >
            </view>
            <view
              class="w-full h-full flex flex-row items-center justify-end gap-[12rpx]"
              @click="handleEditProfileDetail(ProfileDetailType.NICKNAME)"
            >
              <text
                class="text-[26rpx]"
                :style="{ color: ThemeColors.text.label }"
                >{{ loginInfo?.nickname }}</text
              >

              <svg-icon
                :src="`/static/${iconThemeVersion}/icon_arrow_right.svg`"
                class="w-[32rpx] h-[32rpx]"
                :color="ThemeColors.text.disabled"
              />
            </view>
          </view>

          <view
            class="h-[1rpx]"
            :style="{
              width: 'calc(100% - 64rpx)',
              backgroundColor: ThemeColors.border,
              marginLeft: '32rpx',
            }"
          ></view>

          <view
            class="w-full h-[100rpx] px-[32rpx] bg-[#fff] active:bg-[#f8f8f8] box-border flex flex-row items-center justify-between transition-all duration-300"
          >
            <view class="h-full flex flex-row items-center shrink-0">
              <text
                class="text-[30rpx] font-[500]"
                :style="{ color: ThemeColors.text.title }"
                >邮箱</text
              >
            </view>
            <view
              class="w-full h-full flex flex-row items-center justify-end gap-[12rpx]"
              @click="handleEditProfileDetail(ProfileDetailType.EMAIL)"
            >
              <text
                class="text-[26rpx]"
                :style="{ color: ThemeColors.text.label }"
                >{{ loginInfo?.email }}</text
              >

              <svg-icon
                :src="`/static/${iconThemeVersion}/icon_arrow_right.svg`"
                class="w-[32rpx] h-[32rpx]"
                :color="ThemeColors.text.disabled"
              />
            </view>
          </view>

          <view
            class="h-[1rpx]"
            :style="{
              width: 'calc(100% - 64rpx)',
              backgroundColor: ThemeColors.border,
              marginLeft: '32rpx',
            }"
          ></view>

          <view
            class="w-full h-[100rpx] px-[32rpx] bg-[#fff] active:bg-[#f8f8f8] box-border flex flex-row items-center justify-between transition-all duration-300"
          >
            <view class="h-full flex flex-row items-center shrink-0">
              <text
                class="text-[30rpx] font-[500]"
                :style="{ color: ThemeColors.text.title }"
                >性别</text
              >
            </view>
            <view class="w-full h-full">
              <picker
                @change="handleChangeGender"
                :value="selectedGenderIndex"
                class="relative w-full h-full"
                range-key="label"
                :range="genders"
              >
                <view
                  class="absolute top-0 left-0 w-full h-full flex flex-row items-center justify-end gap-[12rpx]"
                >
                  <text
                    class="text-[26rpx]"
                    :style="{ color: ThemeColors.text.label }"
                  >
                    {{ genders[selectedGenderIndex]?.label }}
                  </text>

                  <svg-icon
                    :src="`/static/${iconThemeVersion}/icon_arrow_right.svg`"
                    class="w-[32rpx] h-[32rpx]"
                    :color="ThemeColors.text.disabled"
                  />
                </view>
              </picker>
            </view>
          </view>

          <view
            class="w-full h-[100rpx] px-[32rpx] bg-[#fff] active:bg-[#f8f8f8] box-border flex flex-row items-center justify-between transition-all duration-300"
          >
            <view class="h-full flex flex-row items-center shrink-0">
              <text
                class="text-[30rpx] font-[500]"
                :style="{ color: ThemeColors.text.title }"
                >出生日期</text
              >
            </view>
            <view class="w-full h-full">
              <picker
                @change="handleChangeBirthday"
                mode="date"
                class="relative w-full h-full"
                :value="loginInfo?.birthday"
                :start="'1900-01-01'"
                :end="new Date().toISOString().split('T')[0]"
              >
                <view
                  class="absolute top-0 left-0 w-full h-full flex flex-row items-center justify-end gap-[12rpx]"
                >
                  <text
                    class="text-[26rpx]"
                    :style="{ color: ThemeColors.text.label }"
                  >
                    {{ loginInfo?.birthday }}
                  </text>

                  <svg-icon
                    :src="`/static/${iconThemeVersion}/icon_arrow_right.svg`"
                    class="w-[32rpx] h-[32rpx]"
                    :color="ThemeColors.text.disabled"
                  />
                </view>
              </picker>
            </view>
          </view>
        </view>
      </scroll-view>
    </Layout>
  </view>
</template>

<script setup lang="ts">
import CustomHeader from "@/components/custom-header/custom-header.vue";
import Layout from "@/components/layout/layout.vue";
import { ProfileDetailType, useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";
import { iconThemeVersion, ThemeColors } from "@/config/config";
import { navigateToEditProfileDetail } from "@/utils/router";

const userStore = useUserStore();
const { loginInfo } = storeToRefs(userStore);

const selectedGenderIndex = ref(0);

const genders = ref<{ label: string; value: string }[]>([
  {
    label: "男",
    value: "male",
  },
  {
    label: "女",
    value: "female",
  },
]);

const newAvatar = ref("");

const renderAvatar = computed(
  () => newAvatar.value || loginInfo?.value?.avatar
);

onMounted(() => {
  selectedGenderIndex.value = genders.value.findIndex(
    (item) => item.value === loginInfo?.value?.gender
  );
});

function handleChangeGender(e: any) {
  selectedGenderIndex.value = Number(e.detail.value);

  updateUserInfo({
    gender: genders.value[selectedGenderIndex.value].value,
  });
}

function handleChangeBirthday(e: any) {
  updateUserInfo({
    birthday: e.detail.value,
  });
}

function updateUserInfo(params: {
  avatar?: string;
  nickname?: string;
  gender?: string;
  birthday?: string;
  phonenum?: string;
  email?: string;
  username?: string;
}) {
  userStore
    .updateUserInfo({
      ...params,
    })
    .then((res: any) => {
      if (res.code == 200) {
        uni.showToast({
          title: "更新成功",
          icon: "success",
        });
      } else {
        uni.showToast({
          title: res.message || "更新失败",
          icon: "error",
        });
      }
    })
    .catch((err: any) => {
      uni.showToast({
        title: err.message || "更新失败",
        icon: "error",
      });
    });
}

function handleChooseAvatar(e: any) {
  newAvatar.value = e.detail.avatarUrl;

  uni.uploadFile({
    url: "https://api.liangqy.com/upload/image",
    filePath: e.detail.avatarUrl,
    name: "file",
    header: {
      "Content-Type": "multipart/form-data", // 小程序会自动设置正确的boundary
    },
    success: (uploadFileRes: any) => {
      const data = JSON.parse(uploadFileRes.data);
      if (data && data.code == 200 && data.data && data.data.url) {
        updateUserInfo({
          avatar: data.data.url,
        });
      }
    },
  });
}

function handleEditProfileDetail(type: ProfileDetailType) {
  navigateToEditProfileDetail(type);
}
</script>

<style scoped>
wx-button::after {
  border: none !important;
}
</style>
