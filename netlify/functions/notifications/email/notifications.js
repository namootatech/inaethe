const emails = require('./index');

const sendSubscriptionsWelcomeEmail = async (mongoClient, data) => {
  const partnerSlug = data.partner.slug;
  console.log('partnerSlug', partnerSlug);
  const partnerCollection = mongoClient
    .db(process.env.NEXT_PUBLIC_MONGODB_DB)
    .collection('partners');
  const partner = await partnerCollection.findOne({ slug: partnerSlug });
  const { email, firstName, lastName } = data;

  console.log('partner', partner);
  console.log({ email, firstName, lastName });
  const to = [{ email, name: firstName + ' ' + lastName }];
  const from = {
    email: 'subcriptions@inaethe.co.za',
    name: 'Inaethe Subscriptions',
  };
  const subject = 'Welcome to Inaethe - Ubuntu Rewards';
  const templateId = 'vywj2lpj2mql7oqz';
  const personalization = [
    {
      email: email,
      data: {
        user: {
          name: firstName + ' ' + lastName,
        },
        partner: {
          url: partner.link,
          name: partner.name,
          cause: partner.cause,
          goals: partner.goals
            ? partner.goals.slice(0, -1).join(', ') +
              (partner.goals.length > 1 ? ' & ' : '') +
              partner.goals.slice(-1)
            : 'making the world a better place',
        },
      },
    },
  ];
  return emails.sendTemplateEmail({
    to,
    from,
    subject,
    templateId,
    personalization,
  });
};

module.exports = {
  sendSubscriptionsWelcomeEmail,
};
