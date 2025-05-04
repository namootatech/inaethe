'use client';

import { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2, Eye, HelpCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import dynamic from 'next/dynamic';
import TagInput from '@/components/TagInput';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { motion } from 'framer-motion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ImageIcon, XIcon } from 'lucide-react';
import { ImageUploader } from '@/components/ImageUploader';
import ShortUniqueId from 'short-unique-id';
import { Textarea } from '@/components/ui/textarea';
import { useApi } from '@/context/ApiContext';
import { useAuth } from '@/context/AuthContext';

const uid = new ShortUniqueId({ length: 10 });

const MarkdownEditor = dynamic(() => import('@/components/MarkdownEditor'), {
  ssr: false,
});

export default function CreateBlogPost() {
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [visibility, setVisibility] = useState('public');
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef();
  const [featuredImage, setFeaturedImage] = useState('');
  const api = useApi();
  const { user } = useAuth();

  const handlePublish = async () => {
    try {
      setIsPublishing(true);
      // Simulate API call
      await api.addBlogPost({
        title,
        content,
        tags,
        excerpt,
        visibility,
        isDraft,
        featuredImage,
        author: {
          id: user.user._id,
          name: user.user.firstName + ' ' + user.user.lastName,
        },
      });

      setIsPublishing(false);

      console.log('Publishing:');

      toast(
        isDraft
          ? 'Your draft has been saved successfully.'
          : 'Your blog post has been published successfully.'
      );
    } catch (error) {
      console.error('Error publishing blog post:', error);
      toast('Failed to publish blog post. Please try again.');
      setIsPublishing(false);
    }
  };

  const uploadToCloudinary = async (file) => {
    // Only run in browser environment
    if (typeof window === 'undefined') return '';

    const fileId = uid.rnd();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'espazza_images'); // Replace with your unsigned upload preset

    try {
      const xhr = new XMLHttpRequest();

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

  function handlePreview() {
    localStorage.setItem(
      'previewPost',
      JSON.stringify({
        title,
        content,
        excerpt,
        featuredImage,
        youtubeUrl,
      })
    );
    //window.open('/dashboard/blog/preview', '_blank');
  }

  const handleImageUpload = useCallback(async function* (data) {
    if (
      inputRef.current &&
      inputRef.current.files &&
      inputRef.current.files.length > 0
    ) {
      const file = inputRef.current.files[0];
      setIsUploading(true);
      try {
        const url = await uploadToCloudinary(file);
        yield url;
        setIsUploading(false);
        return url;
      } catch (error) {
        setIsUploading(false);
        toast('Failed to upload image. Please try again.');
        return '';
      }
    }
    return '';
  }, []);

  // Handle standalone image upload button
  const handleStandaloneImageUpload = async () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  // Process the selected file
  const handleFileSelected = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast('Please select an image file (JPEG, PNG, GIF, etc.)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast('Image must be less than 5MB');
        return;
      }

      setIsUploading(true);

      try {
        // Show toast for upload start
        toast('Please wait while we upload your image...');

        // Upload the image
        const url = await uploadToCloudinary(file);

        // Create the markdown text
        const imageName = file.name.replace(/\.[^/.]+$/, ''); // Remove file extension
        const markdownText = `![${imageName}](${url})`;

        // Copy to clipboard
        await navigator.clipboard.writeText(markdownText);

        // Success toast with instructions
        toast(
          'Markdown has been copied to clipboard. Paste it where you want the image to appear.'
        );
      } catch (error) {
        console.error('Error uploading image:', error);
        toast('Failed to upload image. Please try again.');
      } finally {
        setIsUploading(false);
        // Clear the file input
        if (inputRef.current) {
          inputRef.current.value = '';
        }
      }
    }
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-6 text-primary'>
        Create a New Blog Post
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Write Your Blog Post</CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div>
            <Label htmlFor='title' className='text-lg font-medium'>
              Blog Post Title
            </Label>
            <Input
              id='title'
              placeholder='Enter the title of your blog post'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='mt-1'
            />
          </div>
          <div>
            <Label htmlFor='title' className='text-lg font-medium'>
              Excerpt
            </Label>
            <Textarea
              id='excerpt'
              placeholder='What are you talking about on this post?'
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className='mt-1'
            />
          </div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className='bg-gray-800/50 p-6 rounded-xl border border-purple-500/20'
          >
            <label className='block text-lg font-medium text-pink-400 mb-2 flex items-center'>
              <ImageIcon className='mr-2 h-5 w-5' />
              Cover Art
            </label>
            <p className='text-gray-400 text-sm mb-4'>
              Make it eye-catching - this is what people see first!
            </p>
            <ImageUploader
              onUploadComplete={(urls) => setFeaturedImage(urls[0])}
              maxSizeInMB={5}
              uploadFunction={uploadToCloudinary}
            />
            {featuredImage && (
              <div className='mt-4 relative'>
                <img
                  src={featuredImage || '/placeholder.svg'}
                  alt='Featured image preview'
                  className='h-40 object-cover rounded-lg border border-purple-500/30'
                />
                <Button
                  variant='destructive'
                  size='sm'
                  className='absolute top-2 right-2 rounded-full w-8 h-8 p-0'
                  onClick={() => setFeaturedImage('')}
                >
                  <XIcon className='h-4 w-4' />
                </Button>
              </div>
            )}
          </motion.div>
          <div>
            <Label htmlFor='content' className='text-lg font-medium'>
              Blog Post Content
            </Label>
            <Alert className='my-2'>
              <AlertDescription>
                <p className='font-semibold'>How to format your post:</p>
                <ul className='list-disc pl-5 space-y-1'>
                  <li>
                    Use the toolbar above the writing area for basic formatting
                    like bold, italic, and lists.
                  </li>
                  <li>
                    To add a link, highlight some text and click the link button
                    in the toolbar.
                  </li>
                  <li>
                    To add an image, click the image button in the toolbar and
                    paste the image URL.
                  </li>
                </ul>
              </AlertDescription>
            </Alert>
            <div className='bg-gray-800/80 p-3 rounded-t-lg border border-purple-500/30 border-b-0'>
              <div className='flex items-center mb-3'>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={handleStandaloneImageUpload}
                  disabled={isUploading}
                  className='flex items-center gap-1 bg-indigo-700/70 hover:bg-indigo-600 text-white border-indigo-600'
                >
                  {isUploading ? (
                    <>
                      <Loader2 className='h-4 w-4 animate-spin' />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <ImageIcon className='h-4 w-4' />
                      <span>Upload Image</span>
                    </>
                  )}
                </Button>
                {isUploading && (
                  <span className='text-xs text-indigo-300 ml-3'>
                    Uploading your image to Cloudinary...
                  </span>
                )}
              </div>

              <div className='text-xs text-gray-300 bg-gray-900/50 p-3 rounded-md'>
                <p className='font-medium text-indigo-300 mb-2'>
                  How to Add Images:
                </p>
                <ol className='list-decimal pl-5 space-y-1'>
                  <li>
                    Click the{' '}
                    <span className='text-white font-medium'>Upload Image</span>{' '}
                    button above
                  </li>
                  <li>Select your image file (JPG, PNG, etc.)</li>
                  <li>Wait for the upload to complete</li>
                  <li>
                    The markdown code will be{' '}
                    <span className='text-white font-medium'>
                      automatically copied
                    </span>{' '}
                    to your clipboard
                  </li>
                  <li>Place your cursor where you want the image to appear</li>
                  <li>
                    Paste the markdown code (
                    <kbd className='px-1 py-0.5 bg-gray-700 rounded text-white'>
                      Ctrl+V
                    </kbd>{' '}
                    or{' '}
                    <kbd className='px-1 py-0.5 bg-gray-700 rounded text-white'>
                      ⌘+V
                    </kbd>
                    )
                  </li>
                </ol>
                <p className='mt-2 text-indigo-200 text-[11px]'>
                  The markdown format{' '}
                  <code className='bg-gray-700/70 px-1 rounded'>
                    ![image description](image-url)
                  </code>{' '}
                  will be used.
                </p>
              </div>
            </div>
            <MarkdownEditor
              value={content}
              onChange={(value) => setContent(value)}
            />
          </div>
          <div>
            <Label htmlFor='tags' className='text-lg font-medium'>
              Tags
            </Label>
            <p className='text-sm text-muted-foreground mb-2'>
              Add keywords that describe your post. This helps readers find your
              content.
            </p>
            <TagInput tags={tags} setTags={setTags} />
          </div>
          <div>
            <Label htmlFor='visibility' className='text-lg font-medium'>
              Who can see your post?
            </Label>
            <Select value={visibility} onValueChange={setVisibility}>
              <SelectTrigger className='mt-1'>
                <SelectValue placeholder='Choose who can see your post' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='public'>Everyone (Public)</SelectItem>
                <SelectItem value='private'>Only Me (Private)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='flex items-center space-x-2'>
            <Switch
              id='draft-mode'
              checked={isDraft}
              onCheckedChange={setIsDraft}
            />
            <Label htmlFor='draft-mode' className='text-base'>
              Save as a draft
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant='ghost' size='icon' className='h-6 w-6'>
                    <HelpCircle className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Drafts are not visible to others and can be edited later.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className='flex justify-end space-x-4'>
            <Button variant='outline' onClick={handlePreview} className='w-32'>
              <Eye className='mr-2 h-4 w-4' /> Preview
            </Button>
            <Button
              onClick={handlePublish}
              disabled={isPublishing}
              className='w-32 bg-pink-700 hover:bg-pink-900'
            >
              {isPublishing ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  {isDraft ? 'Saving...' : 'Publishing...'}
                </>
              ) : isDraft ? (
                'Save Draft'
              ) : (
                'Publish Post'
              )}
            </Button>
          </div>
        </CardContent>
        <style jsx global>{`
          .custom-mde {
            border-radius: 0 0 0.5rem 0.5rem;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
              0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }

          .custom-mde .mde-header {
            background-color: #2d3748;
            border-bottom: 1px solid rgba(124, 58, 237, 0.3);
            padding: 8px;
          }

          .custom-mde .mde-tabs button {
            color: #e2e8f0;
            font-weight: 500;
            padding: 8px 16px;
            border-radius: 0.375rem;
            transition: all 0.2s;
          }

          .custom-mde .mde-tabs button:hover {
            background-color: rgba(124, 58, 237, 0.2);
          }

          .custom-mde .mde-tabs button.selected {
            background-color: rgba(124, 58, 237, 0.3);
            color: #f3f4f6;
          }

          .custom-mde .mde-text {
            min-height: 400px;
            font-size: 16px;
            line-height: 1.6;
            padding: 16px;
            color: #f1f5f9;
            background-color: #1e293b;
          }

          .custom-mde .mde-preview {
            min-height: 400px;
            padding: 16px;
            background-color: #1e293b;
            color: #f1f5f9;
          }

          .custom-mde .mde-preview .mde-preview-content {
            padding: 16px;
          }

          .custom-mde .mde-preview .mde-preview-content h1,
          .custom-mde .mde-preview .mde-preview-content h2,
          .custom-mde .mde-preview .mde-preview-content h3,
          .custom-mde .mde-preview .mde-preview-content h4,
          .custom-mde .mde-preview .mde-preview-content h5,
          .custom-mde .mde-preview .mde-preview-content h6 {
            color: #f3f4f6;
            margin-top: 1.5em;
            margin-bottom: 0.75em;
          }

          .custom-mde .mde-preview .mde-preview-content p {
            margin-bottom: 1em;
          }

          .custom-mde .mde-preview .mde-preview-content ul,
          .custom-mde .mde-preview .mde-preview-content ol {
            padding-left: 2em;
            margin-bottom: 1em;
          }

          .custom-mde .mde-preview .mde-preview-content blockquote {
            border-left: 4px solid rgba(124, 58, 237, 0.5);
            padding-left: 1em;
            margin-left: 0;
            color: #cbd5e1;
          }

          .custom-mde .mde-preview .mde-preview-content img {
            max-width: 100%;
            border-radius: 0.375rem;
            margin: 1em 0;
          }

          .custom-mde .mde-preview .mde-preview-content code {
            background-color: rgba(15, 23, 42, 0.5);
            padding: 0.2em 0.4em;
            border-radius: 0.25rem;
            font-family: monospace;
          }

          .custom-mde .mde-preview .mde-preview-content pre {
            background-color: rgba(15, 23, 42, 0.8);
            padding: 1em;
            border-radius: 0.375rem;
            overflow-x: auto;
            margin: 1em 0;
          }
        `}</style>

        <input
          type='file'
          ref={inputRef}
          style={{ display: 'none' }}
          className='text-zinc-800'
          accept='image/*'
          onChange={handleFileSelected}
        />
      </Card>
    </div>
  );
}
