function InterviewSummary({
  answered,
  total,
  difficulty,
  timeTaken,
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8">

      <h1 className="text-3xl font-bold mb-8">

        🎉 Interview Completed

      </h1>

      <div className="space-y-4">

        <p>

          <strong>Difficulty:</strong> {difficulty}

        </p>

        <p>

          <strong>Answered:</strong> {answered}/{total}

        </p>

        <p>

          <strong>Time Taken:</strong> {timeTaken}s

        </p>

        <p>

          <strong>AI Evaluation:</strong> Pending...

        </p>

      </div>

    </div>
  );
}

export default InterviewSummary;