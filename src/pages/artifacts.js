import { Inter } from 'next/font/google';
import RenderPageComponents from '@/components/content/generator';
import Layout from '@/components/layout';
import {
  BsAirplaneFill,
  BsFillHeartFill,
  BsFillPauseBtnFill,
} from 'react-icons/bs';
import { useState } from 'react';

function Home({ theme }) {
  const [email, setEmail] = useState('');
  const [selectedComponent, selectComponent] = useState(null);
  console.log('page theme', theme);
  const components = [
    {
      type: 'hero',
      header: 'Transforming good intentions into tangible impacts.',
      text: "At INA ETHE, we believe in the power of generosity and financial sustainability. Join us in building a community that empowers non-profit organizations to thrive while offering individuals the opportunity to earn while making a difference. Together, let's create a brighter future.",
      cta: {
        title: 'Make an Impact Today!',
        link: '/subscribe',
      },
      image: 'home-page-header.jpg',
    },
    {
      type: 'article',
      elements: [
        {
          type: 'image-block',
          image: '/images/inaethe/garbage.jpg',
        },
        {
          type: 'multi-text-blocks',
          cta: {
            title: 'Subscribe',
            link: '/subscribe',
          },
          content: [
            {
              title: 'Our Mission',
              text: 'At INA ETHE, our mission is twofold: we empower non-profit organizations to generate crucial income for their causes, while simultaneously providing individuals with the opportunity to earn while helping these causes thrive. We believe in the power of mutual benefit, creating a platform where generosity and financial sustainability coexist.',
            },
            {
              title: '',
              text: 'Join us in building a community that transforms good intentions into tangible impacts, ensuring a brighter future for both individuals and the non-profits they support. INA ETHE make a difference today!',
            },
          ],
        },
      ],
    },
    {
      type: 'spa-block',
      elements: [
        {
          icon: 'food-truck',
          title: 'Impact',
          text: 'Your subscription directly translates into meals for those in need.',
        },
        {
          icon: 'book',
          title: 'Transparency',
          text: 'We offer complete transparency in our operations',
        },
        {
          icon: 'user-group',
          title: 'Community',
          text: 'Join a passionate community of individuals dedicated to ending hunger in Africa.',
        },
      ],
      bg: 'bg-red-700',
      fg: 'text-white',
      title: 'Why INA ETHE',
    },
    {
      type: 'article',
      elements: [
        {
          type: 'multi-text-blocks',
          cta: {
            title: 'Subscribe',
            link: '/subscribe',
          },
          content: [
            {
              title: 'Our Story',
              text: "INA ETHE emerged in response to the African hunger crisis post-Covid. Starting with 'Food-On-Every-Table,' we sought aid from companies but faced silence. Adapting, we realized the need to address both hunger and South Africa's 40% unemployment.",
            },
            {
              title: 'Empowering Impactful Causes',
              text: 'INA ETHE is a unique platform uniting non-profits and individuals, offering a means for anyone with a worthy cause to generate income. Our resilient journey aims to make a lasting impact on hunger, unemployment, and funding challenges.',
            },
          ],
        },
        {
          type: 'image-block',
          image: 'donations-square.jpg',
        },
      ],
    },
    {
      type: 'card',
      title: 'Join Us',
      image: '/images/inaethe/donations-square.jpg',
      description:
        'INA ETHE is a community-driven organization. Join us today to make a difference in the lives of those in need.',
      cta: {
        title: 'Get Involved',
        link: '/get-involved',
      },
    },
    {
      type: 'accordion',
      items: [
        {
          title: 'What is INA ETHE?',
          content:
            'INA ETHE is a community-driven organization that empowers non-profit organizations to generate crucial income for their causes.',
        },
        {
          title: 'How does INA ETHE work?',
          content:
            'INA ETHE connects non-profit organizations with individuals, allowing them to generate income while providing them with the opportunity to earn.',
        },
        {
          title: 'What is the difference between INA ETHE and other platforms?',
          content:
            'INA ETHE empowers non-profit organizations to generate crucial income for their causes while providing individuals with the opportunity to earn.',
        },
      ],
    },
    {
      type: 'alert-banner',
      message: 'This is an alert banner message.',
      alertType: 'warning',
    },
    {
      type: 'alert-banner',
      message: 'This is an alert banner message.',
      alertType: 'info',
    },
    {
      type: 'alert-banner',
      message: 'This is an alert banner message.',
      alertType: 'error',
    },
    {
      type: 'FlexwindHero1',
      title: 'A Huge Title Hero that as a huge title hero',
      description:
        "This is a very long description that explains a bit more about what's going on in this hero and often talks about the products",
      stats: [
        { title: 'Users', detail: '10,000+', icon: <BsFillPauseBtnFill /> },
        { title: 'Countries', detail: '50+', icon: <BsAirplaneFill /> },
        { title: 'Satisfaction', detail: '98%', icon: <BsFillHeartFill /> },
      ],
      ctas: [
        {
          text: 'Get Started',
          link: '/signup',
        },
        {
          text: 'Learn more',
          link: '/signup',
          style: 'light',
        },
      ],
      img: {
        src: '/images/inaethe/donations-square.jpg',
        alt: 'Hero Image',
      },
      ratings: {
        titel: 'ratings',
        count: 20,
        type: 'views',
        rating: 4,
        imgs: [],
      },
    },
    {
      type: 'FlexwindHero2',
      title: 'A Huge Title Hero that as a huge title hero',
      description:
        "This is a very long description that explains a bit more about what's going on in this hero and often talks about the products",
      data: {
        email: { value: email, onChange: (e) => setEmail(e.target.value) },
      },
      ctas: [
        {
          text: 'Get Started',
          link: '/signup',
          onClick: () => {
            alert('cta click');
          },
        },
      ],
      img: {
        src: '/images/inaethe/donations-square.jpg',
        alt: 'Hero Image',
      },
    },
    {
      type: 'FlexwindHero3',
      title: 'A Huge Title Hero that as a huge title hero',
      description:
        "This is a very long description that explains a bit more about what's going on in this hero and often talks about the products",
      data: {
        email: { value: email, onChange: (e) => setEmail(e.target.value) },
      },
      stats: [
        { title: 'Users', detail: '10,000+', icon: <BsFillPauseBtnFill /> },
        { title: 'Countries', detail: '50+', icon: <BsAirplaneFill /> },
        { title: 'Satisfaction', detail: '98%', icon: <BsFillHeartFill /> },
      ],
      ctas: [
        {
          text: 'Get Started',
          link: '/signup',
          onClick: () => {
            alert('cta click');
          },
        },
      ],
      hint: 'Buy more today',
      img: {
        src: '/images/inaethe/donations-square.jpg',
        alt: 'Hero Image',
      },
    },
    {
      type: 'FlexwindHero4',
      title: 'A Huge Title Hero that as a huge title hero',
      description:
        "This is a very long description that explains a bit more about what's going on in this hero and often talks about the products",
      data: {
        email: { value: email, onChange: (e) => setEmail(e.target.value) },
      },
      ctas: [
        {
          text: 'Get Started',
          link: '/signup',
          onClick: () => {
            alert('cta click');
          },
        },
      ],
      img: {
        src: '/images/inaethe/donations-square.jpg',
        alt: 'Hero Image',
      },
    },
    {
      type: 'FlexwindFeatures1',
      title:
        'Join Ina Ethe: Empower Communities Through Affiliate-Driven Donations',
      description:
        'Ina Ethe is revolutionizing the way we support causes that matter. With our subscription-based affiliate marketing platform, you can contribute to impactful initiatives while earning rewards. Partner with us to transform donations into meaningful change for communities nationwide.',
      features: [
        {
          icon: 'dollar-sign',
          title: 'Streamlined Donation Collection',
          description:
            'Ina Ethe simplifies the donation process, ensuring every contribution reaches the right cause efficiently. Our platform is built to maximize transparency and trust for both donors and affiliates.',
        },
        {
          icon: 'graph',
          title: 'Performance Analytics for Affiliates',
          description:
            'Track your campaign performance in real-time with our advanced analytics tools. Monitor the impact of your referrals, optimize your strategies, and maximize your rewards while driving donations.',
        },
        {
          icon: 'users',
          title: 'Community Engagement Made Easy',
          description:
            'Engage with a passionate network of affiliates and donors who share your vision. Build partnerships, share stories of impact, and inspire others to join the movement.',
        },
        {
          icon: 'sliders',
          title: 'Customizable Subscription Tiers',
          description:
            'Choose from flexible subscription tiers designed to suit different needs and goals. Whether you’re an individual donor or a large organization, Ina Ethe offers solutions tailored to you.',
        },
        {
          icon: 'bank-card',
          title: 'Secure and Reliable Transactions',
          description:
            'With cutting-edge payment processing, Ina Ethe ensures every transaction is secure and seamless. Donors can trust that their contributions are protected and efficiently allocated.',
        },
        {
          icon: 'support',
          title: 'Dedicated Support and Resources',
          description:
            'Our team is here to support you every step of the way. From campaign setup to troubleshooting, Ina Ethe provides resources and assistance to help you succeed.',
        },
      ],
    },
  ];
  return (
    <Layout>
      <div className=' container mx-auto ext-lg text-gray-800 max-w-8xl my-8'>
        <div className='bg-gray-900 text-white text-lg p-8 my-4 rounded-md'>
          <h3 className='text-2xl font-bold mt-8 mb-4'>RenderPageComponents</h3>
          <p className='text-gray-200 mb-2'>
            RenderPageComponents are the building blocks we use to build the
            custom webpage confoiguration on the INA ETHE System.
            RenderPageComponents are contained in the configuration of a page.
            Listed below you will find a list of the blocks we use.
          </p>
        </div>
        <div className='grid grid-cols-8 gap-2'>
          <div className='col-span-2 border border-gray-200 border solid rounded-md p-4'>
            {components.map((c) => (
              <div
                className={`${
                  selectedComponent?.type === c?.type
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-200 text-gray-800'
                } p-2  m-2 hover:bg-gray-900 hover:pointer hover:text-white rounded-sm shadow-md `}
                onClick={() => selectComponent(c)}
              >
                {c.type}
              </div>
            ))}
          </div>
          <div className='col-span-6 border border-gray-200 border solid rounded-md p-4'>
            {selectedComponent && (
              <RenderPageComponents items={[selectedComponent]} theme={theme} />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
