'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  MusicIcon,
  Heart,
  MessageCircle,
  Share2,
  Clock,
  Tag,
  Mail,
  Eye,
  BarChart2,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { DiscussionEmbed } from 'disqus-react';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
} from 'react-share';
import { FacebookIcon, TwitterIcon, LinkedinIcon } from 'react-share';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { useApi } from '@/context/ApiContext';

export default function BlogPostClient() {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showSignupPopup, setShowSignupPopup] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [post, setPost] = useState(null);
  const [viewTracked, setViewTracked] = useState(false);

  const router = useRouter();

  const { user } = useAuth();
  const api = useApi();

  useEffect(() => {
    fetchPost(router.query.id);
    fetchComments(router.query.id);

    // Only set the URL in the browser environment
    if (typeof window !== 'undefined') {
      setCurrentUrl(
        window.location.href || `https://inaethe.co.za/app/blog/${post._id}`
      );
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [router]);

  // Track view when component mounts - but only in the browser
  useEffect(() => {
    if (typeof window !== 'undefined' && router.query.id && !viewTracked) {
      trackView();
      setViewTracked(true);
    }
  }, [post, router, viewTracked]);

  // Track view
  const trackView = async () => {
    if (post?._id) {
      await api.updateBlogPost(post._id, { views: post.views + 1 });
    }
  };

  // Track share
  const trackShare = async (platform) => {
    await api.updateBlogPost(post._id, { shares: post.shares + 1 });
  };

  const handleScroll = () => {
    if (typeof window === 'undefined') return;

    const scrollPercentage =
      (window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight)) *
      100;
    if (scrollPercentage > 50 && !user && !showSignupPopup) {
      setShowSignupPopup(true);
    }
  };

  async function fetchComments(postId) {
    if (postId) {
      api.getBlogPostComments(postId).then((response) => {
        const comments = response.data;
        setComments(comments || []);
      });
    }
  }

  async function fetchPost(postId) {
    if (postId) {
      api.getBlogPostContent(postId).then((response) => {
        const p = response.data;
        setPost(p);
      });
    }
  }

  async function handleLike() {
    await api.updateBlogPost(post._id, { likes: post.likes + 1 }, post._id);
  }

  async function handleComment(e) {
    e.preventDefault();
    if (!user) {
      toast('Please log in to comment');
      return;
    }

    if (!newComment.trim()) return;

    await api.addBlogPostComment({
      postId: post._id,
      user: {
        id: user.user._id,
        name: user.user.firstName + ' ' + user.user.lastName,
      },
      content: newComment,
    });

    if (error) {
      toast('Failed to post comment');
    } else if (data) {
      setComments([...comments, data]);
      setNewComment('');
    }
  }

  const estimatedReadingTime = () => {
    const wordsPerMinute = 200;
    const wordCount = post.content.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
  };

  const copyLinkToClipboard = () => {
    if (typeof window === 'undefined') return;

    navigator.clipboard.writeText(currentUrl);
    toast('The link has been copied to your clipboard.');

    // Track share
    trackShare();
  };

  const handleEmailShare = () => {
    if (typeof window === 'undefined') return;

    window.location.href = `mailto:?subject=${encodeURIComponent(
      post.title
    )}&body=${encodeURIComponent(currentUrl)}`;

    // Track share
    trackShare();
  };

  // Enhanced share handlers for social media
  const handleFacebookShare = () => {
    trackShare();
  };

  const handleTwitterShare = () => {
    trackShare();
  };

  const handleLinkedInShare = () => {
    trackShare();
  };

  // Format large numbers
  const formatNumber = (num = 0) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (!post) {
    return (
      <div className='min-h-screen bg-black flex items-center justify-center px-4'>
        <div className='text-center'>
          <MusicIcon className='h-12 w-12 text-red-600 mx-auto mb-6' />
          <h1 className='text-4xl font-bold text-white mb-4'>
            We cant find this blog post
          </h1>
          <p className='text-zinc-400 mb-8 max-w-md mx-auto'>
            The post you're looking for doesn't exist or has been moved.
          </p>
          <Button asChild>
            <Link href='/blog'>Back to blog</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen'>
      <article className='max-w-4xl mx-auto px-4'>
        {/* Featured Image */}
        {post.featuredImage && (
          <div
            className='w-full h-[500px] rounded-xl bg-cover bg-center mb-12 shadow-2xl'
            style={{ backgroundImage: `url(${post.featuredImage})` }}
          />
        )}

        {/* Title and Meta */}
        <header className='mb-12 text-center'>
          <h1 className='text-5xl md:text-6xl font-bold text-white mb-8 leading-tight'>
            {post.title}
          </h1>

          <div className='flex items-center justify-center mb-8'>
            <div className='flex items-center'>
              <div>
                <p className='text-white font-medium text-lg'>
                  {post.author?.name || 'Anonymous'}
                </p>
                <p className='text-zinc-400'>
                  {new Date(post.createdAt).toLocaleDateString('en-ZA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>

          {post.excerpt && (
            <p className='text-xl text-zinc-400 max-w-2xl mx-auto mb-6'>
              {post.excerpt}
            </p>
          )}

          <div className='flex flex-wrap items-center justify-center gap-4 mb-8'>
            <div className='flex items-center text-zinc-400'>
              <Clock className='w-5 h-5 mr-2' />
              <span>{estimatedReadingTime()} min read</span>
            </div>

            {/* View Counter */}
            <div className='flex items-center text-zinc-400'>
              <Eye className='w-5 h-5 mr-2' />
              <span>{formatNumber(post.views)} views</span>
            </div>

            {/* Share Counter */}
            <div className='flex items-center text-zinc-400'>
              <Share2 className='w-5 h-5 mr-2' />
              <span>{formatNumber(post.shares)} shares</span>
            </div>

            <div className='flex items-center text-zinc-400'>
              <Tag className='w-5 h-5 mr-2' />
              <span>{post?.tags?.join(', ') || 'Uncategorized'}</span>
            </div>
          </div>

          <div className='flex justify-center space-x-4'>
            <FacebookShareButton
              url={currentUrl}
              quote={post.title}
              onClick={handleFacebookShare}
            >
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            <TwitterShareButton
              url={currentUrl}
              title={post.title}
              onClick={handleTwitterShare}
            >
              <TwitterIcon size={32} round />
            </TwitterShareButton>
            <LinkedinShareButton url={currentUrl} onClick={handleLinkedInShare}>
              <LinkedinIcon size={32} round />
            </LinkedinShareButton>
            <Button onClick={copyLinkToClipboard} variant='outline' size='icon'>
              <Share2 className='h-4 w-4' />
            </Button>
            <Button onClick={handleEmailShare} variant='outline' size='icon'>
              <Mail className='h-4 w-4' />
            </Button>
          </div>
        </header>

        {/* Media Section */}
        {(post.youtube_url || post.audio_url) && (
          <div className='mb-12 bg-zinc-900 rounded-xl p-6'>
            {post.youtube_url && (
              <div className='aspect-video mb-6'>
                <iframe
                  src={`https://www.youtube.com/embed/${getYoutubeVideoId(
                    post.youtube_url
                  )}`}
                  className='w-full h-full rounded-lg'
                  allowFullScreen
                />
              </div>
            )}
            {post.audio_url && (
              <div className='bg-zinc-800 p-4 rounded-lg'>
                <audio controls className='w-full'>
                  <source src={post.audio_url} type='audio/mpeg' />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className='prose prose-invert prose-lg max-w-none mb-16'>
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className='text-4xl font-bold mt-12 mb-6'>{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className='text-3xl font-bold mt-10 mb-5'>{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className='text-2xl font-bold mt-8 mb-4'>{children}</h3>
              ),
              p: ({ children }) => (
                <p className='text-lg leading-relaxed mb-6 text-zinc-300'>
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className='list-disc pl-6 mb-6 space-y-2'>{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className='list-decimal pl-6 mb-6 space-y-2'>{children}</ol>
              ),
              li: ({ children }) => (
                <li className='text-zinc-300'>{children}</li>
              ),
              blockquote: ({ children }) => (
                <blockquote className='border-l-4 border-red-600 pl-4 italic my-6 text-zinc-400'>
                  {children}
                </blockquote>
              ),
              code: ({ children }) => (
                <code className='bg-zinc-800 text-zinc-300 px-2 py-1 rounded'>
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className='bg-zinc-800 p-4 rounded-lg overflow-x-auto mb-6'>
                  {children}
                </pre>
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Post Stats Card */}
        <div className='bg-zinc-900 rounded-xl p-6 mb-12'>
          <h3 className='text-xl font-bold text-white mb-4 flex items-center'>
            <BarChart2 className='h-5 w-5 mr-2 text-red-500' />
            Post Statistics
          </h3>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <div className='bg-zinc-800 p-4 rounded-lg text-center'>
              <p className='text-zinc-400 text-sm mb-1'>Views</p>
              <p className='text-white text-2xl font-bold'>
                {formatNumber(post.views)}
              </p>
            </div>
            <div className='bg-zinc-800 p-4 rounded-lg text-center'>
              <p className='text-zinc-400 text-sm mb-1'>Shares</p>
              <p className='text-white text-2xl font-bold'>
                {formatNumber(post.shares)}
              </p>
            </div>
            <div className='bg-zinc-800 p-4 rounded-lg text-center'>
              <p className='text-zinc-400 text-sm mb-1'>Likes</p>
              <p className='text-white text-2xl font-bold'>
                {formatNumber(post.likes)}
              </p>
            </div>
            <div className='bg-zinc-800 p-4 rounded-lg text-center'>
              <p className='text-zinc-400 text-sm mb-1'>Comments</p>
              <p className='text-white text-2xl font-bold'>
                {formatNumber(post.comments)}
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className='bg-red-600 rounded-xl p-8 mb-12 text-center'>
          <h3 className='text-2xl font-bold text-white mb-4'>
            Enjoy this post?
          </h3>
          <p className='text-white mb-6'>
            Sign up for our newsletter to get more great content!
          </p>
          <Button asChild className='bg-white text-red-600 hover:bg-zinc-200'>
            <Link href='/register'>Sign Up Now</Link>
          </Button>
        </div>

        {/* Related Articles */}

        {/* Likes and Comments Section */}
        <div className='border-t border-zinc-800 pt-12 mb-12'>
          <div className='flex items-center space-x-6 mb-8'>
            <Button
              variant='ghost'
              size='lg'
              onClick={handleLike}
              className={`hover:bg-zinc-800`}
            >
              <Heart className='h-6 w-6 mr-2' />
              {post.likes} {post.likes === 1 ? 'Like' : 'Likes'}
            </Button>
            <Button variant='ghost' size='lg' className='hover:bg-zinc-800'>
              <MessageCircle className='h-6 w-6 mr-2' />
              {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
            </Button>
          </div>

          {/* Disqus Comments - Only render on client side */}
          {typeof window !== 'undefined' && (
            <DiscussionEmbed
              shortname='espazza'
              config={{
                url: currentUrl,
                identifier: post._id,
                title: post.title,
              }}
            />
          )}
        </div>
      </article>

      {/* Sign-up Popup */}
      <AnimatePresence>
        {showSignupPopup && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className='fixed bottom-4 right-4 bg-red-600 text-white p-6 rounded-xl shadow-lg'
          >
            <h3 className='text-xl font-bold mb-2'>Enjoying the content?</h3>
            <p className='mb-4'>
              Sign up now to get more great articles like this!
            </p>
            <div className='flex space-x-4'>
              <Button
                asChild
                className='bg-white text-red-600 hover:bg-zinc-200'
              >
                <Link href='/register'>Sign Up</Link>
              </Button>
              <Button
                variant='outline'
                onClick={() => setShowSignupPopup(false)}
              >
                Maybe Later
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
