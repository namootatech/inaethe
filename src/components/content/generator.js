'use client';

import { GiFoodTruck } from 'react-icons/gi';
import { BsBook } from 'react-icons/bs';
import { HiUserGroup } from 'react-icons/hi';
import React from 'react';
import Link from 'next/link';
import nl2br from 'nl2br';
import { postToURL } from '@/components/payfast/payfast';
import NpoRegistrationForm from '../NpoRegistrationForm';
import {
  FaDroplet,
  FaHeart,
  FaUsers,
  FaShield,
  FaSearch,
  FaGlobe,
  FaSeedling,
  FaUtensils,
  FaSchool,
  FaBook,
  FaUser,
  FaHandsHelping,
  FaRecycle,
  FaBullhorn,
  FaMapPin,
  FaMicroscope,
  FaGraduationCap,
  FaChartLine,
  FaBuilding,
  FaLaptop,
  FaBriefcase,
  FaRefreshCw,
  FaTools,
  FaCalendar,
  FaHandshake,
  FaTruck,
  FaFilter,
  FaCloudRain,
  FaTrendingUp,
  FaCompass,
  FaAward,
  FaTarget,
  FaActivity,
  FaQuoteLeft,
  FaQuoteRight,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
  FaQuestion,
  FaArrowRight,
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaGithub,
} from 'react-icons/fa';

const icons = {
  'food-truck': GiFoodTruck,
  book: BsBook,
  'user-group': HiUserGroup,
  droplet: FaDroplet,
  heart: FaHeart,
  users: FaUsers,
  shield: FaShield,
  search: FaSearch,
  globe: FaGlobe,
  seedling: FaSeedling,
  utensils: FaUtensils,
  school: FaSchool,
  'book-open': FaBook,
  user: FaUser,
  'hands-helping': FaHandsHelping,
  recycle: FaRecycle,
  bullhorn: FaBullhorn,
  'map-pin': FaMapPin,
  microscope: FaMicroscope,
  'graduation-cap': FaGraduationCap,
  'chart-line': FaChartLine,
  building: FaBuilding,
  laptop: FaLaptop,
  briefcase: FaBriefcase,
  'refresh-cw': FaRefreshCw,
  tools: FaTools,
  calendar: FaCalendar,
  handshake: FaHandshake,
  truck: FaTruck,
  filter: FaFilter,
  'cloud-rain': FaCloudRain,
  'trending-up': FaTrendingUp,
  compass: FaCompass,
  award: FaAward,
  target: FaTarget,
  activity: FaActivity,
  'quote-left': FaQuoteLeft,
  'quote-right': FaQuoteRight,
  envelope: FaEnvelope,
  phone: FaPhone,
  'map-marker': FaMapMarkerAlt,
  clock: FaClock,
  'check-circle': FaCheckCircle,
  question: FaQuestion,
  'arrow-right': FaArrowRight,
  linkedin: FaLinkedin,
  twitter: FaTwitter,
  facebook: FaFacebook,
  instagram: FaInstagram,
  youtube: FaYoutube,
  github: FaGithub,
};

import {
  FlexwindHero1,
  FlexwindHero3,
  FlexwindHero2,
  FlexwindHero4,
  FlexwindHero6,
  FlexwindHero7,
  FlexwindHero5,
} from './heros';

import { Icon } from './icon';
import { useConfig } from '@/context/ConfigContext';
import { FlexwindFeatures1 } from './features';
import { PageDoneHowItWorks1 } from './howItWorks';

import { FlowBiteCta1, FlowBiteCta2, FlowBiteCta3 } from './ctas';

