// components/features/messages/DateSeparator.jsx
import { isToday, isYesterday, format } from 'date-fns';
import { vi } from 'date-fns/locale';

const DateSeparator = ({ date }) => {
  const formatDateSeparator = (dateStr) => {
    const dateObj = new Date(dateStr);
    
    if (isToday(dateObj)) {
      return 'Hôm nay';
    }
    
    if (isYesterday(dateObj)) {
      return 'Hôm qua';
    }
    
    // Format: "Thứ Hai, 13 tháng 6"
    return format(dateObj, 'EEEE, dd \'tháng\' M', { locale: vi });
  };

  return (
    <div className="flex items-center justify-center my-6">
      <div className="bg-gray-100 px-3 py-1 rounded-full">
        <span className="text-xs font-medium text-gray-600">
          {formatDateSeparator(date)}
        </span>
      </div>
    </div>
  );
};

export default DateSeparator;