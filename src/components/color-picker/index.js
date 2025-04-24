'use client';

import { useState, useEffect } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Shade options
const shadeOptions = [
  { value: '50', label: 'Very Light', description: 'Almost white' },
  { value: '100', label: 'Extra Light', description: 'Very pale' },
  { value: '200', label: 'Light', description: 'Pale' },
  { value: '300', label: 'Medium Light', description: 'Soft' },
  { value: '400', label: 'Medium', description: 'Moderate' },
  { value: '500', label: 'Standard', description: 'Default intensity' },
  { value: '600', label: 'Medium Dark', description: 'Rich' },
  { value: '700', label: 'Dark', description: 'Bold' },
  { value: '800', label: 'Extra Dark', description: 'Deep' },
  { value: '900', label: 'Very Dark', description: 'Intense' },
];

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

  useEffect(() => {
    // Parse the value when it changes externally
    if (value) {
      const parts = value.split('-');
      if (parts.length >= 1) {
        setSelectedColor(parts[0]);
      }
      if (parts.length >= 2) {
        setSelectedShade(parts[1]);
      }
    }
  }, [value]);

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    if (showIntensity) {
      onChange(`${color}-${selectedShade}`);
    } else {
      onChange(color);
    }
    setOpen(false);
  };

  const handleShadeSelect = (shade) => {
    setSelectedShade(shade);
    onChange(`${selectedColor}-${shade}`);
  };

  // Find the selected color option
  const selectedOption = options.find(
    (option) => option.value === selectedColor
  );

  return (
    <div className='flex flex-col space-y-2'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            className='flex h-10 w-full items-center justify-between rounded-md border border-pink-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
            role='combobox'
            aria-expanded={open}
          >
            <div className='flex items-center gap-2'>
              {selectedColor && (
                <div
                  className='h-4 w-4 rounded-full'
                  style={{
                    backgroundColor:
                      selectedOption?.color || `var(--${selectedColor}-500)`,
                  }}
                />
              )}
              <span>{selectedOption?.label || 'Select a color'}</span>
            </div>
            <ChevronDown className='h-4 w-4 opacity-50' />
          </button>
        </PopoverTrigger>
        <PopoverContent className='w-[200px] p-0 bg-white'>
          <Command>
            <CommandInput placeholder='Search colors...' />
            <CommandList>
              <CommandEmpty>No colors found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleColorSelect(option.value)}
                    className='flex items-center gap-2 cursor-pointer'
                  >
                    <div
                      className='h-4 w-4 rounded-full'
                      style={{ backgroundColor: option.color }}
                    />
                    <span>{option.label}</span>
                    {selectedColor === option.value && (
                      <Check className='h-4 w-4 ml-auto' />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {showIntensity && selectedColor && (
        <Select value={selectedShade} onValueChange={handleShadeSelect}>
          <SelectTrigger className='border-pink-200'>
            <SelectValue placeholder='Select intensity' />
          </SelectTrigger>
          <SelectContent className='bg-white'>
            {shadeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className='flex flex-col'>
                  <span>{option.label}</span>
                  <span className='text-xs text-muted-foreground'>
                    {option.description}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
