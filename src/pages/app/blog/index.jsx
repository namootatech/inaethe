'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import {
  Eye,
  ThumbsUp,
  Search,
  Plus,
  Calendar,
  User,
  Clock,
  Tag,
  ArrowUpDown,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { useApi } from '@/context/ApiContext';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { motion } from 'framer-motion';

// Constants
const ITEMS_PER_PAGE = 6;

export default function BlogPosts() {
  const api = useApi();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  // Get unique categories from posts
  const categories = useMemo(() => {
    if (!posts || posts.length === 0) return [];
    const allCategories = posts.flatMap((post) => post.categories || []);
    return ['all', ...new Set(allCategories)];
  }, [posts]);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      setError(null);
      try {
        const userId = user?.user?._id;
        if (!userId) {
          setLoading(false);
          return;
        }

        const response = await api.getUserBlogPosts(userId);
        const fetchedPosts = response.data || [];

        // Add some sample data if needed
        if (fetchedPosts.length === 0) {
          // This is just for demo purposes - remove in production
          const samplePosts = generateSamplePosts();
          setPosts(samplePosts);
        } else {
          setPosts(fetchedPosts);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to load blog posts. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [user?.user, api]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter, sortBy]);

  // Filter and sort posts
  const filteredAndSortedPosts = useMemo(() => {
    if (!posts) return [];

    // Filter by search term
    let filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(search.toLowerCase())
    );

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((post) =>
        post.categories?.includes(categoryFilter)
      );
    }

    // Sort posts
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date) - new Date(a.date);
        case 'oldest':
          return new Date(a.date) - new Date(b.date);
        case 'popular':
          return b.views - a.views;
        case 'mostLiked':
          return b.likes - a.likes;
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });
  }, [posts, search, categoryFilter, sortBy]);

  // Paginate posts
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedPosts.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [filteredAndSortedPosts, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedPosts.length / ITEMS_PER_PAGE);

  // Calculate reading time
  const getReadingTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content?.split(/\s+/).length || 0;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Render pagination controls
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <Pagination className='mt-8'>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              className={
                currentPage === 1 ? 'pointer-events-none opacity-50' : ''
              }
            />
          </PaginationItem>

          {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
            const pageNumber = i + 1;
            // Show first page, last page, and pages around current page
            if (
              pageNumber === 1 ||
              pageNumber === totalPages ||
              (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
            ) {
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    onClick={() => setCurrentPage(pageNumber)}
                    isActive={currentPage === pageNumber}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            }

            // Show ellipsis for skipped pages
            if (pageNumber === 2 && currentPage > 3) {
              return <PaginationItem key='ellipsis-start'>...</PaginationItem>;
            }

            if (pageNumber === totalPages - 1 && currentPage < totalPages - 2) {
              return <PaginationItem key='ellipsis-end'>...</PaginationItem>;
            }

            return null;
          })}

          <PaginationItem>
            <PaginationNext
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              className={
                currentPage === totalPages
                  ? 'pointer-events-none opacity-50'
                  : ''
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  // Render loading skeletons
  const renderSkeletons = () => {
    return Array(3)
      .fill(0)
      .map((_, index) => (
        <Card key={index} className='bg-gray-800 border-gray-700'>
          <CardHeader className='pb-2'>
            <Skeleton className='h-6 w-3/4 mb-2' />
            <Skeleton className='h-4 w-1/2' />
          </CardHeader>
          <CardContent>
            <Skeleton className='h-32 w-full mb-4' />
            <div className='flex justify-between'>
              <Skeleton className='h-4 w-1/4' />
              <Skeleton className='h-4 w-1/4' />
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className='h-10 w-full' />
          </CardFooter>
        </Card>
      ));
  };

  // Render grid view
  const renderGridView = () => {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {paginatedPosts.map((post, index) => (
          <motion.div
            key={post._id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className='h-full flex flex-col bg-gray-800 border-gray-700 overflow-hidden hover:border-pink-500/50 transition-all duration-300'>
              {post.featuredImage && (
                <div className='relative w-full h-48 overflow-hidden'>
                  <img
                    src={post.featuredImage || '/placeholder.svg'}
                    alt={post.title}
                    className='w-full h-full object-cover transition-transform duration-500 hover:scale-105'
                  />
                  {post.status === 'draft' && (
                    <Badge className='absolute top-2 right-2 bg-yellow-600'>
                      Draft
                    </Badge>
                  )}
                </div>
              )}

              <CardHeader className='pb-2'>
                <div className='flex gap-2 mb-2'>
                  {post.categories?.map((category) => (
                    <Badge
                      key={category}
                      variant='outline'
                      className='bg-pink-900/20 text-pink-400 border-pink-500/30'
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
                <CardTitle className='text-xl text-gray-100 line-clamp-2'>
                  {post.title}
                </CardTitle>
                <CardDescription className='flex items-center text-gray-400'>
                  <Calendar className='w-3 h-3 mr-1' />{' '}
                  {formatDate(post.createdAt)}
                </CardDescription>
              </CardHeader>

              <CardContent className='flex-grow'>
                <p className='text-gray-300 line-clamp-3 mb-4'>
                  {post.excerpt}
                </p>
                <div className='flex justify-between text-sm text-gray-400'>
                  <div className='flex items-center space-x-3'>
                    <span className='flex items-center'>
                      <Eye className='w-4 h-4 mr-1 text-gray-500' />{' '}
                      {post.views}
                    </span>
                    <span className='flex items-center'>
                      <ThumbsUp className='w-4 h-4 mr-1 text-gray-500' />{' '}
                      {post.likes}
                    </span>
                  </div>
                  <span className='flex items-center'>
                    <Clock className='w-4 h-4 mr-1 text-gray-500' />{' '}
                    {getReadingTime(post.content)} min read
                  </span>
                </div>
              </CardContent>

              <CardFooter className='pt-4 border-t border-gray-700'>
                <Link href={`/app/blog/${post._id}`} className='w-full'>
                  <Button className='w-full bg-pink-700 text-white hover:bg-pink-800'>
                    Read More
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  };

  // Render list view
  const renderListView = () => {
    return (
      <div className='space-y-4'>
        {paginatedPosts.map((post, index) => (
          <motion.div
            key={post._id || index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card className='bg-gray-800 border-gray-700 overflow-hidden hover:border-pink-500/50 transition-all duration-300'>
              <div className='flex flex-col md:flex-row'>
                {post.featuredImage && (
                  <div className='relative w-full md:w-48 h-48 md:h-auto overflow-hidden'>
                    <img
                      src={post.featuredImage || '/placeholder.svg'}
                      alt={post.title}
                      className='w-full h-full object-cover'
                    />
                    {post.status === 'draft' && (
                      <Badge className='absolute top-2 right-2 bg-yellow-600'>
                        Draft
                      </Badge>
                    )}
                  </div>
                )}

                <div className='flex-1 flex flex-col p-4'>
                  <div className='flex gap-2 mb-2'>
                    {post.categories?.map((category) => (
                      <Badge
                        key={category}
                        variant='outline'
                        className='bg-pink-900/20 text-pink-400 border-pink-500/30'
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>

                  <h3 className='text-xl font-semibold text-gray-100 mb-2'>
                    {post.title}
                  </h3>
                  <p className='text-gray-300 line-clamp-2 mb-4'>
                    {post.excerpt}
                  </p>

                  <div className='flex flex-wrap justify-between text-sm text-gray-400 mt-auto'>
                    <div className='flex items-center space-x-4 mb-2 md:mb-0'>
                      <span className='flex items-center'>
                        <Calendar className='w-4 h-4 mr-1 text-gray-500' />{' '}
                        {formatDate(post.date)}
                      </span>
                      <span className='flex items-center'>
                        <User className='w-4 h-4 mr-1 text-gray-500' />{' '}
                        {post.author.name}
                      </span>
                    </div>

                    <div className='flex items-center space-x-4'>
                      <span className='flex items-center'>
                        <Eye className='w-4 h-4 mr-1 text-gray-500' />{' '}
                        {post.views}
                      </span>
                      <span className='flex items-center'>
                        <ThumbsUp className='w-4 h-4 mr-1 text-gray-500' />{' '}
                        {post.likes}
                      </span>
                      <span className='flex items-center'>
                        <Clock className='w-4 h-4 mr-1 text-gray-500' />{' '}
                        {getReadingTime(post.content)} min
                      </span>
                    </div>
                  </div>

                  <div className='mt-4'>
                    <Link href={`/app/blog/${post._id}`}>
                      <Button className='bg-pink-700 text-white hover:bg-pink-800'>
                        Read More
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
        <div>
          <h1 className='text-3xl font-bold text-gray-100'>Blog Posts</h1>
          <p className='text-gray-400 mt-1'>
            Manage and explore your published content
          </p>
        </div>

        <Link href='/app/blog/create'>
          <Button className='bg-pink-700 text-white hover:bg-pink-800'>
            <Plus className='mr-2 h-4 w-4' /> Create New Post
          </Button>
        </Link>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 mb-6'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4' />
          <Input
            placeholder='Search posts by title or content'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='pl-10 bg-gray-800 border-gray-700 text-gray-300'
          />
        </div>

        <div className='flex flex-wrap gap-2'>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className='w-[180px] bg-gray-800 border-gray-700 text-gray-300'>
              <Tag className='mr-2 h-4 w-4 text-gray-500' />
              <SelectValue placeholder='Filter by category' />
            </SelectTrigger>
            <SelectContent className='bg-gray-800 border-gray-700 text-gray-300'>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className='w-[180px] bg-gray-800 border-gray-700 text-gray-300'>
              <ArrowUpDown className='mr-2 h-4 w-4 text-gray-500' />
              <SelectValue placeholder='Sort by' />
            </SelectTrigger>
            <SelectContent className='bg-gray-800 border-gray-700 text-gray-300'>
              <SelectItem value='newest'>Newest First</SelectItem>
              <SelectItem value='oldest'>Oldest First</SelectItem>
              <SelectItem value='popular'>Most Viewed</SelectItem>
              <SelectItem value='mostLiked'>Most Liked</SelectItem>
            </SelectContent>
          </Select>

          <Tabs
            value={viewMode}
            onValueChange={setViewMode}
            className='hidden md:block'
          >
            <TabsList className='bg-gray-800'>
              <TabsTrigger
                value='grid'
                className='data-[state=active]:bg-gray-700'
              >
                <svg
                  className='h-4 w-4'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'
                  />
                </svg>
              </TabsTrigger>
              <TabsTrigger
                value='list'
                className='data-[state=active]:bg-gray-700'
              >
                <svg
                  className='h-4 w-4'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M4 6h16M4 12h16M4 18h16'
                  />
                </svg>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Results summary */}
      {!loading && !error && (
        <div className='text-sm text-gray-400 mb-6'>
          Showing{' '}
          {filteredAndSortedPosts.length > 0
            ? `1-${Math.min(paginatedPosts.length, ITEMS_PER_PAGE)} of ${
                filteredAndSortedPosts.length
              }`
            : '0'}{' '}
          posts
          {categoryFilter !== 'all' && ` in "${categoryFilter}"`}
          {search && ` matching "${search}"`}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {renderSkeletons()}
        </div>
      )}

      {/* Error state */}
      {error && (
        <Alert
          variant='destructive'
          className='bg-red-900/20 border-red-800 text-red-200 mb-6'
        >
          <AlertCircle className='h-4 w-4' />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <Button
            variant='outline'
            className='mt-4 border-red-800 text-red-200 hover:bg-red-800/20'
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </Alert>
      )}

      {/* Empty state */}
      {!loading && !error && filteredAndSortedPosts.length === 0 && (
        <Card className='bg-gray-800 border-gray-700 text-center p-8'>
          <div className='flex flex-col items-center justify-center py-12'>
            <div className='rounded-full bg-gray-700/50 p-4 mb-4'>
              <FileText className='h-12 w-12 text-gray-400' />
            </div>
            <h3 className='text-xl font-medium text-gray-300 mb-2'>
              No posts found
            </h3>
            <p className='text-gray-400 max-w-md mx-auto mb-6'>
              {search || categoryFilter !== 'all'
                ? 'No posts match your current search criteria. Try adjusting your filters.'
                : "You haven't created any blog posts yet. Start sharing your thoughts with the world!"}
            </p>
            {search || categoryFilter !== 'all' ? (
              <Button
                variant='outline'
                className='border-gray-700 text-gray-300 hover:bg-gray-700'
                onClick={() => {
                  setSearch('');
                  setCategoryFilter('all');
                }}
              >
                Clear Filters
              </Button>
            ) : (
              <Link href='/app/blog/create'>
                <Button className='bg-pink-700 text-white hover:bg-pink-800'>
                  <Plus className='mr-2 h-4 w-4' /> Create Your First Post
                </Button>
              </Link>
            )}
          </div>
        </Card>
      )}

      {/* Content */}
      {!loading && !error && filteredAndSortedPosts.length > 0 && (
        <>
          {viewMode === 'grid' ? renderGridView() : renderListView()}
          {renderPagination()}
        </>
      )}
    </div>
  );
}

// Helper function to generate sample posts for demo purposes
function generateSamplePosts() {
  return [
    {
      id: '1',
      title: 'Getting Started with Food Drives: A Comprehensive Guide',
      excerpt:
        'Learn how to organize effective food drives in your community with this step-by-step guide covering planning, execution, and distribution.',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      featuredImage: '/placeholder.svg?key=enyt9',
      date: '2023-11-15',
      views: 1245,
      likes: 89,
      categories: ['Guides', 'Community'],
      author: { name: 'Jane Smith', avatar: '/diverse-group.png' },
      status: 'published',
    },
    {
      id: '2',
      title: 'Impact Stories: How Your Donations Change Lives',
      excerpt:
        'Real stories from real people whose lives have been transformed through the generosity of food drive donations and community support.',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      featuredImage: '/placeholder.svg?key=y4z6m',
      date: '2023-12-03',
      views: 876,
      likes: 124,
      categories: ['Stories', 'Impact'],
      author: { name: 'Jane Smith', avatar: '/diverse-group.png' },
      status: 'published',
    },
    {
      id: '3',
      title: 'Sustainable Food Distribution: Best Practices',
      excerpt:
        'Discover environmentally friendly approaches to food collection, storage, and distribution that minimize waste and maximize impact.',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      featuredImage: '/placeholder.svg?key=0zr0b',
      date: '2024-01-18',
      views: 543,
      likes: 67,
      categories: ['Sustainability', 'Tips'],
      author: { name: 'Jane Smith', avatar: '/diverse-group.png' },
      status: 'published',
    },
    {
      id: '4',
      title: 'Fundraising Strategies for Food Drives',
      excerpt:
        'Effective methods to raise funds for your food drive initiatives, from corporate partnerships to community events and digital campaigns.',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      featuredImage: '/placeholder.svg?key=0k1tz',
      date: '2024-02-05',
      views: 921,
      likes: 103,
      categories: ['Fundraising', 'Strategy'],
      author: { name: 'Jane Smith', avatar: '/diverse-group.png' },
      status: 'draft',
    },
    {
      id: '5',
      title: 'Volunteer Management for Food Distribution Events',
      excerpt:
        'Learn how to recruit, train, and coordinate volunteers effectively to ensure smooth operations during food distribution events.',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      featuredImage: '/placeholder.svg?key=rsgt7',
      date: '2024-02-22',
      views: 412,
      likes: 56,
      categories: ['Management', 'Volunteers'],
      author: { name: 'Jane Smith', avatar: '/diverse-group.png' },
      status: 'published',
    },
    {
      id: '6',
      title: 'Technology Solutions for Food Drive Coordination',
      excerpt:
        'Explore digital tools and platforms that can streamline the planning, promotion, and execution of food drives and donation campaigns.',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      featuredImage:
        '/placeholder.svg?height=400&width=600&query=technology+solutions',
      date: '2024-03-10',
      views: 678,
      likes: 82,
      categories: ['Technology', 'Tools'],
      author: { name: 'Jane Smith', avatar: '/diverse-group.png' },
      status: 'published',
    },
    {
      id: '7',
      title: 'Nutrition Education: Complementing Food Assistance',
      excerpt:
        'Why nutrition education is a crucial component of food assistance programs and how to implement effective educational initiatives.',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      featuredImage:
        '/placeholder.svg?height=400&width=600&query=nutrition+education',
      date: '2024-03-25',
      views: 325,
      likes: 41,
      categories: ['Education', 'Nutrition'],
      author: { name: 'Jane Smith', avatar: '/diverse-group.png' },
      status: 'draft',
    },
  ];
}
