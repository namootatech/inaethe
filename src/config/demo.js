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
  {
    type: 'cta-section',
    title: 'Join Our Conservation Efforts Today',
    description:
      'Your support helps us protect endangered species and preserve critical habitats around the world. Together, we can make a difference in the fight against extinction.',
    buttonText: 'Donate Now',
    buttonLink: '/donate',
    backgroundImage:
      'https://images.unsplash.com/photo-1574068468668-a05a11f871da?q=80&w=2070&auto=format&fit=crop',
  },

  {
    type: 'content-section',
    title: 'Our Conservation Approach',
    subtitle: 'Science-Based Solutions',
    content: [
      'At WildGuard Conservation, we believe that effective wildlife protection requires a comprehensive approach that addresses the complex challenges facing endangered species and their habitats.',
      'Our conservation strategies are based on rigorous scientific research, community engagement, and sustainable solutions that benefit both wildlife and local communities. We work closely with governments, local organizations, and communities to create lasting change.',
    ],
    image:
      'https://images.unsplash.com/photo-1535338454770-8be927b5a00b?q=80&w=2070&auto=format&fit=crop',
    imagePosition: 'right',
    cta: {
      text: 'Learn More About Our Work',
      link: '/about',
    },
  },

  {
    type: 'content-section',
    title: 'Community-Based Conservation',
    subtitle: 'Empowering Local Communities',
    content: [
      'We believe that successful conservation must include and benefit local communities. Our programs provide economic alternatives to activities that harm wildlife, while empowering communities to become stewards of their natural resources.',
      'By working directly with the people who live alongside wildlife, we create sustainable solutions that protect endangered species while improving human wellbeing.',
    ],
    image:
      'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?q=80&w=1974&auto=format&fit=crop',
    imagePosition: 'left',
    cta: {
      text: 'View Our Community Programs',
      link: '/programs',
    },
  },

  {
    type: 'social-proof-section',
    title: 'What Our Supporters Say',
    testimonials: [
      {
        name: 'Sarah Johnson',
        role: 'Monthly Donor',
        avatar:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop',
        quote:
          'Supporting WildGuard has been incredibly rewarding. Their transparent reporting and measurable impact make me confident that my donations are making a real difference for endangered species.',
      },
      {
        name: 'David Chen',
        role: 'Corporate Partner',
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop',
        quote:
          'Our partnership with WildGuard has not only helped us meet our sustainability goals but has also engaged our employees in meaningful conservation work. Their team is professional and passionate.',
      },
      {
        name: 'Maria Rodriguez',
        role: 'Volunteer',
        avatar:
          'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop',
        quote:
          'Volunteering with WildGuard in their tiger conservation project was a life-changing experience. I was impressed by their community-based approach and the respect they show for local cultures and knowledge.',
      },
    ],
  },

  {
    type: 'faq-section',
    title: 'Frequently Asked Questions',
    description:
      'Find answers to common questions about our conservation work and how you can get involved.',
    faqs: [
      {
        question: 'How is my donation used?',
        answer:
          "85% of every donation goes directly to field conservation programs, 10% to education and awareness initiatives, and 5% to administrative costs. We're committed to transparency and efficiency in our use of donor funds.",
      },
      {
        question: 'Can I volunteer internationally?',
        answer:
          'Yes! We offer volunteer opportunities ranging from 2-week trips to 6-month placements. Volunteers help with wildlife monitoring, habitat restoration, community education, and more. All volunteers receive training and support from our experienced field staff.',
      },
      {
        question: 'How do you measure conservation success?',
        answer:
          'We use multiple indicators to measure our impact, including wildlife population trends, habitat quality assessments, threat reduction metrics, and community wellbeing indicators. All our projects include rigorous monitoring and evaluation components.',
      },
      {
        question: 'Do you work with local communities?',
        answer:
          'Absolutely. We believe that successful conservation must include and benefit local communities. All our projects involve community partnerships, and many include sustainable livelihood components that help reduce pressure on natural resources.',
      },
      {
        question: 'How can my company partner with WildGuard?',
        answer:
          'We offer various corporate partnership opportunities, from cause marketing and employee engagement to philanthropic support and sustainability consulting. Contact our partnerships team to discuss how we can work together to advance your CSR goals.',
      },
    ],
  },

  {
    type: 'team-section',
    title: 'Our Leadership Team',
    description:
      'Meet the dedicated professionals leading our conservation efforts around the world.',
    members: [
      {
        name: 'Dr. Elena Morales',
        role: 'Founder & Executive Director',
        image:
          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2076&auto=format&fit=crop',
        bio: 'Dr. Morales founded WildGuard after witnessing the rapid decline of tiger populations in Southeast Asia. With a PhD in Wildlife Biology, she leads our global conservation initiatives.',
        socialLinks: [
          {
            icon: 'linkedin',
            url: 'https://linkedin.com/in/elenamorales',
          },
          {
            icon: 'twitter',
            url: 'https://twitter.com/elenamorales',
          },
        ],
      },
      {
        name: 'Michael Chen',
        role: 'Director of Field Operations',
        image:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop',
        bio: 'Michael oversees our field conservation programs across 20 countries, ensuring our projects deliver measurable conservation outcomes.',
        socialLinks: [
          {
            icon: 'linkedin',
            url: 'https://linkedin.com/in/michaelchen',
          },
        ],
      },
      {
        name: 'Dr. Amara Okafor',
        role: 'Lead Conservation Scientist',
        image:
          'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop',
        bio: 'Dr. Okafor leads our scientific research team, designing studies that inform our conservation strategies.',
        socialLinks: [
          {
            icon: 'linkedin',
            url: 'https://linkedin.com/in/amaraokafor',
          },
          {
            icon: 'globe',
            url: 'https://amaraokafor.com',
          },
        ],
      },
      {
        name: 'James Wilson',
        role: 'Director of Development',
        image:
          'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop',
        bio: 'James leads our fundraising and partnership development efforts, building relationships with donors and partners worldwide.',
        socialLinks: [
          {
            icon: 'linkedin',
            url: 'https://linkedin.com/in/jameswilson',
          },
        ],
      },
    ],
  },

  {
    type: 'logo-grid',
    title: 'Our Partners & Supporters',
    description:
      'We collaborate with organizations around the world to maximize our conservation impact.',
    logos: [
      {
        name: 'World Wildlife Fund',
        image:
          'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=1974&auto=format&fit=crop',
        url: 'https://www.worldwildlife.org',
      },
      {
        name: 'Conservation International',
        image:
          'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=1974&auto=format&fit=crop',
        url: 'https://www.conservation.org',
      },
      {
        name: 'The Nature Conservancy',
        image:
          'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=1974&auto=format&fit=crop',
        url: 'https://www.nature.org',
      },
      {
        name: 'National Geographic Society',
        image:
          'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=1974&auto=format&fit=crop',
        url: 'https://www.nationalgeographic.org',
      },
      {
        name: 'Wildlife Conservation Network',
        image:
          'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=1974&auto=format&fit=crop',
        url: 'https://wildnet.org',
      },
      {
        name: 'Rainforest Alliance',
        image:
          'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=1974&auto=format&fit=crop',
        url: 'https://www.rainforest-alliance.org',
      },
      {
        name: 'Wildlife Conservation Society',
        image:
          'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=1974&auto=format&fit=crop',
        url: 'https://www.wcs.org',
      },
      {
        name: 'Jane Goodall Institute',
        image:
          'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=1974&auto=format&fit=crop',
        url: 'https://www.janegoodall.org',
      },
      {
        name: 'Oceana',
        image:
          'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=1974&auto=format&fit=crop',
        url: 'https://oceana.org',
      },
      {
        name: 'Panthera',
        image:
          'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=1974&auto=format&fit=crop',
        url: 'https://www.panthera.org',
      },
    ],
  },

  {
    type: 'stats-section',
    title: 'Our Conservation Impact',
    description: 'Measurable results from our global conservation efforts.',
    stats: [
      {
        icon: 'shield',
        value: '150+',
        label: 'Species Protected',
        description: 'Endangered species under our conservation programs',
      },
      {
        icon: 'map-pin',
        value: '35',
        label: 'Protected Areas',
        description: 'Conservation areas established or supported',
      },
      {
        icon: 'users',
        value: '200K+',
        label: 'Community Members',
        description: 'Local people engaged in conservation',
      },
      {
        icon: 'globe',
        value: '23',
        label: 'Countries',
        description: 'Where our conservation programs operate',
      },
    ],
  },
];

export default components;
