'use client';

import { useState } from 'react';
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

// Component type options with categories
const componentTypes = [
  // Content Blocks
  { value: 'article', label: 'Article', category: 'Content Blocks' },
  {
    value: 'center-width-text-block',
    label: 'Centered Text Block',
    category: 'Content Blocks',
  },

  // Hero Sections
  { value: 'hero', label: 'Hero Section', category: 'Hero Sections' },
  {
    value: 'FlexwindHero1',
    label: 'Flexwind Hero 1',
    category: 'Hero Sections',
  },
  {
    value: 'FlexwindHero2',
    label: 'Flexwind Hero 2',
    category: 'Hero Sections',
  },
  {
    value: 'FlexwindHero3',
    label: 'Flexwind Hero 3',
    category: 'Hero Sections',
  },
  {
    value: 'FlexwindHero4',
    label: 'Flexwind Hero 4',
    category: 'Hero Sections',
  },
  {
    value: 'FlexwindHero5',
    label: 'Flexwind Hero 5',
    category: 'Hero Sections',
  },
  {
    value: 'FlexwindHero6',
    label: 'Flexwind Hero 6',
    category: 'Hero Sections',
  },
  {
    value: 'FlexwindHero7',
    label: 'Flexwind Hero 7',
    category: 'Hero Sections',
  },

  // Feature Blocks
  { value: 'spa-block', label: 'Features Block', category: 'Feature Blocks' },
  {
    value: 'FlexwindFeatures1',
    label: 'Flexwind Features',
    category: 'Feature Blocks',
  },

  // Cards
  { value: 'card', label: 'Card', category: 'Cards' },

  // Interactive Elements
  { value: 'accordion', label: 'Accordion', category: 'Interactive Elements' },

  // Notifications
  { value: 'alert-banner', label: 'Alert Banner', category: 'Notifications' },

  // Layout Components
  {
    value: 'centered-page-header',
    label: 'Centered Page Header',
    category: 'Layout Components',
  },
  {
    value: 'centered-page-components-container',
    label: 'Centered Components Container',
    category: 'Layout Components',
  },
  { value: 'space-above', label: 'Space Above', category: 'Layout Components' },
  { value: 'space-below', label: 'Space Below', category: 'Layout Components' },

  // Action Components
  {
    value: 'payfast-button-center-width',
    label: 'PayFast Button',
    category: 'Action Components',
  },
  {
    value: 'login-button-center-width',
    label: 'Login Button',
    category: 'Action Components',
  },
  {
    value: 'checkbox-center',
    label: 'Centered Checkbox',
    category: 'Action Components',
  },
  {
    value: 'cross-center',
    label: 'Centered Cross',
    category: 'Action Components',
  },

  // How It Works
  {
    value: 'PageDoneHowItWorks1',
    label: 'How It Works',
    category: 'How It Works',
  },
  // CTA Sections
  {
    value: 'cta-section',
    label: 'CTA Section',
    category: 'CTA Sections',
  },

  // Content Sections
  {
    value: 'content-section',
    label: 'Content Section',
    category: 'Content Sections',
  },

  // Social Proof
  {
    value: 'social-proof-section',
    label: 'Social Proof Section',
    category: 'Social Proof',
  },

  // FAQ Sections
  {
    value: 'faq-section',
    label: 'FAQ Section',
    category: 'FAQ Sections',
  },

  // Team Sections
  {
    value: 'team-section',
    label: 'Team Section',
    category: 'Team Sections',
  },
  {
    value: 'team-member',
    label: 'Team Member',
    category: 'Team Sections',
  },

  // Logo Grid
  {
    value: 'logo-grid',
    label: 'Logo Grid',
    category: 'Partner Sections',
  },

  // Stats Sections
  {
    value: 'stats-section',
    label: 'Stats Section',
    category: 'Stats Sections',
  },
  {
    value: 'statistics-grid',
    label: 'Statistics Grid',
    category: 'Stats Sections',
  },
];

// Event handler options
const eventHandlerOptions = [
  {
    value: 'save-new-newsletter-subscriber',
    label: 'Save Newsletter Subscriber',
  },
  { value: 'save-to-component-state', label: 'Save to Component State' },
  { value: 'do-nothing', label: 'Do Nothing' },
];

// Success/failure handler options
const actionHandlerOptions = [
  { value: 'do-nothing', label: 'Do Nothing' },
  {
    value: 'notify-you-will-hear-from-us',
    label: 'Notify: You will hear from us',
  },
  {
    value: 'notify-something-went-wrong',
    label: 'Notify: Something went wrong',
  },
];

