import { type IPictureBook } from "@/types";
import { createPictureBookSteps } from "@/config/config";

export function navigateBack() {
  uni.navigateBack({
    fail: () => {
      uni.reLaunch({
        url: "/pages/index/index",
      });
    },
  });
}

export function navigateToCreatePictureBook(options?: {
  method?: "navigateTo" | "redirectTo";
  complete?: () => void;
}) {
  const { method = "navigateTo" } = options || {};
  const url = `/pages/create-picture-book/create-picture-book`;
  if (method === "navigateTo") {
    uni.navigateTo({
      url,
      complete: () => {
        options?.complete?.();
      },
    });
  } else {
    uni.redirectTo({
      url,
      complete: () => {
        options?.complete?.();
      },
    });
  }
}

function getEditAction(pb: IPictureBook) {
  let stepIndex = -1;
  if (!pb.content) {
    stepIndex = 0;
  } else if (!pb.roles || pb.roles.length === 0) {
    stepIndex = 1;
  } else if (!pb.scenes || pb.scenes.length === 0) {
    stepIndex = 2;
  } else if (!pb.cover || Object.keys(pb.cover).length === 0) {
    stepIndex = 3;
  }
  return createPictureBookSteps[stepIndex].value;
}

export function navigateToEditPictureBook(
  pb: IPictureBook,
  options?: {
    method?: "navigateTo" | "redirectTo";
    complete?: () => void;
  }
) {
  const { method = "navigateTo" } = options || {};
  const url = `/pages/create-picture-book/create-picture-book`;

  if (method === "navigateTo") {
    uni.navigateTo({
      url: `${url}?id=${pb.id}&action=${getEditAction(pb)}`,
      complete: () => {
        options?.complete?.();
      },
    });
  } else {
    uni.redirectTo({
      url: `${url}?id=${pb.id}&action=${getEditAction(pb)}`,
      complete: () => {
        options?.complete?.();
      },
    });
  }
}
