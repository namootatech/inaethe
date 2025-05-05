'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  DollarSign,
  ArrowUpRight,
  Calendar,
  Search,
  Download,
  Filter,
  AlertCircle,
  CheckCircle,
  Clock,
  CreditCard,
  Wallet,
  BarChart3,
  Loader2,
  Sparkles,
  RefreshCw,
  FileText,
  Users,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'react-toastify';
import moment from 'moment';
import { useAuth } from '@/context/AuthContext';
import { useApi } from '@/context/ApiContext';
import Link from 'next/link';
import ShortUniqueId from 'short-unique-id';

const uid = new ShortUniqueId({ length: 8 });

// Constants
const ITEMS_PER_PAGE = 5;
const WITHDRAWAL_MIN_AMOUNT = 50;
const WITHDRAWAL_MAX_AMOUNT = 10000;

// Status badges for withdrawal requests
const WithdrawalStatusBadge = ({ status }) => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return (
        <Badge className='bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'>
          Pending
        </Badge>
      );
    case 'approved':
      return (
        <Badge className='bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'>
          Approved
        </Badge>
      );
    case 'completed':
      return (
        <Badge className='bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'>
          Completed
        </Badge>
      );
    case 'rejected':
      return (
        <Badge className='bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'>
          Rejected
        </Badge>
      );
    default:
      return (
        <Badge className='bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'>
          Processing
        </Badge>
      );
  }
};

