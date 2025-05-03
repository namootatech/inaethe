// import { useEffect, useState } from 'react';
// import { DashboardCard } from '@/components/ui/app-card';
// import { StatCard } from '@/components/ui/stat-card';
// import { Graph } from '@/components/ui/graph';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Users, MousePointer, DollarSign } from 'lucide-react';
// import { useAuth } from '@/context/AuthContext';
// import { useApi } from '@/context/ApiContext';
// import ShortUniqueId from 'short-unique-id';
// import { id } from 'date-fns/locale';
// import { toast } from 'react-hot-toast';
// import { set } from 'ramda';

// const uid = new ShortUniqueId({ length: 8 });

// const referralData = [
//   { name: 'Jan', value: 10 },
//   { name: 'Feb', value: 15 },
//   { name: 'Mar', value: 8 },
//   { name: 'Apr', value: 22 },
//   { name: 'May', value: 18 },
//   { name: 'Jun', value: 30 },
// ];

// export default function Referrals() {
//   const [affiliateSubscriptions, setAffSubs] = useState([]);
//   const [affiliateTransactions, setAffTrans] = useState([]);
//   const [affiliates, setAffs] = useState([]);
//   const [userLinkId, setUserLinkId] = useState(uid.rnd());
//   const [referralLink, setReferralLink] = useState('');
//   const [loading, setLoading] = useState(true);
//   const { user } = useAuth();
//   const api = useApi();

//   useEffect(() => {
//     if (user) {
//       console.log('user is', user);
//       const {
//         affiliateSubscriptions,
//         affiliateTransactions,
//         affiliates,
//         subscriptions,
//         transactions,
//       } = user;
//       setAffSubs(affiliateSubscriptions);
//       setAffTrans(affiliateTransactions);
//       setAffs(affiliates);
//     }
//   }, [user]);

//   useEffect(() => {
//     if (user) {
//       const { _id } = user.user;
//       api
//         .getUserReferralLink(_id)
//         .then((res) => {
//           if (res.data) {
//             console.log('ref link', res.data);
//             setReferralLink(res.data);
//             setLoading(false);
//           } else {
//             const newLinkId = uid.rnd();
//             const newReferralLink = `https://inaethe.com/ref/${newLinkId}`;
//             const link = {
//               id: newLinkId,
//               link: newReferralLink,
//               userId: _id,
//               visits: 0,
//             };
//             api
//               .createReferralLink(link)
//               .then((res) => {
//                 console.log('new ref link', res.data);
//                 setReferralLink(res.data);
//                 setLoading(false);
//               })
//               .catch((err) => {
//                 console.error('Failed to create affiliate link: ', err);
//                 toast.error('Failed to create affiliate link');
//               });
//           }
//         })
//         .catch((err) => {
//           console.error('Failed to get affiliate link: ', err);
//           toast.error(`Failed to get affiliate link ${err}`);
//         });
//     }
//   }, [user]);

//   const copyToClipboard = () => {
//     navigator.clipboard
//       .writeText(referralLink)
//       .then(() => alert('Referral link copied to clipboard!'))
//       .catch((err) => console.error('Failed to copy text: ', err));
//   };

//   return (
//     <div>
//       <h1 className='text-3xl font-bold mb-6 text-gray-100'>
//         Referral Management
//       </h1>
//       <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
//         <StatCard
//           title='Total Clicks'
//           value={referralLink?.visits}
//           icon={<MousePointer className='h-4 w-4 text-pink-700' />}
//         />
//         <StatCard
//           title='Successful Signups'
//           value={affiliates?.length}
//           icon={<Users className='h-4 w-4 text-pink-700' />}
//         />
//         <StatCard
//           title='Affiliate Subscriptions'
//           value={affiliateSubscriptions?.length}
//           icon={<DollarSign className='h-4 w-4 text-pink-700' />}
//         />
//       </div>
//       <DashboardCard title='Your Referral Link'>
//         <div className='flex gap-2'>
//           <Input
//             value={loading ? 'Loading...' : referralLink?.link}
//             readOnly
//             className='bg-gray-900 border-gray-700 text-gray-300'
//           />
//           <Button
//             onClick={copyToClipboard}
//             className='bg-pink-700 text-white hover:bg-pink-800'
//           >
//             Copy
//           </Button>
//         </div>
//       </DashboardCard>
//       <div className='mt-6'>
//         <DashboardCard title='Referral Activity'>
//           <Graph
//             data={referralData}
//             dataKey='value'
//             title='Monthly Referrals'
//           />
//         </DashboardCard>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import { DashboardCard } from '@/components/ui/app-card';
import { StatCard } from '@/components/ui/stat-card';
import { Graph } from '@/components/ui/graph';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, MousePointer, DollarSign } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useApi } from '@/context/ApiContext';
import ShortUniqueId from 'short-unique-id';
import { toast } from 'react-hot-toast';

