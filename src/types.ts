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
