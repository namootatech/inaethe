---

![Logo](public/logo.png)

# Ina Ethe 

>Ina Ethe is a subscription-based platform that leverages affiliate marketing to help individuals support and fund Non-Profit Organizations (NPOs). The platform allows users > to promote causes they care about, earning rewards through donations made by their network. By subscribing to the service, users contribute to NPOs while also benefiting > > from a revenue-sharing model that incentivizes active participation in charitable efforts.

## Why This Project Exists  

The  **Ina Ethe Project** was conceived with the noble intention of assisting non-profit organizations (NPOs) in enhancing their donation collection through the innovative use of affiliate marketing. This initiative aimed to empower passionate individuals to advocate for meaningful causes, rewarding them with a portion of the donations they help generate.

However, following some funding challenges and the subsequent withdrawal of key stakeholders, **Namoota Technologies** recognized the inherent potential of this initiative. Transitioning the project into their own hands, they have rebranded it as **Ina Ethe**, a term that beautifully translates to "Humanity" in Xhosa. This strategic transformation has broadened the platform's vision, evolving it into a versatile resource designed not only to support NPOs in their missions but also to include features like configurable website building and foster open-source innovation. 

Through this evolution, Ina Etheaspires to create a more significant positive impact for NPOs and their supporters, fostering a collaborative environment that champions both philanthropy and technological advancement. 

---

## How Ina EtheSeeks to Help

**Ina Ethe** provides a dual-purpose platform:

1. **For NPOs**: It enables them to easily sign up, collect donations, and manage their networks and supporters.
2. **For Individuals (Affiliates)**: It allows users to earn income by promoting the causes they believe in, creating a mutually beneficial system.

This approach fosters a sustainable ecosystem where philanthropy and personal financial growth coexist.

---

## What Type of Application Is This?

Ina Etheis a **configurable Next.js-based web application** designed to create websites for NPOs. It is:

- **Configurable**: Built to adapt to various requirements without extensive coding.
- **Scalable**: Capable of hosting standalone NPO websites under the Ina Ethedomain.
- **Customizable**: Offers tools to tailor websites according to individual NPO branding needs.
- **Multi-purpose**: Extends beyond donation collection to support user subscriptions, network dashboards, and admin monitoring.

---

## Features

- **Affiliate Marketing for Donations**: Affiliates earn income while promoting causes.
- **Configurable Website Builder**: Allows NPOs to create custom websites using pre-defined components.
- **Subscription and Network Dashboard**: Affiliates and donors can manage their subscriptions and interactions.
- **Admin Monitoring System**: Includes Slack notifications and internal tools for auditing and moderation.
- **Multi-Domain Hosting**: NPOs can have standalone websites hosted under Ina Ethe’s main domain (e.g., `foodoneverytable.Ina Ethe.co.za`).
- **Dynamic JSON Configuration**: Enables fully configurable pages and layouts.

**Core Platform Overview**

Our platform is designed to empower users to create dynamic and customizable websites efficiently. Here are some key features:

1. **Configurable Websites**: Easily build websites using JSON configuration files, allowing for flexibility and personalization.
2. **Dynamic Routing**: Leverage Next.js capabilities with getStaticPaths for generating pages, providing a seamless routing experience for users.

3. **Subscription System**: Our platform includes a robust subscription management system with a progressive revenue sharing model—40% for the affiliate marketer, 40% for the selected non-profit organization (NPO), and 20% for enhancing the platform.

**Website Builder Architecture**

Our infrastructure is built on a Next.js Docker image, enabling straightforward deployment and scalability. The platform utilizes the `NEXT_PUBLIC_SITE_CONFIG_JSON_LINK` environment variable to ensure dynamic loading of configurations during both the build and runtime phases.

To create your website, simply provide a link to your configuration file. The system will handle the rest, building the site, its pages, and components automatically. This allows you to establish an affiliate marketing donations website with ease, enabling users to collect donations for their favorite NPOs through subscriptions.

**Considerations and Limitations**

While our platform presents many advantages, it is essential to highlight some limitations regarding payment processing. Currently, donations are processed through the select payment gateway, Payfast. Unfortunately, customization for individual payment gateways or specific Payfast wallets isn’t available at this time. This design choice ensures a consistent 40-40-20 split for all transactions, thus supporting fair compensation for affiliates and NPOs while also maintaining resources for platform improvement.

