import { curry, path } from 'ramda';
import { createContext, useContext, useState, useEffect } from 'react';
import {
  getInputEventPayload,
  getComponentStateValue,
  getSiteConfigValue,
} from './dataMining';
import handlers from './handlers';

const EventHandlersContext = createContext();

export const EventHandlersProvider = ({ children }) => {
  const handleEvent = curry(
    (
      handlerConfig,
      siteConfig,
      componentState,
      updateComponentState,
      event
    ) => {
      console.log('** [EVENT HANDLERS] handling event.');
      try {
        const handlerId = handlerConfig['handle-with'];
        console.log('** [EVENT HANDLERS] handling: ', handlerId);
        const handlerParams = handlerConfig['with-params'].map((param) => {
          switch (param.type) {
            case 'event-data':
              return getInputEventPayload(payload, event);
            case 'component-state-value':
              return getComponentStateValue(param.payload, componentState);
            case 'site-config-value':
              return getSiteConfigValue(param.payload, siteConfig);
            case 'plain-string':
              return param.payload;
          }
        });
        const props = {
          handlerConfig,
          siteConfig,
          componentState,
          updateComponentState,
          event,
        };
        handlers[handlerId](...handlerParams, props);
      } catch (e) {
        console.error('** [EVENT HANDLERS] error handling event:', e);
        throw e;
      }
    }
  );

  return (
    <ConfigContext.Provider value={handleEvent}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useEventHandler = () => useContext(ConfigContext);
