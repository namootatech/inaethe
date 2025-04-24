import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { SidebarProvider } from '@/components/ui/sidebar';
import Sidebar from './sidebar';
import TopBar from './topbar';

export default function Layout({ children }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  return (
    <SidebarProvider>
      <div className='flex h-screen bg-gray-950 text-gray-100'>
        <Sidebar expanded={sidebarExpanded} setExpanded={setSidebarExpanded} />
        <div className='flex flex-col flex-1 overflow-hidden'>
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
