export default function ScoreCard({ score, band, message }) {
  const isHigh = score >= 85;
  const isMedium = score >= 65;
  const isLow = score >= 40;

  const colorClass = isHigh ? "text-green-500" : isMedium ? "text-accent" : isLow ? "text-orange-500" : "text-red-500";
  const bgClass = isHigh ? "bg-green-500/10" : isMedium ? "bg-accent/10" : isLow ? "bg-orange-500/10" : "bg-red-500/10";
  const ringClass = isHigh ? "ring-green-500/30" : isMedium ? "ring-accent/30" : isLow ? "ring-orange-500/30" : "ring-red-500/30";

  return (
    <div className={`${bgClass} rounded-2xl p-8 sm:p-10 text-center mb-6 ring-1 ${ringClass} border border-border`}>
      <div className={`text-7xl sm:text-8xl font-extrabold leading-none ${colorClass}`}>
        {score}
      </div>
      <div className="text-sm text-muted-foreground mt-2 mb-1">out of 100</div>
      <div className={`text-xl sm:text-2xl font-bold mt-2 mb-3 ${colorClass}`}>
        {band}
      </div>
      <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
        {message}
      </p>
    </div>
  );
}
