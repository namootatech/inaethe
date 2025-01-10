import { getThemeConfig } from '@/themes';
import { GiFoodTruck } from 'react-icons/gi';
import { BsBook } from 'react-icons/bs';
import { HiUserGroup } from 'react-icons/hi';
import { Fragment } from 'react';
import React from 'react';
import Link from 'next/link';
import nl2br from 'nl2br';
import { postToURL } from '@/components/payfast/payfast';

import { connect } from 'react-redux';
const icons = {
  'food-truck': GiFoodTruck,
  book: BsBook,
  'user-group': HiUserGroup,
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
import { useConfig } from '@/context/ConfigContext';
import { FlexwindFeatures1 } from './features';
import { PageDoneHowItWorks1 } from './howItWorks';

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
        <h2 className={props.theme?.section?.header?.class}>{item.title}</h2>
        <p
          className=' text-base/loose text-2xl md:text-2xl lg:text-2xl dark:text-gray-900 mb-4'
          dangerouslySetInnerHTML={{ __html: nl2br(item.text) }}
        />
      </React.Fragment>
    ))}
    {props.cta && (
      <Link
        type='button'
        href={props.cta.link}
        className={props.theme?.nav?.ctaClass}
      >
        {props.cta.title}
      </Link>
    )}
  </div>
);

const articleElementBuilders = {
  'image-block': imageBlock,
  'multi-text-blocks': multiTextBlock,
};

