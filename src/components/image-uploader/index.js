'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ImageUploader({
  onUpload,
  buttonText = 'Upload Image',
  buttonIcon = null,
  buttonClassName = '',
  acceptedTypes = 'image/*',
  maxSizeMB = 5,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndUpload(file);
    }
  };

  const validateAndUpload = (file) => {
    // Check file size (convert MB to bytes)
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Only image files are allowed');
      return;
    }

    onUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndUpload(file);
    }
  };

  return (
    <div className='w-full'>
      <div
        className={cn(
          'border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-colors',
          isDragging
            ? 'border-pink-500 bg-pink-50'
            : 'border-pink-200 hover:border-pink-300'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type='file'
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={acceptedTypes}
          className='hidden'
        />
        <Button
          type='button'
          className={cn(
            'bg-pink-500 hover:bg-pink-600 text-white',
            buttonClassName
          )}
        >
          {buttonIcon}
          {buttonText}
        </Button>
        <p className='mt-2 text-sm text-muted-foreground'>
          or drag and drop an image here
        </p>
        <p className='text-xs text-muted-foreground mt-1'>
          Max size: {maxSizeMB}MB
        </p>
      </div>
    </div>
  );
}
