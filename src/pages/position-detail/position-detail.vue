<template>
  <view>
    <CustomHeader show-back :title="renderTitle" />

    <Layout :hasHeader="true">
      <scroll-view class="w-full h-full bg-[#fff]" scroll-y>
        <view
          class="w-full h-[160rpx] px-[32rpx] box-border flex flex-row items-center gap-[32rpx]"
        >
          <view
            class="w-[100rpx] h-[100rpx] rounded-[8rpx] overflow-hidden shrink-0 bg-gray-100 flex flex-row items-center justify-center"
          >
            <image
              class="w-[64rpx] h-[64rpx] rounded-[4rpx] overflow-hidden"
              mode="aspectFit"
              :src="renderImage"
              @error="handleImageError"
            ></image>
          </view>

          <view class="w-full flex flex-col justify-center gap-[8rpx]">
            <view class="w-full flex flex-row items-center gap-[8rpx]">
              <text class="text-[24rpx] text-[#888]">{{
                positionDetail?.companyName
              }}</text>
              <!-- <view
                class="h-[32rpx] px-[4rpx] box-border border border-[#426eff] shrink-0 rounded-full bg-[#426eff] flex flex-row items-center justify-center"
                v-if="positionDetail.propertyName"
              >
                <text class="text-[20rpx] text-[#fff] scale-[0.8]">{{
                  positionDetail.propertyName
                }}</text>
              </view> -->
            </view>
            <text class="text-[32rpx] font-[500] text-[#333]">{{
              positionDetail?.name
            }}</text>
          </view>
        </view>

        <view
          class="w-full mt-[24rpx] px-[32rpx] box-border flex flex-col gap-[12rpx]"
        >
          <view class="w-full h-[48rpx] flex flex-row items-center gap-[12rpx]">
            <view
              class="w-[48rpx] h-[48rpx] shrink-0 flex flex-row items-center justify-center"
            >
              <image
                class="w-[32rpx] h-[32rpx]"
                src="@static/icon_city.png"
              ></image>
            </view>
            <view class="w-full flex flex-row items-center">
              <text class="text-[26rpx] text-[#888]">{{ renderAddress }}</text>
            </view>
          </view>
          <view class="w-full h-[48rpx] flex flex-row items-center gap-[12rpx]">
            <view
              class="w-[48rpx] h-[48rpx] shrink-0 flex flex-row items-center justify-center"
            >
              <image
                class="w-[32rpx] h-[32rpx]"
                src="@static/icon_salary.png"
              ></image>
            </view>
            <view class="w-full flex flex-row items-center">
              <text class="text-[28rpx] font-[500] text-[#426eff]">{{
                positionDetail?.salary60
              }}</text>
            </view>
          </view>
        </view>

        <view
          class="w-full h-[160rpx] px-[32rpx] box-border mt-[36rpx] flex flex-row items-center justif-center"
        >
          <view
            class="w-full h-full flex flex-col items-center justify-center gap-[12rpx]"
          >
            <text class="text-[24rpx] text-[#888]">经验要求</text>
            <text class="text-[32rpx] font-[500] text-[#333]">{{
              positionDetail?.workingExp
            }}</text>
          </view>
          <view class="w-[1rpx] h-[88rpx] bg-gray-300 shrink-0"></view>
          <view
            class="w-full h-full flex flex-col items-center justify-center gap-[12rpx]"
          >
            <text class="text-[24rpx] text-[#888]">学历要求</text>
            <text class="text-[32rpx] font-[500] text-[#333]">{{
              positionDetail?.education
            }}</text>
          </view>
          <view class="w-[1rpx] h-[88rpx] bg-gray-300 shrink-0"></view>
          <view
            class="w-full h-full flex flex-col items-center justify-center gap-[12rpx]"
          >
            <text class="text-[24rpx] text-[#888]">工作类型</text>
            <text class="text-[32rpx] font-[500] text-[#333]">{{
              positionDetail?.workType
            }}</text>
          </view>
        </view>

        <view
          class="w-full px-[32rpx] box-border mt-[36rpx]"
          v-if="positionDetail?.staffCard"
        >
          <view
            class="w-full bg-gray-100 rounded-[24rpx] px-[32rpx] py-[24rpx] box-border flex flex-col gap-[24rpx]"
          >
            <view class="w-full h-[40rpx] flex flex-row items-center">
              <text class="text-[24rpx] text-[#888]">职位发布者</text>
            </view>

            <view class="w-full flex flex-row items-center gap-[24rpx]">
              <view
                class="w-[64rpx] h-[64rpx] shrink-0 flex flex-row items-center justify-center"
              >
                <image
                  class="w-[64rpx] h-[64rpx] border border-[#f5f5f5] border-[1rpx] rounded-[50%] overflow-hidden"
                  :src="positionDetail?.staffCard.avatar"
                ></image>
              </view>
              <view class="w-full flex flex-col justify-center gap-[4rpx]">
                <text class="text-[28rpx] font-[500] text-[#333]">{{
                  positionDetail?.staffCard.staffName
                }}</text>
                <text class="text-[20rpx] text-[#888]">{{
                  positionDetail?.staffCard.hrOnlineState
                }}</text>
              </view>
            </view>
          </view>
        </view>

        <view
          class="w-full px-[32rpx] box-border mt-[48rpx] flex flex-col gap-[24rpx]"
        >
          <view class="w-full flex flex-row items-center">
            <text class="text-[28rpx] font-[500] text-[#333]">技能要求</text>
          </view>

          <view class="w-full flex flex-row flex-wrap gap-[12rpx]">
            <view
              class="h-[50rpx] pl-[24rpx] pr-[24rpx] box-border rounded-[12rpx] overflow-hidden flex flex-row items-center shrink-0 bg-[#f5f5f5]"
              v-for="(skillTag, index) in positionDetail?.skillLabel"
              :key="index"
            >
              <text class="text-[24rpx] font-[500] text-[#333]">{{
                skillTag.value
              }}</text>
            </view>
          </view>
        </view>

        <view
          class="w-full px-[32rpx] box-border mt-[48rpx] flex flex-col gap-[24rpx]"
        >
          <view class="w-full flex flex-row items-center">
            <text class="text-[28rpx] font-[500] text-[#333]">职位描述</text>
          </view>

          <view class="w-full flex flex-row">
            <text class="text-[28rpx] text-[#333]">{{
              positionDetail?.jobSummary
            }}</text>
          </view>
        </view>

        <view class="w-full">
          <text class="text-[24rpx] text-[#333]">{{
            JSON.stringify(loginInfo, null, 2)
          }}</text>
        </view>

        <view
          class="w-full"
          :style="{ height: `calc(${safeBottom}px + 100rpx + 32rpx + 32rpx)` }"
        ></view>
        <view
          class="fixed bottom-0 left-0 z-[10] w-full bg-[#fff] flex flex-row items-center"
          :style="{
            height: `calc(${
              safeBottom == 0 ? '32rpx' : safeBottom + 'px'
            } + 100rpx)`,
          }"
        >
          <view
            class="w-full h-[100rpx] px-[32rpx] box-border flex flex-row items-center justify-center"
          >
            <view
              class="w-full h-[100rpx] bg-[#426eff] active:bg-[#335eff] rounded-[50rpx] flex flex-row items-center justify-center transition-all duration-300"
              v-if="isLoggedIn"
            >
              <text class="text-[30rpx] font-[500] text-[#fff]">立即投递</text>
            </view>
            <view
              class="w-full h-[100rpx] bg-[#426eff] active:bg-[#335eff] rounded-[50rpx] flex flex-row items-center justify-center transition-all duration-300"
              v-else
              @click="gotoLogin"
            >
              <text class="text-[30rpx] font-[500] text-[#fff]">去登录</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </Layout>
  </view>
