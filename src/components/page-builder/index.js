'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormLabel } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';

// Page type options
const pageTypes = [
  { value: 'standard', label: 'Standard Page' },
  { value: 'color-page', label: 'Color Page' },
  { value: 'centered-color-page', label: 'Centered Color Page' },
];

export function PageBuilder({ page, onSave, onCancel }) {
  const [editedPage, setEditedPage] = useState < any > page;

  const handleChange = (field, value) => {
    setEditedPage({ ...editedPage, [field]: value });
  };

  const handleSave = () => {
    onSave(editedPage);
  };

  return (
    <div className='space-y-4 py-4'>
      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <FormLabel>Page ID</FormLabel>
          <Input
            value={editedPage.id}
            onChange={(e) => handleChange('id', e.target.value)}
            placeholder='page-id'
          />
        </div>
        <div className='space-y-2'>
          <FormLabel>Page Title</FormLabel>
          <Input
            value={editedPage.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder='Page Title'
          />
        </div>
        <div className='space-y-2'>
          <FormLabel>Page Type</FormLabel>
          <Select
            value={editedPage.type || ''}
            onValueChange={(value) => handleChange('type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder='Select page type' />
            </SelectTrigger>
            <SelectContent>
              {pageTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='space-y-2'>
          <FormLabel>Color Code</FormLabel>
          <Input
            value={editedPage.colorCode || ''}
            onChange={(e) => handleChange('colorCode', e.target.value)}
            placeholder='gray-900'
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className='flex justify-between items-center'>
            <CardTitle className='text-sm'>Components</CardTitle>
            <Button
              size='sm'
              variant='outline'
              className='gap-1'
              onClick={() => {
                const newComponents = [...(editedPage.components || [])];
                newComponents.push({
                  type: 'center-width-text-block',
                  title: 'New Component',
                  text: 'This is a new component. Edit this text to customize it.',
                });
                handleChange('components', newComponents);
              }}
            >
              <Plus className='h-3 w-3' /> Add Component
            </Button>
          </div>
        </CardHeader>
        <CardContent className='space-y-2'>
          {editedPage.components?.map((component, index) => (
            <div
              key={index}
              className='flex items-center justify-between p-2 border rounded-md'
            >
              <div>
                <span className='font-medium'>{component.type}</span>
                {component.title && (
                  <span className='ml-2 text-sm text-muted-foreground'>
                    {component.title.length > 30
                      ? `${component.title.substring(0, 30)}...`
                      : component.title}
                  </span>
                )}
              </div>
              <Button
                size='icon'
                variant='ghost'
                className='h-8 w-8 text-destructive'
                onClick={() => {
                  const newComponents = [...editedPage.components];
                  newComponents.splice(index, 1);
                  handleChange('components', newComponents);
                }}
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            </div>
          ))}
          {!editedPage.components?.length && (
            <div className='text-center p-4 text-muted-foreground text-sm'>
              No components added yet. Click "Add Component" to get started.
            </div>
          )}
        </CardContent>
      </Card>

      <div className='flex justify-end gap-2 pt-4'>
        <Button variant='outline' onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save Page</Button>
      </div>
    </div>
  );
}
