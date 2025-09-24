// TimeFilter Component  
const TimeFilter = ({ activeTimeFilter, onTimeFilterChange }) => {
  const timeFilters = [
    { key: "today", label: "Hôm nay" },
    { key: "week", label: "Tuần này" },
    { key: "month", label: "Tháng này" },
    { key: "all", label: "Tất cả" }
  ];

  return (
    <div className="flex gap-3 mb-6">
      {timeFilters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onTimeFilterChange(filter.key)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
            activeTimeFilter === filter.key
              ? "bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg"
              : "bg-white/70 text-gray-700 hover:bg-white hover:shadow-md"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default TimeFilter;