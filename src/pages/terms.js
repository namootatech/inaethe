import React from "react";
import Layout from "@/components/layout";

const TermsAndConditions = () => {
  return (
    <Layout>
    <div className="container mt-4 ">
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-4">Terms and Conditions</h1>
      <p className="mb-4">
        These terms and conditions ("Terms") govern your use of the Help'em
        service. By accessing or using the service, you agree to be bound by
        these Terms. Please read them carefully.
      </p>
      <h2 className="text-lg font-semibold mb-2">1. Acceptance of Terms</h2>
      <p className="mb-4">
        By using our service, you agree to be bound by these terms and
        conditions. If you do not agree to these Terms, please do not use the
        service.
      </p>
      <h2 className="text-lg font-semibold mb-2">2. Service Description</h2>
      <p className="mb-4">
        Our service allows users to subscribe and participate in our mission to
        end hunger in Africa. Subscribers earn a percentage of the subscription
        fees paid by their recruits, which is used for various purposes,
        including contributing to food parcels and sustaining the system.
      </p>
      <h2 className="text-lg font-semibold mb-2">3. Payments and Earnings</h2>
      <p className="mb-4">
        Subscribers earn 40% of the monthly subscription fee paid by their
        recruits. 50% of their earnings are allocated to food parcels to aid
        those in need, and 10% is directed toward the system's maintenance.
      </p>
      <h2 className="text-lg font-semibold mb-2">4. User Conduct</h2>
      <p className="mb-4">
        Users are expected to conduct themselves responsibly and in a manner
        that does not harm the mission or reputation of our organization.
        Prohibited activities include fraudulent recruitment, misleading
        practices, and any behavior that violates these Terms.
      </p>
      <h2 className="text-lg font-semibold mb-2">5. Termination</h2>
      <p className="mb-4">
        We reserve the right to terminate the service or your account at our
        discretion. Termination may occur due to violations of these Terms,
        fraudulent activity, or any other actions detrimental to our mission.
      </p>
      <h2 className="text-lg font-semibold mb-2">6. Contact Information</h2>
      <p className="mb-4">
        If you have any questions about these terms and conditions or need to
        contact us for any reason, please reach out to us at helpem@example.com.
      </p>
    </div>
    </div>
    </Layout>
  );
};

export default TermsAndConditions;
