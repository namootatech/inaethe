'use client';
import React, { useEffect } from 'react';
import TableOne from '../Tables/TableOne';
import TableTwo from '../Tables/TableTwo';
import FreeModal from '../free-modal';
import { useState } from 'react';
import { dissoc, dissocPath, keys, pipe, set } from 'ramda';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { useSearchParams } from 'next/navigation';
import { postToURL } from '../payfast/payfast';
import { useAuth } from '@/context/AuthContext';
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

const PAYFAST_URL = process.env.NEXT_PUBLIC_PAYFAST_URL;
const WEBSITE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL;
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const MERCHANT_ID = process.env.NEXT_PUBLIC_MERCHANT_ID;
const MERCHANT_KEY = process.env.NEXT_PUBLIC_MERCHANT_KEY;

const getPayFastData = (
  userData,
  subscriptionTier,
  selectedPartner,
  subscriptionId
) => {
  const paymentId = uuidv4();
  let payfastData = {
    merchant_id: MERCHANT_ID,
    merchant_key: MERCHANT_KEY,
    return_url: `${WEBSITE_URL}/app?complete=true`,
    cancel_url: `${WEBSITE_URL}/app?cancelled=true&subscriptionId=${subscriptionId}&userId=${
      userData._id
    }&subscriptionTier=${subscriptionTier}&amount=${
      levelPrices[subscriptionTier]
    }&firstName=${userData.firstName}&lastName=${userData.lastName}&email=${
      userData.email
    }&paymentMethod=${userData.paymentMethod}&agreeToTerms=${
      userData.agreeToTerms
    }&level=${keys(levelPrices).indexOf(subscriptionTier) + 1}${
      userData?.parent ? `&parent=${userData?.parent}&` : ''
    }&partner=${selectedPartner.slug}`,
    notify_url: `${API_URL}/notify`,
    name_first: userData.firstName,
    name_last: userData.lastName,
    email_address: userData.email,
    m_payment_id: paymentId,
    amount: levelPrices[subscriptionTier],
    item_name: `Inaethe Subscription`,
    item_description: `Inaethe Subscription for ${userData.firstName} ${userData.lastName} for the ${subscriptionTier} package at ${selectedPartner.name}`,
    subscription_type: 1,
    billing_date: moment().format('YYYY-MM-DD'),
    recurring_amount: levelPrices[subscriptionTier],
    frequency: 3,
    cycles: 12,
    subscription_notify_email: true,
    subscription_notify_webhook: true,
    subscription_notify_buyer: true,
    custom_str1: userData?.parent ? userData?.parent : '',
    custom_str2: userData?._id ? userData?._id : '',
    custom_str3: subscriptionId ? subscriptionId : '',
    custom_str4: selectedPartner.slug,
    custom_str5: subscriptionTier,
  };

  return payfastData;
};

const getPayFastDataWithExistingToken = (
  userData,
  subscriptionTier,
  selectedPartner,
  subscriptionId,
  token
) => {
  const paymentId = uuidv4();
  let payfastData = {
    merchant_id: MERCHANT_ID,
    merchant_key: MERCHANT_KEY,
    return_url: `${WEBSITE_URL}/app?complete=true`,
    cancel_url: `${WEBSITE_URL}/app?token=${token}&cancelled=true&subscriptionId=${subscriptionId}&userId=${
      userData._id
    }&subscriptionTier=${subscriptionTier}&amount=${
      levelPrices[subscriptionTier]
    }&firstName=${userData.firstName}&lastName=${userData.lastName}&email=${
      userData.email
    }&paymentMethod=${userData.paymentMethod}&agreeToTerms=${
      userData.agreeToTerms
    }&level=${keys(levelPrices).indexOf(subscriptionTier) + 1}${
      userData?.parent ? `&parent=${userData?.parent}&` : ''
    }&partner=${selectedPartner.slug}`,
    notify_url: `${API_URL}/notify`,
    name_first: userData.firstName,
    name_last: userData.lastName,
    email_address: userData.email,
    m_payment_id: paymentId,
    amount: levelPrices[subscriptionTier],
    item_name: `Inaethe Subscription`,
    item_description: `Inaethe Subscription for ${userData.firstName} ${userData.lastName} for the ${subscriptionTier} package at ${selectedPartner.name}`,
    subscription_type: 1,
    billing_date: moment().format('YYYY-MM-DD'),
    recurring_amount: levelPrices[subscriptionTier],
    frequency: 3,
    cycles: 12,
    subscription_notify_email: true,
    subscription_notify_webhook: true,
    subscription_notify_buyer: true,
    custom_str1: userData?.parent ? userData?.parent : '',
    custom_str2: userData?._id ? userData?._id : '',
    custom_str3: subscriptionId ? subscriptionId : '',
    custom_str4: selectedPartner.slug,
    custom_str5: subscriptionTier,
    token: token,
  };
  return payfastData;
};

