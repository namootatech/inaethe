import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { SidebarProvider } from '@/components/ui/sidebar';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function Layout({ children }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  return (
    <SidebarProvider>
      <div className='flex h-screen bg-gray-900 text-gray-100 grid grid-cols-6'>
        <div className='col-span-2'>
          <Sidebar
            expanded={sidebarExpanded}
            setExpanded={setSidebarExpanded}
          />
        </div>
        <div className='col-span-4 flex flex-col flex-1 overflow-hidden'>
          <TopBar />
          <main className='flex-1 overflow-x-hidden overflow-y-auto bg-gray-800 p-6'>
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
