'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

export function ImageUploader({
  onUpload,
  buttonText = 'Upload Image',
  buttonIcon,
  buttonClassName,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    // Check if file is an image
    if (!file.type.match('image.*')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file (JPEG, PNG, GIF, etc.)',
        variant: 'destructive',
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please select an image smaller than 5MB',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);

    try {
      onUpload(file);
    } catch (error) {
      console.error('Error handling file:', error);
      toast({
        title: 'Upload error',
        description: 'There was a problem processing your image',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className='w-full'>
      <div
        className={cn(
          'border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-colors',
          isDragging
            ? 'border-pink-500 bg-pink-50'
            : 'border-gray-300 hover:border-pink-300 hover:bg-pink-50/50'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <input
          type='file'
          ref={fileInputRef}
          onChange={handleFileChange}
          accept='image/*'
          className='hidden'
          disabled={isUploading}
        />
        <div className='flex flex-col items-center justify-center gap-2 py-2'>
          <Button
            type='button'
            disabled={isUploading}
            className={
              buttonClassName || 'bg-pink-500 hover:bg-pink-600 text-white'
            }
          >
            {buttonIcon}
            {isUploading ? 'Uploading...' : buttonText}
          </Button>
          <p className='text-sm text-muted-foreground'>
            or drag and drop an image here
          </p>
        </div>
      </div>
    </div>
  );
}