const imageBlock = (props) => (
  <div
    style={{
      backgroundImage: `url('${props.image}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
    className={`h-full `}
  />
);
const multiTextBlock = (props) => (
  <div className='h-full px-8 py-8 text-center md:text-left'>
    {props.content.map((item) => (
      <React.Fragment key={item.title}>
        <h2 className='text-pink-500 text-4xl mb-4 font-extrabold leading-none tracking-tight text-gray-900 dark:text-white'>
          {item.title}
        </h2>
        <p
          className=' text-base/loose text-2xl md:text-2xl lg:text-2xl dark:text-gray-900 mb-4'
          dangerouslySetInnerHTML={{ __html: nl2br(item.text) }}
        />
      </React.Fragment>
    ))}
    {props.cta && (
      <Link
        type='button'
        href={props.cta?.link}
        className={`text-white bg-${props.siteConfig.primaryColorCode} hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-pink-300 font-medium rounded-lg  text-xl px-4 py-2 text-center mr-3 md:mr-0 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800`}
      >
        {props.cta?.title}
      </Link>
    )}
  </div>
);

const articleElementBuilders = {
  'image-block': imageBlock,
  'multi-text-blocks': multiTextBlock,
};

const articleBuilder = ({ siteConfig, ...rest }) => {
  const { elements } = rest;
  console.log(rest);
  console.log('Site config', siteConfig);
  return (
    <div className='relative w-full flex items-center justify-center py-12'>
      {/* Background Image */}
      <div
        className={`bg-${siteConfig.colors.secondaryColor}-900 absolute`}
        style={{
          // backgroundImage: `url('${rest?.image}')`, // Use the provided image URL
          // backgroundSize: 'cover',
          // backgroundPosition: 'center',
          // filter: ' blur(1px) brightness(0.3)',
          // opacity: 0.99,
          zIndex: -1,
          height: '100%',
          width: '100%',
        }}
      ></div>

      {/* Content */}
      <div className='w-4/5 overflow-hidden rounded-md text-white flex gap-4 m-6'>
        <div
          className={`grid md:grid-cols-${elements?.length || 1} grid-cols-1`}
        >
          {elements?.map((e) => {
            return articleElementBuilders[e.type]({ ...e, siteConfig });
          })}
        </div>
      </div>
    </div>
  );
};

export const FeatureSection = ({ features }) => (
  <div className='bg-gray-100 py-12'>
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      <div className='lg:text-center'>
        <h2 className='text-base text-indigo-600 font-semibold tracking-wide uppercase'>
          Features
        </h2>
        <p className='mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl'>
          How Inaethe Works
        </p>
        <p className='mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto'>
          Discover the key features that make Inaethe the perfect platform for
          affiliate marketing and donation collection.
        </p>
      </div>

      <div className='mt-10'>
        <dl className='space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10'>
          {features.map((feature) => (
            <div key={feature.name} className='relative'>
              <dt>
                <div className='absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white'>
                  {feature.icon}
                </div>
                <p className='ml-16 text-lg leading-6 font-medium text-gray-900'>
                  {feature.name}
                </p>
              </dt>
              <dd className='mt-2 ml-16 text-base text-gray-500'>
                {feature.description}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  </div>
);

export const TestimonialSection = ({ testimonials }) => (
  <div className='bg-white py-16 lg:py-24'>
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      <div className='lg:text-center'>
        <h2 className='text-base text-indigo-600 font-semibold tracking-wide uppercase'>
          Testimonials
        </h2>
        <p className='mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl'>
          What Our Users Say
        </p>
      </div>
      <div className='mt-10'>
        <div className='space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10'>
          {testimonials.map((testimonial, index) => (
            <div key={index} className='bg-gray-100 rounded-lg p-6 shadow-md'>
              <p className='text-gray-600 italic mb-4'>"{testimonial.quote}"</p>
              <div className='flex items-center'>
                <img
                  className='h-12 w-12 rounded-full mr-4'
                  src={testimonial.avatar || '/placeholder.svg'}
                  alt={testimonial.name}
                />
                <div>
                  <p className='text-gray-900 font-semibold'>
                    {testimonial.name}
                  </p>
                  <p className='text-gray-600'>{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const PricingSection = ({ ...rest }) => (
  <div className='bg-gray-100 py-12'>
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      <div className='lg:text-center'>
        <h2 className='text-base text-indigo-600 font-semibold tracking-wide uppercase'>
          Pricing
        </h2>
        <p className='mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl'>
          Choose the Right Plan for You
        </p>
      </div>
      <div className='mt-10 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8'>
        {rest?.plans.map((plan) => (
          <div
            key={plan.name}
            className='relative p-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col'
          >
            <div className='flex-1'>
              <h3 className='text-xl font-semibold text-gray-900'>
                {plan.name}
              </h3>
              {plan.mostPopular && (
                <p className='absolute top-0 py-1.5 px-4 bg-indigo-500 text-white rounded-full transform -translate-y-1/2'>
                  Most popular
                </p>
              )}
              <p className='mt-4 flex items-baseline text-gray-900'>
                <span className='text-5xl font-extrabold tracking-tight'>
                  ${plan.price}
                </span>
                <span className='ml-1 text-xl font-semibold'>/month</span>
              </p>
              <p className='mt-6 text-gray-500'>{plan.description}</p>
              <ul className='mt-6 space-y-6'>
                {plan.features.map((feature) => (
                  <li key={feature} className='flex'>
                    <span className='text-indigo-500 mr-3'>✓</span>
                    <span className='text-gray-500'>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <a
              href='#'
              className={`mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium ${
                plan.mostPopular
                  ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                  : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
              }`}
            >
              Get started
            </a>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const spaBuilder = ({ siteConfig, ...rest }) => {
  console.log('spa', rest);
  return (
    <div
      className={`bg-${siteConfig.colors.secondaryColor}-900 w-full flex items-center justify-center bg-gray-50 py-12`}
    >
      <div
        className={`h-full w-4/5 px-10 py-10 rounded-md shadow-2xl px-10 text-center md:text-left ${rest?.bg} ${rest?.fg} text-center`}
      >
        <h2 className=' text-6xl mb-4 text-center mt-4 font-extrabold leading-none tracking-tight dark:text-gray-900'>
          {rest?.title}
        </h2>
        <br />
        <div
          className={`grid md:grid-cols-${rest?.elements?.length} grid-cols-1 flex flex-col justify-center items-center section-image `}
        >
          {rest?.elements.map((e) => {
            const Icon = icons[e.icon];
            return (
              <div
                key={e.title}
                className='py-4 flex flex-col justify-center items-center text-center'
              >
                <div className='flex flex-col justify-center items-center'>
                  <Icon size='5em' />
                  <h2 className='text-4xl py-4 font-bold'>{e.title}</h2>
                </div>

                <p className='text-2xl text-base/loose md:text-4xl'>{e.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
const heroBuilder = ({ siteConfig, ...rest }) => {
  return (
    <div className='relative w-full h-screen flex flex-col justify-center items-center'>
      {/* Background div */}
      <div
        className='absolute inset-0'
        style={{
          backgroundImage: `url('${rest?.image}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: -2, // Ensures this is below the overlay and content
        }}
      ></div>

      {/* Overlay */}
      <div
        className='absolute inset-0 bg-black opacity-50'
        style={{ zIndex: -1 }} // Places overlay above the background but below the content
      ></div>

      {/* Content */}
      <div className='flex justify-start items-start'>
        <div className='h-auto px-8 py-8 text-center md:text-left md:col-span-2'>
          <h1 className='text-white text-red-700 text-4xl md:text-7xl mb-4 font-extrabold leading-none tracking-tight text-gray-900 dark:text-gray-900'>
            {rest?.header}
          </h1>
          {rest?.subHeader && (
            <h2 className='text-white text-5xl mb-4 font-extrabold leading-none tracking-tight text-gray-900 dark:text-gray-900'>
              {rest?.subHeader}
            </h2>
          )}
          <p className='text-white text-base/loose text-2xl md:text-2xl lg:text-2xl dark:text-gray-100 mb-6'>
            {rest?.text}
          </p>
          <Link
            href={rest?.cta?.link}
            className={`mb-6 text-white bg-${siteConfig?.colors?.primaryColorCode} hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-${siteConfig?.colors?.primaryColorCode} font-medium rounded-lg text-xl px-4 py-3 text-center mr-3 md:mr-0 dark:bg-${siteConfig?.colors?.primaryColorCode} dark:hover:bg-pink-700 dark:focus:ring-pink-800`}
          >
            {rest?.cta?.title}
          </Link>
        </div>
        <div
          className={`md:flex hidden h-full w-full justify-center items-center col-span-1`}
        >
          {/* <img
            src={rest?.logo?.src || "/placeholder.svg"}
            alt={rest?.logo?.alt}
            className='h-72 w-72 shadow-2xl rounded-full animate-pulse-shadow '
          /> */}
        </div>
      </div>
    </div>
  );
};

