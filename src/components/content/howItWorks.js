export const PageDoneHowItWorks1 = ({ siteConfig, ...rest }) => {
  const { title, description, steps } = rest;
  return (
    <section class='py-24 relative'>
      <div class='w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto'>
        <div class='w-full flex-col justify-start items-center lg:gap-12 gap-10 inline-flex'>
          <div class='w-full flex-col justify-start items-center gap-3 flex'>
            <h2 class='w-full text-center text-gray-900 text-4xl font-bold font-manrope leading-normal'>
              {title}
            </h2>
            <p class='w-full text-center text-gray-500 text-base font-normal leading-relaxed'>
              {description}
            </p>
          </div>
          <div class='w-full justify-start items-center gap-4 flex md:flex-row flex-col'>
            {steps.map((s, i) => (
              <>
                <div class='grow shrink basis-0 flex-col justify-start items-center gap-2.5 inline-flex'>
                  <div class='self-stretch flex-col justify-start items-center gap-0.5 flex'>
                    <h3
                      class={`self-stretch text-center text-${siteConfig.colors.primaryColorCode} text-4xl font-extrabold font-manrope leading-normal`}
                    >
                      {i + 1}
                    </h3>
                    <h4
                      class={`self-stretch text-center text-${siteConfig.colors.textColorCode} text-xl font-semibold leading-8`}
                    >
                      {s.title}
                    </h4>
                  </div>
                  <p class='self-stretch text-center text-gray-400 text-base font-normal leading-relaxed'>
                    {s.description}
                  </p>
                </div>
                {i < steps.length - 1 && (
                  <svg
                    class={`md:flex hidden text-${siteConfig.colors.primaryColorCode}`}
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                  >
                    <path
                      d='M5.50159 6L11.5018 12.0002L5.49805 18.004M12.5016 6L18.5018 12.0002L12.498 18.004'
                      stroke={siteConfig.progressColor}
                      stroke-width='1.6'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                    />
                  </svg>
                )}
              </>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