// Function to render data attribute editor
const renderDataAttributeEditor = (data, onChange) => {
  if (!data) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-sm'>Event Handlers</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {Object.keys(data).map((key) => (
          <div
            key={key}
            className='space-y-4 border-t pt-4 first:border-t-0 first:pt-0'
          >
            <label>Field: {key}</label>

            {data[key]['on-change'] && (
              <div className='space-y-2'>
                <label>On Change Handler</label>
                <Select
                  value={data[key]['on-change']['handle-with']}
                  onValueChange={(value) => {
                    const newData = { ...data };
                    newData[key]['on-change']['handle-with'] = value;
                    onChange(newData);
                  }}
                >
                  <SelectTrigger className='border-pink-200'>
                    <SelectValue placeholder='Select handler' />
                  </SelectTrigger>
                  <SelectContent className='bg-white'>
                    {eventHandlerOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className='space-y-2 mt-2'>
                  <label>On Success</label>
                  <Select
                    value={
                      data[key]['on-change'][
                        'when-handler-succeeds-run'
                      ]?.[0] || 'do-nothing'
                    }
                    onValueChange={(value) => {
                      const newData = { ...data };
                      newData[key]['on-change']['when-handler-succeeds-run'] = [
                        value,
                      ];
                      onChange(newData);
                    }}
                  >
                    <SelectTrigger className='border-pink-200'>
                      <SelectValue placeholder='Select action' />
                    </SelectTrigger>
                    <SelectContent className='bg-white'>
                      {actionHandlerOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2 mt-2'>
                  <label>On Failure</label>
                  <Select
                    value={
                      data[key]['on-change']['when-handler-fails-run']?.[0] ||
                      'notify-something-went-wrong'
                    }
                    onValueChange={(value) => {
                      const newData = { ...data };
                      newData[key]['on-change']['when-handler-fails-run'] = [
                        value,
                      ];
                      onChange(newData);
                    }}
                  >
                    <SelectTrigger className='border-pink-200'>
                      <SelectValue placeholder='Select action' />
                    </SelectTrigger>
                    <SelectContent className='bg-white'>
                      {actionHandlerOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

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
      case 'card':
        return (
          <>
            <div className='space-y-2'>
              <label>Title</label>
              <Input
                value={editedComponent.title || ''}
                onChange={(e) => handleChange(['title'], e.target.value)}
                placeholder='Card Title'
              />
            </div>
            <div className='space-y-2'>
              <label>Description</label>
              <Textarea
                value={editedComponent.description || ''}
                onChange={(e) => handleChange(['description'], e.target.value)}
                placeholder='Card description'
                rows={3}
              />
            </div>
            <div className='space-y-4'>
              <label>Card Image</label>
              {editedComponent.image && (
                <div className='flex items-center justify-center p-2 border rounded-md bg-muted/40 mb-2'>
                  <img
                    src={editedComponent.image || '/placeholder.svg'}
                    alt='Card Preview'
                    className='max-h-40 object-contain'
                  />
                </div>
              )}
              <ImageUploader
                onUpload={(file) => handleImageUpload(file, ['image'])}
                buttonText='Upload Card Image'
                buttonIcon={<ImageIcon className='h-4 w-4 mr-2' />}
                buttonClassName='bg-pink-500 hover:bg-pink-600 text-white'
              />
              <Input
                value={editedComponent.image || ''}
                onChange={(e) => handleChange(['image'], e.target.value)}
                placeholder='/images/card.jpg'
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
                    placeholder='Get Involved'
                  />
                </div>
                <div className='space-y-2'>
                  <label>CTA Link</label>
                  <Input
                    value={editedComponent.cta?.link || ''}
                    onChange={(e) =>
                      handleChange(['cta', 'link'], e.target.value)
                    }
                    placeholder='/get-involved'
                  />
                </div>
              </CardContent>
            </Card>
          </>
        );

      case 'accordion':
        return (
          <Card>
            <CardHeader>
              <CardTitle className='text-sm'>Accordion Items</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {editedComponent.items?.map((item, index) => (
                <Card key={index} className='border-dashed'>
                  <CardHeader className='py-2'>
                    <div className='flex justify-between items-center'>
                      <CardTitle className='text-xs'>
                        Item {index + 1}
                      </CardTitle>
                      <Button
                        size='icon'
                        variant='ghost'
                        className='h-6 w-6 text-destructive'
                        onClick={() => {
                          const newItems = [...editedComponent.items];
                          newItems.splice(index, 1);
                          handleChange(['items'], newItems);
                        }}
                      >
                        <Trash2 className='h-3 w-3' />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className='py-2 space-y-2'>
                    <div className='space-y-2'>
                      <label>Title</label>
                      <Input
                        value={item.title || ''}
                        onChange={(e) => {
                          const newItems = [...editedComponent.items];
                          newItems[index].title = e.target.value;
                          handleChange(['items'], newItems);
                        }}
                        placeholder='Accordion Item Title'
                      />
                    </div>
                    <div className='space-y-2'>
                      <label>Content</label>
                      <Textarea
                        value={item.content || ''}
                        onChange={(e) => {
                          const newItems = [...editedComponent.items];
                          newItems[index].content = e.target.value;
                          handleChange(['items'], newItems);
                        }}
                        placeholder='Accordion Item Content'
                        rows={3}
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
                  const newItems = [...(editedComponent.items || [])];
                  newItems.push({
                    title: 'New Item',
                    content: 'Content for the new item goes here.',
                  });
                  handleChange(['items'], newItems);
                }}
              >
                <Plus className='h-3 w-3 mr-1' /> Add Accordion Item
              </Button>
            </CardContent>
          </Card>
        );

      case 'alert-banner':
        return (
          <>
            <div className='space-y-2'>
              <label>Message</label>
              <Input
                value={editedComponent.message || ''}
                onChange={(e) => handleChange(['message'], e.target.value)}
                placeholder='Alert message'
              />
            </div>
            <div className='space-y-2'>
              <label>Alert Type</label>
              <Select
                value={editedComponent.alertType || 'info'}
                onChange={(value) => handleChange(['alertType'], value)}
              >
                <SelectTrigger className='border-pink-200'>
                  <SelectValue placeholder='Select alert type' />
                </SelectTrigger>
                <SelectContent className='bg-white'>
                  <SelectItem value='info'>Info</SelectItem>
                  <SelectItem value='warning'>Warning</SelectItem>
                  <SelectItem value='error'>Error</SelectItem>
                  <SelectItem value='success'>Success</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );

      case 'FlexwindHero1':
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
            <Card>
              <CardHeader>
                <CardTitle className='text-sm'>Stats</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {editedComponent.stats?.map((stat, index) => (
                  <Card key={index} className='border-dashed'>
                    <CardHeader className='py-2'>
                      <div className='flex justify-between items-center'>
                        <CardTitle className='text-xs'>
                          Stat {index + 1}
                        </CardTitle>
                        <Button
                          size='icon'
                          variant='ghost'
                          className='h-6 w-6 text-destructive'
                          onClick={() => {
                            const newStats = [...editedComponent.stats];
                            newStats.splice(index, 1);
                            handleChange(['stats'], newStats);
                          }}
                        >
                          <Trash2 className='h-3 w-3' />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className='py-2 space-y-2'>
                      <div className='space-y-2'>
                        <label>Title</label>
                        <Input
                          value={stat.title || ''}
                          onChange={(e) => {
                            const newStats = [...editedComponent.stats];
                            newStats[index].title = e.target.value;
                            handleChange(['stats'], newStats);
                          }}
                          placeholder='Stat Title'
                        />
                      </div>
                      <div className='space-y-2'>
                        <label>Detail</label>
                        <Input
                          value={stat.detail || ''}
                          onChange={(e) => {
                            const newStats = [...editedComponent.stats];
                            newStats[index].detail = e.target.value;
                            handleChange(['stats'], newStats);
                          }}
                          placeholder='10,000+'
                        />
                      </div>
                      <div className='space-y-2'>
                        <label>Icon</label>
                        <Input
                          value={stat.icon || ''}
                          onChange={(e) => {
                            const newStats = [...editedComponent.stats];
                            newStats[index].icon = e.target.value;
                            handleChange(['stats'], newStats);
                          }}
                          placeholder='Icon name (e.g., heart)'
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
                    const newStats = [...(editedComponent.stats || [])];
                    newStats.push({
                      title: 'New Stat',
                      detail: '0+',
                      icon: 'star',
                    });
                    handleChange(['stats'], newStats);
                  }}
                >
                  <Plus className='h-3 w-3 mr-1' /> Add Stat
                </Button>
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
                          placeholder='Get Started'
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
                          placeholder='/signup'
                        />
                      </div>
                      <div className='space-y-2'>
                        <label>Style</label>
                        <Select
                          value={cta.style || ''}
                          onValueChange={(value) => {
                            const newCtas = [...editedComponent.ctas];
                            newCtas[index].style = value;
                            handleChange(['ctas'], newCtas);
                          }}
                        >
                          <SelectTrigger className='border-pink-200'>
                            <SelectValue placeholder='Select style' />
                          </SelectTrigger>
                          <SelectContent className='bg-white'>
                            <SelectItem value='default'>Default</SelectItem>
                            <SelectItem value='light'>Light</SelectItem>
                          </SelectContent>
                        </Select>
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
                    newCtas.push({
                      text: 'New CTA',
                      link: '/',
                      style: '',
                    });
                    handleChange(['ctas'], newCtas);
                  }}
                >
                  <Plus className='h-3 w-3 mr-1' /> Add CTA
                </Button>
              </CardContent>
            </Card>
            <div className='space-y-4'>
              <label>Hero Image</label>
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
                onChange={(e) => handleChange(['img', 'src'], e.target.value)}
                placeholder='/images/hero.jpg'
                className='mt-2'
              />
              <label>Image Alt Text</label>
              <Input
                value={editedComponent.img?.alt || ''}
                onChange={(e) => handleChange(['img', 'alt'], e.target.value)}
                placeholder='Hero Image'
              />
            </div>
            <Card>
              <CardHeader>
                <CardTitle className='text-sm'>Ratings</CardTitle>
              </CardHeader>
              <CardContent className='space-y-2'>
                <div className='space-y-2'>
                  <label>Title</label>
                  <Input
                    value={editedComponent.ratings?.titel || ''}
                    onChange={(e) =>
                      handleChange(['ratings', 'titel'], e.target.value)
                    }
                    placeholder='Ratings'
                  />
                </div>
                <div className='space-y-2'>
                  <label>Count</label>
                  <Input
                    type='number'
                    value={editedComponent.ratings?.count || ''}
                    onChange={(e) =>
                      handleChange(
                        ['ratings', 'count'],
                        Number.parseInt(e.target.value) || 0
                      )
                    }
                    placeholder='20'
                  />
                </div>
                <div className='space-y-2'>
                  <label>Type</label>
                  <Input
                    value={editedComponent.ratings?.type || ''}
                    onChange={(e) =>
                      handleChange(['ratings', 'type'], e.target.value)
                    }
                    placeholder='views'
                  />
                </div>
                <div className='space-y-2'>
                  <label>Rating</label>
                  <Input
                    type='number'
                    value={editedComponent.ratings?.rating || ''}
                    onChange={(e) =>
                      handleChange(
                        ['ratings', 'rating'],
                        Number.parseFloat(e.target.value) || 0
                      )
                    }
                    placeholder='4.5'
                  />
                </div>
              </CardContent>
            </Card>
          </>
        );

      case 'FlexwindHero2':
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
                          placeholder='Get Started'
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
                          placeholder='/signup'
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
                    newCtas.push({
                      text: 'New CTA',
                      link: '/',
                    });
                    handleChange(['ctas'], newCtas);
                  }}
                >
                  <Plus className='h-3 w-3 mr-1' /> Add CTA
                </Button>
              </CardContent>
            </Card>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-4'>
                <label>Image 1</label>
                {editedComponent.img1?.src && (
                  <div className='flex items-center justify-center p-2 border rounded-md bg-muted/40 mb-2'>
                    <img
                      src={editedComponent.img1.src || '/placeholder.svg'}
                      alt='Hero Image 1 Preview'
                      className='max-h-32 object-contain'
                    />
                  </div>
                )}
                <ImageUploader
                  onUpload={(file) => handleImageUpload(file, ['img1', 'src'])}
                  buttonText='Upload Image 1'
                  buttonIcon={<ImageIcon className='h-4 w-4 mr-2' />}
                  buttonClassName='bg-pink-500 hover:bg-pink-600 text-white'
                />
                <Input
                  value={editedComponent.img1?.src || ''}
                  onChange={(e) =>
                    handleChange(['img1', 'src'], e.target.value)
                  }
                  placeholder='/images/hero1.jpg'
                  className='mt-2'
                />
                <label>Image 1 Alt Text</label>
                <Input
                  value={editedComponent.img1?.alt || ''}
                  onChange={(e) =>
                    handleChange(['img1', 'alt'], e.target.value)
                  }
                  placeholder='Hero Image 1'
                />
              </div>
              <div className='space-y-4'>
                <label>Image 2</label>
                {editedComponent.img2?.src && (
                  <div className='flex items-center justify-center p-2 border rounded-md bg-muted/40 mb-2'>
                    <img
                      src={editedComponent.img2.src || '/placeholder.svg'}
                      alt='Hero Image 2 Preview'
                      className='max-h-32 object-contain'
                    />
                  </div>
                )}
                <ImageUploader
                  onUpload={(file) => handleImageUpload(file, ['img2', 'src'])}
                  buttonText='Upload Image 2'
                  buttonIcon={<ImageIcon className='h-4 w-4 mr-2' />}
                  buttonClassName='bg-pink-500 hover:bg-pink-600 text-white'
                />
                <Input
                  value={editedComponent.img2?.src || ''}
                  onChange={(e) =>
                    handleChange(['img2', 'src'], e.target.value)
                  }
                  placeholder='/images/hero2.jpg'
                  className='mt-2'
                />
                <label>Image 2 Alt Text</label>
                <Input
                  value={editedComponent.img2?.alt || ''}
                  onChange={(e) =>
                    handleChange(['img2', 'alt'], e.target.value)
                  }
                  placeholder='Hero Image 2'
                />
              </div>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className='text-sm'>Partners</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {editedComponent.partners?.map((partner, index) => (
                  <Card key={index} className='border-dashed'>
                    <CardHeader className='py-2'>
                      <div className='flex justify-between items-center'>
                        <CardTitle className='text-xs'>
                          Partner {index + 1}
                        </CardTitle>
                        <Button
                          size='icon'
                          variant='ghost'
                          className='h-6 w-6 text-destructive'
                          onClick={() => {
                            const newPartners = [...editedComponent.partners];
                            newPartners.splice(index, 1);
                            handleChange(['partners'], newPartners);
                          }}
                        >
                          <Trash2 className='h-3 w-3' />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className='py-2 space-y-2'>
                      <div className='space-y-2'>
                        <label>Name</label>
                        <Input
                          value={partner.name || ''}
                          onChange={(e) => {
                            const newPartners = [...editedComponent.partners];
                            newPartners[index].name = e.target.value;
                            handleChange(['partners'], newPartners);
                          }}
                          placeholder='Partner Name'
                        />
                      </div>
                      <div className='space-y-2'>
                        <label>Link</label>
                        <Input
                          value={partner.link || ''}
                          onChange={(e) => {
                            const newPartners = [...editedComponent.partners];
                            newPartners[index].link = e.target.value;
                            handleChange(['partners'], newPartners);
                          }}
                          placeholder='https://example.com'
                        />
                      </div>
                      <div className='space-y-4'>
                        <label>Partner Logo</label>
                        {partner.img && (
                          <div className='flex items-center justify-center p-2 border rounded-md bg-muted/40 mb-2'>
                            <img
                              src={partner.img || '/placeholder.svg'}
                              alt='Partner Logo Preview'
                              className='max-h-16 object-contain'
                            />
                          </div>
                        )}
                        <ImageUploader
                          onUpload={(file) => {
                            setIsUploading(true);
                            uploadToCloudinary(file)
                              .then((url) => {
                                const newPartners = [
                                  ...editedComponent.partners,
                                ];
                                newPartners[index].img = url;
                                handleChange(['partners'], newPartners);
                                setIsUploading(false);
                              })
                              .catch((error) => {
                                console.error('Upload error:', error);
                                setIsUploading(false);
                              });
                          }}
                          buttonText='Upload Logo'
                          buttonIcon={<ImageIcon className='h-4 w-4 mr-2' />}
                          buttonClassName='bg-pink-500 hover:bg-pink-600 text-white'
                        />
                        <Input
                          value={partner.img || ''}
                          onChange={(e) => {
                            const newPartners = [...editedComponent.partners];
                            newPartners[index].img = e.target.value;
                            handleChange(['partners'], newPartners);
                          }}
                          placeholder='/images/partner-logo.jpg'
                          className='mt-2'
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
                    const newPartners = [...(editedComponent.partners || [])];
                    newPartners.push({
                      name: 'New Partner',
                      link: 'https://example.com',
                      img: '',
                    });
                    handleChange(['partners'], newPartners);
                  }}
                >
                  <Plus className='h-3 w-3 mr-1' /> Add Partner
                </Button>
              </CardContent>
            </Card>
          </>
        );

      case 'FlexwindHero4':
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
            <div className='space-y-4'>
              <label>Hero Image</label>
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
                onChange={(e) => handleChange(['img', 'src'], e.target.value)}
                placeholder='/images/hero.jpg'
                className='mt-2'
              />
              <label>Image Alt Text</label>
              <Input
                value={editedComponent.img?.alt || ''}
                onChange={(e) => handleChange(['img', 'alt'], e.target.value)}
                placeholder='Hero Image'
              />
            </div>
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
                          placeholder='Join Us Now!'
                        />
                      </div>
                      <div className='space-y-2'>
                        <label>On Click Handler</label>
                        <Select
                          value={
                            cta['on-click']?.['handle-with'] || 'do-nothing'
                          }
                          onValueChange={(value) => {
                            const newCtas = [...editedComponent.ctas];
                            if (!newCtas[index]['on-click'])
                              newCtas[index]['on-click'] = {};
                            newCtas[index]['on-click']['handle-with'] = value;
                            handleChange(['ctas'], newCtas);
                          }}
                        >
                          <SelectTrigger className='border-pink-200'>
                            <SelectValue placeholder='Select handler' />
                          </SelectTrigger>
                          <SelectContent className='bg-white'>
                            {eventHandlerOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className='space-y-2'>
                        <label>On Success</label>
                        <Select
                          value={
                            cta['on-click']?.[
                              'when-handler-succeeds-run'
                            ]?.[0] || 'notify-you-will-hear-from-us'
                          }
                          onValueChange={(value) => {
                            const newCtas = [...editedComponent.ctas];
                            if (!newCtas[index]['on-click'])
                              newCtas[index]['on-click'] = {};
                            newCtas[index]['on-click'][
                              'when-handler-succeeds-run'
                            ] = [value];
                            handleChange(['ctas'], newCtas);
                          }}
                        >
                          <SelectTrigger className='border-pink-200'>
                            <SelectValue placeholder='Select action' />
                          </SelectTrigger>
                          <SelectContent className='bg-white'>
                            {actionHandlerOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className='space-y-2'>
                        <label>On Failure</label>
                        <Select
                          value={
                            cta['on-click']?.['when-handler-fails-run']?.[0] ||
                            'notify-something-went-wrong'
                          }
                          onValueChange={(value) => {
                            const newCtas = [...editedComponent.ctas];
                            if (!newCtas[index]['on-click'])
                              newCtas[index]['on-click'] = {};
                            newCtas[index]['on-click'][
                              'when-handler-fails-run'
                            ] = [value];
                            handleChange(['ctas'], newCtas);
                          }}
                        >
                          <SelectTrigger className='border-pink-200'>
                            <SelectValue placeholder='Select action' />
                          </SelectTrigger>
                          <SelectContent className='bg-white'>
                            {actionHandlerOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                    newCtas.push({
                      text: 'Join Us Now!',
                      'on-click': {
                        'handle-with': 'do-nothing',
                        'when-handler-succeeds-run': [
                          'notify-you-will-hear-from-us',
                        ],
                        'when-handler-fails-run': [
                          'notify-something-went-wrong',
                        ],
                      },
                    });
                    handleChange(['ctas'], newCtas);
                  }}
                >
                  <Plus className='h-3 w-3 mr-1' /> Add CTA
                </Button>
              </CardContent>
            </Card>
            {editedComponent.data &&
              renderDataAttributeEditor(editedComponent.data, (newData) =>
                handleChange(['data'], newData)
              )}
          </>
        );

      case 'FlexwindHero5':
      case 'FlexwindHero6':
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
            <Card>
              <CardHeader>
                <CardTitle className='text-sm'>Stats</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {editedComponent.stats?.map((stat, index) => (
                  <Card key={index} className='border-dashed'>
                    <CardHeader className='py-2'>
                      <div className='flex justify-between items-center'>
                        <CardTitle className='text-xs'>
                          Stat {index + 1}
                        </CardTitle>
                        <Button
                          size='icon'
                          variant='ghost'
                          className='h-6 w-6 text-destructive'
                          onClick={() => {
                            const newStats = [...editedComponent.stats];
                            newStats.splice(index, 1);
                            handleChange(['stats'], newStats);
                          }}
                        >
                          <Trash2 className='h-3 w-3' />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className='py-2 space-y-2'>
                      <div className='space-y-2'>
                        <label>Title</label>
                        <Input
                          value={stat.title || ''}
                          onChange={(e) => {
                            const newStats = [...editedComponent.stats];
                            newStats[index].title = e.target.value;
                            handleChange(['stats'], newStats);
                          }}
                          placeholder='Stat Title'
                        />
                      </div>
                      <div className='space-y-2'>
                        <label>Detail</label>
                        <Input
                          value={stat.detail || ''}
                          onChange={(e) => {
                            const newStats = [...editedComponent.stats];
                            newStats[index].detail = e.target.value;
                            handleChange(['stats'], newStats);
                          }}
                          placeholder='10,000+'
                        />
                      </div>
                      <div className='space-y-2'>
                        <label>Icon</label>
                        <Input
                          value={stat.icon || ''}
                          onChange={(e) => {
                            const newStats = [...editedComponent.stats];
                            newStats[index].icon = e.target.value;
                            handleChange(['stats'], newStats);
                          }}
                          placeholder='Icon name (e.g., heart)'
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
                    const newStats = [...(editedComponent.stats || [])];
                    newStats.push({
                      title: 'New Stat',
                      detail: '0+',
                      icon: 'star',
                    });
                    handleChange(['stats'], newStats);
                  }}
                >
                  <Plus className='h-3 w-3 mr-1' /> Add Stat
                </Button>
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
                          placeholder='Get Started'
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
                          placeholder='/signup'
                        />
                      </div>
                      <div className='space-y-2'>
                        <label>Style</label>
                        <Select
                          value={cta.style || ''}
                          onValueChange={(value) => {
                            const newCtas = [...editedComponent.ctas];
                            newCtas[index].style = value;
                            handleChange(['ctas'], newCtas);
                          }}
                        >
                          <SelectTrigger className='border-pink-200'>
                            <SelectValue placeholder='Select style' />
                          </SelectTrigger>
                          <SelectContent className='bg-white'>
                            <SelectItem value='default'>Default</SelectItem>
                            <SelectItem value='light'>Light</SelectItem>
                          </SelectContent>
                        </Select>
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
                    newCtas.push({
                      text: 'New CTA',
                      link: '/',
                      style: 'default',
                    });
                    handleChange(['ctas'], newCtas);
                  }}
                >
                  <Plus className='h-3 w-3 mr-1' /> Add CTA
                </Button>
              </CardContent>
            </Card>
            <div className='space-y-4'>
              <label>Hero Image</label>
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
                onChange={(e) => handleChange(['img', 'src'], e.target.value)}
                placeholder='/images/hero.jpg'
                className='mt-2'
              />
              <label>Image Alt Text</label>
              <Input
                value={editedComponent.img?.alt || ''}
                onChange={(e) => handleChange(['img', 'alt'], e.target.value)}
                placeholder='Hero Image'
              />
            </div>
          </>
        );

      case 'FlexwindHero7':
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
                          placeholder='Get Started'
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
                          placeholder='/signup'
                        />
                      </div>
                      <div className='space-y-2'>
                        <label>Icon</label>
                        <Input
                          value={cta.icon || ''}
                          onChange={(e) => {
                            const newCtas = [...editedComponent.ctas];
                            newCtas[index].icon = e.target.value;
                            handleChange(['ctas'], newCtas);
                          }}
                          placeholder='Icon name (e.g., home)'
                        />
                      </div>
                      <div className='space-y-2'>
                        <label>Style</label>
                        <Select
                          value={cta.style || ''}
                          onValueChange={(value) => {
                            const newCtas = [...editedComponent.ctas];
                            newCtas[index].style = value;
                            handleChange(['ctas'], newCtas);
                          }}
                        >
                          <SelectTrigger className='border-pink-200'>
                            <SelectValue placeholder='Select style' />
                          </SelectTrigger>
                          <SelectContent className='bg-white'>
                            <SelectItem value='default'>Default</SelectItem>
                            <SelectItem value='light'>Light</SelectItem>
                          </SelectContent>
                        </Select>
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
                    newCtas.push({
                      text: 'New CTA',
                      link: '/',
                      icon: 'home',
                      style: 'default',
                    });
                    handleChange(['ctas'], newCtas);
                  }}
                >
                  <Plus className='h-3 w-3 mr-1' /> Add CTA
                </Button>
              </CardContent>
            </Card>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-4'>
                <label>Image 1</label>
                {editedComponent.img1?.src && (
                  <div className='flex items-center justify-center p-2 border rounded-md bg-muted/40 mb-2'>
                    <img
                      src={editedComponent.img1.src || '/placeholder.svg'}
                      alt='Hero Image 1 Preview'
                      className='max-h-32 object-contain'
                    />
                  </div>
                )}
                <ImageUploader
                  onUpload={(file) => handleImageUpload(file, ['img1', 'src'])}
                  buttonText='Upload Image 1'
                  buttonIcon={<ImageIcon className='h-4 w-4 mr-2' />}
                  buttonClassName='bg-pink-500 hover:bg-pink-600 text-white'
                />
                <Input
                  value={editedComponent.img1?.src || ''}
                  onChange={(e) =>
                    handleChange(['img1', 'src'], e.target.value)
                  }
                  placeholder='/images/hero1.jpg'
                  className='mt-2'
                />
                <label>Image 1 Alt Text</label>
                <Input
                  value={editedComponent.img1?.alt || ''}
                  onChange={(e) =>
                    handleChange(['img1', 'alt'], e.target.value)
                  }
                  placeholder='Hero Image 1'
                />
              </div>
              <div className='space-y-4'>
                <label>Image 2</label>
                {editedComponent.img2?.src && (
                  <div className='flex items-center justify-center p-2 border rounded-md bg-muted/40 mb-2'>
                    <img
                      src={editedComponent.img2.src || '/placeholder.svg'}
                      alt='Hero Image 2 Preview'
                      className='max-h-32 object-contain'
                    />
                  </div>
                )}
                <ImageUploader
                  onUpload={(file) => handleImageUpload(file, ['img2', 'src'])}
                  buttonText='Upload Image 2'
                  buttonIcon={<ImageIcon className='h-4 w-4 mr-2' />}
                  buttonClassName='bg-pink-500 hover:bg-pink-600 text-white'
                />
                <Input
                  value={editedComponent.img2?.src || ''}
                  onChange={(e) =>
                    handleChange(['img2', 'src'], e.target.value)
                  }
                  placeholder='/images/hero2.jpg'
                  className='mt-2'
                />
                <label>Image 2 Alt Text</label>
                <Input
                  value={editedComponent.img2?.alt || ''}
                  onChange={(e) =>
                    handleChange(['img2', 'alt'], e.target.value)
                  }
                  placeholder='Hero Image 2'
                />
              </div>
            </div>
          </>
        );

      case 'FlexwindFeatures1':
        return (
          <>
            <div className='space-y-2'>
              <label>Title</label>
              <Input
                value={editedComponent.title || ''}
                onChange={(e) => handleChange(['title'], e.target.value)}
                placeholder='Features Title'
              />
            </div>
            <div className='space-y-2'>
              <label>Description</label>
              <Textarea
                value={editedComponent.description || ''}
                onChange={(e) => handleChange(['description'], e.target.value)}
                placeholder='Features description'
                rows={3}
              />
            </div>
            <Card>
              <CardHeader>
                <CardTitle className='text-sm'>Features</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {editedComponent.features?.map((feature, index) => (
                  <Card key={index} className='border-dashed'>
                    <CardHeader className='py-2'>
                      <div className='flex justify-between items-center'>
                        <CardTitle className='text-xs'>
                          Feature {index + 1}
                        </CardTitle>
                        <Button
                          size='icon'
                          variant='ghost'
                          className='h-6 w-6 text-destructive'
                          onClick={() => {
                            const newFeatures = [...editedComponent.features];
                            newFeatures.splice(index, 1);
                            handleChange(['features'], newFeatures);
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
                          value={feature.icon || ''}
                          onChange={(e) => {
                            const newFeatures = [...editedComponent.features];
                            newFeatures[index].icon = e.target.value;
                            handleChange(['features'], newFeatures);
                          }}
                          placeholder='Icon name (e.g., dollar-sign)'
                        />
                      </div>
                      <div className='space-y-2'>
                        <label>Title</label>
                        <Input
                          value={feature.title || ''}
                          onChange={(e) => {
                            const newFeatures = [...editedComponent.features];
                            newFeatures[index].title = e.target.value;
                            handleChange(['features'], newFeatures);
                          }}
                          placeholder='Feature Title'
                        />
                      </div>
                      <div className='space-y-2'>
                        <label>Description</label>
                        <Textarea
                          value={feature.description || ''}
                          onChange={(e) => {
                            const newFeatures = [...editedComponent.features];
                            newFeatures[index].description = e.target.value;
                            handleChange(['features'], newFeatures);
                          }}
                          placeholder='Feature Description'
                          rows={3}
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
                    const newFeatures = [...(editedComponent.features || [])];
                    newFeatures.push({
                      icon: 'star',
                      title: 'New Feature',
                      description: 'Description of the new feature',
                    });
                    handleChange(['features'], newFeatures);
                  }}
                >
                  <Plus className='h-3 w-3 mr-1' /> Add Feature
                </Button>
              </CardContent>
            </Card>
          </>
        );

      case 'cta-section':
        return (
          <>
            <div className='space-y-2'>
              <label>Title</label>
              <Input
                value={editedComponent.title || ''}
                onChange={(e) => handleChange(['title'], e.target.value)}
                placeholder='Join Our Conservation Efforts Today'
              />
            </div>
            <div className='space-y-2'>
              <label>Description</label>
              <Textarea
                value={editedComponent.description || ''}
                onChange={(e) => handleChange(['description'], e.target.value)}
                placeholder='Your support helps us protect endangered species and preserve critical habitats...'
                rows={3}
              />
            </div>
            <div className='space-y-2'>
              <label>Button Text</label>
              <Input
                value={editedComponent.buttonText || ''}
                onChange={(e) => handleChange(['buttonText'], e.target.value)}
                placeholder='Donate Now'
              />
            </div>
            <div className='space-y-2'>
              <label>Button Link</label>
              <Input
                value={editedComponent.buttonLink || ''}
                onChange={(e) => handleChange(['buttonLink'], e.target.value)}
                placeholder='/donate'
              />
            </div>
            <div className='space-y-4'>
              <label>Background Image (Optional)</label>
              {editedComponent.backgroundImage && (
                <div className='flex items-center justify-center p-2 border rounded-md bg-muted/40 mb-2'>
                  <img
                    src={editedComponent.backgroundImage || '/placeholder.svg'}
                    alt='Background Preview'
                    className='max-h-40 object-contain'
                  />
                </div>
              )}
              <ImageUploader
                onUpload={(file) =>
                  handleImageUpload(file, ['backgroundImage'])
                }
                buttonText='Upload Background Image'
                buttonIcon={<ImageIcon className='h-4 w-4 mr-2' />}
                buttonClassName='bg-pink-500 hover:bg-pink-600 text-white'
              />
              <Input
                value={editedComponent.backgroundImage || ''}
                onChange={(e) =>
                  handleChange(['backgroundImage'], e.target.value)
                }
                placeholder='https://images.unsplash.com/photo-1574068468668-a05a11f871da'
                className='mt-2'
              />
            </div>
          </>
        );

      case 'content-section':
        return (
          <>
            <div className='space-y-2'>
              <label>Title</label>
              <Input
                value={editedComponent.title || ''}
                onChange={(e) => handleChange(['title'], e.target.value)}
                placeholder='Our Conservation Approach'
              />
            </div>
            <div className='space-y-2'>
              <label>Subtitle</label>
              <Input
                value={editedComponent.subtitle || ''}
                onChange={(e) => handleChange(['subtitle'], e.target.value)}
                placeholder='Science-Based Solutions'
              />
            </div>
            <Card>
              <CardHeader>
                <CardTitle className='text-sm'>Content Paragraphs</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {Array.isArray(editedComponent.content) ? (
                  editedComponent.content.map((paragraph, index) => (
                    <div key={index} className='space-y-2'>
                      <div className='flex justify-between items-center'>
                        <label>Paragraph {index + 1}</label>
                        <Button
                          size='icon'
                          variant='ghost'
                          className='h-6 w-6 text-destructive'
                          onClick={() => {
                            const newContent = [...editedComponent.content];
                            newContent.splice(index, 1);
                            handleChange(['content'], newContent);
                          }}
                        >
                          <Trash2 className='h-3 w-3' />
                        </Button>
                      </div>
                      <Textarea
                        value={paragraph || ''}
                        onChange={(e) => {
                          const newContent = [...editedComponent.content];
                          newContent[index] = e.target.value;
                          handleChange(['content'], newContent);
                        }}
                        placeholder='Content paragraph'
                        rows={3}
                      />
                    </div>
                  ))
                ) : (
                  <div className='space-y-2'>
                    <label>Content</label>
                    <Textarea
                      value={editedComponent.content || ''}
                      onChange={(e) =>
                        handleChange(['content'], e.target.value)
                      }
                      placeholder='Content text'
                      rows={4}
                    />
                  </div>
                )}
                {Array.isArray(editedComponent.content) && (
                  <Button
                    size='sm'
                    variant='outline'
                    className='w-full border-pink-200 hover:bg-pink-50 text-pink-700'
                    onClick={() => {
                      const newContent = [...(editedComponent.content || [])];
                      newContent.push('');
                      handleChange(['content'], newContent);
                    }}
                  >
                    <Plus className='h-3 w-3 mr-1' /> Add Paragraph
                  </Button>
                )}
              </CardContent>
            </Card>
            <div className='space-y-4'>
              <label>Image</label>
              {editedComponent.image && (
                <div className='flex items-center justify-center p-2 border rounded-md bg-muted/40 mb-2'>
                  <img
                    src={editedComponent.image || '/placeholder.svg'}
                    alt='Content Image Preview'
                    className='max-h-40 object-contain'
                  />
                </div>
              )}
              <ImageUploader
                onUpload={(file) => handleImageUpload(file, ['image'])}
                buttonText='Upload Image'
                buttonIcon={<ImageIcon className='h-4 w-4 mr-2' />}
                buttonClassName='bg-pink-500 hover:bg-pink-600 text-white'
              />
              <Input
                value={editedComponent.image || ''}
                onChange={(e) => handleChange(['image'], e.target.value)}
                placeholder='https://images.unsplash.com/photo-1535338454770-8be927b5a00b'
                className='mt-2'
              />
            </div>
            <div className='space-y-2'>
              <label>Image Position</label>
              <Select
                value={editedComponent.imagePosition || 'right'}
                onValueChange={(value) =>
                  handleChange(['imagePosition'], value)
                }
              >
                <SelectTrigger className='border-pink-200'>
                  <SelectValue placeholder='Select position' />
                </SelectTrigger>
                <SelectContent className='bg-white'>
                  <SelectItem value='right'>Right</SelectItem>
                  <SelectItem value='left'>Left</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className='text-sm'>
                  Call to Action (Optional)
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <label>CTA Text</label>
                  <Input
                    value={editedComponent.cta?.text || ''}
                    onChange={(e) =>
                      handleChange(['cta', 'text'], e.target.value)
                    }
                    placeholder='Learn More About Our Work'
                  />
                </div>
                <div className='space-y-2'>
                  <label>CTA Link</label>
                  <Input
                    value={editedComponent.cta?.link || ''}
                    onChange={(e) =>
                      handleChange(['cta', 'link'], e.target.value)
                    }
                    placeholder='/about'
                  />
                </div>
              </CardContent>
            </Card>
          </>
        );

      case 'social-proof-section':
        return (
          <>
            <div className='space-y-2'>
              <label>Title</label>
              <Input
                value={editedComponent.title || ''}
                onChange={(e) => handleChange(['title'], e.target.value)}
                placeholder='What Our Supporters Say'
              />
            </div>
            <Card>
              <CardHeader>
                <CardTitle className='text-sm'>Testimonials</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {editedComponent.testimonials?.map((testimonial, index) => (
                  <Card key={index} className='border-dashed'>
                    <CardHeader className='py-2'>
                      <div className='flex justify-between items-center'>
                        <CardTitle className='text-xs'>
                          Testimonial {index + 1}
                        </CardTitle>
                        <Button
                          size='icon'
                          variant='ghost'
                          className='h-6 w-6 text-destructive'
                          onClick={() => {
                            const newTestimonials = [
                              ...editedComponent.testimonials,
                            ];
                            newTestimonials.splice(index, 1);
                            handleChange(['testimonials'], newTestimonials);
                          }}
                        >
                          <Trash2 className='h-3 w-3' />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className='py-2 space-y-2'>
                      <div className='space-y-2'>
                        <label>Name</label>
                        <Input
                          value={testimonial.name || ''}
                          onChange={(e) => {
                            const newTestimonials = [
                              ...editedComponent.testimonials,
                            ];
                            newTestimonials[index].name = e.target.value;
                            handleChange(['testimonials'], newTestimonials);
                          }}
                          placeholder='Sarah Johnson'
                        />
                      </div>
                      <div className='space-y-2'>
                        <label>Role</label>
                        <Input
                          value={testimonial.role || ''}
                          onChange={(e) => {
                            const newTestimonials = [
                              ...editedComponent.testimonials,
                            ];
                            newTestimonials[index].role = e.target.value;
                            handleChange(['testimonials'], newTestimonials);
                          }}
                          placeholder='Monthly Donor'
                        />
                      </div>
                      <div className='space-y-2'>
                        <label>Quote</label>
                        <Textarea
                          value={testimonial.quote || ''}
                          onChange={(e) => {
                            const newTestimonials = [
                              ...editedComponent.testimonials,
                            ];
                            newTestimonials[index].quote = e.target.value;
                            handleChange(['testimonials'], newTestimonials);
                          }}
                          placeholder='Supporting this organization has been incredibly rewarding...'
                          rows={3}
                        />
                      </div>
                      <div className='space-y-4'>
                        <label>Avatar</label>
                        {testimonial.avatar && (
                          <div className='flex items-center justify-center p-2 border rounded-md bg-muted/40 mb-2'>
                            <img
                              src={testimonial.avatar || '/placeholder.svg'}
                              alt='Avatar Preview'
                              className='h-12 w-12 rounded-full object-cover'
                            />
                          </div>
                        )}
                        <ImageUploader
                          onUpload={(file) => {
                            setIsUploading(true);
                            uploadToCloudinary(file)
                              .then((url) => {
                                const newTestimonials = [
                                  ...editedComponent.testimonials,
                                ];
                                newTestimonials[index].avatar = url;
                                handleChange(['testimonials'], newTestimonials);
                                setIsUploading(false);
                              })
                              .catch((error) => {
                                console.error('Upload error:', error);
                                setIsUploading(false);
                              });
                          }}
                          buttonText='Upload Avatar'
                          buttonIcon={<ImageIcon className='h-4 w-4 mr-2' />}
                          buttonClassName='bg-pink-500 hover:bg-pink-600 text-white'
                        />
                        <Input
                          value={testimonial.avatar || ''}
                          onChange={(e) => {
                            const newTestimonials = [
                              ...editedComponent.testimonials,
                            ];
                            newTestimonials[index].avatar = e.target.value;
                            handleChange(['testimonials'], newTestimonials);
                          }}
                          placeholder='https://images.unsplash.com/photo-1494790108377-be9c29b29330'
                          className='mt-2'
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
                    const newTestimonials = [
                      ...(editedComponent.testimonials || []),
                    ];
                    newTestimonials.push({
                      name: 'New Testimonial',
                      role: 'Role',
                      quote: 'Quote text goes here...',
                      avatar: '',
                    });
                    handleChange(['testimonials'], newTestimonials);
                  }}
                >
                  <Plus className='h-3 w-3 mr-1' /> Add Testimonial
                </Button>
              </CardContent>
            </Card>
          </>
        );

      case 'faq-section':
        return (
          <>
            <div className='space-y-2'>
              <label>Title</label>
              <Input
                value={editedComponent.title || ''}
                onChange={(e) => handleChange(['title'], e.target.value)}
                placeholder='Frequently Asked Questions'
              />
            </div>
            <div className='space-y-2'>
              <label>Description</label>
              <Textarea
                value={editedComponent.description || ''}
                onChange={(e) => handleChange(['description'], e.target.value)}
                placeholder='Find answers to common questions about our work and how you can get involved.'
                rows={3}
              />
            </div>
            <Card>
              <CardHeader>
                <CardTitle className='text-sm'>FAQ Items</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {editedComponent.faqs?.map((faq, index) => (
                  <Card key={index} className='border-dashed'>
                    <CardHeader className='py-2'>
                      <div className='flex justify-between items-center'>
                        <CardTitle className='text-xs'>
                          FAQ {index + 1}
                        </CardTitle>
                        <Button
                          size='icon'
                          variant='ghost'
                          className='h-6 w-6 text-destructive'
                          onClick={() => {
                            const newFaqs = [...editedComponent.faqs];
                            newFaqs.splice(index, 1);
                            handleChange(['faqs'], newFaqs);
                          }}
                        >
                          <Trash2 className='h-3 w-3' />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className='py-2 space-y-2'>
                      <div className='space-y-2'>
                        <label>Question</label>
                        <Input
                          value={faq.question || ''}
                          onChange={(e) => {
                            const newFaqs = [...editedComponent.faqs];
                            newFaqs[index].question = e.target.value;
                            handleChange(['faqs'], newFaqs);
                          }}
                          placeholder='How is my donation used?'
                        />
                      </div>
                      <div className='space-y-2'>
                        <label>Answer</label>
                        <Textarea
                          value={faq.answer || ''}
                          onChange={(e) => {
                            const newFaqs = [...editedComponent.faqs];
                            newFaqs[index].answer = e.target.value;
                            handleChange(['faqs'], newFaqs);
                          }}
                          placeholder='85% of every donation goes directly to field conservation programs...'
                          rows={3}
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
                    const newFaqs = [...(editedComponent.faqs || [])];
                    newFaqs.push({
                      question: 'New Question',
                      answer: 'Answer to the question...',
                    });
                    handleChange(['faqs'], newFaqs);
                  }}
                >
                  <Plus className='h-3 w-3 mr-1' /> Add FAQ
                </Button>
              </CardContent>
            </Card>
          </>
        );

      case 'team-section':
        return (
          <>
            <div className='space-y-2'>
              <label>Title</label>
              <Input
                value={editedComponent.title || ''}
                onChange={(e) => handleChange(['title'], e.target.value)}
                placeholder='Our Leadership Team'
              />
            </div>
            <div className='space-y-2'>
              <label>Description</label>
              <Textarea
                value={editedComponent.description || ''}
                onChange={(e) => handleChange(['description'], e.target.value)}
                placeholder='Meet the dedicated professionals leading our efforts around the world.'
                rows={3}
              />
            </div>
            <Card>
              <CardHeader>
                <CardTitle className='text-sm'>Team Members</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {editedComponent.members?.map((member, index) => (
                  <Card key={index} className='border-dashed'>
                    <CardHeader className='py-2'>
                      <div className='flex justify-between items-center'>
                        <CardTitle className='text-xs'>
                          Member {index + 1}
                        </CardTitle>
                        <Button
                          size='icon'
                          variant='ghost'
                          className='h-6 w-6 text-destructive'
                          onClick={() => {
                            const newMembers = [...editedComponent.members];
                            newMembers.splice(index, 1);
                            handleChange(['members'], newMembers);
                          }}
                        >
                          <Trash2 className='h-3 w-3' />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className='py-2 space-y-2'>
                      <div className='space-y-2'>
                        <label>Name</label>
                        <Input
                          value={member.name || ''}
                          onChange={(e) => {
                            const newMembers = [...editedComponent.members];
                            newMembers[index].name = e.target.value;
                            handleChange(['members'], newMembers);
                          }}
                          placeholder='Dr. Elena Morales'
                        />
                      </div>
                      <div className='space-y-2'>
                        <label>Role</label>
                        <Input
                          value={member.role || ''}
                          onChange={(e) => {
                            const newMembers = [...editedComponent.members];
                            newMembers[index].role = e.target.value;
                            handleChange(['members'], newMembers);
                          }}
                          placeholder='Founder & Executive Director'
                        />
                      </div>
                      <div className='space-y-2'>
                        <label>Bio</label>
                        <Textarea
                          value={member.bio || ''}
                          onChange={(e) => {
                            const newMembers = [...editedComponent.members];
                            newMembers[index].bio = e.target.value;
                            handleChange(['members'], newMembers);
                          }}
                          placeholder='Dr. Morales founded our organization after witnessing...'
                          rows={3}
                        />
                      </div>
                      <div className='space-y-4'>
                        <label>Image</label>
                        {member.image && (
                          <div className='flex items-center justify-center p-2 border rounded-md bg-muted/40 mb-2'>
                            <img
                              src={member.image || '/placeholder.svg'}
                              alt='Member Preview'
                              className='h-32 w-32 object-cover'
                            />
                          </div>
                        )}
                        <ImageUploader
                          onUpload={(file) => {
                            setIsUploading(true);
                            uploadToCloudinary(file)
                              .then((url) => {
                                const newMembers = [...editedComponent.members];
                                newMembers[index].image = url;
                                handleChange(['members'], newMembers);
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
                          value={member.image || ''}
                          onChange={(e) => {
                            const newMembers = [...editedComponent.members];
                            newMembers[index].image = e.target.value;
                            handleChange(['members'], newMembers);
                          }}
                          placeholder='https://images.unsplash.com/photo-1573496359142-b8d87734a5a2'
                          className='mt-2'
                        />
                      </div>
                      <Card>
                        <CardHeader>
                          <CardTitle className='text-xs'>
                            Social Links
                          </CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                          {member.socialLinks?.map((link, linkIndex) => (
                            <div
                              key={linkIndex}
                              className='space-y-2 border-t pt-2 first:border-t-0 first:pt-0'
                            >
                              <div className='flex justify-between items-center'>
                                <label>Social Link {linkIndex + 1}</label>
                                <Button
                                  size='icon'
                                  variant='ghost'
                                  className='h-6 w-6 text-destructive'
                                  onClick={() => {
                                    const newSocialLinks = [
                                      ...member.socialLinks,
                                    ];
                                    newSocialLinks.splice(linkIndex, 1);
                                    const newMembers = [
                                      ...editedComponent.members,
                                    ];
                                    newMembers[index].socialLinks =
                                      newSocialLinks;
                                    handleChange(['members'], newMembers);
                                  }}
                                >
                                  <Trash2 className='h-3 w-3' />
                                </Button>
                              </div>
                              <div className='space-y-2'>
                                <label>Icon</label>
                                <Input
                                  value={link.icon || ''}
                                  onChange={(e) => {
                                    const newSocialLinks = [
                                      ...member.socialLinks,
                                    ];
                                    newSocialLinks[linkIndex].icon =
                                      e.target.value;
                                    const newMembers = [
                                      ...editedComponent.members,
                                    ];
                                    newMembers[index].socialLinks =
                                      newSocialLinks;
                                    handleChange(['members'], newMembers);
                                  }}
                                  placeholder='linkedin'
                                />
                              </div>
                              <div className='space-y-2'>
                                <label>URL</label>
                                <Input
                                  value={link.url || ''}
                                  onChange={(e) => {
                                    const newSocialLinks = [
                                      ...member.socialLinks,
                                    ];
                                    newSocialLinks[linkIndex].url =
                                      e.target.value;
                                    const newMembers = [
                                      ...editedComponent.members,
                                    ];
                                    newMembers[index].socialLinks =
                                      newSocialLinks;
                                    handleChange(['members'], newMembers);
                                  }}
                                  placeholder='https://linkedin.com/in/username'
                                />
                              </div>
                            </div>
                          ))}
                          <Button
                            size='sm'
                            variant='outline'
                            className='w-full border-pink-200 hover:bg-pink-50 text-pink-700'
                            onClick={() => {
                              const newSocialLinks = [
                                ...(member.socialLinks || []),
                              ];
                              newSocialLinks.push({
                                icon: 'linkedin',
                                url: 'https://linkedin.com/in/',
                              });
                              const newMembers = [...editedComponent.members];
                              newMembers[index].socialLinks = newSocialLinks;
                              handleChange(['members'], newMembers);
                            }}
                          >
                            <Plus className='h-3 w-3 mr-1' /> Add Social Link
                          </Button>
                        </CardContent>
                      </Card>
                    </CardContent>
                  </Card>
                ))}
                <Button
                  size='sm'
                  variant='outline'
                  className='w-full border-pink-200 hover:bg-pink-50 text-pink-700'
                  onClick={() => {
                    const newMembers = [...(editedComponent.members || [])];
                    newMembers.push({
                      name: 'New Team Member',
                      role: 'Position',
                      bio: 'Bio information...',
                      image: '',
                      socialLinks: [
                        {
                          icon: 'linkedin',
                          url: 'https://linkedin.com/in/',
                        },
                      ],
                    });
                    handleChange(['members'], newMembers);
                  }}
                >
                  <Plus className='h-3 w-3 mr-1' /> Add Team Member
                </Button>
              </CardContent>
            </Card>
          </>
        );

      case 'team-member':
        return (
          <>
            <div className='space-y-2'>
              <label>Name</label>
              <Input
                value={editedComponent.name || ''}
                onChange={(e) => handleChange(['name'], e.target.value)}
                placeholder='Dr. Elena Morales'
              />
            </div>
            <div className='space-y-2'>
              <label>Role</label>
              <Input
                value={editedComponent.role || ''}
                onChange={(e) => handleChange(['role'], e.target.value)}
                placeholder='Founder & Executive Director'
              />
            </div>
            <div className='space-y-2'>
              <label>Bio</label>
              <Textarea
                value={editedComponent.bio || ''}
                onChange={(e) => handleChange(['bio'], e.target.value)}
                placeholder='Dr. Morales founded our organization after witnessing...'
                rows={3}
              />
            </div>
            <div className='space-y-4'>
              <label>Image</label>
              {editedComponent.image && (
                <div className='flex items-center justify-center p-2 border rounded-md bg-muted/40 mb-2'>
                  <img
                    src={editedComponent.image || '/placeholder.svg'}
                    alt='Member Preview'
                    className='h-32 w-32 object-cover'
                  />
                </div>
              )}
              <ImageUploader
                onUpload={(file) => handleImageUpload(file, ['image'])}
                buttonText='Upload Image'
                buttonIcon={<ImageIcon className='h-4 w-4 mr-2' />}
                buttonClassName='bg-pink-500 hover:bg-pink-600 text-white'
              />
              <Input
                value={editedComponent.image || ''}
                onChange={(e) => handleChange(['image'], e.target.value)}
                placeholder='https://images.unsplash.com/photo-1573496359142-b8d87734a5a2'
                className='mt-2'
              />
            </div>
            <Card>
              <CardHeader>
                <CardTitle className='text-sm'>Social Links</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {editedComponent.socialLinks?.map((link, index) => (
                  <div
                    key={index}
                    className='space-y-2 border-t pt-2 first:border-t-0 first:pt-0'
                  >
                    <div className='flex justify-between items-center'>
                      <label>Social Link {index + 1}</label>
                      <Button
                        size='icon'
                        variant='ghost'
                        className='h-6 w-6 text-destructive'
                        onClick={() => {
                          const newSocialLinks = [
                            ...editedComponent.socialLinks,
                          ];
                          newSocialLinks.splice(index, 1);
                          handleChange(['socialLinks'], newSocialLinks);
                        }}
                      >
                        <Trash2 className='h-3 w-3' />
                      </Button>
                    </div>
                    <div className='space-y-2'>
                      <label>Icon</label>
                      <Input
                        value={link.icon || ''}
                        onChange={(e) => {
                          const newSocialLinks = [
                            ...editedComponent.socialLinks,
                          ];
                          newSocialLinks[index].icon = e.target.value;
                          handleChange(['socialLinks'], newSocialLinks);
                        }}
                        placeholder='linkedin'
                      />
                    </div>
                    <div className='space-y-2'>
                      <label>URL</label>
                      <Input
                        value={link.url || ''}
                        onChange={(e) => {
                          const newSocialLinks = [
                            ...editedComponent.socialLinks,
                          ];
                          newSocialLinks[index].url = e.target.value;
                          handleChange(['socialLinks'], newSocialLinks);
                        }}
                        placeholder='https://linkedin.com/in/username'
                      />
                    </div>
                  </div>
                ))}
                <Button
                  size='sm'
                  variant='outline'
                  className='w-full border-pink-200 hover:bg-pink-50 text-pink-700'
                  onClick={() => {
                    const newSocialLinks = [
                      ...(editedComponent.socialLinks || []),
                    ];
                    newSocialLinks.push({
                      icon: 'linkedin',
                      url: 'https://linkedin.com/in/',
                    });
                    handleChange(['socialLinks'], newSocialLinks);
                  }}
                >
                  <Plus className='h-3 w-3 mr-1' /> Add Social Link
                </Button>
              </CardContent>
            </Card>
          </>
        );

      case 'logo-grid':
        return (
          <>
            <div className='space-y-2'>
              <label>Title</label>
              <Input
                value={editedComponent.title || ''}
                onChange={(e) => handleChange(['title'], e.target.value)}
                placeholder='Our Partners & Supporters'
              />
            </div>
            <div className='space-y-2'>
              <label>Description</label>
              <Textarea
                value={editedComponent.description || ''}
                onChange={(e) => handleChange(['description'], e.target.value)}
                placeholder='We collaborate with organizations around the world to maximize our impact.'
                rows={3}
              />
            </div>
            <Card>
              <CardHeader>
                <CardTitle className='text-sm'>Logos</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {editedComponent.logos?.map((logo, index) => (
                  <Card key={index} className='border-dashed'>
                    <CardHeader className='py-2'>
                      <div className='flex justify-between items-center'>
                        <CardTitle className='text-xs'>
                          Logo {index + 1}
                        </CardTitle>
                        <Button
                          size='icon'
                          variant='ghost'
                          className='h-6 w-6 text-destructive'
                          onClick={() => {
                            const newLogos = [...editedComponent.logos];
                            newLogos.splice(index, 1);
                            handleChange(['logos'], newLogos);
                          }}
                        >
                          <Trash2 className='h-3 w-3' />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className='py-2 space-y-2'>
                      <div className='space-y-2'>
                        <label>Name</label>
                        <Input
                          value={logo.name || ''}
                          onChange={(e) => {
                            const newLogos = [...editedComponent.logos];
                            newLogos[index].name = e.target.value;
                            handleChange(['logos'], newLogos);
                          }}
                          placeholder='Partner Name'
                        />
                      </div>
                      <div className='space-y-2'>
                        <label>URL</label>
                        <Input
                          value={logo.url || ''}
                          onChange={(e) => {
                            const newLogos = [...editedComponent.logos];
                            newLogos[index].url = e.target.value;
                            handleChange(['logos'], newLogos);
                          }}
                          placeholder='https://partner-website.com'
                        />
                      </div>
                      <div className='space-y-4'>
                        <label>Logo Image</label>
                        {logo.image && (
                          <div className='flex items-center justify-center p-2 border rounded-md bg-muted/40 mb-2'>
                            <img
                              src={logo.image || '/placeholder.svg'}
                              alt='Logo Preview'
                              className='h-16 object-contain'
                            />
                          </div>
                        )}
                        <ImageUploader
                          onUpload={(file) => {
                            setIsUploading(true);
                            uploadToCloudinary(file)
                              .then((url) => {
                                const newLogos = [...editedComponent.logos];
                                newLogos[index].image = url;
                                handleChange(['logos'], newLogos);
                                setIsUploading(false);
                              })
                              .catch((error) => {
                                console.error('Upload error:', error);
                                setIsUploading(false);
                              });
                          }}
                          buttonText='Upload Logo'
                          buttonIcon={<ImageIcon className='h-4 w-4 mr-2' />}
                          buttonClassName='bg-pink-500 hover:bg-pink-600 text-white'
                        />
                        <Input
                          value={logo.image || ''}
                          onChange={(e) => {
                            const newLogos = [...editedComponent.logos];
                            newLogos[index].image = e.target.value;
                            handleChange(['logos'], newLogos);
                          }}
                          placeholder='https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead'
                          className='mt-2'
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
                    const newLogos = [...(editedComponent.logos || [])];
                    newLogos.push({
                      name: 'New Partner',
                      url: 'https://example.com',
                      image: '',
                    });
                    handleChange(['logos'], newLogos);
                  }}
                >
                  <Plus className='h-3 w-3 mr-1' /> Add Logo
                </Button>
              </CardContent>
            </Card>
          </>
        );

      case 'stats-section':
        return (
          <>
            <div className='space-y-2'>
              <label>Title</label>
              <Input
                value={editedComponent.title || ''}
                onChange={(e) => handleChange(['title'], e.target.value)}
                placeholder='Our Conservation Impact'
              />
            </div>
            <div className='space-y-2'>
              <label>Description</label>
              <Textarea
                value={editedComponent.description || ''}
                onChange={(e) => handleChange(['description'], e.target.value)}
                placeholder='Measurable results from our global conservation efforts.'
                rows={3}
              />
            </div>
            <Card>
              <CardHeader>
                <CardTitle className='text-sm'>Stats</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {editedComponent.stats?.map((stat, index) => (
                  <Card key={index} className='border-dashed'>
                    <CardHeader className='py-2'>
                      <div className='flex justify-between items-center'>
                        <CardTitle className='text-xs'>
                          Stat {index + 1}
                        </CardTitle>
                        <Button
                          size='icon'
                          variant='ghost'
                          className='h-6 w-6 text-destructive'
                          onClick={() => {
                            const newStats = [...editedComponent.stats];
                            newStats.splice(index, 1);
                            handleChange(['stats'], newStats);
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
                          value={stat.icon || ''}
                          onChange={(e) => {
                            const newStats = [...editedComponent.stats];
                            newStats[index].icon = e.target.value;
                            handleChange(['stats'], newStats);
                          }}
                          placeholder='shield'
                        />
                      </div>
                      <div className='space-y-2'>
                        <label>Value</label>
                        <Input
                          value={stat.value || ''}
                          onChange={(e) => {
                            const newStats = [...editedComponent.stats];
                            newStats[index].value = e.target.value;
                            handleChange(['stats'], newStats);
                          }}
                          placeholder='150+'
                        />
                      </div>
                      <div className='space-y-2'>
                        <label>Label</label>
                        <Input
                          value={stat.label || ''}
                          onChange={(e) => {
                            const newStats = [...editedComponent.stats];
                            newStats[index].label = e.target.value;
                            handleChange(['stats'], newStats);
                          }}
                          placeholder='Species Protected'
                        />
                      </div>
                      <div className='space-y-2'>
                        <label>Description</label>
                        <Input
                          value={stat.description || ''}
                          onChange={(e) => {
                            const newStats = [...editedComponent.stats];
                            newStats[index].description = e.target.value;
                            handleChange(['stats'], newStats);
                          }}
                          placeholder='Endangered species under our conservation programs'
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
                    const newStats = [...(editedComponent.stats || [])];
                    newStats.push({
                      icon: 'star',
                      value: '0+',
                      label: 'New Stat',
                      description: 'Description of this statistic',
                    });
                    handleChange(['stats'], newStats);
                  }}
                >
                  <Plus className='h-3 w-3 mr-1' /> Add Stat
                </Button>
              </CardContent>
            </Card>
          </>
        );

      case 'statistics-grid':
        return (
          <>
            <div className='space-y-2'>
              <label>Title</label>
              <Input
                value={editedComponent.title || ''}
                onChange={(e) => handleChange(['title'], e.target.value)}
                placeholder='Our Impact in Numbers'
              />
            </div>
            <div className='space-y-2'>
              <label>Description</label>
              <Textarea
                value={editedComponent.description || ''}
                onChange={(e) => handleChange(['description'], e.target.value)}
                placeholder='Measurable results from our conservation efforts worldwide.'
                rows={3}
              />
            </div>
            <Card>
              <CardHeader>
                <CardTitle className='text-sm'>Stats</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {editedComponent.stats?.map((stat, index) => (
                  <Card key={index} className='border-dashed'>
                    <CardHeader className='py-2'>
                      <div className='flex justify-between items-center'>
                        <CardTitle className='text-xs'>
                          Stat {index + 1}
                        </CardTitle>
                        <Button
                          size='icon'
                          variant='ghost'
                          className='h-6 w-6 text-destructive'
                          onClick={() => {
                            const newStats = [...editedComponent.stats];
                            newStats.splice(index, 1);
                            handleChange(['stats'], newStats);
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
                          value={stat.icon || ''}
                          onChange={(e) => {
                            const newStats = [...editedComponent.stats];
                            newStats[index].icon = e.target.value;
                            handleChange(['stats'], newStats);
                          }}
                          placeholder='shield'
                        />
                      </div>
                      <div className='space-y-2'>
                        <label>Value</label>
                        <Input
                          value={stat.value || ''}
                          onChange={(e) => {
                            const newStats = [...editedComponent.stats];
                            newStats[index].value = e.target.value;
                            handleChange(['stats'], newStats);
                          }}
                          placeholder='150+'
                        />
                      </div>
                      <div className='space-y-2'>
                        <label>Label</label>
                        <Input
                          value={stat.label || ''}
                          onChange={(e) => {
                            const newStats = [...editedComponent.stats];
                            newStats[index].label = e.target.value;
                            handleChange(['stats'], newStats);
                          }}
                          placeholder='Species Protected'
                        />
                      </div>
                      <div className='space-y-2'>
                        <label>Change Percentage (Optional)</label>
                        <Input
                          type='number'
                          value={stat.change || ''}
                          onChange={(e) => {
                            const newStats = [...editedComponent.stats];
                            newStats[index].change =
                              Number(e.target.value) || 0;
                            handleChange(['stats'], newStats);
                          }}
                          placeholder='12'
                        />
                        <p className='text-xs text-muted-foreground'>
                          Positive number for increase, negative for decrease
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button
                  size='sm'
                  variant='outline'
                  className='w-full border-pink-200 hover:bg-pink-50 text-pink-700'
                  onClick={() => {
                    const newStats = [...(editedComponent.stats || [])];
                    newStats.push({
                      icon: 'star',
                      value: '0+',
                      label: 'New Stat',
                      change: 0,
                    });
                    handleChange(['stats'], newStats);
                  }}
                >
                  <Plus className='h-3 w-3 mr-1' /> Add Stat
                </Button>
              </CardContent>
            </Card>
          </>
        );

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
