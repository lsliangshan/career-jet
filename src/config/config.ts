// 图标  https://www.figma.com/design/awcDBnJQrEtyp1pyqbNudX/Iconicool-%7C-Free-Iconset--Community-?node-id=201-2755&t=a295C2jBOqBU2wA2-0

export const DEFAULT_AVATAR =
  "https://img.liangqy.com/crawlerjet/picture_book/img/default_avatar.png";

export const DEFAULT_AI_AVATAR =
  "https://img.liangqy.com/crawlerjet/picture_book/img/ai_avatar.png";

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

export const mainColor = "#FF7BAC";

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
    "name": "情感与心理成长",
    "en_name": "Emotional and Psychological Development",
    "description": "关注儿童内在情绪体验、心理变化与自我认知发展的绘本主题，帮助儿童建立健康的心理状态。",
    "en_description": "Picture book themes focusing on children’s inner emotions, psychological changes, and self-awareness to support healthy mental development.",
    "children": [
      {
        "name": "情绪认知",
        "en_name": "Emotion Recognition",
        "description": "帮助儿童识别和理解基本及复杂情绪。",
        "en_description": "Helps children recognize and understand basic and complex emotions."
      },
      {
        "name": "情绪管理",
        "en_name": "Emotion Regulation",
        "description": "引导儿童学习调节情绪和应对挫折。",
        "en_description": "Guides children to regulate emotions and cope with setbacks."
      },
      {
        "name": "自信与自我认同",
        "en_name": "Self-Confidence and Identity",
        "description": "帮助儿童建立自信，接纳真实的自己。",
        "en_description": "Supports children in building confidence and accepting themselves."
      },
      {
        "name": "焦虑与恐惧应对",
        "en_name": "Coping with Anxiety and Fear",
        "description": "帮助儿童面对黑暗、分离、失败等恐惧。",
        "en_description": "Helps children deal with fears such as darkness, separation, and failure."
      },
      {
        "name": "心理韧性",
        "en_name": "Resilience",
        "description": "培养儿童在逆境中恢复和成长的能力。",
        "en_description": "Builds children’s ability to recover and grow from adversity."
      }
    ]
  },
  {
    "name": "社会性发展与品格教育",
    "en_name": "Social Development and Character Education",
    "description": "通过故事帮助儿童理解社会关系，培养良好品格与社会责任感。",
    "en_description": "Uses stories to help children understand social relationships and develop positive character traits and responsibility.",
    "children": [
      {
        "name": "友情与同伴关系",
        "en_name": "Friendship and Peer Relationships",
        "description": "描绘同伴交往、冲突与和解。",
        "en_description": "Depicts peer interaction, conflict, and reconciliation."
      },
      {
        "name": "合作与分享",
        "en_name": "Cooperation and Sharing",
        "description": "强调团队合作与分享精神。",
        "en_description": "Emphasizes teamwork and sharing."
      },
      {
        "name": "规则与秩序",
        "en_name": "Rules and Order",
        "description": "帮助儿童理解社会规范和公共秩序。",
        "en_description": "Helps children understand social norms and public order."
      },
      {
        "name": "诚实与正直",
        "en_name": "Honesty and Integrity",
        "description": "通过情节传递诚实守信的价值。",
        "en_description": "Conveys the value of honesty and integrity through stories."
      },
      {
        "name": "同理心与尊重",
        "en_name": "Empathy and Respect",
        "description": "培养儿童理解他人感受并尊重差异。",
        "en_description": "Develops empathy and respect for differences."
      }
    ]
  },
  {
    "name": "家庭、亲情与生活体验",
    "en_name": "Family, Affection, and Life Experiences",
    "description": "围绕家庭生活和日常经验，帮助儿童理解亲情与生活变化。",
    "en_description": "Focuses on family life and everyday experiences to help children understand affection and life changes.",
    "children": [
      {
        "name": "亲子关系",
        "en_name": "Parent-Child Relationships",
        "description": "展现父母陪伴与孩子成长的故事。",
        "en_description": "Shows parental companionship and child development."
      },
      {
        "name": "兄弟姐妹关系",
        "en_name": "Sibling Relationships",
        "description": "刻画手足间的竞争、合作与关爱。",
        "en_description": "Portrays rivalry, cooperation, and affection among siblings."
      },
      {
        "name": "祖辈与大家庭",
        "en_name": "Grandparents and Extended Family",
        "description": "描写祖辈关怀和家庭传承。",
        "en_description": "Depicts care from grandparents and family heritage."
      },
      {
        "name": "生活变化与成长事件",
        "en_name": "Life Changes and Milestones",
        "description": "涉及搬家、入园、生病等生活变化。",
        "en_description": "Covers life changes such as moving, starting school, or illness."
      },
      {
        "name": "多样化家庭形态",
        "en_name": "Diverse Family Structures",
        "description": "呈现单亲、重组、跨文化等家庭。",
        "en_description": "Represents single-parent, blended, and cross-cultural families."
      }
    ]
  },
  {
    "name": "认知启蒙与学科基础",
    "en_name": "Cognitive Development and Foundational Learning",
    "description": "以启发思维、发展基础学习能力为目标的绘本主题。",
    "en_description": "Themes aimed at stimulating thinking and developing foundational learning skills.",
    "children": [
      {
        "name": "语言与阅读启蒙",
        "en_name": "Language and Early Literacy",
        "description": "培养词汇量、语感和阅读兴趣。",
        "en_description": "Builds vocabulary, language sense, and interest in reading."
      },
      {
        "name": "数学概念",
        "en_name": "Mathematical Concepts",
        "description": "引入数字、数量、比较与简单运算。",
        "en_description": "Introduces numbers, quantities, comparisons, and simple operations."
      },
      {
        "name": "逻辑与思维训练",
        "en_name": "Logic and Thinking Skills",
        "description": "锻炼分类、推理和问题解决能力。",
        "en_description": "Trains classification, reasoning, and problem-solving skills."
      },
      {
        "name": "基础认知概念",
        "en_name": "Basic Cognitive Concepts",
        "description": "学习颜色、形状、方向、时间等概念。",
        "en_description": "Teaches concepts such as colors, shapes, directions, and time."
      },
      {
        "name": "学习习惯与专注力",
        "en_name": "Learning Habits and Focus",
        "description": "帮助儿童建立专注与持续学习的习惯。",
        "en_description": "Helps children develop focus and positive learning habits."
      }
    ]
  },
  {
    "name": "自然、科学与世界认知",
    "en_name": "Nature, Science, and World Awareness",
    "description": "引导儿童探索自然、科学和真实世界的绘本主题。",
    "en_description": "Guides children to explore nature, science, and the real world.",
    "children": [
      {
        "name": "动物与植物",
        "en_name": "Animals and Plants",
        "description": "介绍生物特征与生态环境。",
        "en_description": "Introduces biological characteristics and ecosystems."
      },
      {
        "name": "自然现象",
        "en_name": "Natural Phenomena",
        "description": "讲解天气、四季、地理现象。",
        "en_description": "Explains weather, seasons, and geographical phenomena."
      },
      {
        "name": "科学探索",
        "en_name": "Scientific Exploration",
        "description": "激发儿童提问和实验精神。",
        "en_description": "Encourages questioning and experimental thinking."
      },
      {
        "name": "环境保护",
        "en_name": "Environmental Protection",
        "description": "培养生态意识和环保责任。",
        "en_description": "Cultivates ecological awareness and environmental responsibility."
      },
      {
        "name": "社会与职业认知",
        "en_name": "Society and Occupations",
        "description": "认识社会角色与不同职业。",
        "en_description": "Introduces social roles and various occupations."
      }
    ]
  },
  {
    "name": "想象力、幻想与故事冒险",
    "en_name": "Imagination, Fantasy, and Story Adventures",
    "description": "以丰富想象和虚构世界激发儿童创造力的绘本主题。",
    "en_description": "Themes that spark creativity through imagination and fictional worlds.",
    "children": [
      {
        "name": "奇幻世界构建",
        "en_name": "Fantasy World-Building",
        "description": "创造充满魔法与幻想的世界观。",
        "en_description": "Creates magical and imaginative worlds."
      },
      {
        "name": "冒险与成长旅程",
        "en_name": "Adventure and Growth Journeys",
        "description": "通过冒险故事展现勇气与成长。",
        "en_description": "Shows courage and growth through adventurous journeys."
      },
      {
        "name": "拟人化角色故事",
        "en_name": "Anthropomorphic Character Stories",
        "description": "以动物或物品拟人化讲述人生道理。",
        "en_description": "Uses human-like animals or objects to convey life lessons."
      },
      {
        "name": "幽默与荒诞故事",
        "en_name": "Humor and Absurdity",
        "description": "通过夸张和幽默吸引儿童阅读。",
        "en_description": "Engages children through exaggeration and humor."
      },
      {
        "name": "民间故事与童话改编",
        "en_name": "Folktales and Fairy Tale Adaptations",
        "description": "改编传统故事，赋予新视角。",
        "en_description": "Reimagines traditional tales with new perspectives."
      }
    ]
  }
];

