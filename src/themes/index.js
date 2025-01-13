const inaethesiteConfig = require(`./inaethe/siteConfig.json`);
const fotsiteConfig = require('./fot/siteConfig.json');
const blue = require('./blue/siteConfig.json');
const bananas = require('./go-bananas/siteConfig.json');

const siteConfigs = {
  inaethe: inaethesiteConfig,
  fot: fotsiteConfig,
  blue: blue,
  'go-bananas': bananas,
};

export const getsiteConfigConfig = () => {
  console.log('setting siteConfig', process.env.NEXT_PUBLIC_siteConfig);
  return siteConfigs[process.env.NEXT_PUBLIC_siteConfig];
};
