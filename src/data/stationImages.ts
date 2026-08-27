export interface StationImage {
  url: string;
  alt: string;
}

export const stationImages: Record<number, StationImage> = {
  1: {
    url: 'https://images.pexels.com/photos/5192343/pexels-photo-5192343.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'مخطوطة قديمة مكتوب عليها رسالة',
  },
  2: {
    url: 'https://images.pexels.com/photos/3856027/pexels-photo-3856027.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'مجموعة من الناس يستمعون معًا',
  },
  3: {
    url: 'https://images.pexels.com/photos/1024900/pexels-photo-1024900.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'أيدٍ مرفوعة في الصلاة على ضوء الشموع',
  },
  4: {
    url: 'https://images.pexels.com/photos/7272207/pexels-photo-7272207.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'عملات ذهبية قديمة ترمز للكنز والحكمة',
  },
  5: {
    url: 'https://images.pexels.com/photos/27358635/pexels-photo-27358635.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'أسوار أورشليم القديمة',
  },
  6: {
    url: 'https://images.pexels.com/photos/860481/pexels-photo-860481.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'شروق الشمس رمز الرجاء والبداية الجديدة',
  },
  7: {
    url: 'https://images.pexels.com/photos/10098351/pexels-photo-10098351.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'تمثال ذهبي في معبد قديم',
  },
};
