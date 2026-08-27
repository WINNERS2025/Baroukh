import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { Download, FileText, Award } from 'lucide-react';
import { stations } from '@/data/stations';
import { computeXP, computeLevel } from './XPDisplay';

interface AchievementCardProps {
  totalStars: number;
  stationStars: Record<number, number>;
  badgeCount: number;
  finalStars: number;
  onReset: () => void;
  tierTitle?: string;
}

export function AchievementCard({
  totalStars,
  stationStars,
  badgeCount,
  finalStars,
  onReset,
  tierTitle,
}: AchievementCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState('');
  const [downloaded, setDownloaded] = useState(false);

  const xp = computeXP(stationStars);
  const level = computeLevel(xp);
  const completedCount = Object.keys(stationStars).filter((k) => stationStars[Number(k)] > 0).length;

  const downloadPNG = async () => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const scale = 2;
    const canvas = document.createElement('canvas');
    canvas.width = rect.width * scale;
    canvas.height = rect.height * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(scale, scale);

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, rect.height);
    grad.addColorStop(0, '#fef3c7');
    grad.addColorStop(0.5, '#fde68a');
    grad.addColorStop(1, '#fef3c7');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Border
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 6;
    ctx.strokeRect(12, 12, rect.width - 24, rect.height - 24);
    ctx.strokeStyle = '#92400e';
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, rect.width - 40, rect.height - 40);

    // Title
    ctx.fillStyle = '#78350f';
    ctx.font = 'bold 28px serif';
    ctx.textAlign = 'center';
    ctx.fillText('🏅 BARUCH JOURNEY', rect.width / 2, 60);
    ctx.font = 'bold 22px serif';
    ctx.fillText('رحلة سفر باروخ', rect.width / 2, 92);

    // Decorative line
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(60, 105);
    ctx.lineTo(rect.width - 60, 105);
    ctx.stroke();

    // Name
    ctx.fillStyle = '#451a03';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`الاسم: ${name || '_____________'}`, rect.width - 40, 140);

    // Stats
    const stats = [
      `المحطات المكتملة: ${completedCount}/7`,
      `XP: ${xp}`,
      `المستوى: ${level}`,
      `النجوم: ${totalStars}/21`,
      `الكنوز: ${badgeCount}/7`,
      `التحدي النهائي: ${'⭐'.repeat(Math.min(finalStars, 5))}`,
    ];
    ctx.textAlign = 'right';
    ctx.font = '15px sans-serif';
    stats.forEach((s, i) => {
      ctx.fillText(s, rect.width - 40, 175 + i * 28);
    });

    // Achievement
    ctx.fillStyle = '#78350f';
    ctx.font = 'bold 18px serif';
    ctx.textAlign = 'center';
    ctx.fillText('🏆 أكملت رحلة سفر باروخ!', rect.width / 2, rect.height - 60);

    // Date
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#92400e';
    ctx.fillText(new Date().toLocaleDateString('ar-EG'), rect.width / 2, rect.height - 35);

    // Download
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'baruch-journey-certificate.png';
      a.click();
      URL.revokeObjectURL(url);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2000);
    }, 'image/png');
  };

  const downloadPDF = () => {
    // Use print-based PDF: open a new window with the card and trigger print
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const xp = computeXP(stationStars);
    const level = computeLevel(xp);
    const completedCount = Object.keys(stationStars).filter((k) => stationStars[Number(k)] > 0).length;
    printWindow.document.write(`
      <html dir="rtl"><head><title>شهيدة رحلة باروخ</title>
      <style>
        body { margin: 0; padding: 40px; background: #fef3c7; font-family: serif; }
        .card { max-width: 600px; margin: 0 auto; background: linear-gradient(to bottom, #fef3c7, #fde68a, #fef3c7);
                border: 6px solid #d97706; border-radius: 20px; padding: 40px; text-align: center; }
        h1 { color: #78350f; font-size: 28px; margin: 0 0 5px; }
        h2 { color: #78350f; font-size: 22px; margin: 0 0 15px; }
        .line { border-top: 1px solid #d97706; margin: 15px 0; }
        .stat { color: #451a03; font-size: 16px; margin: 8px 0; text-align: right; padding-right: 40px; }
        .achievement { color: #78350f; font-size: 18px; font-weight: bold; margin-top: 20px; }
        .date { color: #92400e; font-size: 12px; margin-top: 10px; }
      </style></head><body>
      <div class="card">
        <h1>🏅 BARUCH JOURNEY</h1>
        <h2>رحلة سفر باروخ</h2>
        <div class="line"></div>
        <div class="stat">الاسم: ${name || '_____________'}</div>
        <div class="stat">المحطات المكتملة: ${completedCount}/7</div>
        <div class="stat">XP: ${xp}</div>
        <div class="stat">المستوى: ${level}</div>
        <div class="stat">النجوم: ${totalStars}/21</div>
        <div class="stat">الكنوز: ${badgeCount}/7</div>
        <div class="stat">التحدي النهائي: ${'⭐'.repeat(Math.min(finalStars, 5))}</div>
        <div class="achievement">🏆 أكملت رحلة سفر باروخ!</div>
        <div class="date">${new Date().toLocaleDateString('ar-EG')}</div>
      </div>
      <script>window.print();</script>
      </body></html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* The certificate card (rendered for PNG capture) */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120 }}
        ref={cardRef}
        className="relative bg-gradient-to-b from-parchment-100 via-amber-50 to-parchment-100 rounded-3xl p-8 border-8 border-amber-600 shadow-2xl"
        style={{ minHeight: 400 }}
      >
        {/* Decorative corners */}
        <div className="absolute top-2 right-2 text-2xl">✨</div>
        <div className="absolute top-2 left-2 text-2xl">✨</div>
        <div className="absolute bottom-2 right-2 text-2xl">✨</div>
        <div className="absolute bottom-2 left-2 text-2xl">✨</div>

        <div className="text-center mb-4">
          <div className="text-5xl mb-2">🏅</div>
          <h1 className="font-serif text-3xl font-black text-amber-800">BARUCH JOURNEY</h1>
          <h2 className="font-serif text-2xl font-bold text-amber-700">رحلة سفر باروخ</h2>
          <div className="w-3/4 mx-auto mt-3 border-t-2 border-amber-500" />
        </div>

        {/* Name input */}
        <div className="mb-4 text-right">
          <label className="block text-sm font-bold text-amber-800 mb-1">الاسم:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="اكتب اسمك هنا..."
            className="w-full px-4 py-2 rounded-lg border-2 border-amber-400 bg-white/80 text-amber-900 font-bold text-right focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 text-right mb-4">
          <div className="bg-white/60 rounded-xl p-3 border border-amber-300">
            <p className="text-sm text-amber-700 font-bold">المحطات المكتملة</p>
            <p className="text-xl font-black text-amber-900">{completedCount}/7</p>
          </div>
          <div className="bg-white/60 rounded-xl p-3 border border-amber-300">
            <p className="text-sm text-amber-700 font-bold">XP</p>
            <p className="text-xl font-black text-amber-900">{xp}</p>
          </div>
          <div className="bg-white/60 rounded-xl p-3 border border-amber-300">
            <p className="text-sm text-amber-700 font-bold">المستوى</p>
            <p className="text-xl font-black text-amber-900">{level}</p>
          </div>
          <div className="bg-white/60 rounded-xl p-3 border border-amber-300">
            <p className="text-sm text-amber-700 font-bold">النجوم</p>
            <p className="text-xl font-black text-amber-900">{totalStars}/21</p>
          </div>
          <div className="bg-white/60 rounded-xl p-3 border border-amber-300">
            <p className="text-sm text-amber-700 font-bold">الكنوز</p>
            <p className="text-xl font-black text-amber-900">{badgeCount}/7</p>
          </div>
          <div className="bg-white/60 rounded-xl p-3 border border-amber-300">
            <p className="text-sm text-amber-700 font-bold">التحدي النهائي</p>
            <p className="text-xl font-black text-amber-900">{'⭐'.repeat(Math.min(finalStars, 5))}</p>
          </div>
        </div>

        {/* Achievement */}
        <div className="text-center bg-amber-200/60 rounded-2xl p-4 border-2 border-amber-500">
          <Award className="w-8 h-8 text-amber-700 mx-auto mb-1" />
          <p className="font-serif text-lg font-bold text-amber-800">
            {tierTitle ? `🏆 ${tierTitle}` : '🏆 أكملت رحلة سفر باروخ!'}
          </p>
        </div>
      </motion.div>

      {/* Download buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={downloadPNG}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-l from-amber-500 to-amber-700 text-white font-bold shadow-lg focus:outline-none focus:ring-4 focus:ring-amber-300"
        >
          <Download className="w-5 h-5" />
          {downloaded ? 'تم التحميل!' : 'تحميل كصورة PNG'}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={downloadPDF}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-l from-royal-500 to-royal-700 text-white font-bold shadow-lg focus:outline-none focus:ring-4 focus:ring-royal-300"
        >
          <FileText className="w-5 h-5" />
          تحميل كـ PDF
        </motion.button>
      </div>

      {/* Reset */}
      <div className="text-center">
        <button
          onClick={onReset}
          className="text-sm text-royal-600 underline hover:text-royal-800"
        >
          إعادة الرحلة من البداية
        </button>
      </div>
    </div>
  );
}
