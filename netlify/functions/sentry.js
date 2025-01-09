import { wrap } from "@netlify/integrations";
import {  withSentry } from "@netlify/sentry";

const withIntegrations = wrap(withSentry);

const handler = withIntegrations(
  async (event, context) => {
    // Add handler function content here
    console.log(event, context);
  }
);

export { handler };