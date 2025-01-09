import React from 'react';
import Layout from '@/components/layout';

const PrivacyPolicy = () => {
  return (
    <Layout>
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-gray-700 mb-4">
          At Help'em, we respect the privacy rights of our users. This Privacy Policy outlines how we collect, use, and protect your personal information when you use our services.
        </p>
        <p className="text-gray-700 mb-4">
          We may collect certain personal information, such as your name, email address, and contact details, when you register an account or use our services. This information is used solely for the purpose of providing and improving our services and will not be shared with third parties without your consent.
        </p>
        <p className="text-gray-700 mb-4">
          We may also use your personal information to send you marketing and promotional emails about our services. However, we respect your right to privacy and provide you with the option to opt out of receiving such emails. You can manage your email preferences in your user dashboard settings.
        </p>
        <p className="text-gray-700">
          By using our services, you consent to the collection and use of your personal information as described in this Privacy Policy. If you have any questions or concerns about our privacy practices, please contact us at privacy@helpem.co.za.
        </p>
      </div>
    </div>
    </Layout>
  );
};

export default PrivacyPolicy;
