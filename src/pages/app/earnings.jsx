import { useEffect, useState } from 'react';
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
import { useApi } from '@/context/ApiContext';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext'; // Assuming you have a Spinner component

export default function Earnings() {
  const api = useApi();
  const { user } = useAuth();
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [earnings, setEarnings] = useState({});
  const [loading, setLoading] = useState(true);

  const handleWithdrawal = (e) => {
    e.preventDefault();

    const newRequest = {
      amount: withdrawalAmount,
      userId: user._id,
      email: user.email,
      createdAt: new Date(),
    };

    api
      .createWithdrawalRequest(newRequest)
      .then((data) => {
        toast.success('Withdrawal request submitted successfully');
        setWithdrawalRequests([...withdrawalRequests, newRequest]);
        setWithdrawalAmount('');
      })
      .catch((error) => {
        console.error('Error creating withdrawal request:', error);
        toast.error(`Error creating withdrawal request: ${error}`);
      });
  };

  useEffect(() => {
    let isMounted = true; // Track if the component is mounted

    if (user && api) {
      setLoading(true);

      Promise.all([
        api.getUserTransactions(user.user._id, 1, 10),
        api.getUserWithdrawalRequests(user.user._id, 1, 10),
        api.getUserEarnings(user.user._id, 1, 10),
      ])
        .then(([transactionsData, withdrawalRequestsData, earningsData]) => {
          if (isMounted) {
            setTransactions(transactionsData);
            setWithdrawalRequests(withdrawalRequestsData);
            setEarnings(earningsData);
          }
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          toast.error(`Error fetching data: ${error}`);
        })
        .finally(() => {
          if (isMounted) {
            setLoading(false);
          }
        });
    }

    return () => {
      isMounted = false; // Cleanup function to set isMounted to false
    };
  }, [user]);

  console.log('USER', user);
  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        Loading...
      </div>
    );
  }

  return (
    <div>
      <h1 className='text-3xl font-bold mb-6 text-gray-100'>Earnings</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
        <StatCard
          title='Total Earnings'
          value={`$${earnings.totalEarnings || 0}`}
          icon={<DollarSign className='h-4 w-4 text-pink-700' />}
        />
        <StatCard
          title='Available Balance'
          value={`$${earnings.availableBalance || 0}`}
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
      <div className='grid grid-cols-2 gap-4 my-4'>
        <DashboardCard title='Transaction History' className='mt-6'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='text-gray-300'>Date</TableHead>
                <TableHead className='text-gray-300'>Type</TableHead>
                <TableHead className='text-right text-gray-300'>
                  Amount
                </TableHead>
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
        <DashboardCard title='Withdrawal History' className='mt-6'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='text-gray-300'>Date</TableHead>
                <TableHead className='text-gray-300'>Type</TableHead>
                <TableHead className='text-right text-gray-300'>
                  Amount
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {withdrawalRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className='font-medium text-gray-300'>
                    {request.createdAt}
                  </TableCell>
                  <TableCell className='text-right text-gray-300'>
                    ${request.amount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DashboardCard>
      </div>
    </div>
  );
}
