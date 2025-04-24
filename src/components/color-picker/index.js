'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function ColorPicker({
  value,
  onChange,
  options,
  showIntensity = false,
}) {
  const [open, setOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(
    value?.split('-')[0] || ''
  );
  const [selectedShade, setSelectedShade] = useState(
    value?.split('-')[1] || '500'
  );

  // Parse the color value (e.g., "pink-500" -> { color: "pink", shade: "500" })
  const parseValue = (val) => {
    if (!val) return { color: '', shade: '500' };
    const parts = val.split('-');
    return {
      color: parts[0],
      shade: parts.length > 1 ? parts[1] : '500',
    };
  };

  // When the component mounts or value changes, update the internal state
  useState(() => {
    const { color, shade } = parseValue(value);
    setSelectedColor(color);
    setSelectedShade(shade);
  }, [value]);

  // Handle color selection
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    if (showIntensity) {
      onChange(`${color}-${selectedShade}`);
    } else {
      onChange(color);
      setOpen(false);
    }
  };

  // Handle shade selection
  const handleShadeSelect = (shade) => {
    setSelectedShade(shade);
    onChange(`${selectedColor}-${shade}`);
    setOpen(false);
  };

  // Find the current color option
  const currentColorOption = options.find(
    (option) => option.value === selectedColor
  );

  // Shade options
  const shadeOptions = [
    { value: '50', label: 'Very Light' },
    { value: '100', label: 'Extra Light' },
    { value: '200', label: 'Light' },
    { value: '300', label: 'Medium Light' },
    { value: '400', label: 'Medium' },
    { value: '500', label: 'Standard' },
    { value: '600', label: 'Medium Dark' },
    { value: '700', label: 'Dark' },
    { value: '800', label: 'Extra Dark' },
    { value: '900', label: 'Very Dark' },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className={cn(
            'w-full justify-start border-pink-200 hover:bg-pink-50 text-left font-normal',
            !value && 'text-muted-foreground'
          )}
        >
          {currentColorOption ? (
            <div className='flex items-center gap-2'>
              <div
                className='h-4 w-4 rounded-full border'
                style={{ backgroundColor: currentColorOption.color }}
              />
              <span>{currentColorOption.label}</span>
              {showIntensity && selectedShade && (
                <span className='text-muted-foreground'>
                  (
                  {shadeOptions.find((s) => s.value === selectedShade)?.label ||
                    selectedShade}
                  )
                </span>
              )}
            </div>
          ) : (
            'Select color'
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-64 p-3'>
        <div className='space-y-4'>
          <div className='grid grid-cols-5 gap-2'>
            {options.map((option) => (
              <Button
                key={option.value}
                variant='outline'
                className={cn(
                  'h-8 w-8 p-0 border',
                  selectedColor === option.value &&
                    'ring-2 ring-pink-500 ring-offset-2'
                )}
                style={{ backgroundColor: option.color }}
                onClick={() => handleColorSelect(option.value)}
                title={option.label}
              >
                {selectedColor === option.value && (
                  <Check className='h-4 w-4 text-white drop-shadow-[0_0_2px_rgba(0,0,0,0.5)]' />
                )}
              </Button>
            ))}
          </div>

          {showIntensity && selectedColor && (
            <div className='space-y-2'>
              <div className='text-xs font-medium'>Intensity</div>
              <Select value={selectedShade} onValueChange={handleShadeSelect}>
                <SelectTrigger className='border-pink-200'>
                  <SelectValue placeholder='Select intensity' />
                </SelectTrigger>
                <SelectContent className='bg-white'>
                  {shadeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