const getPayFastRetryData = (userData) => {
  const paymentId = uuidv4();
  let payfastData = {
    merchant_id: MERCHANT_ID,
    merchant_key: MERCHANT_KEY,
    return_url: `${WEBSITE_URL}/app?complete=true`,
    cancel_url: `${WEBSITE_URL}/app?${
      userData?.token ? `token=${userData?.token}&` : ''
    }${
      userData?.subscriptionId
        ? `subscriptionId=${userData?.subscriptionId}&`
        : ''
    }cancelled=true&userId=${userData.userId}&firstName=${
      userData.firstName
    }&lastName=${userData.lastName}&email=${userData.email}&paymentMethod=${
      userData.paymentMethod
    }&agreeToTerms=${userData.agreeToTerms}&level=${
      keys(levelPrices).indexOf(userData.subscriptionTier) + 1
    }${userData?.parent ? `&parent=${userData?.parent}` : ''}&partner=${
      userData?.partner.slug
    }`,
    notify_url: `${API_URL}/notify`,
    name_first: userData.firstName,
    name_last: userData.lastName,
    email_address: userData.email,
    m_payment_id: paymentId,
    amount: levelPrices[userData.subscriptionTier],
    item_name: `Inaethe Subscription`,
    item_description: `Inaethe Subscription for ${userData.firstName} ${userData.lastName} for the ${userData.subscriptionTier} package at ${userData.partner.name}`,
    subscription_type: 1,
    billing_date: moment().format('YYYY-MM-DD'),
    recurring_amount: levelPrices[userData.subscriptionTier],
    frequency: 3,
    cycles: 12,
    subscription_notify_email: true,
    subscription_notify_webhook: true,
    subscription_notify_buyer: true,
    custom_str1: userData?.parent ? userData?.parent : '',
    custom_str2: userData?.userId ? userData?.userId : '',
    custom_str3: userData?.subscriptionId ? userData?.subscriptionId : '',
    custom_str4: userData?.partner,
    custom_str5: userData?.subscriptionTier,
  };
  return payfastData;
};

