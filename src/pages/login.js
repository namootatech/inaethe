import { Poppins } from 'next/font/google';
import Layout from '@/components/layout';
import LoginForm from '@/components/loginForm';

const inter = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export default function Home() {
  return (
    <Layout>
      <div className='container h-screen mt-12 md:px-10 md:py-12 px-2 py-2 flex justify-center'>
        <LoginForm />
      </div>
    </Layout>
  );
}
