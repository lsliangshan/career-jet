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

export interface IConfirmSceneData {
  id: string;
  index: number;
  taskId: string;
  name: string;
  // 分镜脚本描述。简洁说明画面构图、角色动作和情绪。
  script: string;
  // 当前分镜对应的故事原文
  content: string;
  prompt: string;
  prompt_en: string;
  recordId: string;
  roleIds: string[];
  roleUrls: string[];
}

export interface IConfirmSceneItem {
  code: number;
  msg: string;
  data: IConfirmSceneData;
}

export interface IConfirmSceneInfo {
  id: string;
  confirmUrl: string;
  scenes: IConfirmSceneItem[];
}

export interface IConfirmCoverData {
  id: string;
  taskId: string;
  prompt: string;
  prompt_en: string;
  recordId: string;
  url?: string;
}

export interface IConfirmCoverItem {
  code: number;
  msg: string;
  data: IConfirmCoverData;
}
export interface IConfirmCoverInfo {
  id: string;
  confirmUrl: string;
  cover: IConfirmCoverItem;
}

export enum EModalComponent {
  CONFIRM_STORY_MODAL = "ConfirmStoryModal",
  CONFIRM_ROLES_MODAL = "ConfirmRolesModal",
  CONFIRM_SCENES_MODAL = "ConfirmScenesModal",
  CONFIRM_COVER_MODAL = "ConfirmCoverModal",
  SELECT_STYLE_MODAL = "SelectStyleModal",
  SELECT_THEME_MODAL = "SelectThemeModal",
  SELECT_LANGUAGE_MODAL = "SelectLanguageModal",
  SELECT_RATIO_MODAL = "SelectRatioModal",
  CHOOSE_THEME_MODAL = "ChooseThemeModal",
  CHOOSE_STORY_STYLE_MODAL = "ChooseStoryStyleModal",
  CHOOSE_PICTURE_STYLE_MODAL = "ChoosePictureStyleModal",
  CHOOSE_LANGUAGE_MODAL = "ChooseLanguageModal",
  CHOOSE_RATIO_MODAL = "ChooseRatioModal",
  REGENERATE_ROLE_MODAL = "RegenerateRoleModal",
  REGENERATE_SCENE_MODAL = "RegenerateSceneModal",
  REGENERATE_COVER_MODAL = "RegenerateCoverModal",
}
