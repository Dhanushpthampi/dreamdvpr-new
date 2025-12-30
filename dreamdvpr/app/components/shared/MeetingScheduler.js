'use client';

import { useState } from 'react';
import ThemedButton from '@/app/components/ui/ThemedButton';
import GlassCard from '@/app/components/ui/GlassCard';

/**
 * Meeting scheduler component with calendar and time slots
 * @param {Object} props
 * @param {function} props.onSchedule - Callback when meeting is scheduled
 * @param {Array} props.availableSlots - Available time slots
 */
const MeetingScheduler = ({ onSchedule, availableSlots = [] }) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

    // Generate next 14 days
    const generateDates = () => {
        const dates = [];
        const today = new Date();

        for (let i = 1; i <= 14; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);

            // Skip weekends
            if (date.getDay() !== 0 && date.getDay() !== 6) {
                dates.push(date);
            }
        }

        return dates;
    };

    // Default time slots (9 AM - 5 PM, 1-hour slots)
    const defaultTimeSlots = [
        '09:00 AM', '10:00 AM', '11:00 AM',
        '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
    ];

    const timeSlots = availableSlots.length > 0 ? availableSlots : defaultTimeSlots;
    const dates = generateDates();

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        });
    };

    const handleSchedule = () => {
        if (selectedDate && selectedTime && onSchedule) {
            onSchedule({
                date: selectedDate,
                time: selectedTime,
            });
        }
    };

    return (
        <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto">
            {/* Date Selection */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 tracking-tight">
                    Select a Date
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {dates.map((date, index) => {
                        const dateStr = date.toISOString().split('T')[0];
                        const isSelected = selectedDate === dateStr;

                        return (
                            <button
                                key={index}
                                onClick={() => setSelectedDate(dateStr)}
                                className="focus:outline-none"
                            >
                                <GlassCard
                                    p={4}
                                    hover={!isSelected}
                                    className={`text-center transition-all duration-300 transform ${isSelected
                                        ? 'bg-[#00abad] border-[#008c8e] scale-105 shadow-lg'
                                        : 'bg-white/40 hover:scale-102'
                                        }`}
                                >
                                    <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isSelected ? 'text-white/80' : 'text-gray-500'
                                        }`}>
                                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                    </p>
                                    <p className={`text-2xl font-black mb-1 ${isSelected ? 'text-white' : 'text-gray-900'
                                        }`}>
                                        {date.getDate()}
                                    </p>
                                    <p className={`text-xs font-medium ${isSelected ? 'text-white/90' : 'text-gray-600'
                                        }`}>
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
                        {timeSlots.map((time, index) => {
                            const isSelected = selectedTime === time;

                            return (
                                <button
                                    key={index}
                                    onClick={() => setSelectedTime(time)}
                                    className="focus:outline-none"
                                >
                                    <GlassCard
                                        p={4}
                                        hover={!isSelected}
                                        className={`text-center transition-all duration-300 transform ${isSelected
                                            ? 'bg-[#00abad] border-[#008c8e] scale-105 shadow-md'
                                            : 'bg-white/40 hover:scale-102'
                                            }`}
                                    >
                                        <p className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-gray-800'
                                            }`}>
                                            {time}
                                        </p>
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
                    <GlassCard p={8} className="bg-white/60 backdrop-blur-xl border-white/40 shadow-2xl">
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

                            <ThemedButton
                                variant="primary"
                                size="lg"
                                className="w-full max-w-sm py-4 text-xl shadow-lg hover:shadow-[#00abad]/20"
                                onClick={handleSchedule}
                            >
                                Confirm Mission
                            </ThemedButton>

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