export default function EarningsTab() {
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalRequests, setWithdrawalRequests] = useState(null);
  const [transactions, setTransactions] = useState(null);
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [withdrawalError, setWithdrawalError] = useState('');
  const [withdrawalSuccess, setWithdrawalSuccess] = useState(false);
  const [withdrawalDialogOpen, setWithdrawalDialogOpen] = useState(false);
  const [processingWithdrawal, setProcessingWithdrawal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const { partner } = useAuth();
  const api = useApi();

  // Pagination state
  const [transactionsPage, setTransactionsPage] = useState(1);
  const [withdrawalsPage, setWithdrawalsPage] = useState(1);
  const [transactionsTotalPages, setTransactionsTotalPages] = useState(1);
  const [withdrawalsTotalPages, setWithdrawalsTotalPages] = useState(1);
  const [transactionsTotal, setTransactionsTotal] = useState(0);
  const [withdrawalsTotal, setWithdrawalsTotal] = useState(0);

  // Filters
  const [transactionDateFilter, setTransactionDateFilter] = useState('all');
  const [withdrawalStatusFilter, setWithdrawalStatusFilter] = useState('all');

  // Refs to track if initial fetches have been done
  const initialTransactionsFetchDone = useRef(false);
  const initialWithdrawalsFetchDone = useRef(false);
  const initialEarningsFetchDone = useRef(false);
  const isMounted = useRef(true);

  // Calculate summary statistics
  const totalEarnings =
    earnings?.reduce(
      (acc, curr) => acc + Number.parseFloat(curr.amount || 0),
      0
    ) || 0;

  const pendingWithdrawals =
    withdrawalRequests
      ?.filter((req) => req.status?.toLowerCase() === 'pending')
      ?.reduce((acc, curr) => acc + Number.parseFloat(curr.amount || 0), 0) ||
    0;

  const availableBalance = Math.max(0, totalEarnings - pendingWithdrawals);

  // Fetch transactions with pagination
  const fetchTransactions = useCallback(
    async (page = 1) => {
      if (!partner?.partner?._id || !api || !isMounted.current) return;
      console.log('Fetching transactions for page:', page);
      if (!partner?.partner?._id || !api || !isMounted.current) return;

      try {
        const response = await api.getPartnerTransactions(
          partner.partner.slug,
          page,
          ITEMS_PER_PAGE,
          transactionDateFilter !== 'all' ? transactionDateFilter : undefined
        );

        if (!isMounted.current) return;

        if (!response || !response.data) {
          throw new Error('Invalid response from server');
        }

        setTransactions(response.data);
        setTransactionsTotal(response.total || response.data.length);
        setTransactionsTotalPages(
          Math.ceil(
            (response.total || response.data.length) / ITEMS_PER_PAGE
          ) || 1
        );
        setTransactionsPage(page);
      } catch (error) {
        if (!isMounted.current) return;
        console.error('Error fetching transactions:', error);
        toast.error('Failed to load transactions. Please try again.');
      }
    },
    [partner, transactionDateFilter]
  );

  // Fetch withdrawal requests with pagination
  const fetchWithdrawals = useCallback(
    async (page = 1) => {
      if (!partner?.partner?._id || !api || !isMounted.current) return;
      console.log('Fetching withdrawal requests for page:', page);
      if (!partner?.partner?._id || !api || !isMounted.current) return;
      try {
        const response = await api.getPartnerWithdrawalRequests(
          partner.partner._id,
          page,
          ITEMS_PER_PAGE,
          withdrawalStatusFilter !== 'all' ? withdrawalStatusFilter : undefined
        );

        if (!isMounted.current) return;

        if (!response) {
          throw new Error('Invalid response from server');
        }

        setWithdrawalRequests(response.data || response);
        setWithdrawalsTotal(
          response.total || (response.data || response).length
        );
        setWithdrawalsTotalPages(
          Math.ceil(
            (response.total || (response.data || response).length) /
              ITEMS_PER_PAGE
          ) || 1
        );
        setWithdrawalsPage(page);
      } catch (error) {
        if (!isMounted.current) return;
        console.error('Error fetching withdrawal requests:', error);
        toast.error('Failed to load withdrawal history. Please try again.');
      }
    },
    [partner, withdrawalStatusFilter]
  );

  // Fetch earnings data
  const fetchEarnings = useCallback(async () => {
    if (!partner?.partner?._id || !api || !isMounted.current) return;
    console.log('Fetching earnings data');
    try {
      const response = await api.getPartnerEarnings(partner.partner.slug);

      if (!isMounted.current) return;

      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }

      setEarnings(response.data);
    } catch (error) {
      if (!isMounted.current) return;
      console.error('Error fetching earnings:', error);
      toast.error('Failed to load earnings data. Please try again.');
    }
  }, [partner]);

  // Initial data fetch - only run once when component mounts
  useEffect(() => {
    isMounted.current = true;

    const fetchInitialData = async () => {
      if (!partner?.partner?._id || !api) return;

      setLoading(true);
      setError(null);

      try {
        // Only fetch data if it hasn't been fetched yet
        const fetchPromises = [];

        // Use Promise.all to fetch all data in parallel
        if (!transactions) {
          fetchPromises.push(fetchTransactions(1));
          initialTransactionsFetchDone.current = true;
        }

        if (!withdrawalRequests) {
          fetchPromises.push(fetchWithdrawals(1));
          initialWithdrawalsFetchDone.current = true;
        }

        if (!earnings) {
          fetchPromises.push(fetchEarnings());
          initialEarningsFetchDone.current = true;
        }

        if (fetchPromises.length > 0) {
          await Promise.all(fetchPromises);
        }
      } catch (err) {
        if (!isMounted.current) return;
        console.error('Error fetching data:', err);
        setError('Failed to load earnings data. Please try again.');
        toast.error('Error loading data. Please refresh the page.');
      } finally {
        console.log('Data fetch completed');
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    fetchInitialData();

    // Cleanup function to prevent state updates if component unmounts
    return () => {
      isMounted.current = false;
    };
  }, [partner]);

  // Handle transaction date filter change - only refetch if the component is mounted and not in loading state
  useEffect(() => {
    if (
      !loading &&
      initialTransactionsFetchDone.current &&
      isMounted.current &&
      transactions
    ) {
      setTransactionsPage(1); // Reset to first page when filter changes
      fetchTransactions(1);
    }
  }, [transactionDateFilter, fetchTransactions, loading]);

  // Handle withdrawal status filter change - only refetch if the component is mounted and not in loading state
  useEffect(() => {
    if (
      !loading &&
      initialWithdrawalsFetchDone.current &&
      isMounted.current &&
      withdrawalRequests
    ) {
      setWithdrawalsPage(1); // Reset to first page when filter changes
      fetchWithdrawals(1);
    }
  }, [withdrawalStatusFilter, fetchWithdrawals, loading]);

  // Handle withdrawal request submission
  const handleWithdrawal = async (e) => {
    e.preventDefault();
    setWithdrawalError('');
    setProcessingWithdrawal(true);

    // Validate amount
    const amount = Number.parseFloat(withdrawalAmount);
    if (isNaN(amount) || amount <= 0) {
      setWithdrawalError('Please enter a valid amount');
      setProcessingWithdrawal(false);
      return;
    }

    if (amount < WITHDRAWAL_MIN_AMOUNT) {
      setWithdrawalError(
        `Minimum withdrawal amount is R${WITHDRAWAL_MIN_AMOUNT}`
      );
      setProcessingWithdrawal(false);
      return;
    }

    if (amount > WITHDRAWAL_MAX_AMOUNT) {
      setWithdrawalError(
        `Maximum withdrawal amount is R${WITHDRAWAL_MAX_AMOUNT}`
      );
      setProcessingWithdrawal(false);
      return;
    }

    if (amount > availableBalance) {
      setWithdrawalError(
        `Insufficient balance. Available: R${availableBalance.toFixed(2)}`
      );
      setProcessingWithdrawal(false);
      return;
    }

    try {
      const newRequest = {
        amount: withdrawalAmount,
        partnerId: partner.partner._id,
        email: partner.partner.email,
        reference: uid.rnd().toUpperCase(),
        createdAt: new Date(),
        status: 'pending',
      };

      await api.createWithdrawalRequest(newRequest);

      setWithdrawalSuccess(true);
      setWithdrawalAmount('');

      // Refresh withdrawal requests and earnings
      if (isMounted.current) {
        await fetchWithdrawals(1);
        await fetchEarnings();
      }

      // Close dialog after a delay
      setTimeout(() => {
        if (isMounted.current) {
          setWithdrawalDialogOpen(false);
          setWithdrawalSuccess(false);
        }
      }, 2000);

      toast.success('Withdrawal request submitted successfully');
    } catch (error) {
      if (!isMounted.current) return;
      console.error('Error creating withdrawal request:', error);
      setWithdrawalError(
        error.message || 'Failed to submit withdrawal request'
      );
      toast.error(
        `Error creating withdrawal request: ${
          error.message || 'Please try again'
        }`
      );
    } finally {
      if (isMounted.current) {
        setProcessingWithdrawal(false);
      }
    }
  };

  // Render loading skeleton
  if (loading) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <Skeleton className='h-10 w-[250px]' />
          <Skeleton className='h-10 w-[120px]' />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className='border-0 shadow-xl bg-white dark:bg-gray-800'
            >
              <CardHeader className='pb-2'>
                <Skeleton className='h-4 w-[140px]' />
              </CardHeader>
              <CardContent>
                <Skeleton className='h-8 w-[120px] mb-2' />
                <Skeleton className='h-4 w-full' />
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue='overview'>
          <TabsList className='bg-white dark:bg-gray-800 p-1 rounded-xl shadow-md'>
            <Skeleton className='h-10 w-[100px] rounded-md' />
            <Skeleton className='h-10 w-[100px] rounded-md ml-1' />
            <Skeleton className='h-10 w-[100px] rounded-md ml-1' />
          </TabsList>

          <div className='mt-6 space-y-4'>
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-64 w-full rounded-lg' />
          </div>
        </Tabs>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <Alert
        variant='destructive'
        className='border-0 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
      >
        <AlertCircle className='h-4 w-4' />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
        <Button
          variant='outline'
          className='mt-4 border-red-200 text-red-800 hover:bg-red-100 dark:border-red-800 dark:text-red-200 dark:hover:bg-red-900/20'
          onClick={() => window.location.reload()}
        >
          Refresh Page
        </Button>
      </Alert>
    );
  }

  return (
    <div className='container mx-auto px-4 py-6'>
      <div className='space-y-6'>
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
              <Link href='/npo-dashboard/site-config'>
                <Button className='bg-gradient-to-r from-pink-500 to-rose-600 text-white hover:opacity-90 shadow-md'>
                  Create Website
                </Button>
              </Link>
              <Link href='/npo-dashboard' className='w-full'>
                <Button className='w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:opacity-90 shadow-md'>
                  <TrendingUp className='mr-2 h-4 w-4' /> Subscriptions
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white flex items-center'>
            <DollarSign className='h-6 w-6 mr-2 text-pink-500' />
            Organization Earnings
          </h2>

          <Dialog
            open={withdrawalDialogOpen}
            onOpenChange={setWithdrawalDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className='bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:opacity-90 shadow-md'>
                <Wallet className='mr-2 h-4 w-4' />
                Request Withdrawal
              </Button>
            </DialogTrigger>
            <DialogContent className='bg-white dark:bg-gray-800 border-0 shadow-xl'>
              <DialogHeader>
                <DialogTitle className='text-gray-900 dark:text-white'>
                  Request Withdrawal
                </DialogTitle>
                <DialogDescription className='text-gray-500 dark:text-gray-400'>
                  Enter the amount you would like to withdraw from your
                  available balance.
                </DialogDescription>
              </DialogHeader>

              {withdrawalSuccess ? (
                <div className='py-6 flex flex-col items-center justify-center text-center'>
                  <div className='rounded-full bg-green-100 dark:bg-green-900/20 p-3 mb-4'>
                    <CheckCircle className='h-8 w-8 text-green-600 dark:text-green-400' />
                  </div>
                  <h3 className='text-xl font-medium text-gray-900 dark:text-gray-200 mb-2'>
                    Withdrawal Request Submitted
                  </h3>
                  <p className='text-gray-600 dark:text-gray-400 mb-2'>
                    Your withdrawal request has been submitted successfully.
                  </p>
                  <p className='text-gray-600 dark:text-gray-400'>
                    You will receive an email notification once it's processed.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleWithdrawal}>
                  <div className='grid gap-4 py-4'>
                    <div className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <Label
                          htmlFor='amount'
                          className='text-gray-700 dark:text-gray-300'
                        >
                          Amount (ZAR)
                        </Label>
                        <span className='text-sm text-gray-600 dark:text-gray-400'>
                          Available: R{availableBalance.toFixed(2)}
                        </span>
                      </div>
                      <Input
                        id='amount'
                        type='number'
                        step='0.01'
                        min={WITHDRAWAL_MIN_AMOUNT}
                        max={Math.min(WITHDRAWAL_MAX_AMOUNT, availableBalance)}
                        placeholder='Enter amount'
                        value={withdrawalAmount}
                        onChange={(e) => setWithdrawalAmount(e.target.value)}
                        className='bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                        required
                      />
                      {withdrawalError && (
                        <p className='text-sm text-red-600 dark:text-red-400 mt-1 flex items-center'>
                          <AlertCircle className='h-3 w-3 mr-1' />
                          {withdrawalError}
                        </p>
                      )}
                      <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                        Minimum: R{WITHDRAWAL_MIN_AMOUNT} | Maximum: R
                        {WITHDRAWAL_MAX_AMOUNT}
                      </p>
                    </div>

                    <div className='bg-gray-50 dark:bg-gray-700/30 p-3 rounded-md border border-gray-200 dark:border-gray-700'>
                      <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                        Withdrawal Information
                      </h4>
                      <ul className='space-y-1 text-xs text-gray-600 dark:text-gray-400'>
                        <li>
                          • Withdrawals are processed within 3-5 business days
                        </li>
                        <li>
                          • Funds will be sent to your registered bank account
                        </li>
                        <li>• A 2% processing fee may apply to withdrawals</li>
                      </ul>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => setWithdrawalDialogOpen(false)}
                      className='border-gray-200 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                    >
                      Cancel
                    </Button>
                    <Button
                      type='submit'
                      className='bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:opacity-90'
                      disabled={
                        processingWithdrawal ||
                        !withdrawalAmount ||
                        Number.parseFloat(withdrawalAmount) <= 0
                      }
                    >
                      {processingWithdrawal ? (
                        <>
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                          Processing...
                        </>
                      ) : (
                        'Submit Request'
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <Card className='border-0 shadow-xl bg-white dark:bg-gray-800 overflow-hidden'>
            <div className='h-1 bg-gradient-to-r from-green-500 to-emerald-500'></div>
            <CardHeader className='pb-2'>
              <CardTitle className='text-gray-700 dark:text-gray-300 flex items-center text-sm font-medium'>
                <DollarSign className='h-4 w-4 mr-1 text-green-500' />
                Total Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1'>
                R{totalEarnings.toFixed(2)}
              </div>
              <p className='text-xs text-gray-500 dark:text-gray-400'>
                Lifetime earnings from your organization
              </p>
            </CardContent>
          </Card>

          <Card className='border-0 shadow-xl bg-white dark:bg-gray-800 overflow-hidden'>
            <div className='h-1 bg-gradient-to-r from-blue-500 to-cyan-500'></div>
            <CardHeader className='pb-2'>
              <CardTitle className='text-gray-700 dark:text-gray-300 flex items-center text-sm font-medium'>
                <Wallet className='h-4 w-4 mr-1 text-blue-500' />
                Available Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1'>
                R{availableBalance.toFixed(2)}
              </div>
              <p className='text-xs text-gray-500 dark:text-gray-400'>
                Amount available for withdrawal
              </p>
            </CardContent>
          </Card>

          <Card className='border-0 shadow-xl bg-white dark:bg-gray-800 overflow-hidden'>
            <div className='h-1 bg-gradient-to-r from-amber-500 to-yellow-500'></div>
            <CardHeader className='pb-2'>
              <CardTitle className='text-gray-700 dark:text-gray-300 flex items-center text-sm font-medium'>
                <Clock className='h-4 w-4 mr-1 text-amber-500' />
                Pending Withdrawals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1'>
                R{pendingWithdrawals.toFixed(2)}
              </div>
              <p className='text-xs text-gray-500 dark:text-gray-400'>
                Withdrawals awaiting processing
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different sections */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
          <TabsList className='bg-white dark:bg-gray-800 p-1 rounded-xl shadow-md'>
            <TabsTrigger
              value='overview'
              className='rounded-lg px-6 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-600 data-[state=active]:text-white'
            >
              <BarChart3 className='h-4 w-4 mr-2' />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value='transactions'
              className='rounded-lg px-6 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-600 data-[state=active]:text-white'
            >
              <ArrowUpRight className='h-4 w-4 mr-2' />
              Transactions
            </TabsTrigger>
            <TabsTrigger
              value='withdrawals'
              className='rounded-lg px-6 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-600 data-[state=active]:text-white'
            >
              <CreditCard className='h-4 w-4 mr-2' />
              Withdrawals
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value='overview' className='space-y-6 mt-6'>
            <Card className='border-0 shadow-xl bg-white dark:bg-gray-800'>
              <CardHeader>
                <CardTitle className='text-gray-900 dark:text-gray-100'>
                  Earnings Overview
                </CardTitle>
                <CardDescription className='text-gray-500 dark:text-gray-400'>
                  Your earnings and withdrawal activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='h-[300px] flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700'>
                  <div className='text-center'>
                    <BarChart3 className='h-12 w-12 text-pink-500 opacity-50 mx-auto mb-4' />
                    <p className='text-gray-600 dark:text-gray-400'>
                      Earnings chart will appear here
                    </p>
                    <p className='text-xs text-gray-500 dark:text-gray-500 mt-1'>
                      Data visualization coming soon
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <Card className='border-0 shadow-xl bg-white dark:bg-gray-800'>
                <CardHeader>
                  <CardTitle className='text-gray-900 dark:text-gray-100 text-lg flex items-center'>
                    <ArrowUpRight className='h-5 w-5 mr-2 text-pink-500' />
                    Recent Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {transactions && transactions.length > 0 ? (
                    <div className='space-y-3'>
                      {transactions.slice(0, 3).map((transaction, index) => (
                        <div
                          key={transaction.id || index}
                          className='flex items-center justify-between p-3 rounded-md bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700'
                        >
                          <div className='flex items-center'>
                            <div className='rounded-full bg-gradient-to-br from-pink-500 to-rose-600 p-2 mr-3 text-white'>
                              <ArrowUpRight className='h-4 w-4' />
                            </div>
                            <div>
                              <p className='text-sm font-medium text-gray-800 dark:text-gray-200'>
                                {transaction.firstName} {transaction.lastName}
                              </p>
                              <p className='text-xs text-gray-500 dark:text-gray-400'>
                                {moment(transaction.createdAt).format(
                                  'DD MMM YYYY'
                                )}
                              </p>
                            </div>
                          </div>
                          <div className='text-right'>
                            <p className='text-sm font-medium text-emerald-600 dark:text-emerald-400'>
                              +R{(transaction.amount * 0.4).toFixed(2)}
                            </p>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>
                              R{transaction.amount} × 40%
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className='text-center py-6 bg-gray-50 dark:bg-gray-900/50 rounded-lg'>
                      <p className='text-gray-600 dark:text-gray-400'>
                        No recent transactions
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className='border-t border-gray-200 dark:border-gray-700 pt-4'>
                  <Button
                    variant='outline'
                    className='w-full border-gray-200 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'
                    onClick={() => setActiveTab('transactions')}
                  >
                    View All Transactions
                  </Button>
                </CardFooter>
              </Card>

              <Card className='border-0 shadow-xl bg-white dark:bg-gray-800'>
                <CardHeader>
                  <CardTitle className='text-gray-900 dark:text-gray-100 text-lg flex items-center'>
                    <CreditCard className='h-5 w-5 mr-2 text-pink-500' />
                    Recent Withdrawals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {withdrawalRequests && withdrawalRequests.length > 0 ? (
                    <div className='space-y-3'>
                      {withdrawalRequests.slice(0, 3).map((request, index) => (
                        <div
                          key={request.id || index}
                          className='flex items-center justify-between p-3 rounded-md bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700'
                        >
                          <div className='flex items-center'>
                            <div className='rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 p-2 mr-3 text-white'>
                              <CreditCard className='h-4 w-4' />
                            </div>
                            <div>
                              <p className='text-sm font-medium text-gray-800 dark:text-gray-200'>
                                Withdrawal Request
                              </p>
                              <p className='text-xs text-gray-500 dark:text-gray-400'>
                                {moment(request.createdAt).format(
                                  'DD MMM YYYY'
                                )}
                              </p>
                            </div>
                          </div>
                          <div className='text-right'>
                            <p className='text-sm font-medium text-gray-800 dark:text-gray-200'>
                              R{Number.parseFloat(request.amount).toFixed(2)}
                            </p>
                            <WithdrawalStatusBadge status={request.status} />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className='text-center py-6 bg-gray-50 dark:bg-gray-900/50 rounded-lg'>
                      <p className='text-gray-600 dark:text-gray-400'>
                        No recent withdrawals
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className='border-t border-gray-200 dark:border-gray-700 pt-4'>
                  <Button
                    variant='outline'
                    className='w-full border-gray-200 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'
                    onClick={() => setActiveTab('withdrawals')}
                  >
                    View All Withdrawals
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value='transactions' className='space-y-6 mt-6'>
            <Card className='border-0 shadow-xl bg-white dark:bg-gray-800'>
              <CardHeader>
                <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                  <div>
                    <CardTitle className='text-gray-900 dark:text-gray-100'>
                      Transaction History
                    </CardTitle>
                    <CardDescription className='text-gray-500 dark:text-gray-400'>
                      View all earnings from your organization
                    </CardDescription>
                  </div>

                  <div className='flex items-center gap-2'>
                    <Select
                      value={transactionDateFilter}
                      onValueChange={setTransactionDateFilter}
                    >
                      <SelectTrigger className='w-[180px] bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200'>
                        <Calendar className='h-4 w-4 mr-2 text-gray-500 dark:text-gray-400' />
                        <SelectValue placeholder='Filter by date' />
                      </SelectTrigger>
                      <SelectContent className='bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200'>
                        <SelectItem value='all'>All Time</SelectItem>
                        <SelectItem value='today'>Today</SelectItem>
                        <SelectItem value='week'>This Week</SelectItem>
                        <SelectItem value='month'>This Month</SelectItem>
                        <SelectItem value='year'>This Year</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant='outline'
                      size='icon'
                      className='border-gray-200 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'
                    >
                      <Download className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {transactions && transactions.length > 0 ? (
                  <div className='rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden'>
                    <Table>
                      <TableHeader className='bg-gray-50 dark:bg-gray-800/50'>
                        <TableRow className='hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700'>
                          <TableHead className='text-gray-700 dark:text-gray-300'>
                            Date
                          </TableHead>
                          <TableHead className='text-gray-700 dark:text-gray-300'>
                            Donor
                          </TableHead>
                          <TableHead className='text-gray-700 dark:text-gray-300'>
                            Subscription
                          </TableHead>
                          <TableHead className='text-right text-gray-700 dark:text-gray-300'>
                            Amount
                          </TableHead>
                          <TableHead className='text-right text-gray-700 dark:text-gray-300'>
                            Earning
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.map((transaction, index) => (
                          <TableRow
                            key={transaction.id || index}
                            className='hover:bg-gray-50 dark:hover:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                          >
                            <TableCell className='font-medium text-gray-700 dark:text-gray-300'>
                              {moment(transaction.createdAt).format(
                                'DD MMM YYYY'
                              )}
                            </TableCell>
                            <TableCell className='text-gray-700 dark:text-gray-300'>
                              {transaction.firstName} {transaction.lastName}
                            </TableCell>
                            <TableCell className='text-gray-700 dark:text-gray-300'>
                              {transaction.subscriptionTier || 'Standard'}
                            </TableCell>
                            <TableCell className='text-right text-gray-700 dark:text-gray-300'>
                              R
                              {Number.parseFloat(transaction.amount).toFixed(2)}
                            </TableCell>
                            <TableCell className='text-right text-emerald-600 dark:text-emerald-400'>
                              +R{(transaction.amount * 0.4).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className='text-center py-12 border border-gray-200 dark:border-gray-700 rounded-lg'>
                    <div className='rounded-full bg-gray-100 dark:bg-gray-800 p-3 inline-flex mb-4'>
                      <Search className='h-6 w-6 text-gray-500 dark:text-gray-400' />
                    </div>
                    <h3 className='text-lg font-medium text-gray-800 dark:text-gray-300 mb-2'>
                      No transactions found
                    </h3>
                    <p className='text-gray-600 dark:text-gray-400 max-w-md mx-auto'>
                      No transactions match your current filter criteria. Try
                      changing your filter or check back later.
                    </p>
                  </div>
                )}

                {/* Pagination */}
                {transactionsTotalPages > 1 && (
                  <div className='mt-4'>
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() =>
                              fetchTransactions(
                                Math.max(1, transactionsPage - 1)
                              )
                            }
                            className={
                              transactionsPage === 1
                                ? 'pointer-events-none opacity-50'
                                : ''
                            }
                          />
                        </PaginationItem>

                        {Array.from({
                          length: Math.min(5, transactionsTotalPages),
                        }).map((_, i) => {
                          const page = i + 1;
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => fetchTransactions(page)}
                                isActive={page === transactionsPage}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}

                        {transactionsTotalPages > 5 && (
                          <>
                            <PaginationItem>
                              <PaginationEllipsis />
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink
                                onClick={() =>
                                  fetchTransactions(transactionsTotalPages)
                                }
                                isActive={
                                  transactionsTotalPages === transactionsPage
                                }
                              >
                                {transactionsTotalPages}
                              </PaginationLink>
                            </PaginationItem>
                          </>
                        )}

                        <PaginationItem>
                          <PaginationNext
                            onClick={() =>
                              fetchTransactions(
                                Math.min(
                                  transactionsTotalPages,
                                  transactionsPage + 1
                                )
                              )
                            }
                            className={
                              transactionsPage === transactionsTotalPages
                                ? 'pointer-events-none opacity-50'
                                : ''
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>

                    <div className='text-center mt-2 text-xs text-gray-500 dark:text-gray-400'>
                      Showing page {transactionsPage} of{' '}
                      {transactionsTotalPages} ({transactionsTotal} total
                      transactions)
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Withdrawals Tab */}
          <TabsContent value='withdrawals' className='space-y-6 mt-6'>
            <Card className='border-0 shadow-xl bg-white dark:bg-gray-800'>
              <CardHeader>
                <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                  <div>
                    <CardTitle className='text-gray-900 dark:text-gray-100'>
                      Withdrawal History
                    </CardTitle>
                    <CardDescription className='text-gray-500 dark:text-gray-400'>
                      Track all your withdrawal requests
                    </CardDescription>
                  </div>

                  <div className='flex items-center gap-2'>
                    <Select
                      value={withdrawalStatusFilter}
                      onValueChange={setWithdrawalStatusFilter}
                    >
                      <SelectTrigger className='w-[180px] bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200'>
                        <Filter className='h-4 w-4 mr-2 text-gray-500 dark:text-gray-400' />
                        <SelectValue placeholder='Filter by status' />
                      </SelectTrigger>
                      <SelectContent className='bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200'>
                        <SelectItem value='all'>All Statuses</SelectItem>
                        <SelectItem value='pending'>Pending</SelectItem>
                        <SelectItem value='approved'>Approved</SelectItem>
                        <SelectItem value='completed'>Completed</SelectItem>
                        <SelectItem value='rejected'>Rejected</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant='outline'
                      size='icon'
                      className='border-gray-200 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'
                    >
                      <Download className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {withdrawalRequests && withdrawalRequests.length > 0 ? (
                  <div className='rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden'>
                    <Table>
                      <TableHeader className='bg-gray-50 dark:bg-gray-800/50'>
                        <TableRow className='hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700'>
                          <TableHead className='text-gray-700 dark:text-gray-300'>
                            Date
                          </TableHead>
                          <TableHead className='text-gray-700 dark:text-gray-300'>
                            Reference
                          </TableHead>
                          <TableHead className='text-gray-700 dark:text-gray-300'>
                            Status
                          </TableHead>
                          <TableHead className='text-right text-gray-700 dark:text-gray-300'>
                            Amount
                          </TableHead>
                          <TableHead className='text-right text-gray-700 dark:text-gray-300'>
                            Processing Fee
                          </TableHead>
                          <TableHead className='text-right text-gray-700 dark:text-gray-300'>
                            Net Amount
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {withdrawalRequests.map((request, index) => {
                          const amount = Number.parseFloat(request.amount || 0);
                          const fee = amount * 0.02; // 2% processing fee
                          const netAmount = amount - fee;

                          return (
                            <TableRow
                              key={request.id || index}
                              className='hover:bg-gray-50 dark:hover:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                            >
                              <TableCell className='font-medium text-gray-700 dark:text-gray-300'>
                                {moment(request.createdAt).format(
                                  'DD MMM YYYY'
                                )}
                              </TableCell>
                              <TableCell className='text-gray-700 dark:text-gray-300'>
                                {request.reference || `WD${index + 1000}`}
                              </TableCell>
                              <TableCell>
                                <WithdrawalStatusBadge
                                  status={request.status}
                                />
                              </TableCell>
                              <TableCell className='text-right text-gray-700 dark:text-gray-300'>
                                R{amount.toFixed(2)}
                              </TableCell>
                              <TableCell className='text-right text-gray-500 dark:text-gray-400'>
                                -R{fee.toFixed(2)}
                              </TableCell>
                              <TableCell className='text-right font-medium text-gray-800 dark:text-gray-200'>
                                R{netAmount.toFixed(2)}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className='text-center py-12 border border-gray-200 dark:border-gray-700 rounded-lg'>
                    <div className='rounded-full bg-gray-100 dark:bg-gray-800 p-3 inline-flex mb-4'>
                      <CreditCard className='h-6 w-6 text-gray-500 dark:text-gray-400' />
                    </div>
                    <h3 className='text-lg font-medium text-gray-800 dark:text-gray-300 mb-2'>
                      No withdrawals found
                    </h3>
                    <p className='text-gray-600 dark:text-gray-400 max-w-md mx-auto'>
                      You haven't made any withdrawal requests yet or none match
                      your current filter criteria.
                    </p>
                    <Button
                      className='mt-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:opacity-90 shadow-md'
                      onClick={() => setWithdrawalDialogOpen(true)}
                    >
                      <Wallet className='mr-2 h-4 w-4' />
                      Request Withdrawal
                    </Button>
                  </div>
                )}

                {/* Pagination */}
                {withdrawalsTotalPages > 1 && (
                  <div className='mt-4'>
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() =>
                              fetchWithdrawals(Math.max(1, withdrawalsPage - 1))
                            }
                            className={
                              withdrawalsPage === 1
                                ? 'pointer-events-none opacity-50'
                                : ''
                            }
                          />
                        </PaginationItem>

                        {Array.from({
                          length: Math.min(5, withdrawalsTotalPages),
                        }).map((_, i) => {
                          const page = i + 1;
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => fetchWithdrawals(page)}
                                isActive={page === withdrawalsPage}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}

                        {withdrawalsTotalPages > 5 && (
                          <>
                            <PaginationItem>
                              <PaginationEllipsis />
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink
                                onClick={() =>
                                  fetchWithdrawals(withdrawalsTotalPages)
                                }
                                isActive={
                                  withdrawalsTotalPages === withdrawalsPage
                                }
                              >
                                {withdrawalsTotalPages}
                              </PaginationLink>
                            </PaginationItem>
                          </>
                        )}

                        <PaginationItem>
                          <PaginationNext
                            onClick={() =>
                              fetchWithdrawals(
                                Math.min(
                                  withdrawalsTotalPages,
                                  withdrawalsPage + 1
                                )
                              )
                            }
                            className={
                              withdrawalsPage === withdrawalsTotalPages
                                ? 'pointer-events-none opacity-50'
                                : ''
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>

                    <div className='text-center mt-2 text-xs text-gray-500 dark:text-gray-400'>
                      Showing page {withdrawalsPage} of {withdrawalsTotalPages}{' '}
                      ({withdrawalsTotal} total withdrawals)
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