const fullWidthTextBlock = ({ ...rest }) => (
  <div key={`section-${rest?.title}`}>
    <h1 className='max-w-lg text-3xl font-semibold leading-normal text-gray-900 dark:text-gray-900 mb-2'>
      {rest?.title}
    </h1>
    <div
      className='text-left text-2xl dark:text-gray-400 mt-2 mb-12'
      dangerouslySetInnerHTML={{ __html: nl2br(rest?.text) }}
    />
  </div>
);

const centerWidthTextBlock = ({ ...rest }) => (
  <div key={`section-${rest?.title} `} className='max-w-2xl mx-auto p-4'>
    <h1
      className={`text-3xl font-semibold leading-normal ${
        rest?.color === 'light' ? 'text-gray-100' : 'text-gray-900'
      } dark:text-gray-900 mb-2`}
    >
      {rest?.title}
    </h1>
    <div
      className='text-left text-2xl dark:text-gray-400 mt-2 mb-12'
      dangerouslySetInnerHTML={{ __html: nl2br(rest?.text) }}
    />
  </div>
);

const PayFastButton = ({ siteConfig, data, ...rest }) => {
  console.log('Payfast data', data);
  return (
    <button
      className='text-white bg-pink-500 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-pink-300 font-medium rounded-lg  text-xl px-4 py-3 text-center mr-3 md:mr-0 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800'
      onClick={() => postToURL(process.env.NEXT_PUBLIC_PAYFAST_URL, data)}
    >
      {rest?.title}
    </button>
  );
};

const CheckBox = ({ siteConfig, data, ...rest }) => {
  return (
    <div className='bg-white p-8 rounded-lg w-44 h-44 shadow-md max-w-md w-full flex items-center justify-center flex-col'>
      <svg
        className='text-green-500 w-20 h-20 mx-auto'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M5 13l4 4L19 7'
        />
      </svg>
    </div>
  );
};

const CheckBoxCenter = ({ siteConfig, data, ...rest }) => {
  return (
    <div className='w-full flex flex-col items-center justify-center'>
      <div className='bg-white p-8 rounded-full border border-green-500 shadow-md w-44 h-44 flex items-center justify-center flex-col'>
        <svg
          className='text-green-500 w-20 h-20 mx-auto'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M5 13l4 4L19 7'
          />
        </svg>
      </div>
    </div>
  );
};

const Cross = ({ siteConfig, data, ...rest }) => {
  return (
    <div className='bg-white p-8 w-44 h-44 rounded-lg shadow-md max-w-md w-full flex items-center justify-center flex-col'>
      <svg
        className='text-red-500 w-20 h-20 mx-auto'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M6 18L18 6M6 6l12 12'
        />
      </svg>
    </div>
  );
};

