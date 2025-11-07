'use client';

import { useState } from 'react';
import YearGrid from './components/YearGrid';
import YearSelector from './components/YearSelector';

export default function Home() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            How Do You Measure A Year?
          </h1>
          <YearSelector
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
          />
        </div>

        {/* Grid */}
        <YearGrid year={selectedYear} />
      </div>
    </main>
  );
}
