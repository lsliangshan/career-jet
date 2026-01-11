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

export interface IConfirmRoleData {
  id: string;
  taskId: string;
  name: string;
  prompt: string;
  prompt_en: string;
  recordId: string;
}

export interface IConfirmRoleItem {
  code: number;
  msg: string;
  data: IConfirmRoleData;
}

export interface IConfirmRoleInfo {
  id: string;
  confirmUrl: string;
  roles: IConfirmRoleItem[];
}

export enum EModalComponent {
  CONFIRM_STORY_MODAL = "ConfirmStoryModal",
  CONFIRM_ROLES_MODAL = "ConfirmRolesModal",
  CONFIRM_SCENE_MODAL = "ConfirmScenesModal",
}
