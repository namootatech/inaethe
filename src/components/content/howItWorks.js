export const PageDoneHowItWorks1 = ({ theme, ...rest }) => {
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
                      class={`self-stretch text-center text-${theme.colors.primaryColorCode} text-4xl font-extrabold font-manrope leading-normal`}
                    >
                      {i + 1}
                    </h3>
                    <h4
                      class={`self-stretch text-center text-${theme.colors.textColorCode} text-xl font-semibold leading-8`}
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
                    class={`md:flex hidden text-${theme.colors.primaryColorCode}`}
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                  >
                    <path
                      d='M5.50159 6L11.5018 12.0002L5.49805 18.004M12.5016 6L18.5018 12.0002L12.498 18.004'
                      stroke={theme.progressColor}
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

<section class='py-24 relative'>
  <div class='w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto'>
    <div class='w-full flex-col justify-start items-center lg:gap-12 gap-10 inline-flex'>
      <div class='w-full flex-col justify-start items-center gap-3 flex'>
        <h2 class='w-full text-center text-gray-900 text-4xl font-bold font-manrope leading-normal'>
          How It Works
        </h2>
        <p class='w-full text-center text-gray-500 text-base font-normal leading-relaxed'>
          A detailed breakdown of processes and mechanisms behind a system or
          product, <br />
          simplifying complex concepts for easy understanding.
        </p>
      </div>
      <div class='w-full justify-start items-center gap-4 flex md:flex-row flex-col'>
        <div class='grow shrink basis-0 flex-col justify-start items-center gap-2.5 inline-flex'>
          <div class='self-stretch flex-col justify-start items-center gap-0.5 flex'>
            <h3 class='self-stretch text-center text-indigo-600 text-4xl font-extrabold font-manrope leading-normal'>
              1
            </h3>
            <h4 class='self-stretch text-center text-gray-900 text-xl font-semibold leading-8'>
              Design and Planning
            </h4>
          </div>
          <p class='self-stretch text-center text-gray-400 text-base font-normal leading-relaxed'>
            Outline the website's purpose, target audience, and features. Create
            wireframes and design mockups to visualize the layout and...
          </p>
        </div>
        <svg
          class='md:flex hidden'
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
        >
          <path
            d='M5.50159 6L11.5018 12.0002L5.49805 18.004M12.5016 6L18.5018 12.0002L12.498 18.004'
            stroke='#4F46E5'
            stroke-width='1.6'
            stroke-linecap='round'
            stroke-linejoin='round'
          />
        </svg>
        <div class='grow shrink basis-0 flex-col justify-start items-center gap-2.5 inline-flex'>
          <div class='self-stretch flex-col justify-start items-center gap-0.5 flex'>
            <h3 class='self-stretch text-center text-indigo-600 text-4xl font-extrabold font-manrope leading-normal'>
              2
            </h3>
            <h4 class='self-stretch text-center text-gray-900 text-xl font-semibold leading-8'>
              Development
            </h4>
          </div>
          <p class='self-stretch text-center text-gray-400 text-base font-normal leading-relaxed'>
            Convert the design into a functional website using HTML, CSS, and
            JavaScript. Ensure the site is responsive and works on various...
          </p>
        </div>
        <svg
          class='md:flex hidden'
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
        >
          <path
            d='M5.50159 6L11.5018 12.0002L5.49805 18.004M12.5016 6L18.5018 12.0002L12.498 18.004'
            stroke='#4F46E5'
            stroke-width='1.6'
            stroke-linecap='round'
            stroke-linejoin='round'
          />
        </svg>
        <div class='grow shrink basis-0 flex-col justify-start items-center gap-2.5 inline-flex'>
          <div class='self-stretch flex-col justify-start items-center gap-0.5 flex'>
            <h3 class='self-stretch text-center text-indigo-600 text-4xl font-extrabold font-manrope leading-normal'>
              3
            </h3>
            <h4 class='self-stretch text-center text-gray-900 text-xl font-semibold leading-8'>
              Testing and Deployment
            </h4>
          </div>
          <p class='self-stretch text-center text-gray-400 text-base font-normal leading-relaxed'>
            Test the website for issues like broken links and bugs. After making
            necessary adjustments, deploy it to a web server and conduct...
          </p>
        </div>
      </div>
    </div>
  </div>
</section>;
