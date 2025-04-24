'use client';

import { useState } from 'react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const MarkdownEditor = dynamic(() => import('@/components/MarkdownEditor'), {
  ssr: false,
});

export default function CreateBlogPost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [visibility, setVisibility] = useState('public');
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDraft, setIsDraft] = useState(false);

  const handlePublish = async () => {
    setIsPublishing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsPublishing(false);

    console.log('Publishing:', {
      title,
      content,
      tags,
      visibility,
      isDraft,
    });

    toast({
      title: isDraft ? 'Draft Saved' : 'Post Published',
      description: isDraft
        ? 'Your draft has been saved successfully.'
        : 'Your blog post has been published successfully.',
    });
  };

  const handlePreview = () => {
    // Implement preview logic here
    console.log('Previewing:', {
      title,
      content,
      tags,
      visibility,
    });
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
      </Card>
    </div>
  );
}
