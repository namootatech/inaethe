const { MongoClient } = require('mongodb');

const uri = process.env.NEXT_PUBLIC_MONGODB_URI; // MongoDB connection string

const NEXT_PUBLIC_MONGODB_DB = process.env.NEXT_PUBLIC_MONGODB_DB;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

exports.handler = async (event) => {
  console.log('** [YOCO CHECKOUT FUNCTION] entry...');
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    console.log('** [YOCO CHECKOUT FUNCTION] Parsing request body...');
    const userData = JSON.parse(event.body);

    const data = {
      subscriptionId: userData?.subscriptionId,
      userId: userData?.userId,
      subscriptionTier: userData?.subscriptionTier,
      firstName: userData?.firstName,
      lastName: userData?.lastName,
      email: userData?.email,
      paymentMethod: userData?.paymentMethod,
      level: userData?.level,
      partner: userData?.partner,
      paymentId: userData?.paymentId,
      parentId: userData?.parent || 'noparent',
      amount: userData?.amount,
      amountInCents: userData?.amountInCents,
    };

    console.log('** [YOCO CHECKOUT FUNCTION] userData:', data);

    //yoco logic
    if (!data.amount || !data.subscriptionId || !data.userId) {
      console.error(
        '** [YOCO CHECKOUT] Missing required fields in request body.'
      );
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    const domain = process.env.NEXT_PUBLIC_WEBSITE_URL || req.headers.origin;

    // Create a checkout session with Yoco
    const response = await fetch('https://payments.yoco.com/api/checkouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_YOCO_SECRET_KEY}`,
        'Idempotency-Key': data.paymentId,
      },
      body: JSON.stringify({
        amount: data.amountInCents, // Amount in cents
        currency: 'ZAR',
        cancelUrl: `${domain}/app/subscribe?userId=${data.userId}&partner=${data.partner.slug}&subscriptionTier=${data.subscriptionTier}&subscriptionId=${data.subscriptionId}&firstName=${data.firstName}&lastName=${data.lastName}&email=${data.email}&paymentId=${data.paymentId}&amount=${data.amount}&amountInCents=${data.amountInCents}&paymentMethod=${data.paymentMethod}&level=${data.level}&parentId=${data.parentId}&paymentStatus=failed`,
        successUrl: `${domain}/app/subscribe?userId=${data.userId}&partner=${data.partner.slug}&subscriptionTier=${data.subscriptionTier}&subscriptionId=${data.subscriptionId}&firstName=${data.firstName}&lastName=${data.lastName}&email=${data.email}&paymentId=${data.paymentId}&amount=${data.amount}&amountInCents=${data.amountInCents}&paymentMethod=${data.paymentMethod}&level=${data.level}&parentId=${data.parentId}&paymentStatus=success`,
        failureUrl: `${domain}/app/subscribe?userId=${data.userId}&partner=${data.partner.slug}&subscriptionTier=${data.subscriptionTier}&subscriptionId=${data.subscriptionId}&firstName=${data.firstName}&lastName=${data.lastName}&email=${data.email}&paymentId=${data.paymentId}&amount=${data.amount}&amountInCents=${data.amountInCents}&paymentMethod=${data.paymentMethod}&level=${data.level}&parentId=${data.parentId}&paymentStatus=failed`,
        metadata: {
          subscriptionId: data.subscriptionId,
          userId: data.userId,
          tier: data.subscriptionTier,
          npo: data.partner,
          paymentId: data.paymentId,
          customerEmail: data.email,
          customerName: `${data.firstName} ${data.lastName}`,
        },
        // Optional display information
        totalDiscount: 0,
        totalTaxAmount: 0,
        subtotalAmount: data.amountInCents,
        lineItems: [
          {
            name: `${data.subscriptionTier} Subscription`,
            displayName: `${data.subscriptionTier} Subscription`,
            description: `Monthly subscription to ${data.partner.name}`,
            quantity: 1,
            amount: data.amountInCents,
            customerEmail: data.email,
            customerName: `${data.firstName} ${data.lastName}`,
            pricingDetails: {
              price: data.amountInCents,
            },
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Yoco API error:', errorData);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Yoco API error' }),
      };
    }

    const checkoutSession = await response.json();

    console.log(
      '** [YOCO CHECKOUT FUNCTION] Subscriber inserted:',
      checkoutSession
    );
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'Subscriber post added successfully',
        data: checkoutSession,
      }),
    };
  } catch (error) {
    console.error(
      '** [YOCO CHECKOUT FUNCTION] Error adding subscriber:',
      error
    );
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  } finally {
    await client.close();
  }
};