</template>

<script setup lang="ts">
import CustomHeader from "@/components/custom-header/custom-header.vue";
import { SupportedPlatform } from "@/types";
import { onLoad } from "@dcloudio/uni-app";
import { computed, ref, watch } from "vue";
import { usePositionStore } from "../index/stores/position";
import Layout from "@/components/layout/layout.vue";
import { useTLoginStore } from "../index/stores/tlogin";
import { storeToRefs } from "pinia";

const positionStore = usePositionStore();
const tLoginStore = useTLoginStore();
const { customLoginInfo } = storeToRefs(tLoginStore);

const number = ref("");
const type = ref<SupportedPlatform>(SupportedPlatform.ZHAOPIN);

const safeBottom = uni.getSystemInfoSync().safeAreaInsets?.bottom || 0;

const defaultCompanyLogo = "../../static/icon_company.png";

const renderImage = ref<string>();

const loginInfo = computed(() => {
  return customLoginInfo.value[type.value];
});

const isLoggedIn = computed(() => {
  return loginInfo.value?.expireAt && loginInfo.value.expireAt > Date.now();
});

const positionDetail = computed(() => {
  return positionStore.getPositionDetail(number.value, type.value);
});

const renderTitle = computed(() => {
  return positionDetail.value?.name || "";
});

const renderAddress = computed(() => {
  return JSON.parse(
    positionDetail.value?.cardCustomJson || "{}"
  ).address?.replaceAll(" ", "·");
});

watch(
  () => positionDetail.value,
  (newVal) => {
    if (newVal) {
      renderImage.value = newVal.companyLogo || defaultCompanyLogo;
    }
  }
);

function handleImageError(e: any) {
  renderImage.value = defaultCompanyLogo;
}

onLoad((options: any) => {
  number.value = options.number;
  type.value = options.type as SupportedPlatform;
});

function gotoLogin() {
  uni.navigateTo({
    url: "/pages/thirdpart-login/thirdpart-login?type=" + type.value,
    events: {
      loginSuccess: (data: any) => {
        // console.log(">>>>>>>>>> loginSuccess", data);
      },
    },
  });
}
</script>

<style scoped></style>
