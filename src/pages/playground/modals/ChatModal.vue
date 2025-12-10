<template>
  <view class="w-[100vw] h-[100vh] flex flex-row items-end justify-center">
    <CustomHeader bg-color="transparent" />

    <Layout :hasHeader="true">
      <view class="relative w-full h-full flex flex-col">
        <view class="w-full h-[32rpx] shrink-0"></view>
        <view class="w-full h-[386rpx] px-[32rpx] box-border shrink-0 transition-all duration-300"
          @click="previewImage(info?.image ? [info?.image] : [])"
          :class="[modalInitialized ? 'opacity-100' : 'opacity-0']">
          <view
            class="relative w-full h-full rounded-[24rpx] overflow-hidden bg-[#fff] shadow-[0_8rpx_32rpx_rgba(0,0,0,0.15)] flex flex-row items-center justify-center">
            <image class="w-full h-full" :src="info?.image" mode="aspectFit"></image>
            <view
              class="absolute bottom-[32rpx] right-[32rpx] w-[80rpx] h-[80rpx] bg-[#fff] shadow-[0_4rpx_24rpx_rgba(0,0,0,0.1)] rounded-[50%] flex flex-row items-center justify-center">
              <image class="w-[42rpx] h-[42rpx]" src="@static/icon_magnify_black.png" mode="aspectFit" />
            </view>
          </view>
        </view>

        <scroll-view class="w-full p-[32rpx] box-border" type="custom" scroll-y
          :style="{ height: `calc(100% - 418rpx - 120rpx - 100rpx - ${safeBottom}px)` }">
          <view class="w-full flex flex-col gap-[24rpx]">
            <view
              class="relative w-full max-h-full pt-[32rpx] box-border rounded-[32rpx] overflow-hidden bg-[#07c160] shadow-[0_8rpx_32rpx_rgba(0,0,0,0.15)] flex flex-row transition-all duration-300 will-change-height"
              :style="{ paddingBottom: isRecording ? '72rpx' : '32rpx' }">
              <view class="w-full max-h-full px-[32rpx] box-border overflow-auto">
                <textarea type="text" class="text-[#222] text-[30rpx]" :cursor-spacing="32" v-model="asrText"
                  :disabled="isRecording" :focus="focused" auto-height @blur="handleBlur" />
              </view>

              <view
                class="absolute left-0 bottom-0 w-full h-[72rpx] pr-[24rpx] box-border flex flex-row items-center justify-end"
                v-if="isRecording">
                <image src="https://img.liangqy.com/crawlerjet/img/sound-wave.gif" class="w-[50rpx] h-[50rpx]"></image>
                <image src="https://img.liangqy.com/crawlerjet/img/sound-wave.gif" class="w-[50rpx] h-[50rpx]"></image>
              </view>
            </view>

            <view
              class="w-full py-[32rpx] box-border rounded-[32rpx] overflow-hidden bg-[#ffffff] shadow-[0_8rpx_32rpx_rgba(0,0,0,0.15)] flex flex-row"
              v-if="aiAnalyzing || aiResult">
              <view class="w-full px-[32rpx] box-border transition-all duration-300 will-change-height">
                <view class="flex flex-col gap-[16rpx]" v-if="aiAnalyzing">
                  <image src="https://img.liangqy.com/crawlerjet/img/loading.gif" class="w-[78rpx] h-[30rpx]"></image>
                  <text class="text-[#222] text-[24rpx] animate-pulse">AI正在分析中...</text>
                </view>
                <view class="flex flex-col gap-[16rpx]" v-else>
                  <view class="w-full flex flex-row items-baseline gap-[12rpx]">
                    <text class="text-[green] text-[48rpx]">{{ aiResult?.total_score }}分</text>
                    <text class="text-[#222] text-[24rpx]">{{ renderScore(aiResult?.total_score || 0) }}</text>
                  </view>
                  <text class="text-[#222] text-[30rpx]">{{ aiResult?.response_text }}</text>
                </view>
              </view>
            </view>
            <view class="w-full h-[64rpx]"></view>
          </view>
        </scroll-view>

        <view
          class="absolute left-0 w-full h-[120rpx] pr-[32rpx] box-border flex flex-row items-center justify-end gap-[32rpx]"
          :style="{ bottom: `calc(100rpx + ${safeBottom}px)` }">
          <view
            class="h-[88rpx] px-[32rpx] box-border rounded-[44rpx] bg-[rgba(255,255,255,0.2)] active:bg-[rgba(255,255,255,0.3)] flex flex-row items-center justify-center transition-all duration-300"
            @click="closeModal">
            <text class="text-[#fff] text-[32rpx]">取消</text>
          </view>
          <view
            class="h-[88rpx] px-[64rpx] box-border bg-[#fff] active:bg-[#f5f5f5] rounded-[44rpx] flex flex-row items-center justify-center transition-all duration-300"
            :class="[aiAnalyzing || aiResult ? 'opacity-10 pointer-events-none' : 'opacity-100 pointer-events-auto']"
            @click="sendMessage">
            <text class="text-[#222] text-[32rpx]">发送</text>
          </view>
        </view>
        <view class="absolute left-0 bottom-0 w-full" :style="{ height: `calc(100rpx + ${safeBottom}px)` }">

        </view>
      </view>
    </Layout>


  </view>
