export type QuestionType = 'multiple-choice' | 'true-false' | 'ordering' | 'who-am-i' | 'key-lesson';

export interface BaseQuestion {
  id: number;
  type: QuestionType;
  question: string;
  hint: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple-choice';
  options: string[];
  correctIndex: number;
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: 'true-false';
  statement: string;
  isTrue: boolean;
}

export interface OrderingQuestion extends BaseQuestion {
  type: 'ordering';
  items: { id: string; label: string; emoji: string }[];
  correctOrder: string[];
}

export interface WhoAmIQuestion extends BaseQuestion {
  type: 'who-am-i';
  clues: string[];
  options: string[];
  correctIndex: number;
}

export interface KeyLessonQuestion extends BaseQuestion {
  type: 'key-lesson';
  options: string[];
  correctIndex: number;
}

export type FinalQuestion =
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | OrderingQuestion
  | WhoAmIQuestion
  | KeyLessonQuestion;

/* ── Station order reference (for ordering question) ── */
export const stationOrder = [
  { id: 's1', label: 'الرسالة', emoji: '📜' },
  { id: 's2', label: 'الاعتراف', emoji: '🪞' },
  { id: 's3', label: 'الصلاة والرحمة', emoji: '🙏' },
  { id: 's4', label: 'الحكمة', emoji: '🧠' },
  { id: 's5', label: 'أورشليم', emoji: '🏙️' },
  { id: 's6', label: 'مجد أورشليم', emoji: '👑' },
  { id: 's7', label: 'الأصنام', emoji: '🗿' },
];

export const finalQuestions: FinalQuestion[] = [
  {
    id: 1,
    type: 'ordering',
    question: 'رتّب محطات رحلة سفر باروخ بالترتيب الصحيح',
    hint: 'الرحلة تبدأ بالرسالة، ثم الاعتراف، فالصلاة، فالحكمة، ثم أورشليم ومجدها، وأخيرًا الأصنام.',
    items: stationOrder,
    correctOrder: ['s1', 's2', 's3', 's4', 's5', 's6', 's7'],
  },
  {
    id: 2,
    type: 'multiple-choice',
    question: 'من كان مرتبطًا بالنبي إرميا ويحمل رسالة مهمة؟',
    options: ['باروخ', 'موسى', 'يشوع', 'دانيال'],
    correctIndex: 0,
    hint: 'باروخ كان مرتبطًا بالنبي إرميا ويحمل رسالة من عند الله للشعب.',
  },
  {
    id: 3,
    type: 'true-false',
    statement: 'الشعب كان يعيش في أورشليم وقت كتابة رسالة باروخ.',
    question: 'صح أم خطأ؟',
    isTrue: false,
    hint: 'الشعب كان في السبي، بعيدين عن أورشليم.',
  },
  {
    id: 4,
    type: 'who-am-i',
    question: 'من أنا؟',
    clues: [
      'أحمل رسالة مهمة من عند الله',
      'أنا مرتبط بالنبي إرميا',
      'كتبت الرسالة وقرأتها على الشعب كله',
      'الشعب كان في السبي عندما قرأت الرسالة',
    ],
    options: ['إرميا', 'باروخ', 'حزقيال', 'إشعياء'],
    correctIndex: 1,
    hint: 'باروخ هو الذي كتب الرسالة وقرأها على الشعب في السبي.',
  },
  {
    id: 5,
    type: 'key-lesson',
    question: 'ما هي خطوات الرجوع إلى الله بالترتيب الصحيح؟',
    options: [
      'أدرك → أعترف → أصلي → أرجع',
      'أصلي → أدرك → أرجع → أعترف',
      'أرجع → أدرك → أصلي → أعترف',
      'أعترف → أرجع → أصلي → أدرك',
    ],
    correctIndex: 0,
    hint: 'أولًا أدرك إني غلطت، بعدين أعترف، بعدين أصلي، وفي الآخر أرجع لربنا.',
  },
  {
    id: 6,
    type: 'true-false',
    statement: 'الحكمة الحقيقية توجد عند الله وحده.',
    question: 'صح أم خطأ؟',
    isTrue: true,
    hint: 'حكمة الله هي الحكمة الحقيقية، والإنسان يحتاج أن يتعلم طريق الله.',
  },
  {
    id: 7,
    type: 'who-am-i',
    question: 'من أنا؟',
    clues: [
      'أنا مدينة مقدسة',
      'أُنادي أولادي ليرجعوا إليّ',
      'حزنتُ على أولادي حين تركوني',
      'في النهاية أستقبلهم بمجد وفرح',
    ],
    options: ['بابل', 'أورشليم', 'ناين', 'أريحا'],
    correctIndex: 1,
    hint: 'أورشليم نادت أولادها وقالت: ارجعوا إليّ!',
  },
  {
    id: 8,
    type: 'multiple-choice',
    question: 'ماذا يحدث في رسالة باروخ 5؟',
    options: [
      'يظهر الرجاء ومجد أورشليم',
      'تبدأ قصة جديدة تمامًا',
      'لا يوجد رجاء على الإطلاق',
      'يتم تدمير أورشليم',
    ],
    correctIndex: 0,
    hint: 'باروخ ينتقل من الحزن إلى الرجاء ويتكلم عن مجد أورشليم.',
  },
  {
    id: 9,
    type: 'true-false',
    statement: 'الصنم إله حقيقي أقوى من الله.',
    question: 'صح أم خطأ؟',
    isTrue: false,
    hint: 'الصنم مصنوع بيد الإنسان وليس إلهًا حقيقيًا.',
  },
  {
    id: 10,
    type: 'key-lesson',
    question: 'ما الرسالة الأساسية التي أخذناها من رحلة سفر باروخ؟',
    options: [
      'الرجوع إلى الله وطلب رحمته وحكمته',
      'البحث عن المال والشهرة في الحياة',
      'عبادة الأصنام لكي نحصل على البركة',
      'الهروب من الله عندما نغلط',
    ],
    correctIndex: 0,
    hint: 'نرجع إلى الله، نطلب رحمته وحكمته، ولا نفقد الرجاء، ولا نعبد الأصنام.',
  },
];

export const finalMessages: string[] = [
  'ارجع إلى الله',
  'اطلب رحمته',
  'اطلب حكمته',
  'لا تفقد الرجاء',
  'لا تجعل أي شيء مكانه',
];

/* ── Ending tiers ── */
export interface EndingTier {
  emoji: string;
  title: string;
  message: string;
  minScore: number;
}

export const endingTiers: EndingTier[] = [
  {
    emoji: '👑',
    title: 'بطل رحلة باروخ',
    message: 'لقد أتقنت كل دروس الرحلة! أنت بطل حقيقي يعرف طريق الله.',
    minScore: 8,
  },
  {
    emoji: '⭐',
    title: 'مستكشف باروخ',
    message: 'رحلة رائعة! لقد اكتشفت الكثير من دروس سفر باروخ.',
    minScore: 5,
  },
  {
    emoji: '🧭',
    title: 'الرحلة لم تنتهِ بعد',
    message: 'كل رحلة تبدأ بخطوة! لقد قطعتَ شوطًا، والطريق لا يزال أمامك.',
    minScore: 0,
  },
];

export function getEndingTier(score: number): EndingTier {
  for (const tier of endingTiers) {
    if (score >= tier.minScore) return tier;
  }
  return endingTiers[endingTiers.length - 1];
}
