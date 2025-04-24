'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  DollarSign,
  FileText,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  CreditCard,
  BookOpen,
} from 'lucide-react';

import { DashboardCard } from '@/components/ui/app-card';
import { StatCard } from '@/components/ui/stat-card';
import { Graph } from '@/components/ui/graph';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/utils';

export default function Dashboard() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { partner } = useAuth();

  useEffect(() => {
    if (partner) {
      try {
        const { subscriptions = [], transactions = [] } = partner;
        setSubscriptions(subscriptions);
        setTransactions(transactions);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [partner]);

  const totalContributions = transactions.reduce(
    (total, transaction) =>
      total + Number.parseFloat(transaction['amount_gross'] || 0),
    0
  );

  const activeSubscriptions = subscriptions.filter(
    (sub) => sub.status === 'active'
  ).length;
  const monthlyRecurring = transactions
    .filter(
      (t) => new Date(t['billing_date']).getMonth() === new Date().getMonth()
    )
    .reduce((total, t) => total + Number.parseFloat(t['amount_gross'] || 0), 0);

  const transactionsData = transactions.map((t) => ({
    name: t['billing_date'],
    value: Number.parseFloat(t['amount_gross'] || 0),
  }));

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b['billing_date']) - new Date(a['billing_date']))
    .slice(0, 5);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className='container mx-auto p-6'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
            Welcome back{partner?.name ? `, ${partner.name}` : ''}
          </h1>
          <p className='text-gray-600 dark:text-gray-300 mt-1'>
            Here's what's happening with your account today
          </p>
        </div>
        <div className='mt-4 md:mt-0'>
          <Link href='/npo-dashboard/site-config' className='w-full'>
            <Button className='bg-pink-500 text-white hover:bg-pink-800'>
              Create Website
            </Button>
          </Link>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        <StatCard
          title='Total Subscriptions'
          value={subscriptions.length}
          change={`${activeSubscriptions} active`}
          trend='up'
          icon={<Users className='h-5 w-5 text-primary' />}
        />
        <StatCard
          title='Total Contributions'
          value={formatCurrency(totalContributions)}
          change='+12% from last month'
          trend='up'
          icon={<DollarSign className='h-5 w-5 text-primary' />}
        />
        <StatCard
          title='Monthly Recurring'
          value={formatCurrency(monthlyRecurring)}
          change='Based on this month'
          trend='neutral'
          icon={<Calendar className='h-5 w-5 text-primary' />}
        />
        <StatCard
          title='Avg. Contribution'
          value={
            transactions.length
              ? formatCurrency(totalContributions / transactions.length)
              : 'R 0'
          }
          change='Per transaction'
          trend='up'
          icon={<CreditCard className='h-5 w-5 text-primary' />}
        />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
        <DashboardCard title='Revenue Overview'>
          <div className='h-[300px]'>
            <Graph
              data={transactionsData}
              dataKey='value'
              title='Contributions'
            />
          </div>
        </DashboardCard>

        <Card>
          <CardHeader>
            <CardTitle className='text-gray-800 dark:text-gray-200'>
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction, i) => (
                  <div
                    key={i}
                    className='flex items-center justify-between border-b pb-3 last:border-0'
                  >
                    <div className='flex items-center'>
                      <div className='rounded-full bg-primary/10 p-2 mr-3'>
                        <CreditCard className='h-4 w-4 text-primary' />
                      </div>
                      <div>
                        <p className='font-medium text-gray-800 dark:text-gray-200'>
                          {transaction.description || 'Subscription Payment'}
                        </p>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>
                          {new Date(
                            transaction['billing_date']
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className='font-semibold text-gray-800 dark:text-gray-200'>
                      {formatCurrency(
                        Number.parseFloat(transaction['amount_gross'] || 0)
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className='text-gray-700 dark:text-gray-400 text-center py-4'>
                  No recent transactions
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <Link href='/app/subscriptions' className='w-full'>
          <Button className='w-full bg-primary text-primary-foreground hover:bg-primary/90'>
            <Users className='mr-2 h-4 w-4' /> Manage Subscriptions
          </Button>
        </Link>
        <Link href='/app/earnings' className='w-full'>
          <Button className='w-full bg-primary text-primary-foreground hover:bg-primary/90'>
            <TrendingUp className='mr-2 h-4 w-4' /> Check Earnings
          </Button>
        </Link>
        <Link href='/app/blog/create' className='w-full'>
          <Button className='w-full bg-primary text-primary-foreground hover:bg-primary/90'>
            <BookOpen className='mr-2 h-4 w-4' /> Create Blog Post
          </Button>
        </Link>
        <Link href='/app/analytics' className='w-full'>
          <Button className='w-full bg-primary text-primary-foreground hover:bg-primary/90'>
            <ArrowUpRight className='mr-2 h-4 w-4' /> View Analytics
          </Button>
        </Link>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className='container mx-auto p-6'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8'>
        <div>
          <Skeleton className='h-8 w-64 mb-2' />
          <Skeleton className='h-4 w-48' />
        </div>
        <Skeleton className='h-10 w-36 mt-4 md:mt-0' />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Card key={i}>
              <CardHeader className='pb-2'>
                <Skeleton className='h-4 w-24' />
              </CardHeader>
              <CardContent>
                <Skeleton className='h-8 w-20 mb-2' />
                <Skeleton className='h-4 w-32' />
              </CardContent>
            </Card>
          ))}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
        <Card>
          <CardHeader>
            <Skeleton className='h-5 w-32' />
          </CardHeader>
          <CardContent>
            <Skeleton className='h-[300px] w-full' />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className='h-5 w-40' />
          </CardHeader>
          <CardContent>
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className='flex items-center justify-between mb-4'>
                  <div className='flex items-center'>
                    <Skeleton className='h-10 w-10 rounded-full mr-3' />
                    <div>
                      <Skeleton className='h-4 w-32 mb-2' />
                      <Skeleton className='h-3 w-24' />
                    </div>
                  </div>
                  <Skeleton className='h-4 w-16' />
                </div>
              ))}
          </CardContent>
        </Card>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className='h-10 w-full' />
          ))}
      </div>
    </div>
  );
}
