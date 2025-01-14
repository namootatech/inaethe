import Image from 'next/image';
import { Poppins } from 'next/font/google';
import Layout from '@/components/layout';
import SubscriptionForm from '@/components/subscriptionForm';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const inter = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

function SubscribePage() {
  const params = useSearchParams();
  const userData = {};

  for (const [key, value] of params.entries()) {
    userData[key] = value;
  }
  return (
    <div>
      <div className='container mt-4 md:px-10 md:py-10 px-2 py-2'>
        <SubscriptionForm user={userData} />
      </div>
    </div>
  );
}

export default () => {
  <Suspense fallback={<>Loading...</>}>
    <SubscribePage />
  </Suspense>;
};
