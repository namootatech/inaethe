import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '@/components/layout';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { postToURL } from '@/components/payfast/payfast';
import { v4 as uuidv4 } from 'uuid';
import { keys } from 'ramda';
import moment from 'moment';
import RenderPageComponents from '@/components/content/generator';
import { useConfig } from '@/context/ConfigContext';
import { Suspense } from 'react';
import { downloadConfig } from '@/util/config';
import { useAuth } from '@/context/AuthContext';
import { useApi } from '@/context/ApiContext';

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

const components = [
  { type: 'space-above', size: '10' },
  { type: 'checkbox-center' },
  {
    type: 'center-width-text-block',
    title: 'Your Impact Matters!',
    color: 'light',
    text: "Your subscription isn't just a transaction—it's a powerful commitment to making a difference. With your support, we're empowering non-profits to create lasting change and improve lives around the world.",
  },
  {
    type: 'center-width-text-block',
    title: 'Stay Connected!',
    color: 'light',
    text: "Keep an eye on your inbox for updates, exclusive content, and opportunities to further engage with the organization you've subscribed to. Together, we'll continue to build a brighter future and make a difference in the lives of those who need it most.",
  },
  { type: 'space-below', size: '10' },
];

function ReturnPage() {
  const { user } = useAuth();
  const api = useApi();
  const params = useSearchParams();
  const siteConfig = useConfig();
  const [partnerConfig, setPartnerConfig] = useState(null);
  const [saved, setSaved] = useState(false);

  const userData = useMemo(() => {
    const data = {};
    for (const [key, value] of params.entries()) {
      data[key] = value;
    }
    return data;
  }, [params]);

  useEffect(() => {
    const fetchPartnerConfig = async () => {
      if (userData?.partner && !partnerConfig) {
        const c = await downloadConfig(userData?.partner);
        setPartnerConfig(c);
      }
    };
    fetchPartnerConfig();
  }, [userData]);

  const saveTransaction = async (data) => {
    try {
      if (!saved) {
        const response = await api
          .saveTransaction(data)
          .then(() => setSaved(true));
        console.log('Transaction saved:', response);
      }
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  };

  useEffect(() => {
    const handlePayment = async () => {
      const data = {
        subscriptionId: userData?.subscriptionId,
        userId: userData?.userId,
        subscriptionTier: userData?.subscriptionTier,
        firstName: userData?.firstName,
        lastName: userData?.lastName,
        email: userData?.email,
        paymentMethod: userData?.paymentMethod,
        level: userData?.level,
        parent: userData?.parent,
        partner: userData?.partner,
        paymentId: userData?.paymentId,
        parentId: userData?.parent || 'noparent',
        amount: userData?.amount,
      };

      if (!saved) {
        console.log('Saving transaction:', data);
        await saveTransaction(data);
      }
    };

    console.log('payment userData', userData);

    if (Object.keys(userData).length > 0 && !saved) {
      handlePayment();
    }
  }, [userData, saved]);

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
        {partnerConfig?.tagline}
      </p>

      {/* button for the user to login to their dashboard */}
      <RenderPageComponents items={components} />
    </div>
  );
}

export default ReturnPage;
