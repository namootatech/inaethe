import { Poppins } from 'next/font/google';
import RenderPageComponents from '@/components/content/generator';
import Layout from '@/components/layout';
import components from '@/config/demo';
import { useState } from 'react';

function Components({ siteConfig }) {
  const [email, setEmail] = useState('');
  const [selectedComponent, selectComponent] = useState(null);

  console.log('page siteConfig', siteConfig);

  return (
    <div>
      <div className=' container mx-auto ext-lg text-gray-800 max-w-8xl my-8'>
        <div className='bg-gray-900 text-white text-lg p-8 my-4 rounded-md'>
          <h3 className='text-2xl font-bold mt-8 mb-4'>RenderPageComponents</h3>
          <p className='text-gray-200 mb-2'>
            RenderPageComponents are the building blocks we use to build the
            custom webpage confoiguration on the Inaethe System.
            RenderPageComponents are contained in the configuration of a page.
            Listed below you will find a list of the blocks we use.
          </p>
        </div>
        <div className='grid grid-cols-8 gap-2'>
          <div className='col-span-2 border border-gray-200 border solid rounded-md p-4'>
            {components.map((c) => (
              <div
                className={`${
                  selectedComponent?.type === c?.type
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-200 text-gray-800'
                } p-2  m-2 hover:bg-gray-900 hover:pointer hover:text-white rounded-sm shadow-md `}
                onClick={() => selectComponent(c)}
              >
                {c.type}
              </div>
            ))}
          </div>
          <div className='col-span-6 border border-gray-200 border solid rounded-md p-4'>
            {selectedComponent && (
              <RenderPageComponents
                items={[selectedComponent]}
                siteConfig={siteConfig}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Components;
