import axios from 'axios';
import { toast } from 'react-toastify';

const notiftySomethingWentWrong = async (key, value, props) => {
  return toast.error('Something went wrong , please try again');
};

const notifyYouWillHearFromUs = async (key, value, props) => {
  return toast.info('Success!, You will hear from us soon.');
};

const clearComponentState = async (key, value, props) => {
  const { updateComponentState } = props;
  return updateComponentState({});
};

const handlers = {
  'notify-something-went-wrong': notiftySomethingWentWrong,
  'clear-component-state': clearComponentState,
  'notify-you-will-hear-from-us': notifyYouWillHearFromUs,
  'do-nothing': () => {},
};

export default handlers;
