import { type IPictureBook } from "@/types";
import { createPictureBookSteps } from "@/config/config";
import { ProfileDetailType } from "@/stores/user";

export function navigateBack(options?: { complete?: () => void }) {
  uni.navigateBack({
    complete: () => {
      options?.complete?.();
    },
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
  } else {
    stepIndex = createPictureBookSteps.length - 1;
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

export function navigateToPictureBookDetail(
  pb: IPictureBook,
  options?: {
    method?: "navigateTo" | "redirectTo";
    complete?: () => void;
  }
) {
  const { method = "navigateTo" } = options || {};
  const horizontalUrl =
    "/pages/picture-book-detail-horizontal/picture-book-detail-horizontal";
  const verticalUrl = "/pages/picture-book-detail/picture-book-detail";
  let url = "";
  if (
    Number(pb.config.ratio.split(":")[0]) >
    Number(pb.config.ratio.split(":")[1])
  ) {
    url = horizontalUrl;
  } else {
    url = verticalUrl;
  }
  if (method === "navigateTo") {
    uni.navigateTo({
      url: `${url}?id=${pb.id}`,
      complete: () => {
        options?.complete?.();
      },
    });
  } else {
    uni.redirectTo({
      url: `${url}?id=${pb.id}`,
      complete: () => {
        options?.complete?.();
      },
    });
  }
}

export function navigateToPictureBookDraftList() {
  uni.navigateTo({
    url: `/pages/picture-book-list/picture-book-list?type=draft`,
  });
}

export function navigateToPictureBookList(
  type: "draft" | "final" | "review",
  options?: {
    method?: "navigateTo" | "redirectTo";
    complete?: () => void;
  }
) {
  const { method = "navigateTo" } = options || {};
  const url = `/pages/picture-book-list/picture-book-list?type=${type}`;
  if (method === "navigateTo") {
    uni.navigateTo({
      url,
      complete: () => {
        options?.complete?.();
      },
    });
  }
}

export function navigateToPictureBookReviewList(
  type: "approved" | "unapproved" | "default",
  options?: {
    method?: "navigateTo" | "redirectTo";
    complete?: () => void;
  }
) {
  const { method = "navigateTo" } = options || {};
  const url = `/pages/picture-book-review-list/picture-book-review-list?type=${type}`;
  if (method === "navigateTo") {
    uni.navigateTo({
      url,
      complete: () => {
        options?.complete?.();
      },
    });
  }
}

export function navigateToProfileDetail(options?: {
  method?: "navigateTo" | "redirectTo";
  complete?: () => void;
}) {
  const { method = "navigateTo" } = options || {};
  const url = "/pages/profile-detail/profile-detail";
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

export function navigateToEditProfileDetail(
  type: ProfileDetailType,
  options?: {
    method?: "navigateTo" | "redirectTo";
    complete?: () => void;
  }
) {
  const { method = "navigateTo" } = options || {};
  const url = "/pages/edit-profile-detail/edit-profile-detail";
  if (method === "navigateTo") {
    uni.navigateTo({
      url: `${url}?type=${type}`,
      complete: () => {
        options?.complete?.();
      },
    });
  } else {
    uni.redirectTo({
      url: `${url}?type=${type}`,
      complete: () => {
        options?.complete?.();
      },
    });
  }
}
