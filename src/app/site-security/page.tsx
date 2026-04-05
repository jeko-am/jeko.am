"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function SiteSecurityPage() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: "80px" }}>
        {/* Hero Section */}
        <section className="bg-deep-green py-16 text-center relative zigzag-bottom">
          <div className="max-w-[1200px] mx-auto px-6">
            <h1 className="font-rubik text-white text-[38px] md:text-[48px] font-bold leading-[1.15] mb-4">
              Site <span className="text-gold">Security</span>
            </h1>
            <p className="text-white/80 max-w-2xl mx-auto text-lg leading-relaxed">
              How we keep your data safe and your shopping experience secure.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="bg-off-white">
          <div className="max-w-[900px] mx-auto px-6 py-16">
            {/* SSL Encryption */}
            <div className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                SSL Encryption
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                Our entire website is protected by SSL (Secure Socket Layer)
                encryption. This means all data transferred between your browser
                and our servers is fully encrypted and cannot be intercepted by
                third parties. You can verify this by looking for the padlock
                icon in your browser&apos;s address bar.
              </p>
            </div>

            {/* Payment Security */}
            <div className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                Payment Security
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                We use Stripe, one of the world&apos;s leading payment
                processors, to handle all card transactions. Your card details
                are never stored on our servers &mdash; they are processed
                directly by Stripe using industry-leading PCI DSS Level 1
                compliance, the highest level of payment security certification.
              </p>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                We accept Visa, Mastercard, American Express, and Apple Pay. All
                transactions are subject to 3D Secure authentication where
                supported by your bank for an extra layer of protection.
              </p>
            </div>

            {/* Data Protection */}
            <div className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                Data Protection
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                We are fully compliant with the UK General Data Protection
                Regulation (UK GDPR) and the Data Protection Act 2018. Your
                personal data is stored securely and only used for the purposes
                outlined in our Privacy Policy.
              </p>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                We implement strict access controls ensuring only authorised
                personnel can access customer data, and we conduct regular
                security audits to maintain the integrity of our systems.
              </p>
            </div>

            {/* Account Security */}
            <div className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                Account Security
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                Your Jeko account is protected by secure
                authentication. We recommend using a strong, unique password for
                your account and never sharing your login credentials. If you
                suspect any unauthorised access to your account, please contact
                us immediately.
              </p>
            </div>

            {/* Infrastructure */}
            <div className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                Infrastructure Security
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                Our website is hosted on enterprise-grade infrastructure with
                DDoS protection, automated backups, and 24/7 monitoring. We use
                a content delivery network (CDN) to ensure fast and secure
                access from anywhere in the UK.
              </p>
            </div>

            {/* Reporting */}
            <div className="bg-deep-green/5 rounded-xl p-8 text-center">
              <h3 className="text-deep-green font-rubik font-bold text-xl mb-3">
                Report a Security Concern
              </h3>
              <p className="text-deep-green/70 mb-5">
                If you notice anything suspicious or have security concerns,
                please let us know at security@jeko.am
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
