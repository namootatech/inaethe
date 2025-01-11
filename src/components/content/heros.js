'use client';

import { useEventHandler } from '@/context/EventHandlers';
import Link from 'next/link';
import { path } from 'ramda';
import { useState } from 'react';
export const FlexwindHero1 = ({ theme, ...rest }) => {
  const { title, description, ctas, img, ratings } = rest;
  return (
    <main class='w-full'>
      <section class='relative pt-10 xl:pt-14'>
        <div class='mx-auto lg:max-w-7xl w-full px-5 sm:px-10 md:px-12 lg:px-5 flex flex-col lg:flex-row gap-8 lg:gap-10 xl:gap-12'>
          <div class='mx-auto text-center lg:text-left flex flex-col max-w-3xl justify-center lg:justify-start lg:py-8 flex-1 lg:w-1/2 lg:max-w-none'>
            <h1
              class={`text-${theme.colors.primaryColorCode}  dark:text-${theme.colors.darkThemeTextColorCode}  text-4xl/snug sm:text-6xl/tight lg:text-5xl/tight xl:text-6xl/tight font-semibold text`}
            >
              {title}
            </h1>
            <p
              class={`mt-10 text-${theme.colors.textColorCode}  dark:${theme.colors.darkThemeTextColorCode}  lg:text-lg max-w-2xl lg:max-w-none mx-auto`}
            >
              {description}
            </p>
            <div class='mt-10 flex gap-4 justify-center lg:justify-start flex-wrap'>
              {ctas.map((cta) => (
                <a
                  href={cta.link}
                  class='relative px-6 py-3 before:absolute before:inset-0 before:rounded-lg before:transition active:before:bg-indigo-700 text-white hover:before:bg-indigo-800 before:bg-indigo-600 hover:before:scale-105'
                >
                  <span class='relative'>{cta.text}</span>
                </a>
              ))}
            </div>
          </div>
          <div class='flex flex-1 lg:w-1/2 relative max-w-3xl mx-auto lg:max-w-none'>
            <img
              src={img.src}
              alt={img.alt}
              width='1850'
              height='auto'
              class='lg:absolute w-full lg:inset-x-0 object-cover lg:h-full'
            />
            <div class='absolute left-1/2 -translate-x-1/2 lg:-translate-x-0 -bottom-10 w-60 p-4 rounded-lg bg-white dark:bg-gray-950 border dark:border-gray-800'>
              <div
                class={`flex children:ring-4 children:ring-white dark:children:ring-${theme.colors.textColorCode}  children:w-9 children:h-9 children:object-cover children:-ml-1 children:rounded-full`}
              >
                {ratings.imgs?.map((img) => (
                  <img
                    src={img.src}
                    alt={img.alt}
                    width='1920'
                    height='1320'
                    class='!-ml-0'
                  />
                ))}
              </div>
              <div>
                <p
                  class={`text-lg font-semibold text-${theme.colors.primaryColorCode}  dark:text-white`}
                >
                  {ratings.title}
                </p>
                <p class='text-gray-700 dark:text-gray-300 flex'>
                  <span class='text-yellow-500 text-xl'>&starf;</span>{' '}
                  {ratings.rating} ({ratings.count}
                  {ratings.type})
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export const FlexwindHero2 = ({ theme, ...rest }) => {
  const { title, description, ctas, partners, img1, img2 } = rest;
  return (
    <section class='py-4 mt-14 sm:mt16 lg:mt-0'>
      <div class='mx-auto lg:max-w-7xl w-full px-5 sm:px-10 md:px-12 lg:px-5 grid lg:grid-cols-2 lg:items-center gap-10'>
        <div class='flex flex-col space-y-8 sm:space-y-10 lg:items-center text-center lg:text-left max-w-2xl md:max-w-3xl mx-auto'>
          <h1
            class={` font-semibold leading-tight text-${theme.colors.textColorCode}  dark:text-${theme.colors.darkThemeTextColorCode}  text-4xl sm:text-5xl lg:text-6xl`}
          >
            {title}
          </h1>
          <p
            class={` flex text-${theme.colors.textColorCode}  dark:text-${theme.colors.darkThemeTextColorCode}  tracking-tight md:font-normal max-w-xl mx-auto lg:max-w-none`}
          >
            {description}
          </p>
          <div class='flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full'>
            {ctas.map((cta) => {
              if (cta.style === 'light') {
                return (
                  <a
                    href={cta.link}
                    class={`px-6 items-center h-12 rounded-3xl text-${theme.colors.primaryColorCode}  border border-gray-100 dark:border-gray-800 dark:text-white bg-gray-100 dark:bg-gray-900 duration-300 ease-linear flex justify-center w-full sm:w-auto`}
                  >
                    {cta.text}
                  </a>
                );
              }
              return (
                <a
                  href={cta.link}
                  class={`px-6 items-center h-12 rounded-3xl bg-${theme.colors.primaryColorCode}  text-${theme.colors.darkThemeTextColorCode}  duration-300 ease-linear flex justify-center w-full sm:w-auto`}
                >
                  {cta.text}
                </a>
              );
            })}
          </div>
          <div class='mt-5 flex items-center justify-center flex-wrap gap-4 lg:justify-start w-full'>
            {partners.map((partner) => (
              <a href={partner.link} target='_blank'>
                <span class='sr-only'>{partner.name}</span>
                <img
                  src={partner.img}
                  alt={partner.name}
                  class='h-10 w-auto dark:grayscale'
                />
              </a>
            ))}
          </div>
        </div>
        <div class='flex aspect-square lg:aspect-auto lg:h-[35rem] relative'>
          <div class='w-3/5 h-[80%] rounded-3xl overflow-clip border-8 border-gray-200 dark:border-gray-950 z-30'>
            <img
              src={img1.src}
              alt={img1.alt}
              width='300'
              class='w-full h-full object-cover z-30'
            />
          </div>
          <div class='absolute right-0 bottom-0 h-[calc(100%-50px)] w-4/5 rounded-3xl overflow-clip border-4 border-gray-200 dark:border-gray-800 z-10'>
            <img
              src={img2.src}
              alt={img2.alt}
              width='300'
              class='z-10 w-full h-full object-cover'
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export const FlexwindHero3 = ({ theme, ...rest }) => {
  const { title, description, ctas, hint } = rest;
  return (
    <section class='bg-gray-100 dark:bg-gray-900 py-32 sm:py-36 lg:py-40 overflow-hidden h-[100dvh] min-h-max flex items-center relative'>
      <div
        class='absolute top-0 left-0 -translate-x-[54%] -translate-y-[70%] w-2/5 rounded-full aspect-square bg-${theme.colors.primaryColorCode}/70
    backdrop-filter blur-3xl opacity-50'
      ></div>
      <div
        class='absolute bottom-0 right-0 translate-x-[54%] translate-y-[70%] w-2/5 rounded-full aspect-square bg-${theme.colors.primaryColorCode}/70
    backdrop-filter blur-3xl opacity-50'
      ></div>
      <div
        class={`absolute min-w-[300px] w-[48%] md:w-2/5 aspect-square rounded-full bg-gradient-to-r from-${theme.colors.primaryColorCode}/5 right-0
    -translate-y-[40%] translate-x-[40%] top-0`}
      >
        <div
          class={`inset-[10%] rounded-full bg-gradient-to-l from-${theme.colors.primaryColorCode}/20`}
        >
          <div
            class={`absolute inset-[20%] rounded-full bg-gradient-to-l from-${theme.colors.primaryColorCode}/30`}
          ></div>
        </div>
      </div>
      <div
        class={`absolute min-w-[300px] w-[48%] md:w-2/5 aspect-square rounded-full bg-gradient-to-l from-${theme.colors.primaryColorCode}/5 left-0
    translate-y-[40%] -translate-x-[40%] bottom-0`}
      >
        <div class='inset-[10%] rounded-full bg-gradient-to-r from-${theme.colors.primaryColorCode}/40'>
          <div
            class={`absolute inset-[20%] rounded-full bg-gradient-to-r from-${theme.colors.primaryColorCode}/50`}
          ></div>
        </div>
      </div>
      <div class='mx-auto lg:max-w-7xl w-full px-5 sm:px-10 md:px-12 lg:px-5'>
        <div class='text-center flex flex-col items-center space-y-10'>
          <span class='border border-gray-500 px-3 py-0.5 rounded-full bg-gray-50 dark:bg-gray-950 bg-opacity-50 text-gray-700 dark:text-gray-300'>
            {hint}
          </span>
          <h1 class='text-4xl md:text-5xl lg:text-6xl/tight xl:text-7xl/tight text-gray-900 dark:text-white font-bold max-w-4xl capitalize'>
            {title}
          </h1>
          <p class='text-base text-gray-700 dark:text-gray-300 text-center max-w-xl'>
            {description}
          </p>
          <div class='flex justify-center'>
            <a
              href={ctas[0].link}
              class={`px-8 h-12 rounded-full flex items-center gap-x-3 bg-${theme.colors.primaryColorCode} text-white hover:bg-opacity-80`}
            >
              {ctas[0].text}
              <span>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                  class='w-5 h-5'
                >
                  <path
                    fill-rule='evenodd'
                    d='M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z'
                    clip-rule='evenodd'
                  />
                </svg>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export const FlexwindHero4 = ({ theme, data, ...rest }) => {
  const [state, setState] = useState({});

  const { title, description, ctas, img } = rest;
  const { email } = data;
  const { handleEvent } = useEventHandler
    ? useEventHandler()
    : {
        handleEvent: () => {},
      };
  const handleEmailChangeEvent = handleEvent(
    email['on-change'],
    theme,
    state,
    setState
  );
  const handleSubmitEvent = handleEvent(
    ctas[0]['on-click'],
    theme,
    state,
    setState
  );
  return (
    <section class='relative pt-32 lg:pt-36'>
      <div class='mx-auto lg:max-w-7xl w-full px-5 sm:px-10 md:px-12 lg:px-5 flex flex-col lg:flex-row gap-10 lg:gap-12'>
        <div class='absolute w-full lg:w-1/2 inset-y-0 lg:right-0 hidden lg:block'>
          <span
            class={`absolute -left-6 md:left-4 top-24 lg:top-28 w-24 h-24 rotate-90 skew-x-12 rounded-3xl bg-${theme.colors.secondaryColorCode} blur-xl opacity-60 lg:opacity-95 lg:block hidden`}
          ></span>
          <span
            class={`absolute right-4 bottom-12 w-24 h-24 rounded-3xl bg-${theme.colors.primaryColorCode} blur-xl opacity-80`}
          ></span>
        </div>
        <span
          class={`w-4/12 lg:w-2/12 aspect-square bg-gradient-to-tr from-${theme.colors.primaryColorCode} to-${theme.colors.secondaryColorCode} absolute -top-5 lg:left-0 rounded-full skew-y-12 blur-2xl opacity-40 skew-x-12 rotate-90`}
        ></span>
        <div
          class='relative flex flex-col items-center text-center lg:text-left lg:py-7 xl:py-8 
        lg:items-start lg:max-w-none max-w-3xl mx-auto lg:mx-0 lg:flex-1 lg:w-1/2'
        >
          <h1
            class={`text-3xl/tight sm:text-4xl/tight md:text-5xl/tight xl:text-6xl/tight
        font-bold text-${theme.colors.textColorCode} dark:text-${theme.colors.darkThemeTextColorCode}`}
          >
            {title}
          </h1>
          <p class='mt-8 text-gray-700 dark:text-gray-300'>{description}</p>
          <div class='mt-10  w-full flex max-w-md mx-auto lg:mx-0'>
            <div class='flex sm:flex-row flex-col gap-5 w-full'>
              <form
                action='#'
                class={`py-1 pl-6 w-full pr-1 flex gap-3 items-center text-${theme.colors.textColorCode} dark:text-${theme.colors.darkThemeTextColorCode} shadow-lg shadow-gray-200/20 dark:shadow-transparent
                        border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 rounded-full ease-linear focus-within:bg-white dark:focus-within:bg-gray-950  focus-within:border-${theme.colors.primaryColorCode}`}
              >
                <span class='min-w-max pr-2 border-r border-gray-200 dark:border-gray-800'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='20'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke-width='1.5'
                    stroke='currentColor'
                    class='w-5 h-5'
                  >
                    <path
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      d='M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V19.5z'
                    />
                  </svg>
                </span>
                <input
                  type='email'
                  name=''
                  id=''
                  placeholder='johndoe@gmail.com'
                  onChange={handleEmailChangeEvent}
                  value={state.email}
                  class='w-full py-3 outline-none bg-transparent'
                />
                <button
                  onClick={handleSubmitEvent}
                  class={`flex text-white justify-center items-center w-max min-w-max sm:w-max px-6 h-12 rounded-full outline-none relative overflow-hidden border duration-300 ease-linear
                            after:absolute after:inset-x-0 after:aspect-square after:scale-0 after:opacity-70 after:origin-center after:duration-300 after:ease-linear after:rounded-full after:top-0 after:left-0 after:bg-[#172554] hover:after:opacity-100 hover:after:scale-[2.5] bg-${theme.colors.primaryColorCode} border-transparent hover:border-${theme.colors.primaryColor}-900`}
                >
                  <span class='hidden sm:flex relative z-[5]'>
                    {ctas[0].text}
                  </span>
                  <span class='flex sm:hidden relative z-[5]'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke-width='1.5'
                      stroke='currentColor'
                      class='w-5 h-5'
                    >
                      <path
                        stroke-linecap='round'
                        stroke-linejoin='round'
                        d='M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5'
                      />
                    </svg>
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>

        <div class='flex flex-1 lg:w-1/2 lg:h-auto relative lg:max-w-none lg:mx-0 mx-auto max-w-3xl'>
          <img
            src={img.src}
            alt={img.alt}
            width='2350'
            height='2359'
            class='lg:absolute lg:w-full lg:h-full rounded-3xl object-cover lg:max-h-none max-h-96'
          />
        </div>
      </div>
    </section>
  );
};

export const FlexwindHero6 = ({ theme, ...rest }) => {
  const { title, description, ctas, stats } = rest;
  console.log(theme, config);
  console.log('primary', theme.colors.primaryColorCode);
  console.log('dark', theme.colors.darkThemeTextColorCode);
  console.log('secondary', theme.colors.secondaryColorCode);
  console.log('textColor', theme.colors.textColorCode);
  return (
    <>
      <section className='relative min-h-max bg-white dark:bg-gray-950'>
        <div
          className={`absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-2/5 aspect-[2/0.5] bg-gradient-to-br from-${theme.colors.primaryColorCode} to-${theme.colors.secondaryColorCode} rounded-full opacity-50 blur-2xl`}
        ></div>
        <div className='relative mx-auto pt-32 pb-24 lg:max-w-7xl w-full px-5 sm:px-10 md:px-12 lg:px-5 text-center space-y-10'>
          <h1 className='text-gray-900 dark:text-white mx-auto max-w-5xl font-bold text-4xl/tight sm:text-5xl/tight lg:text-6xl/tight xl:text-7xl/tight'>
            {title}
          </h1>
          <p className='text-gray-700 dark:text-gray-300 mx-auto max-w-2xl'>
            {description}
          </p>
          <div className='flex justify-center items-center flex-wrap mx-auto gap-4'>
            {ctas.map((cta) => {
              if (cta.style === 'light') {
                return (
                  <Link
                    href={cta.link}
                    className={`flex items-center h-12 px-6 rounded-full bg-gray-100 dark:bg-gray-900 text-${theme.colors.primaryColorCode} dark:text-gray-300 border border-gray-200 dark:border-gray-800`}
                  >
                    {cta.text}
                  </Link>
                );
              }
              return (
                <Link
                  href={cta.link}
                  className={`flex items-center h-12 px-6 rounded-full bg-${theme.colors.primaryColorCode} text-white border border-${theme.colors.primaryColorCode}`}
                >
                  {cta.text}
                </Link>
              );
            })}
          </div>
          <div className='text-left grid lg:grid-cols-3 p-6 rounded-2xl bg-gradient-to-tr from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 border border-gray-100 dark:border-gray-800 max-w-2xl lg:max-w-5xl mx-auto lg:divide-x divide-y lg:divide-y-0 divide-gray-300 dark:divide-gray-800'>
            <div className='flex items-start gap-6 lg:pr-6 pb-6 lg:pb-0'>
              <div className='w-10'>
                <span className='p-3 rounded-xl bg-gray-200 dark:bg-gray-800 flex w-max text-gray-800 dark:text-gray-200'>
                  {stats[0].icon}
                </span>
              </div>
              <div className='flex-1 space-y-1'>
                <h2 className='text-gray-900 dark:text-white font-semibold text-lg'>
                  {stats[0].title}
                </h2>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  {stats[0].detail}
                </p>
              </div>
            </div>
            <div className='flex items-start gap-6 lg:px-6 py-6 lg:py-0'>
              <div className='w-10'>
                <span className='p-3 rounded-xl bg-gray-200 dark:bg-gray-800 flex w-max text-gray-800 dark:text-gray-200'>
                  {stats[1].icon}
                </span>
              </div>
              <div className='flex-1 space-y-1'>
                <h2 className='text-gray-900 dark:text-white font-semibold text-lg'>
                  {stats[1].title}
                </h2>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  {stats[1].detail}
                </p>
              </div>
            </div>
            <div className='flex items-start gap-6 pt-6 lg:pt-0 lg:pl-6'>
              <div className='w-10'>
                <span className='p-3 rounded-xl bg-gray-200 dark:bg-gray-800 flex w-max text-gray-800 dark:text-gray-200'>
                  {stats[2].icon}
                </span>
              </div>
              <div className='flex-1 space-y-1'>
                <h2 className='text-gray-900 dark:text-white font-semibold text-lg'>
                  {stats[2].title}
                </h2>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  {stats[2].detail}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export const FlexwindHero5 = ({ theme, ...rest }) => {
  const { title, description, img, ctas, stats } = rest;
  return (
    <>
      <main>
        <section className='relative bg-green-50 dark:bg-gray-900/30 pt-32 lg:pt-24 pb-32 lg:pb-4'>
          <div className='mx-auto lg:max-w-7xl w-full px-5 sm:px-10 md:px-12 lg:px-5 relative'>
            <div className='absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 lg:-translate-x-0 lg:-translate-y-0 lg:left-0 lg:top-16 w-40 h-40 skew-x-6 opacity-50 dark:opacity-80 rounded-full bg-gradient-to-bl from-green-600 to-sky-400 blur-3xl flex' />
            <div className='flex text-center lg:text-left flex-col lg:items-center lg:flex-row gap-8 lg:gap-10 xl:gap-12 relative max-w-4xl lg:max-w-none'>
              <div className='space-y-8 xl:space-y-10 lg:py-12 flex-1 lg:w-1/2'>
                <h1 className='text-green-950 dark:text-white text-3xl/tight sm:text-4xl/tight md:text-5xl/tight xl:text-6xl/tight font-bold'>
                  {title}
                </h1>
                <p className='text-gray-700 dark:text-gray-300 max-w-md mx-auto lg:max-w-none'>
                  {description}
                </p>
                <div className='flex flex-wrap items-center gap-4 z-30 sm:w-max sm:flex-nowrap mx-auto lg:mx-0'>
                  {ctas.map((cta) => {
                    if (cta.style == 'light') {
                      return (
                        <a
                          href=''
                          className={`px-5 h-12 flex items-center sm:w-max w-full justify-center gap-x-3 border border-gray-200 dark:border-gray-900/60 rounded-lg text-${theme.colors.primaryColorCode}  dark:text-gray-100 bg-${theme.colors.lightBgColorCode}  dark:bg-gray-900`}
                        >
                          <span>{cta.icon}</span>
                          {cta.text}
                        </a>
                      );
                    }
                    return (
                      <a
                        href='#'
                        className={`px-5 h-12 flex items-center sm:w-max w-full justify-center bg-gradient-to-br from-${theme.colors.primaryColorCode} to-${theme.colors.secondaryColorCode}  text-white rounded-lg ease-linear transition`}
                      >
                        Get Started
                      </a>
                    );
                  })}
                </div>
                <div className='max-w-lg lg:max-w-none mx-auto grid sm:grid-cols-3 divide-y divide-gray-100 dark:divide-gray-900 sm:divide-y-0 sm:gap-2 p-4 py-0 sm:py-4 text-left rounded-lg bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-900 shadow-sm shadow-gray-200/50 dark:shadow-transparent'>
                  {stats.map((metric) => (
                    <div
                      key={metric.id}
                      className='flex items-center gap-x-4 py-4 sm:py-0'
                    >
                      <span
                        className={`w-10 h-10 text-white bg-gradient-to-br from-${theme.colors.primaryColorCode}  to-${theme.colors.secondaryColorCode}  rounded-md flex items-center justify-center`}
                      >
                        {metric.icon}
                      </span>
                      <div className='flex-1 flex flex-col text-sm'>
                        <h4 className=' text-gray-700 dark:text-gray-300 font-semibold'>
                          {metric.detail}
                        </h4>
                        <span className='text-xs text-gray-400'>
                          {metric.title}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div
                aria-hidden='true'
                className='flex-1 lg:w-1/2 relative hidden lg:flex justify-end pr-8'
              >
                <div
                  className={`rounded-lg absolute right-0 bottom-0 w-11/12 h-2/5 bg-gradient-to-tr from-${theme.colors.lightBgColorCode}  to-${theme.colors.secondaryLightBgColorCode}  dark:bg-gradient-to-tr dark:from-gray-950 dark:to-gray-700`}
                />
                <img
                  src={img.src}
                  width={3200}
                  className='w-11/12 h-auto relative'
                  alt={img.alt}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export const FlexwindHero7 = ({ theme, ...rest }) => {
  return (
    <>
      <Navbar />
      <section className='relative w-full'>
        <div className='absolute top-0 inset-x-0 h-64 flex items-start'>
          <div className='h-24 w-2/3 bg-gradient-to-br from-${theme.colors.primaryColorCode} opacity-20 blur-2xl dark:from-${theme.colors.secondaryColorCode}  dark:invisible dark:opacity-40'></div>
          <div className='h-20 w-3/5 bg-gradient-to-r from-${theme.colors.primaryColorCode}  opacity-40 blur-2xl dark:from-${theme.colors.secondaryColorCode}  dark:opacity-40'></div>
        </div>
        <div className='mx-auto lg:max-w-7xl w-full px-5 sm:px-10 md:px-12 lg:px-5 relative'>
          <div
            aria-hidden='true'
            className='absolute inset-y-0 w-44 left-0 hidden dark:flex'
          >
            <div className='h-full md:h-1/2 lg:h-full w-full bg-gradient-to-tr opacity-40 dark:blur-2xl dark:from-${theme.colors.primaryColorCode}  dark:opacity-20'></div>
          </div>
          <div className='grid lg:grid-cols-2 gap-10 xl:gap-14 relative pt-24 lg:max-w-none max-w-2xl md:max-w-3xl mx-auto'>
            <div className='lg:py-6'>
              <div className='text-center lg:text-left'>
                <span className='px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-900 text-${theme.colors.textPrimaryCode}  dark:text-gray-200'>
                  {hint}
                </span>
                <h1 className='text-gray-800 pt-4 dark:text-white font-bold text-4xl md:text-5xl lg:text-6xl'>
                  {title}
                </h1>
              </div>
              <p className='text-gray-600 dark:text-gray-300 mt-8 text-center lg:text-left mx-auto max-w-xl'>
                {description}
              </p>
              <div className='flex items-center gap-4 mt-8 flex-col sm:flex-row sm:w-max sm:mx-auto lg:mx-0'>
                {ctas.map((cta) => {
                  if (cta.style === 'light') {
                    return (
                      <Link
                        href={cta.link}
                        className={`px-7 relative text-${theme.colors.primaryColorCode}  h-12 flex w-full sm:w-max justify-center items-center before:bg-${theme.colors.primaryColorCode} /5 dark:before:bg-${theme.colors.primaryColorCode} /10 before:absolute before:inset-0 before:rounded-full before:transition-transform before:ease-linear hover:before:scale-105 active:before:scale-95`}
                      >
                        <span className='relative text-${theme.colors.primaryColorCode}  flex items-center gap-x-3'>
                          {cta.icon}
                          {cta.text}
                          Listening Episode
                        </span>
                      </Link>
                    );
                  }
                  return (
                    <Link
                      href={cta.link}
                      className={`'px-7 relative text-white h-12 flex w-full sm:w-max justify-center items-center before:bg-${theme.colors.primaryColorCode}  before:absolute before:inset-0 before:rounded-full before:transition-transform before:ease-linear hover:before:scale-105 active:before:scale-95'`}
                    >
                      <span className='relative text-white flex items-center gap-x-3'>
                        {cta.icon}
                        {cta.text}
                        Listening Episode
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className='lg:h-full hidden md:flex'>
              <div className='flex w-full h-96 min-h-[24rem] lg:min-h-[none] lg:w-full lg:h-full items-center relative'>
                <div
                  className={`absolute z-0 top-1/2 -translate-y-1/2 w-5/6 right-0 h-[calc(80%+20px)] bg-gradient-to-tr opacity-25 from-${theme.colors.primaryColorCode} to-${theme.colors.secondaryColorCode} dark:from-${theme.colors.secondaryColorCode} dark:to-${theme.colors.primaryColorCode} blur-2xl`}
                ></div>
                <div className='absolute w-3/5 h-full z-10 p-1 -translate-y-1/2 top-1/2 right-3 rounded-3xl bg-white dark:bg-gray-950  shadow-lg shadow-gray-100 dark:shadow-transparent  border border-gray-200 dark:border-gray-800'>
                  <img
                    src={img1.src}
                    alt={img1.alt}
                    width={500}
                    height='auto'
                    loading='lazy'
                    className='w-full h-full rounded-2xl object-cover'
                  />
                </div>
                <div className='absolute -translate-y-1/2 top-1/2 h-[calc(80%-2rem)] w-[calc(40%-20px)] p-1 rounded-3xl bg-white dark:bg-gray-950  shadow-lg shadow-gray-100 dark:shadow-transparent  border border-gray-200 dark:border-gray-800'>
                  <img
                    src={img2.src}
                    alt={img2.alt}
                    width={200}
                    height='auto'
                    loading='lazy'
                    className='w-full h-full rounded-2xl object-cover'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
