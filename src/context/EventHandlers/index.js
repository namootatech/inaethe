import { curry, path } from 'ramda';
import { createContext, useContext, useState, useEffect } from 'react';
import {
  getInputEventPayload,
  getComponentStateValue,
  getSiteConfigValue,
} from './dataMining';
import handlers from './handlers';
import eventCompletionHandlers from './eventCompletionHandlers';
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
              return getInputEventPayload(param.payload, event);
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
        handlers[handlerId](...handlerParams, props)
          .then((data) => {
            const successHandlers = handlerConfig[
              'when-handler-succeeds-run'
            ]?.map((h) => [h, eventCompletionHandlers[h]]);
            successHandlers?.forEach((handlePair) => {
              const [type, handle] = handlePair;
              console.log('** [EVENT SUCCESS HANDLERS] handling with: ', type);
              return handle(handlerParams, data, props);
            });
          })
          .catch((e) => {
            console.log('** [EVENT HANDLERS ERROR] error handling event:', e);
            const failureHandlers = handlerConfig[
              'when-handler-fails-run'
            ]?.map((h) => [h, eventCompletionHandlers[h]]);
            failureHandlers?.forEach((handlePair) => {
              const [type, handle] = handlePair;
              console.log('** [EVENT FAIL HANDLERS] handling with: ', type);
              return handle(handlerParams, e, props);
            });
          });
      } catch (e) {
        console.error('** [EVENT HANDLERS RROR] error handling event:', e);
        throw e;
      }
    }
  );

  return (
    <EventHandlersContext.Provider value={{ handleEvent }}>
      {children}
    </EventHandlersContext.Provider>
  );
};

export const useEventHandler = () => useContext(EventHandlersContext);
