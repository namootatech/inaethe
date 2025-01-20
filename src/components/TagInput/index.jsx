'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export default function TagInput({ tags, setTags }) {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue) {
      e.preventDefault();
      addTag(inputValue);
    }
  };

  const addTag = (tag) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div>
      <div className='flex flex-wrap gap-2 mb-2'>
        {tags.map((tag) => (
          <span
            key={tag}
            className='bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm flex items-center'
          >
            {tag}
            <Button
              variant='ghost'
              size='sm'
              className='ml-1 h-4 w-4 p-0'
              onClick={() => removeTag(tag)}
              aria-label={`Remove ${tag} tag`}
            >
              <X className='h-3 w-3' />
            </Button>
          </span>
        ))}
      </div>
      <div className='flex gap-2'>
        <Input
          type='text'
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          placeholder='Type a tag and press Enter'
          aria-label='Add a new tag'
        />
        <Button
          onClick={() => addTag(inputValue)}
          disabled={!inputValue.trim()}
        >
          Add Tag
        </Button>
      </div>
      <p className='text-sm text-muted-foreground mt-1'>
        Press Enter or click "Add Tag" to add a new tag
      </p>
    </div>
  );
}
