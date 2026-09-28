function DashboardCard({ title, value, highlight = false }) {
  return (
    <div className={`rounded-xl p-5 border transition duration-300 flex flex-col justify-center ${
      highlight 
        ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-900/20" 
        : "bg-white border-slate-200 text-slate-900 hover:border-blue-300 hover:shadow-sm"
    }`}>
      <h3 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${highlight ? "text-blue-100" : "text-slate-500"}`}>
        {title}
      </h3>
      <h1 className={`text-2xl lg:text-3xl font-bold tracking-tight ${highlight ? "text-white" : "text-slate-900"}`}>
        {value}
      </h1>
    </div>
  );
}

export default DashboardCard;
