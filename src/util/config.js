export const downloadConfig = async (slug) => {
  const file = slug + '.json';
  const baseUrl =
    process.env.NEXT_PUBLIC_WEBSITE_URL || 'http://localhost:3000';
  const configPath = `${baseUrl}/siteConfigs/${file}`;
  try {
    console.log(`** Fetching configuration from ${configPath}...`);
    const response = await fetch(configPath);
    if (!response.ok) throw new Error('Failed to fetch config');
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn(
      ' Error fetching config, falling back to local import:',
      error
    );
    try {
      const localConfig = await import(`../../public/siteConfigs/${file}`);
      return localConfig.default || localConfig;
    } catch (importError) {
      console.error('Error importing local config:', importError);
    }
  }
};