</template>

<script setup lang="ts">
import { EModalComponent } from './types';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import TencentAsrService from "@/services/tencent_asr";
import type { AsrResult } from "@/services/tencent_asr";
import type { IAIResult, IQuestion } from '@/types';
import { requestAnswerQuestion } from '@/request';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import CustomHeader from '@/components/custom-header/custom-header.vue';
import Layout from '@/components/layout/layout.vue';
import { previewImage } from '@/utils';

interface Props {
  isSpeaking: boolean;
  info?: IQuestion;
}

const props = defineProps<Props>();

const userStore = useUserStore();
const { loginInfo, isLoggedIn } = storeToRefs(userStore);

const safeBottom = uni.getWindowInfo().safeAreaInsets?.bottom || 0;

const tencentAsrService = new TencentAsrService();

const asrText = ref('');
const asrDuration = ref(0);
const asrResult = ref<AsrResult>();

const isRecording = ref<boolean>(false);

const focused = ref(false);

const modalInitialized = ref(false);

const aiResult = ref<IAIResult>();
// 是否正在分析
const aiAnalyzing = ref<boolean>(false);

const renderScore = computed(() => {
  return function (score: number) {
    /**
     
不合格： 总分 < 60

待改善： 60 ≤ 总分 < 90

优秀： 90 ≤ 总分 < 99

完美： 总分 ≥ 99
     */
    if (score < 60) {
      return '很遗憾';
    } else if (score < 90) {
      return '还需努力';
    } else if (score < 99) {
      return '恭喜你';
    } else {
      return '完美';
    }
  }
})

watch(() => props.isSpeaking, (newVal) => {
  if (!newVal) {
    stopRecognize();
  }
});

onMounted(() => {
  tencentAsrService.onResult((result: AsrResult) => {
    // console.log('>>>>>>> result', result);
    asrResult.value = result;
    if (!result.isFinal) {
      asrText.value = result.text || '';
      asrDuration.value = result.endTime || 0;
    }
  });
  tencentAsrService.onError((error) => {
    // console.log('>>>>>>> error', error);
  });
  tencentAsrService.onStatus((status) => {
    if (status === '正在录音识别中...') {
      isRecording.value = true;
    } else if (status === '识别结束') {
      isRecording.value = false;
    }
  });
  const t = setTimeout(async () => {
    clearTimeout(t);
    await startRecognize();

    modalInitialized.value = true;
  }, 300)
})

async function startRecognize() {
  if (props.isSpeaking) {
    await tencentAsrService.startRecognition();
    isRecording.value = tencentAsrService.getStatus().isRecording;
  } else {
    focused.value = true;
  }
}

function stopRecognize() {
  nextTick(() => {
    tencentAsrService.stopRecognition();
  })
}

function closeModal() {
  uni.$emit('close-modal', {
    component: EModalComponent.CHAT_MODAL,
  });
}

