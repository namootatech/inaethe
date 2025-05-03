'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useConfig } from '@/context/ConfigContext';
import {
  EyeIcon,
  EyeOffIcon,
  CheckCircle,
  AlertCircle,
  Info,
} from 'lucide-react';
import { useApi } from '@/context/ApiContext';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { assoc } from 'ramda';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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

const levelDescriptions = {
  Nourisher: 'Provide essential meals to those in need',
  CaringPartner: 'Support food security for families',
  HarmonyAdvocate: 'Fund community food programs',
  UnitySupporter: 'Enable job training initiatives',
  HopeBuilder: 'Create sustainable food solutions',
  CompassionAmbassador: 'Launch micro-enterprise opportunities',
  LifelineCreator: 'Establish community support centers',
  EmpowermentLeader: 'Develop regional employment programs',
  SustainabilityChampion: 'Create lasting infrastructure for communities',
  GlobalImpactVisionary: 'Transform entire regions with comprehensive support',
};

export default function Register() {
  const api = useApi();
  const auth = useAuth();
  const siteConfig = useConfig();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    subscriptionTier: 'Nourisher',
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
  const [activeTab, setActiveTab] = useState('account');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      amount:
        name === 'subscriptionTier' ? levelPrices[value] : prevData.amount,
    }));

    // Check password strength when password changes
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  useEffect(() => {
    const fetchPartnerId = async () => {
      try {
        const response = await api.getPartnerId(formData.partner.slug);
        setFormData((prevData) => ({
          ...prevData,
          partner: {
            ...prevData.partner,
            id: response.data,
          },
        }));
      } catch (error) {
        console.error('Error fetching partner ID:', error);
      }
    };
    if (formData.partner.slug) {
      fetchPartnerId();
    }
  }, [formData.partner.slug]);

  const handleSelectChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      subscriptionTier: value,
      amount: levelPrices[value],
    }));
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.register(
        assoc('parentId', auth.parent, formData)
      );
      console.log(response);
      setError(null);
      toast.success(
        'Registration Successful! Check your email for confirmation.'
      );
      setTimeout(() => {
        router.push('/app');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
      toast.error(`Registration failed. ${err.message || 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleTerms = (checked) => {
    setFormData((prevData) => ({
      ...prevData,
      agreeToTerms: checked,
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
      formData.password !== formData.confirmPassword &&
        formData.confirmPassword !== ''
        ? 'Passwords do not match.'
        : ''
    );

    setTermsError(
      !formData.agreeToTerms
        ? 'You must agree to the terms and conditions.'
        : ''
    );

    setCanSubmit(
      formData.firstName !== '' &&
        formData.lastName !== '' &&
        emailPattern.test(formData.email) &&
        formData.password.length >= 8 &&
        formData.password === formData.confirmPassword &&
        formData.agreeToTerms
    );
  }, [formData]);

  console.log('parent', auth.parent);

  return (
    <div className='min-h-screen bg-gradient-to-b from-pink-900 to-pink-800 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12'>
      <div className='max-w-4xl mx-auto text-center mb-8'>
        <h1 className='text-4xl font-bold text-white mb-4'>
          Join Inaethe & Make an Impact
        </h1>
        <p className='text-xl text-pink-100 max-w-3xl mx-auto'>
          Inaethe was born from a deep desire to tackle hunger and unemployment
          in Africa. We unite generosity with opportunity, creating a space
          where non-profits can thrive and individuals can earn while making a
          real difference.
        </p>
      </div>

      <div className='w-full max-w-4xl grid md:grid-cols-5 gap-6'>
        {/* Left side - Impact information */}
        <div className='md:col-span-2 space-y-6'>
          <Card className='bg-white/10 backdrop-blur-sm border-0 text-white shadow-xl'>
            <CardHeader>
              <CardTitle className='text-yellow-300'>Your Impact</CardTitle>
              <CardDescription className='text-pink-100'>
                When you join Inaethe, you're not just subscribing - you're
                changing lives.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <h3 className='font-medium text-yellow-200'>Fight Hunger</h3>
                <p className='text-sm text-pink-100'>
                  Your subscription helps provide nutritious meals to
                  communities in need.
                </p>
              </div>
              <div className='space-y-2'>
                <h3 className='font-medium text-yellow-200'>Create Jobs</h3>
                <p className='text-sm text-pink-100'>
                  We create employment opportunities through our referral
                  program.
                </p>
              </div>
              <div className='space-y-2'>
                <h3 className='font-medium text-yellow-200'>
                  Earn While Giving
                </h3>
                <p className='text-sm text-pink-100'>
                  Refer others and earn income while contributing to meaningful
                  change.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className='bg-white/10 backdrop-blur-sm border-0 text-white shadow-xl'>
            <CardHeader>
              <CardTitle className='text-yellow-300'>How It Works</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-start space-x-3'>
                <div className='bg-yellow-400 rounded-full p-1 mt-0.5'>
                  <span className='text-pink-900 font-bold text-xs'>1</span>
                </div>
                <p className='text-sm text-pink-100'>
                  Choose your subscription tier based on the impact you want to
                  make
                </p>
              </div>
              <div className='flex items-start space-x-3'>
                <div className='bg-yellow-400 rounded-full p-1 mt-0.5'>
                  <span className='text-pink-900 font-bold text-xs'>2</span>
                </div>
                <p className='text-sm text-pink-100'>
                  Create your account and set up your profile
                </p>
              </div>
              <div className='flex items-start space-x-3'>
                <div className='bg-yellow-400 rounded-full p-1 mt-0.5'>
                  <span className='text-pink-900 font-bold text-xs'>3</span>
                </div>
                <p className='text-sm text-pink-100'>
                  Share your referral link to help others join the movement
                </p>
              </div>
              <div className='flex items-start space-x-3'>
                <div className='bg-yellow-400 rounded-full p-1 mt-0.5'>
                  <span className='text-pink-900 font-bold text-xs'>4</span>
                </div>
                <p className='text-sm text-pink-100'>
                  Earn income from your network while creating positive change
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right side - Registration form */}
        <Card className='md:col-span-3 bg-white shadow-xl border-0 rounded-lg overflow-hidden'>
          <CardHeader className='bg-pink-700 text-white p-6'>
            <CardTitle className='text-2xl font-semibold flex items-center'>
              <span>Register for Inaethe</span>
              <div className='ml-auto bg-yellow-400 text-pink-900 text-xs font-bold px-2 py-1 rounded'>
                Make a Difference
              </div>
            </CardTitle>
            <CardDescription className='text-pink-100'>
              Create your account and start your journey with us
            </CardDescription>
          </CardHeader>

          <CardContent className='p-6'>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className='w-full'
            >
              <TabsList className='grid w-full grid-cols-2 mb-6'>
                <TabsTrigger
                  value='account'
                  className='text-black bg-gray-200 data-[state=active]:bg-gray-900'
                >
                  Account Details
                </TabsTrigger>
                <TabsTrigger
                  value='subscription'
                  className='bg-pink-200 data-[state=active]:bg-gray-900'
                >
                  Subscription
                </TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit} className='space-y-6'>
                <TabsContent value='account' className='space-y-6'>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='firstName'>First Name</Label>
                      <Input
                        id='firstName'
                        name='firstName'
                        type='text'
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder='Enter your first name'
                        className='focus:ring-pink-500 focus:border-pink-500'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='lastName'>Last Name</Label>
                      <Input
                        id='lastName'
                        name='lastName'
                        type='text'
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder='Enter your last name'
                        className='focus:ring-pink-500 focus:border-pink-500'
                      />
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='email'>Email Address</Label>
                    <Input
                      id='email'
                      name='email'
                      type='email'
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder='you@example.com'
                      className={`focus:ring-pink-500 focus:border-pink-500 ${
                        emailError ? 'border-red-500' : ''
                      }`}
                    />
                    {emailError && (
                      <p className='text-sm text-red-600 flex items-center mt-1'>
                        <AlertCircle className='h-4 w-4 mr-1' />
                        {emailError}
                      </p>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='password'>Password</Label>
                    <div className='relative'>
                      <Input
                        id='password'
                        name='password'
                        type={showPassword ? 'text' : 'password'}
                        required
                        className='pr-10 focus:ring-pink-500 focus:border-pink-500'
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder='Create a secure password'
                      />
                      <button
                        type='button'
                        className='absolute inset-y-0 right-0 pr-3 flex items-center'
                        onClick={togglePasswordVisibility}
                        aria-label={
                          showPassword ? 'Hide password' : 'Show password'
                        }
                      >
                        {showPassword ? (
                          <EyeOffIcon className='h-5 w-5 text-gray-400' />
                        ) : (
                          <EyeIcon className='h-5 w-5 text-gray-400' />
                        )}
                      </button>
                    </div>

                    {/* Password strength indicator */}
                    {formData.password && (
                      <div className='mt-2'>
                        <div className='flex items-center mb-1'>
                          <span className='text-xs text-gray-600 mr-2'>
                            Password strength:
                          </span>
                          <div className='h-2 flex-1 bg-gray-200 rounded-full overflow-hidden'>
                            <div
                              className={`h-full ${
                                passwordStrength === 0
                                  ? 'bg-red-500'
                                  : passwordStrength === 1
                                  ? 'bg-orange-500'
                                  : passwordStrength === 2
                                  ? 'bg-yellow-500'
                                  : passwordStrength === 3
                                  ? 'bg-pink-400'
                                  : 'bg-pink-600'
                              }`}
                              style={{ width: `${passwordStrength * 25}%` }}
                            ></div>
                          </div>
                        </div>
                        <ul className='text-xs text-gray-600 space-y-1'>
                          <li
                            className={`flex items-center ${
                              formData.password.length >= 8
                                ? 'text-pink-600'
                                : 'text-gray-500'
                            }`}
                          >
                            {formData.password.length >= 8 ? (
                              <CheckCircle className='h-3 w-3 mr-1' />
                            ) : (
                              <Info className='h-3 w-3 mr-1' />
                            )}
                            At least 8 characters
                          </li>
                          <li
                            className={`flex items-center ${
                              /[A-Z]/.test(formData.password)
                                ? 'text-pink-600'
                                : 'text-gray-500'
                            }`}
                          >
                            {/[A-Z]/.test(formData.password) ? (
                              <CheckCircle className='h-3 w-3 mr-1' />
                            ) : (
                              <Info className='h-3 w-3 mr-1' />
                            )}
                            At least one uppercase letter
                          </li>
                          <li
                            className={`flex items-center ${
                              /[0-9]/.test(formData.password)
                                ? 'text-pink-600'
                                : 'text-gray-500'
                            }`}
                          >
                            {/[0-9]/.test(formData.password) ? (
                              <CheckCircle className='h-3 w-3 mr-1' />
                            ) : (
                              <Info className='h-3 w-3 mr-1' />
                            )}
                            At least one number
                          </li>
                          <li
                            className={`flex items-center ${
                              /[^A-Za-z0-9]/.test(formData.password)
                                ? 'text-pink-600'
                                : 'text-gray-500'
                            }`}
                          >
                            {/[^A-Za-z0-9]/.test(formData.password) ? (
                              <CheckCircle className='h-3 w-3 mr-1' />
                            ) : (
                              <Info className='h-3 w-3 mr-1' />
                            )}
                            At least one special character
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='confirmPassword'>Confirm Password</Label>
                    <Input
                      id='confirmPassword'
                      name='confirmPassword'
                      type='password'
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder='Confirm your password'
                      className={`focus:ring-pink-500 focus:border-pink-500 ${
                        passwordError ? 'border-red-500' : ''
                      }`}
                    />
                    {passwordError && (
                      <p className='text-sm text-red-600 flex items-center mt-1'>
                        <AlertCircle className='h-4 w-4 mr-1' />
                        {passwordError}
                      </p>
                    )}
                  </div>

                  <div className='flex items-center space-x-2'>
                    <Checkbox
                      id='agreeToTerms'
                      checked={formData.agreeToTerms}
                      onCheckedChange={toggleTerms}
                      className='data-[state=checked]:bg-pink-600 data-[state=checked]:border-pink-600'
                    />
                    <Label
                      htmlFor='agreeToTerms'
                      className='text-sm text-gray-700 cursor-pointer'
                    >
                      I agree to the{' '}
                      <Link
                        href='/terms'
                        className='text-pink-600 hover:text-pink-500 underline'
                      >
                        Terms and Conditions
                      </Link>
                    </Label>
                  </div>
                  {termsError && !formData.agreeToTerms && (
                    <p className='text-sm text-red-600 flex items-center'>
                      <AlertCircle className='h-4 w-4 mr-1' />
                      {termsError}
                    </p>
                  )}

                  <Button
                    type='button'
                    onClick={() => setActiveTab('subscription')}
                    className='w-full bg-pink-600 hover:bg-pink-700 text-white'
                  >
                    Continue to Subscription
                  </Button>
                </TabsContent>

                <TabsContent value='subscription' className='space-y-6'>
                  <div className='space-y-4'>
                    <Label htmlFor='subscriptionTier'>
                      Choose Your Impact Level
                    </Label>
                    <Select
                      value={formData.subscriptionTier}
                      onValueChange={handleSelectChange}
                    >
                      <SelectTrigger className='w-full focus:ring-pink-500 focus:border-pink-500'>
                        <SelectValue placeholder='Select a subscription tier' />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(levelPrices).map(([tier, price]) => (
                          <SelectItem key={tier} value={tier}>
                            {tier} (R{price}/month)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className='bg-pink-50 p-4 rounded-lg border border-pink-100'>
                      <h3 className='font-medium text-pink-800 mb-2'>
                        {formData.subscriptionTier} Impact
                      </h3>
                      <p className='text-sm text-pink-700'>
                        {levelDescriptions[formData.subscriptionTier]}
                      </p>
                      <div className='mt-3 flex items-center justify-between'>
                        <span className='text-sm text-gray-600'>
                          Monthly contribution:
                        </span>
                        <span className='font-bold text-pink-700'>
                          R{levelPrices[formData.subscriptionTier]}
                        </span>
                      </div>
                    </div>

                    <Alert className='bg-yellow-50 border-yellow-200'>
                      <Info className='h-4 w-4 text-yellow-600' />
                      <AlertTitle className='text-yellow-800'>
                        Earn while you give
                      </AlertTitle>
                      <AlertDescription className='text-yellow-700 text-sm'>
                        When you refer others to join Inaethe, you'll earn a
                        percentage of their subscription as income.
                      </AlertDescription>
                    </Alert>
                  </div>

                  <div className='flex gap-3'>
                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => setActiveTab('account')}
                      className='flex-1'
                    >
                      Back
                    </Button>
                    <Button
                      type='submit'
                      className='flex-1 bg-pink-600 hover:bg-pink-700 text-white'
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
                          Processing...
                        </>
                      ) : (
                        'Complete Registration'
                      )}
                    </Button>
                  </div>

                  {error && (
                    <Alert variant='destructive' className='mt-4'>
                      <AlertCircle className='h-4 w-4' />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                </TabsContent>
              </form>
            </Tabs>
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
    </div>
  );
}
