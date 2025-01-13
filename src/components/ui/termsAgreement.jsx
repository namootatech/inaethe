import React from 'react';
import Link from 'next/link';

const TermsAgreement = ({ isChecked, onChange }) => {
  return (
    <div className='flex items-start space-x-3 my-6'>
      <div className='flex items-center h-5'>
        <input
          type='checkbox'
          id='agreeToTerms'
          checked={isChecked}
          onChange={onChange}
          className='w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600'
          required
        />
      </div>
      <div className='text-sm'>
        <label
          htmlFor='agreeToTerms'
          className='font-medium text-gray-700 dark:text-gray-300'
        >
          I agree to the{' '}
          <Link
            href='/terms'
            className='text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline'
          >
            terms and conditions
          </Link>
        </label>
        <p className='text-gray-500 dark:text-gray-400 mt-1'>
          By checking this box, you agree to our Terms of Service and Privacy
          Policy.
        </p>
      </div>
    </div>
  );
};

export default TermsAgreement;
