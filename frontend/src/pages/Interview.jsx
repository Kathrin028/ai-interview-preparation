function Interview() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        Technical Interview
      </h1>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          Question 1
        </h2>

        <p className="mb-4">
          What is React and why is it used?
        </p>

        <textarea
          className="w-full min-h-[180px] sm:min-h-[220px] lg:min-h-[280px] border border-slate-200 bg-slate-50 rounded-xl p-5 text-slate-700 text-lg resize-y focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none transition"
          placeholder="Type your answer here..."
        ></textarea>

        <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded">
          Submit Answer
        </button>
      </div>
    </div>
  );
}

export default Interview;

