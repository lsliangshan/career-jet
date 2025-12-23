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
