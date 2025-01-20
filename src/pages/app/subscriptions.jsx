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
// const subscriptions = [
//   {
//     id: 1,
//     npo: 'Save the Oceans',
//     tier: 'Gold',
//     amount: 50,
//     renewalDate: '2023-08-15',
//   },
//   {
//     id: 2,
//     npo: 'Educate for Future',
//     tier: 'Silver',
//     amount: 25,
//     renewalDate: '2023-09-01',
//   },
//   {
//     id: 3,
//     npo: 'Green Earth Initiative',
//     tier: 'Bronze',
//     amount: 10,
//     renewalDate: '2023-08-30',
//   },
// ];
export default function Subscriptions() {
  const [subscriptions, setSubs] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const { subscriptions } = user;
      setSubs(subscriptions);
    }
  }, [user]);

  const cleanSubscriptions = subscriptions.map((s) => ({
    id: s['_id'],
    npo: s.partner.name,
    amount: s.amount,
    tier: s.subscriptionTier,
    createDate: moment(s.createdDate).format('DD MMM YYYY'),
  }));

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
              <div className='space-x-2'>
                <Button variant='destructive'>Cancel</Button>
              </div>
            </div>
          </DashboardCard>
        ))}
      </div>
    </div>
  );
}
