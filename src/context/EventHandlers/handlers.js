import axios from 'axios';
import { useApi } from '../ApiContext';

const saveNewsLetterSubscriber = async (email, npoId, props) => {
  const { apiContext } = props;
  console.log('API', apiContext);
  const { addSubscriber } = apiContext;
  console.log(`*** [SAVE NEWS LETTER SUBSCRIBER HANDLER] Adding subscriber...`);
  const response = await addSubscriber(email, npoId);
  return response;
};

const saveToComponentState = async (key, value, props) => {
  const { updateComponentState } = props;
  return updateComponentState({ [key]: value });
};

const handlers = {
  'save-new-newsletter-subscriber': saveNewsLetterSubscriber,
  'save-to-component-state': saveToComponentState,
};

export default handlers;
