import React from 'react';

export const FlowBiteMarketingContent1 = ({ theme, data, ...rest }) => {
  const { colors } = theme || {};
  const { title, description, link } = rest;

  return (
    <div className={`bg-${colors?.background || 'white'} p-6 rounded-lg shadow`}>  
      <h2 className={`text-${colors?.primaryText || 'gray-800'} mb-4 text-4xl tracking-tight font-bold`}>
        {title}
      </h2>
      {description}
      <a
        href={link || '#'}
        className={`inline-flex items-center font-medium text-${colors?.primary || 'primary-600'} hover:text-${colors?.hoverPrimary || 'primary-800'} dark:text-${colors?.darkPrimary || 'primary-500'} dark:hover:text-${colors?.darkHoverPrimary || 'primary-700'}`}
      >
        Learn more
        <svg
          className="ml-1 w-6 h-6"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          ></path>
        </svg>
      </a>
    </div>
  );
};
