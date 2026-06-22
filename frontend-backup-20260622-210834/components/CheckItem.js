export default function CheckItem({ check }) {
  const { name, score, max_score, passed, partial, finding, fix } = check;

  const colorClass = passed ? "text-green-600" : partial ? "text-orange-600" : "text-red-600";
  const bgClass = passed ? "bg-green-50" : partial ? "bg-orange-50" : "bg-red-50";
  const label = passed ? "PASS" : partial ? "PART" : "FAIL";

  return (
    <div className="border border-slate-200 rounded-xl p-4 sm:p-5 mb-3 bg-white">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-semibold text-sm sm:text-base text-slate-900">{name}</h3>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${bgClass} ${colorClass}`}>
            {label}
          </span>
          <span className={`font-bold text-sm ${colorClass}`}>
            {score}/{max_score}
          </span>
        </div>
      </div>
      <p className="text-xs sm:text-sm text-slate-600 mb-2 leading-relaxed">{finding}</p>
      {!passed && fix && (
        <div className="text-xs sm:text-sm text-brand bg-brand-50 rounded-lg px-3 py-2 leading-relaxed">
          <span className="font-semibold">Fix:</span> {fix}
        </div>
      )}
    </div>
  );
}
