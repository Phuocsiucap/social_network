// FilterTabs Component
import {Phone, PhoneCall, PhoneOff} from "lucide-react";
const FilterTabs = ({ activeFilter, onFilterChange, counts }) => {
  const filters = [
    { key: "all", label: "Tất cả", icon: Phone },
    { key: "incoming", label: "Đến", icon: PhoneCall },
    { key: "outgoing", label: "Đi", icon: Phone },
    { key: "missed", label: "Nhỡ", icon: PhoneOff }
  ];

  return (
    <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-4 mb-6 shadow-lg">
      <div className="flex items-center gap-3 flex-wrap">
        {filters.map((filter) => {
          const Icon = filter.icon;
          return (
            <button
              key={filter.key}
              onClick={() => onFilterChange(filter.key)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeFilter === filter.key
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105"
                  : "bg-white/80 text-gray-700 hover:bg-white hover:shadow-md hover:scale-102"
              }`}
            >
              <Icon className="h-4 w-4" />
              {filter.label}
              <span
                className={`px-2 py-1 rounded-full text-xs font-bold ${
                  activeFilter === filter.key
                    ? "bg-white/30 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {counts[filter.key]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FilterTabs;