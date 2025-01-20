import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '@/components/layout';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { postToURL } from '@/components/payfast/payfast';
import { v4 as uuidv4 } from 'uuid';
import { keys } from 'ramda';
import moment from 'moment';
import RenderPageComponents from '@/components/content/generator';
import { useConfig } from '@/context/ConfigContext';
import { Suspense } from 'react';
import { downloadConfig } from '@/util/config';
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

const PAYFAST_URL = process.env.NEXT_PUBLIC_PAYFAST_URL;
const WEBSITE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL;
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const MERCHANT_ID = process.env.NEXT_PUBLIC_MERCHANT_ID;
const MERCHANT_KEY = process.env.NEXT_PUBLIC_MERCHANT_KEY;

function ReturnPage() {
  const params = useSearchParams();
  const siteConfig = useConfig();
  const [partnerConfig, setPartnerConfig] = useState({});

  let userData = {};

  for (const [key, value] of params.entries()) {
    userData[key] = value;
  }

  const paymentId = uuidv4();
  let payfastData = {
    merchant_id: MERCHANT_ID,
    merchant_key: MERCHANT_KEY,
    return_url: `${WEBSITE_URL}/app/subscribe?firstPaymentDone=true&partner=${userData.partner}`,
    cancel_url: `${WEBSITE_URL}/app/cancel?subscriptionId=${
      userData.subscriptionId
    }&userId${userData.userId}&subscriptionTier=${
      userData.subscriptionTier
    }&amount=${levelPrices[userData.subscriptionTier]}&firstName=${
      userData.firstName
    }&lastName=${userData.lastName}&email=${userData.email}&paymentMethod=${
      userData.paymentMethod
    }&agreeToTerms=${userData.agreeToTerms}&level=${
      keys(levelPrices).indexOf(userData.subscriptionTier) + 1
    }${userData?.parent ? `&parent=${userData?.parent}&` : ''}&partner=${
      userData?.partner
    }`,
    notify_url: `${API_URL}/notify`,
    name_first: userData.firstName,
    name_last: userData.lastName,
    email_address: userData.email,
    m_payment_id: paymentId,
    amount: levelPrices[userData.subscriptionTier],
    item_name: `Inaethe Subscription to ${userData.partner}`,
    item_description: `Inaethe Subscription for ${userData.firstName} ${userData.lastName} for the ${userData.subscriptionTier} package on NPO ${userData.partner}.`,
    subscription_type: 1,
    billing_date: moment().format('YYYY-MM-DD'),
    recurring_amount: levelPrices[userData.subscriptionTier],
    frequency: 3, //what is this?
    cycles: 12,
    subscription_notify_email: true,
    subscription_notify_webhook: true,
    subscription_notify_buyer: true,
    custom_str2: userData?.userId ? userData?.userId : '',
    custom_str3: userData?.subscriptionId ? userData?.subscriptionId : '',
    custom_str4: userData?.partner ? userData?.partner : '',
    custom_str5: userData?.subscriptionTier ? userData?.subscriptionTier : '',
  };

  if (userData?.parent) {
    payfastData = {
      ...payfastData,
      custom_str1: userData?.parent ? userData?.parent : '',
    };
  }
  const noFirstPaymentConfig = siteConfig?.defaultPages?.find(
    (p) => p.id === 'app-subscribe-return-without-first-payment-done'
  );
  const firstPaymentDoneConfig = siteConfig?.defaultPages?.find(
    (p) => p.id === 'app-subscribe-return-with-first-payment-done'
  );
  console.log(
    'subscrptions page',
    noFirstPaymentConfig,
    firstPaymentDoneConfig
  );
  useEffect(() => {
    const fetchPartnerConfig = async () => {
      if (userData.partner) {
        const c = await downloadConfig(userData.partner);
        setPartnerConfig(c);
      }
    };
    fetchPartnerConfig();
  }, [userData]);
  console.log('SiteConfig', siteConfig);
  console.log('Selected partner config', userData.partner, partnerConfig);
  return (
    <div>
      <h1 className='text-3xl font-bold text-center mb-4'>
        {partnerConfig?.partnerName}
      </h1>
      <div className='flex w-full items-center justify-center mb-4'>
        <img
          src={partnerConfig?.brand?.logo}
          alt={partnerConfig?.partnerName}
          className={`rounded-full border-4 border-${partnerConfig?.colors?.primaryColor}-600 w-40 h-40 object-fit`}
        />
      </div>
      <p className='text-white text-xl font-manrope my-2 max-w-2xl mx-auto p-6 text-center flex items-center justify-center'>
        {partnerConfig.tagline}
      </p>

      {userData.firstPaymentDone === 'false' && (
        <RenderPageComponents
          items={noFirstPaymentConfig?.components}
          data={payfastData}
        />
      )}
      {/* button for the user to login to their dashboard */}
      {userData.firstPaymentDone === 'true' && (
        <RenderPageComponents items={firstPaymentDoneConfig.components} />
      )}
    </div>
  );
}

export default ReturnPage;
