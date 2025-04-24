import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
const Site = () => {
  const [isLive, setIsLive] = useState(false);
  const searchParams = useSearchParams();
  const domain = searchParams.get('domain');
  const orgId = searchParams.get('orgId');
  const liveTestUrl = `${domain}/.netlify/functions/isLive`;

  const checkLiveStatus = async () => {
    const response = await fetch(liveTestUrl);
    const data = await response.json();
    setIsLive(data.isLive);
  };
  // Check if the site is live every 5 seconds
  // until it is live
  const interval = setInterval(() => {
    checkLiveStatus();
    if (isLive) {
      clearInterval(interval);
    }
  }, 5000);

  // Check if the site is live on component mount
  useEffect(() => {
    checkLiveStatus();
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='container max-auto p-20 flex justify-center items-center prose'>
      <h1>Deploying! {orgId} website!</h1>
      <p>Please wait....</p>
      <p> Your site will be live at {domain}</p>
    </div>
  );
};

export default Site;
