import { useState, useEffect } from 'react';
import { DashboardCard } from '@/components/ui/app-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { indexOf, keys } from 'ramda';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { downloadConfig } from '@/util/config';

const subscriptionOptions = [
  {
    key: 'Nourisher',
    value: 'Nourisher',
    amount: 50,
    label: 'Nourisher',
  },
  {
    key: 'CaringPartner',
    value: 'CaringPartner',
    amount: 100,
    label: 'Caring Partner',
  },
  {
    key: 'HarmonyAdvocate',
    value: 'HarmonyAdvocate',
    amount: 200,
    label: 'Harmony Advocate',
  },
  {
    key: 'UnitySupporter',
    value: 'UnitySupporter',
    amount: 300,
    label: 'Unity Supporter',
  },
  {
    key: 'HopeBuilder',
    value: 'HopeBuilder',
    amount: 500,
    label: 'Hope Builder',
  },
  {
    key: 'CompassionAmbassador',
    value: 'CompassionAmbassador',
    amount: 1000,
    label: 'Compassion Ambassador',
  },
  {
    key: 'LifelineCreator',
    value: 'LifelineCreator',
    amount: 2000,
    label: 'Lifeline Creator',
  },
  {
    key: 'EmpowermentLeader',
    value: 'EmpowermentLeader',
    amount: 3000,
    label: 'Empowerment Leader',
  },
];

export default function NPOs() {
  const api = useApi();
  const router = useRouter();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [npos, setNpos] = useState([]);
  const [subscriptionTiers, setSubscriptionTiers] = useState({});

  useEffect(() => {
    api
      .listNpos()
      .then(async (data) => {
        const partners = data.partners.map(async (partner) => {
          const config = await downloadConfig(partner.slug);
          return { ...partner, config };
        });
        Promise.all(partners).then((partners) => setNpos(partners));
        partners.forEach((partner) => {
          setSubscriptionTiers((prevTiers) => ({
            ...prevTiers,
            [partner.slug]: 'Nourisher',
          }));
        });
      })
      .catch((err) => {
        console.error(err);
        toast.error('Something went wrong fetching NPOs');
      });
  }, []);
  console.log('npos', npos);

  const filteredNPOs = npos?.filter(
    (npo) =>
      npo.organizationName.toLowerCase().includes(search.toLowerCase()) &&
      (category === '' || npo.organizationType === category)
  );

  const handleSubscriptionTierChange = (npoId, tier) => {
    setSubscriptionTiers((prevTiers) => ({
      ...prevTiers,
      [npoId]: tier,
    }));
  };

  const handleSubscribeClick = (npo) => {
    const selectedTier = subscriptionTiers[npo.slug];
    const level =
      indexOf(
        selectedTier,
        subscriptionOptions.map((t) => t.key)
      ) + 1;
    console.log('user', user);
    console.log('npo', npo);
    console.log('selectedTier', selectedTier);
    if (selectedTier) {
      // Handle the subscription logic here
      console.log(
        `Subscribed to NPO ${npo.slug} with tier ${selectedTier} and level ${level}`
      );
      toast.success(
        `Subscribed to ${npo.slug} with tier ${selectedTier} and level ${level}`
      );
      router.push(
        `/app/subscribe?userId=${
          user.user._id
        }&subscriptionTier=${selectedTier}&firstName=${
          user.user.firstName
        }&lastName=${user.user.lastName}&email=${
          user.user.email
        }&paymentMethod=payfast&agreeToTerms=true&level=${level}&parent=${
          user.user.parent ? user.user.parent : 'superuser'
        }&partner=${npo.slug}&firstPaymentDone=false`
      );
    } else {
      toast.error('Please select a subscription tier');
    }
  };

  return (
    <div className=' min-h-screen p-6'>
      <h1 className='text-4xl font-extrabold mb-6 text-gray-100'>
        NPO Management
      </h1>
      <div className='mb-6 flex flex-wrap gap-4'>
        <Input
          placeholder='Search NPOs'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='max-w-sm bg-gray-800 border-gray-700 text-gray-300'
        />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className='w-[180px] bg-gray-800 border-gray-700 text-gray-300'>
            <SelectValue placeholder='Category' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='All'>All Categories</SelectItem>
            <SelectItem value='ngo'>NGO</SelectItem>
            <SelectItem value='charity'>Charity</SelectItem>
            <SelectItem value='advocancy-group'>Advocacy Group</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className='grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
        {filteredNPOs.map((npo, index) => (
          <motion.div
            key={npo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <DashboardCard
              title={npo.organizationName}
              className={`relative bg-gray-900 p-6 rounded-lg shadow-xl border-2 border-${npo.config.colors.primaryColor}-700 hover:border-${npo.config.colors.primaryColor}-800 hover:border-4 overflow-hidden`}
            >
              {/* <div
                className='absolute inset-0'
                style={{
                  background: `radial-gradient(circle, rgba(255,20,147,0.2) 0%, transparent 60%)`,
                }}
              ></div> */}
              <div className='relative z-10'>
                <div className='flex w-full items-center justify-center mb-4'>
                  <img
                    src={npo.config.brand.logo}
                    alt={npo.organizationName}
                    className={`rounded-full border-4 border-${npo.config.colors.primaryColor}-600 w-40 h-40 object-fit`}
                  />
                </div>
                <p className='text-gray-50 text-xl my-2 font-bold'>
                  {npo.config.tagline}
                </p>
                <p className='text-gray-200 text-base mb-2'>
                  {npo.config.about}
                </p>
                <p className='text-gray-200 mb-2'>
                  <strong>Reg:</strong> {npo.registrationNumber}
                </p>
                <p className='text-gray-200 mb-4'>
                  <strong>Location:</strong> {npo.country}
                </p>
                <select
                  id='subscriptionTier'
                  name='subscriptionTier'
                  className='rounded border p-2 w-full text-gray-900 my-2'
                  onChange={(e) =>
                    handleSubscriptionTierChange(npo.slug, e.target.value)
                  }
                >
                  {subscriptionOptions.map((option) => (
                    <option key={option.key} value={option.value}>
                      {option.label} - R {option.amount} / month
                    </option>
                  ))}
                </select>
                <Button
                  onClick={() => handleSubscribeClick(npo)}
                  className={`w-full bg-${npo.config.colors.primaryColor}-600 text-white hover:bg-${npo.config.colors.primaryColor}-800`}
                >
                  Subscribe
                </Button>
              </div>
            </DashboardCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
