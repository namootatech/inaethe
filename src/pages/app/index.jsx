import { DashboardCard } from '@/components/ui/app-card';
import { StatCard } from '@/components/ui/stat-card';
import { Graph } from '@/components/ui/graph';
import { Button } from '@/components/ui/button';
import { Users, DollarSign, FileText, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
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
  const [affiliateSubscriptions, setAffSubs] = useState([]);
  const [affiliateTransactions, setAffTrans] = useState([]);
  const [affiliates, setAffs] = useState([]);
  const [subscriptions, setSubs] = useState([]);
  const [transactions, setTrans] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      console.log('user is', user);
      const {
        affiliateSubscriptions,
        affiliateTransactions,
        affiliates,
        subscriptions,
        transactions,
      } = user;
      setAffSubs(affiliateSubscriptions);
      setAffTrans(affiliateTransactions);
      setAffs(affiliates);
      setSubs(subscriptions);
      setTrans(transactions);
    }
  }, [user]);

  const totalContributions = transactions.reduce(
    (total, transaction) => total + parseFloat(transaction['amount_gross']),
    0
  );
  const affiliateTransactionsTotal = affiliateTransactions.reduce(
    (total, transaction) => total + parseFloat(transaction['amount_gross']),
    0
  );

  const transactionsData = transactions.map((t) => ({
    name: t['billing_date'],
    value: parseFloat(t['amount_gross']),
  }));
  const affiliateTransactionsData = affiliateTransactions.map((t) => ({
    name: t['billing_date'],
    value: parseFloat(t['amount_gross']),
  }));
  return (
    <div>
      <h1 className='text-3xl font-bold mb-6 text-gray-100'>Dashboard</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6'>
        <StatCard
          title='Total Subscriptions'
          value={subscriptions.length}
          icon={<Users className='h-4 w-4 text-pink-700' />}
        />
        <StatCard
          title='Referral Earnings'
          value={`R ${affiliateTransactionsTotal * 0.4}`}
          icon={<DollarSign className='h-4 w-4 text-pink-700' />}
        />
        <StatCard
          title='Subscriptions made by network'
          value={affiliateSubscriptions.length}
          icon={<FileText className='h-4 w-4 text-pink-700' />}
        />
        <StatCard
          title='Total Contributions'
          value={`R ${totalContributions}`}
          icon={<TrendingUp className='h-4 w-4 text-pink-700' />}
        />
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
        <DashboardCard title='Recent transactions'>
          <Graph data={transactionsData} dataKey='value' title='Transactions' />
        </DashboardCard>
        <DashboardCard title='Recent Network Trransactions'>
          <Graph
            data={affiliateTransactionsData}
            dataKey='value'
            title='Transaction by affiliates'
          />
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
