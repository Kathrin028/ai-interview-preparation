import { Brain } from "lucide-react";

function QuestionCard({
  title,
  question,
  answer,
  setAnswer,
  currentQuestion,
  totalQuestions,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200 p-4 sm:p-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
            <Brain size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 leading-tight">{title}</h3>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Question {currentQuestion + 1} of {totalQuestions}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-1.5">
        <div 
          className="bg-blue-600 h-1.5 transition-all duration-300" 
          style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Body */}
      <div className="p-6 sm:p-8 flex-1 flex flex-col">
        
        <p className="text-xl sm:text-2xl font-medium text-slate-900 mb-8 leading-relaxed">
          {question}
        </p>

        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your detailed answer here..."
          className="w-full flex-1 min-h-[200px] border border-slate-200 bg-slate-50 rounded-xl p-5 text-slate-700 text-lg resize-y focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none transition"
        />

      </div>

    </div>
  );
}

export default QuestionCard;