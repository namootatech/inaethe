import { DashboardCard } from '@/components/ui/app-card';
import { StatCard } from '@/components/ui/stat-card';
import { Graph } from '@/components/ui/graph';
import { Button } from '@/components/ui/button';
import { Users, DollarSign, FileText, TrendingUp } from 'lucide-react';
import Link from 'next/link';
const subscriptionData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 200 },
  { name: 'Apr', value: 278 },
  { name: 'May', value: 189 },
  { name: 'Jun', value: 239 },
];
const earningsData = [
  { name: 'Jan', value: 2400 },
  { name: 'Feb', value: 1398 },
  { name: 'Mar', value: 9800 },
  { name: 'Apr', value: 3908 },
  { name: 'May', value: 4800 },
  { name: 'Jun', value: 3800 },
];
export default function Dashboard() {
  return (
    <div>
      <h1 className='text-3xl font-bold mb-6 text-gray-100'>Dashboard</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6'>
        <StatCard
          title='Total Subscriptions'
          value='1,234'
          icon={<Users className='h-4 w-4 text-pink-700' />}
        />
        <StatCard
          title='Referral Earnings'
          value='$5,678'
          icon={<DollarSign className='h-4 w-4 text-pink-700' />}
        />
        <StatCard
          title='Blog Post Views'
          value='10,234'
          icon={<FileText className='h-4 w-4 text-pink-700' />}
        />
        <StatCard
          title='Total Contributions'
          value='$15,678'
          icon={<TrendingUp className='h-4 w-4 text-pink-700' />}
        />
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
        <DashboardCard title='Subscription Trend'>
          <Graph
            data={subscriptionData}
            dataKey='value'
            title='Monthly Subscriptions'
          />
        </DashboardCard>
        <DashboardCard title='Earnings Trend'>
          <Graph data={earningsData} dataKey='value' title='Monthly Earnings' />
        </DashboardCard>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <Link href='/app/subscriptions'>
          <Button className='w-full bg-pink-700 text-white hover:bg-pink-800'>
            Manage Subscriptions
          </Button>
        </Link>
        <Link href='/app/referrals'>
          <Button className='w-full bg-pink-700 text-white hover:bg-pink-800'>
            View Referrals
          </Button>
        </Link>
        <Link href='/app/earnings'>
          <Button className='w-full bg-pink-700 text-white hover:bg-pink-800'>
            Check Earnings
          </Button>
        </Link>
        <Link href='/app/blog/create'>
          <Button className='w-full bg-pink-700 text-white hover:bg-pink-800'>
            Create Blog Post
          </Button>
        </Link>
      </div>
    </div>
  );
}
