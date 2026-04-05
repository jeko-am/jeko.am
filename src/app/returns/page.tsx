"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function ReturnsPage() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: "80px" }}>
        {/* Hero Section */}
        <section className="bg-deep-green py-16 text-center relative zigzag-bottom">
          <div className="max-w-[1200px] mx-auto px-6">
            <h1 className="font-rubik text-white text-[38px] md:text-[48px] font-bold leading-[1.15] mb-4">
              Returns &amp; <span className="text-gold">Refunds</span>
            </h1>
            <p className="text-white/80 max-w-2xl mx-auto text-lg leading-relaxed">
              Not happy with your order? We&apos;re here to make things right.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="bg-off-white">
          <div className="max-w-[900px] mx-auto px-6 py-16">
            {/* Satisfaction Guarantee */}
            <div className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                Our Satisfaction Guarantee
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                At Jeko, we stand behind the quality of our products.
                Every order is backed by our{" "}
                <strong>30-day satisfaction guarantee</strong>. If your dog
                doesn&apos;t love their new meals or you&apos;re not completely
                happy, get in touch and we&apos;ll sort it out.
              </p>
            </div>

            {/* How to Return */}
            <div className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                How to Request a Return
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-deep-green text-white flex items-center justify-center font-bold text-sm shrink-0">
                    1
                  </div>
                  <p className="text-deep-green/80 text-[16px] leading-relaxed">
                    <strong>Contact us</strong> within 30 days of receiving your
                    order via email at hello@jeko.am or through our{" "}
                    <Link
                      href="/contact"
                      className="text-deep-green underline font-semibold"
                    >
                      contact form
                    </Link>
                    .
                  </p>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-deep-green text-white flex items-center justify-center font-bold text-sm shrink-0">
                    2
                  </div>
                  <p className="text-deep-green/80 text-[16px] leading-relaxed">
                    <strong>Let us know</strong> the reason for your return and
                    include your order number. Our team will respond within 24
                    hours.
                  </p>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-deep-green text-white flex items-center justify-center font-bold text-sm shrink-0">
                    3
                  </div>
                  <p className="text-deep-green/80 text-[16px] leading-relaxed">
                    <strong>We&apos;ll arrange</strong> either a replacement, a
                    different recipe, or a full refund &mdash; whichever you
                    prefer.
                  </p>
                </div>
              </div>
            </div>

            {/* Refund Timeline */}
            <div className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                Refund Timeline
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                Once your return is approved, refunds are typically processed
                within 5-7 business days. The refund will be credited back to
                your original payment method. Please allow an additional 3-5
                days for your bank to process the transaction.
              </p>
            </div>

            {/* Damaged or Incorrect Orders */}
            <div className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                Damaged or Incorrect Orders
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                If your order arrives damaged or you receive the wrong items,
                please contact us immediately. We&apos;ll send a replacement at
                no extra cost and arrange collection of the incorrect items if
                needed.
              </p>
            </div>

            {/* Subscription Cancellations */}
            <div className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                Subscription Cancellations
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                You can cancel your subscription at any time from your account
                settings. If a delivery has already been dispatched, you can
                still request a return following the steps above. There are no
                cancellation fees.
              </p>
            </div>

            {/* Contact CTA */}
            <div className="bg-deep-green/5 rounded-xl p-8 text-center">
              <h3 className="text-deep-green font-rubik font-bold text-xl mb-3">
                Need to start a return?
              </h3>
              <p className="text-deep-green/70 mb-5">
                Our customer care team is ready to help.
              </p>
              <Link
                href="/contact"
                className="inline-block bg-deep-green text-white font-semibold px-8 py-3 rounded-full hover:bg-deep-green/90 transition-colors"
              >
                Contact us
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
