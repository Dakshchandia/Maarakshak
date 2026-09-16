import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Baby } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, 
  isSameMonth, isSameDay, startOfWeek, endOfWeek 
} from 'date-fns';
import { DailyReportModal } from '@/components/common/DailyReportModal';
import type { Pregnancy } from '@/types';

interface PregnancyCalendarProps {
  pregnancy: Pregnancy;
}

export function PregnancyCalendar({ pregnancy }: PregnancyCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5)); // June 2026 to match screenshot, normally new Date()
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2026, 5, 23));
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "MMMM yyyy";
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const getDayData = (date: Date) => {
    const day = date.getDate();
    // Deterministic mock based on date to visually match a realistic calendar
    const isMissed = day === 7 || day === 14 || day === 21 || day === 28 || day === 24 || day === 26 || day === 30 || day === 13 || day === 27; 
    const isHighRisk = day === 23 || day === 19;
    const isMediumRisk = day === 6 || day === 9 || day === 16 || day === 17 || day === 20;
    const isLowRisk = !isMissed && !isHighRisk && !isMediumRisk;
    
    const hasAppointment = day === 5 || day === 15 || day === 22 || day === 25 || day === 30;
    const hasMilestone = day === 23;

    return {
      status: isHighRisk ? 'high' : isMediumRisk ? 'medium' : isMissed ? 'missed' : 'low',
      hasAppointment,
      hasMilestone
    };
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{format(currentDate, dateFormat)}</h3>
          <p className="text-sm text-gray-500">Click any date to see daily details</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-2 border rounded-full hover:bg-gray-50 transition-colors">
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          </button>
          <button onClick={goToToday} className="px-4 py-1.5 text-sm font-medium text-pink-600 bg-pink-50 rounded-full hover:bg-pink-100 transition-colors">
            Today
          </button>
          <button onClick={nextMonth} className="p-2 border rounded-full hover:bg-gray-50 transition-colors">
            <ChevronRight className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6 text-sm text-gray-600">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div> Low Risk
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div> Medium Risk
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div> High Risk
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div> Missed
        </div>
        <div className="flex items-center gap-1.5 ml-2">
          <CalendarIcon className="w-4 h-4 text-blue-400" /> Appointment
        </div>
        <div className="flex items-center gap-1.5">
          <Baby className="w-4 h-4 text-amber-500" /> Milestone
        </div>
      </div>

    {/* Calendar Grid */}
      <div className="grid grid-cols-7 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-[10px] font-bold text-gray-400 py-1 tracking-wider">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-2">
        {days.map((day, idx) => {
          const data = getDayData(day);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, monthStart);

          return (
            <div 
              key={idx} 
              onClick={() => {
                setSelectedDate(day);
                setIsReportModalOpen(true);
              }}
              className={cn(
                "flex flex-col items-center justify-center p-1.5 cursor-pointer transition-all rounded-xl relative mx-1",
                !isCurrentMonth && "opacity-30",
                isSelected && "bg-pink-50 border-2 border-pink-300 shadow-sm"
              )}
              style={{ minHeight: '52px' }}
            >
              <span className={cn(
                "text-sm font-semibold mb-0.5",
                isSelected ? "text-gray-900" : "text-gray-600"
              )}>
                {format(day, 'd')}
              </span>
              <div className="flex items-center gap-1 h-3">
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full shrink-0",
                  data.status === 'low' && "bg-emerald-500",
                  data.status === 'medium' && "bg-amber-500",
                  data.status === 'high' && "bg-red-500",
                  data.status === 'missed' && "bg-gray-300"
                )}></div>
                {data.hasAppointment && <CalendarIcon className="w-3 h-3 text-blue-400 shrink-0" />}
                {data.hasMilestone && <Baby className="w-3 h-3 text-amber-500 shrink-0" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Day Details */}
      {selectedDate && (
        <div id="selected-day-details" className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 gap-4">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-3 h-3 rounded-full shrink-0",
              getDayData(selectedDate).status === 'low' && "bg-emerald-500",
              getDayData(selectedDate).status === 'medium' && "bg-amber-500",
              getDayData(selectedDate).status === 'high' && "bg-red-500",
              getDayData(selectedDate).status === 'missed' && "bg-gray-300"
            )}></div>
            <div>
              <p className="font-semibold text-gray-900">{format(selectedDate, 'EEEE, MMMM d')}</p>
              <p className="text-sm text-gray-500">
                {getDayData(selectedDate).status === 'high' ? 'High Risk' : 
                 getDayData(selectedDate).status === 'medium' ? 'Medium Risk' : 
                 getDayData(selectedDate).status === 'low' ? 'Low Risk' : 'Missed'} 
                {' · Score '}{getDayData(selectedDate).status === 'high' ? '77' : getDayData(selectedDate).status === 'medium' ? '50' : '20'}/100
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsReportModalOpen(true)}
            className="px-5 py-2 text-sm font-semibold border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors bg-white shadow-sm whitespace-nowrap"
          >
            View Details
          </button>
        </div>
      )}

      {/* Pop-up Window for Report */}
      {selectedDate && (
        <DailyReportModal 
          isOpen={isReportModalOpen} 
          onClose={() => setIsReportModalOpen(false)} 
          date={selectedDate} 
          status={getDayData(selectedDate).status as 'low' | 'medium' | 'high' | 'missed'} 
          score={getDayData(selectedDate).status === 'high' ? 77 : getDayData(selectedDate).status === 'medium' ? 50 : 92}
        />
      )}
    </div>
  );
}
