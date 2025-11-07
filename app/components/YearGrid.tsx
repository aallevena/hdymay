'use client';

import { useState, useEffect } from 'react';
import { DayEntry } from '@/types';
import DayTile from './DayTile';
import DayModal from './DayModal';
import { MONTH_ABBR } from '@/lib/constants';

interface YearGridProps {
  year: number;
}

export default function YearGrid({ year }: YearGridProps) {
  const [entries, setEntries] = useState<DayEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, [year]);

  const fetchEntries = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/entries?year=${year}`);
      if (res.ok) {
        const data = await res.json();
        setEntries(data);
      } else {
        // If API fails, just set empty entries so grid still renders
        setEntries([]);
      }
    } catch (error) {
      console.error('Error fetching entries:', error);
      // Even on error, set empty entries so grid still renders
      setEntries([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTileClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  const handleSave = () => {
    fetchEntries();
  };

  // Generate weeks for the entire year
  const generateYearWeeks = () => {
    const weeks: { days: (Date | null)[]; month: number }[] = [];
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    // Start from the first Sunday on or before Jan 1
    let currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() - currentDate.getDay());

    while (currentDate <= endDate || currentDate.getMonth() === endDate.getMonth()) {
      const week: (Date | null)[] = [];
      let weekMonth = -1;

      // Add 7 days for the week (Sun-Sat)
      for (let i = 0; i < 7; i++) {
        const day = new Date(currentDate);

        // Only include days that are in the target year
        if (day.getFullYear() === year) {
          week.push(day);
          if (weekMonth === -1) weekMonth = day.getMonth();
        } else {
          week.push(null);
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }

      weeks.push({ days: week, month: weekMonth });

      // Stop if we've gone past the end of the year
      if (currentDate.getFullYear() > year) break;
    }

    return weeks;
  };

  // Find entry for a specific date
  const getEntryForDate = (date: Date): DayEntry | null => {
    const dateStr = date.toISOString().split('T')[0];
    return entries.find((entry) => entry.date.startsWith(dateStr)) || null;
  };

  const selectedEntry = selectedDate ? getEntryForDate(selectedDate) : null;
  const weeks = generateYearWeeks();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading your year...</div>
      </div>
    );
  }

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Track which month we're currently displaying
  let currentDisplayMonth = -1;

  return (
    <>
      <div className="overflow-x-auto">
        {/* Day of week headers */}
        <div className="grid grid-cols-[60px_repeat(7,minmax(40px,1fr))] gap-1 mb-2 sticky top-0 bg-gray-50 py-2 z-10">
          <div className="w-[60px]"></div>
          {dayNames.map((day) => (
            <div key={day} className="text-center text-xs font-semibold text-gray-600 min-w-[40px]">
              {day}
            </div>
          ))}
        </div>

        {/* Weeks */}
        <div className="space-y-1">
          {weeks.map((week, weekIndex) => {
            const isNewMonth = week.month !== currentDisplayMonth && week.month !== -1;
            if (isNewMonth) {
              currentDisplayMonth = week.month;
            }

            return (
              <div key={weekIndex} className="grid grid-cols-[60px_repeat(7,minmax(40px,1fr))] gap-1">
                {/* Month label */}
                <div className="w-[60px] flex items-center justify-end pr-2">
                  {isNewMonth && (
                    <span className="text-xs font-semibold text-gray-700">
                      {MONTH_ABBR[week.month]}
                    </span>
                  )}
                </div>

                {/* Days */}
                {week.days.map((day, dayIndex) => (
                  <div key={dayIndex} className="aspect-square min-w-[40px] min-h-[40px]">
                    {day ? (
                      <DayTile
                        date={day}
                        entry={getEntryForDate(day)}
                        onClick={() => handleTileClick(day)}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 rounded"></div>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {selectedDate && (
        <DayModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          date={selectedDate}
          entry={selectedEntry}
          onSave={handleSave}
        />
      )}
    </>
  );
}
