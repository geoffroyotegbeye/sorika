'use client';

import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';

interface UnitInputProps {
  value: string | number | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
  defaultUnit?: string;
  units?: string[];
}

export function UnitInput({ 
  value, 
  onChange, 
  placeholder = '0',
  defaultUnit = 'px',
  units = ['px', '%', 'rem', 'em', 'vh', 'vw', 'auto']
}: UnitInputProps) {
  const parseValueAndUnit = (val: string | number | undefined): [string, string] => {
    if (!val) return ['', defaultUnit];
    const str = String(val);
    if (str === 'auto') return ['auto', 'auto'];
    const match = str.match(/^(-?\d*\.?\d+)(.*)$/);
    if (match) {
      return [match[1], match[2] || defaultUnit];
    }
    return ['', defaultUnit];
  };

  const [numValue, unit] = parseValueAndUnit(value);
  const [selectedUnit, setSelectedUnit] = useState(unit);

  useEffect(() => {
    setSelectedUnit(unit);
  }, [unit]);

  const handleValueChange = (newValue: string) => {
    if (newValue === '' || newValue === 'auto') {
      onChange(newValue === 'auto' ? 'auto' : `0${selectedUnit}`);
    } else {
      onChange(`${newValue}${selectedUnit}`);
    }
  };

  const handleUnitChange = (newUnit: string) => {
    setSelectedUnit(newUnit);
    if (newUnit === 'auto') {
      onChange('auto');
    } else if (numValue) {
      onChange(`${numValue}${newUnit}`);
    }
  };

  return (
    <div className="flex gap-1">
      <Input
        type={selectedUnit === 'auto' ? 'text' : 'number'}
        value={selectedUnit === 'auto' ? 'auto' : numValue}
        onChange={(e) => handleValueChange(e.target.value)}
        placeholder={placeholder}
        className="h-8 text-xs flex-1"
        disabled={selectedUnit === 'auto'}
      />
      <select
        value={selectedUnit}
        onChange={(e) => handleUnitChange(e.target.value)}
        className="h-8 px-2 rounded border text-xs bg-white w-16"
      >
        {units.map(u => (
          <option key={u} value={u}>{u}</option>
        ))}
      </select>
    </div>
  );
}
