'use client';

import { useState } from 'react';
import GlassCard from '@/app/components/ui/GlassCard';

const MeetingScheduler = ({ onSchedule, availableSlots = [] }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // Generate next 14 weekdays
  const generateDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date);
      }
    }

    return dates;
  };

  const defaultTimeSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '01:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
  ];

  const dates = generateDates();
  const timeSlots = availableSlots.length ? availableSlots : defaultTimeSlots;

  const formatDate = (date) =>
    date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

  const handleSchedule = () => {
    if (!selectedDate || !selectedTime) return;

    onSchedule?.({
      date: selectedDate,
      time: selectedTime,
    });
  };

  /* --------------------------------
     Card styles (single source of truth)
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

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {dates.map((date) => {
            const dateStr = date.toISOString().split('T')[0];
            const isSelected = selectedDate === dateStr;

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(dateStr)}
                className="focus:outline-none"
              >
                <GlassCard
                  p={4}
                  hover={!isSelected}
                  className={`${BASE_CARD} ${
                    isSelected ? SELECTED_CARD : UNSELECTED_CARD
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1">
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </p>
                  <p className="text-2xl font-black mb-1">
                    {date.getDate()}
                  </p>
                  <p className="text-xs font-medium">
                    {date.toLocaleDateString('en-US', { month: 'short' })}
                  </p>
                </GlassCard>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <h3 className="text-xl font-bold text-gray-800 tracking-tight">
            Select a Time
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {timeSlots.map((time) => {
              const isSelected = selectedTime === time;

              return (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className="focus:outline-none"
                >
                  <GlassCard
                    p={4}
                    hover={!isSelected}
                    className={`${BASE_CARD} ${
                      isSelected ? SELECTED_CARD : UNSELECTED_CARD
                    }`}
                  >
                    <p className="font-bold text-sm">{time}</p>
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
            className="bg-white/60 backdrop-blur-xl border-white/40 shadow-2xl"
          >
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">
                  Your Appointment
                </p>
                <p className="text-3xl font-black text-[#00abad] leading-tight">
                  {formatDate(new Date(selectedDate))}
                  <span className="block text-gray-900 text-2xl mt-1">
                    at {selectedTime}
                  </span>
                </p>
              </div>

              <button
                onClick={handleSchedule}
                className="w-full px-4 py-3 bg-[#00abad] text-white rounded-lg font-medium
                  hover:bg-[#008c8e] active:bg-[#007a7c]
                  transition-all duration-200"
              >
                Confirm Mission
              </button>

              <p className="text-xs text-gray-400">
                Powered by DREAMdvpr Aerospace Scheduling
              </p>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default MeetingScheduler;
