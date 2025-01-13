import {
  FaDollarSign,
  FaSlidersH,
  FaNetworkWired,
  FaUsers,
} from 'react-icons/fa';
import { MdLogin } from 'react-icons/md';
import { AiOutlineBarChart, AiOutlineBook, AiFillStar } from 'react-icons/ai';
import { RiBankCardLine } from 'react-icons/ri';
import { FiPackage } from 'react-icons/fi';
import { BiSupport } from 'react-icons/bi';
import { BsGraphUp } from 'react-icons/bs';
import React from 'react';
const icons = {
  'dollar-sign': FaDollarSign,
  sliders: FaSlidersH,
  network: FaNetworkWired,
  users: FaUsers,
  login: MdLogin,
  'bar-chart': AiOutlineBarChart,
  book: AiOutlineBook,
  star: AiFillStar,
  card: RiBankCardLine,
  package: FiPackage,
  support: BiSupport,
  graph: BsGraphUp,
};

export const FlexwindFeatures1 = ({
  siteConfig,
  title,
  hint,
  description,
  features,
  ...rest
}) => {
  return (
    <section className='py-32'>
      <div className='max-w-7xl mx-auto px-5 sm:px-10 md:px-12 lg:px-5'>
        <div className='flex flex-col space-y-16'>
          {/* Header Section */}
          <div className='flex flex-col justify-center text-center mx-auto md:max-w-3xl space-y-5'>
            <span className='mx-auto w-max pl-5 relative before:absolute before:w-4 before:h-0.5 before:rounded-md before:left-0 before:top-1/2 before:bg-blue-700 dark:before:bg-sky-600 text-blue-600 dark:text-blue-500'>
              {hint}
            </span>
            <h1 className='text-3xl font-semibold text-blue-950 dark:text-gray-200 md:text-4xl xl:text-5xl leading-tight'>
              {title}
            </h1>
            <p className='text-gray-700 dark:text-gray-300 max-w-lg mx-auto'>
              {description}
            </p>
          </div>

          {/* Features Grid */}
          <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-y-12 sm:gap-y-16 sm:gap-x-12'>
            {features.map((feature, index) => (
              <div
                key={index}
                className='flex flex-col items-center text-center space-y-4'
              >
                <span
                  className={`text-${siteConfig.colors.primaryColorCode} flex items-center justify-center w-12 h-12 p-2 rounded-md bg-${siteConfig.colors.lightBgColoCode} dark:bg-gray-900 dark:text-blue-500 flex w-max`}
                >
                  {React.createElement(icons[feature.icon] || BiSupport, {
                    size: 24,
                  })}
                </span>
                <h2 className='text-gray-800 dark:text-gray-100 text-xl font-semibold'>
                  {feature.title}
                </h2>
                <p className='text-gray-700 dark:text-gray-300 mx-auto max-w-md'>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
