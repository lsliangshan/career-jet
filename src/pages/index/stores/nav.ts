import { defineStore } from "pinia";
import { ref } from "vue";

export const useNavStore = defineStore("nav", () => {
  const currentIndex = ref(1);

  function changeTab(index: number) {
    currentIndex.value = index;
  }

  return {
    currentIndex,
    changeTab,
  };
});
