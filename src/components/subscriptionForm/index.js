import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { connect } from 'react-redux';
import { assoc, keys } from 'ramda';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';

const API_URL = 'https://helpem-api.onrender.com/api';

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

const SubscriptionForm = ({ user, theme }) => {
  const router = useRouter();
  const params = useSearchParams();
  const parent = params.get('parent');
  console.log('Parent', parent);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: null,
    password: null,
    confirmPassword: null,
    agreeToTerms: false,
    subscriptionTier: 'Nourisher',
    amount: 50,
    partner: { name: theme?.partnerName, slug: theme?.themeName },
    parent: parent,
  });

  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [termsError, setTermsError] = useState('');
  const [canSubmit, setCanSubmit] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    console.log(e.target.name, e.target.value);
    if (e.target.name === 'subscriptionTier') {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
        amount: levelPrices[e.target.value],
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = (e) => {
    console.log('Posting to', API_URL);
    e.preventDefault();
    console.log('saving formData', formData);
    setLoading(true);
    axios
      .post(`${API_URL}/register`, assoc('parent', parent, formData))
      .then((res) => {
        console.log('user saved successfully', res.data);
        setLoading(false);
        router.push(
          `/return?partner=${formData.partner.slug}&subscriptionId=${
            res.data.subscription
          }&userId=${res.data.user}&firstPaymentDone=false&subscriptionTier=${
            formData.subscriptionTier
          }&amount=${levelPrices[formData.subscriptionTier]}&firstName=${
            formData.firstName
          }&lastName=${formData.lastName}&email=${
            formData.email
          }&paymentMethod=${formData.paymentMethod}&agreeToTerms=${
            formData.agreeToTerms
          }&level=${keys(levelPrices).indexOf(formData.subscriptionTier) + 1}${
            parent ? `&parent=${parent}&` : ''
          }`
        );
      })
      .catch((err) => {
        console.log('error saving user', err);
        setLoading(false);
        setError(err.message);
      });
  };

  const toggleTerms = () => {
    setFormData({
      ...formData,
      agreeToTerms: !formData.agreeToTerms,
    });
  };

  useEffect(() => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(formData.email) && email !== null) {
      setEmailError('Please enter a valid email address.');
      setCanSubmit(false);
    } else {
      setEmailError('');
    }

    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match.');
      setCanSubmit(false);
    } else {
      setPasswordError('');
    }

    if (formData.agreeToTerms === false) {
      setTermsError('You must agree to the terms and conditions.');
      setCanSubmit(false);
    } else {
      setTermsError('');
    }

    if (
      formData.agreeToTerms === true &&
      formData.password === formData.confirmPassword &&
      emailPattern.test(formData.email)
    ) {
      setCanSubmit(true);
    }
  });

  useEffect(() => {
    if (theme) {
      setFormData({
        ...formData,
        partner: { name: theme?.partnerName, slug: theme?.themeName },
      });
    }
  }, [theme]);

  console.log('API URL', API_URL);
  return (
    <div className='md:w-9/12 p-8 mx-auto bg-white rounded-lg shadow-md'>
      <h1 className='text-2xl font-semibold mb-4 text-4xl'>
        Join Help'em - Be a Hope Builder!
      </h1>
      <p className='mb-4 mt-2 text-2xl'>
        Subscribe to Help'em, and join us in our mission to end hunger in
        Africa. Choose a subscription tier and start making a real difference
        today.
      </p>

      <form onSubmit={handleSubmit} className='my-12'>
        <div className='mb-4'>
          <label
            htmlFor='subscriptionTier'
            className='text-xl block font-semibold'
          >
            Select Your Subscription Tier:
          </label>
          <select
            id='subscriptionTier'
            name='subscriptionTier'
            className='rounded border p-2 w-full'
            onChange={handleInputChange}
          >
            <option key='Nourisher' value='Nourisher'>
              Nourisher Level (R50/month)
            </option>
            <option key='CaringPartner' value='CaringPartner'>
              Caring Partner Level (R100/month)
            </option>
            <option key='HarmonyAdvocate' value='HarmonyAdvocate'>
              Harmony Advocate Level (R200/month)
            </option>
            <option key='UnitySupporter' value='UnitySupporter'>
              Unity Supporter Level (R300/month)
            </option>
            <option key='HopeBuilder ' value='HopeBuilder '>
              Hope Builder Level (R500/month)
            </option>
            <option key='CompassionAmbassador' value='CompassionAmbassador'>
              Compassion Ambassador Level (R1000/month)
            </option>
            <option key='LifelineCreator' value='LifelineCreator'>
              Lifeline Creator Level (R2000/month)
            </option>
            <option key='EmpowermentLeader' value='EmpowermentLeader'>
              Empowerment Leader Level (R3000/month)
            </option>
            <option key='SustainabilityChampion' value='SustainabilityChampion'>
              Sustainability Champion Level (R5000/month)
            </option>
            <option key='GlobalImpactVisionary' value='GlobalImpactVisionary'>
              Global Impact Visionary Level (R10,000/month)
            </option>
          </select>
        </div>

        <div className='mb-4'>
          <label htmlFor='firstName' className=' text-xl block font-semibold'>
            First Name:
          </label>
          <input
            type='text'
            id='firstName'
            name='firstName'
            className='rounded border p-2 w-full'
            required
            onChange={handleInputChange}
          />
        </div>

        <div className='mb-4'>
          <label htmlFor='lastName' className=' text-xl block font-semibold'>
            Last Name:
          </label>
          <input
            type='text'
            id='lastName'
            name='lastName'
            className='rounded border p-2 w-full'
            required
            onChange={handleInputChange}
          />
        </div>

        <div className='mb-4'>
          <label htmlFor='email' className='text-xl block font-semibold'>
            Email address:
          </label>
          <input
            type='email'
            id='email'
            name='email'
            className='rounded border p-2 w-full'
            required
            onChange={handleInputChange}
          />
          {emailError && <p className='text-red-500'>{emailError}</p>}
        </div>

        <div className='mb-4'>
          <label htmlFor='password' className='text-xl block font-semibold'>
            Password:
          </label>
          <input
            type='password'
            id='password'
            name='password'
            className='rounded border p-2 w-full'
            required
            onChange={handleInputChange}
          />
        </div>

        <div className='mb-4'>
          <label
            htmlFor='confirmPassword'
            className='text-xl block font-semibold'
          >
            Confirm Password:
          </label>
          <input
            type='password'
            id='confirmPassword'
            name='confirmPassword'
            className='rounded border p-2 w-full'
            required
            onChange={handleInputChange}
          />
          {passwordError && <p className='text-red-500'>{passwordError}</p>}
        </div>

        <div className='flex items-start mb-6 my-6'>
          <div className='flex items-center h-5 mb-4'>
            <input
              type='checkbox'
              id='agreeToTerms'
              name='agreeToTerms'
              checked={formData.agreeToTerms}
              value={formData.agreeToTerms}
              onChange={toggleTerms}
              className='w-7 h-7 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800'
              required
            />
          </div>
          <label
            htmlFor='terms'
            className='ml-2 text-xl font-medium text-gray-900 dark:text-gray-300'
          >
            I agree with the{' '}
            <Link
              href='/terms'
              className='text-blue-600 hover:underline dark:text-blue-500'
            >
              terms and conditions
            </Link>
          </label>
          <br />
        </div>
        {termsError && <p className='text-red-500'>{termsError}</p>}
        {error && <p className='text-red-500'>{error}</p>}
        <br />
        {canSubmit && (
          <>
            {!loading && (
              <button
                type='submit'
                className='md:text-xl text-sm px-5 py-2.5  bg-red-500 text-white py-2 px-4 rounded rounded-lg hover:bg-red-600'
              >
                Subscribe
              </button>
            )}
            {loading && (
              <button
                disabled
                type='button'
                onClick={(e) => e.preventDefault()}
                className='text-white bg-gray-600  focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg md:text-xl text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800'
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
                Loading...
              </button>
            )}
          </>
        )}
        {!canSubmit && (
          <button
            className='bg-gray-300 px-4 py-2 rounded cursor-not-allowed opacity-50'
            disabled
          >
            Subscribe
          </button>
        )}
      </form>
      <p className='mb-4 mt-4 text-2xl mt-4'>
        When you subscribe, you'll become a Hope Builder. Here's how it works:
      </p>
      <ul className='list-disc ml-6 text-2xl'>
        <li>
          Your recruits pay a monthly subscription fee, depending on the package
          they have selected.
        </li>
        <li>
          You earn 40% of the monthly subscription fee from each of your
          recruits as Monthly Income per Recruit.
        </li>
        <li>
          50% of the money you earn goes toward food parcels to help those in
          need as Monthly Contribution to Food Packages per Recruit.
        </li>
        <li>10% goes toward the system as Monthly Income Toward the System.</li>
      </ul>

      <p className='mt-4 text-2xl'>
        Your subscription is more than a commitment; it's a promise of hope.
        Join us today and help us create a world where no one goes to bed
        hungry.
      </p>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    theme: state.theme,
  };
};

export default connect(mapStateToProps)(SubscriptionForm);
