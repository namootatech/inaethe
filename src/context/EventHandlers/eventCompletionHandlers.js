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
  'notify-something-went-wrong': saveNewsLetterSubscriber,
  'clear-component-state': saveToComponentState,
  "notify-you-will-hear-from-us": ()=>{}
  "do-nothing": ()=>{}
};

export default handlers;
