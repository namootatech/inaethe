import axios from 'axios';

const saveNewsLetterSubscriber = async (email, npoId) => {
  return axios.post('/api/save-news-letter-subscriber', {
    email,
    organisationId: npoId,
  });
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
