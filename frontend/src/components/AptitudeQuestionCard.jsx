function AptitudeQuestionCard({
  title,
  question,
  options,
  answer,
  setAnswer,
  currentQuestion,
  totalQuestions,
}) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <span className="font-semibold text-lg">
          Question {currentQuestion + 1} of {totalQuestions}
        </span>
      </div>

      <h2 className="text-3xl font-bold mb-6">{title}</h2>

      <p className="text-xl mb-6">{question}</p>

      <div className="space-y-4">
        {options.map((opt, idx) => (
          <label
            key={idx}
            className={`block border-2 p-4 rounded-xl cursor-pointer transition-all ${
              answer === opt
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            <input
              type="radio"
              name={`question-${currentQuestion}`}
              value={opt}
              checked={answer === opt}
              onChange={(e) => setAnswer(e.target.value)}
              className="mr-3 cursor-pointer"
            />
            <span className="text-lg">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default AptitudeQuestionCard;
