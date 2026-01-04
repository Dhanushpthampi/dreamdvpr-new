'use client';

import { useState } from 'react';
import GlassCard from '@/app/components/ui/GlassCard';

const MeetingScheduler = ({ onSchedule, availableSlots = [] }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // No longer generating just 14 weekdays
  const defaultTimeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  ];

  const timeSlots = availableSlots.length ? availableSlots : defaultTimeSlots;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const handleSchedule = () => {
    if (!selectedDate || !selectedTime) return;

    onSchedule?.({
      date: selectedDate,
      time: selectedTime,
    });
  };

  /* --------------------------------
     Card styles
  --------------------------------- */
  const BASE_CARD =
    'text-center transition-all duration-300 transform border';

  const UNSELECTED_CARD =
    '!bg-white/40 !border-white/30 !text-gray-800 hover:scale-102';

  const SELECTED_CARD =
    '!bg-[#00abad]/10 !border-2 !border-[#00abad] ring-2 ring-[#00abad]/30 shadow-lg scale-105 !text-[#00abad]';

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto">
      {/* Date Selection */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800 tracking-tight">
          Select a Date
        </h3>

        <div className="relative group">
          <input
            type="date"
            min={new Date().toISOString().split('T')[0]}
            value={selectedDate || ''}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-4 bg-white/60 border border-white/40 rounded-2xl text-lg font-bold text-gray-800 focus:outline-none focus:ring-4 focus:ring-[#00abad]/20 focus:border-[#00abad] transition-all appearance-none cursor-pointer"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#00abad]">
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <h3 className="text-xl font-bold text-gray-800 tracking-tight">
            Select a Time
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {timeSlots.map((time) => {
              const isSelected = selectedTime === time;

              return (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className="focus:outline-none"
                >
                  <GlassCard
                    p={3}
                    hover={!isSelected}
                    className={`${BASE_CARD} rounded-xl ${isSelected ? SELECTED_CARD : UNSELECTED_CARD
                      }`}
                  >
                    <p className="font-bold text-sm">{formatTime(time)}</p>
                  </GlassCard>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Confirmation */}
      {selectedDate && selectedTime && (
        <div className="animate-in zoom-in-95 duration-500">
          <GlassCard
            p={8}
            className="bg-[#00abad]/5 border-[#00abad]/20 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <svg viewBox="0 0 24 24" className="w-32 h-32 text-[#00abad]" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5z" />
              </svg>
            </div>

            <div className="flex flex-col items-center gap-6 text-center relative z-10">
              <div className="space-y-2">
                <p className="text-xs font-black text-[#00abad] uppercase tracking-[0.2em]">
                  Mission Schedule
                </p>
                <div className="space-y-1">
                  <p className="text-3xl font-black text-gray-900 leading-tight">
                    {formatDate(selectedDate)}
                  </p>
                  <p className="text-2xl font-bold text-[#00abad]">
                    at {formatTime(selectedTime)}
                  </p>
                </div>
              </div>

              <div className="w-full max-w-sm space-y-4">
                <button
                  onClick={handleSchedule}
                  className="w-full px-8 py-4 bg-[#00abad] text-white rounded-2xl font-black text-lg
                      hover:bg-[#008c8e] hover:shadow-xl hover:shadow-[#00abad]/20 active:scale-95
                      transition-all duration-300"
                >
                  Confirm Strategic Mission
                </button>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  A Google Meet link will be generated automatically
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default MeetingScheduler;
