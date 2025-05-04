'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import {
  Eye,
  ThumbsUp,
  Search,
  Calendar,
  User,
  Clock,
  Tag,
  ArrowUpDown,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { useApi } from '@/context/ApiContext';
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
const ITEMS_PER_PAGE = 9;

export default function BlogListing() {
  const api = useApi();
  const [search, setSearch] = useState('');
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [sortBy, setSortBy] = useState('newest');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [categories, setCategories] = useState(['all']);

  // Fetch posts with pagination
  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      setError(null);
      try {
        // Call the API with pagination parameters
        const response = await api.getBlogPosts(currentPage, ITEMS_PER_PAGE);

        if (!response || !response.data) {
          throw new Error('Invalid response from server');
        }

        setPosts(response.data);
        setTotalPages(
          response.totalPages || Math.ceil(response.total / ITEMS_PER_PAGE) || 1
        );
        setTotalPosts(response.total || response.data.length);

        // Extract unique categories from posts
        if (response.data && response.data.length > 0) {
          const allCategories = response.data.flatMap(
            (post) => post.categories || []
          );
          const uniqueCategories = ['all', ...new Set(allCategories)];
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to load blog posts. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    if (!posts) {
      fetchPosts();
    }
  }, [currentPage]);

  // Filter posts by search term and category
  const filteredPosts = useMemo(() => {
    if (!posts) return [];

    return (
      posts?.filter((post) => {
        const matchesSearch =
          post.title.toLowerCase().includes(search.toLowerCase()) ||
          post.excerpt?.toLowerCase().includes(search.toLowerCase());

        const matchesCategory =
          categoryFilter === 'all' || post.categories?.includes(categoryFilter);

        return matchesSearch && matchesCategory;
      }) || []
    );
  }, [posts, search, categoryFilter]);

  // Sort posts
  const sortedPosts = useMemo(() => {
    return [...filteredPosts]?.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return (
            new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)
          );
        case 'oldest':
          return (
            new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt)
          );
        case 'popular':
          return (b.views || 0) - (a.views || 0);
        case 'mostLiked':
          return (b.likes || 0) - (a.likes || 0);
        default:
          return (
            new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)
          );
      }
    });
  }, [filteredPosts, sortBy]);

  // Handle page change
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Calculate reading time
  const getReadingTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content?.split(/\s+/).length || 0;
    return Math.ceil(wordCount / wordsPerMinute) || 3; // Default to 3 min if no content
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
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
              onClick={() => handlePageChange(currentPage - 1)}
              className={
                currentPage === 1 ? 'pointer-events-none opacity-50' : ''
              }
            />
          </PaginationItem>

          {Array.from({ length: totalPages }).map((_, i) => {
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
                    onClick={() => handlePageChange(pageNumber)}
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
              onClick={() => handlePageChange(currentPage + 1)}
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
    return Array(6)
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
        {sortedPosts.map((post, index) => (
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
                    src={
                      post.featuredImage ||
                      '/placeholder.svg?height=200&width=400&query=blog'
                    }
                    alt={post.title}
                    className='w-full h-full object-cover transition-transform duration-500 hover:scale-105'
                  />
                </div>
              )}

              <CardHeader className='pb-2'>
                <div className='flex flex-wrap gap-2 mb-2'>
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
                  {formatDate(post.date || post.createdAt)}
                </CardDescription>
              </CardHeader>

              <CardContent className='flex-grow'>
                <p className='text-gray-300 line-clamp-3 mb-4'>
                  {post.excerpt || post.content?.substring(0, 150) + '...'}
                </p>
                <div className='flex justify-between text-sm text-gray-400'>
                  <div className='flex items-center space-x-3'>
                    <span className='flex items-center'>
                      <Eye className='w-4 h-4 mr-1 text-gray-500' />{' '}
                      {post.views || 0}
                    </span>
                    <span className='flex items-center'>
                      <ThumbsUp className='w-4 h-4 mr-1 text-gray-500' />{' '}
                      {post.likes || 0}
                    </span>
                  </div>
                  <span className='flex items-center'>
                    <Clock className='w-4 h-4 mr-1 text-gray-500' />{' '}
                    {getReadingTime(post.content)} min read
                  </span>
                </div>
              </CardContent>

              <CardFooter className='pt-4 border-t border-gray-700'>
                <Link href={`/blog/${post._id}`} className='w-full'>
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
        {sortedPosts.map((post, index) => (
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
                      src={
                        post.featuredImage ||
                        '/placeholder.svg?height=200&width=200&query=blog'
                      }
                      alt={post.title}
                      className='w-full h-full object-cover'
                    />
                  </div>
                )}

                <div className='flex-1 flex flex-col p-4'>
                  <div className='flex flex-wrap gap-2 mb-2'>
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
                    {post.excerpt || post.content?.substring(0, 150) + '...'}
                  </p>

                  <div className='flex flex-wrap justify-between text-sm text-gray-400 mt-auto'>
                    <div className='flex items-center space-x-4 mb-2 md:mb-0'>
                      <span className='flex items-center'>
                        <Calendar className='w-4 h-4 mr-1 text-gray-500' />{' '}
                        {formatDate(post.date || post.createdAt)}
                      </span>
                      <span className='flex items-center'>
                        <User className='w-4 h-4 mr-1 text-gray-500' />{' '}
                        {post.author?.name || 'Unknown author'}
                      </span>
                    </div>

                    <div className='flex items-center space-x-4'>
                      <span className='flex items-center'>
                        <Eye className='w-4 h-4 mr-1 text-gray-500' />{' '}
                        {post.views || 0}
                      </span>
                      <span className='flex items-center'>
                        <ThumbsUp className='w-4 h-4 mr-1 text-gray-500' />{' '}
                        {post.likes || 0}
                      </span>
                      <span className='flex items-center'>
                        <Clock className='w-4 h-4 mr-1 text-gray-500' />{' '}
                        {getReadingTime(post.content)} min
                      </span>
                    </div>
                  </div>

                  <div className='mt-4'>
                    <Link href={`/blog/${post._id}`}>
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
    <div className='min-h-screen p-4 md:p-6 bg-gray-900'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
          <div>
            <h1 className='text-3xl font-bold text-gray-100'>Blog</h1>
            <p className='text-gray-400 mt-1'>
              Explore our latest articles and insights
            </p>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 mb-6'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4' />
            <Input
              placeholder='Search articles by title or content'
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
            {filteredPosts.length > 0
              ? `${(currentPage - 1) * ITEMS_PER_PAGE + 1}-${Math.min(
                  currentPage * ITEMS_PER_PAGE,
                  totalPosts
                )}`
              : '0'}{' '}
            of {totalPosts} articles
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
        {!loading && !error && filteredPosts.length === 0 && (
          <Card className='bg-gray-800 border-gray-700 text-center p-8'>
            <div className='flex flex-col items-center justify-center py-12'>
              <div className='rounded-full bg-gray-700/50 p-4 mb-4'>
                <FileText className='h-12 w-12 text-gray-400' />
              </div>
              <h3 className='text-xl font-medium text-gray-300 mb-2'>
                No articles found
              </h3>
              <p className='text-gray-400 max-w-md mx-auto mb-6'>
                {search || categoryFilter !== 'all'
                  ? 'No articles match your current search criteria. Try adjusting your filters.'
                  : "We haven't published any articles yet. Check back soon!"}
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
              ) : null}
            </div>
          </Card>
        )}

        {/* Content */}
        {!loading && !error && filteredPosts.length > 0 && (
          <>
            {viewMode === 'grid' ? renderGridView() : renderListView()}
            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );
}
