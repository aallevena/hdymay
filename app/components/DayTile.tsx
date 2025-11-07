'use client';

import { DayEntry } from '@/types';
import Image from 'next/image';

interface DayTileProps {
  date: Date;
  entry: DayEntry | null;
  onClick: () => void;
}

export default function DayTile({ date, entry, onClick }: DayTileProps) {
  const day = date.getDate();
  const isToday = new Date().toDateString() === date.toDateString();

  return (
    <button
      onClick={onClick}
      className={`
        w-full h-full border rounded-lg overflow-hidden
        transition-all hover:scale-105 hover:shadow-lg
        ${isToday ? 'ring-2 ring-blue-500' : 'border-gray-300'}
        ${entry ? 'cursor-pointer' : 'cursor-pointer bg-gray-50 hover:bg-gray-100'}
      `}
    >
      {/* Day number in corner */}
      <div className="relative w-full h-full">
        <span className={`
          absolute top-1 left-1 text-xs font-medium z-10
          ${entry?.entry_type === 'photo' ? 'text-white drop-shadow-md' : 'text-gray-500'}
        `}>
          {day}
        </span>

        {/* Content */}
        {entry?.entry_type === 'photo' && entry.photo_url && (
          <div className="w-full h-full relative">
            <Image
              src={entry.photo_thumbnail_url || entry.photo_url}
              alt={`Photo for ${date.toDateString()}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 20vw, (max-width: 1024px) 15vw, 10vw"
            />
          </div>
        )}

        {entry?.entry_type === 'text' && entry.text_content && (
          <div
            className="w-full h-full flex items-center justify-center p-2"
            style={{ backgroundColor: entry.color || '#E5E7EB' }}
          >
            <p className="text-xs line-clamp-3 text-center text-gray-800">
              {entry.text_content}
            </p>
          </div>
        )}
      </div>
    </button>
  );
}