To prevent potential abuses and maintain fairness in the revenue split, access to the Payfast merchant dashboard is restricted. We understand that this may be a limitation for some users, but it is crucial for maintaining the integrity of our system. Our aim is to create a sustainable and equitable platform for all stakeholders involved.

We appreciate your understanding and are continuously working to enhance our offerings, keeping your needs in mind. Your feedback is invaluable, and we are excited about the potential of our platform to create positive impacts for nonprofits and communities alike.

---

## Future Plans

### 1. **Ina Ethe NPO Configurable Website Builder**

The existing platform will evolve into a comprehensive tool for building NPO websites with features such as:

- Easy-to-use page configuration using JSON files.
- Dynamic routing for on-the-fly page generation.
- Pre-designed Tailwind CSS blocks for quick customization.

### 2. **Standalone Configurable Website Builder**

The website builder functionality will be extracted into a separate open-source product by Namoota.

- Developers will be able to use it to create fully configurable Next.js applications for any domain.
- It will include tools for generating JSON configuration files for custom pages.

### 3. **Open-Source Tailwind Blocks NPM Package**

A library of reusable Tailwind CSS blocks will be created, packaged as an NPM library, and released as open-source.

- Components will be sourced from **Flowbite**, **Flexwind**, **PageDone**, and other platforms.
- Developers can use these pre-designed components in their React applications.

---

## How the Website Builder Will Work

The Ina Ethewebsite builder uses **dynamic JSON configuration** to generate pages dynamically. Here’s how it works:

1. **JSON Configuration File**: Contains page definitions, component sequences, and styling options.
2. **Dynamic Routing**: Utilizes Next.js’s `[id].js` dynamic routing to fetch and render page content.
3. **AppContext Provider**: Shares configuration data across all components, enabling dynamic rendering.
4. **Pre-Built Docker Image**: Developers can deploy a customized site by pulling the Docker image and providing a `.env` file with configuration details.

Here’s an example structure for a page:

```jsx
function Page(props) {
  const { pageId } = useSearchParams();
  const page = props.siteConfig.pages.find((p) => p.id === pageId);

  return (
    <Layout>
      <div className='container md:mt-4 md:px-16 px-4'>
        {page && <RenderPageComponents components={page.components} />}
      </div>
    </Layout>
  );
}
```

---

## Tailwind Blocks Collection

The process of building reusable components involves:

1. **Collecting HTML Blocks**: Components will be sourced from platforms like **Flowbite**, **Flexwind**, and **PageDone**.
2. **Converting HTML to React Components**:
   - Transform static HTML into React components, ensuring proper JSX syntax and reusable props.

### Example Conversion of a "Hero Section" to a React Component

```jsx
const Hero = ({ title, subtitle, buttonText, buttonLink }) => (
  <section className='bg-blue-500 text-white py-10'>
    <h1 className='text-4xl'>{title}</h1>
    <p className='mt-4'>{subtitle}</p>
    <a
      href={buttonLink}
      className='mt-6 px-6 py-3 bg-white text-blue-500 rounded'
    >
      {buttonText}
    </a>
  </section>
);
```

### Making Components Configurable

- **Dynamic Content**: The components will pull text, images, and other content dynamically from a `config` object.

```jsx
const Hero = ({ config }) => {
  const { title, subtitle, button } = config.hero;
  return (
    <section className={`${config.theme.primaryBgClass} py-10`}>
      <h1 className='text-4xl'>{title}</h1>
      <p className='mt-4'>{subtitle}</p>
      <a
        href={button.link}
        className={`${config.theme.primaryButton.bgClass} rounded`}
      >
        {button.text}
      </a>
    </section>
  );
};
```

- **Theme-Based Styling**: Buttons, backgrounds, and other elements will reference the `config.theme`.

### Demo and Component Previews

Converted components will be showcased on the `/components` page for easy review and testing.

---

## Contribution Guidelines

### How to Get Started

1. Clone this repository.
2. Request a `.env` file from **Ayabonga Qwabi** to set up your environment.
3. Start contributing by collecting, converting, or enhancing Tailwind blocks and making them configurable using the `config` data.
