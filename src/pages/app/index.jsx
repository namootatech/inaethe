import { DashboardCard } from '@/components/ui/app-card';
import { StatCard } from '@/components/ui/stat-card';
import { Graph } from '@/components/ui/graph';
import { Button } from '@/components/ui/button';
import { Users, DollarSign, FileText, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { useApi } from '@/context/ApiContext';

export default function Dashboard() {
  const [affiliateSubscriptions, setAffSubs] = useState([]);
  const [affiliateTransactions, setAffTrans] = useState([]);
  const [affiliates, setAffs] = useState([]);
  const [subscriptions, setSubs] = useState([]);
  const [transactions, setTrans] = useState([]);
  const { user } = useAuth();

  const {
    getUserNetwork,
    getUserNetworkTransactions,
    getUserNetworkSubscriptions,
  } = useApi();
  const { getUserTransactions } = useApi();
  const { getUserSubscriptions } = useApi();

  const fetchUserTransactions = async () => {
    try {
      const response = await getUserTransactions(user.user._id);
      if (response) {
        setTrans(response.data);
      }
    } catch (error) {
      console.error('Error fetching user transactions:', error);
    }
  };

  const fetchUserSubscriptions = async () => {
    try {
      const response = await getUserSubscriptions(user.user._id);
      if (response) {
        setSubs(response.data);
      }
    } catch (error) {
      console.error('Error fetching user subscriptions:', error);
    }
  };

  const fetchUserNetwork = async () => {
    try {
      const response = await getUserNetwork(user.user._id);
      if (response) {
        setAffs(response.data);
      }
    } catch (error) {
      console.error('Error fetching user network:', error);
    }
  };

  const fetchUserNetworkTransactions = async () => {
    try {
      const response = await getUserNetworkTransactions(user.user._id);
      if (response) {
        setAffTrans(response.data);
      }
    } catch (error) {
      console.error('Error fetching user network transactions:', error);
    }
  };

  const fetchUserNetworkSubscriptions = async () => {
    try {
      const response = await getUserNetworkSubscriptions(user.user._id);
      if (response) {
        setAffSubs(response.data);
      }
    } catch (error) {
      console.error('Error fetching user network subscriptions:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserTransactions();
      fetchUserSubscriptions();
      fetchUserNetwork();
      fetchUserNetworkTransactions();
      fetchUserNetworkSubscriptions();
    }
  }, [user]);

  const totalContributions = transactions.reduce(
    (total, transaction) => total + parseFloat(transaction['amount']),
    0
  );
  const affiliateTransactionsTotal = affiliateTransactions.reduce(
    (total, transaction) => total + parseFloat(transaction['amount']),
    0
  );

  const transactionsData = transactions.map((t) => ({
    name: t['createdAt'],
    value: parseFloat(t['amount']),
  }));
  const affiliateTransactionsData = affiliateTransactions.map((t) => ({
    name: t['createdAt'],
    value: parseFloat(t['amount']),
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
