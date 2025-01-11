import { createContext, useContext, useState, useEffect } from 'react';

const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        console.log('** [CONFIG CONTEXT] Building config url...');
        let configPath = process.env.NEXT_PUBLIC_CONFIG_NAME;

        // If configPath is a relative path, prepend the base URL
        if (!configPath.startsWith('http')) {
          const baseUrl =
            process.env.NEXT_PUBLIC_WEBSITE_URL || 'http://localhost:3000';
          configPath = `${baseUrl}${
            configPath.startsWith('/') ? '' : '/'
          }${configPath}`;
        }

        console.log(
          `** [CONFIG CONTEXT] Fetching configuration from ${configPath}...`
        );
        const response = await fetch(configPath);
        if (!response.ok) throw new Error('Failed to fetch config');
        const data = await response.json();
        setConfig(data);
      } catch (error) {
        console.warn(
          '** [CONFIG CONTEXT] Error fetching config, falling back to local import:',
          error
        );

        // Fallback to direct import from public folder
        try {
          const localConfig = await import(
            `../../public/${process.env.NEXT_PUBLIC_CONFIG_NAME}`
          );
          setConfig(localConfig.default || localConfig); // Set the imported config
        } catch (importError) {
          console.error('Error importing local config:', importError);
          setConfig(null); // Graceful fallback to null
        }
      }
    };

    fetchConfig();
  }, []);

  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);
