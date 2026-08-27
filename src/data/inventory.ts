export interface InventoryItem {
  id: string;
  stationId: number;
  emoji: string;
  name: string;
  description: string;
  color: string;
  glow: string;
}

export const inventoryItems: InventoryItem[] = [
  {
    id: 'item1',
    stationId: 1,
    emoji: '📜',
    name: 'الرسالة القديمة',
    description: 'لقيفة قديمة تحمل كلمات باروخ للشعب في السبي.',
    color: 'from-amber-300 to-amber-600',
    glow: 'rgba(245,200,100,0.4)',
  },
  {
    id: 'item2',
    stationId: 2,
    emoji: '🪞',
    name: 'مرآة الاعتراف',
    description: 'مرآة تُري حقيقة القلب، وتُعيدنا إلى الله بالاعتراف.',
    color: 'from-slate-300 to-slate-500',
    glow: 'rgba(180,180,220,0.4)',
  },
  {
    id: 'item3',
    stationId: 3,
    emoji: '🙏',
    name: 'رمز الصلاة',
    description: 'يدان مرفوعتان بالصلاة، ترجّي رحمة الله وتطلب العودة إليه.',
    color: 'from-sky-300 to-indigo-500',
    glow: 'rgba(150,180,255,0.4)',
  },
  {
    id: 'item4',
    stationId: 4,
    emoji: '🗝️',
    name: 'مفتاح الحكمة',
    description: 'مفتاح يفتح كنز الحكمة، والحكمة الحقيقية عند الله وحده.',
    color: 'from-violet-300 to-violet-600',
    glow: 'rgba(180,150,255,0.4)',
  },
  {
    id: 'item5',
    stationId: 5,
    emoji: '🗺️',
    name: 'قطعة خريطة أورشليم',
    description: 'قطعة من خريطة أورشليم، المدينة التي تنادي أولادها ليرجعوا.',
    color: 'from-teal-300 to-teal-600',
    glow: 'rgba(100,200,180,0.4)',
  },
  {
    id: 'item6',
    stationId: 6,
    emoji: '👑',
    name: 'تاج المجد',
    description: 'تاج يرمز لمجد أورشليم وفرح رجوع أبنائها بعد الحزن.',
    color: 'from-yellow-300 to-orange-500',
    glow: 'rgba(255,200,80,0.5)',
  },
  {
    id: 'item7',
    stationId: 7,
    emoji: '⚠️',
    name: 'رمز التحذير',
    description: 'تحذير من الأصنام: مصنوعة بيد الإنسان، وليست إلهًا حقيقيًا.',
    color: 'from-stone-300 to-stone-500',
    glow: 'rgba(200,100,80,0.4)',
  },
];

export const TOTAL_INVENTORY_ITEMS = inventoryItems.length;
