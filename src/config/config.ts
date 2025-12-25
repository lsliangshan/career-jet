// 图标  https://www.figma.com/design/awcDBnJQrEtyp1pyqbNudX/Iconicool-%7C-Free-Iconset--Community-?node-id=201-2755&t=a295C2jBOqBU2wA2-0

export const DEFAULT_AVATAR =
  "https://img.liangqy.com/crawlerjet/img/default_avatar.png";

export const DEFAULT_AI_AVATAR =
  "https://img.liangqy.com/crawlerjet/img/ai_avatar.png";

export enum GameType {
  // 快速挑战
  normal = "normal",
  // 今日挑战
  daily = "daily",
}

export const tabbars = [
  {
    name: "home",
    label: "大厅",
    icon: "../../../static/tabs/tab_home_unselect.png",
    activeIcon: "../../../static/tabs/tab_home_select.png",
  },
  // {
  //   name: "deliver",
  //   label: "游戏",
  //   icon: "../../../static/tabs/tab_game_unselect.png",
  //   activeIcon: "../../../static/tabs/tab_game_select.png",
  // },
  {
    name: "profile",
    label: "我的",
    icon: "../../../static/tabs/tab_profile_unselect.png",
    activeIcon: "../../../static/tabs/tab_profile_select.png",
  },
];

export const supportedLevels = [
  {
    name: "新叶视界",
    desc: "初窥画面，描述基础内容。如嫩芽初绽，清晰即可。",
    level: 1,
  },
  {
    name: "溪流之眼",
    desc: "细致观察，捕捉动态与关联。如溪流蜿蜒，需叙述脉络。",
    level: 2,
  },
  {
    name: "光影画师",
    desc: "把握氛围与情感，用语言调配光影。挑战诗意与准确性的平衡。",
    level: 3,
  },
  {
    name: "万物共鸣",
    desc: "超越表象，描述隐喻、文化符号或深层叙事。要求洞察与共情。",
    level: 4,
  },
  {
    name: "灵魂棱镜",
    desc: "以极致创意重构图像，以语言折射万象之魂。",
    level: 5,
  },
];

export const ThemeColors = {
  primary: "#FF9A3C",
  primary100: "rgba(255, 154, 60, 0.1)",
  primary200: "rgba(255, 154, 60, 0.2)",
  primary300: "rgba(255, 154, 60, 0.3)",
  primary400: "rgba(255, 154, 60, 0.4)",
  primary500: "rgba(255, 154, 60, 0.5)",
  primary600: "rgba(255, 154, 60, 0.6)",
  primary700: "rgba(255, 154, 60, 0.7)",
  primary800: "rgba(255, 154, 60, 0.8)",
  primary900: "rgba(255, 154, 60, 0.9)",
  accent: "#00CC88",
  success: "#00CC88",
  warning: "#FF9500",
  error: "#FF3B30",
  text: {
    title: "#1A1A1A",
    body: "#666666",
    label: "#999999",
    disabled: "#C8C8C8",
    placeholder: "#C8C8C8",
    white: "#FFFFFF",
  },
  border: "#f8f8f8",
  bgCard: "#FFFFFF",
  bg: "#F5F5F5",
};

