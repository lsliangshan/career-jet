import { defineStore, storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";
import type { IQuestion } from "@/types";
import { isSameDay } from "@/utils/date";
import {
  requestGetAiAnswer,
  requestGetDailyQuestion,
  requestGetQuestionByLevel,
  requestGetQuestionDetailById,
} from "@/request";
import { useProfileStore } from "./profile";
import { useUserStore } from "./user";
import { GameType } from "@/config/config";

const LocalDailyQuestionsKey = "localDailyQuestions";

function getLocalDailyQuestions() {
  const localDailyQuestions = uni.getStorageSync(LocalDailyQuestionsKey);

  try {
    const localData = JSON.parse(localDailyQuestions);
    const date = localData.date;
    if (date && isSameDay(date, Date.now())) {
      return localData.list;
    } else {
      uni.removeStorageSync(LocalDailyQuestionsKey);
      return [];
    }
  } catch (error) {
    uni.removeStorageSync(LocalDailyQuestionsKey);
    return [];
  }
}

function setLocalDailyQuestions(questions: IQuestion[]) {
  uni.setStorageSync(
    LocalDailyQuestionsKey,
    JSON.stringify({
      date: Date.now(),
      list: questions,
    })
  );
}

export const useQuestionStore = defineStore("question", () => {
  const question = ref<IQuestion[]>([]);

  const profileStore = useProfileStore();
  const { level } = storeToRefs(profileStore);

  const userStore = useUserStore();
  const { loginInfo } = storeToRefs(userStore);

  // 所有的每日挑战题目
  const dailyQuestions = ref<IQuestion[]>([]);

  const dailyQuestion = computed(() => {
    const item = dailyQuestions.value.find(
      (item) => item.level === level.value.level
    );
    return item;
  });

  onMounted(async () => {});

  init();

  async function init() {
    dailyQuestions.value = getLocalDailyQuestions();

    if (dailyQuestions.value.length === 0) {
      await getDailyQuestion();
    }
  }

  function getDailyQuestion() {
    return new Promise(async (resolve) => {
      const res = await requestGetDailyQuestion();
      if (res.code === 200) {
        setLocalDailyQuestions(res.data.list);
        dailyQuestions.value = res.data.list;
      }
      resolve(true);
    });
  }

  function getQuestionDetailById(id: string): Promise<IQuestion | null> {
    return new Promise(async (resolve) => {
      let questionDetail: IQuestion | null = null;
      const index = dailyQuestions.value.findIndex((item) => item.id === id);
      if (index !== -1) {
        questionDetail = dailyQuestions.value[index];
      } else {
        const res = await requestGetQuestionDetailById({
          id,
        });
        if (res.code === 200) {
          questionDetail = res.data;
        }
      }
      resolve(questionDetail);
    });
  }

  function getQuestionDetailByLevel(level: number): Promise<IQuestion | null> {
    return new Promise(async (resolve) => {
      const res = await requestGetQuestionByLevel({
        userId: loginInfo.value?.id,
        level,
        type: GameType.normal,
      });
      if (res.code === 200) {
        resolve(res.data);
      } else {
        resolve(null);
      }
    });
  }

  function getAiAnswerById(id: string) {
    return new Promise(async (resolve) => {
      const res = await requestGetAiAnswer({
        questionId: id,
      });
      resolve(res);
    });
  }

  return {
    question,
    dailyQuestion,
    getQuestionDetailById,
    getQuestionDetailByLevel,
    getAiAnswerById,
  };
});
