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
          className="w-full border rounded p-3"
          rows="6"
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

