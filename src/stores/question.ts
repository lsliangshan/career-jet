import { defineStore } from "pinia";
import { computed, onMounted, ref } from "vue";
import type { IQuestion } from "@/types";
import { isSameDay } from "@/utils/date";
import { requestGetDailyQuestion } from "@/request";

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

  // 所有的每日挑战题目
  const dailyQuestions = ref<IQuestion[]>([]);

  const dailyQuestion = computed(() => {
    return dailyQuestions.value[0];
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
      const res = await requestGetDailyQuestion({
        level: 1,
      });
      if (res.code === 200) {
        setLocalDailyQuestions(res.data.list);
        dailyQuestions.value = res.data.list;
      }
      resolve(true);
    });
  }

  function getQuestionDetailById(id: string): Promise<IQuestion | null> {
    return new Promise((resolve) => {
      let questionDetail: IQuestion | null = null;
      console.log(">>>>>>> dailyQuestions", dailyQuestions.value);
      const index = dailyQuestions.value.findIndex((item) => item.id === id);
      if (index !== -1) {
        questionDetail = dailyQuestions.value[index];
      }
      resolve(questionDetail);
    });
  }

  return {
    question,
    dailyQuestion,
    getQuestionDetailById,
  };
});
