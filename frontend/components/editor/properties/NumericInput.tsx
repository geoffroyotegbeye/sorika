'use client';

import { ChevronUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface NumericInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  min?: number;
  step?: number;
  units?: string[];
  allowNegative?: boolean;
}

export function NumericInput({ 
  value, 
  onChange, 
  placeholder = '0',
  min = 0,
  step = 1,
  units = ['px', 'rem', '%', 'em', 'vh', 'vw'],
  allowNegative = false
}: NumericInputProps) {
  const parseValue = (val: string) => {
    const match = val.match(/^(-?\d*\.?\d+)(.*)$/);
    if (match) {
      return { number: parseFloat(match[1]), unit: match[2] || 'px' };
    }
    return { number: 0, unit: 'px' };
  };

  const { number, unit } = parseValue(value || '0px');
  const [currentUnit, setCurrentUnit] = useState(unit);

  const handleIncrement = () => {
    const newValue = allowNegative ? number + step : Math.max(min, number + step);
    onChange(`${newValue}${currentUnit}`);
  };

  const handleDecrement = () => {
    const newValue = allowNegative ? number - step : Math.max(min, number - step);
    onChange(`${newValue}${currentUnit}`);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) || 0;
    const newValue = allowNegative ? val : Math.max(min, val);
    onChange(`${newValue}${currentUnit}`);
  };

  const handleUnitChange = (newUnit: string) => {
    setCurrentUnit(newUnit);
    onChange(`${number}${newUnit}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      handleIncrement();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      handleDecrement();
    }
  };

  return (
    <div className="flex items-center gap-1">
      <div className="relative flex-1">
        <input
          type="number"
          value={number}
          onChange={handleNumberChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          min={min}
          step={step}
          className="w-full h-8 px-2 pr-6 rounded-md border text-xs"
        />
        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col">
          <button
            type="button"
            onClick={handleIncrement}
            className="h-3 w-4 flex items-center justify-center hover:bg-slate-100 rounded"
          >
            <ChevronUp className="h-2.5 w-2.5" />
          </button>
          <button
            type="button"
            onClick={handleDecrement}
            className="h-3 w-4 flex items-center justify-center hover:bg-slate-100 rounded"
          >
            <ChevronDown className="h-2.5 w-2.5" />
          </button>
        </div>
      </div>
      <select
        value={currentUnit}
        onChange={(e) => handleUnitChange(e.target.value)}
        className="h-8 px-2 rounded-md border text-xs w-16"
      >
        {units.map((u) => (
          <option key={u} value={u}>{u}</option>
        ))}
      </select>
    </div>
  );
}
