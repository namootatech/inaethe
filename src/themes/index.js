const inaetheTheme = require(`./inaethe/theme.json`);
const fotTheme = require('./fot/theme.json');
const blue = require('./blue/theme.json');
const bananas = require('./go-bananas/theme.json');

const themes = {
  inaethe: inaetheTheme,
  fot: fotTheme,
  blue: blue,
  'go-bananas': bananas,
};

export const getThemeConfig = () => {
  console.log('setting theme', process.env.NEXT_PUBLIC_THEME);
  return themes[process.env.NEXT_PUBLIC_THEME];
};
