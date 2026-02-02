import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { useNavStore } from "@/stores/nav";

const userStore = useUserStore();
const { isLoggedIn } = storeToRefs(userStore);

const navStore = useNavStore();

export function validateLoggedIn() {
  if (!isLoggedIn.value) {
    uni.showToast({
      title: "请先登录",
      icon: "none",
    });
    navStore.changeTab(3);
    throw new Error("请先登录");
  }
}
