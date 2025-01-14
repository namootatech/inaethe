'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-hot-toast';
import {
  EnvelopeIcon,
  LockClosedIcon,
  BuildingOfficeIcon,
  IdentificationIcon,
  GlobeAltIcon,
  PhoneIcon,
  UserIcon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline';
import { useConfig } from '@/context/ConfigContext';
import { useApi } from '@/context/ApiContext';

const schema = yup.object().shape({
  organizationName: yup.string().required('Organization name is required'),
  registrationNumber: yup.string().required('Registration number is required'),
  organizationType: yup.string().required('Organization type is required'),
  country: yup.string().required('Country is required'),
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  phone: yup
    .string()
    .matches(/^\d{10,}$/, 'Phone number must be at least 10 digits'),
  representativeName: yup.string().required('Representative name is required'),
  representativeRole: yup.string().required('Representative role is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
  agreeTerms: yup
    .boolean()
    .oneOf([true], 'You must agree to the terms and conditions'),
});

const InputField = ({
  register,
  name,
  label,
  type = 'text',
  icon: Icon,
  className,
  error,
  ...rest
}) => (
  <div className={`relative ${className}`}>
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
        {...rest}
      />
    </div>
    {error && <p className='mt-1 text-sm text-red-500'>{error.message}</p>}
  </div>
);

const SelectField = ({
  register,
  name,
  label,
  options,
  icon: Icon,
  error,
  ...rest
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
      <select
        {...register(name)}
        id={name}
        className='block w-full pl-10 py-4 px-4 sm:text-sm rounded-md bg-gray-700 border-gray-600 text-white text-lg focus:ring-teal-500 focus:border-teal-500'
        {...rest}
      >
        <option value=''>Select {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
    {error && <p className='mt-1 text-sm text-red-500'>{error.message}</p>}
  </div>
);

const NpoRegistrationForm = () => {
  const api = useApi();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const siteConfig = useConfig();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    console.log(data);
    setIsSubmitting(true);
    try {
      // Simulating API call
      api
        .addNpo(data)
        .then((response) => {
          toast.success(
            'Registration Successful! Check your email for confirmation.'
          );
        })
        .catch((error) => {
          toast.error(`Registration failed. ${error}. Please try again. `);
        });

      toast.success(
        'Registration Successful! Check your email for confirmation.'
      );
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10'>
      <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
        <div className='grid grid-cols-1 gap-y-6 gap-x-4 md:grid-cols-2 lg:grid-cols-3'>
          <InputField
            register={register}
            name='organizationName'
            label='Organization Name'
            icon={BuildingOfficeIcon}
            className='col-span-3'
            error={errors.organizationName}
          />
          <InputField
            register={register}
            name='registrationNumber'
            label='Registration Number'
            icon={IdentificationIcon}
            error={errors.registrationNumber}
          />
          <SelectField
            register={register}
            name='organizationType'
            label='Type of Organization'
            icon={BriefcaseIcon}
            error={errors.organizationType}
            options={[
              { value: 'charity', label: 'Charity' },
              { value: 'ngo', label: 'NGO' },
              { value: 'advocacy', label: 'Advocacy Group' },
            ]}
          />
          <SelectField
            register={register}
            name='country'
            label='Country'
            icon={GlobeAltIcon}
            error={errors.country}
            options={[
              { value: 'mozambique', label: 'Mozambique' },
              { value: 'botswana', label: 'Botswana' },
              { value: 'namibia', label: 'Namibia' },
              { value: 'south-africa', label: 'South Africa' },
              { value: 'lesotho', label: 'Lesotho' },
              { value: 'swaziland', label: 'Swaziland' },
              { value: 'zimbabwe', label: 'Zimbabwe' },
              { value: 'mali', label: 'Zambia' },
            ]}
          />
          <InputField
            register={register}
            name='email'
            label='Primary Email Address'
            type='email'
            icon={EnvelopeIcon}
            error={errors.email}
          />
          <InputField
            register={register}
            name='phone'
            label='Primary Phone Number'
            type='tel'
            icon={PhoneIcon}
            error={errors.phone}
          />
          <InputField
            register={register}
            name='representativeName'
            label='Representative Name'
            icon={UserIcon}
            error={errors.representativeName}
          />
          <SelectField
            register={register}
            name='representativeRole'
            label='Representative Role'
            icon={BriefcaseIcon}
            error={errors.representativeRole}
            options={[
              { value: 'founder', label: 'Founder' },
              { value: 'co-founder', label: 'Co-Founder' },
              { value: 'manager', label: 'Manager' },
              { value: 'director', label: 'Director' },
              { value: 'administrator', label: 'Administrator' },
              { value: 'other', label: 'Other' },
            ]}
          />
          <InputField
            register={register}
            name='password'
            label='Password'
            type='password'
            icon={LockClosedIcon}
            error={errors.password}
          />
          <InputField
            register={register}
            name='confirmPassword'
            label='Confirm Password'
            type='password'
            icon={LockClosedIcon}
            error={errors.confirmPassword}
          />
        </div>

        <div className='flex items-center'>
          <input
            id='agreeTerms'
            name='agreeTerms'
            type='checkbox'
            className='h-8 w-8 text-teal-600 focus:ring-teal-500 border-gray-300 rounded'
            {...register('agreeTerms')}
          />
          <label
            htmlFor='agreeTerms'
            className='ml-2 block text-lg text-gray-300'
          >
            I agree to the{' '}
            <a
              href='#'
              className={`text-${siteConfig.colors.accentColor}-500 hover:text-${siteConfig.colors.accentColor}-400`}
            >
              terms and conditions
            </a>
          </label>
        </div>
        {errors.agreeTerms && (
          <p className='mt-1 text-sm text-red-500'>
            {errors.agreeTerms.message}
          </p>
        )}

        <div className='flex items-center'>
          <input
            id='newsletter'
            name='newsletter'
            type='checkbox'
            className='h-8 w-8 text-teal-600 focus:ring-teal-500 border-gray-300 rounded'
            {...register('newsletter')}
          />
          <label
            htmlFor='newsletter'
            className='ml-2 block text-lg text-gray-300'
          >
            Subscribe to the newsletter
          </label>
        </div>

        <div>
          <button
            type='submit'
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-${siteConfig.colors.accentColor}-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NpoRegistrationForm;
