import { motion } from 'framer-motion';
import { stationImages } from '@/data/stationImages';

interface StoryImageProps {
  stationId: number;
}

export function StoryImage({ stationId }: StoryImageProps) {
  const image = stationImages[stationId];
  if (!image) return null;

  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0, y: 10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ delay: 0.3, type: 'spring', stiffness: 120 }}
      className="relative w-full max-w-md mx-auto rounded-2xl overflow-hidden shadow-xl border-4 border-parchment-300 group"
    >
      <div className="relative aspect-[3/2] overflow-hidden">
        <img
          src={image.url}
          alt={image.alt}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-royal-900/60 via-transparent to-transparent" />
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="absolute bottom-0 left-0 right-0 p-3 text-center text-white font-display text-sm font-bold drop-shadow-lg"
        >
          {image.alt}
        </motion.p>
      </div>
    </motion.div>
  );
}
