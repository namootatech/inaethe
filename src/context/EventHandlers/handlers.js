const saveNewsLetterSubscriber = (email, npoId) => {
  console.log('saved subscriber', email, 'to npo', npoId);
};

const saveToComponentState = (key, value, props) => {
  console.log('saved state', key, 'to', value, props);
};

export default handlers = {
  'save-new-newsletter-subscriber': saveNewsLetterSubscriber,
  'save-to-component-state': saveToComponentState,
};
