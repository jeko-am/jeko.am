"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useT } from "@/lib/i18n/LangProvider";

const deliveryOptions = [
  {
    name: "Standard Delivery",
    time: "3-5 business days",
    price: "Free on orders over £25",
    priceSub: "£3.99 for orders under £25",
  },
  {
    name: "Express Delivery",
    time: "1-2 business days",
    price: "£4.99",
    priceSub: "On all orders",
  },
  {
    name: "Next Day Delivery",
    time: "Next working day",
    price: "£6.99",
    priceSub: "Order before 2pm Mon-Fri",
  },
  {
    name: "Subscription Delivery",
    time: "Flexible schedule",
    price: "Always FREE",
    priceSub: "On every delivery, every time",
  },
];

export default function DeliveryInformationPage() {
  const { t } = useT();
  return (
    <>
      <Header />
      <main style={{ paddingTop: "80px" }}>
        {/* Hero Section */}
        <section className="bg-deep-green py-16 text-center relative zigzag-bottom">
          <div className="max-w-[1200px] mx-auto px-6">
            <h1 className="font-rubik text-white text-[38px] md:text-[48px] font-bold leading-[1.15] mb-4">
              {t("policy.delivery.heading")} <span className="text-gold">{t("policy.delivery.headingHighlight")}</span>
            </h1>
            <p className="text-white/80 max-w-2xl mx-auto text-lg leading-relaxed">
              {t("policy.delivery.subtitle")}
            </p>
          </div>
        </section>

        {/* Delivery Options */}
        <section className="bg-off-white">
          <div className="max-w-[900px] mx-auto px-6 py-16">
            <h2 className="text-deep-green font-rubik font-bold text-2xl mb-8">
              {t("policy.delivery.optionsHeading")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {deliveryOptions.map((option) => (
                <div
                  key={option.name}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                >
                  <h3 className="text-deep-green font-rubik font-bold text-lg mb-2">
                    {option.name}
                  </h3>
                  <p className="text-deep-green/70 text-sm mb-3">
                    {option.time}
                  </p>
                  <p className="text-deep-green font-semibold text-lg">
                    {option.price}
                  </p>
                  <p className="text-deep-green/60 text-sm">{option.priceSub}</p>
                </div>
              ))}
            </div>

            {/* Where We Deliver */}
            <div className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                {t("policy.delivery.whereHeading")}
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                We deliver across the whole of the United Kingdom, including
                mainland England, Scotland, Wales, and Northern Ireland. We also
                deliver to the Channel Islands and Isle of Man, though delivery
                times may vary slightly for these locations.
              </p>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                For international delivery enquiries, please{" "}
                <Link
                  href="/contact"
                  className="text-deep-green underline font-semibold"
                >
                  contact our team
                </Link>{" "}
                and we&apos;ll be happy to help.
              </p>
            </div>

            {/* How Subscription Delivery Works */}
            <div className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                {t("policy.delivery.howSubHeading")}
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                When you subscribe, we&apos;ll deliver your dog&apos;s meals on
                a regular schedule that works for you. You can choose to receive
                deliveries every 2, 4, 6, or 8 weeks. Delivery is always free
                on subscription orders, and you can pause, skip, or cancel at
                any time from your account.
              </p>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                You&apos;ll receive an email reminder before each delivery is
                dispatched, giving you time to make any changes to your order.
              </p>
            </div>

            {/* Packaging */}
            <div className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                {t("policy.delivery.packagingHeading")}
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                All Jeko meals are delivered in recyclable packaging with
                insulated liners to keep them fresh. Once your delivery arrives,
                simply pop the packets into your cupboard &mdash; Jeko is
                air-dried, so there&apos;s no need for fridge or freezer space.
              </p>
              <p className="text-deep-green/80 text-[16px] leading-relaxed">
                Each meal packet has a best-before date printed on it and will
                keep for up to 12 months when stored in a cool, dry place.
              </p>
            </div>

            {/* Tracking */}
            <div className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                {t("policy.delivery.trackingHeading")}
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                Once your order has been dispatched, you&apos;ll receive a
                confirmation email with a tracking link so you can follow your
                delivery every step of the way. If you have any questions about
                your delivery, our customer care team is always happy to help.
              </p>
            </div>

            {/* Contact CTA */}
            <div className="bg-deep-green/5 rounded-xl p-8 text-center">
              <h3 className="text-deep-green font-rubik font-bold text-xl mb-3">
                {t("policy.delivery.helpHeading")}
              </h3>
              <p className="text-deep-green/70 mb-5">
                {t("policy.delivery.helpBody")}
              </p>
              <Link
                href="/contact"
                className="inline-block bg-deep-green text-white font-semibold px-8 py-3 rounded-full hover:bg-deep-green/90 transition-colors"
              >
                {t("policy.delivery.contactCta")}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
