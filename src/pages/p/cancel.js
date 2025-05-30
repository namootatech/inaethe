import 'react-toastify/dist/ReactToastify.css';
import Layout from '@/components/layout';
import { useSearchParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { keys } from 'ramda';
import moment from 'moment';
import RenderPageComponents from '@/components/content/generator';
import { useConfig } from '@/context/ConfigContext';
import { Suspense } from 'react';
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
const WEBSITE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL;
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const MERCHANT_ID = process.env.NEXT_PUBLIC_MERCHANT_ID;
const MERCHANT_KEY = process.env.NEXT_PUBLIC_MERCHANT_KEY;

function ReturnPage() {
  const params = useSearchParams();
  const siteConfig = useConfig();
  const userData = {
    partner: {
      name: siteConfig?.partnerName,
      slug: siteConfig?.organisationId,
    },
  };

  for (const [key, value] of params.entries()) {
    userData[key] = value;
  }

  const paymentId = uuidv4();
  let payfastData = {
    merchant_id: MERCHANT_ID,
    merchant_key: MERCHANT_KEY,
    return_url: `${WEBSITE_URL}/return?firstPaymentDone=true`,
    cancel_url: `${WEBSITE_URL}/cancel?subscriptionId=${
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
      userData?.partner.slug
    }`,
    notify_url: `${API_URL}/notify`,
    name_first: userData.firstName,
    name_last: userData.lastName,
    email_address: userData.email,
    m_payment_id: paymentId,
    amount: levelPrices[userData.subscriptionTier],
    item_name: `Inaethe Subscription`,
    item_description: `Inaethe Subscription for ${userData.firstName} ${userData.lastName} for the ${userData.subscriptionTier} package.`,
    subscription_type: 1,
    billing_date: moment().format('YYYY-MM-DD'),
    recurring_amount: levelPrices[userData.subscriptionTier],
    frequency: 3,
    cycles: 12,
    subscription_notify_email: true,
    subscription_notify_webhook: true,
    subscription_notify_buyer: true,
    custom_str2: userData?.userId ? userData?.userId : '',
    custom_str3: userData?.subscriptionId ? userData?.subscriptionId : '',
    custom_str4: userData?.partner?.slug ? userData?.partner?.slug : '',
    ustom_str5: userData?.subscriptionTier ? userData?.subscriptionTier : '',
  };

  if (userData?.parent) {
    payfastData = {
      ...payfastData,
      custom_str1: userData?.parent ? userData?.parent : '',
    };
  }
  const config = siteConfig?.defaultPages?.find(
    (p) => p.id === 'cancelled-payment'
  );
  console.log('config', config);

  return (
    <Layout>
      <RenderPageComponents items={config?.components} data={payfastData} />
    </Layout>
  );
}

export default () => {
  <Suspense fallback={<>Loading...</>}>
    <ReturnPage />
  </Suspense>;
};
