import React, { useState } from 'react';
import Link from 'next/link';
import { connect } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useCookies } from 'react-cookie';

const SubscriptionForm = ({ login }) => {
  const [cookies, setCookie] = useCookies(['user']);

  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    paymentMethod: 'credit-card',
    agreeToTerms: false,
  });
  const [toRemember, setToRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleRemembrace = () => {
    setToRemember(!toRemember);
  };

  const [emailError, setEmailError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    // Check if the email is in the correct format
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(formData.email)) {
      setEmailError('Please enter a valid email address.');
      setLoading(false);
      return;
    } else {
      setEmailError('');
    }

    const API_URL = 'https://helpem-api.onrender.com/api' + '/login';
    console.log(API_URL);
    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        console.log(response);

        if (response.error) {
          setEmailError(response.message);
        } else {
          console.log('You have successfully loggedin.');
          login(response.data);

          console.log('User data', response.data);

          setCookie('user', JSON.stringify(response.data.user));
          router.push('/app');
        }
      })
      .catch((error) => {
        setLoading(false);
        setEmailError('Error:', error);
      });
  };

  return (
    <div className='md:w-9/12 h-96 p-4 bg-white  sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700'>
      <form className='space-y-6' action='#'>
        <h5 className='text-2xl font-medium text-gray-900 dark:text-white'>
          Sign in to our platform
        </h5>
        <div>
          <label
            htmlFor='email'
            className='block mb-2 md:text-xl text-sm font-medium text-gray-900 dark:text-white'
          >
            Your email
          </label>
          <input
            type='email'
            name='email'
            id='email'
            autoComplete='email'
            onChange={handleInputChange}
            className='bg-gray-50 border border-gray-300 text-gray-900 md:text-xl text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
            placeholder='name@company.com'
            required
          />
        </div>
        <div>
          <label
            htmlFor='password'
            className='block mb-2 md:text-xl text-sm font-medium text-gray-900 dark:text-white'
          >
            Your password
          </label>
          <input
            type='password'
            name='password'
            id='password'
            placeholder='•••••••'
            autoComplete='current-password'
            onChange={handleInputChange}
            className='bg-gray-50 border border-gray-300 text-gray-900 md:text-xl text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
            required
          />
        </div>
        <div className='flex items-start'>
          <div className='flex items-start'>
            <div className='flex items-center h-5'>
              <input
                id='remember'
                type='checkbox'
                value={toRemember}
                onChange={() => toggleRemembrace()}
                className='w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800'
                required
              />
            </div>
            <label
              htmlFor='remember'
              className='ml-2 md:text-xl text-sm font-medium text-gray-900 dark:text-gray-300'
            >
              Remember me
            </label>
          </div>
          <a
            href='#'
            className='ml-auto md:text-xl text-sm text-blue-700 hover:underline dark:text-blue-500'
          >
            Lost Password?
          </a>
        </div>
        {!loading && (
          <button
            type='submit'
            onClick={handleSubmit}
            className='w-full text-white bg-black hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg md:text-xl text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800'
          >
            Login to your account
          </button>
        )}
        {loading && (
          <button
            disabled
            type='button'
            className='w-full text-white bg-gray-600  focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg md:text-xl text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800'
          >
            <svg
              aria-hidden='true'
              role='status'
              className='inline w-4 h-4 me-3 text-white animate-spin'
              viewBox='0 0 100 101'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                fill='#E5E7EB'
              />
              <path
                d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                fill='currentColor'
              />
            </svg>
            Logging you in...
          </button>
        )}
        <div className='md:text-xl text-sm font-medium text-gray-500 dark:text-gray-300'>
          Not registered?{' '}
          <Link
            href='/subscribe'
            className='text-blue-700 hover:underline dark:text-blue-500'
          >
            Create account
          </Link>
        </div>
        <div className='text-red-500'>{emailError}</div>
      </form>
    </div>
  );
};
const mapDispatchToProps = (dispatch) => {
  return {
    login: (data) => dispatch({ type: 'LOGIN', payload: data }),
  };
};

export default connect(null, mapDispatchToProps)(SubscriptionForm);
