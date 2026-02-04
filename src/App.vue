<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { useUserStore } from "@/stores/user";
onLaunch(() => {
  const userStore = useUserStore();
  userStore.init();

  uni.loadFontFace({
    family: "cinzel",
    global: true,
    source:
      'url("http://img09.zhaopin.com/2012/other/mobile/campus/clive/8vIJ7ww63mVu7gt79mT7PkRXMw.woff2")',
    desc: {
      weight: "700",
    },
    complete: () => {},
  });

  console.log("App Launch");
});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
</script>
<style></style>