const uid = new ShortUniqueId({ length: 8 });

// Default data as fallback
const defaultReferralData = [
  { name: 'Jan', value: 0 },
  { name: 'Feb', value: 0 },
  { name: 'Mar', value: 0 },
  { name: 'Apr', value: 0 },
  { name: 'May', value: 0 },
  { name: 'Jun', value: 0 },
  { name: 'Jul', value: 0 },
  { name: 'Aug', value: 0 },
  { name: 'Sep', value: 0 },
  { name: 'Oct', value: 0 },
  { name: 'Nov', value: 0 },
  { name: 'Dec', value: 0 },
];

export default function Referrals() {
  const [affiliateSubscriptions, setAffSubs] = useState([]);
  const [affiliateTransactions, setAffTrans] = useState([]);
  const [affiliates, setAffs] = useState([]);
  const [userLinkId, setUserLinkId] = useState(uid.rnd());
  const [referralLink, setReferralLink] = useState(null);
  const [graphData, setGraphData] = useState(defaultReferralData);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const api = useApi();

  // Process referral data for the graph
  const processReferralData = () => {
    if (!affiliates || affiliates.length === 0) {
      return defaultReferralData;
    }

    // Group affiliates by month
    const monthlyData = {};
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    affiliates.forEach((affiliate) => {
      if (affiliate.createdAt) {
        const date = new Date(affiliate.createdAt);
        const month = months[date.getMonth()];

        if (!monthlyData[month]) {
          monthlyData[month] = 0;
        }
        monthlyData[month]++;
      }
    });

    // Convert to array format for the graph
    return months.map((month) => ({
      name: month,
      value: monthlyData[month] || 0,
    }));
  };

  useEffect(() => {
    if (user) {
      console.log('user is', user);
      const { affiliateSubscriptions, affiliateTransactions, affiliates } =
        user;

      setAffSubs(affiliateSubscriptions || []);
      setAffTrans(affiliateTransactions || []);
      setAffs(affiliates || []);

      // Process data for the graph
      setGraphData(processReferralData());
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const { _id } = user.user;
      api
        .getUserReferralLink(_id)
        .then((res) => {
          if (res.data) {
            console.log('ref link', res.data);
            setReferralLink(res.data);
            setLoading(false);
          } else {
            const newLinkId = uid.rnd();
            const newReferralLink = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/ref/${newLinkId}`;
            const link = {
              id: newLinkId,
              link: newReferralLink,
              userId: _id,
              visits: 0,
            };
            api
              .createReferralLink(link)
              .then((res) => {
                console.log('new ref link', res.data);
                setReferralLink(res.data);
                setLoading(false);
              })
              .catch((err) => {
                console.error('Failed to create affiliate link: ', err);
                toast.error('Failed to create affiliate link');
                setLoading(false);
              });
          }
        })
        .catch((err) => {
          console.error('Failed to get affiliate link: ', err);
          toast.error(`Failed to get affiliate link ${err}`);
          setLoading(false);
        });
    }
  }, [user]);

  const copyToClipboard = () => {
    if (referralLink && referralLink.link) {
      navigator.clipboard
        .writeText(referralLink.link)
        .then(() => toast.success('Referral link copied to clipboard!'))
        .catch((err) => {
          console.error('Failed to copy text: ', err);
          toast.error('Failed to copy link to clipboard');
        });
    } else {
      toast.error('No referral link available to copy');
    }
  };

  return (
    <div>
      <h1 className='text-3xl font-bold mb-6 text-gray-100'>
        Referral Management
      </h1>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
        <StatCard
          title='Total Clicks'
          value={referralLink?.visits || 0}
          icon={<MousePointer className='h-4 w-4 text-pink-700' />}
        />
        <StatCard
          title='Successful Signups'
          value={affiliates?.length || 0}
          icon={<Users className='h-4 w-4 text-pink-700' />}
        />
        <StatCard
          title='Affiliate Subscriptions'
          value={affiliateSubscriptions?.length || 0}
          icon={<DollarSign className='h-4 w-4 text-pink-700' />}
        />
      </div>
      <DashboardCard title='Your Referral Link'>
        <div className='flex gap-2'>
          <Input
            value={
              loading ? 'Loading...' : referralLink?.link || 'No link available'
            }
            readOnly
            className='bg-gray-900 border-gray-700 text-gray-300'
          />
          <Button
            onClick={copyToClipboard}
            className='bg-pink-700 text-white hover:bg-pink-800'
            disabled={loading || !referralLink?.link}
          >
            Copy
          </Button>
        </div>
      </DashboardCard>
      <div className='mt-6'>
        <DashboardCard title='Referral Activity'>
          <Graph data={graphData} dataKey='value' title='Monthly Referrals' />
        </DashboardCard>
      </div>
    </div>
  );
}
