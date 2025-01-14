import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
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
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useApi } from '@/context/ApiContext';

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

export default function Register() {
  const api = useApi();
  const siteConfig = useConfig();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    subscriptionTier: 'Nourisher',
    amount: 50,
    partner: {
      name: siteConfig?.partnerName,
      slug: siteConfig?.organisationId,
    },
  });
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [termsError, setTermsError] = useState('');
  const [canSubmit, setCanSubmit] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      amount:
        name === 'subscriptionTier' ? levelPrices[value] : prevData.amount,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    console.log('Form submitted:', formData);
    setTimeout(() => {
      setLoading(false);
      api
        .register(formData)
        .then((response) => {
          console.log(response);
          setError(null);
        })
        .catch((e) => {
          console.error(e);
          setError(e.message);
          setLoading(false);
        });
      // Handle success or error
      // router.push('/dashboard');
    }, 2000);
  };

  const toggleTerms = () => {
    setFormData((prevData) => ({
      ...prevData,
      agreeToTerms: !prevData.agreeToTerms,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    setEmailError(
      !emailPattern.test(formData.email) && formData.email !== ''
        ? 'Please enter a valid email address.'
        : ''
    );

    setPasswordError(
      formData.password !== formData.confirmPassword
        ? 'Passwords do not match.'
        : ''
    );

    setTermsError(
      !formData.agreeToTerms
        ? 'You must agree to the terms and conditions.'
        : ''
    );

    setCanSubmit(
      emailPattern.test(formData.email) &&
        formData.password === formData.confirmPassword &&
        formData.agreeToTerms
    );
  }, [formData]);

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8'>
      <div className='max-w-4xl mx-auto text-center mb-12 mt-6'>
        <h1 className='text-4xl font-bold text-white mb-4'>
          Join Inaethe - Be a Hope Builder!
        </h1>
        <p className='text-xl text-gray-300'>
          Subscribe with Inaethe, and join us in our mission to help save the
          world. Choose a subscription tier and start making a real difference
          today.
        </p>
      </div>

      <Card className='w-full max-w-2xl bg-white shadow-xl border-0 rounded-lg overflow-hidden my-4'>
        <CardHeader
          className={`bg-${siteConfig.colors.accentColor}-900 text-white p-6`}
        >
          <CardTitle className='text-2xl font-semibold'>
            Register for Ina-ethe
          </CardTitle>
        </CardHeader>
        <CardContent className='p-6'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label
                  htmlFor='firstName'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  First Name
                </label>
                <Input
                  id='firstName'
                  name='firstName'
                  type='text'
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label
                  htmlFor='lastName'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Last Name
                </label>
                <Input
                  id='lastName'
                  name='lastName'
                  type='text'
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label
                  htmlFor='confirmPassword'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Confirm Password
                </label>
                <Input
                  id='confirmPassword'
                  name='confirmPassword'
                  type='password'
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                {passwordError && (
                  <p className='mt-1 text-sm text-red-600'>{passwordError}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Password
                </label>
                <div className='relative'>
                  <Input
                    id='password'
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    required
                    className='pr-10'
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <button
                    type='button'
                    className='absolute inset-y-0 right-0 pr-3 flex items-center'
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOffIcon className='h-5 w-5 text-gray-400' />
                    ) : (
                      <EyeIcon className='h-5 w-5 text-gray-400' />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Email
                </label>
                <Input
                  id='email'
                  name='email'
                  type='email'
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {emailError && (
                  <p className='mt-1 text-sm text-red-600'>{emailError}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor='subscriptionTier'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Subscription Tier
                </label>
                <select
                  id='subscriptionTier'
                  name='subscriptionTier'
                  value={formData.subscriptionTier}
                  onChange={handleInputChange}
                  className='border border-solid b p-2 mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md'
                >
                  {Object.entries(levelPrices).map(([tier, price]) => (
                    <option key={tier} value={tier}>
                      {tier} Level (R{price}/month)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className='flex items-center'>
              <input
                id='agreeToTerms'
                name='agreeToTerms'
                type='checkbox'
                className='h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded'
                checked={formData.agreeToTerms}
                onChange={toggleTerms}
              />
              <label
                htmlFor='agreeToTerms'
                className='ml-2 block text-sm text-gray-900'
              >
                I agree to the{' '}
                <Link
                  href='/terms'
                  className='text-pink-600 hover:text-pink-500'
                >
                  Terms and Conditions
                </Link>
              </label>
            </div>
            {termsError && <p className='text-sm text-red-600'>{termsError}</p>}
            {error && <p className='text-sm text-red-600'>{error}</p>}
            <Button
              type='submit'
              className='w-full bg-pink-600 text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500'
              disabled={!canSubmit || loading}
            >
              {loading ? (
                <>
                  <svg
                    className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                  Loading...
                </>
              ) : (
                'Subscribe'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className='bg-gray-50 px-6 py-4'>
          <p className='text-sm text-center w-full text-gray-600'>
            Already have an account?{' '}
            <Link
              href='/signin'
              className='font-medium text-pink-600 hover:text-pink-500'
            >
              Sign in here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
