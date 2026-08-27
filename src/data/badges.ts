export interface Badge {
  id: string;
  stationId: number | null;
  emoji: string;
  title: string;
  description: string;
  color: string;
}

export const badges: Badge[] = [
  {
    id: 'badge1',
    stationId: 1,
    emoji: '📜',
    title: 'حامل الرسالة',
    description: 'وصلت رسالة باروخ إلى الشعب!',
    color: 'from-amber-400 to-amber-600',
  },
  {
    id: 'badge2',
    stationId: 2,
    emoji: '🪞',
    title: 'قلب صادق',
    description: 'اخترت طريق الاعتراف والصلح!',
    color: 'from-rose-400 to-rose-600',
  },
  {
    id: 'badge3',
    stationId: 3,
    emoji: '🙏',
    title: 'قلب راجع',
    description: 'عرفت طريق الرجوع إلى الله!',
    color: 'from-sky-400 to-sky-600',
  },
  {
    id: 'badge4',
    stationId: 4,
    emoji: '🧠',
    title: 'باحث عن الحكمة',
    description: 'وجدت أن الحكمة الحقيقية عند الله!',
    color: 'from-violet-400 to-violet-600',
  },
  {
    id: 'badge5',
    stationId: 5,
    emoji: '❤️',
    title: 'صديق الرجاء',
    description: 'ساعدت أولاد أورشليم يرجعوا!',
    color: 'from-teal-400 to-teal-600',
  },
  {
    id: 'badge6',
    stationId: 6,
    emoji: '👑',
    title: 'صديق أورشليم',
    description: 'اكتشفت مجد أورشليم ورجوع أبنائها!',
    color: 'from-yellow-400 to-orange-600',
  },
  {
    id: 'badge7',
    stationId: 7,
    emoji: '🛡️',
    title: 'حارس الإيمان',
    description: 'عرفت أن الله وحده هو الإله الحقيقي!',
    color: 'from-stone-400 to-stone-600',
  },
  {
    id: 'badgeFinal',
    stationId: null,
    emoji: '🏆',
    title: 'بطل رحلة باروخ',
    description: 'أنهيت كل المحطات واجتزت التحدي النهائي!',
    color: 'from-gold-400 to-royal-600',
  },
];

export const TOTAL_BADGES = badges.length;
