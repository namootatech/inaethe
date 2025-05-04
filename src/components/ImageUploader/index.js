'use client';

import { useState, useCallback } from 'react';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import ShortUniqueId from 'short-unique-id';

const uid = new ShortUniqueId({ length: 10 });

export function ImageUploader({
  onUploadComplete,
  maxSizeInMB = 5,
  defaultImage,
}) {
  const [uploadingImages, setUploadingImages] = useState(
    defaultImage
      ? [{ preview: defaultImage, file: new File([''], 'default.jpg') }]
      : []
  );
  const [uploadProgress, setUploadProgress] = useState({});
  const [error, setError] = useState(null);

  const uploadToCloudinary = async (file) => {
    // Only run in browser environment
    if (typeof window === 'undefined') return '';

    const fileId = uid.rnd();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'espazza_images'); // Replace with your unsigned upload preset

    try {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round(
            (event.loaded / event.total) * 100
          );
          setUploadProgress((prev) => ({
            ...prev,
            [fileId]: percentComplete,
          }));
        }
      });

      return new Promise((resolve, reject) => {
        xhr.open(
          'POST',
          'https://api.cloudinary.com/v1_1/espazza/image/upload'
        );

        xhr.onload = () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            resolve(response.secure_url);
          } else {
            reject(new Error('Upload failed'));
          }
        };

        xhr.onerror = () => {
          reject(new Error('Upload failed'));
        };

        xhr.send(formData);
      });
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      setUploadProgress((prev) => {
        const newProgress = { ...prev };
        delete newProgress[fileId];
        return newProgress;
      });
      throw error;
    }
  };

  const handleFileChange = useCallback(
    async (e) => {
      const selectedFiles = Array.from(e.target.files || []);
      setError(null);

      const oversizedFiles = selectedFiles.filter(
        (file) => file.size > maxSizeInMB * 1024 * 1024
      );
      if (oversizedFiles.length > 0) {
        setError(`Some files exceed the ${maxSizeInMB}MB limit`);
        return;
      }

      const newUploadingImages = selectedFiles.map((file) => ({
        file,
        progress: 0,
        preview: URL.createObjectURL(file),
      }));

      setUploadingImages((prev) => [...prev, ...newUploadingImages]);

      for (const image of newUploadingImages) {
        try {
          const url = await uploadToCloudinary(image.file);

          setUploadingImages((prev) =>
            prev.map((img) =>
              img.file === image.file ? { ...img, progress: 100, url } : img
            )
          );

          onUploadComplete([url]);
        } catch (error) {
          console.error('Error uploading file:', error);
          toast.error({
            title: 'Upload Error',
            description:
              'There was an error uploading your image. Please try again.',
            variant: 'destructive',
          });
          setUploadingImages((prev) =>
            prev.filter((img) => img.file !== image.file)
          );
        }
      }
    },
    [maxSizeInMB, onUploadComplete]
  );

  const removeImage = useCallback(
    (imageToRemove) => {
      setUploadingImages((prev) => prev.filter((img) => img !== imageToRemove));
      if (imageToRemove.url) {
        onUploadComplete(
          uploadingImages
            .filter((img) => img !== imageToRemove)
            .map((img) => img.url)
        );
      }
    },
    [uploadingImages, onUploadComplete]
  );

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-center w-full'>
        <label
          htmlFor='dropzone-file'
          className='flex flex-col items-center justify-center w-full h-32 border-2 border-zinc-300 border-dashed rounded-lg cursor-pointer bg-zinc-50 dark:hover:bg-bray-800 dark:bg-zinc-700 hover:bg-zinc-100 dark:border-zinc-600 dark:hover:border-zinc-500 dark:hover:bg-zinc-600'
        >
          <div className='flex flex-col items-center justify-center pt-5 pb-6'>
            <Upload className='w-8 h-8 mb-4 text-zinc-500 dark:text-zinc-400' />
            <p className='mb-2 text-sm text-zinc-500 dark:text-zinc-400'>
              <span className='font-semibold'>Click to upload</span> or drag and
              drop
            </p>
            <p className='text-xs text-zinc-500 dark:text-zinc-400'>
              PNG, JPG or GIF (MAX. {maxSizeInMB}MB)
            </p>
          </div>
          <input
            id='dropzone-file'
            type='file'
            className='hidden'
            onChange={handleFileChange}
            accept='image/*'
            multiple
          />
        </label>
      </div>

      {error && <p className='text-red-500 text-sm'>{error}</p>}

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {uploadingImages.map((image, index) => (
          <div key={index} className='relative'>
            <Image
              src={image.preview || '/placeholder.svg'}
              alt={`Preview ${index + 1}`}
              width={200}
              height={200}
              className='rounded-lg object-cover w-full h-40'
            />
            <button
              onClick={() => removeImage(image)}
              className='absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors'
            >
              <X className='w-4 h-4' />
            </button>
            <div className='w-full bg-zinc-200 rounded-full h-2.5 mt-2'>
              <div
                className='bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out'
                style={{ width: `${image.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