export const authors = [
  {
    name: "莫里斯·桑达克",
    en_name: "Maurice Sendak",
    avatar: "https://img.liangqy.com/crawlerjet/picture_book/img/author/maurice_sendak.png",
  },
  {
    name: "艾瑞·卡尔",
    en_name: "Eric Carle",
    avatar: "https://img.liangqy.com/crawlerjet/picture_book/img/author/eric_carle.png",
  },
  {
    name: "苏斯博士",
    en_name: "Dr. Seuss",
    avatar: "https://img.liangqy.com/crawlerjet/picture_book/img/author/dr_seuss.png",
  },
  {
    name: "比阿特丽克斯·波特",
    en_name: "Beatrix Potter",
    avatar: "https://img.liangqy.com/crawlerjet/picture_book/img/author/beatrix_potter.png",
  },
  {
    name: "谢尔·希尔弗斯坦",
    en_name: "Shel Silverstein",
    avatar: "https://img.liangqy.com/crawlerjet/picture_book/img/author/shel_silverstein.png",
  },
  {
    name: "安东尼·布朗",
    en_name: "Anthony Browne",
    avatar: "https://img.liangqy.com/crawlerjet/picture_book/img/author/anthony_brown.png",
  },
  {
    name: "李欧·李奥尼",
    en_name: "Leo Lionni",
    avatar: "https://img.liangqy.com/crawlerjet/picture_book/img/author/leo_lionni.png",
  },
  {
    name: "玛格丽特·怀兹·布朗",
    en_name: "Margaret Wise Brown",
    avatar: "https://img.liangqy.com/crawlerjet/picture_book/img/author/margaret_wise_brown.png",
  },
  {
    name: "克里斯·范·奥尔斯伯格",
    en_name: "Chris Van Allsburg",
    avatar: "https://img.liangqy.com/crawlerjet/picture_book/img/author/chris_van_allsburg.png",
  },
  {
    name: "约翰·伯宁罕",
    en_name: "John Burningham",
    avatar: "https://img.liangqy.com/crawlerjet/picture_book/img/author/john_burningham.png",
  },
  {
    name: "五味太郎",
    en_name: "Taro Gomi",
    avatar: "https://img.liangqy.com/crawlerjet/picture_book/img/author/taro_gomi.png",
  },
  {
    name: "宫西达也",
    en_name: "Tatsuya Miyanishi",
    avatar: "https://img.liangqy.com/crawlerjet/picture_book/img/author/tatsuya_miyanishi.png",
  },
  {
    name: "白希那",
    en_name: "Heena Baek",
    avatar: "https://img.liangqy.com/crawlerjet/picture_book/img/author/heena_baek.png",
  },
  {
    name: "乔恩·克拉森",
    en_name: "Jon Klassen",
    avatar: "https://img.liangqy.com/crawlerjet/picture_book/img/author/jon_klassen.png",
  },
  {
    name: "奥利弗·杰弗斯",
    en_name: "Oliver Jeffers",
    avatar: "https://img.liangqy.com/crawlerjet/picture_book/img/author/oliver_jeffers.png",
  },
  {
    name: "莫·威廉斯",
    en_name: "Mo Willems",
    avatar: "https://img.liangqy.com/crawlerjet/picture_book/img/author/mo_willems.png",
  },
  {
    name: "朱迪斯·克尔",
    en_name: "Judith Kerr",
    avatar: "https://img.liangqy.com/crawlerjet/picture_book/img/author/judith_kerr.png",
  },
  {
    name: "雷蒙德·布里格斯",
    en_name: "Raymond Briggs",
    avatar: "https://img.liangqy.com/crawlerjet/picture_book/img/author/raymond_briggs.png",
  },
  {
    name: "大卫·香农",
    en_name: "David Shannon",
    avatar: "https://img.liangqy.com/crawlerjet/picture_book/img/author/david_shannon.png",
  },
  {
    name: "路德维格·贝梅尔曼斯",
    en_name: "Ludwig Bemelmans",
    avatar: "https://img.liangqy.com/crawlerjet/picture_book/img/author/ludwig_bemelmans.png",
  },
  {
    name: "弗娜·阿尔德玛",
    en_name: "Verna Aardema",
    avatar: "https://img.liangqy.com/crawlerjet/picture_book/img/author/verna_aardema.png",
  },
  {
    name: "艾伦·阿尔伯格 & 珍妮特·阿尔伯格",
    en_name: "Allan Ahlberg and Janet Ahlberg",
    avatar: "https://img.liangqy.com/crawlerjet/picture_book/img/author/allan_ahlberg_and_janet_ahlberg.png",
  },
  {
    name: "阿丽奇",
    en_name: "Aliki (Aliki Brandenberg)",
    avatar: "https://img.liangqy.com/crawlerjet/picture_book/img/author/aliki_brandenberg.png",
  },
  {
    name: "安野光雅",
    en_name: "Mitsumasa Anno",
    avatar: "https://img.liangqy.com/crawlerjet/picture_book/img/author/mitsumasa_anno.png",
  },
  {
    name: "莫莉·班",
    en_name: "Molly Garrett Bang",
    avatar: "https://img.liangqy.com/crawlerjet/picture_book/img/author/molly_garrett_bang.png",
  },
  {
    name: "格雷姆·贝斯",
    en_name: "Graeme Base",
    avatar: "https://img.liangqy.com/crawlerjet/picture_book/img/author/graeme_base.png",
  },
  {
    name: "简·布雷特",
    en_name: "Jan Brett",
    avatar: "https://img.liangqy.com/crawlerjet/picture_book/img/author/jan_brett.png",
  },
  {
    name: "马克·布朗",
    en_name: "Marc Brown",
    avatar: "https://img.liangqy.com/crawlerjet/picture_book/img/author/marc_brown.png",
  },
  {
    name: "玛西娅·布朗",
    en_name: "Marcia Brown",
    avatar: "https://img.liangqy.com/crawlerjet/picture_book/img/author/marcia_brown.png",
  },
  {
    name: "艾什利·布赖恩",
    en_name: "Ashley Bryan",
    avatar: "https://img.liangqy.com/crawlerjet/picture_book/img/author/ashley_bryan.png",
  },
  {
    name: "夏洛特·佐罗托",
    en_name: "Charlotte Zolotow",
    avatar: "https://img.liangqy.com/crawlerjet/picture_book/img/author/charlotte_zolotow.png",
  },
  {
    name: "汤米·狄波拉",
    en_name: "Tomie dePaola",
    avatar: "https://img.liangqy.com/crawlerjet/picture_book/img/author/tomie_depaola.png",
  },
  {
    name: "洛伊丝·埃勒特",
    en_name: "Lois Ehlert",
    avatar: "https://img.liangqy.com/crawlerjet/picture_book/img/author/lois_ehlert.png",
  },
  {
    name: "梅姆·福克斯",
    en_name: "Mem Fox",
    avatar: "https://img.liangqy.com/crawlerjet/picture_book/img/author/mem_fox.png",
  },
  {
    name: "旺达·盖格",
    en_name: "Wanda Gag",
    avatar: "https://img.liangqy.com/crawlerjet/picture_book/img/author/wanda_gag.png",
  },
  {
    name: "保罗·加尔顿",
    en_name: "Paul Galdone",
    avatar: "https://img.liangqy.com/crawlerjet/picture_book/img/author/paul_galdone.png",
  },
  {
    name: "盖尔·吉本斯",
    en_name: "Gail Gibbons",
    avatar: "https://img.liangqy.com/crawlerjet/picture_book/img/author/gail_gibbons.png",
  },
  {
    name: "凯文·亨克斯",
    en_name: "Kevin Henkes",
    avatar: "https://img.liangqy.com/crawlerjet/picture_book/img/author/kevin_henkes.png",
  },
  {
    name: "诺尼·霍格罗金",
    en_name: "Nonny Hogrogian",
    avatar: "https://img.liangqy.com/crawlerjet/picture_book/img/author/nonny_hogrogian.png",
  },
  {
    name: "埃兹拉·杰克·济慈",
    en_name: "Ezra Jack Keats",
    avatar: "https://img.liangqy.com/crawlerjet/picture_book/img/author/ezra_jack_keats.png",
  },
  {
    name: "史蒂文·凯洛格",
    en_name: "Steven Kellogg",
    avatar: "https://img.liangqy.com/crawlerjet/picture_book/img/author/steven_kellogg.png",
  },
  {
    name: "安妮塔·洛贝尔",
    en_name: "Anita Lobel",
    avatar: "https://img.liangqy.com/crawlerjet/picture_book/img/author/anita_lobel.png",
  },
  {
    name: "阿诺德·洛贝尔",
    en_name: "Arnold Lobel",
    avatar: "https://img.liangqy.com/crawlerjet/picture_book/img/author/arnold_lobel.png",
  },
  {
    name: "默瑟·迈耶",
    en_name: "Mercer Mayer",
    avatar: "https://img.liangqy.com/crawlerjet/picture_book/img/author/mercer_mayer.png",
  },
  {
    name: "罗伯特·麦克洛斯基",
    en_name: "Robert McCloskey",
    avatar: "https://img.liangqy.com/crawlerjet/picture_book/img/author/robert_mcloskey.png",
  },
  {
    name: "海伦·奥克森伯里",
    en_name: "Helen Oxenbury",
    avatar: "https://img.liangqy.com/crawlerjet/picture_book/img/author/helen_oxenbury.png",
  },
  {
    name: "佩特·哈群斯",
    en_name: "Pat Hutchins",
    avatar: "https://img.liangqy.com/crawlerjet/picture_book/img/author/pat_hutchins.png",
  },
  {
    name: "彼得·史比尔",
    en_name: "Peter Spier",
    avatar: "https://img.liangqy.com/crawlerjet/picture_book/img/author/peter_spier.png",
  },
];

