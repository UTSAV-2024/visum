export default function ScoreCard({ score, band, message }) {
  const isHigh = score >= 85;
  const isMedium = score >= 65;
  const isLow = score >= 40;

  const colorClass = isHigh ? "text-green-600" : isMedium ? "text-brand" : isLow ? "text-orange-600" : "text-red-600";
  const bgClass = isHigh ? "bg-green-50" : isMedium ? "bg-brand-50" : isLow ? "bg-orange-50" : "bg-red-50";
  const ringClass = isHigh ? "ring-green-200" : isMedium ? "ring-brand-200" : isLow ? "ring-orange-200" : "ring-red-200";

  return (
    <div className={`${bgClass} rounded-2xl p-8 sm:p-10 text-center mb-6 ring-1 ${ringClass}`}>
      <div className={`text-7xl sm:text-8xl font-extrabold leading-none ${colorClass}`}>
        {score}
      </div>
      <div className="text-sm text-slate-400 mt-2 mb-1">out of 100</div>
      <div className={`text-xl sm:text-2xl font-bold mt-2 mb-3 ${colorClass}`}>
        {band}
      </div>
      <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto leading-relaxed">
        {message}
      </p>
    </div>
  );
}
