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
export default function SignIn() {
  const [userType, setUserType] = useState('subscriber');
  const router = useRouter();
  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement sign-in logic here
    router.push(`/app/${userType}`);
  };
  return (
    <div className='flex items-center justify-center min-h-screen bg-background'>
      <Card className='w-[350px]'>
        <CardHeader>
          <CardTitle>Sign In to Ina-ethe</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className='space-y-4'>
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-white'
                >
                  Email
                </label>
                <Input id='email' type='email' required />
              </div>
              <div>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium text-white'
                >
                  Password
                </label>
                <Input id='password' type='password' required />
              </div>
              <div>
                <label
                  htmlFor='userType'
                  className='block text-sm font-medium text-white'
                >
                  User Type
                </label>
                <select
                  id='userType'
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md'
                >
                  <option value='subscriber'>Subscriber</option>
                  <option value='npo'>NPO Organization</option>
                </select>
              </div>
            </div>
            <Button type='submit' className='w-full mt-4'>
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className='text-sm text-center w-full'>
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
