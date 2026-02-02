export enum EConfirmAction {
  CONFIRM_STORY = "confirm-story",
  CONFIRM_ROLES = "confirm-roles",
  CONFIRM_SCENES = "confirm-scenes",
  CONFIRM_COVER = "confirm-cover",
  FINISHED = "finished",
}

export interface IStory {
  id: string;
  title: string;
  content: string | string[];
}

export interface ICreatePictureBookFormData {
  theme: string;
  storyStyle: string;
  pictureStyle: string;
  length: number;
  language: string;
  roleCount: number;
  sceneCount: number;
  ratio: string;
}
