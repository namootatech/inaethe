import { path } from 'ramda';
const getValueOnMap = ({ type, value }, map) => {
  if (type === 'path') {
    return path(value, map);
  }
  return map[value];
};

export const getInputEventPayload = (payload, event) =>
  getValueOnMap(payload, event);

export const getComponentStateValue = (payload, componentState) =>
  getValueOnMap(payload, componentState);

export const getSiteConfigValue = (payload, siteConfig) =>
  getValueOnMap(payload, siteConfig);
