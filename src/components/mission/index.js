import { useConfig } from '@/context/ConfigContext';
import Image from 'next/image';
import Link from 'next/link';

const Mission = () => {
  const siteConfig = useConfig();
  return (
    <div className='container'>
      <div className='grid md:grid-cols-2 grid-cols-1'>
        <div
          className={`bg-[url('/images/${siteConfig?.organisationId}/mission.jpg')] bg-cover h-96 section-image`}
        ></div>
        <div className='h-full px-8 py-8 text-center md:text-left'>
          <h2 className={siteConfig?.section?.header?.class}>
            {siteConfig?.section2?.article1?.title}
          </h2>
          <p className=' text-base/loose text-2xl md:text-2xl lg:text-2xl dark:text-white mb-4'>
            {siteConfig?.section2?.article1?.text}
          </p>
          <h2 className={siteConfig?.section?.header?.class}>
            {siteConfig?.section2?.article2?.title}
          </h2>
          <p className='text-base/loose text-2xl md:text-2xl lg:text-2xl dark:text-white mb-4'>
            {siteConfig?.section2?.article2?.text}
          </p>
          <Link
            href='/subscribe'
            className={siteConfig?.colors?.button?.primary?.class}
          >
            Subscribe
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Mission;
