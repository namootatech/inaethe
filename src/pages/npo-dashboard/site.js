import { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Alert, AlertDescription, AlertTitle } from '@/components//ui/Alert';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components//ui/Tabs';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { CheckCircle, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

// Format seconds into a minutes:seconds string
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function DeploymentStatusPage() {
  const searchParams = useSearchParams();
  const orgId = searchParams.get('orgId');
  const domain = searchParams.get('domain');

  const liveTestUrl = `https://${domain}/.netlify/functions/isLive`;
  const previewTestUrl = `https://${orgId}-inaethe-za.netlify.app/.netlify/functions/isLive`;
  const previewDomain = `${orgId}-inaethe-za.netlify.app`;

  const [liveStatus, setLiveStatus] = useState('pending');
  const [previewStatus, setPreviewStatus] = useState('pending');
  const [liveProgress, setLiveProgress] = useState(0);
  const [previewProgress, setPreviewProgress] = useState(0);
  const [liveError, setLiveError] = useState(null);
  const [previewError, setPreviewError] = useState(null);
  const [liveElapsedTime, setLiveElapsedTime] = useState(0);
  const [previewElapsedTime, setPreviewElapsedTime] = useState(0);
  const [activeTab, setActiveTab] = useState('live');

  // Function to check if the live site is up
  const checkLiveStatus = useCallback(async () => {
    try {
      const response = await fetch(liveTestUrl);
      const data = await response.json();

      if (data.isLive) {
        setLiveStatus('live');
        return true;
      } else {
        setLiveStatus('deploying');
        return false;
      }
    } catch (err) {
      console.error('Error checking live site status:', err);
      setLiveError('Live site is not available yet. Please check back later.');
      setLiveStatus('error');
      return false;
    }
  }, [liveTestUrl]);

  // Function to check if the preview site is up
  const checkPreviewStatus = useCallback(async () => {
    try {
      const response = await fetch(previewTestUrl);
      const data = await response.json();

      if (data.isLive) {
        setPreviewStatus('live');
        return true;
      } else {
        setPreviewStatus('deploying');
        return false;
      }
    } catch (err) {
      console.error('Error checking preview site status:', err);
      setPreviewError(
        'Preview site is not available yet. Please check back later.'
      );
      setPreviewStatus('error');
      return false;
    }
  }, [previewTestUrl]);

  // Initialize the check and set up intervals
  useEffect(() => {
    let liveIntervalId = null;
    let previewIntervalId = null;
    let liveTimeoutId = null;
    let previewTimeoutId = null;

    const liveStartTime = Date.now();
    const previewStartTime = Date.now();

    // Function to check live status
    const checkLive = async () => {
      const isLive = await checkLiveStatus();

      if (isLive && liveIntervalId) {
        clearInterval(liveIntervalId);
        liveIntervalId = null;
      }
    };

    // Function to check preview status
    const checkPreview = async () => {
      const isPreviewLive = await checkPreviewStatus();

      if (isPreviewLive && previewIntervalId) {
        clearInterval(previewIntervalId);
        previewIntervalId = null;
      }
    };

    // Initial checks
    checkLive();
    checkPreview();

    // Set up interval for checking live status
    liveIntervalId = setInterval(() => {
      checkLive();

      // Update elapsed time
      setLiveElapsedTime(Math.floor((Date.now() - liveStartTime) / 1000));

      // Increment progress for visual feedback
      setLiveProgress((prev) => {
        // Cap progress at 95% until site is actually live
        if (prev < 95) {
          return prev + (100 - prev) * 0.05;
        }
        return prev;
      });
    }, 5000);

    // Set up interval for checking preview status
    previewIntervalId = setInterval(() => {
      checkPreview();

      // Update elapsed time
      setPreviewElapsedTime(Math.floor((Date.now() - previewStartTime) / 1000));

      // Increment progress for visual feedback
      setPreviewProgress((prev) => {
        // Cap progress at 95% until site is actually live
        if (prev < 95) {
          return prev + (100 - prev) * 0.05;
        }
        return prev;
      });
    }, 5000);

    // Set timeout to handle very long deployments
    liveTimeoutId = setTimeout(() => {
      if (liveStatus !== 'live') {
        setLiveError(
          'Live deployment is taking longer than expected. It may still be in progress.'
        );
      }
    }, 180000); // 3 minutes

    previewTimeoutId = setTimeout(() => {
      if (previewStatus !== 'live') {
        setPreviewError(
          'Preview deployment is taking longer than expected. It may still be in progress.'
        );
      }
    }, 180000); // 3 minutes

    // Cleanup on unmount
    return () => {
      if (liveIntervalId) clearInterval(liveIntervalId);
      if (previewIntervalId) clearInterval(previewIntervalId);
      if (liveTimeoutId) clearTimeout(liveTimeoutId);
      if (previewTimeoutId) clearTimeout(previewTimeoutId);
    };
  }, [checkLiveStatus, checkPreviewStatus, liveStatus, previewStatus]);

  // Set progress to 100% when sites are live
  useEffect(() => {
    if (liveStatus === 'live') {
      setLiveProgress(100);
    }
    if (previewStatus === 'live') {
      setPreviewProgress(100);
    }
  }, [liveStatus, previewStatus]);

  // Handle manual refresh
  const handleRefresh = () => {
    if (activeTab === 'live') {
      checkLiveStatus();
    } else {
      checkPreviewStatus();
    }
  };

  // Handle visit site
  const handleVisitSite = () => {
    if (activeTab === 'live') {
      window.open(`https://${domain}`, '_blank');
    } else {
      window.open(`https://${previewDomain}`, '_blank');
    }
  };

  // Render deployment status component
  const renderDeploymentStatus = (
    status,
    progress,
    error,
    elapsedTime,
    url
  ) => (
    <div className='space-y-6'>
      {error && (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className='space-y-2'>
        <div className='flex justify-between items-center'>
          <span className='text-sm text-gray-500'>Deployment Progress</span>
          <span className='text-sm font-medium'>{Math.round(progress)}%</span>
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
            <p className='text-sm text-gray-500'>
              {status === 'live'
                ? `Deployment completed in ${formatTime(elapsedTime)}`
                : `Elapsed time: ${formatTime(elapsedTime)}`}
            </p>
          </div>
        </div>

        <div className='rounded-md bg-gray-100 p-4'>
          <p className='text-sm font-medium'>Website URL:</p>
          <p className='text-sm font-mono mt-1 break-all'>https://{url}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className='container mx-auto py-12 px-4'>
      <Card className='max-w-2xl mx-auto'>
        <CardHeader>
          <CardTitle className='text-2xl'>
            {activeTab === 'live'
              ? liveStatus === 'live'
                ? 'Live Deployment Complete!'
                : 'Deploying Your Live Website'
              : previewStatus === 'live'
              ? 'Preview Deployment Complete!'
              : 'Deploying Your Preview Website'}
          </CardTitle>
          <CardDescription>{orgId} website is being prepared</CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className='mb-6'>
            <TabsList className='grid w-full grid-cols-2 bg-gray-400'>
              <TabsTrigger value='live' className='text-black'>
                Live Site
              </TabsTrigger>
              <TabsTrigger value='preview' className='text-black'>
                Preview Site
              </TabsTrigger>
            </TabsList>
            <TabsContent value='live'>
              {renderDeploymentStatus(
                liveStatus,
                liveProgress,
                liveError,
                liveElapsedTime,
                domain
              )}
            </TabsContent>
            <TabsContent value='preview'>
              {renderDeploymentStatus(
                previewStatus,
                previewProgress,
                previewError,
                previewElapsedTime,
                previewDomain
              )}
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className='flex justify-between'>
          {(activeTab === 'live' && liveStatus === 'live') ||
          (activeTab === 'preview' && previewStatus === 'live') ? (
            <Button onClick={handleVisitSite} className='w-full'>
              Visit {activeTab === 'live' ? 'Live' : 'Preview'} Website{' '}
              <ExternalLink className='ml-2 h-4 w-4' />
            </Button>
          ) : (
            <>
              <Button variant='outline' onClick={handleRefresh}>
                Check Status
              </Button>
              <p className='text-sm text-gray-500'>
                Auto-refreshing every 5 seconds
              </p>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

export default DeploymentStatusPage;
