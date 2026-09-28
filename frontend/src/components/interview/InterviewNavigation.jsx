import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";

function InterviewNavigation({
  currentQuestion,
  totalQuestions,
  onPrevious,
  onNext,
  onFinish,
}) {
  return (
    <div className="flex justify-between items-center mt-6">
      <button
        onClick={onPrevious}
        disabled={currentQuestion === 0}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition disabled:opacity-0 text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
      >
        <ArrowLeft size={18} /> Previous
      </button>

      {currentQuestion === totalQuestions - 1 ? (
        <button
          onClick={onFinish}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl font-bold transition shadow-sm shadow-green-600/30"
        >
          <CheckCircle size={18} /> Submit Interview
        </button>
      ) : (
        <button
          onClick={onNext}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition shadow-sm shadow-blue-600/30"
        >
          Next <ArrowRight size={18} />
        </button>
      )}
    </div>
  );
}

export default InterviewNavigation;