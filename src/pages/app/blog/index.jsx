import { useState } from 'react';
import { DashboardCard } from '@/components/ui/app-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Eye, ThumbsUp } from 'lucide-react';
const blogPosts = [
  {
    id: 1,
    title: 'Getting Started with Inaethe',
    excerpt: 'Learn how to make the most of your Inaethe account...',
    views: 1234,
    likes: 56,
    date: '2023-07-01',
  },
  {
    id: 2,
    title: 'Maximizing Your Referrals',
    excerpt: 'Discover strategies to increase your referral earnings...',
    views: 987,
    likes: 43,
    date: '2023-07-15',
  },
  {
    id: 3,
    title: 'Impact of Your Contributions',
    excerpt: 'See how your contributions are making a difference...',
    views: 756,
    likes: 32,
    date: '2023-07-30',
  },
];
export default function BlogPosts() {
  const [search, setSearch] = useState('');
  const filteredPosts = blogPosts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold text-gray-100'>Blog Posts</h1>
        <Link href='/app/blog/create'>
          <Button className='bg-pink-700 text-white hover:bg-pink-800'>
            Create New Post
          </Button>
        </Link>
      </div>
      <Input
        placeholder='Search posts'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className='max-w-sm mb-6 bg-gray-800 border-gray-700 text-gray-300'
      />
      <div className='grid gap-6'>
        {filteredPosts.map((post) => (
          <DashboardCard key={post.id} title={post.title}>
            <p className='text-gray-400 mb-2'>{post.excerpt}</p>
            <div className='flex justify-between text-sm text-gray-500'>
              <div className='flex items-center space-x-4'>
                <span className='flex items-center'>
                  <Eye className='w-4 h-4 mr-1' /> {post.views}
                </span>
                <span className='flex items-center'>
                  <ThumbsUp className='w-4 h-4 mr-1' /> {post.likes}
                </span>
              </div>
              <span>Published on {post.date}</span>
            </div>
            <Button className='w-full mt-4 bg-pink-700 text-white hover:bg-pink-800'>
              Read More
            </Button>
          </DashboardCard>
        ))}
      </div>
    </div>
  );
}