const CrossCenter = ({ siteConfig, data, ...rest }) => {
  return (
    <div className='w-full flex flex-col items-center justify-center'>
      <div className='bg-white p-8 rounded-full border border-red-500 shadow-md w-44 h-44 flex items-center justify-center flex-col'>
        <svg
          className='text-red-500 w-20 h-20 mx-auto '
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M6 18L18 6M6 6l12 12'
          />
        </svg>
      </div>
    </div>
  );
};

const LoginButton = ({ siteConfig, ...rest }) => {
  return (
    <Link
      href='/login'
      className='text-white bg-pink-500 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-pink-300 font-medium rounded-lg  text-xl px-4 py-3 text-center mr-3 md:mr-0 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800'
    >
      {rest?.title}
    </Link>
  );
};

const Modal = ({ siteConfig, data, ...rest }) => {
  const { isOpen, onClose, title, children } = rest;
  return (
    isOpen && (
      <div className='fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50'>
        <div className='bg-white rounded-lg p-6 max-w-lg w-full'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-2xl font-semibold'>{title}</h2>
            <button
              onClick={onClose}
              className='text-gray-400 hover:text-gray-600'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>
          <div>{children}</div>
        </div>
      </div>
    )
  );
};

const AlertBanner = ({ siteConfig, ...rest }) => {
  const { message, alertType = 'info' } = rest;
  const alertTypes = {
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  return (
    <div className={`p-4 mb-4 rounded-lg ${alertTypes[alertType]} border-l-4`}>
      <div className='flex items-center'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-5 w-5 mr-2'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M9 5l7 7-7 7'
          />
        </svg>
        <span>{message}</span>
      </div>
    </div>
  );
};

const Accordion = ({ siteConfig, ...rest }) => {
  const { items } = rest;
  const [openIndex, setOpenIndex] = React.useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div>
      {items.map((item, index) => (
        <div key={index} className='border-b'>
          <button
            className='w-full p-4 text-left bg-gray-100 hover:bg-gray-200 focus:outline-none'
            onClick={() => toggle(index)}
          >
            <h3 className='text-xl'>{item.title}</h3>
          </button>
          {openIndex === index && <div className='p-4'>{item.content}</div>}
        </div>
      ))}
    </div>
  );
};

const Card = ({ siteConfig, ...rest }) => {
  const { image, title, description, cta } = rest;
  return (
    <div className='bg-white rounded-lg shadow-md overflow-hidden'>
      <img
        src={image || '/placeholder.svg'}
        alt={title}
        className='w-full h-48 object-cover'
      />
      <div className='p-4'>
        <h3 className='text-xl font-semibold text-gray-900'>{title}</h3>
        <p className='mt-2 text-gray-600'>{description}</p>
        {cta && (
          <Link href={cta?.link} className='mt-4 inline-block text-indigo-600'>
            {cta?.title}
          </Link>
        )}
      </div>
    </div>
  );
};

