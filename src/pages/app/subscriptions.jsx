'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import moment from 'moment';
import { postToURL } from '@/components/payfast/payfast';
import { v4 as uuidv4 } from 'uuid';
import { keys } from 'ramda';
import { useApi } from '@/context/ApiContext';
import {
  Search,
  ArrowUpDown,
  Calendar,
  CreditCard,
  Tag,
  AlertCircle,
  Loader2,
  XCircle,
  CheckCircle,
  PlusCircle,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const levelPrices = {
  Nourisher: 50,
  CaringPartner: 100,
  HarmonyAdvocate: 200,
  UnitySupporter: 300,
  HopeBuilder: 500,
  CompassionAmbassador: 1000,
  LifelineCreator: 2000,
  EmpowermentLeader: 3000,
  SustainabilityChampion: 5000,
  GlobalImpactVisionary: 10000,
};

const PAYFAST_URL = process.env.NEXT_PUBLIC_PAYFAST_URL;
const WEBSITE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL;
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const MERCHANT_ID = process.env.NEXT_PUBLIC_MERCHANT_ID;
const MERCHANT_KEY = process.env.NEXT_PUBLIC_MERCHANT_KEY;

const levelColors = {
  Nourisher: 'green',
  CaringPartner: 'blue',
  HarmonyAdvocate: 'purple',
  UnitySupporter: 'indigo',
  HopeBuilder: 'yellow',
  CompassionAmbassador: 'orange',
  LifelineCreator: 'red',
  EmpowermentLeader: 'pink',
  SustainabilityChampion: 'emerald',
  GlobalImpactVisionary: 'violet',
};

const ITEMS_PER_PAGE = 5;

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const api = useApi();
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('date');
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(null);
  const [processingCancel, setProcessingCancel] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Use a ref to track if the initial fetch has been done
  const initialFetchDone = useRef(false);

  const fetchSubscriptions = useCallback(
    async (page = 1) => {
      if (!user || !user.user || !user.user._id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await api.getUserSubscriptions(
          user.user._id,
          page,
          ITEMS_PER_PAGE
        );

        console.log(response);

        if (!response || !response.data) {
          throw new Error('Invalid response from server');
        }

        // Assuming the API returns total count in the response
        // If not, you'll need to adjust this logic
        const total = response.totalCount || response.data.length;
        const calculatedTotalPages = Math.ceil(total / ITEMS_PER_PAGE) || 1;

        setSubscriptions(response.data);
        setTotalItems(total);
        setTotalPages(calculatedTotalPages);
        setCurrentPage(page);
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
        setError(error.message || 'Failed to load subscriptions');
      } finally {
        setLoading(false);
      }
    },
    [api]
  ); // Only depend on api, not user

  // Initial fetch - only run once when component mounts
  useEffect(() => {
    if (!initialFetchDone.current && user?.user?._id) {
      fetchSubscriptions(1);
      initialFetchDone.current = true;
    }
  }, [user, fetchSubscriptions]);

  // Handle page change
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    fetchSubscriptions(page);
  };

  const cleanSubscriptions =
    subscriptions?.map((s) => ({
      id: s['_id'],
      npo: s.partner?.name || 'Unknown Organization',
      amount: s.amount,
      tier: s.subscriptionTier,
      createDate: moment(s.createdDate).format('DD MMM YYYY'),
      status: s.status || 'active',
      nextPaymentDate: s.nextPaymentDate
        ? moment(s.nextPaymentDate).format('DD MMM YYYY')
        : 'Not scheduled',
    })) || [];

  const paySubscription = async (sub) => {
    try {
      setProcessingPayment(sub.id);

      if (!user || !user.user) {
        throw new Error('User information not available');
      }

      const userData = user.user;
      const paymentId = uuidv4();

      let payfastData = {
        merchant_id: MERCHANT_ID,
        merchant_key: MERCHANT_KEY,
        return_url: `${WEBSITE_URL}/app/subscribe?subscriptionId=${
          sub.id
        }&userId=${userData._id}&subscriptionTier=${sub.tier}&amount=${
          levelPrices[sub.tier]
        }&firstName=${userData.firstName}&lastName=${userData.lastName}&email=${
          userData.email
        }&paymentMethod=payfast&level=${
          keys(levelPrices).indexOf(userData.tier) + 1
        }${user?.parent ? `&parent=${userData?.parent}&` : ''}&partner=${
          sub?.npo
        }&paymentId=${paymentId}`,
        cancel_url: `${WEBSITE_URL}/app/cancel?subscriptionId=${
          sub.id
        }&userId=${userData._id}&subscriptionTier=${sub.tier}&amount=${
          levelPrices[sub.tier]
        }&firstName=${userData.firstName}&lastName=${userData.lastName}&email=${
          userData.email
        }&paymentMethod=payfast&agreeToTerms=true&level=${
          keys(levelPrices).indexOf(userData.tier) + 1
        }${user?.parent ? `&parent=${userData?.parent}&` : ''}&partner=${
          sub?.npo
        }`,
        notify_url: `${API_URL}/notify`,
        name_first: userData.firstName,
        name_last: userData.lastName,
        email_address: userData.email,
        m_payment_id: paymentId,
        amount: levelPrices[sub.tier],
        item_name: `Inaethe Subscription to ${sub.npo}`,
        item_description: `Inaethe Subscription for ${userData.firstName} ${userData.lastName} for the ${sub.tier} package on NPO ${sub.npo}.`,
        subscription_type: 1,
        billing_date: moment().format('YYYY-MM-DD'),
        recurring_amount: levelPrices[sub.tier],
        frequency: 3,
        cycles: 12,
        subscription_notify_email: true,
        subscription_notify_webhook: true,
        subscription_notify_buyer: true,
        custom_str2: userData.id ? userData.id : '',
        custom_str3: sub.id ? sub.id : '',
        custom_str4: sub.npo ? sub.npo : '',
        custom_str5: sub.tier ? sub.tier : '',
      };

      if (user?.parent) {
        payfastData = {
          ...payfastData,
          custom_str1: user?.parent ? user?.parent : '',
        };
      }

      postToURL(PAYFAST_URL, payfastData);
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment processing failed. Please try again.');
      setProcessingPayment(null);
    }
  };

  const handleCancelSubscription = async () => {
    if (!selectedSubscription) return;

    setProcessingCancel(selectedSubscription.id);

    try {
      // Simulate API call for cancellation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update local state to reflect cancellation
      setSubscriptions((prevSubs) =>
        prevSubs.map((sub) =>
          sub._id === selectedSubscription.id
            ? { ...sub, status: 'cancelled' }
            : sub
        )
      );

      toast.success(
        `Subscription to ${selectedSubscription.npo} has been cancelled`
      );
      setCancelDialogOpen(false);
    } catch (error) {
      toast.error('Failed to cancel subscription. Please try again.');
    } finally {
      setProcessingCancel(null);
      setSelectedSubscription(null);
    }
  };

  const openCancelDialog = (sub) => {
    setSelectedSubscription(sub);
    setCancelDialogOpen(true);
  };

  const filteredSubscriptions =
    cleanSubscriptions?.filter((sub) =>
      sub?.npo?.toLowerCase().includes(filter.toLowerCase())
    ) || [];

  const sortedSubscriptions = [...filteredSubscriptions].sort((a, b) => {
    if (sort === 'date') {
      return new Date(b.createDate) - new Date(a.createDate);
    }
    if (sort === 'amount') return b.amount - a.amount;
    return 0;
  });

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <Badge className='bg-green-600'>Active</Badge>;
      case 'pending':
        return <Badge className='bg-yellow-600'>Pending</Badge>;
      case 'cancelled':
        return <Badge className='bg-red-600'>Cancelled</Badge>;
      case 'expired':
        return <Badge className='bg-gray-600'>Expired</Badge>;
      default:
        return <Badge className='bg-blue-600'>Active</Badge>;
    }
  };

  const getTierBadge = (tier) => {
    const color = levelColors[tier] || 'gray';
    return (
      <Badge
        className={`bg-${color}-100 text-${color}-800 border border-${color}-200`}
      >
        {tier}
      </Badge>
    );
  };

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={i === currentPage}
            onClick={() => handlePageChange(i)}
            className={i === currentPage ? 'bg-green-600 text-white' : ''}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className='min-h-screen p-4 md:p-6'>
      <div className='max-w-6xl mx-auto'>
        <div className='flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4'>
          <div>
            <h1 className='text-3xl font-bold text-gray-100'>
              My Subscriptions
            </h1>
            <p className='text-gray-400 mt-1'>
              Manage your active subscriptions and payments
            </p>
          </div>

          <div className='flex flex-col sm:flex-row gap-3'>
            <div className='relative'>
              <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-500' />
              <Input
                placeholder='Search by organization'
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className='pl-9 bg-gray-800 border-gray-700 text-gray-300 w-full sm:w-[250px]'
              />
            </div>

            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className='bg-gray-800 border-gray-700 text-gray-300 w-full sm:w-[180px]'>
                <div className='flex items-center'>
                  <ArrowUpDown className='mr-2 h-4 w-4' />
                  <SelectValue placeholder='Sort by' />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='date'>Sort by Date</SelectItem>
                <SelectItem value='amount'>Sort by Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className='space-y-4'>
            {[...Array(3)].map((_, index) => (
              <Card key={index} className='bg-gray-800 border-gray-700'>
                <CardHeader className='pb-2'>
                  <div className='flex justify-between'>
                    <Skeleton className='h-6 w-1/3' />
                    <Skeleton className='h-6 w-24' />
                  </div>
                </CardHeader>
                <CardContent className='py-4'>
                  <div className='flex justify-between items-center'>
                    <div className='space-y-2'>
                      <Skeleton className='h-4 w-32' />
                      <Skeleton className='h-4 w-40' />
                      <Skeleton className='h-4 w-36' />
                    </div>
                    <div>
                      <Skeleton className='h-9 w-28' />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            <div className='flex items-center justify-center py-4'>
              <Loader2 className='h-8 w-8 text-gray-400 animate-spin' />
              <span className='ml-2 text-gray-400'>
                Loading your subscriptions...
              </span>
            </div>
          </div>
        ) : error ? (
          <Card className='bg-gray-800 border-gray-700 border-red-800 shadow-md'>
            <CardContent className='pt-6 pb-6 flex flex-col items-center text-center'>
              <AlertCircle className='h-12 w-12 text-red-500 mb-4' />
              <h3 className='text-xl font-medium text-gray-200 mb-2'>
                Unable to load subscriptions
              </h3>
              <p className='text-gray-400 mb-4 max-w-md'>
                {error}. Please try refreshing the page or contact support if
                the problem persists.
              </p>
              <Button
                onClick={() => fetchSubscriptions(currentPage)}
                className='bg-gray-700 hover:bg-gray-600'
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : sortedSubscriptions.length > 0 ? (
          <>
            <div className='space-y-4'>
              {sortedSubscriptions.map((sub) => (
                <Card
                  key={sub.id}
                  className={`bg-gray-800 border-gray-700 transition-all duration-200 ${
                    sub.status?.toLowerCase() === 'cancelled'
                      ? 'opacity-75'
                      : ''
                  }`}
                >
                  <CardHeader className='pb-2 flex flex-row items-center justify-between'>
                    <div className='flex flex-col'>
                      <CardTitle className='text-xl text-gray-100'>
                        {sub.npo}
                      </CardTitle>
                      <div className='flex items-center gap-2 mt-1'>
                        {getStatusBadge(sub.status)}
                        {getTierBadge(sub.tier)}
                      </div>
                    </div>
                    <div className='text-right'>
                      <div className='text-2xl font-bold text-gray-100'>
                        R {sub.amount}
                      </div>
                      <div className='text-xs text-gray-400'>per month</div>
                    </div>
                  </CardHeader>

                  <CardContent className='py-4 border-t border-gray-700'>
                    <div className='flex flex-col md:flex-row justify-between gap-4'>
                      <div className='space-y-2'>
                        <div className='flex items-center text-gray-300'>
                          <Calendar className='h-4 w-4 mr-2 text-gray-500' />
                          <span className='text-sm'>
                            Created on {sub.createDate}
                          </span>
                        </div>

                        <div className='flex items-center text-gray-300'>
                          <CreditCard className='h-4 w-4 mr-2 text-gray-500' />
                          <span className='text-sm'>
                            Next payment:{' '}
                            {sub.nextPaymentDate || 'Not scheduled'}
                          </span>
                        </div>

                        <div className='flex items-center text-gray-300'>
                          <Tag className='h-4 w-4 mr-2 text-gray-500' />
                          <span className='text-sm'>
                            Impact level:{' '}
                            <span className='font-medium'>{sub.tier}</span>
                          </span>
                        </div>
                      </div>

                      <div className='flex items-center space-x-3 self-end md:self-center'>
                        {sub.status?.toLowerCase() !== 'cancelled' && (
                          <>
                            <Button
                              variant='outline'
                              className='border-gray-600 text-gray-300 hover:bg-gray-700'
                              onClick={() => openCancelDialog(sub)}
                              disabled={
                                processingCancel === sub.id ||
                                processingPayment === sub.id
                              }
                            >
                              {processingCancel === sub.id ? (
                                <>
                                  <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                                  Cancelling...
                                </>
                              ) : (
                                <>
                                  <XCircle className='h-4 w-4 mr-2' />
                                  Cancel
                                </>
                              )}
                            </Button>

                            <Button
                              className='bg-green-600 hover:bg-green-700 text-white'
                              onClick={() => paySubscription(sub)}
                              disabled={
                                processingPayment === sub.id ||
                                processingCancel === sub.id
                              }
                            >
                              {processingPayment === sub.id ? (
                                <>
                                  <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <CheckCircle className='h-4 w-4 mr-2' />
                                  Make Payment
                                </>
                              )}
                            </Button>
                          </>
                        )}

                        {sub.status?.toLowerCase() === 'cancelled' && (
                          <div className='text-gray-500 text-sm italic'>
                            This subscription has been cancelled
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className='mt-6'>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={
                          currentPage === 1
                            ? 'pointer-events-none opacity-50'
                            : ''
                        }
                      />
                    </PaginationItem>

                    {renderPaginationItems()}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={
                          currentPage === totalPages
                            ? 'pointer-events-none opacity-50'
                            : ''
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>

                <div className='text-center mt-2 text-sm text-gray-400'>
                  Showing page {currentPage} of {totalPages} ({totalItems} total
                  subscriptions)
                </div>
              </div>
            )}
          </>
        ) : (
          <Card className='bg-gray-800 border-gray-700 shadow-md'>
            <CardContent className='pt-10 pb-10 flex flex-col items-center text-center'>
              <div className='rounded-full bg-gray-700 p-3 mb-4'>
                <CreditCard className='h-8 w-8 text-gray-400' />
              </div>
              <h3 className='text-xl font-medium text-gray-200 mb-2'>
                No subscriptions found
              </h3>
              <p className='text-gray-400 mb-6 max-w-md'>
                You don't have any active subscriptions yet. Support an
                organization to make a difference while earning through
                referrals.
              </p>
              <Link href='/app/npos'>
                <Button className='bg-green-600 hover:bg-green-700'>
                  <PlusCircle className='h-4 w-4 mr-2' />
                  Browse Organizations
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className='bg-gray-800 text-gray-100 border-gray-700'>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription className='text-gray-400'>
              Are you sure you want to cancel your subscription to{' '}
              {selectedSubscription?.npo}?
            </DialogDescription>
          </DialogHeader>

          {selectedSubscription && (
            <div className='py-4'>
              <div className='bg-gray-900 p-4 rounded-md mb-4'>
                <div className='flex justify-between mb-2'>
                  <span className='text-gray-400'>Organization:</span>
                  <span className='text-gray-200 font-medium'>
                    {selectedSubscription.npo}
                  </span>
                </div>
                <div className='flex justify-between mb-2'>
                  <span className='text-gray-400'>Subscription tier:</span>
                  <span className='text-gray-200 font-medium'>
                    {selectedSubscription.tier}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-400'>Monthly amount:</span>
                  <span className='text-gray-200 font-medium'>
                    R {selectedSubscription.amount}
                  </span>
                </div>
              </div>

              <p className='text-yellow-400 text-sm mb-2 flex items-start'>
                <AlertCircle className='h-4 w-4 mr-2 mt-0.5 flex-shrink-0' />
                Cancelling will stop future payments and may affect any benefits
                you receive.
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              variant='outline'
              className='border-gray-600 text-gray-300 hover:bg-gray-700'
              onClick={() => setCancelDialogOpen(false)}
            >
              Keep Subscription
            </Button>
            <Button
              variant='destructive'
              className='bg-red-600 hover:bg-red-700'
              onClick={handleCancelSubscription}
              disabled={processingCancel}
            >
              {processingCancel ? (
                <>
                  <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                  Cancelling...
                </>
              ) : (
                'Confirm Cancellation'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
