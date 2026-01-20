export interface IQuestion {
  id: string;
  title: string;
  image: string;
  level: number;
  type: "daily" | "normal" | string;
  rate: number;
  createAt: string;
  date: string;
  creator: "admin" | string;
}

export interface ILevel {
  name: string;
  desc: string;
  level: number;
}

export interface IAIResultDimension {
  score: number;
  totalScore: number;
  label: string;
  reasoning: string;
}

export interface IAIResultScoreBreakdown {
  visual_accuracy: IAIResultDimension;
  completeness_observation: IAIResultDimension;
  language_clarity: IAIResultDimension;
  structure_logic: IAIResultDimension;
  detail_vividness: IAIResultDimension;
  inference_value: IAIResultDimension;
}

export interface IAIResultOverallFeedback {
  strengths: string;
  inaccuracies_or_omissions: string;
  suggestions_for_improvement: string;
}
export interface IAIResult {
  user_description: string;
  score_breakdown: IAIResultScoreBreakdown;
  total_score: number;
  rating_grade: string;
  overall_feedback: IAIResultOverallFeedback;
  response_text: string;
}

export interface IAnswer {
  id: string;
  userId: string;
  questionId: string;
  answer: string;
  answerTime: number;
  thinkingTime: number;
  createAt: string;
  attemptNumber: number;
  aiAnswer: IAIResult;
  points: number;
  type: "daily" | "normal" | string;
}

export interface IAnswerHistory extends IAnswer {
  question: IQuestion;
}

export interface IRoleItem {
  id: string;
  taskId: string;
  name: string;
  prompt: string;
  prompt_en: string;
  recordId: string;
  url: string;
}

export interface ISceneItem {
  id: string;
  index: number;
  taskId: string;
  name: string;
  // 当前分镜对应的故事原文
  content: string;
  prompt: string;
  prompt_en: string;
  recordId: string;
  roleIds: string[];
  roleUrls: string[];
  url: string;
}

export interface IConfigItem {
  ratio: string;
  theme: string;
  length: number;
  storyId: string;
  language: string;
  roleCount: number;
  sceneCount: number;
  storyStyle: string;
  pictureStyle: string;
  redisExpiredTime: number;
  autoConfirmedRole: boolean;
  autoConfirmedScene: boolean;
  autoConfirmedStory: boolean;
}

export interface ICoverItem {
  url: string;
  prompt: string;
  taskId: string;
  recordId: string;
  prompt_en: string;
}

export interface IAuthorItem {
  id: string;
  username: string;
  phonenum: string;
  nickname: string;
  avatar: string;
  gender: string;
  email: string;
}

export interface IPictureBook {
  id: string;
  likes: number;
  views: number;
  title: string;
  content: string;
  authorId: string;
  status: number;
  config: IConfigItem;
  createAt: string;
  roles?: IRoleItem[];
  scenes?: ISceneItem[];
  cover?: ICoverItem;
  title_zh?: string;
  content_zh?: string;
  author?: IAuthorItem;
}

export interface IPBAudioItem {
  sceneId: string;
  url: string;
}
export interface IPBAudio {
  id: string;
  pbId: string;
  voiceType: number;
  audios: IPBAudioItem[];
}