export const ratios = [
  "16:9",
  "9:16",
  "4:3",
  "3:4",
  "21:9",
  "3:2",
  "2:3",
  "5:4",
  "4:5",
  "1:1",
];

// 国旗地址： https://flagcdn.com/w320/id.png
export const languages = [
  { "name": "中文", "en_name": "Chinese", "avatar": "https://img.liangqy.com/crawlerjet/picture_book/img/flags/chinese.png" },
  { "name": "繁体中文", "en_name": "Traditional Chinese", "avatar": "https://img.liangqy.com/crawlerjet/picture_book/img/flags/chinese.png" },
  { "name": "英文", "en_name": "English", "avatar": "https://img.liangqy.com/crawlerjet/picture_book/img/flags/us.png" },
  { "name": "日语", "en_name": "Japanese", "avatar": "https://img.liangqy.com/crawlerjet/picture_book/img/flags/jp.png" },
  { "name": "韩语", "en_name": "Korean", "avatar": "https://img.liangqy.com/crawlerjet/picture_book/img/flags/kr.png" },
  { "name": "法语", "en_name": "French", "avatar": "https://img.liangqy.com/crawlerjet/picture_book/img/flags/fr.png" },
  { "name": "德语", "en_name": "German", "avatar": "https://img.liangqy.com/crawlerjet/picture_book/img/flags/de.png" },
  { "name": "西班牙语", "en_name": "Spanish", "avatar": "https://img.liangqy.com/crawlerjet/picture_book/img/flags/es.png" },
  { "name": "俄语", "en_name": "Russian", "avatar": "https://img.liangqy.com/crawlerjet/picture_book/img/flags/ru.png" },
  { "name": "阿拉伯语", "en_name": "Arabic", "avatar": "https://img.liangqy.com/crawlerjet/picture_book/img/flags/ar.png" },
  { "name": "葡萄牙语", "en_name": "Portuguese", "avatar": "https://img.liangqy.com/crawlerjet/picture_book/img/flags/pt.png" },
  { "name": "意大利语", "en_name": "Italian", "avatar": "https://img.liangqy.com/crawlerjet/picture_book/img/flags/it.png" },
  { "name": "荷兰语", "en_name": "Dutch", "avatar": "https://img.liangqy.com/crawlerjet/picture_book/img/flags/nl.png" },
  { "name": "泰语", "en_name": "Thai", "avatar": "https://img.liangqy.com/crawlerjet/picture_book/img/flags/th.png" },
  { "name": "越南语", "en_name": "Vietnamese", "avatar": "https://img.liangqy.com/crawlerjet/picture_book/img/flags/vi.png" },
  { "name": "印尼语", "en_name": "Indonesian", "avatar": "https://img.liangqy.com/crawlerjet/picture_book/img/flags/id.png" }
];
