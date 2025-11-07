'use client';

import { COLORS } from '@/lib/constants';

interface ColorPaletteProps {
  selectedColor: string | null;
  onSelectColor: (color: string) => void;
}

export default function ColorPalette({ selectedColor, onSelectColor }: ColorPaletteProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Choose a color
      </label>
      <div className="flex flex-wrap gap-2">
        {COLORS.map((color) => (
          <button
            key={color.hex}
            type="button"
            onClick={() => onSelectColor(color.hex)}
            className={`w-10 h-10 rounded-full border-2 transition-all ${
              selectedColor === color.hex
                ? 'border-gray-900 scale-110'
                : 'border-gray-300 hover:scale-105'
            }`}
            style={{ backgroundColor: color.hex }}
            title={color.name}
          />
        ))}
      </div>
    </div>
  );
}
