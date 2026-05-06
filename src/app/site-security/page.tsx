"use client";

import LegalPageRenderer from "@/components/LegalPageRenderer";
import { useT } from "@/lib/i18n/LangProvider";

export default function SiteSecurityPage() {
  const { t } = useT();
  return (
    <LegalPageRenderer
      slug="/site-security"
      fallbackHeading={t("policy.security.heading")}
      fallbackHeadingHighlight={t("policy.security.headingHighlight")}
      fallbackSubtitle={t("policy.security.subtitle")}
      fallbackBody={
        <>
          <div className="mb-12">
            <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">{t("policy.security.ssl")}</h2>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              Our entire website is protected by SSL (Secure Socket Layer) encryption. This means all data transferred between your browser and our servers is fully encrypted and cannot be intercepted by third parties. You can verify this by looking for the padlock icon in your browser&apos;s address bar.
            </p>
          </div>
          <div className="mb-12">
            <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">{t("policy.security.payment")}</h2>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              We use Stripe, one of the world&apos;s leading payment processors, to handle all card transactions. Your card details are never stored on our servers &mdash; they are processed directly by Stripe using industry-leading PCI DSS Level 1 compliance, the highest level of payment security certification.
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              We accept Visa, Mastercard, American Express, and Apple Pay. All transactions are subject to 3D Secure authentication where supported by your bank for an extra layer of protection.
            </p>
          </div>
          <div className="mb-12">
            <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">{t("policy.security.data")}</h2>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              We are fully compliant with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018. Your personal data is stored securely and only used for the purposes outlined in our Privacy Policy.
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              We implement strict access controls ensuring only authorised personnel can access customer data, and we conduct regular security audits to maintain the integrity of our systems.
            </p>
          </div>
          <div className="mb-12">
            <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">{t("policy.security.account")}</h2>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              Your Jeko account is protected by secure authentication. We recommend using a strong, unique password for your account and never sharing your login credentials. If you suspect any unauthorised access to your account, please contact us immediately.
            </p>
          </div>
          <div className="mb-12">
            <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">{t("policy.security.infra")}</h2>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              Our website is hosted on enterprise-grade infrastructure with DDoS protection, automated backups, and 24/7 monitoring. We use a content delivery network (CDN) to ensure fast and secure access from anywhere in the UK.
            </p>
          </div>
          <div className="bg-deep-green/5 rounded-xl p-8 text-center">
            <h3 className="text-deep-green font-rubik font-bold text-xl mb-3">{t("policy.security.report")}</h3>
            <p className="text-deep-green/70 mb-5">
              If you notice anything suspicious or have security concerns, please let us know at security@jeko.am
            </p>
          </div>
        </>
      }
    />
  );
}
