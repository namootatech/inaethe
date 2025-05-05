'use client';

import { useEffect, useState, useCallback } from 'react';
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
  RefreshCw,
  AlertCircle,
  ChevronRight,
  BarChart2,
  Percent,
  UserPlus,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useApi } from '@/context/ApiContext';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';

// Custom styled stat card component
const StyledStatCard = ({
  title,
  value,
  change,
  trend,
  icon,
  color = 'blue',
}) => {
  const gradientMap = {
    blue: 'from-blue-500 to-indigo-600',
    green: 'from-emerald-500 to-green-600',
    purple: 'from-purple-500 to-violet-600',
    pink: 'from-pink-500 to-rose-600',
    amber: 'from-amber-500 to-yellow-600',
  };

  const gradient = gradientMap[color] || gradientMap.blue;

  const trendIcon =
    trend === 'up' ? (
      <span className='flex items-center text-emerald-500'>
        <svg
          className='w-3 h-3 mr-1'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M12 4L20 12L16 12L16 20L8 20L8 12L4 12L12 4Z'
            fill='currentColor'
          />
        </svg>
        {change}
      </span>
    ) : trend === 'down' ? (
      <span className='flex items-center text-rose-500'>
        <svg
          className='w-3 h-3 mr-1'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M12 20L4 12L8 12L8 4L16 4L16 12L20 12L12 20Z'
            fill='currentColor'
          />
        </svg>
        {change}
      </span>
    ) : (
      <span className='flex items-center text-gray-500 dark:text-gray-400'>
        {change}
      </span>
    );

  return (
    <Card className='overflow-hidden border-0 shadow-lg'>
      <div className={`h-2 bg-gradient-to-r ${gradient}`}></div>
      <CardContent className='p-6'>
        <div className='flex justify-between items-start'>
          <div>
            <p className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-1'>
              {title}
            </p>
            <h3 className='text-2xl font-bold text-gray-900 dark:text-white'>
              {value}
            </h3>
            <div className='mt-1 text-xs'>{trendIcon}</div>
          </div>
          <div
            className={`p-3 rounded-full bg-gradient-to-br ${gradient} text-white`}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Dashboard() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeframe, setTimeframe] = useState('month');
  const { partner } = useAuth();
  const api = useApi();

  const fetchPartnerTransactions = useCallback(async () => {
    try {
      const response = await api.getPartnerTransactions(partner?.partner?.slug);
      if (response) {
        setTransactions(response.data || []);
      }
      return response;
    } catch (error) {
      console.error('Error fetching partner transactions:', error);
      setError('Failed to load transaction data. Please try again.');
      return null;
    }
  }, [api, partner]);

  const fetchPartnerSubscriptions = useCallback(async () => {
    try {
      const response = await api.getPartnerSubscriptions(partner?.partner?._id);
      if (response) {
        setSubscriptions(response.data || []);
      }
      return response;
    } catch (error) {
      console.error('Error fetching partner subscriptions:', error);
      setError('Failed to load subscription data. Please try again.');
      return null;
    }
  }, [api, partner]);

  const loadDashboardData = useCallback(async () => {
    if (!partner?.partner) return;

    setIsLoading(true);
    setError(null);

    try {
      await Promise.all([
        fetchPartnerTransactions(),
        fetchPartnerSubscriptions(),
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [partner, fetchPartnerTransactions, fetchPartnerSubscriptions]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadDashboardData();
    setIsRefreshing(false);
  };

  // Calculate metrics
  const totalContributions = transactions.reduce(
    (total, transaction) => total + Number.parseFloat(transaction.amount || 0),
    0
  );

  const activeSubscriptions = subscriptions.filter(
    (sub) => sub.status === 'active'
  ).length;

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Monthly recurring revenue
  const monthlyRecurring = transactions
    .filter((t) => {
      const transactionDate = new Date(t.createdAt);
      return (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      );
    })
    .reduce((total, t) => total + Number.parseFloat(t.amount || 0), 0);

  // Previous month data for comparison
  const previousMonthTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.createdAt);
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    return (
      transactionDate.getMonth() === prevMonth &&
      transactionDate.getFullYear() === prevYear
    );
  });

  const previousMonthTotal = previousMonthTransactions.reduce(
    (total, t) => total + Number.parseFloat(t.amount || 0),
    0
  );

  // Calculate month-over-month growth
  const growthRate =
    previousMonthTotal > 0
      ? (
          ((monthlyRecurring - previousMonthTotal) / previousMonthTotal) *
          100
        ).toFixed(1)
      : 100;

  // New subscribers this month
  const newSubscribersThisMonth = subscriptions.filter((sub) => {
    const subDate = new Date(sub.createdDate);
    return (
      subDate.getMonth() === currentMonth &&
      subDate.getFullYear() === currentYear
    );
  }).length;

  // Prepare graph data
  const getTimeframeData = () => {
    const now = new Date();
    let filteredTransactions = [];

    switch (timeframe) {
      case 'week':
        // Last 7 days
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        filteredTransactions = transactions.filter(
          (t) => new Date(t.createdAt) >= weekAgo
        );
        break;
      case 'month':
        // Current month
        filteredTransactions = transactions.filter((t) => {
          const date = new Date(t.createdAt);
          return (
            date.getMonth() === currentMonth &&
            date.getFullYear() === currentYear
          );
        });
        break;
      case 'year':
        // Current year
        filteredTransactions = transactions.filter((t) => {
          const date = new Date(t.createdAt);
          return date.getFullYear() === currentYear;
        });
        break;
      default:
        filteredTransactions = transactions;
    }

    return filteredTransactions;
  };

  const timeframeTransactions = getTimeframeData();

  // Group transactions by date for the graph
  const graphData = timeframeTransactions.reduce((acc, transaction) => {
    const date = new Date(transaction.createdAt);
    let dateKey;

    if (timeframe === 'week') {
      dateKey = formatDate(date, 'MMM dd');
    } else if (timeframe === 'month') {
      dateKey = formatDate(date, 'dd');
    } else {
      dateKey = formatDate(date, 'MMM');
    }

    if (!acc[dateKey]) {
      acc[dateKey] = 0;
    }
    acc[dateKey] += Number.parseFloat(transaction.amount || 0);
    return acc;
  }, {});

  const transactionsData = Object.keys(graphData).map((date) => ({
    name: date,
    value: graphData[date],
  }));

  // Sort transactions by date (newest first)
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Calculate subscription tiers distribution
  const tierDistribution = subscriptions.reduce((acc, sub) => {
    const tier = sub.subscriptionTier || 'Other';
    if (!acc[tier]) {
      acc[tier] = 0;
    }
    acc[tier]++;
    return acc;
  }, {});

  // Convert to percentage
  const totalSubs = subscriptions.length || 1;
  const tierPercentages = Object.entries(tierDistribution)
    .map(([tier, count]) => ({
      tier,
      count,
      percentage: Math.round((count / totalSubs) * 100),
    }))
    .sort((a, b) => b.count - a.count);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-4 md:p-8'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8'>
          <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
            <div>
              <div className='flex items-center gap-2 mb-2'>
                <div className='h-10 w-10 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 flex items-center justify-center text-white'>
                  <Sparkles className='h-5 w-5' />
                </div>
                <h1 className='text-2xl md:text-3xl font-bold text-gray-900 dark:text-white'>
                  {partner?.partner?.organizationName || 'Organization'}{' '}
                  Dashboard
                </h1>
              </div>
              <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600 dark:text-gray-300'>
                <span className='flex items-center'>
                  <FileText className='h-4 w-4 mr-1 text-pink-500' />
                  Reg: {partner?.partner?.registrationNumber || 'N/A'}
                </span>
                <span className='flex items-center'>
                  <Users className='h-4 w-4 mr-1 text-pink-500' />
                  Rep: {partner?.partner?.representativeName || 'N/A'}
                </span>
              </div>
            </div>
            <div className='flex gap-2 mt-4 md:mt-0'>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant='outline'
                      size='icon'
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                      aria-label='Refresh dashboard data'
                      className='border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                    >
                      <RefreshCw
                        className={`h-4 w-4 ${
                          isRefreshing ? 'animate-spin' : ''
                        }`}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Refresh dashboard data</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Link href='/npo-dashboard/site-config'>
                <Button className='bg-gradient-to-r from-pink-500 to-rose-600 text-white hover:opacity-90 shadow-md'>
                  Create Website
                </Button>
              </Link>
              <Link href='/npo-dashboard/earnings' className='w-full'>
                <Button className='w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:opacity-90 shadow-md'>
                  <TrendingUp className='mr-2 h-4 w-4' /> Check Earnings
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {error && (
          <Alert
            variant='destructive'
            className='mb-6 border-0 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
          >
            <AlertCircle className='h-4 w-4' />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className='mb-6'>
          <TabsList className='grid w-full grid-cols-2 md:w-auto md:inline-flex bg-white dark:bg-gray-800 p-1 rounded-xl shadow-md'>
            <TabsTrigger
              value='overview'
              className='rounded-lg px-6 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-600 data-[state=active]:text-white'
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value='subscriptions'
              className='rounded-lg px-6 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-600 data-[state=active]:text-white'
            >
              Subscriptions
            </TabsTrigger>
          </TabsList>
          <TabsContent value='overview' className='space-y-8'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              <StyledStatCard
                title='Total Subscriptions'
                value={subscriptions.length}
                change={`${activeSubscriptions} active`}
                trend={activeSubscriptions > 0 ? 'up' : 'neutral'}
                icon={<Users className='h-5 w-5' />}
                color='blue'
              />
              <StyledStatCard
                title='Total Contributions'
                value={formatCurrency(totalContributions)}
                change={`${newSubscribersThisMonth} new this month`}
                trend={newSubscribersThisMonth > 0 ? 'up' : 'neutral'}
                icon={<DollarSign className='h-5 w-5' />}
                color='green'
              />
              <StyledStatCard
                title='Monthly Recurring'
                value={formatCurrency(monthlyRecurring)}
                change={`${growthRate}% from last month`}
                trend={
                  growthRate > 0 ? 'up' : growthRate < 0 ? 'down' : 'neutral'
                }
                icon={<Calendar className='h-5 w-5' />}
                color='purple'
              />
              <StyledStatCard
                title='Avg. Contribution'
                value={
                  transactions.length
                    ? formatCurrency(totalContributions / transactions.length)
                    : formatCurrency(0)
                }
                change='Per transaction'
                trend='neutral'
                icon={<CreditCard className='h-5 w-5' />}
                color='pink'
              />
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              <Card className='lg:col-span-2 border-0 shadow-xl bg-white dark:bg-gray-800'>
                <CardHeader className='flex flex-row items-center justify-between pb-2'>
                  <div>
                    <CardTitle className='text-gray-800 dark:text-gray-200'>
                      Revenue Overview
                    </CardTitle>
                    <CardDescription>
                      Contribution trends over time
                    </CardDescription>
                  </div>
                  <div className='flex gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg'>
                    <Button
                      variant={timeframe === 'week' ? 'default' : 'ghost'}
                      size='sm'
                      onClick={() => setTimeframe('week')}
                      className={
                        timeframe === 'week' ? 'bg-pink-500 text-white' : ''
                      }
                    >
                      Week
                    </Button>
                    <Button
                      variant={timeframe === 'month' ? 'default' : 'ghost'}
                      size='sm'
                      onClick={() => setTimeframe('month')}
                      className={
                        timeframe === 'month' ? 'bg-pink-500 text-white' : ''
                      }
                    >
                      Month
                    </Button>
                    <Button
                      variant={timeframe === 'year' ? 'default' : 'ghost'}
                      size='sm'
                      onClick={() => setTimeframe('year')}
                      className={
                        timeframe === 'year' ? 'bg-pink-500 text-white' : ''
                      }
                    >
                      Year
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='h-[300px]'>
                    {transactionsData.length > 0 ? (
                      <div className='h-full'>
                        {/* This is a placeholder for the Graph component */}
                        <div className='h-full bg-gradient-to-b from-pink-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-lg flex items-center justify-center'>
                          <div className='text-center'>
                            <BarChart2 className='h-12 w-12 mx-auto mb-2 text-pink-500 opacity-50' />
                            <p className='text-gray-500 dark:text-gray-400'>
                              Graph visualization will appear here
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className='h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 rounded-lg'>
                        <BarChart2 className='h-12 w-12 mb-2 opacity-20' />
                        <p>No data available for the selected timeframe</p>
                        <Button
                          variant='link'
                          size='sm'
                          onClick={() => setTimeframe('year')}
                          className='text-pink-500'
                        >
                          View yearly data instead
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className='border-0 shadow-xl bg-white dark:bg-gray-800'>
                <CardHeader>
                  <CardTitle className='text-gray-800 dark:text-gray-200 flex items-center'>
                    <CreditCard className='h-5 w-5 mr-2 text-pink-500' />
                    Recent Transactions
                  </CardTitle>
                  <CardDescription>
                    Latest contribution activity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    {recentTransactions.length > 0 ? (
                      recentTransactions.map((transaction, i) => (
                        <div
                          key={transaction._id || i}
                          className='flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3 last:border-0 last:pb-0'
                        >
                          <div className='flex items-center'>
                            <div className='rounded-full bg-gradient-to-br from-pink-500 to-rose-600 p-2 mr-3 text-white'>
                              <CreditCard className='h-4 w-4' />
                            </div>
                            <div>
                              <p className='font-medium text-gray-800 dark:text-gray-200'>
                                {transaction.firstName && transaction.lastName
                                  ? `${transaction.firstName} ${transaction.lastName}`
                                  : 'Anonymous Donor'}
                              </p>
                              <div className='flex items-center text-xs text-gray-600 dark:text-gray-400'>
                                <Clock className='h-3 w-3 mr-1' />
                                {formatDate(new Date(transaction.createdAt))}
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className='font-semibold text-gray-800 dark:text-gray-200 text-right'>
                              {formatCurrency(
                                Number.parseFloat(transaction.amount || 0)
                              )}
                            </div>
                            <Badge
                              variant='outline'
                              className='text-xs bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/20 dark:text-pink-300 dark:border-pink-800'
                            >
                              {transaction.subscriptionTier || 'One-time'}
                            </Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className='text-gray-700 dark:text-gray-400 text-center py-8 bg-gray-50 dark:bg-gray-900/50 rounded-lg'>
                        <CreditCard className='h-8 w-8 mx-auto mb-2 opacity-20' />
                        <p>No recent transactions</p>
                      </div>
                    )}
                  </div>
                </CardContent>
                {recentTransactions.length > 0 && (
                  <CardFooter className='pt-0'>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='ml-auto text-pink-600 hover:text-pink-700 hover:bg-pink-50 dark:text-pink-400 dark:hover:bg-pink-900/20'
                    >
                      View all transactions{' '}
                      <ChevronRight className='h-4 w-4 ml-1' />
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'>
              {/* <Link href='/app/subscriptions' className='w-full'>
                <Button className='w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:opacity-90 shadow-md'>
                  <Users className='mr-2 h-4 w-4' /> Manage Subscriptions
                </Button>
              </Link> */}

              {/* <Link href='/app/blog/create' className='w-full'>
                <Button className='w-full bg-gradient-to-r from-purple-500 to-violet-600 text-white hover:opacity-90 shadow-md'>
                  <BookOpen className='mr-2 h-4 w-4' /> Create Blog Post
                </Button>
              </Link>
              <Link href='/app/analytics' className='w-full'>
                <Button className='w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white hover:opacity-90 shadow-md'>
                  <ArrowUpRight className='mr-2 h-4 w-4' /> View Analytics
                </Button>
              </Link> */}
            </div>
          </TabsContent>

          <TabsContent value='subscriptions' className='space-y-8'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <Card className='border-0 shadow-xl bg-white dark:bg-gray-800'>
                <CardHeader>
                  <CardTitle className='text-gray-800 dark:text-gray-200 flex items-center'>
                    <Percent className='h-5 w-5 mr-2 text-pink-500' />
                    Subscription Tiers
                  </CardTitle>
                  <CardDescription>
                    Distribution of subscription levels
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {tierPercentages.length > 0 ? (
                    <div className='space-y-4'>
                      {tierPercentages.slice(0, 5).map((item, i) => (
                        <div key={i} className='space-y-1'>
                          <div className='flex justify-between text-sm'>
                            <span className='font-medium text-gray-700 dark:text-gray-300'>
                              {item.tier}
                            </span>
                            <div className='flex items-center'>
                              <span className='text-gray-600 dark:text-gray-400 mr-2'>
                                {item.count}
                              </span>
                              <Badge className='bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300'>
                                {item.percentage}%
                              </Badge>
                            </div>
                          </div>
                          <Progress
                            value={item.percentage}
                            className='h-2 bg-gray-100 dark:bg-gray-700'
                          >
                            <div
                              className='h-full bg-gradient-to-r from-pink-500 to-rose-600 rounded-full'
                              style={{ width: `${item.percentage}%` }}
                            />
                          </Progress>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className='text-gray-700 dark:text-gray-400 text-center py-8 bg-gray-50 dark:bg-gray-900/50 rounded-lg'>
                      <Percent className='h-8 w-8 mx-auto mb-2 opacity-20' />
                      <p>No subscription data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className='border-0 shadow-xl bg-white dark:bg-gray-800'>
                <CardHeader>
                  <CardTitle className='text-gray-800 dark:text-gray-200 flex items-center'>
                    <UserPlus className='h-5 w-5 mr-2 text-pink-500' />
                    Subscriber Growth
                  </CardTitle>
                  <CardDescription>New subscribers over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='h-[200px] flex items-center justify-center text-gray-500 bg-gray-50 dark:bg-gray-900/50 rounded-lg'>
                    <div className='text-center'>
                      <UserPlus className='h-8 w-8 mx-auto mb-2 opacity-20' />
                      <p>Growth chart coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className='border-0 shadow-xl bg-white dark:bg-gray-800'>
              <CardHeader>
                <CardTitle className='text-gray-800 dark:text-gray-200 flex items-center'>
                  <Users className='h-5 w-5 mr-2 text-pink-500' />
                  Active Subscriptions
                </CardTitle>
                <CardDescription>Currently active subscribers</CardDescription>
              </CardHeader>
              <CardContent>
                {activeSubscriptions > 0 ? (
                  <div className='overflow-x-auto'>
                    <table className='w-full text-sm'>
                      <thead>
                        <tr className='border-b border-gray-200 dark:border-gray-700'>
                          <th className='text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300'>
                            Subscriber
                          </th>
                          <th className='text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300'>
                            Tier
                          </th>
                          <th className='text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300'>
                            Amount
                          </th>
                          <th className='text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300'>
                            Start Date
                          </th>
                          <th className='text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300'>
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {subscriptions
                          .filter((sub) => sub.status === 'active')
                          .slice(0, 5)
                          .map((sub, i) => (
                            <tr
                              key={sub._id || i}
                              className='border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                            >
                              <td className='py-4 px-4'>
                                <div className='font-medium text-gray-800 dark:text-gray-200'>
                                  {sub.firstName} {sub.lastName}
                                </div>
                                <div className='text-xs text-gray-500'>
                                  {sub.email}
                                </div>
                              </td>
                              <td className='py-4 px-4'>
                                <Badge className='bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300'>
                                  {sub.subscriptionTier}
                                </Badge>
                              </td>
                              <td className='py-4 px-4'>
                                {formatCurrency(Number(sub.amount))}
                              </td>
                              <td className='py-4 px-4'>
                                {formatDate(new Date(sub.createdDate))}
                              </td>
                              <td className='py-4 px-4'>
                                <Badge className='bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'>
                                  Active
                                </Badge>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className='text-gray-700 dark:text-gray-400 text-center py-8 bg-gray-50 dark:bg-gray-900/50 rounded-lg'>
                    <Users className='h-8 w-8 mx-auto mb-2 opacity-20' />
                    <p>No active subscriptions</p>
                  </div>
                )}
              </CardContent>
              {activeSubscriptions > 5 && (
                <CardFooter className='pt-0'>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='ml-auto text-pink-600 hover:text-pink-700 hover:bg-pink-50 dark:text-pink-400 dark:hover:bg-pink-900/20'
                  >
                    View all subscribers{' '}
                    <ChevronRight className='h-4 w-4 ml-1' />
                  </Button>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-4 md:p-8'>
      <div className='max-w-7xl mx-auto'>
        {/* Header Skeleton */}
        <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8'>
          <div className='flex flex-col md:flex-row justify-between items-start md:items-center'>
            <div>
              <div className='flex items-center gap-2 mb-2'>
                <Skeleton className='h-10 w-10 rounded-full' />
                <Skeleton className='h-8 w-64' />
              </div>
              <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4'>
                <Skeleton className='h-4 w-32' />
                <Skeleton className='h-4 w-32' />
              </div>
            </div>
            <div className='flex gap-2 mt-4 md:mt-0'>
              <Skeleton className='h-10 w-10 rounded-md' />
              <Skeleton className='h-10 w-36 rounded-md' />
            </div>
          </div>
        </div>

        {/* Tabs Skeleton */}
        <Skeleton className='h-12 w-64 rounded-xl mb-8' />

        {/* Stats Skeleton */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className='bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden'
              >
                <div className='h-2 bg-gray-200 dark:bg-gray-700'></div>
                <div className='p-6'>
                  <div className='flex justify-between items-start'>
                    <div>
                      <Skeleton className='h-4 w-24 mb-2' />
                      <Skeleton className='h-8 w-20 mb-2' />
                      <Skeleton className='h-3 w-16' />
                    </div>
                    <Skeleton className='h-12 w-12 rounded-full' />
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Charts Skeleton */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8'>
          <div className='lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6'>
            <div className='flex justify-between items-center mb-4'>
              <div>
                <Skeleton className='h-6 w-40 mb-2' />
                <Skeleton className='h-4 w-32' />
              </div>
              <Skeleton className='h-10 w-32 rounded-lg' />
            </div>
            <Skeleton className='h-[300px] w-full rounded-lg' />
          </div>

          <div className='bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6'>
            <div className='mb-4'>
              <Skeleton className='h-6 w-40 mb-2' />
              <Skeleton className='h-4 w-32' />
            </div>
            <div className='space-y-4'>
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className='flex items-center justify-between pb-3'
                  >
                    <div className='flex items-center'>
                      <Skeleton className='h-10 w-10 rounded-full mr-3' />
                      <div>
                        <Skeleton className='h-4 w-32 mb-1' />
                        <Skeleton className='h-3 w-24' />
                      </div>
                    </div>
                    <div>
                      <Skeleton className='h-4 w-16 mb-1' />
                      <Skeleton className='h-4 w-12' />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Action Buttons Skeleton */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'>
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className='h-10 w-full rounded-lg' />
            ))}
        </div>
      </div>
    </div>
  );
}
