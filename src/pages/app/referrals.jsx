import { useState } from 'react';
import { DashboardCard } from '@/components/ui/app-card';
import { StatCard } from '@/components/ui/stat-card';
import { Graph } from '@/components/ui/graph';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, MousePointer, DollarSign } from 'lucide-react';
const referralData = [
  { name: 'Jan', value: 10 },
  { name: 'Feb', value: 15 },
  { name: 'Mar', value: 8 },
  { name: 'Apr', value: 22 },
  { name: 'May', value: 18 },
  { name: 'Jun', value: 30 },
];
export default function Referrals() {
  const [referralLink] = useState('https://inaethe.com/ref/user123');
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(referralLink)
      .then(() => alert('Referral link copied to clipboard!'))
      .catch((err) => console.error('Failed to copy text: ', err));
  };
  return (
    <div>
      <h1 className='text-3xl font-bold mb-6 text-gray-100'>
        Referral Management
      </h1>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
        <StatCard
          title='Total Clicks'
          value='1,234'
          icon={<MousePointer className='h-4 w-4 text-pink-700' />}
        />
        <StatCard
          title='Successful Signups'
          value='56'
          icon={<Users className='h-4 w-4 text-pink-700' />}
        />
        <StatCard
          title='Earned Commissions'
          value='$789'
          icon={<DollarSign className='h-4 w-4 text-pink-700' />}
        />
      </div>
      <DashboardCard title='Your Referral Link'>
        <div className='flex gap-2'>
          <Input
            value={referralLink}
            readOnly
            className='bg-gray-900 border-gray-700 text-gray-300'
          />
          <Button
            onClick={copyToClipboard}
            className='bg-pink-700 text-white hover:bg-pink-800'
          >
            Copy
          </Button>
        </div>
      </DashboardCard>
      <div className='mt-6'>
        <DashboardCard title='Referral Activity'>
          <Graph
            data={referralData}
            dataKey='value'
            title='Monthly Referrals'
          />
        </DashboardCard>
      </div>
    </div>
  );
}
