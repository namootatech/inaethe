'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { label } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Upload, ImageIcon } from 'lucide-react';
import { ImageUploader } from '@/components/image-uploader';
import { ColorPicker } from '@/components/color-picker';

// User-friendly color options
const colorOptions = [
  { value: 'slate', label: 'Dark Gray', color: '#64748b' },
  { value: 'gray', label: 'Gray', color: '#6b7280' },
  { value: 'zinc', label: 'Zinc Gray', color: '#71717a' },
  { value: 'neutral', label: 'Neutral Gray', color: '#737373' },
  { value: 'stone', label: 'Stone Gray', color: '#78716c' },
  { value: 'red', label: 'Red', color: '#ef4444' },
  { value: 'orange', label: 'Orange', color: '#f97316' },
  { value: 'amber', label: 'Amber', color: '#f59e0b' },
  { value: 'yellow', label: 'Yellow', color: '#eab308' },
  { value: 'lime', label: 'Lime Green', color: '#84cc16' },
  { value: 'green', label: 'Green', color: '#22c55e' },
  { value: 'emerald', label: 'Emerald', color: '#10b981' },
  { value: 'teal', label: 'Teal', color: '#14b8a6' },
  { value: 'cyan', label: 'Cyan', color: '#06b6d4' },
  { value: 'sky', label: 'Sky Blue', color: '#0ea5e9' },
  { value: 'blue', label: 'Blue', color: '#3b82f6' },
  { value: 'indigo', label: 'Indigo', color: '#6366f1' },
  { value: 'violet', label: 'Violet', color: '#8b5cf6' },
  { value: 'purple', label: 'Purple', color: '#a855f7' },
  { value: 'fuchsia', label: 'Fuchsia', color: '#d946ef' },
  { value: 'pink', label: 'Pink', color: '#ec4899' },
  { value: 'rose', label: 'Rose', color: '#f43f5e' },
];

// Component type options
const componentTypes = [
  { value: 'hero', label: 'Hero Section' },
  { value: 'article', label: 'Article' },
  { value: 'spa-block', label: 'Features Block' },
  { value: 'FlexwindHero3', label: 'Flexwind Hero 3' },
  { value: 'FlexwindHero4', label: 'Flexwind Hero 4' },
  { value: 'FlexwindFeatures1', label: 'Flexwind Features' },
  { value: 'PageDoneHowItWorks1', label: 'How It Works' },
  { value: 'centered-page-header', label: 'Centered Page Header' },
  {
    value: 'centered-page-components-container',
    label: 'Centered Components Container',
  },
  { value: 'center-width-text-block', label: 'Centered Text Block' },
  { value: 'space-above', label: 'Space Above' },
  { value: 'space-below', label: 'Space Below' },
  { value: 'payfast-button-center-width', label: 'PayFast Button' },
  { value: 'login-button-center-width', label: 'Login Button' },
  { value: 'checkbox-center', label: 'Centered Checkbox' },
  { value: 'cross-center', label: 'Centered Cross' },
];

