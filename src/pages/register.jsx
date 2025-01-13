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
export default function Register() {
  const siteConfig = useConfig();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: null,
    password: null,
    confirmPassword: null,
    agreeToTerms: false,
    subscriptionTier: 'Nourisher',
    amount: 50,
    partner: {
      name: siteConfig?.partnerName,
      slug: siteConfig?.organisationId,
    },
    parent: parent,
  });
  const router = useRouter();

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
    if (siteConfig) {
      setFormData({
        ...formData,
        partner: {
          name: siteConfig?.partnerName,
          slug: siteConfig?.organisationId,
        },
      });
    }
  }, [siteConfig]);

  console.log('API URL', API_URL);
  return (
    <div className='flex flex-col bg-gray-900 text-gray-700  items-center justify-center min-h-screen bg-background'>
      <div className='container max-w-4xl mx-auto text-white text-center floex items-center justify-center'>
        <h1 className='text-2xl font-semibold mb-4 text-4xl'>
          Join Inaethe - Be a Hope Builder!
        </h1>
        <p className='mb-4 mt-2 text-2xl text-gray-200'>
          Subscribe with Inaethe, and join us in our mission to help save the
          world. Choose a subscription tier and start making a real difference
          today.
        </p>
      </div>
      <Card className='w-[350px] bg-white'>
        <CardHeader>
          <CardTitle>Register for Ina-ethe</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className='space-y-4'>
              <div>
                <label
                  htmlFor='name'
                  className='block text-sm font-medium text-gray-700'
                >
                  Name
                </label>
                <Input id='name' type='text' required />
              </div>
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700'
                >
                  Email
                </label>
                <Input id='email' type='email' required />
              </div>
              <div>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium text-gray-700'
                >
                  Password
                </label>
                <Input id='password' type='password' required />
              </div>
              <div>
                <label
                  htmlFor='userType'
                  className='block text-sm font-medium text-gray-700'
                >
                  User Type
                </label>
                <select
                  id='userType'
                  value={userType}
                  onChange={handleInputChange}
                  className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 border border-solid focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md'
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
                  <option
                    key='CompassionAmbassador'
                    value='CompassionAmbassador'
                  >
                    Compassion Ambassador Level (R1000/month)
                  </option>
                  <option key='LifelineCreator' value='LifelineCreator'>
                    Lifeline Creator Level (R2000/month)
                  </option>
                  <option key='EmpowermentLeader' value='EmpowermentLeader'>
                    Empowerment Leader Level (R3000/month)
                  </option>
                  <option
                    key='SustainabilityChampion'
                    value='SustainabilityChampion'
                  >
                    Sustainability Champion Level (R5000/month)
                  </option>
                  <option
                    key='GlobalImpactVisionary'
                    value='GlobalImpactVisionary'
                  >
                    Global Impact Visionary Level (R10,000/month)
                  </option>
                </select>
              </div>
            </div>
            {termsError && <p className='text-red-500'>{termsError}</p>}
            {error && <p className='text-red-500'>{error}</p>}
            {canSubmit && (
              <>
                {!loading && (
                  <Button
                    type='submit'
                    className='w-full mt-4 bg-pink-700 text-gray-100'
                  >
                    Subscribe
                  </Button>
                )}
                {loading && (
                  <Button
                    type='submit'
                    className='w-full mt-4 bg-pink-700 text-gray-100 disabled'
                    disabled
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
                  </Button>
                )}
              </>
            )}
          </form>
        </CardContent>
        <CardFooter>
          <p className='text-sm text-center w-full text-gray-700'>
            Already have an account?{' '}
            <a href='/signin' className='text-primary hover:underline'>
              Sign in here
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
