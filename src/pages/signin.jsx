import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { useConfig } from '@/context/ConfigContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';

export default function SignIn() {
  const auth = useAuth();
  const siteConfig = useConfig();
  const [userType, setUserType] = useState('subscriber');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const handleSubmit = (e) => {
    e.preventDefault();
    const dashboardByType = userType === 'subscriber' ? 'app' : 'admin';
    auth
      .loginUser({ email, password })
      .then((data) => {
        toast.success('Logged in successfully!');
        router.push(`/${dashboardByType}`);
      })
      .catch((e) => {
        toast.error(`Login failed. ${e}. Please try again.`);
      });
  };
  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-900'>
      <Card className='w-[350px]'>
        <CardHeader>
          <CardTitle className='text-white'>Sign In to Inaethe</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className='space-y-4'>
              <div>
                <label
                  htmlFor='email'
                  className='block text-lg font-medium text-white my-2'
                >
                  Email
                </label>
                <Input
                  id='email'
                  type='email'
                  required
                  className='bg-white text-lg'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor='password'
                  className='block text-lg font-medium text-white my-2'
                >
                  Password
                </label>
                <Input
                  id='password'
                  type='password'
                  required
                  className='bg-white text-lg'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor='userType'
                  className='block text-lg font-medium text-white'
                >
                  User Type
                </label>
                <select
                  id='userType'
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-lg rounded-md'
                >
                  <option value='subscriber'>Subscriber</option>
                  <option value='npo'>NPO Organization</option>
                </select>
              </div>
            </div>
            <Button
              type='submit'
              className={`w-full mt-4 bg-${siteConfig.colors.primaryColor}-500 text-lg text-white`}
            >
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className='text-lg text-center w-full'>
            Don't have an account?{' '}
            <a href='/register' className='text-primary hover:underline'>
              Register here
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
