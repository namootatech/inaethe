'use client';

import { useState, useEffect } from 'react';
import {
  ChevronRight,
  Code,
  Eye,
  Info,
  Search,
  Layers,
  X,
  Maximize,
  Copy,
  Check,
} from 'lucide-react';
import RenderPageComponents from '@/components/content/generator';
import components from '@/config/demo';

export default function CombinedComponentDocs({ siteConfig }) {
  const [email, setEmail] = useState('');
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [activeTab, setActiveTab] = useState('preview');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [previewBgColor, setPreviewBgColor] = useState('bg-white');
  const [previewWidth, setPreviewWidth] = useState('100%');

  const filteredComponents = components.filter((component) =>
    component.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group components by category
  const groupedComponents = filteredComponents.reduce((acc, component) => {
    const category = component.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(component);
    return acc;
  }, {});

  // Handle escape key to exit full screen
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isFullScreen) {
        setIsFullScreen(false);
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [isFullScreen]);

  // Get component properties for documentation
  const getComponentProperties = (component) => {
    if (!component) return [];

    // Extract properties from the component definition
    const properties = [];

    // Add common properties
    properties.push({
      name: 'type',
      type: 'string',
      description: 'Component type identifier',
      value: component.type,
    });

    // Add component-specific properties
    if (component.title) {
      properties.push({
        name: 'title',
        type: 'string',
        description: 'Component title',
        value: component.title,
      });
    }

    if (component.subtitle) {
      properties.push({
        name: 'subtitle',
        type: 'string',
        description: 'Component subtitle',
        value: component.subtitle,
      });
    }

    if (component.content) {
      properties.push({
        name: 'content',
        type: 'string',
        description: 'Component content',
        value: component.content,
      });
    }

    if (component.items) {
      properties.push({
        name: 'items',
        type: 'array',
        description: 'Component items',
        value: JSON.stringify(component.items),
      });
    }

    // Add any other properties based on the component structure
    Object.keys(component).forEach((key) => {
      if (
        !['type', 'title', 'subtitle', 'content', 'items', 'category'].includes(
          key
        )
      ) {
        properties.push({
          name: key,
          type: typeof component[key],
          description: `${key.charAt(0).toUpperCase() + key.slice(1)} property`,
          value:
            typeof component[key] === 'object'
              ? JSON.stringify(component[key])
              : component[key],
        });
      }
    });

    return properties;
  };

  // Generate component code preview
  const generateComponentCode = (component) => {
    if (!component) return '';

    return `{
  "type": "${component.type}",
  ${Object.entries(component)
    .filter(([key]) => key !== 'type' && key !== 'category')
    .map(([key, value]) => {
      const valueStr =
        typeof value === 'string'
          ? `"${value}"`
          : typeof value === 'object'
          ? JSON.stringify(value, null, 2)
          : value;
      return `"${key}": ${valueStr}`;
    })
    .join(',\n  ')}
}`;
  };

  // Copy code to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Full screen component preview
  const FullScreenPreview = () => {
    if (!isFullScreen) return null;

    return (
      <div className='fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex flex-col'>
        <div className='flex justify-between items-center p-4 bg-gray-800 text-white'>
          <h2 className='text-xl font-semibold'>{selectedComponent?.type}</h2>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2'>
              <label htmlFor='preview-bg' className='text-sm'>
                Background:
              </label>
              <select
                id='preview-bg'
                className='bg-gray-700 text-white text-sm rounded-md px-2 py-1'
                value={previewBgColor}
                onChange={(e) => setPreviewBgColor(e.target.value)}
              >
                <option value='bg-white'>White</option>
                <option value='bg-gray-100'>Light Gray</option>
                <option value='bg-gray-900 text-white'>Dark</option>
                <option value='bg-blue-50'>Light Blue</option>
                <option value='bg-yellow-50'>Light Yellow</option>
              </select>
            </div>
            <div className='flex items-center gap-2'>
              <label htmlFor='preview-width' className='text-sm'>
                Width:
              </label>
              <select
                id='preview-width'
                className='bg-gray-700 text-white text-sm rounded-md px-2 py-1'
                value={previewWidth}
                onChange={(e) => setPreviewWidth(e.target.value)}
              >
                <option value='100%'>Full Width</option>
                <option value='1280px'>Desktop (1280px)</option>
                <option value='1024px'>Small Desktop (1024px)</option>
                <option value='768px'>Tablet (768px)</option>
                <option value='640px'>Large Mobile (640px)</option>
                <option value='375px'>Mobile (375px)</option>
              </select>
            </div>
            <button
              onClick={() => setIsFullScreen(false)}
              className='p-2 rounded-md hover:bg-gray-700 transition-colors'
              aria-label='Close full screen preview'
            >
              <X size={20} />
            </button>
          </div>
        </div>
        <div className='flex-1 overflow-auto flex items-start justify-center p-8'>
          <div
            className={`${previewBgColor} overflow-x-auto`}
            style={{ width: previewWidth, maxWidth: '100%' }}
          >
            <RenderPageComponents
              items={[selectedComponent]}
              siteConfig={siteConfig}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <header className='bg-white border-b border-gray-200 sticky top-0 z-10'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <button
                className='mr-4 p-2 rounded-md hover:bg-gray-100 lg:hidden'
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X size={20} /> : <Layers size={20} />}
              </button>
              <h1 className='text-2xl font-bold text-gray-900'>
                Inaethe Component Library
              </h1>
            </div>
            {/* <div className='hidden md:flex items-center space-x-4'>
              <a href='#' className='text-gray-600 hover:text-gray-900'>
                Documentation
              </a>
              <a href='#' className='text-gray-600 hover:text-gray-900'>
                Examples
              </a>
              <a
                href='#'
                className='bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors'
              >
                Get Started
              </a>
            </div> */}
          </div>
        </div>
      </header>

      <main className='container mx-auto px-4 py-8'>
        <div className='bg-gradient-to-r from-gray-900 to-gray-800 text-white p-8 rounded-lg mb-8'>
          <h2 className='text-3xl font-bold mb-4'>Component Documentation</h2>
          <p className='text-gray-200 text-lg max-w-3xl'>
            Explore the building blocks of the Inaethe System. These components
            are used to build custom webpage configurations. Select a component
            from the sidebar to view its preview and documentation.
          </p>
        </div>

        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Sidebar */}
          <div
            className={`${
              sidebarOpen ? 'block' : 'hidden'
            } lg:block lg:w-1/4 xl:w-1/5`}
          >
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 sticky top-24'>
              <div className='p-4 border-b border-gray-200'>
                <div className='relative'>
                  <Search
                    className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                    size={18}
                  />
                  <input
                    type='text'
                    placeholder='Search components...'
                    className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className='p-2 max-h-[calc(100vh-300px)] overflow-y-auto'>
                {Object.entries(groupedComponents).map(
                  ([category, categoryComponents]) => (
                    <div key={category} className='mb-2'>
                      <div className='flex items-center px-3 py-2 text-sm font-medium text-gray-600'>
                        <ChevronRight size={16} className='mr-1' />
                        {category}
                      </div>
                      <div className='ml-2'>
                        {categoryComponents.map((component) => (
                          <div
                            key={component.type}
                            className={`px-4 py-2 text-sm rounded-md cursor-pointer transition-colors ${
                              selectedComponent?.type === component.type
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            onClick={() => {
                              setSelectedComponent(component);
                              if (window.innerWidth < 1024) {
                                setSidebarOpen(false);
                              }
                            }}
                          >
                            {component.type}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className='flex-1'>
            {selectedComponent ? (
              <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
                <div className='border-b border-gray-200'>
                  <div className='flex flex-wrap'>
                    <button
                      className={`px-6 py-3 font-medium text-sm focus:outline-none ${
                        activeTab === 'preview'
                          ? 'border-b-2 border-gray-900 text-gray-900'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => setActiveTab('preview')}
                    >
                      <Eye size={16} className='inline mr-2' />
                      Preview
                    </button>
                    <button
                      className={`px-6 py-3 font-medium text-sm focus:outline-none ${
                        activeTab === 'code'
                          ? 'border-b-2 border-gray-900 text-gray-900'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => setActiveTab('code')}
                    >
                      <Code size={16} className='inline mr-2' />
                      Code
                    </button>
                    <button
                      className={`px-6 py-3 font-medium text-sm focus:outline-none ${
                        activeTab === 'properties'
                          ? 'border-b-2 border-gray-900 text-gray-900'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => setActiveTab('properties')}
                    >
                      <Info size={16} className='inline mr-2' />
                      Properties
                    </button>
                  </div>
                </div>

                <div className='p-6'>
                  <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                    {selectedComponent.type}
                  </h2>

                  {activeTab === 'preview' && (
                    <div className='border border-gray-200 rounded-lg overflow-hidden'>
                      <div className='bg-gray-100 px-4 py-2 border-b border-gray-200 flex justify-between items-center'>
                        <div className='flex items-center gap-2'>
                          <span className='text-sm text-gray-600'>Preview</span>
                          <select
                            className='text-xs border border-gray-300 rounded px-2 py-1'
                            value={previewBgColor}
                            onChange={(e) => setPreviewBgColor(e.target.value)}
                          >
                            <option value='bg-white'>White Background</option>
                            <option value='bg-gray-100'>
                              Light Gray Background
                            </option>
                            <option value='bg-gray-900 text-white'>
                              Dark Background
                            </option>
                          </select>
                        </div>
                        <button
                          className='text-gray-500 hover:text-gray-700 p-1 rounded'
                          onClick={() => setIsFullScreen(true)}
                          aria-label='View in full screen'
                        >
                          <Maximize size={18} />
                        </button>
                      </div>
                      <div className={`p-6 ${previewBgColor}`}>
                        <RenderPageComponents
                          items={[selectedComponent]}
                          siteConfig={siteConfig}
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 'code' && (
                    <div className='border border-gray-200 rounded-lg overflow-hidden'>
                      <div className='bg-gray-100 px-4 py-2 border-b border-gray-200 flex justify-between items-center'>
                        <span className='font-mono text-sm text-gray-600'>
                          Component JSON
                        </span>
                        <button
                          className='text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1'
                          onClick={() =>
                            copyToClipboard(
                              generateComponentCode(selectedComponent)
                            )
                          }
                        >
                          {copied ? (
                            <>
                              <Check size={14} className='text-green-500' />
                              <span className='text-green-500'>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={14} />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className='p-4 bg-gray-50 overflow-x-auto text-sm'>
                        <code>{generateComponentCode(selectedComponent)}</code>
                      </pre>
                    </div>
                  )}

                  {activeTab === 'properties' && (
                    <div className='border border-gray-200 rounded-lg overflow-hidden'>
                      <div className='overflow-x-auto'>
                        <table className='min-w-full divide-y divide-gray-200'>
                          <thead className='bg-gray-50'>
                            <tr>
                              <th
                                scope='col'
                                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                              >
                                Property
                              </th>
                              <th
                                scope='col'
                                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                              >
                                Type
                              </th>
                              <th
                                scope='col'
                                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                              >
                                Description
                              </th>
                              <th
                                scope='col'
                                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                              >
                                Value
                              </th>
                            </tr>
                          </thead>
                          <tbody className='bg-white divide-y divide-gray-200'>
                            {getComponentProperties(selectedComponent).map(
                              (prop, index) => (
                                <tr
                                  key={index}
                                  className={
                                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                  }
                                >
                                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                                    {prop.name}
                                  </td>
                                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                    {prop.type}
                                  </td>
                                  <td className='px-6 py-4 text-sm text-gray-500'>
                                    {prop.description}
                                  </td>
                                  <td className='px-6 py-4 text-sm text-gray-500 max-w-xs truncate'>
                                    {typeof prop.value === 'string' &&
                                    prop.value.length > 50
                                      ? `${prop.value.substring(0, 50)}...`
                                      : prop.value}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center'>
                <div className='mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
                  <ChevronRight size={24} className='text-gray-400' />
                </div>
                <h3 className='text-lg font-medium text-gray-900 mb-2'>
                  Select a component
                </h3>
                <p className='text-gray-500'>
                  Choose a component from the sidebar to view its preview and
                  documentation.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className='bg-white border-t border-gray-200 mt-12'>
        <div className='container mx-auto px-4 py-8'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <div className='mb-4 md:mb-0'>
              <p className='text-gray-600'>
                © {new Date().getFullYear()} Inaethe System. All rights
                reserved.
              </p>
            </div>
            {/* <div className='flex space-x-6'>
              <a href='#' className='text-gray-600 hover:text-gray-900'>
                Documentation
              </a>
              <a href='#' className='text-gray-600 hover:text-gray-900'>
                GitHub
              </a>
              <a href='#' className='text-gray-600 hover:text-gray-900'>
                Support
              </a>
            </div> */}
          </div>
        </div>
      </footer>

      {/* Full Screen Preview Modal */}
      <FullScreenPreview />
    </div>
  );
}