const ECommerce = () => {
  const { user } = useAuth();
  const userData = user;
  const params = useSearchParams();
  let payfastUserData = {};

  for (const [key, value] of params.entries()) {
    payfastUserData[key] = value;
  }
  payfastUserData = dissoc('cancelled', payfastUserData);
  const paymentComplete = params.get('complete');
  const cancelled = params.get('cancelled');

  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSubscriptionTierModal, setShowSubscriptionTierModal] =
    useState(false);
  const [showCongratulationsModal, setShowCongratulationsModal] =
    useState(false);
  const [showPaymentCompleteModal, setShowPaymentCompleteModal] =
    useState(false);
  const [showPaymentCancelledModal, setShowPaymentCancelledModal] =
    useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState('Nourisher');
  const [partners, setPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [paymentSubscription, setPaymentSubscription] = useState(null);

  useEffect(() => {
    if (paymentComplete === 'true') {
      setShowPaymentCompleteModal(true);
    }
    if (cancelled === 'true') {
      setShowPaymentCancelledModal(true);
    }
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/partners`)
      .then((response) => response.json())
      .then((data) => setPartners(data));
  }, [paymentComplete, cancelled]);

  useEffect(() => {
    if (userData?.user) {
      console.log('setting defaults', userData);
      const selectedPartner = userData?.subscriptions[0]?.partner;
      setSelectedPartner(selectedPartner);
      const subscription = userData?.subscriptions[0];
      const subscriptionTier = subscription?.subscriptionTier;
      setSubscriptionTier(subscriptionTier);
      setPaymentSubscription(subscription);
    }
  }, [userData]);

  const isSubscribedToPartner = (partner) => {
    return userData?.subscriptions?.some(
      (subscription) => subscription.partner === partner.slug
    );
  };

  const viewPartner = (partner) => {
    console.log('view', partner);
    window.open(partner.link, '_newtab');
  };

  const subscribeToPartner = (partner) => {
    console.log('subscribe', partner);
    setShowSubscriptionTierModal(true);
    setSelectedPartner(partner);
  };

  const handleSubscribe = () => {
    setLoading(true);
    const data = {
      ...userData?.user,
      partner: selectedPartner,
      subscriptionTier,
      level: keys(levelPrices).indexOf(subscriptionTier) + 1,
      amount: levelPrices[subscriptionTier],
    };
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscriptions/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        setSubscription(data?.subscription?.insertedId);
        setShowCongratulationsModal(true);
        setLoading(false);
      })
      .catch((error) => {
        throw new Error('Error:', error);
      });
  };

  const makeFirstPayment = () => {
    const payfastData = getPayFastData(
      userData.user,
      subscriptionTier,
      selectedPartner,
      subscription
    );
    console.log('payfastData', payfastData);
    postToURL(PAYFAST_URL, payfastData);
  };

  const handleMakeSubscriptionPayment = () => {
    setLoading(true);
    const transaction = userData.transactions.find(
      (transaction) => transaction.custom_str3 === paymentSubscription._id
    );
    const subscriptionToken = transaction?.token;
    if (subscriptionToken) {
      const payfastData = getPayFastDataWithExistingToken(
        userData.user,
        subscriptionTier,
        selectedPartner,
        paymentSubscription._id,
        subscriptionToken
      );
      console.log('payfastData', payfastData);
      postToURL(PAYFAST_URL, payfastData);
    } else {
      throw new Error('No subscription token found for subscription');
    }
  };

  const retryPayment = () => {
    const payfastData = getPayFastRetryData(payfastUserData);
    console.log('payfastData', payfastData);
    postToURL(PAYFAST_URL, payfastData);
  };

  return (
    <>
      <div className='mt-4 grid grid-cols-1 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5'>
        <div class='flex flex-row'>
          <button
            onClick={() => setShowSubscriptionModal(true)}
            class='text-white bg-red-800 me-2 mb-2 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center '
          >
            Add new Subscription
          </button>
          <button
            type='button'
            onClick={() => setShowPaymentModal(true)}
            class='text-gray-900 bg-[#F7BE38] hover:bg-[#F7BE38]/90 focus:ring-4 focus:outline-none focus:ring-[#F7BE38]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#F7BE38]/50 me-2 mb-2'
          >
            <svg
              width='100'
              height='30'
              viewBox='0 0 1507 796'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M1001.45 557.811C1001.39 555.235 1000.99 552.773 1000.19 550.54C999.386 548.25 998.241 546.304 996.752 544.644C995.264 542.983 993.317 541.724 991.084 540.693C988.794 539.72 986.218 539.205 983.127 539.205C980.379 539.205 977.688 539.663 975.341 540.693C972.879 541.724 970.875 542.983 968.986 544.644C967.268 546.304 965.78 548.25 964.578 550.54C963.375 552.83 962.688 555.235 962.631 557.811H1001.5H1001.45ZM1014.61 563.021V565.139C1014.61 565.941 1014.61 566.628 1014.56 567.315H962.574C962.631 570.063 963.261 572.582 964.463 575.101C965.665 577.563 967.154 579.566 969.1 581.398C971.047 583.116 973.28 584.547 975.799 585.635C978.318 586.608 981.008 587.123 983.814 587.123C988.222 587.123 992.058 586.15 995.321 584.261C998.527 582.314 1000.99 579.91 1002.88 577.162L1011.98 584.433C1008.43 589.07 1004.42 592.448 999.615 594.68C994.92 596.799 989.596 597.886 983.814 597.886C978.776 597.886 974.31 597.085 970.074 595.425C965.837 593.764 962.23 591.474 959.139 588.44C956.105 585.52 953.7 581.856 951.983 577.677C950.265 573.44 949.292 568.746 949.292 563.594C949.292 558.441 950.151 553.861 951.868 549.51C953.528 545.159 955.99 541.552 958.967 538.518C962.001 535.484 965.665 533.079 969.73 531.419C973.852 529.759 978.375 528.9 983.069 528.9C987.764 528.9 992.172 529.701 996.123 531.247C1000.07 532.793 1003.45 535.083 1006.03 538.003C1008.77 540.98 1010.84 544.529 1012.32 548.708C1013.93 553.117 1014.61 557.811 1014.61 563.021V563.021Z'
                fill='#022D2D'
              />
              <path
                d='M1145.6 530.904L1130.77 581.341L1114.8 530.904H1101.12L1085.38 581.341L1070.43 530.904H1056.41L1078.22 596.341H1091.67L1107.7 547.277H1107.93L1124.08 596.341H1137.64L1159.23 530.904H1145.6Z'
                fill='#022D2D'
              />
              <path
                d='M1214.93 563.537C1214.93 560.388 1214.48 557.411 1213.45 554.605C1212.41 551.743 1211.1 549.338 1209.21 547.163C1207.32 544.987 1205.09 543.327 1202.34 541.953C1199.59 540.694 1196.5 540.007 1193.01 540.007C1189.51 540.007 1186.42 540.694 1183.68 541.953C1180.93 543.213 1178.64 544.987 1176.81 547.163C1174.92 549.396 1173.6 551.8 1172.57 554.605C1171.6 557.468 1171.08 560.445 1171.08 563.537C1171.08 566.628 1171.54 569.605 1172.57 572.41C1173.6 575.216 1174.92 577.849 1176.81 579.967C1178.69 582.143 1180.98 583.918 1183.68 585.177C1186.42 586.437 1189.51 587.124 1193.01 587.124C1196.5 587.124 1199.59 586.437 1202.34 585.177C1205.09 583.918 1207.38 582.143 1209.21 579.967C1211.1 577.849 1212.41 575.273 1213.45 572.41C1214.53 569.605 1214.93 566.628 1214.93 563.537ZM1228.44 563.479C1228.44 568.575 1227.59 573.212 1225.75 577.391C1224.04 581.628 1221.4 585.234 1218.31 588.383C1215.16 591.417 1211.44 593.879 1207.15 595.539C1202.8 597.2 1198.22 598.116 1193.24 598.116C1188.26 598.116 1183.62 597.257 1179.32 595.539C1174.97 593.879 1171.31 591.417 1168.16 588.383C1165.01 585.349 1162.55 581.628 1160.77 577.391C1159 573.155 1158.08 568.575 1158.08 563.479C1158.08 558.384 1158.94 553.747 1160.77 549.625C1162.49 545.388 1165.01 541.839 1168.16 538.862C1171.31 535.827 1175.03 533.423 1179.32 531.763C1183.68 530.102 1188.26 529.244 1193.24 529.244C1198.22 529.244 1202.91 530.102 1207.15 531.763C1211.5 533.423 1215.16 535.77 1218.31 538.862C1221.46 541.953 1223.98 545.56 1225.75 549.625C1227.59 553.861 1228.44 558.441 1228.44 563.479Z'
                fill='#022D2D'
              />
              <path
                d='M1291.36 510.694H1278.37V596.341H1291.36V510.694Z'
                fill='#022D2D'
              />
              <path
                d='M1051.2 540.808V530.904H1034.88V510.694H1022V576.99C1022 583.746 1023.66 588.841 1026.87 592.333C1030.07 595.768 1034.82 597.428 1041.01 597.428C1043.07 597.428 1044.96 597.257 1046.9 596.97C1048.45 596.684 1049.88 596.398 1051.14 595.883V585.177C1050.17 585.578 1049.08 585.864 1047.93 586.15C1046.5 586.436 1045.24 586.551 1044.1 586.551C1040.89 586.551 1038.49 585.692 1037 584.032C1035.51 582.372 1034.88 579.566 1034.88 575.616V540.922H1051.2V540.808Z'
                fill='#022D2D'
              />
              <path
                d='M1267.43 529.186C1263.02 529.186 1259.07 530.388 1255.58 532.735C1252.03 535.082 1248.88 538.174 1247.17 542.067V530.96H1234.91V596.397H1247.91V562.047C1247.91 559.299 1248.31 556.608 1249 554.089C1249.68 551.513 1250.89 549.395 1252.32 547.391C1253.81 545.445 1255.75 543.956 1257.99 542.754C1260.28 541.552 1263.02 541.036 1266.17 541.036C1268.23 541.036 1270.18 541.265 1272.07 541.723V529.644C1270.75 529.3 1269.26 529.243 1267.43 529.243V529.186Z'
                fill='#022D2D'
              />
              <path
                d='M941.047 545.387C940.016 542.181 938.585 539.433 936.581 536.972C934.52 534.624 932.116 532.621 929.025 531.304C925.99 529.873 922.326 529.186 918.09 529.186C915.742 529.186 913.395 529.472 911.162 530.159C909.044 530.846 906.926 531.705 905.094 532.85C903.205 534.052 901.659 535.311 900.228 536.857C898.739 538.346 897.251 540.006 896.392 541.723V531.018H884.198V596.454H897.193V561.704C897.193 555.234 898.854 549.91 902.06 546.074C905.266 542.124 909.502 540.178 914.655 540.178C917.689 540.178 920.151 540.807 922.097 541.838C924.044 542.926 925.532 544.414 926.563 546.246C927.65 548.135 928.452 550.196 928.853 552.601C929.254 554.948 929.425 557.467 929.425 560.158V596.397H942.478V555.807C942.478 552.086 942.02 548.593 940.99 545.33L941.047 545.387Z'
                fill='#022D2D'
              />
              <path
                d='M1318.96 530.904H1334.99L1307.39 563.88L1334.59 596.341H1318.56L1291.36 563.88L1318.96 530.904Z'
                fill='#022D2D'
              />
              <path
                d='M752.18 586.15C755.386 586.15 758.306 585.635 760.882 584.547C763.458 583.402 765.691 581.856 767.466 579.967C769.24 578.02 770.614 575.673 771.645 572.982C772.618 570.234 773.133 567.2 773.133 563.994C773.133 560.788 772.618 557.811 771.645 555.12C770.672 552.315 769.298 550.025 767.466 548.136C765.691 546.189 763.458 544.644 760.882 543.556C758.306 542.411 755.386 541.838 752.18 541.838C748.974 541.838 746.054 542.411 743.478 543.556C740.902 544.644 738.669 546.132 736.894 548.136C735.119 550.025 733.745 552.315 732.715 555.12C731.741 557.811 731.226 560.731 731.226 563.994C731.226 567.257 731.741 570.234 732.715 572.982C733.688 575.673 735.062 578.02 736.894 579.967C738.669 581.856 740.902 583.345 743.478 584.547C746.054 585.635 748.974 586.15 752.18 586.15ZM719.204 494.378H731.283V541.323H731.57C733.745 538.003 736.78 535.426 740.844 533.537C744.852 531.591 749.146 530.56 753.726 530.56C758.649 530.56 763.057 531.419 767.008 533.136C771.015 534.854 774.45 537.201 777.198 540.235C780.061 543.212 782.236 546.705 783.782 550.827C785.27 554.834 786.072 559.242 786.072 563.994C786.072 568.746 785.328 573.097 783.782 577.162C782.236 581.169 780.061 584.719 777.198 587.753C774.45 590.787 771.015 593.192 767.008 594.852C763.057 596.569 758.649 597.428 753.726 597.428C749.432 597.428 745.253 596.512 741.131 594.623C737.123 592.734 733.917 590.1 731.627 586.723H731.341V595.825H719.261V494.435L719.204 494.378Z'
                fill='#022D2D'
              />
              <path
                d='M786.872 532.221H800.841L819.734 581.857H820.02L837.997 532.221H850.993L820.822 609.508C819.734 612.256 818.646 614.775 817.444 617.008C816.299 619.355 814.868 621.302 813.265 622.905C811.662 624.508 809.715 625.767 807.368 626.683C805.135 627.599 802.33 628 799.067 628C797.292 628 795.46 627.886 793.571 627.599C791.796 627.428 790.021 626.97 788.361 626.283L789.849 615.291C792.254 616.264 794.658 616.779 797.12 616.779C799.009 616.779 800.555 616.493 801.815 615.978C803.131 615.52 804.276 614.833 805.192 613.802C806.166 612.886 806.967 611.856 807.597 610.596C808.227 609.337 808.856 607.905 809.486 606.302L813.379 596.226L786.93 532.221H786.872Z'
                fill='#022D2D'
              />
              <path
                d='M742.963 281.693H719.204V242.706H742.963V226.848C742.963 189.177 770.786 170.055 807.999 170.055C819.964 169.941 831.872 171.716 843.265 175.323V212.363C835.25 209.73 826.891 208.413 818.476 208.356C801.988 208.356 794.03 215.97 794.03 230.512V242.763H845.269V281.751H793.4V408.789H743.02V281.751L742.963 281.693Z'
                fill='#022D2D'
              />
              <path
                d='M475.547 345.985V342.722H426.941C413.373 342.722 405.129 349.02 405.129 358.294C405.129 370.832 416.006 377.416 434.212 377.416C460.433 377.187 475.489 365.622 475.489 345.985H475.547ZM359.844 361.672C359.844 334.879 379.023 315.357 422.304 315.357H475.547V304.422C475.547 284.613 464.326 276.713 441.197 276.713C422.361 276.713 411.484 284.67 411.484 297.895C411.484 298.868 411.484 301.559 411.77 304.823H365.512C365.054 301.674 364.825 298.468 364.825 295.262C364.825 262.171 393.908 242.706 443.487 242.706C493.065 242.706 525.755 265.835 525.755 309.517V408.617H475.489C476.921 397.625 477.779 386.519 478.066 375.412H477.722C472.741 398.541 454.25 411.079 424.48 411.079C386.294 411.251 359.844 394.763 359.844 361.729V361.672Z'
                fill='#022D2D'
              />
              <path
                fill-rule='evenodd'
                clip-rule='evenodd'
                d='M581.746 242.591H532.053L576.365 408.616H614.722C607.451 428.425 596.23 435.753 578.597 435.753C571.326 435.753 564.113 434.837 557.071 433.005V471.592C567.548 474.912 578.483 476.401 589.418 476C620.962 476 647.927 456.821 662.125 408.502L706.723 242.534H656.916L619.875 390.697L581.803 242.534L581.746 242.591Z'
                fill='#022D2D'
              />
              <path
                d='M967.155 346.042V342.779H918.549C905.038 342.779 896.737 349.077 896.737 358.351C896.737 370.889 907.672 377.473 926.106 377.473C951.984 377.244 967.098 365.679 967.098 346.042H967.155ZM851.452 361.729C851.452 334.936 870.688 315.414 913.969 315.414H967.155V304.479C967.155 284.67 955.934 276.77 932.805 276.77C913.969 276.77 903.092 284.728 903.092 297.952C903.092 300.242 903.206 302.59 903.435 304.88H857.12C856.719 301.731 856.49 298.525 856.49 295.319C856.49 262.228 885.859 242.763 935.152 242.763C987.021 242.763 1017.42 265.892 1017.42 309.574V408.674H967.098C968.414 397.739 969.216 386.69 969.445 375.641H969.101C964.178 398.77 945.629 411.308 915.859 411.308C877.902 411.308 851.452 394.82 851.452 361.786V361.729Z'
                fill='#022D2D'
              />
              <path
                d='M1036.2 353.485H1081.03C1081.03 368.599 1088.64 378.504 1117.32 378.504C1143.43 378.504 1152.47 370.947 1152.47 359.039C1152.47 353.199 1149.55 348.505 1140.74 346.501C1128.2 344.211 1115.55 342.665 1102.84 341.921C1079.42 339.917 1061.27 336.081 1051.43 329.383C1046.5 325.662 1042.5 320.795 1039.81 315.242C1037.12 309.689 1035.74 303.563 1035.86 297.38C1035.86 262.228 1072.15 242.649 1117.32 242.649C1170.74 242.649 1195.13 263.087 1195.13 301.273H1150.93C1150.58 284.155 1142.68 275.224 1117.95 275.224C1095.57 275.224 1085.66 282.781 1085.66 294.002C1085.38 297.495 1086.41 300.93 1088.58 303.62C1090.76 306.311 1093.91 308.086 1097.4 308.544C1110.74 310.948 1124.14 312.551 1137.65 313.467C1157.74 315.471 1171.94 317.475 1184.13 324.345C1189.74 327.665 1194.32 332.36 1197.53 338.028C1200.74 343.696 1202.34 350.108 1202.22 356.634C1202.22 390.927 1172.91 411.022 1117.21 411.022C1060.24 410.793 1036.14 386.404 1036.14 353.485H1036.2Z'
                fill='#022D2D'
              />
              <path
                fill-rule='evenodd'
                clip-rule='evenodd'
                d='M1238.35 184.541L1296.52 184.655V198.166C1296.46 222.612 1276.76 242.421 1252.38 242.65H1334.99V281.637H1282.66V349.536C1282.66 366.424 1290.68 371.691 1310.48 371.691C1318.16 371.634 1325.77 370.89 1333.27 369.402V407.416C1322.85 409.648 1312.2 410.851 1301.55 411.022C1250.66 411.022 1232.45 388.58 1232.45 352.226V281.637H1208.64V242.65H1238.41V184.483L1238.35 184.541Z'
                fill='#022D2D'
              />
              <path
                d='M297.5 325.146C297.5 298.754 282.329 280.949 259.6 280.949C234.582 280.949 217.75 299.04 217.75 326.406V333.677C217.75 357.092 234.582 372.607 259.944 372.607C282.329 372.607 297.5 353.485 297.5 325.146V325.146ZM168 245.34H217.75L216.777 278.602H217.063C223.361 256.217 244.143 242.706 272.138 242.706C317.595 242.706 347.308 275.052 347.308 323.143C347.308 375.87 317.595 411.022 271.795 411.022C242.139 411.022 223.704 398.827 216.434 379.076C217.063 389.896 218.094 406.098 218.094 411.995V473.653H168.057V245.282L168 245.34Z'
                fill='#022D2D'
              />
            </svg>
            Make a payment
          </button>
        </div>
        <FreeModal
          showModal={showSubscriptionModal}
          setShowModal={setShowSubscriptionModal}
          title='Add New Subscription'
        >
          {partners.map((partner) => (
            <div key={partner._id}>
              <div className='grid grid-cols-3 gap-2 bg-gray-50 border  p-4 flex items-center justify-center rounded rounded-lg shadow-lg my-2'>
                <h1 className='text-sm font-bold'>{partner.name}</h1>
                <button
                  onClick={() => subscribeToPartner(partner)}
                  class='text-sm rounded rounded-md text-gray-100 bg-red-800 flex items-center justify-center me-2 mb-2 py-2 px-4'
                >
                  {isSubscribedToPartner(partner) ? (
                    <span>Subscribed</span>
                  ) : (
                    'Subscribe'
                  )}
                </button>
                <button
                  onClick={() => viewPartner(partner)}
                  class='text-sm rounded rounded-md text-gray-100 bg-gray-800 flex items-center justify-center me-2 mb-2 p-2'
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </FreeModal>
        <FreeModal
          showModal={showPaymentModal}
          setShowModal={setShowPaymentModal}
          title='Make a payment'
        >
          <div>
            <div className='grid grid-cols-1 gap-2 bg-gray-50 border  p-4 flex items-center justify-center rounded rounded-lg shadow-lg my-2'>
              <h1 className='text-xl font-bold'>Select subscription</h1>
              <p className='text-sm my-2'>
                For which subscription would you like to make a payment for?
              </p>
              <select
                id='subscription'
                name='subscription'
                className='rounded border p-2 w-full my-4'
                onChange={(e) => {
                  const selectedPartner = userData.subscriptions.find(
                    (subscription) => subscription._id === e.target.value
                  );
                  setSelectedPartner(selectedPartner.partner);
                  const subscription = userData.subscriptions.find(
                    (subscription) => subscription._id === e.target.value
                  );
                  const subscriptionTier = subscription.subscriptionTier;
                  setSubscriptionTier(subscriptionTier);
                  setPaymentSubscription(subscription);
                }}
              >
                {userData?.subscriptions?.map((subscription) => (
                  <option
                    key={subscription._id}
                    value={subscription._id}
                    selected={paymentSubscription?._id === subscription._id}
                  >
                    {subscription.partner.name} (R{subscription.amount}/month)
                  </option>
                ))}
              </select>

              <button
                onClick={handleMakeSubscriptionPayment}
                class='my-4 rounded rounded-md text-gray-100 bg-red-800 flex items-center justify-center me-2 mb-2 p-2'
              >
                Pay
              </button>
            </div>
          </div>
        </FreeModal>
        <FreeModal
          showModal={showSubscriptionTierModal}
          setShowModal={setShowSubscriptionTierModal}
          title='Select Subscription Tier'
        >
          <div className='grid grid-cols-1 gap-2 bg-gray-50 border  p-4 flex items-center justify-center rounded rounded-lg shadow-lg my-2'>
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
                onChange={(e) => setSubscriptionTier(e.target.value)}
              >
                {levelPrices &&
                  keys(levelPrices).map((tier) => (
                    <option
                      key={tier}
                      value={tier}
                      selected={subscriptionTier === tier}
                    >
                      {tier} (R{levelPrices[tier]}/month)
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <button
            onClick={handleSubscribe}
            class='rounded rounded-md text-gray-100 bg-red-800 flex items-center justify-center me-2 mb-2 p-2'
          >
            Subscribe to {selectedPartner?.name}
          </button>
        </FreeModal>
        <FreeModal
          showModal={showCongratulationsModal}
          setShowModal={setShowCongratulationsModal}
          title='Congratulations'
        >
          <div className='grid grid-cols-1 gap-2 bg-gray-50 border  p-4 flex items-center justify-center rounded rounded-lg shadow-lg my-2'>
            <h1 className='text-sm font-bold'>Congratulations</h1>
            <p>You have successfully subscribed to {selectedPartner?.name}</p>
            <p>
              You are now a member of {selectedPartner?.name}. You can now make
              a positive impact in the world through {selectedPartner?.name}
            </p>
            <p>
              You can now make your first payment to {selectedPartner?.name} by
              clicking the button below
            </p>
            <button
              onClick={() => makeFirstPayment()}
              class='rounded rounded-md text-gray-100 bg-red-800 flex items-center justify-center me-2 mb-2 p-2'
            >
              Make a payment
            </button>
          </div>
        </FreeModal>
        <FreeModal
          showModal={showPaymentCompleteModal}
          setShowModal={setShowPaymentCompleteModal}
          title='Payment Complete'
        >
          <div className='grid grid-cols-1 gap-2 bg-gray-50 border  p-4 flex items-center justify-center rounded rounded-lg shadow-lg my-2'>
            {/* Create a round div with an svg checkmark inside */}
            <div className='w-16 h-16 rounded-full bg-green-500 flex items-center justify-center'>
              <svg
                width='100'
                height='100'
                viewBox='0 0 100 100'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M50 0C22.386 0 0 22.386 0 50C0 77.614 22.386 100 50 100C77.614 100 100 77.614 100 50C100 22.386 77.614 0 50 0ZM50 90.625C25.586 90.625 9.375 74.414 9.375 50C9.375 25.586 25.586 9.375 50 9.375C74.414 9.375 90.625 25.586 90.625 50C90.625 74.414 74.414 90.625 50 90.625ZM75 37.5L43.75 68.75L25 50L18.75 56.25L43.75 81.25L81.25 43.75L75 37.5Z'
                  fill='white'
                />
              </svg>
            </div>

            <h1 className='text-sm font-bold'>Payment Complete</h1>
            <p>Your payment to {selectedPartner?.name} was successful</p>
            <p>Thank you for your payment</p>
          </div>
        </FreeModal>
        <FreeModal
          showModal={showPaymentCancelledModal}
          setShowModal={setShowPaymentCancelledModal}
          title='Payment Failure'
        >
          <div className='grid grid-cols-1 gap-2 bg-gray-50 border  p-4 flex items-center justify-center rounded rounded-lg shadow-lg my-2'>
            {/* Create a round div with an svg a cross mark inside */}
            <div className='w-16 h-16 rounded-full bg-red-500 flex items-center justify-center'>
              <svg
                width='100'
                height='100'
                viewBox='0 0 100 100'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M50 0C22.386 0 0 22.386 0 50C0 77.614 22.386 100 50 100C77.614 100 100 77.614 100 50C100 22.386 77.614 0 50 0ZM50 90.625C25.586 90.625 9.375 74.414 9.375 50C9.375 25.586 25.586 9.375 50 9.375C74.414 9.375 90.625 25.586 90.625 50C90.625 74.414 74.414 90.625 50 90.625ZM75 37.5L43.75 68.75L25 50L18.75 56.25L43.75 81.25L81.25 43.75L75 37.5Z'
                  fill='white'
                />
              </svg>
            </div>
            <h1 className='text-sm font-bold'>Payment Failure</h1>
            <p>Your payment to {selectedPartner?.name} was unsuccessful</p>
            <p>Please try again</p>
            <button
              onClick={() => retryPayment()}
              class='rounded rounded-md text-gray-100 bg-red-800 flex items-center justify-center me-2 mb-2 p-2'
            >
              Retry
            </button>
          </div>
        </FreeModal>

        <div className='col-span-12'>
          <TableOne />
        </div>
        <div className='col-span-12'>
          <TableTwo />
        </div>
      </div>
    </>
  );
};

export default (props) => {
  <Suspense fallback={<>Loading...</>}>
    <ECommerce {...props} />
  </Suspense>;
};
