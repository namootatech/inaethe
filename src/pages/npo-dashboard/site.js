'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function DeploymentStatusPage() {
  const searchParams = useSearchParams();
  const domain = searchParams.get('domain') || 'example.com';
  const orgId = searchParams.get('orgId') || 'your-organization';
  const liveTestUrl = `https://${domain}/.netlify/functions/isLive`;

  const [status, setStatus] = useState();
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Function to check if the site is live
  const checkLiveStatus = useCallback(async () => {
    try {
      const response = await fetch(liveTestUrl);
      const data = await response.json();

      if (data.isLive) {
        setStatus('live');
        return true;
      } else {
        setStatus('deploying');
        return false;
      }
    } catch (err) {
      console.error('Error checking site status:', err);
      setError('Site is not live yet. Please check back later.');
      setStatus('error');
      return false;
    }
  }, [liveTestUrl]);

  // Initialize the check and set up interval
  useEffect(() => {
    let intervalId = null;
    let timeoutId = null;
    const startTime = Date.now();

    const checkStatus = async () => {
      const isLive = await checkLiveStatus();

      if (isLive && intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    // Initial check
    checkStatus();

    // Set up interval for checking status
    intervalId = setInterval(() => {
      checkStatus();

      // Update elapsed time
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));

      // Increment progress for visual feedback
      setProgress((prev) => {
        // Cap progress at 95% until site is actually live
        if (prev < 95) {
          return prev + (100 - prev) * 0.05;
        }
        return prev;
      });
    }, 5000);

    // Set timeout to handle very long deployments
    timeoutId = setTimeout(() => {
      if (status !== 'live') {
        setError(
          'Deployment is taking longer than expected. It may still be in progress.'
        );
      }
    }, 180000); // 3 minutes

    // Cleanup on unmount
    return () => {
      if (intervalId) clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [checkLiveStatus, status]);

  // Set progress to 100% when site is live
  useEffect(() => {
    if (status === 'live') {
      setProgress(100);
    }
  }, [status]);

  // Format elapsed time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Handle manual refresh
  const handleRefresh = () => {
    checkLiveStatus();
  };

  // Handle visit site
  const handleVisitSite = () => {
    window.open(`https://${domain}`, '_blank');
  };

  return (
    <div className='container mx-auto py-12 px-4'>
      <Card className='max-w-2xl mx-auto'>
        <CardHeader>
          <CardTitle className='text-2xl'>
            {status === 'live'
              ? 'Deployment Complete!'
              : 'Deploying Your Website'}
          </CardTitle>
          <CardDescription>
            {orgId} website is being prepared for {domain}
          </CardDescription>
        </CardHeader>

        <CardContent className='space-y-6'>
          {error && (
            <Alert variant='destructive'>
              <AlertCircle className='h-4 w-4' />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className='space-y-2'>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-muted-foreground'>
                Deployment Progress
              </span>
              <span className='text-sm font-medium'>
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className='h-2' />
          </div>

          <div className='space-y-4'>
            <div className='flex items-center gap-3'>
              {status === 'live' ? (
                <CheckCircle className='h-5 w-5 text-green-500' />
              ) : status === 'error' ? (
                <AlertCircle className='h-5 w-5 text-red-500' />
              ) : (
                <Loader2 className='h-5 w-5 animate-spin text-blue-500' />
              )}

              <div>
                <p className='font-medium'>
                  {status === 'live'
                    ? 'Your website is live!'
                    : status === 'error'
                    ? 'There was an issue with deployment'
                    : 'Building and deploying your website...'}
                </p>
                <p className='text-sm text-muted-foreground'>
                  {status === 'live'
                    ? `Deployment completed in ${formatTime(elapsedTime)}`
                    : `Elapsed time: ${formatTime(elapsedTime)}`}
                </p>
              </div>
            </div>

            <div className='rounded-md bg-muted p-4'>
              <p className='text-sm font-medium'>Website URL:</p>
              <p className='text-sm font-mono mt-1 break-all'>
                https://{domain}
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className='flex justify-between'>
          {status === 'live' ? (
            <Button onClick={handleVisitSite} className='w-full'>
              Visit Your Website <ExternalLink className='ml-2 h-4 w-4' />
            </Button>
          ) : (
            <>
              <Button variant='outline' onClick={handleRefresh}>
                Check Status
              </Button>
              <p className='text-sm text-muted-foreground'>
                Auto-refreshing every 5 seconds
              </p>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