const articleBuilder = ({ theme, ...rest }) => {
  const { elements } = rest;
  console.log('theme ar bui', theme);
  return (
    <div className='container'>
      <div className={`grid md:grid-cols-${elements?.length} grid-cols-1`}>
        {elements?.map((e) => {
          return articleElementBuilders[e.type]({ ...e, theme });
        })}
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
          How INA ETHE Works
        </p>
        <p className='mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto'>
          Discover the key features that make INA ETHE the perfect platform for
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
                  src={testimonial.avatar}
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
        {rest.plans.map((plan) => (
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

const spaBuilder = ({ ...rest }) => {
  return (
    <div
      className={`h-full w-full px-10 py-10 px-10 text-center md:text-left ${rest?.bg} ${rest?.fg} text-center`}
    >
      <h2 className=' text-6xl mb-4 text-center mt-4 font-extrabold leading-none tracking-tight dark:text-gray-900'>
        {rest?.title}
      </h2>
      <br />
      <div
        className={`grid md:grid-cols-${rest?.elements?.length} grid-cols-1 flex flex-col justify-center items-center section-image `}
      >
        {rest.elements.map((e) => {
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
  );
};
const heroBuilder = ({ theme, ...rest }) => {
  return (
    <div className='relative container h-full home-page-header flex flex-col justify-center items-center'>
      {/* Background div */}
      <div
        className='absolute inset-0'
        style={{
          backgroundImage: `url('${rest.image}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: -1,
        }}
      ></div>

      {/* Content */}
      <div className='grid md:grid-cols-2 grid-cols-1 flex flex-col justify-center items-center'>
        <div className='h-full px-8 py-8 text-center md:text-left'>
          <h1 className='white-text text-red-700 text-4xl mb-4 font-extrabold leading-none tracking-tight text-gray-900 dark:text-gray-900'>
            {rest?.header}
          </h1>
          {rest?.subHeader && (
            <h2 className='white-text text-2xl mb-4 font-extrabold leading-none tracking-tight text-gray-900 dark:text-gray-900'>
              {rest?.subHeader}
            </h2>
          )}
          <p className='white-text text-base/loose text-2xl md:text-2xl lg:text-2xl dark:text-gray-100 mb-6'>
            {rest?.text}
          </p>
          <Link href={rest.cta.link} className={theme?.heroButton?.class}>
            {rest.cta.title}
          </Link>
        </div>
      </div>
    </div>
  );
};

const fullWidthTextBlock = ({ ...rest }) => (
  <div key={`section-${rest.title}`}>
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
  <div key={`section-${rest.title} `} className='max-w-2xl mx-auto p-4'>
    <h1 className='text-3xl font-semibold leading-normal text-gray-900 dark:text-gray-900 mb-2'>
      {rest?.title}
    </h1>
    <div
      className='text-left text-2xl dark:text-gray-400 mt-2 mb-12'
      dangerouslySetInnerHTML={{ __html: nl2br(rest?.text) }}
    />
  </div>
);

const PayFastButton = ({ theme, data, ...rest }) => {
  return (
    <button
      className={theme?.colors?.button?.primary?.class}
      onClick={() => postToURL(process.env.NEXT_PUBLIC_PAYFAST_URL, data)}
    >
      {rest.title}
    </button>
  );
};

const CheckBox = ({ theme, data, ...rest }) => {
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

const CheckBoxCenter = ({ theme, data, ...rest }) => {
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

const Cross = ({ theme, data, ...rest }) => {
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

const CrossCenter = ({ theme, data, ...rest }) => {
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

const LoginButton = ({ theme, ...rest }) => {
  return (
    <Link href='/login' className={theme?.colors?.button?.primary?.class}>
      {rest.title}
    </Link>
  );
};

const Modal = ({ theme, data, ...rest }) => {
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
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  stroke-width='2'
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

const AlertBanner = ({ theme, ...rest }) => {
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
            stroke-linecap='round'
            stroke-linejoin='round'
            stroke-width='2'
            d='M9 5l7 7-7 7'
          />
        </svg>
        <span>{message}</span>
      </div>
    </div>
  );
};

const Accordion = ({ theme, ...rest }) => {
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

const Card = ({ theme, ...rest }) => {
  const { image, title, description, cta } = rest;
  return (
    <div className='bg-white rounded-lg shadow-md overflow-hidden'>
      <img src={image} alt={title} className='w-full h-48 object-cover' />
      <div className='p-4'>
        <h3 className='text-xl font-semibold text-gray-900'>{title}</h3>
        <p className='mt-2 text-gray-600'>{description}</p>
        {cta && (
          <Link href={cta.link} className='mt-4 inline-block text-indigo-600'>
            {cta.title}
          </Link>
        )}
      </div>
    </div>
  );
};

const Tabs = ({ theme, ...rest }) => {
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

const componentBuilders = {
  article: articleBuilder,
  'spa-block': spaBuilder,
  hero: heroBuilder,
  checkbox: CheckBox,
  'checkbox-center': CheckBoxCenter,
  cross: Cross,
  'cross-center': CrossCenter,
  'space-above': ({ ...rest }) => <div className={`h-${rest.size}`} />,
  'space-below': ({ ...rest }) => <div className={`h-${rest.size}`} />,
  'full-width-text-block': fullWidthTextBlock,
  'center-width-text-block': centerWidthTextBlock,
  'payfast-button': ({ theme, data, ...rest }) => (
    <PayFastButton {...rest} data={data} theme={theme} />
  ),
  'payfast-button-center-width': ({ theme, data, ...rest }) => (
    <div className='max-w-2xl mx-auto p-4'>
      <PayFastButton {...rest} data={data} theme={theme} />
    </div>
  ),
  'login-button': ({ theme, ...rest }) => (
    <LoginButton {...rest} theme={theme} />
  ),
  'login-button-center-width': ({ theme, ...rest }) => (
    <div className='max-w-2xl mx-auto p-4'>
      <LoginButton {...rest} theme={theme} />
    </div>
  ),
  'alert-banner': ({ theme, ...rest }) => (
    <AlertBanner {...rest} theme={theme} />
  ),
  accordion: ({ theme, ...rest }) => <Accordion {...rest} theme={theme} />,
  card: ({ theme, ...rest }) => <Card {...rest} theme={theme} />,
  modal: ({ theme, ...rest }) => <Modal {...rest} theme={theme} />,
  tabs: ({ theme, ...rest }) => <Tabs tabs={rest} theme={theme} />,
  FlexwindHero1,
  FlexwindHero5,
  FlexwindHero2,
  FlexwindHero3,
  FlexwindHero4,
  FlexwindHero6,
  FlexwindHero7,
  FlexwindFeatures1,
  PageDoneHowItWorks1,
};

const Artifacts = ({ items }) => {
  const theme = useConfig();
  const Components = items.map((a, i) => {
    return componentBuilders[a.type]({ ...a, theme });
  });
  return Components;
};

export default Artifacts;