const Tabs = ({ siteConfig, ...rest }) => {
  const { tabs } = rest;
  const [activeTab, setActiveTab] = React.useState(tabs[0].id);

  return (
    <div>
      <ul className='flex border-b'>
        {tabs.map((tab) => (
          <li
            key={tab.id}
            className={`mr-1 ${
              activeTab === tab.id ? 'border-b-2 border-indigo-500' : ''
            }`}
          >
            <button
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-4 ${activeTab === tab.id ? 'font-bold' : ''}`}
            >
              {tab.title}
            </button>
          </li>
        ))}
      </ul>
      <div className='p-4'>
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};

const CenteredPageHeader = ({ siteConfig, ...rest }) => (
  <div className='sm:mx-auto sm:w-full sm:max-w-4xl'>
    <h2 className='mt-6 text-center text-3xl font-extrabold text-white'>
      {rest?.title}
    </h2>
    <p className='mt-2 text-center text-sm text-gray-300'>
      {rest?.description}
    </p>
  </div>
);

const CenteredPageComponentsContainer = ({ siteConfig, ...rest }) => {
  const { components, maxWidthinXLsize } = rest;
  console.log('components: ' + components);
  return (
    <div
      className={`mt-8 mx-auto sm:w-full flex items-center justify-center h-full md:max-w-${maxWidthinXLsize}xl`}
    >
      {components.map((component, index) => {
        return (
          <div key={index} className='flex flex-wrap'>
            {componentBuilders[component.type]({ ...components, siteConfig })}
          </div>
        );
      })}
    </div>
  );
};

// Team Member Component
const TeamMember = ({ siteConfig, ...rest }) => {
  const { name, role, image, bio, socialLinks } = rest;
  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden'>
      <img
        src={image || '/placeholder.svg'}
        alt={name}
        className='w-full h-64 object-cover'
      />
      <div className='p-6'>
        <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
          {name}
        </h3>
        <p className='text-sm text-gray-600 dark:text-gray-400'>{role}</p>
        <p className='mt-3 text-gray-700 dark:text-gray-300'>{bio}</p>
        {socialLinks && (
          <div className='mt-4 flex space-x-3'>
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                className={`text-${siteConfig?.colors?.primaryColorCode} hover:text-${siteConfig?.colors?.secondaryColorCode}`}
                target='_blank'
                rel='noopener noreferrer'
              >
                <Icon name={link.icon} />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Timeline Component
const Timeline = ({ siteConfig, ...rest }) => {
  const { items } = rest;
  return (
    <div className='relative mx-auto max-w-7xl'>
      <div className='absolute left-1/2 -ml-0.5 w-0.5 h-full bg-gray-200 dark:bg-gray-800'></div>
      <div className='space-y-12'>
        {items.map((item, index) => (
          <div key={index} className='relative'>
            <div
              className={`absolute left-1/2 -ml-3 w-6 h-6 rounded-full border-4 border-white dark:border-gray-900 ${
                index === 0
                  ? `bg-${siteConfig?.colors?.primaryColorCode}`
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            ></div>
            <div
              className={`relative ${
                index % 2 === 0
                  ? 'pr-8 md:pr-12 md:text-right md:mr-8'
                  : 'pl-8 md:pl-12 md:ml-8'
              } ${index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'}`}
            >
              <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md'>
                <span
                  className={`text-${siteConfig?.colors?.primaryColorCode} text-sm font-semibold`}
                >
                  {item.date}
                </span>
                <h3 className='mt-2 text-xl font-bold text-gray-900 dark:text-white'>
                  {item.title}
                </h3>
                <p className='mt-2 text-gray-700 dark:text-gray-300'>
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Statistics Grid Component
const StatisticsGrid = ({ siteConfig, ...rest }) => {
  const { stats } = rest;
  return (
    <div className='bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 dark:bg-gray-700'>
        {stats.map((stat, index) => (
          <div
            key={index}
            className='bg-white dark:bg-gray-800 p-8 text-center'
          >
            <div
              className={`inline-flex p-3 rounded-full bg-${siteConfig?.colors?.lightBgColoCode} dark:bg-gray-700 text-${siteConfig?.colors?.primaryColorCode} mb-4`}
            >
              <Icon name={stat.icon} size={24} />
            </div>
            <h3 className='text-3xl font-bold text-gray-900 dark:text-white'>
              {stat.value}
            </h3>
            <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
              {stat.label}
            </p>
            {stat.change && (
              <p
                className={`mt-2 text-sm ${
                  stat.change > 0 ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {stat.change > 0 ? '↑' : '↓'} {Math.abs(stat.change)}%
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Gallery Component
const Gallery = ({ siteConfig, ...rest }) => {
  const { images, title, description } = rest;
  return (
    <div className='py-12'>
      {(title || description) && (
        <div className='text-center mb-12'>
          {title && (
            <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-4'>
              {title}
            </h2>
          )}
          {description && (
            <p className='text-gray-600 dark:text-gray-400 max-w-2xl mx-auto'>
              {description}
            </p>
          )}
        </div>
      )}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {images.map((image, index) => (
          <div key={index} className='overflow-hidden rounded-lg shadow-md'>
            <img
              src={image.src || '/placeholder.svg'}
              alt={image.alt || `Gallery image ${index + 1}`}
              className='w-full h-64 object-cover transition-transform duration-300 hover:scale-105'
            />
            {image.caption && (
              <div className='p-4 bg-white dark:bg-gray-800'>
                <p className='text-gray-700 dark:text-gray-300'>
                  {image.caption}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Contact Form Component
const ContactForm = ({ siteConfig, ...rest }) => {
  const { title, description, fields, submitText } = rest;
  return (
    <div className='max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden'>
      <div className='p-8'>
        {title && (
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
            {title}
          </h2>
        )}
        {description && (
          <p className='text-gray-600 dark:text-gray-400 mb-6'>{description}</p>
        )}

        <form className='space-y-6'>
          {fields.map((field, index) => (
            <div key={index}>
              <label
                htmlFor={field.id}
                className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
              >
                {field.label}{' '}
                {field.required && <span className='text-red-500'>*</span>}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  id={field.id}
                  name={field.id}
                  rows={4}
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
                  placeholder={field.placeholder}
                  required={field.required}
                ></textarea>
              ) : (
                <input
                  type={field.type}
                  id={field.id}
                  name={field.id}
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
                  placeholder={field.placeholder}
                  required={field.required}
                />
              )}
            </div>
          ))}

          <div>
            <button
              type='submit'
              className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-${siteConfig?.colors?.primaryColorCode} hover:bg-${siteConfig?.colors?.primaryColorCode}/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${siteConfig?.colors?.primaryColorCode}`}
            >
              {submitText || 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Donation Progress Component
const DonationProgress = ({ siteConfig, ...rest }) => {
  const { goal, current, title, description, cta } = rest;
  const percentage = Math.min(Math.round((current / goal) * 100), 100);

  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6'>
      {title && (
        <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-2'>
          {title}
        </h3>
      )}
      {description && (
        <p className='text-gray-600 dark:text-gray-400 mb-4'>{description}</p>
      )}

      <div className='mb-2 flex justify-between items-center'>
        <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
          ${current.toLocaleString()} raised
        </span>
        <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
          ${goal.toLocaleString()} goal
        </span>
      </div>

      <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4'>
        <div
          className={`bg-${siteConfig?.colors?.primaryColorCode} h-2.5 rounded-full`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      <div className='flex items-center justify-between mb-4'>
        <span className='text-sm text-gray-600 dark:text-gray-400'>
          {percentage}% of goal
        </span>
        {rest.donorsCount && (
          <span className='text-sm text-gray-600 dark:text-gray-400'>
            {rest.donorsCount} donors
          </span>
        )}
      </div>

      {cta && (
        <Link
          href={cta.link}
          className={`block w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-${siteConfig?.colors?.primaryColorCode} hover:bg-${siteConfig?.colors?.primaryColorCode}/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${siteConfig?.colors?.primaryColorCode}`}
        >
          {cta.text}
        </Link>
      )}
    </div>
  );
};

// NEW COMPONENTS

// CTA Section Component
const CTASection = ({ siteConfig, ...rest }) => {
  const { title, description, buttonText, buttonLink, backgroundImage } = rest;

  return (
    <div className='relative py-16 sm:py-24'>
      {backgroundImage && (
        <div className='absolute inset-0 overflow-hidden'>
          <img
            src={backgroundImage || '/placeholder.svg'}
            alt='Background'
            className='w-full h-full object-cover'
          />
          <div className='absolute inset-0 bg-black opacity-60'></div>
        </div>
      )}

      <div
        className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${
          backgroundImage ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}
      >
        <div className='text-center'>
          <h2 className='text-3xl font-extrabold tracking-tight sm:text-4xl'>
            {title}
          </h2>
          <p className='mt-4 text-lg leading-6 max-w-2xl mx-auto'>
            {description}
          </p>
          <div className='mt-8'>
            <Link
              href={buttonLink}
              className={`inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-${siteConfig?.colors?.primaryColorCode} hover:bg-${siteConfig?.colors?.primaryColorCode}/90`}
            >
              {buttonText}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Content Section Component
const ContentSection = ({ siteConfig, ...rest }) => {
  const {
    title,
    subtitle,
    content,
    image,
    imagePosition = 'right',
    cta,
  } = rest;

  return (
    <div className='py-16 bg-white dark:bg-gray-900'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div
          className={`lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center ${
            imagePosition === 'left' ? 'lg:grid-flow-row-dense' : ''
          }`}
        >
          <div
            className={`${imagePosition === 'left' ? 'lg:col-start-2' : ''}`}
          >
            {subtitle && (
              <p
                className={`text-sm font-semibold tracking-wide uppercase text-${siteConfig?.colors?.primaryColorCode}`}
              >
                {subtitle}
              </p>
            )}
            <h2 className='mt-2 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl'>
              {title}
            </h2>
            <div className='mt-6 text-gray-500 dark:text-gray-300 space-y-6'>
              {typeof content === 'string' ? (
                <p>{content}</p>
              ) : (
                content.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))
              )}
            </div>
            {cta && (
              <div className='mt-8'>
                <Link
                  href={cta.link}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-${siteConfig?.colors?.primaryColorCode} hover:bg-${siteConfig?.colors?.primaryColorCode}/90`}
                >
                  {cta.text}
                </Link>
              </div>
            )}
          </div>
          <div
            className={`mt-10 lg:mt-0 ${
              imagePosition === 'left' ? 'lg:col-start-1' : ''
            }`}
          >
            <div className='aspect-w-5 aspect-h-3 overflow-hidden rounded-lg shadow-lg'>
              <img
                src={image || '/placeholder.svg'}
                alt={title}
                className='w-full h-full object-cover'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Social Proof Section Component
const SocialProofSection = ({ siteConfig, ...rest }) => {
  const { title, testimonials } = rest;

  return (
    <div className='bg-white dark:bg-gray-900 py-16 sm:py-24'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {title && (
          <div className='text-center'>
            <h2 className='text-3xl font-extrabold text-gray-900 dark:text-white'>
              {title}
            </h2>
          </div>
        )}
        <div className='mt-12'>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className='bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-md'
              >
                <div className='flex items-center mb-4'>
                  <div className='flex-shrink-0'>
                    <img
                      className='h-12 w-12 rounded-full'
                      src={testimonial.avatar || '/placeholder.svg'}
                      alt={testimonial.name}
                    />
                  </div>
                  <div className='ml-4'>
                    <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
                      {testimonial.name}
                    </h3>
                    {testimonial.role && (
                      <p className='text-sm text-gray-500 dark:text-gray-400'>
                        {testimonial.role}
                      </p>
                    )}
                  </div>
                </div>
                <div className='relative'>
                  <svg
                    className={`absolute top-0 left-0 transform -translate-x-3 -translate-y-2 h-8 w-8 text-${siteConfig?.colors?.primaryColorCode} opacity-25`}
                    fill='currentColor'
                    viewBox='0 0 32 32'
                    aria-hidden='true'
                  >
                    <path d='M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z' />
                  </svg>
                  <p className='relative mt-4 text-gray-600 dark:text-gray-300'>
                    {testimonial.quote}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// FAQ Section Component
const FAQSection = ({ siteConfig, ...rest }) => {
  const { title, description, faqs } = rest;
  const [openIndex, setOpenIndex] = React.useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className='bg-white dark:bg-gray-900 py-16'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center'>
          <h2 className='text-3xl font-extrabold text-gray-900 dark:text-white'>
            {title}
          </h2>
          {description && (
            <p className='mt-4 text-lg text-gray-500 dark:text-gray-300 max-w-2xl mx-auto'>
              {description}
            </p>
          )}
        </div>
        <div className='mt-12'>
          <dl className='space-y-6 divide-y divide-gray-200 dark:divide-gray-700'>
            {faqs.map((faq, index) => (
              <div key={index} className='pt-6'>
                <dt className='text-lg'>
                  <button
                    onClick={() => toggleFaq(index)}
                    className='text-left w-full flex justify-between items-start text-gray-900 dark:text-white'
                  >
                    <span className='font-medium'>{faq.question}</span>
                    <span className='ml-6 h-7 flex items-center'>
                      <svg
                        className={`${
                          openIndex === index ? '-rotate-180' : 'rotate-0'
                        } h-6 w-6 transform transition-transform duration-200 ease-in-out`}
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M19 9l-7 7-7-7'
                        />
                      </svg>
                    </span>
                  </button>
                </dt>
                <dd
                  className={`mt-2 pr-12 transition-all duration-200 ease-in-out ${
                    openIndex === index
                      ? 'block opacity-100'
                      : 'hidden opacity-0'
                  }`}
                >
                  <p className='text-base text-gray-500 dark:text-gray-300'>
                    {faq.answer}
                  </p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

// Team Section Component
const TeamSection = ({ siteConfig, ...rest }) => {
  const { title, description, members } = rest;

  return (
    <div className='bg-white dark:bg-gray-900 py-16'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center'>
          <h2 className='text-3xl font-extrabold text-gray-900 dark:text-white'>
            {title}
          </h2>
          {description && (
            <p className='mt-4 text-lg text-gray-500 dark:text-gray-300 max-w-2xl mx-auto'>
              {description}
            </p>
          )}
        </div>
        <div className='mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {members.map((member, index) => (
            <div
              key={index}
              className='bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden'
            >
              <img
                className='w-full h-64 object-cover'
                src={member.image || '/placeholder.svg'}
                alt={member.name}
              />
              <div className='p-6'>
                <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
                  {member.name}
                </h3>
                <p
                  className={`text-${siteConfig?.colors?.primaryColorCode} mb-2`}
                >
                  {member.role}
                </p>
                <p className='text-gray-500 dark:text-gray-300 text-sm'>
                  {member.bio}
                </p>
                {member.socialLinks && (
                  <div className='mt-4 flex space-x-3'>
                    {member.socialLinks.map((link, i) => (
                      <a
                        key={i}
                        href={link.url}
                        className={`text-gray-400 hover:text-${siteConfig?.colors?.primaryColorCode}`}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        <Icon name={link.icon} />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Logo Grid Component
const LogoGrid = ({ siteConfig, ...rest }) => {
  const { title, description, logos } = rest;

  return (
    <div className='bg-white dark:bg-gray-900 py-16'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {(title || description) && (
          <div className='text-center'>
            {title && (
              <h2 className='text-3xl font-extrabold text-gray-900 dark:text-white'>
                {title}
              </h2>
            )}
            {description && (
              <p className='mt-4 text-lg text-gray-500 dark:text-gray-300 max-w-2xl mx-auto'>
                {description}
              </p>
            )}
          </div>
        )}
        <div className='mt-10'>
          <div className='grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5'>
            {logos.map((logo, index) => (
              <div key={index} className='flex justify-center'>
                <a
                  href={logo.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-200'
                >
                  <img
                    className='h-16 object-contain'
                    src={logo.image || '/placeholder.svg'}
                    alt={logo.name}
                  />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Stats Section Component
const StatsSection = ({ siteConfig, ...rest }) => {
  const { title, description, stats } = rest;

  return (
    <div className='bg-white dark:bg-gray-900 py-16'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {(title || description) && (
          <div className='text-center'>
            {title && (
              <h2 className='text-3xl font-extrabold text-gray-900 dark:text-white'>
                {title}
              </h2>
            )}
            {description && (
              <p className='mt-4 text-lg text-gray-500 dark:text-gray-300 max-w-2xl mx-auto'>
                {description}
              </p>
            )}
          </div>
        )}
        <div className='mt-10'>
          <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4'>
            {stats.map((stat, index) => (
              <div
                key={index}
                className='bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center'
              >
                {stat.icon && (
                  <div className='flex justify-center mb-4'>
                    <div
                      className={`p-3 rounded-full bg-${siteConfig?.colors?.primaryColorCode}/10 text-${siteConfig?.colors?.primaryColorCode}`}
                    >
                      <Icon name={stat.icon} size={24} />
                    </div>
                  </div>
                )}
                <p className='text-4xl font-extrabold text-gray-900 dark:text-white'>
                  {stat.value}
                </p>
                <p className='mt-2 text-lg font-medium text-gray-500 dark:text-gray-300'>
                  {stat.label}
                </p>
                {stat.description && (
                  <p className='mt-1 text-sm text-gray-400 dark:text-gray-400'>
                    {stat.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const componentBuilders = {
  article: articleBuilder,
  'spa-block': spaBuilder,
  hero: heroBuilder,
  checkbox: CheckBox,
  'checkbox-center': CheckBoxCenter,
  cross: Cross,
  'cross-center': CrossCenter,
  'space-above': ({ ...rest }) => <div className={`h-${rest?.size}`} />,
  'space-below': ({ ...rest }) => <div className={`h-${rest?.size}`} />,
  'full-width-text-block': fullWidthTextBlock,
  'center-width-text-block': centerWidthTextBlock,
  'payfast-button': ({ siteConfig, data, ...rest }) => (
    <PayFastButton {...rest} data={data} siteConfig={siteConfig} />
  ),
  'payfast-button-center-width': ({ siteConfig, data, ...rest }) => (
    <div className='max-w-2xl mx-auto p-4'>
      <PayFastButton {...rest} data={data} siteConfig={siteConfig} />
    </div>
  ),
  'login-button': ({ siteConfig, ...rest }) => (
    <LoginButton {...rest} siteConfig={siteConfig} />
  ),
  'login-button-center-width': ({ siteConfig, ...rest }) => (
    <div className='max-w-2xl mx-auto p-4'>
      <LoginButton {...rest} siteConfig={siteConfig} />
    </div>
  ),
  'alert-banner': ({ siteConfig, ...rest }) => (
    <AlertBanner {...rest} siteConfig={siteConfig} />
  ),
  accordion: ({ siteConfig, ...rest }) => (
    <Accordion {...rest} siteConfig={siteConfig} />
  ),
  card: ({ siteConfig, ...rest }) => <Card {...rest} siteConfig={siteConfig} />,
  modal: ({ siteConfig, ...rest }) => (
    <Modal {...rest} siteConfig={siteConfig} />
  ),
  tabs: ({ siteConfig, ...rest }) => (
    <Tabs tabs={rest} siteConfig={siteConfig} />
  ),
  'centered-page-header': ({ siteConfig, ...rest }) => (
    <CenteredPageHeader {...rest} siteConfig={siteConfig} />
  ),
  'centered-page-components-container': ({ siteConfig, ...rest }) => (
    <CenteredPageComponentsContainer {...rest} siteConfig={siteConfig} />
  ),
  'state-handled-npo-registration-form': ({ siteConfig, ...rest }) => (
    <NpoRegistrationForm {...rest} siteConfig={siteConfig} />
  ),
  'team-member': ({ siteConfig, ...rest }) => (
    <TeamMember {...rest} siteConfig={siteConfig} />
  ),
  timeline: ({ siteConfig, ...rest }) => (
    <Timeline {...rest} siteConfig={siteConfig} />
  ),
  'statistics-grid': ({ siteConfig, ...rest }) => (
    <StatisticsGrid {...rest} siteConfig={siteConfig} />
  ),
  gallery: ({ siteConfig, ...rest }) => (
    <Gallery {...rest} siteConfig={siteConfig} />
  ),
  'contact-form': ({ siteConfig, ...rest }) => (
    <ContactForm {...rest} siteConfig={siteConfig} />
  ),
  'donation-progress': ({ siteConfig, ...rest }) => (
    <DonationProgress {...rest} siteConfig={siteConfig} />
  ),
  'feature-section': FeatureSection,
  'testimonial-section': TestimonialSection,
  'pricing-section': PricingSection,

  // New components
  'cta-section': ({ siteConfig, ...rest }) => (
    <CTASection {...rest} siteConfig={siteConfig} />
  ),
  'content-section': ({ siteConfig, ...rest }) => (
    <ContentSection {...rest} siteConfig={siteConfig} />
  ),
  'social-proof-section': ({ siteConfig, ...rest }) => (
    <SocialProofSection {...rest} siteConfig={siteConfig} />
  ),
  'faq-section': ({ siteConfig, ...rest }) => (
    <FAQSection {...rest} siteConfig={siteConfig} />
  ),
  'team-section': ({ siteConfig, ...rest }) => (
    <TeamSection {...rest} siteConfig={siteConfig} />
  ),
  'logo-grid': ({ siteConfig, ...rest }) => (
    <LogoGrid {...rest} siteConfig={siteConfig} />
  ),
  'stats-section': ({ siteConfig, ...rest }) => (
    <StatsSection {...rest} siteConfig={siteConfig} />
  ),

  FlexwindHero1,
  FlexwindHero5,
  FlexwindHero2,
  FlexwindHero3,
  FlexwindHero4,
  FlexwindHero6,
  FlexwindHero7,
  FlowBiteCta1: (props) => <FlowBiteCta1 {...props} />,
  FlowBiteCta2: (props) => <FlowBiteCta2 {...props} />,
  FlowBiteCta3: (props) => <FlowBiteCta3 {...props} />,
  FlexwindFeatures1,
  PageDoneHowItWorks1,
  Icon,
};

const RenderPageComponents = ({ items, data }) => {
  const siteConfig = useConfig();
  const Components = items?.map((a, i) => {
    console.log('RenderPageComponents', a.type);
    return componentBuilders[a.type]({ ...a, data: a.data, siteConfig });
  });
  return Components;
};

export default RenderPageComponents;
