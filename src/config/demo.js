import {
  BsAirplaneFill,
  BsFillHeartFill,
  BsFillPauseBtnFill,
} from 'react-icons/bs';

const components = [
  {
    type: 'article',
    category: 'Content Blocks',
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
            text: 'At Inaethe, our mission is twofold: we empower non-profit organizations to generate crucial income for their causes, while simultaneously providing individuals with the opportunity to earn while helping these causes thrive. We believe in the power of mutual benefit, creating a platform where generosity and financial sustainability coexist.',
          },
          {
            title: '',
            text: 'Join us in building a community that transforms good intentions into tangible impacts, ensuring a brighter future for both individuals and the non-profits they support. Inaethe make a difference today!',
          },
        ],
      },
    ],
  },
  {
    type: 'spa-block',
    category: 'Feature Blocks',
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
    title: 'Why Inaethe',
  },
  {
    type: 'article',
    category: 'Content Blocks',
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
            text: "Inaethe emerged in response to the African hunger crisis post-Covid. Starting with 'Food-On-Every-Table,' we sought aid from companies but faced silence. Adapting, we realized the need to address both hunger and South Africa's 40% unemployment.",
          },
          {
            title: 'Empowering Impactful Causes',
            text: 'Inaethe is a unique platform uniting non-profits and individuals, offering a means for anyone with a worthy cause to generate income. Our resilient journey aims to make a lasting impact on hunger, unemployment, and funding challenges.',
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
    category: 'Cards',
    title: 'Join Us',
    image: '/images/inaethe/donations-square.jpg',
    description:
      'Inaethe is a community-driven organization. Join us today to make a difference in the lives of those in need.',
    cta: {
      title: 'Get Involved',
      link: '/get-involved',
    },
  },
  {
    type: 'accordion',
    category: 'Interactive Elements',
    items: [
      {
        title: 'What is Inaethe?',
        content:
          'Inaethe is a community-driven organization that empowers non-profit organizations to generate crucial income for their causes.',
      },
      {
        title: 'How does Inaethe work?',
        content:
          'Inaethe connects non-profit organizations with individuals, allowing them to generate income while providing them with the opportunity to earn.',
      },
      {
        title: 'What is the difference between Inaethe and other platforms?',
        content:
          'Inaethe empowers non-profit organizations to generate crucial income for their causes while providing individuals with the opportunity to earn.',
      },
    ],
  },
  {
    type: 'alert-banner',
    category: 'Notifications',
    message: 'This is an alert banner message.',
    alertType: 'warning',
  },
  {
    type: 'alert-banner',
    category: 'Notifications',
    message: 'This is an alert banner message.',
    alertType: 'info',
  },
  {
    type: 'alert-banner',
    category: 'Notifications',
    message: 'This is an alert banner message.',
    alertType: 'error',
  },
  {
    type: 'FlexwindHero1',
    category: 'Hero Sections',
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
    category: 'Hero Sections',
    title: 'A Huge Title Hero that as a huge title hero',
    description:
      "This is a very long description that explains a bit more about what's going on in this hero and often talks about the products",
    ctas: [
      {
        text: 'Get Started',
        link: '/signup',
        onClick: () => {
          alert('cta click');
        },
      },
    ],
    img1: {
      src: '/images/inaethe/donations-square.jpg',
      alt: 'Hero Image',
    },
    img2: {
      src: '/images/inaethe/donations-square.jpg',
      alt: 'Hero Image',
    },
    partners: [
      {
        link: 'https://www.example.com',
        name: 'Partner 1',
        img: '/images/inaethe/donations-square.jpg',
      },
    ],
  },
  {
    type: 'FlexwindHero3',
    category: 'Hero Sections',
    title: 'A Huge Title Hero that as a huge title hero',
    description:
      "This is a very long description that explains a bit more about what's going on in this hero and often talks about the products",

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
    category: 'Hero Sections',
    title: 'True change  is at your fingertips',
    description:
      'We are champions of change, and we believe that true change is at your fingertips. With our platform, you can make a difference in the world while also earning rewards for yourself. Join us today and be part of the solution.',
    data: {
      email: {
        'on-change': {
          'handle-with': 'do-nothing',
          'when-handler-succeeds-run': ['do-nothing'],
          'when-handler-fails-run': ['notify-something-went-wrong'],
        },
      },
    },
    ctas: [
      {
        text: 'Join Us Now!',
        'on-click': {
          'handle-with': 'do-nothing',
          'when-handler-succeeds-run': ['notify-you-will-hear-from-us'],
          'when-handler-fails-run': ['notify-something-went-wrong'],
        },
      },
    ],
    img: {
      src: '/images/inaethe/donations.jpg',
      alt: 'Hero Image',
    },
  },
  {
    type: 'FlexwindHero5',
    category: 'Hero Sections',
    title: 'Changing the world, one meal at a time',
    description:
      ' We at organisation X are dedicated to making a difference in the world. Our mission is to provide meals to those in need, and we believe that every meal counts. With your support, we can continue to make a positive impact on the lives of those who are struggling.',

    ctas: [
      {
        link: '/signup',
        text: 'Get Started',
      },
      {
        text: 'Learn more',
        link: '/signup',
        style: 'light',
      },
    ],
    stats: [
      { title: 'Users', detail: '10,000+', icon: 'pause' },
      { title: 'Countries', detail: '50+', icon: 'airplane' },
      { title: 'Satisfaction', detail: '98%', icon: 'heart' },
    ],
    img: {
      src: '/images/inaethe/donations.jpg',
      alt: 'Hero Image',
    },
  },
  {
    type: 'FlexwindHero6',
    category: 'Hero Sections',
    title: 'A Huge Title Hero that as a huge title hero',
    description:
      "This is a very long description that explains a bit more about what's going on in this hero and often talks about the products",

    ctas: [
      {
        link: '/signup',
        text: 'Get Started',
      },
      {
        text: 'Learn more',
        link: '/signup',
        style: 'light',
      },
    ],
    stats: [
      { title: 'Users', detail: '10,000+', icon: 'pause' },
      { title: 'Countries', detail: '50+', icon: 'airplane' },
      { title: 'Satisfaction', detail: '98%', icon: 'heart' },
    ],
    img: {
      src: '/images/inaethe/donations.jpg',
      alt: 'Hero Image',
    },
  },
  {
    hint: 'Buy more today',
    type: 'FlexwindHero7',
    category: 'Hero Sections',
    title: 'A home for your products at the heart of society',
    description:
      'Our mission is to create a platform that connects people with the products they need, while also giving back to the community. We believe that by working together, we can make a positive impact on the world around us. Join us in our mission to create a better future for all.',

    ctas: [
      {
        icon: 'home',
        link: '/signup',
        text: 'Get Started',
      },
      {
        icon: 'settings',
        text: 'Learn more',
        link: '/signup',
        style: 'light',
      },
    ],
    img1: {
      src: '/images/inaethe/donations.jpg',
      alt: 'Hero Image',
    },
    img2: {
      src: '/images/inaethe/donations.jpg',
      alt: 'Hero Image',
    },
  },
  {
    type: 'FlexwindFeatures1',
    category: 'Feature Blocks',
    title:
      'Join Inaethe: Empower Communities Through Affiliate-Driven Donations',
    description:
      'Inaethe is revolutionizing the way we support causes that matter. With our subscription-based affiliate marketing platform, you can contribute to impactful initiatives while earning rewards. Partner with us to transform donations into meaningful change for communities nationwide.',
    features: [
      {
        icon: 'dollar-sign',
        title: 'Streamlined Donation Collection',
        description:
          'Inaethe simplifies the donation process, ensuring every contribution reaches the right cause efficiently. Our platform is built to maximize transparency and trust for both donors and affiliates.',
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
          "Choose from flexible subscription tiers designed to suit different needs and goals. Whether you're an individual donor or a large organization, Inaethe offers solutions tailored to you.",
      },
      {
        icon: 'bank-card',
        title: 'Secure and Reliable Transactions',
        description:
          'With cutting-edge payment processing, Inaethe ensures every transaction is secure and seamless. Donors can trust that their contributions are protected and efficiently allocated.',
      },
      {
        icon: 'support',
        title: 'Dedicated Support and Resources',
        description:
          'Our team is here to support you every step of the way. From campaign setup to troubleshooting, Inaethe provides resources and assistance to help you succeed.',
      },
    ],
  },
];

export default components;
