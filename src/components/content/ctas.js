import React from 'react'

const FlowBiteCta1 = ({ theme, data, ...rest }) => {
    const { title, description, link, image, darkImage } = rest;
    const { colors } = theme;

    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="gap-8 items-center py-8 px-4 mx-auto max-w-screen-xl xl:gap-16 md:grid md:grid-cols-2 sm:py-16 lg:px-6">
                <img 
                    className="w-full dark:hidden" 
                    src={image || "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/cta/cta-dashboard-mockup.svg"} 
                    alt="dashboard image"
                />
                <img 
                    className="w-full hidden dark:block" 
                    src={darkImage || "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/cta/cta-dashboard-mockup-dark.svg"} 
                    alt="dashboard image"
                />
                <div className="mt-4 md:mt-0">
                    <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
                        {title}
                    </h2>
                    <p className="mb-6 font-light text-gray-500 md:text-lg dark:text-gray-400">
                        {description}
                    </p>
                    <a 
                        href={link} 
                        className={`inline-flex items-center text-white bg-${colors.primaryColorCode} hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900`}
                    >
                        Get started
                        <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
};

const FlowBiteCta2 = ({
    heading = "Let's find more that brings us together.",
    description = "Flowbite helps you connect with friends, family and communities of people who share your interests. Connecting with your friends and family as well as discovering new ones is easy with features like Groups, Watch and Marketplace.",
    primaryButton = { text: "Get started", link: "#" },
    secondaryButton = { text: "View more", link: "#" },
  }) => {
    return (
      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
          <div className="max-w-screen-md">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
              {heading}
            </h2>
            <p className="mb-8 font-light text-gray-500 sm:text-xl dark:text-gray-400">
              {description}
            </p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <a
                href={primaryButton.link}
                className="inline-flex items-center justify-center px-4 py-2.5 text-base font-medium text-center text-white bg-primary-700 rounded-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
              >
                {primaryButton.text}
              </a>
              <a
                href={secondaryButton.link}
                className="inline-flex items-center justify-center px-4 py-2.5 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                <svg
                  className="mr-2 -ml-1 w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
                </svg>
                {secondaryButton.text}
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  const FlowBiteCta3 = ({ theme, data, ...rest }) => {
    const { title, description, buttonText, buttonLink } = rest;
    const { colors } = theme;
    
    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-sm text-center">
                    <h2 className="mb-4 text-4xl tracking-tight font-extrabold leading-tight text-gray-900 dark:text-white">
                        {title}
                    </h2>
                    <p className="mb-6 font-light text-gray-500 dark:text-gray-400 md:text-lg">
                        {description}
                    </p>
                    <a 
                        href={buttonLink} 
                        className={`text-white bg-${colors.primaryColorCode} hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800`}
                    >
                        {buttonText}
                    </a>
                </div>
            </div>
        </section>
    );
};


export { FlowBiteCta1, FlowBiteCta2, FlowBiteCta3 };
