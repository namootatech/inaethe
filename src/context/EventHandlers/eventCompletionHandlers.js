import axios from 'axios';
import { toast } from 'react-toastify';

const notiftySomethingWentWrong = async (handlerParams, response, config) => {
  return toast.error(
    `Something went wrong , please try again',
    ${response.response.data.message}`
  );
};

const notifyYouWillHearFromUs = async (handlerParams, response, config) => {
  return toast.info('Success!, You will hear from us soon.');
};

const clearComponentState = async (handlerParams, response, config) => {
  const [key, value] = handlerParams;
  const { updateComponentState } = config;
  return updateComponentState({ [key]: value });
};

const handlers = {
  'notify-something-went-wrong': notiftySomethingWentWrong,
  'clear-component-state': clearComponentState,
  'notify-you-will-hear-from-us': notifyYouWillHearFromUs,
  'do-nothing': () => {},
};

export default handlers;