async function sendMessage() {
  if (!asrText.value) {
    uni.showToast({
      title: '请输入内容',
      icon: 'none',
    });
    focused.value = true;
    return;
  }

  if (!props.info) {
    return;
  }

  if (!isLoggedIn.value) {
    uni.showToast({
      title: '请先登录',
      icon: 'none',
    });
    return;
  }

  aiAnalyzing.value = true;

  const res = await requestAnswerQuestion({
    userId: loginInfo.value.id,
    questionId: props.info.id,
    answer: asrText.value,
    answerTime: 0,
    thinkingTime: 0,
  });

  const t = setTimeout(() => {
    // const res = {
    //   "code": 200,
    //   "data": { "user_description": "这是一个橘子", "score_breakdown": { "visual_accuracy": { "score": 0, "totalScore": 20, "label": "图文一致", "reasoning": "描述称物品为“橘子”，但图片中实际展示的是一支黄色铅笔（带有金属笔帽和红色橡皮擦），两者完全不符，存在根本性错误。" }, "completeness_observation": { "score": 0, "totalScore": 20, "label": "内容完整", "reasoning": "描述中未提及图片中铅笔的任何关键特征（如黄色笔杆、尖细笔头、金属套、红色橡皮擦等），反而错误指向不存在的“橘子”，遗漏了所有可见的核心信息。" }, "language_clarity": { "score": 12, "totalScore": 16, "label": "语言清晰", "reasoning": "语句“这是一个橘子”语法正确、语言通顺，无明显拼写或语法错误，表达简洁易懂，符合基础的语言规范。" }, "structure_logic": { "score": 12, "totalScore": 16, "label": "结构逻辑", "reasoning": "描述以简单陈述句呈现，虽结构单一但逻辑连贯（直接点明物品名称），未出现混乱或矛盾的信息组织。" }, "detail_vividness": { "score": 0, "totalScore": 16, "label": "细节生动", "reasoning": "描述仅用“一个橘子”笼统概括，未使用任何形容词、比喻或细节描写（如形状、颜色、质感等），无法让读者形成清晰的画面感，缺乏生动性。" }, "inference_value": { "score": 0, "totalScore": 12, "label": "推理价值", "reasoning": "描述未基于图片细节做出任何合理推断（如铅笔的材质、用途、新旧程度等），也未解释物品可能的场景或功能，仅错误陈述名称，信息价值极低。" } }, "total_score": 24, "rating_grade": "不合格", "overall_feedback": { "strengths": "语言表述通顺，句子结构简单明了，无明显的语法或拼写错误。", "inaccuracies_or_omissions": "1. 核心错误：将图片中的铅笔误判为橘子，完全不符合实际内容；2. 信息缺失：未描述铅笔的任何外观特征（如黄色笔身、金属笔帽、红色橡皮擦、尖细笔头等），遗漏了所有关键视觉信息。", "suggestions_for_improvement": "1. 先确认物品真实性：仔细观察图片中的物体形态、颜色、部件等，确保判断准确（此图中是铅笔而非橘子）；2. 补充细节描述：围绕物体的外观特征（如形状、颜色、材质、特殊部件等）展开，例如“这是一支黄色的铅笔，笔杆光滑，末端有银色金属套和红色橡皮擦”；3. 加入合理推断：基于细节推测物品的用途或状态，如“这支铅笔看起来较新，适合书写或绘画”。" }, "response_text": "你好，我们来分析一下这个描述。首先，你说的‘这是一个橘子’和图片里的内容完全不符，因为图片显示的是一支黄色的铅笔，不是橘子哦。从评分来看，你在语言上挺通顺的，但内容和图片差太多了，没说到铅笔的样子，也没做任何合理的推断。建议你下次先仔细看看图片里的东西到底是什么，再描述它的颜色、形状这些细节，这样会更准确。" }
    // }

    if (res.code == 200) {
      aiResult.value = res.data as IAIResult;
    }

    aiAnalyzing.value = false;
  }, 500)
}

function handleBlur() {
  focused.value = false;
}
</script>

<style scoped></style>