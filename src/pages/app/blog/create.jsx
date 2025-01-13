import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
export default function CreateBlogPost() {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [visibility, setVisibility] = useState('public');
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Start writing your blog post here...</p>',
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
  });
  const handlePublish = () => {
    // Implement publish logic here
    console.log('Publishing:', {
      title,
      content: editor?.getHTML(),
      tags,
      visibility,
    });
  };
  return (
    <div>
      <h1 className='text-3xl font-bold mb-6 text-gray-100'>
        Create Blog Post
      </h1>
      <Card className='mb-6'>
        <CardHeader>
          <CardTitle className='text-gray-100'>New Blog Post</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <Input
            placeholder='Blog post title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='bg-gray-800 border-gray-700 text-gray-300 focus:border-pink-700'
          />
          <EditorContent
            editor={editor}
            className='min-h-[200px] bg-gray-800 border border-gray-700 rounded-md p-2 text-gray-300'
          />
          <Input
            placeholder='Tags (comma separated)'
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className='bg-gray-800 border-gray-700 text-gray-300 focus:border-pink-700'
          />
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            className='w-full bg-gray-800 border-gray-700 text-gray-300 rounded-md focus:border-pink-700'
          >
            <option value='public'>Public</option>
            <option value='private'>Private</option>
          </select>
          <div className='flex justify-end space-x-2'>
            <Button
              variant='outline'
              className='text-gray-300 border-gray-700 hover:bg-gray-700'
            >
              Preview
            </Button>
            <Button
              onClick={handlePublish}
              className='bg-pink-700 text-white hover:bg-pink-800'
            >
              Publish
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
