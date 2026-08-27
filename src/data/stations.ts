import type { LucideIcon } from 'lucide-react';
import {
  Scroll,
  Heart,
  HandHelping,
  Brain,
  Building2,
  Crown,
  Ban,
} from 'lucide-react';

export interface Station {
  id: number;
  icon: string;
  title: string;
  subtitle: string;
  chapter: string;
  description: string;
  color: string;
  bgColor: string;
  accentColor: string;
  lucideIcon: LucideIcon;
  mapPosition: { x: number; y: number };
  maxStars: number;
  badgeId: string;
  inventoryItemId: string;
  challengeTitle: string;
}

export const stations: Station[] = [
  {
    id: 1,
    icon: '📜',
    title: 'الرسالة',
    subtitle: 'باروخ 1',
    chapter: 'باروخ 1',
    description: 'باروخ كان يحمل رسالة مهمة للشعب في السبي.',
    color: 'from-amber-500 to-amber-700',
    bgColor: 'bg-amber-100',
    accentColor: 'text-amber-700',
    lucideIcon: Scroll,
    mapPosition: { x: 12, y: 75 },
    maxStars: 3,
    badgeId: 'badge1',
    inventoryItemId: 'item1',
    challengeTitle: 'وصل الرسالة خلال 60 ثانية',
  },
  {
    id: 2,
    icon: '🪞',
    title: 'الاعتراف',
    subtitle: 'باروخ 1-2',
    chapter: 'باروخ 1-2',
    description: 'الشعب اعترف بخطيته وفهم أن الابتعاد عن الله له نتائج.',
    color: 'from-rose-500 to-rose-700',
    bgColor: 'bg-rose-100',
    accentColor: 'text-rose-700',
    lucideIcon: Heart,
    mapPosition: { x: 25, y: 45 },
    maxStars: 3,
    badgeId: 'badge2',
    inventoryItemId: 'item2',
    challengeTitle: 'رتّب خطوات الرجوع',
  },
  {
    id: 3,
    icon: '🙏',
    title: 'الصلاة والرحمة',
    subtitle: 'باروخ 2',
    chapter: 'باروخ 2',
    description: 'لما نغلط، لا نهرب من ربنا... نرجع له ونطلب رحمته.',
    color: 'from-sky-500 to-sky-700',
    bgColor: 'bg-sky-100',
    accentColor: 'text-sky-700',
    lucideIcon: HandHelping,
    mapPosition: { x: 40, y: 70 },
    maxStars: 3,
    badgeId: 'badge3',
    inventoryItemId: 'item3',
    challengeTitle: 'رتّب خطوات الصلاة',
  },
  {
    id: 4,
    icon: '🧠',
    title: 'الحكمة',
    subtitle: 'باروخ 3',
    chapter: 'باروخ 3',
    description: 'الحكمة الحقيقية عند الله، والإنسان يحتاج أن يتعلم طريق الله.',
    color: 'from-violet-500 to-violet-700',
    bgColor: 'bg-violet-100',
    accentColor: 'text-violet-700',
    lucideIcon: Brain,
    mapPosition: { x: 55, y: 35 },
    maxStars: 3,
    badgeId: 'badge4',
    inventoryItemId: 'item4',
    challengeTitle: 'اعثر على كنز الحكمة',
  },
  {
    id: 5,
    icon: '🏙️',
    title: 'أورشليم',
    subtitle: 'باروخ 4',
    chapter: 'باروخ 4',
    description: 'أورشليم تنادي أولادها. رغم الحزن، لم يختفِ الرجاء.',
    color: 'from-teal-500 to-teal-700',
    bgColor: 'bg-teal-100',
    accentColor: 'text-teal-700',
    lucideIcon: Building2,
    mapPosition: { x: 70, y: 65 },
    maxStars: 3,
    badgeId: 'badge5',
    inventoryItemId: 'item5',
    challengeTitle: 'أعد الأولاد إلى أورشليم',
  },
  {
    id: 6,
    icon: '👑',
    title: 'مجد أورشليم',
    subtitle: 'باروخ 5',
    chapter: 'باروخ 5',
    description: 'باروخ ينتقل من الحزن إلى الرجاء ومجد أورشليم.',
    color: 'from-yellow-500 to-orange-600',
    bgColor: 'bg-yellow-100',
    accentColor: 'text-yellow-700',
    lucideIcon: Crown,
    mapPosition: { x: 82, y: 30 },
    maxStars: 3,
    badgeId: 'badge6',
    inventoryItemId: 'item6',
    challengeTitle: 'حوّل الظلام إلى نور',
  },
  {
    id: 7,
    icon: '🗿',
    title: 'الأصنام',
    subtitle: 'باروخ 6',
    chapter: 'باروخ 6',
    description: 'الصنم مصنوع بيد الإنسان. لا نعبد الأصنام.',
    color: 'from-stone-500 to-stone-700',
    bgColor: 'bg-stone-200',
    accentColor: 'text-stone-700',
    lucideIcon: Ban,
    mapPosition: { x: 92, y: 60 },
    maxStars: 3,
    badgeId: 'badge7',
    inventoryItemId: 'item7',
    challengeTitle: 'اكشف 5 صفات للصنم',
  },
];

export const TOTAL_STATIONS = stations.length;
export const MAX_TOTAL_STARS = stations.length * 3;
