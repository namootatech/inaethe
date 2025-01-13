import { useConfig } from '@/context/ConfigContext';
import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
  const siteConfig = useConfig();
  return (
    <div
      className={`container h-full bg-[url('/images/${siteConfig?.organisationId}/home-page-header.jpg')] home-page-header flex flex-col justify-center items-center`}
    >
      <div className='grid md:grid-cols-2 grid-cols-1 flex flex-col justify-center items-center'>
        <div className='h-full px-8 py-8 text-center md:text-left'>
          <h1 className='text-white text-red-700 text-4xl mb-4 font-extrabold leading-none tracking-tight text-gray-900 dark:text-gray-900'>
            {siteConfig?.heroHeader}
          </h1>
          {siteConfig?.heroSubHeader && (
            <h2 className='text-white text-2xl mb-4 font-extrabold leading-none tracking-tight text-gray-900 dark:text-gray-900'>
              {siteConfig?.heroSubHeader}
            </h2>
          )}
          <p className='text-gray-900 text-base/loose text-2xl md:text-2xl lg:text-2xl dark:text-gray-900 mb-6'>
            {siteConfig?.heroParagraph}
          </p>
          <Link href='/subscribe' className={siteConfig?.heroButton?.class}>
            {siteConfig?.heroButton?.cta}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