export function ComponentEditor({
  component,
  onSave,
  onCancel,
  uploadToCloudinary,
}) {
  const [editedComponent, setEditedComponent] = useState();
  const [activeTab, setActiveTab] = useState('basic');
  const [isUploading, setIsUploading] = useState(false);

  // Deep clone the component to avoid reference issues
  useEffect(() => {
    setEditedComponent(JSON.parse(JSON.stringify(component)));
  }, [component]);

  const handleChange = (path, value) => {
    const newComponent = { ...editedComponent };
    let current = newComponent;

    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) {
        current[path[i]] = {};
      }
      current = current[path[i]];
    }

    current[path[path.length - 1]] = value;
    setEditedComponent(newComponent);
  };

  const handleSave = () => {
    onSave(editedComponent);
  };

  const handleImageUpload = async (file, path) => {
    try {
      setIsUploading(true);
      const url = await uploadToCloudinary(file);

      // Update the component with the new image URL
      const newComponent = { ...editedComponent };
      let current = newComponent;

      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) {
          current[path[i]] = {};
        }
        current = current[path[i]];
      }

      current[path[path.length - 1]] = url;
      setEditedComponent(newComponent);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Render fields based on component type
  const renderComponentFields = () => {
    switch (editedComponent?.type) {
      case 'hero':
        return (
          <>
            <div className='space-y-2'>
              <label>Header</label>
              <Input
                value={editedComponent.header || ''}
                onChange={(e) => handleChange(['header'], e.target.value)}
                placeholder='Hero Header'
              />
            </div>
            <div className='space-y-2'>
              <label>Text</label>
              <Textarea
                value={editedComponent.text || ''}
                onChange={(e) => handleChange(['text'], e.target.value)}
                placeholder='Hero Text'
                rows={4}
              />
            </div>
            <div className='space-y-4'>
              <label>Hero Image</label>
              {editedComponent.image && (
                <div className='flex items-center justify-center p-2 border rounded-md bg-muted/40 mb-2'>
                  <img
                    src={editedComponent.image || '/placeholder.svg'}
                    alt='Hero Preview'
                    className='max-h-40 object-contain'
                  />
                </div>
              )}
              <ImageUploader
                onUpload={(file) => handleImageUpload(file, ['image'])}
                buttonText='Upload Hero Image'
                buttonIcon={<ImageIcon className='h-4 w-4 mr-2' />}
                buttonClassName='bg-pink-500 hover:bg-pink-600 text-white'
              />
              <Input
                value={editedComponent.image || ''}
                onChange={(e) => handleChange(['image'], e.target.value)}
                placeholder='/images/hero.jpg'
                className='mt-2'
              />
            </div>
            <Card>
              <CardHeader>
                <CardTitle className='text-sm'>Call to Action</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <label>CTA Title</label>
                  <Input
                    value={editedComponent.cta?.title || ''}
                    onChange={(e) =>
                      handleChange(['cta', 'title'], e.target.value)
                    }
                    placeholder='Get Started'
                  />
                </div>
                <div className='space-y-2'>
                  <label>CTA Link</label>
                  <Input
                    value={editedComponent.cta?.link || ''}
                    onChange={(e) =>
                      handleChange(['cta', 'link'], e.target.value)
                    }
                    placeholder='/subscribe'
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className='text-sm'>Logo</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <label>Logo Image</label>
                  {editedComponent.logo?.src && (
                    <div className='flex items-center justify-center p-2 border rounded-md bg-muted/40 mb-2'>
                      <img
                        src={editedComponent.logo.src || '/placeholder.svg'}
                        alt='Logo Preview'
                        className='max-h-16 object-contain'
                      />
                    </div>
                  )}
                  <ImageUploader
                    onUpload={(file) =>
                      handleImageUpload(file, ['logo', 'src'])
                    }
                    buttonText='Upload Logo'
                    buttonIcon={<Upload className='h-4 w-4 mr-2' />}
                    buttonClassName='bg-pink-500 hover:bg-pink-600 text-white'
                  />
                  <Input
                    value={editedComponent.logo?.src || ''}
                    onChange={(e) =>
                      handleChange(['logo', 'src'], e.target.value)
                    }
                    placeholder='/logo.png'
                    className='mt-2'
                  />
                </div>
                <div className='space-y-2'>
                  <label>Logo Alt Text</label>
                  <Input
                    value={editedComponent.logo?.alt || ''}
                    onChange={(e) =>
                      handleChange(['logo', 'alt'], e.target.value)
                    }
                    placeholder='Logo'
                  />
                </div>
              </CardContent>
            </Card>
          </>
        );

      case 'article':
        return (
          <>
            <div className='space-y-4'>
              <label>Article Image</label>
              {editedComponent.image && (
                <div className='flex items-center justify-center p-2 border rounded-md bg-muted/40 mb-2'>
                  <img
                    src={editedComponent.image || '/placeholder.svg'}
                    alt='Article Preview'
                    className='max-h-40 object-contain'
                  />
                </div>
              )}
              <ImageUploader
                onUpload={(file) => handleImageUpload(file, ['image'])}
                buttonText='Upload Article Image'
                buttonIcon={<ImageIcon className='h-4 w-4 mr-2' />}
                buttonClassName='bg-pink-500 hover:bg-pink-600 text-white'
              />
              <Input
                value={editedComponent.image || ''}
                onChange={(e) => handleChange(['image'], e.target.value)}
                placeholder='/images/article.jpg'
                className='mt-2'
              />
            </div>
            <Card>
              <CardHeader>
                <CardTitle className='text-sm'>Elements</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {editedComponent.elements?.map((element, index) => (
                  <Card key={index} className='border-dashed'>
                    <CardHeader className='py-2'>
                      <div className='flex justify-between items-center'>
                        <CardTitle className='text-xs'>
                          Element {index + 1}: {element.type}
                        </CardTitle>
                        <Button
                          size='icon'
                          variant='ghost'
                          className='h-6 w-6 text-destructive'
                          onClick={() => {
                            const newElements = [...editedComponent.elements];
                            newElements.splice(index, 1);
                            handleChange(['elements'], newElements);
                          }}
                        >
                          <Trash2 className='h-3 w-3' />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className='py-2'>
                      {element.type === 'image-block' && (
                        <div className='space-y-4'>
                          <label>Image</label>
                          {element.image && (
                            <div className='flex items-center justify-center p-2 border rounded-md bg-muted/40 mb-2'>
                              <img
                                src={element.image || '/placeholder.svg'}
                                alt='Block Image Preview'
                                className='max-h-32 object-contain'
                              />
                            </div>
                          )}
                          <ImageUploader
                            onUpload={(file) => {
                              setIsUploading(true);
                              uploadToCloudinary(file)
                                .then((url) => {
                                  const newElements = [
                                    ...editedComponent.elements,
                                  ];
                                  newElements[index].image = url;
                                  handleChange(['elements'], newElements);
                                  setIsUploading(false);
                                })
                                .catch((error) => {
                                  console.error('Upload error:', error);
                                  setIsUploading(false);
                                });
                            }}
                            buttonText='Upload Image'
                            buttonIcon={<ImageIcon className='h-4 w-4 mr-2' />}
                            buttonClassName='bg-pink-500 hover:bg-pink-600 text-white'
                          />
                          <Input
                            value={element.image || ''}
                            onChange={(e) => {
                              const newElements = [...editedComponent.elements];
                              newElements[index].image = e.target.value;
                              handleChange(['elements'], newElements);
                            }}
                            placeholder='/images/block.jpg'
                            className='mt-2'
                          />
                        </div>
                      )}

                      {element.type === 'multi-text-blocks' && (
                        <>
                          <div className='space-y-4'>
                            {element.content?.map((content, contentIndex) => (
                              <div
                                key={contentIndex}
                                className='space-y-2 border-t pt-2 first:border-t-0 first:pt-0'
                              >
                                <div className='flex justify-between items-center'>
                                  <label>
                                    Content Block {contentIndex + 1}
                                  </label>
                                  <Button
                                    size='icon'
                                    variant='ghost'
                                    className='h-6 w-6 text-destructive'
                                    onClick={() => {
                                      const newContent = [...element.content];
                                      newContent.splice(contentIndex, 1);
                                      const newElements = [
                                        ...editedComponent.elements,
                                      ];
                                      newElements[index].content = newContent;
                                      handleChange(['elements'], newElements);
                                    }}
                                  >
                                    <Trash2 className='h-3 w-3' />
                                  </Button>
                                </div>
                                <div className='space-y-2'>
                                  <label>Title</label>
                                  <Input
                                    value={content.title || ''}
                                    onChange={(e) => {
                                      const newContent = [...element.content];
                                      newContent[contentIndex].title =
                                        e.target.value;
                                      const newElements = [
                                        ...editedComponent.elements,
                                      ];
                                      newElements[index].content = newContent;
                                      handleChange(['elements'], newElements);
                                    }}
                                    placeholder='Block Title'
                                  />
                                </div>
                                <div className='space-y-2'>
                                  <label>Text</label>
                                  <Textarea
                                    value={content.text || ''}
                                    onChange={(e) => {
                                      const newContent = [...element.content];
                                      newContent[contentIndex].text =
                                        e.target.value;
                                      const newElements = [
                                        ...editedComponent.elements,
                                      ];
                                      newElements[index].content = newContent;
                                      handleChange(['elements'], newElements);
                                    }}
                                    placeholder='Block Text'
                                    rows={3}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                          <Button
                            size='sm'
                            variant='outline'
                            className='mt-2 w-full border-pink-200 hover:bg-pink-50 text-pink-700'
                            onClick={() => {
                              const newContent = [...(element.content || [])];
                              newContent.push({ title: '', text: '' });
                              const newElements = [...editedComponent.elements];
                              newElements[index].content = newContent;
                              handleChange(['elements'], newElements);
                            }}
                          >
                            <Plus className='h-3 w-3 mr-1' /> Add Content Block
                          </Button>

                          {element.cta && (
                            <div className='mt-4 pt-4 border-t'>
                              <label>CTA Settings</label>
                              <div className='space-y-2 mt-2'>
                                <label>CTA Title</label>
                                <Input
                                  value={element.cta?.title || ''}
                                  onChange={(e) => {
                                    const newElements = [
                                      ...editedComponent.elements,
                                    ];
                                    if (!newElements[index].cta)
                                      newElements[index].cta = {};
                                    newElements[index].cta.title =
                                      e.target.value;
                                    handleChange(['elements'], newElements);
                                  }}
                                  placeholder='Subscribe'
                                />
                              </div>
                              <div className='space-y-2 mt-2'>
                                <label>CTA Link</label>
                                <Input
                                  value={element.cta?.link || ''}
                                  onChange={(e) => {
                                    const newElements = [
                                      ...editedComponent.elements,
                                    ];
                                    if (!newElements[index].cta)
                                      newElements[index].cta = {};
                                    newElements[index].cta.link =
                                      e.target.value;
                                    handleChange(['elements'], newElements);
                                  }}
                                  placeholder='/subscribe'
                                />
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </CardContent>
                  </Card>
                ))}
                <Button
                  size='sm'
                  variant='outline'
                  className='w-full border-pink-200 hover:bg-pink-50 text-pink-700'
                  onClick={() => {
                    const newElements = [...(editedComponent.elements || [])];
                    newElements.push({ type: 'image-block', image: '' });
                    handleChange(['elements'], newElements);
                  }}
                >
                  <Plus className='h-3 w-3 mr-1' /> Add Image Block
                </Button>
                <Button
                  size='sm'
                  variant='outline'
                  className='w-full border-pink-200 hover:bg-pink-50 text-pink-700'
                  onClick={() => {
                    const newElements = [...(editedComponent.elements || [])];
                    newElements.push({
                      type: 'multi-text-blocks',
                      content: [{ title: '', text: '' }],
                      cta: { title: 'Subscribe', link: '/subscribe' },
                    });
                    handleChange(['elements'], newElements);
                  }}
                >
                  <Plus className='h-3 w-3 mr-1' /> Add Text Blocks
                </Button>
              </CardContent>
            </Card>
          </>
        );

      case 'spa-block':
        return (
          <>
            <div className='space-y-2'>
              <label>Title</label>
              <Input
                value={editedComponent.title || ''}
                onChange={(e) => handleChange(['title'], e.target.value)}
                placeholder='Block Title'
              />
            </div>
            <div className='space-y-2'>
              <label>Background Color</label>
              <ColorPicker
                value={editedComponent.bg?.replace('bg-', '') || ''}
                onChange={(value) => handleChange(['bg'], `bg-${value}`)}
                options={colorOptions}
                showIntensity={true}
              />
            </div>
            <div className='space-y-2'>
              <label>Text Color</label>
              <Select
                value={editedComponent.fg?.replace('text-', '') || 'white'}
                onValueChange={(value) => handleChange(['fg'], `text-${value}`)}
              >
                <SelectTrigger className='border-pink-200'>
                  <SelectValue placeholder='Select text color' />
                </SelectTrigger>
                <SelectContent className='bg-white'>
                  <SelectItem value='white'>White</SelectItem>
                  <SelectItem value='black'>Black</SelectItem>
                  <SelectItem value='gray-200'>Light Gray</SelectItem>
                  <SelectItem value='gray-800'>Dark Gray</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className='text-sm'>Elements</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {editedComponent.elements?.map((element, index) => (
                  <Card key={index} className='border-dashed'>
                    <CardHeader className='py-2'>
                      <div className='flex justify-between items-center'>
                        <CardTitle className='text-xs'>
                          Element {index + 1}
                        </CardTitle>
                        <Button
                          size='icon'
                          variant='ghost'
                          className='h-6 w-6 text-destructive'
                          onClick={() => {
                            const newElements = [...editedComponent.elements];
                            newElements.splice(index, 1);
                            handleChange(['elements'], newElements);
                          }}
                        >
                          <Trash2 className='h-3 w-3' />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className='py-2 space-y-2'>
                      <div className='space-y-2'>
                        <label>Icon</label>
                        <Input
                          value={element.icon || ''}
                          onChange={(e) => {
                            const newElements = [...editedComponent.elements];
                            newElements[index].icon = e.target.value;
                            handleChange(['elements'], newElements);
                          }}
                          placeholder='food-truck'
                        />
                      </div>
                      <div className='space-y-2'>
                        <label>Title</label>
                        <Input
                          value={element.title || ''}
                          onChange={(e) => {
                            const newElements = [...editedComponent.elements];
                            newElements[index].title = e.target.value;
                            handleChange(['elements'], newElements);
                          }}
                          placeholder='Feature Title'
                        />
                      </div>
                      <div className='space-y-2'>
                        <label>Text</label>
                        <Textarea
                          value={element.text || ''}
                          onChange={(e) => {
                            const newElements = [...editedComponent.elements];
                            newElements[index].text = e.target.value;
                            handleChange(['elements'], newElements);
                          }}
                          placeholder='Feature Description'
                          rows={2}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button
                  size='sm'
                  variant='outline'
                  className='w-full border-pink-200 hover:bg-pink-50 text-pink-700'
                  onClick={() => {
                    const newElements = [...(editedComponent.elements || [])];
                    newElements.push({
                      icon: 'star',
                      title: 'New Feature',
                      text: 'Feature description',
                    });
                    handleChange(['elements'], newElements);
                  }}
                >
                  <Plus className='h-3 w-3 mr-1' /> Add Feature
                </Button>
              </CardContent>
            </Card>
          </>
        );

      case 'center-width-text-block':
        return (
          <>
            <div className='space-y-2'>
              <label>Title</label>
              <Input
                value={editedComponent.title || ''}
                onChange={(e) => handleChange(['title'], e.target.value)}
                placeholder='Block Title'
              />
            </div>
            <div className='space-y-2'>
              <label>Text</label>
              <Textarea
                value={editedComponent.text || ''}
                onChange={(e) => handleChange(['text'], e.target.value)}
                placeholder='Block Text'
                rows={4}
              />
            </div>
            <div className='space-y-2'>
              <label>Color</label>
              <Select
                value={editedComponent.color || ''}
                onValueChange={(value) => handleChange(['color'], value)}
              >
                <SelectTrigger className='border-pink-200'>
                  <SelectValue placeholder='Select text color' />
                </SelectTrigger>
                <SelectContent className='bg-white'>
                  <SelectItem value='default'>Default</SelectItem>
                  <SelectItem value='light'>Light</SelectItem>
                  <SelectItem value='dark'>Dark</SelectItem>
                </SelectContent>
              </Select>
              <p className='text-xs text-muted-foreground'>
                Optional: "light" for light text, "dark" for dark text
              </p>
            </div>
          </>
        );

      case 'space-above':
      case 'space-below':
        return (
          <div className='space-y-2'>
            <label>Size</label>
            <Input
              value={editedComponent.size || ''}
              onChange={(e) => handleChange(['size'], e.target.value)}
              placeholder='10'
            />
            <p className='text-xs text-muted-foreground'>
              Space size (e.g., 10)
            </p>
          </div>
        );

      case 'payfast-button-center-width':
        return (
          <>
            <div className='space-y-2'>
              <label>Title</label>
              <Input
                value={editedComponent.title || ''}
                onChange={(e) => handleChange(['title'], e.target.value)}
                placeholder='Make First Donation'
              />
            </div>
            <div className='space-y-2'>
              <label>URL</label>
              <Input
                value={editedComponent.url || ''}
                onChange={(e) => handleChange(['url'], e.target.value)}
                placeholder='https://sandbox.payfast.co.za/eng/process?cmd=_paynow&receiver=...'
              />
            </div>
          </>
        );

      case 'login-button-center-width':
        return (
          <div className='space-y-2'>
            <label>Title</label>
            <Input
              value={editedComponent.title || ''}
              onChange={(e) => handleChange(['title'], e.target.value)}
              placeholder='Login to Your Account'
            />
          </div>
        );

      case 'centered-page-header':
        return (
          <>
            <div className='space-y-2'>
              <label>Title</label>
              <Input
                value={editedComponent.title || ''}
                onChange={(e) => handleChange(['title'], e.target.value)}
                placeholder='Page Header Title'
              />
            </div>
            <div className='space-y-2'>
              <label>Description</label>
              <Textarea
                value={editedComponent.description || ''}
                onChange={(e) => handleChange(['description'], e.target.value)}
                placeholder='Page header description'
                rows={3}
              />
            </div>
          </>
        );

      case 'FlexwindHero3':
        return (
          <>
            <div className='space-y-2'>
              <label>Title</label>
              <Input
                value={editedComponent.title || ''}
                onChange={(e) => handleChange(['title'], e.target.value)}
                placeholder='Hero Title'
              />
            </div>
            <div className='space-y-2'>
              <label>Description</label>
              <Textarea
                value={editedComponent.description || ''}
                onChange={(e) => handleChange(['description'], e.target.value)}
                placeholder='Hero description'
                rows={3}
              />
            </div>
            <div className='space-y-2'>
              <label>Hint</label>
              <Input
                value={editedComponent.hint || ''}
                onChange={(e) => handleChange(['hint'], e.target.value)}
                placeholder='Subtitle hint'
              />
            </div>
            <Card>
              <CardHeader>
                <CardTitle className='text-sm'>Image</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-4'>
                  <label>Image</label>
                  {editedComponent.img?.src && (
                    <div className='flex items-center justify-center p-2 border rounded-md bg-muted/40 mb-2'>
                      <img
                        src={editedComponent.img.src || '/placeholder.svg'}
                        alt='Hero Image Preview'
                        className='max-h-32 object-contain'
                      />
                    </div>
                  )}
                  <ImageUploader
                    onUpload={(file) => handleImageUpload(file, ['img', 'src'])}
                    buttonText='Upload Image'
                    buttonIcon={<ImageIcon className='h-4 w-4 mr-2' />}
                    buttonClassName='bg-pink-500 hover:bg-pink-600 text-white'
                  />
                  <Input
                    value={editedComponent.img?.src || ''}
                    onChange={(e) =>
                      handleChange(['img', 'src'], e.target.value)
                    }
                    placeholder='/images/hero.jpg'
                    className='mt-2'
                  />
                </div>
                <div className='space-y-2'>
                  <label>Image Alt Text</label>
                  <Input
                    value={editedComponent.img?.alt || ''}
                    onChange={(e) =>
                      handleChange(['img', 'alt'], e.target.value)
                    }
                    placeholder='Hero Image'
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className='text-sm'>Call to Actions</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {editedComponent.ctas?.map((cta, index) => (
                  <Card key={index} className='border-dashed'>
                    <CardHeader className='py-2'>
                      <div className='flex justify-between items-center'>
                        <CardTitle className='text-xs'>
                          CTA {index + 1}
                        </CardTitle>
                        <Button
                          size='icon'
                          variant='ghost'
                          className='h-6 w-6 text-destructive'
                          onClick={() => {
                            const newCtas = [...editedComponent.ctas];
                            newCtas.splice(index, 1);
                            handleChange(['ctas'], newCtas);
                          }}
                        >
                          <Trash2 className='h-3 w-3' />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className='py-2 space-y-2'>
                      <div className='space-y-2'>
                        <label>Text</label>
                        <Input
                          value={cta.text || ''}
                          onChange={(e) => {
                            const newCtas = [...editedComponent.ctas];
                            newCtas[index].text = e.target.value;
                            handleChange(['ctas'], newCtas);
                          }}
                          placeholder='Join the Movement'
                        />
                      </div>
                      <div className='space-y-2'>
                        <label>Link</label>
                        <Input
                          value={cta.link || ''}
                          onChange={(e) => {
                            const newCtas = [...editedComponent.ctas];
                            newCtas[index].link = e.target.value;
                            handleChange(['ctas'], newCtas);
                          }}
                          placeholder='/register'
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button
                  size='sm'
                  variant='outline'
                  className='w-full border-pink-200 hover:bg-pink-50 text-pink-700'
                  onClick={() => {
                    const newCtas = [...(editedComponent.ctas || [])];
                    newCtas.push({ text: 'New CTA', link: '/' });
                    handleChange(['ctas'], newCtas);
                  }}
                >
                  <Plus className='h-3 w-3 mr-1' /> Add CTA
                </Button>
              </CardContent>
            </Card>
          </>
        );

      // Add more component type editors as needed

      default:
        return (
          <div className='p-4 bg-muted rounded-md'>
            <p className='text-sm text-muted-foreground'>
              This component type ({editedComponent?.type}) has a custom
              structure. You can edit the raw JSON in the Advanced tab.
            </p>
          </div>
        );
    }
  };

  return (
    <div className='space-y-4 py-4'>
      <div className='space-y-2'>
        <label>Component Type</label>
        <Select
          value={editedComponent?.type}
          onValueChange={(value) => handleChange(['type'], value)}
        >
          <SelectTrigger className='border-pink-200'>
            <SelectValue placeholder='Select component type' />
          </SelectTrigger>
          <SelectContent className='bg-white'>
            {componentTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className='grid w-full grid-cols-2 bg-pink-50'>
          <TabsTrigger
            value='basic'
            className='data-[state=active]:bg-white data-[state=active]:text-pink-700'
          >
            Basic Settings
          </TabsTrigger>
          <TabsTrigger
            value='advanced'
            className='data-[state=active]:bg-white data-[state=active]:text-pink-700'
          >
            Advanced JSON
          </TabsTrigger>
        </TabsList>
        <TabsContent value='basic' className='space-y-4 pt-4'>
          {renderComponentFields()}
        </TabsContent>
        <TabsContent value='advanced' className='space-y-4 pt-4'>
          <Textarea
            value={JSON.stringify(editedComponent, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                setEditedComponent(parsed);
              } catch (error) {
                // Don't update if JSON is invalid
                console.error('Invalid JSON:', error);
              }
            }}
            className='font-mono text-xs'
            rows={20}
          />
          <p className='text-xs text-muted-foreground'>
            Edit the raw JSON for this component. Be careful to maintain valid
            JSON format.
          </p>
        </TabsContent>
      </Tabs>

      <div className='flex justify-end gap-2 pt-4'>
        <Button
          variant='outline'
          onClick={onCancel}
          className='border-pink-200 hover:bg-pink-50 text-pink-700'
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          className='bg-pink-500 hover:bg-pink-600 text-white'
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}
