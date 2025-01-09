import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '@/components/layout';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { postToURL } from '@/components/payfast/payfast';
import { v4 as uuidv4 } from 'uuid';
import { keys } from 'ramda';
import moment from 'moment';
import Artifacts ,{ ArtifactsWithData } from '@/components/content/generator';

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

function ReturnPage({ theme }) {


  const params = useSearchParams();

  const userData = {
    partner: { name: theme?.partnerName, slug: theme?.themeName },
  };

  for (const [key, value] of params.entries()) {
    userData[key] = value;
  }

  const paymentId = uuidv4();
  let payfastData = {
    merchant_id: MERCHANT_ID,
    merchant_key: MERCHANT_KEY,
    return_url: `${WEBSITE_URL}/return?firstPaymentDone=true`,
    cancel_url: `${WEBSITE_URL}/cancel?subscriptionId=${userData.subscriptionId}&userId${userData.userId}&subscriptionTier=${userData.subscriptionTier}&amount=${levelPrices[userData.subscriptionTier]}&firstName=${userData.firstName}&lastName=${userData.lastName}&email=${userData.email}&paymentMethod=${userData.paymentMethod}&agreeToTerms=${userData.agreeToTerms}&level=${keys(levelPrices).indexOf(userData.subscriptionTier) + 1}${userData?.parent ? `&parent=${userData?.parent}&` :''}&partner=${userData?.partner.slug}`,
    notify_url: `${API_URL}/notify`,
    name_first: userData.firstName,
    name_last: userData.lastName,
    email_address: userData.email,
    m_payment_id: paymentId,
    amount: levelPrices[userData.subscriptionTier],
    item_name: `Helpem Subscription`,
    item_description: `Helpem Subscription for ${userData.firstName} ${userData.lastName} for the ${userData.subscriptionTier} package.`,
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
    custom_str5: userData?.subscriptionTier ? userData?.subscriptionTier : '',
  };

  if (userData?.parent) {
    payfastData = {
      ...payfastData,
      custom_str1: userData?.parent ? userData?.parent : '',
    };
  }
  const noFirstPaymentConfig = theme?.defaultPages?.find(
    (p) => p.id === 'subscribe-return-without-first-payment-done'
  );
  const firstPaymentDoneConfig = theme?.defaultPages?.find(
    (p) => p.id === 'subscribe-return-with-first-payment-done'
  );

  return (
    <Layout>
      <ToastContainer />
      {userData.firstPaymentDone === 'false' &&
        <ArtifactsWithData items={noFirstPaymentConfig.artifacts}
          data={payfastData}
        />}
      {/* button for the user to login to their dashboard */}
      {userData.firstPaymentDone === 'true' && (
       <Artifacts items={firstPaymentDoneConfig.artifacts} />
      )}
    </Layout>
  );
}

const mapStateToProps = (state) => {
  return {
    theme: state.theme,
  };
};

export default connect(mapStateToProps)(ReturnPage);
