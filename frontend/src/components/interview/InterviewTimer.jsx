import { Timer } from "lucide-react";

function InterviewTimer({ timeLeft }) {
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const isLow = timeLeft < 60;

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold border shadow-sm ${
      isLow 
        ? "bg-red-50 text-red-600 border-red-200 animate-pulse" 
        : "bg-white text-slate-700 border-slate-200"
    }`}>
      <Timer size={18} />
      <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
    </div>
  );
}

export default InterviewTimer;