import { useState } from 'react';
import { DashboardCard } from '@/components/ui/app-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
const faqs = [
  {
    question: 'How do I start earning with referrals?',
    answer:
      "To start earning with referrals, share your unique referral link with friends and family. When they sign up and make a contribution, you'll earn a commission.",
  },
  {
    question: 'How often are payouts processed?',
    answer:
      "Payouts are processed on a monthly basis, typically on the 1st of each month, provided you've reached the minimum payout threshold.",
  },
  {
    question: 'Can I change my subscription tier?',
    answer:
      'Yes, you can change your subscription tier at any time. Go to the Subscriptions page in your dashboard to make changes.',
  },
];
export default function Support() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement contact form submission logic here
    console.log('Contact form submitted:', { name, email, message });
  };
  return (
    <div>
      <h1 className='text-3xl font-bold mb-6 text-gray-100'>Support</h1>
      <DashboardCard title='Frequently Asked Questions'>
        <Accordion type='single' collapsible className='w-full'>
          {faqs.map((faq, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className='text-gray-300'>
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className='text-gray-400'>
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </DashboardCard>
      <DashboardCard title='Contact Us' className='mt-6'>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <Input
              placeholder='Your Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='bg-gray-800 border-gray-700 text-gray-300'
            />
          </div>
          <div>
            <Input
              type='email'
              placeholder='Your Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='bg-gray-800 border-gray-700 text-gray-300'
            />
          </div>
          <div>
            <Textarea
              placeholder='Your Message'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className='bg-gray-800 border-gray-700 text-gray-300'
            />
          </div>
          <Button
            type='submit'
            className='w-full bg-pink-700 text-white hover:bg-pink-800'
          >
            Send Message
          </Button>
        </form>
      </DashboardCard>
      <div className='mt-6 text-center'>
        <p className='text-gray-400'>
          For more information, please read our{' '}
          <a href='#' className='text-pink-700 hover:underline'>
            Terms of Service
          </a>{' '}
          and{' '}
          <a href='#' className='text-pink-700 hover:underline'>
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