export const moralities = [
  {
    category: "基础人格与品德",
    category_en: "Foundational Character and Morality",
    items: [
      {
        name: "诚实与正直",
        name_en: "Honesty and Integrity",
        description: [
          "让孩子理解诚信的重要性，学会对自己的言行负责。",
          "通过日常小事树立榜样，鼓励说真话，即使犯错也要勇于承认。",
        ],
        description_en: [
          "Children learn the importance of sincerity and taking responsibility for their words and actions.",
          "Model through daily interactions, encouraging truth-telling and owning up to mistakes.",
        ],
      },
      {
        name: "责任感",
        name_en: "Responsibility",
        description: [
          "从分担家务、照顾宠物开始，让孩子学会承担。",
          "引导他们对自己的选择和行为后果负责。",
        ],
        description_en: [
          "Start with chores and pet care to teach accountability.",
          "Guide them to take responsibility for their choices and consequences.",
        ],
      },
      {
        name: "自律",
        name_en: "Self-Discipline",
        description: [
          "能够控制自己的冲动，专注于长期目标而非短期享乐。",
          "培养时间管理能力，学会制定并遵守计划。",
        ],
        description_en: [
          "Ability to control impulses and focus on long-term goals over short-term gratification.",
          "Develop time-management skills and the ability to make and follow plans.",
        ],
      },
    ],
  },
  {
    category: "社会适应与情感能力",
    category_en: "Social Adaptation and Emotional Intelligence",
    items: [
      {
        name: "同理心与善良",
        name_en: "Empathy and Kindness",
        description: [
          "引导孩子关注他人感受，学会换位思考。",
          "通过帮助他人、分享和合作，培养关怀他人的能力。",
        ],
        description_en: [
          "Guide children to consider others' feelings and practice perspective-taking.",
          "Cultivate caring through helping, sharing, and cooperating.",
        ],
      },
      {
        name: "尊重与包容",
        name_en: "Respect and Inclusivity",
        description: [
          "尊重不同背景、观点和文化，理解世界的多样性。",
          "学会礼貌沟通，倾听他人意见。",
        ],
        description_en: [
          "Respect diverse backgrounds, viewpoints, and cultures; understand world diversity.",
          "Learn polite communication and active listening.",
        ],
      },
      {
        name: "合作与团队精神",
        name_en: "Cooperation and Team Spirit",
        description: [
          "在集体活动中学习协商、分工与共赢。",
          "明白个人的成功可以与集体目标相结合。",
        ],
        description_en: [
          "Learn negotiation, division of labor, and mutual success in group activities.",
          "Understand how personal success aligns with collective goals.",
        ],
      },
    ],
  },
  {
    category: "心理韧性与成长思维",
    category_en: "Psychological Resilience and Growth Mindset",
    items: [
      {
        name: "抗挫折能力",
        name_en: "Resilience (Anti-Frustration Ability)",
        description: [
          "允许孩子经历失败，引导他们从中学习而非逃避。",
          "通过挑战性任务培养坚持和解决问题的勇气。",
        ],
        description_en: [
          "Allow children to experience failure, guiding them to learn rather than avoid.",
          "Develop perseverance and problem-solving courage through challenging tasks.",
        ],
      },
      {
        name: "乐观与积极心态",
        name_en: "Optimism and Positive Mindset",
        description: [
          "教会孩子用积极角度看待困难，培养希望感。",
          "避免过度批评，鼓励他们发现自己的优势。",
        ],
        description_en: [
          "Teach children to view difficulties positively and cultivate hope.",
          "Avoid excessive criticism; encourage them to recognize their strengths.",
        ],
      },
      {
        name: "成长型思维",
        name_en: "Growth Mindset",
        description: [
          "相信能力可以通过努力提升，而非固定不变。",
          "鼓励尝试新事物，将挑战视为学习机会。",
        ],
        description_en: [
          "Believe abilities can be developed through effort, not fixed.",
          "Encourage trying new things and viewing challenges as opportunities.",
        ],
      },
    ],
  },
  {
    category: "认知与学习能力",
    category_en: "Cognitive and Learning Abilities",
    items: [
      {
        name: "好奇心与探索精神",
        name_en: "Curiosity and Exploratory Spirit",
        description: [
          "保护孩子的提问欲望，鼓励主动探索未知。",
          "通过阅读、实践和大自然激发学习兴趣。",
        ],
        description_en: [
          "Protect children's desire to ask questions; encourage active exploration.",
          "Stimulate learning interest through reading, hands-on activities, and nature.",
        ],
      },
      {
        name: "批判性思维",
        name_en: "Critical Thinking",
        description: [
          "鼓励独立思考，学会提问、分析和判断信息。",
          "讨论社会现象或故事时，引导他们多角度思考。",
        ],
        description_en: [
          "Encourage independent thinking, questioning, analyzing, and evaluating information.",
          "Guide multi-perspective thinking when discussing social phenomena or stories.",
        ],
      },
      {
        name: "创造力与想象力",
        name_en: "Creativity and Imagination",
        description: [
          "提供自由创作的空间（如绘画、搭建、讲故事）。",
          "鼓励非常规的解决问题方式。",
        ],
        description_en: [
          "Provide space for free creation (e.g., drawing, building, storytelling).",
          "Encourage unconventional problem-solving approaches.",
        ],
      },
    ],
  },
  {
    category: "生活与健康习惯",
    category_en: "Life and Health Habits",
    items: [
      {
        name: "自我照顾能力",
        name_en: "Self-Care Ability",
        description: [
          "逐步培养独立生活技能（如整理物品、规划作息）。",
          "建立健康的生活习惯，包括饮食、运动和卫生。",
        ],
        description_en: [
          "Gradually develop independent living skills (e.g., organizing, planning routines).",
          "Establish healthy habits in diet, exercise, and hygiene.",
        ],
      },
      {
        name: "节俭与理财意识",
        name_en: "Frugality and Financial Awareness",
        description: [
          "理解物品的价值，学会合理消费和储蓄。",
          "通过零花钱管理初步培养财商。",
        ],
        description_en: [
          "Understand the value of resources; learn reasonable spending and saving.",
          "Develop basic financial literacy through allowance management.",
        ],
      },
    ],
  },
  {
    category: "内在动力与价值观",
    category_en: "Inner Drive and Values",
    items: [
      {
        name: "目标感与意义感",
        name_en: "Sense of Purpose and Meaning",
        description: [
          "帮助孩子发现自己的兴趣和热情，设立有意义的小目标。",
          "引导他们思考“我想成为怎样的人”。",
        ],
        description_en: [
          "Help children discover their interests and passions; set meaningful small goals.",
          'Guide them to reflect on "What kind of person do I want to be?"',
        ],
      },
      {
        name: "感恩之心",
        name_en: "Gratitude",
        description: [
          "学会珍惜拥有的资源与他人付出。",
          "通过日常表达感谢，培养对生活的满足感。",
        ],
        description_en: [
          "Learn to cherish resources and others' contributions.",
          "Cultivate contentment through daily expressions of thanks.",
        ],
      },
    ],
  },
];
