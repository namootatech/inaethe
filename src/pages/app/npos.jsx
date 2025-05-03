'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useApi } from '@/context/ApiContext';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { indexOf, set } from 'ramda';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { downloadConfig } from '@/util/config';
import { Search, Filter, Info, Heart, ArrowRight, Loader2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';

const subscriptionOptions = [
  {
    key: 'Nourisher',
    value: 'Nourisher',
    amount: 50,
    label: 'Nourisher',
    description: 'Provide essential meals to those in need',
  },
  {
    key: 'CaringPartner',
    value: 'CaringPartner',
    amount: 100,
    label: 'Caring Partner',
    description: 'Support food security for families',
  },
  {
    key: 'HarmonyAdvocate',
    value: 'HarmonyAdvocate',
    amount: 200,
    label: 'Harmony Advocate',
    description: 'Fund community food programs',
  },
  {
    key: 'UnitySupporter',
    value: 'UnitySupporter',
    amount: 300,
    label: 'Unity Supporter',
    description: 'Enable job training initiatives',
  },
  {
    key: 'HopeBuilder',
    value: 'HopeBuilder',
    amount: 500,
    label: 'Hope Builder',
    description: 'Create sustainable food solutions',
  },
  {
    key: 'CompassionAmbassador',
    value: 'CompassionAmbassador',
    amount: 1000,
    label: 'Compassion Ambassador',
    description: 'Launch micro-enterprise opportunities',
  },
  {
    key: 'LifelineCreator',
    value: 'LifelineCreator',
    amount: 2000,
    label: 'Lifeline Creator',
    description: 'Establish community support centers',
  },
  {
    key: 'EmpowermentLeader',
    value: 'EmpowermentLeader',
    amount: 3000,
    label: 'Empowerment Leader',
    description: 'Develop regional employment programs',
  },
];

export default function NPOs() {
  const api = useApi();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [npos, setNpos] = useState([]);
  const [subscriptionTiers, setSubscriptionTiers] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [subscribing, setSubscribing] = useState(null);
  const [error, setError] = useState(false);
  const { user } = useAuth();

  // Fetch NPOs only once when component mounts
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchNpos = async () => {
      try {
        const data = await api.listNpos();

        if (!isMounted) return;

        if (!data || !data.partners || !Array.isArray(data.partners)) {
          setError(true);
          setLoading(false);
          toast.error('Invalid data received from server');
          return;
        }

        // Process all partners in parallel with Promise.all
        const partnerPromises = data.partners.map(async (partner) => {
          try {
            const config = await downloadConfig(partner.slug);
            return { ...partner, config };
          } catch (err) {
            console.error(`Error downloading config for ${partner.slug}:`, err);
            // Return partner without config rather than failing completely
            return { ...partner, config: {} };
          }
        });

        const processedPartners = await Promise.all(partnerPromises);

        if (!isMounted) return;

        // Initialize subscription tiers
        const initialTiers = {};
        processedPartners.forEach((partner) => {
          initialTiers[partner.slug] = 'Nourisher';
        });

        setNpos(processedPartners);
        setSubscriptionTiers(initialTiers);
      } catch (err) {
        if (!isMounted) return;
        console.error('Error fetching NPOs:', err);
        setError(true);
        toast.error('Unable to load organizations. Please try again later.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchNpos();

    // Cleanup function to prevent state updates if component unmounts
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array to run only once

  const filteredNPOs = npos?.filter((npo) => {
    const matchesSearch =
      npo.organizationName?.toLowerCase().includes(search.toLowerCase()) ||
      false;
    const matchesCategory =
      category === '' || npo.organizationType === category;
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'featured' && npo.featured) ||
      (activeTab === 'recent' && npo.isNew);

    return matchesSearch && matchesCategory && matchesTab;
  });

  const handleSubscriptionTierChange = (npoId, tier) => {
    setSubscriptionTiers((prevTiers) => ({
      ...prevTiers,
      [npoId]: tier,
    }));
  };

  const handleSubscribeClick = async (npo) => {
    const selectedTier = subscriptionTiers[npo.slug];
    const level =
      indexOf(
        selectedTier,
        subscriptionOptions.map((t) => t.key)
      ) + 1;

    if (selectedTier) {
      setSubscribing(npo.slug);
      try {
        const subscription = {
          subscriptionTier: selectedTier,
          userId: user?.user._id,
          firstName: user?.user.firstName,
          lastName: user?.user.lastName,
          email: user?.user.email,
          level,
          parentId: user?.user.parentId || 'noparent',
          partner: {
            id: npo._id,
            name: npo.organizationName,
            slug: npo.slug,
          },
          amount: subscriptionOptions.find(
            (option) => option.key === selectedTier
          )?.amount,
        };
        console.log('user state', user);
        console.log('Subscription data:', subscription);
        await api
          .addSubscription(subscription)
          .then(() => {
            toast.success(
              `You have successfully subscribed to ${npo.organizationName} as a ${selectedTier}`
            );
            setSubscribing(null);
            router.push('/app/subscriptions');
          })
          .catch((error) => {
            setSubscribing(null);
            console.error('Error adding subscription:', error);
            toast.error('Failed to add subscription. Please try again.');
          });
      } catch (error) {
        toast.error('Something went wrong. Please try again.');
        setSubscribing(null);
      }
    } else {
      toast.error('Please select a subscription tier');
    }
  };

  const getSelectedTierDetails = (npoSlug) => {
    const tierKey = subscriptionTiers[npoSlug];
    return subscriptionOptions.find((option) => option.key === tierKey);
  };

  const handleRetry = () => {
    setLoading(true);
    setError(false);
    // Re-fetch data
    api
      .listNpos()
      .then(async (data) => {
        if (!data || !data.partners || !Array.isArray(data.partners)) {
          throw new Error('Invalid data received');
        }

        const partners = data.partners.map(async (partner) => {
          try {
            const config = await downloadConfig(partner.slug);
            return { ...partner, config };
          } catch (err) {
            return { ...partner, config: {} };
          }
        });

        const processedPartners = await Promise.all(partners);

        // Initialize subscription tiers
        const initialTiers = {};
        processedPartners.forEach((partner) => {
          initialTiers[partner.slug] = 'Nourisher';
        });

        setNpos(processedPartners);
        setSubscriptionTiers(initialTiers);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
        toast.error('Unable to load organizations. Please try again later.');
        setLoading(false);
      });
  };

  return (
    <div className='min-h-screen p-4 md:p-6'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4'>
          <div>
            <h1 className='text-3xl font-bold text-gray-100'>
              Support Organizations
            </h1>
            <p className='text-gray-400 mt-1'>
              Choose an organization to support and make a difference
            </p>
          </div>

          <div className='flex flex-col sm:flex-row gap-3'>
            <div className='relative'>
              <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-500' />
              <Input
                placeholder='Search organizations'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='pl-9 bg-gray-800 border-gray-700 text-gray-300 w-full sm:w-[200px] md:w-[250px]'
              />
            </div>

            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className='bg-gray-800 border-gray-700 text-gray-300 w-full sm:w-[180px]'>
                <div className='flex items-center'>
                  <Filter className='mr-2 h-4 w-4' />
                  <SelectValue placeholder='All Categories' />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Categories</SelectItem>
                <SelectItem value='ngo'>NGO</SelectItem>
                <SelectItem value='charity'>Charity</SelectItem>
                <SelectItem value='advocancy-group'>Advocacy Group</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs
          defaultValue='all'
          value={activeTab}
          onValueChange={setActiveTab}
          className='mb-6'
        >
          <TabsList className='bg-gray-800'>
            <TabsTrigger value='all'>All Organizations</TabsTrigger>
            <TabsTrigger value='featured'>Featured</TabsTrigger>
            <TabsTrigger value='recent'>Recently Added</TabsTrigger>
          </TabsList>
        </Tabs>

        {loading ? (
          <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            {[...Array(8)].map((_, index) => (
              <Card key={index} className='bg-gray-800 border-gray-700'>
                <CardHeader className='pb-2'>
                  <Skeleton className='h-24 w-24 rounded-full mx-auto' />
                </CardHeader>
                <CardContent className='space-y-2'>
                  <Skeleton className='h-4 w-3/4 mx-auto' />
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-4 w-2/3' />
                </CardContent>
                <CardFooter>
                  <Skeleton className='h-9 w-full' />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className='text-center py-12'>
            <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-900/20 mb-4'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-8 w-8 text-red-500'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                />
              </svg>
            </div>
            <h3 className='text-xl font-medium text-gray-300 mb-2'>
              Unable to load organizations
            </h3>
            <p className='text-gray-400 max-w-md mx-auto mb-6'>
              We encountered a problem while loading the organizations. This
              could be due to a network issue or server problem.
            </p>
            <Button
              onClick={handleRetry}
              className='bg-gray-700 hover:bg-gray-600'
            >
              <Loader2
                className={`h-4 w-4 mr-2 ${
                  loading ? 'animate-spin' : 'hidden'
                }`}
              />
              Try Again
            </Button>
          </div>
        ) : filteredNPOs.length > 0 ? (
          <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            {filteredNPOs.map((npo, index) => {
              const selectedTier = getSelectedTierDetails(npo.slug);

              return (
                <motion.div
                  key={npo.id || npo.slug || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: Math.min(index * 0.05, 0.5),
                    duration: 0.3,
                  }}
                >
                  <Card className='bg-gray-800 border-gray-700 h-full flex flex-col overflow-hidden hover:border-gray-500 transition-all duration-200'>
                    <CardHeader className='pb-2 pt-4 px-4 flex flex-col items-center'>
                      <div className='relative mb-2'>
                        <img
                          src={
                            npo.config?.brand?.logo ||
                            '/placeholder.svg?height=80&width=80&query=organization'
                          }
                          alt={npo.organizationName}
                          className='rounded-full w-20 h-20 object-cover border-2'
                          style={{
                            borderColor: `#${
                              npo.config?.colors?.primaryColorCode?.replace(
                                'green-',
                                ''
                              ) || '16a34a'
                            }`,
                          }}
                          onError={(e) => {
                            e.target.src = '/interconnected-network.png';
                          }}
                        />
                        {npo.featured && (
                          <Badge className='absolute -top-1 -right-1 bg-yellow-500 text-xs'>
                            Featured
                          </Badge>
                        )}
                      </div>
                      <CardTitle className='text-lg text-center text-gray-100 line-clamp-1'>
                        {npo.organizationName || 'Organization'}
                      </CardTitle>
                      <div className='flex gap-1 mt-1'>
                        <Badge variant='outline' className='text-xs'>
                          {npo.organizationType || 'Charity'}
                        </Badge>
                        {npo.isNew && (
                          <Badge className='bg-green-600 text-xs'>New</Badge>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className='px-4 py-2 flex-grow'>
                      <p className='text-sm text-gray-300 line-clamp-2 mb-2 italic'>
                        "{npo.config?.tagline || 'Making a difference'}"
                      </p>
                      <p className='text-xs text-gray-400 line-clamp-3 mb-3'>
                        {npo.config?.about || 'No description available.'}
                      </p>

                      <div className='mt-auto'>
                        <Select
                          value={subscriptionTiers[npo.slug]}
                          onValueChange={(value) =>
                            handleSubscriptionTierChange(npo.slug, value)
                          }
                        >
                          <SelectTrigger className='w-full bg-gray-700 border-gray-600 text-sm'>
                            <SelectValue placeholder='Select a tier' />
                          </SelectTrigger>
                          <SelectContent>
                            {subscriptionOptions.map((option) => (
                              <SelectItem key={option.key} value={option.key}>
                                <div className='flex justify-between items-center w-full'>
                                  <span>{option.label}</span>
                                  <span className='text-gray-400 ml-2'>
                                    R{option.amount}/mo
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {selectedTier && (
                          <div className='mt-2 text-xs text-gray-400 italic'>
                            {selectedTier.description}
                          </div>
                        )}
                      </div>
                    </CardContent>

                    <CardFooter className='px-4 py-3 border-t border-gray-700'>
                      <div className='w-full'>
                        <Button
                          onClick={() => handleSubscribeClick(npo)}
                          className='w-full flex items-center justify-center gap-1'
                          style={{
                            backgroundColor: `#${
                              npo.config?.colors?.primaryColorCode?.replace(
                                'green-',
                                ''
                              ) || '16a34a'
                            }`,
                            color: 'white',
                          }}
                          disabled={subscribing === npo.slug}
                        >
                          {subscribing === npo.slug ? (
                            <>
                              <Loader2 className='h-4 w-4 animate-spin mr-1' />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Heart className='h-4 w-4 mr-1' />
                              Support with R{selectedTier?.amount}/mo
                            </>
                          )}
                        </Button>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant='ghost'
                                size='sm'
                                className='w-full mt-2 text-gray-400 hover:text-gray-300'
                              >
                                <Info className='h-3 w-3 mr-1' />
                                <span className='text-xs'>Learn more</span>
                                <ArrowRight className='h-3 w-3 ml-1' />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                View detailed information about this
                                organization
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className='text-center py-12'>
            <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4'>
              <Search className='h-8 w-8 text-gray-400' />
            </div>
            <h3 className='text-xl font-medium text-gray-300 mb-2'>
              No organizations found
            </h3>
            <p className='text-gray-400 max-w-md mx-auto'>
              We couldn't find any organizations matching your search criteria.
              Try adjusting your filters or search term.
            </p>
            <Button
              variant='outline'
              className='mt-4'
              onClick={() => {
                setSearch('');
                setCategory('');
                setActiveTab('all');
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
