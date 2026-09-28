import { useState, useRef } from "react";

function CommunicationQuestionCard({
  title,
  question,
  answer,
  setAnswer,
  currentQuestion,
  totalQuestions,
}) {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  const isSpeechSupported = "SpeechRecognition" in window || "webkitSpeechRecognition" in window;

  const handleMicClick = () => {
    if (!isSpeechSupported) {
      alert("Speech recognition is not supported in this browser. Please use text mode.");
      return;
    }

    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + " ";
        }
      }
      if (finalTranscript) {
        setAnswer((prev) => (prev ? prev + " " + finalTranscript.trim() : finalTranscript.trim()));
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <span className="font-semibold text-lg">
          Question {currentQuestion + 1} of {totalQuestions}
        </span>
      </div>

      <h2 className="text-3xl font-bold mb-6">{title}</h2>

      <p className="text-xl mb-6">{question}</p>

      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold">Your Response</span>
        <button
          onClick={handleMicClick}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-white transition-colors ${
            isRecording ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-indigo-500 hover:bg-indigo-600"
          }`}
        >
          {isRecording ? "🔴 Recording..." : "🎤 Speak"}
        </button>
      </div>

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type your answer here or click Speak to record..."
        className="w-full min-h-[180px] sm:min-h-[220px] lg:min-h-[280px] border-2 border-gray-300 rounded-xl p-5 text-lg resize-y focus:border-blue-500 focus:outline-none transition"
      />
      {!isSpeechSupported && (
        <p className="text-sm text-red-500 mt-2">
          * Speech recognition is not available in your current browser. Text mode only.
        </p>
      )}
    </div>
  );
}

export default CommunicationQuestionCard;
