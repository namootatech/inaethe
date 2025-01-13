import { useState } from 'react';
import { DashboardCard } from '@/components/ui/app-card';
import { StatCard } from '@/components/ui/stat-card';
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
import { DollarSign, TrendingUp } from 'lucide-react';
const transactions = [
  { id: 1, date: '2023-07-01', type: 'Referral Commission', amount: 50 },
  { id: 2, date: '2023-07-05', type: 'Subscription Reward', amount: 25 },
  { id: 3, date: '2023-07-10', type: 'Referral Commission', amount: 75 },
  { id: 4, date: '2023-07-15', type: 'Subscription Reward', amount: 30 },
];
export default function Earnings() {
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const handleWithdrawal = (e) => {
    e.preventDefault();
    // Implement withdrawal logic here
    console.log('Withdrawal requested:', withdrawalAmount);
  };
  return (
    <div>
      <h1 className='text-3xl font-bold mb-6 text-gray-100'>Earnings</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
        <StatCard
          title='Total Earnings'
          value='$1,234'
          icon={<DollarSign className='h-4 w-4 text-pink-700' />}
        />
        <StatCard
          title='Available Balance'
          value='$789'
          icon={<TrendingUp className='h-4 w-4 text-pink-700' />}
        />
      </div>
      <DashboardCard title='Withdrawal Request'>
        <form onSubmit={handleWithdrawal} className='space-y-4'>
          <Input
            type='number'
            placeholder='Enter amount'
            value={withdrawalAmount}
            onChange={(e) => setWithdrawalAmount(e.target.value)}
            className='bg-gray-800 border-gray-700 text-gray-300'
          />
          <Button
            type='submit'
            className='w-full bg-pink-700 text-white hover:bg-pink-800'
          >
            Request Withdrawal
          </Button>
        </form>
      </DashboardCard>
      <DashboardCard title='Transaction History' className='mt-6'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='text-gray-300'>Date</TableHead>
              <TableHead className='text-gray-300'>Type</TableHead>
              <TableHead className='text-right text-gray-300'>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className='font-medium text-gray-300'>
                  {transaction.date}
                </TableCell>
                <TableCell className='text-gray-300'>
                  {transaction.type}
                </TableCell>
                <TableCell className='text-right text-gray-300'>
                  ${transaction.amount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DashboardCard>
    </div>
  );
}
