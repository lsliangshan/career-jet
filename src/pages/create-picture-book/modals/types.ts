export interface IConfirmStoryInfo {
  id: string;
  confirmUrl: string;
  story: {
    title: string;
    content: string;
    title_zh: string;
    content_zh: string;
  };
}

export interface IConfirmRoleItem {
  code: number;
  msg: string;
  data: {
    id: string;
    name: string;
    prompt: string;
    prompt_en: string;
    recordId: string;
    taskId: string;
  };
}

export interface IConfirmRoleInfo {
  id: string;
  confirmUrl: string;
  roles: IConfirmRoleItem[];
}

export enum EModalComponent {
  CONFIRM_STORY_MODAL = "ConfirmStoryModal",
  CONFIRM_ROLE_MODAL = "ConfirmRoleModal",
  CONFIRM_SCENE_MODAL = "ConfirmSceneModal",
}
