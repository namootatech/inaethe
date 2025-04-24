'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-hot-toast';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';

const schema = yup.object().shape({
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup.string().required('Password is required'),
});

const InputField = ({
  register,
  name,
  label,
  type = 'text',
  icon: Icon,
  error,
}) => (
  <div className='relative'>
    <label
      htmlFor={name}
      className='block text-lg font-medium text-gray-300 mb-1'
    >
      {label}
    </label>
    <div className='relative rounded-md shadow-sm'>
      <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
        <Icon className='h-5 w-5 text-gray-400' aria-hidden='true' />
      </div>
      <input
        {...register(name)}
        type={type}
        id={name}
        className='block w-full pl-10 py-3 px-6 sm:text-lg rounded-md bg-gray-700 border-gray-600 text-white focus:ring-teal-500 focus:border-teal-500'
      />
    </div>
    {error && <p className='mt-1 text-sm text-red-500'>{error.message}</p>}
  </div>
);

const NpoLoginForm = () => {
  const router = useRouter();
  const auth = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await auth.loginPartner(data); // Adjust API call to your context
      toast.success('Login successful!');
      router.push('/npo-dashboard'); // Adjust as needed
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10'>
      <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
        <InputField
          register={register}
          name='email'
          label='Email'
          type='email'
          icon={EnvelopeIcon}
          error={errors.email}
        />
        <InputField
          register={register}
          name='password'
          label='Password'
          type='password'
          icon={LockClosedIcon}
          error={errors.password}
        />
        <div>
          <button
            type='submit'
            disabled={isSubmitting}
            className='w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500'
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NpoLoginForm;
