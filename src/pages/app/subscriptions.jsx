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
import { useAuth } from '@/context/AuthContext';
import moment from 'moment';
import { postToURL } from '@/components/payfast/payfast';
import { v4 as uuidv4 } from 'uuid';
import { keys } from 'ramda';

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

export default function Subscriptions() {
  const [subscriptions, setSubs] = useState([]);
  const { user } = useAuth();
  console.log('USER', user);
  useEffect(() => {
    if (user) {
      const { subscriptions } = user;
      setSubs(subscriptions);
    }
  }, [user]);

  const cleanSubscriptions = subscriptions?.map((s) => ({
    id: s['_id'],
    npo: s.partner.name,
    amount: s.amount,
    tier: s.subscriptionTier,
    createDate: moment(s.createdDate).format('DD MMM YYYY'),
  }));

  const paySubscription = (sub) => {
    console.log('SUB', sub);
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
      cancel_url: `${WEBSITE_URL}/app/cancel?subscriptionId=${sub.id}&userId=${
        userData._id
      }&subscriptionTier=${sub.tier}&amount=${
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
      frequency: 3, //what is this?
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
    console.log('PAYFAST DATA', payfastData);
    postToURL(PAYFAST_URL, payfastData);
  };
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('date');
  const filteredSubscriptions = cleanSubscriptions.filter((sub) =>
    sub.npo.toLowerCase().includes(filter.toLowerCase())
  );
  const sortedSubscriptions = [...filteredSubscriptions].sort((a, b) => {
    if (sort === 'date')
      return (
        new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime()
      );
    if (sort === 'amount') return b.amount - a.amount;
    return 0;
  });
  console.log('SORTED', sortedSubscriptions);
  return (
    <div>
      <h1 className='text-3xl font-bold mb-6 text-gray-100'>
        Subscriptions Management
      </h1>
      <div className='mb-6 flex flex-wrap gap-4'>
        <Input
          placeholder='Filter by NPO name'
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className='max-w-sm bg-gray-800 border-gray-700 text-gray-300'
        />
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className='w-[180px] bg-gray-800 border-gray-700 text-gray-300'>
            <SelectValue placeholder='Sort by' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='date'>Sort by Date</SelectItem>
            <SelectItem value='amount'>Sort by Amount</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className='grid gap-6'>
        {sortedSubscriptions.map((sub) => (
          <DashboardCard key={sub.id} title={sub.npo}>
            <div className='flex justify-between items-center'>
              <div>
                <p className='text-gray-300'>Tier: {sub.tier}</p>
                <p className='text-gray-300'>Amount: R {sub.amount}</p>
                <p className='text-gray-300'>Create Date: {sub.createDate}</p>
              </div>
              <div className='space-x-2'></div>
              <div className='space-x-2 flex '>
                <Button
                  variant='destructive bg-fuchsia-500 text-white'
                  className='bg-white text-pink-700 hover:bg-pink-200 hover:text-white'
                  onClick={() => paySubscription(sub)}
                >
                  Make Payment
                </Button>
                <Button
                  variant='destructive'
                  className='bg-pink-500 text-white hover:bg-pink-800'
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DashboardCard>
        ))}
      </div>
    </div>
  );
}
