"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useT } from "@/lib/i18n/LangProvider";

export default function TermsOfUsePage() {
  const { t } = useT();
  return (
    <>
      <Header />
      <main style={{ paddingTop: "80px" }}>
        {/* Hero Section */}
        <section className="bg-deep-green py-16 text-center relative zigzag-bottom">
          <div className="max-w-[900px] mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white font-rubik mb-4">
              {t("policy.terms.title")}
            </h1>
            <p className="text-white/80 text-lg md:text-xl font-rubik">
              {t("policy.terms.subtitle")}
            </p>
          </div>
        </section>

        {/* Terms Content */}
        <section className="bg-off-white">
          <div className="max-w-[900px] mx-auto px-6 py-16">
            <p className="text-deep-green/60 text-[14px] mb-8 font-rubik">
              Last updated: March 2026
            </p>

            {/* 1. Acceptance of Terms */}
            <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              Welcome to Jeko. These Terms of Use (&quot;Terms&quot;) constitute a
              legally binding agreement between you (&quot;you&quot;, &quot;your&quot;, or
              &quot;User&quot;) and Jeko Ltd (&quot;Jeko&quot;, &quot;we&quot;,
              &quot;us&quot;, or &quot;our&quot;), a company registered in England and Wales.
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              By accessing or using our website at jeko.am (the &quot;Website&quot;),
              placing orders, creating an account, subscribing to our meal plans, or engaging
              with our community features, you acknowledge that you have read, understood, and
              agree to be bound by these Terms, together with our{" "}
              <Link href="/privacy-policy" className="text-deep-green underline font-semibold">
                Privacy Policy
              </Link>
              , which is incorporated herein by reference.
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              If you do not agree to these Terms, you must not access or use our Website or
              services. We recommend that you print or save a copy of these Terms for your
              records.
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              You must be at least 18 years of age to use our services. By using the Website,
              you represent and warrant that you are at least 18 years old and have the legal
              capacity to enter into these Terms.
            </p>

            {/* 2. About Jeko */}
            <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4 mt-12">
              2. About Jeko
            </h2>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              Jeko is a natural dog food company dedicated to providing freshly
              prepared, nutritionally balanced meals made from 100% natural, human-grade
              ingredients. We operate as both an e-commerce platform and a subscription-based
              meal delivery service, offering personalised nutrition plans tailored to your
              dog&apos;s breed, age, weight, activity level, and specific health requirements.
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              Our services include, but are not limited to:
            </p>
            <ul className="list-disc pl-8 mb-4 space-y-2">
              <li className="text-deep-green/80 text-[16px] leading-relaxed">
                Customised dog food subscription plans with regular delivery
              </li>
              <li className="text-deep-green/80 text-[16px] leading-relaxed">
                One-off purchases of dog food, treats, and accessories through our online shop
              </li>
              <li className="text-deep-green/80 text-[16px] leading-relaxed">
                A community platform featuring social feeds, dog owner matching, messaging,
                and other interactive features
              </li>
              <li className="text-deep-green/80 text-[16px] leading-relaxed">
                Nutritional guidance and educational content about canine health and wellbeing
              </li>
              <li className="text-deep-green/80 text-[16px] leading-relaxed">
                Personalised feeding recommendations based on your dog&apos;s profile
              </li>
            </ul>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              Jeko Ltd is registered in England and Wales with company number
              09498491. Our registered office is located at Unit 1, Brookfields Park,
              Manvers, Rotherham, South Yorkshire, S63 5DR, United Kingdom.
            </p>

            {/* 3. Account Registration & Security */}
            <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4 mt-12">
              3. Account Registration &amp; Security
            </h2>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              To access certain features of our Website, including placing orders, managing
              subscriptions, and participating in community features, you may be required to
              create an account.
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-2 font-semibold">
              3.1 Registration Requirements
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              When registering for an account, you agree to provide accurate, current, and
              complete information as prompted by the registration form. You must keep your
              account information up to date at all times. Providing false, inaccurate, or
              misleading information may result in the suspension or termination of your
              account.
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-2 font-semibold">
              3.2 Account Security
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              You are responsible for maintaining the confidentiality of your account
              credentials, including your password. You agree to notify us immediately at{" "}
              <a href="mailto:help@jeko.am" className="text-deep-green underline font-semibold">
                help@jeko.am
              </a>{" "}
              if you become aware of any unauthorised use of your account or any other breach
              of security. We shall not be liable for any loss or damage arising from your
              failure to protect your account credentials.
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-2 font-semibold">
              3.3 Account Termination
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              We reserve the right to suspend, disable, or terminate your account at our sole
              discretion, without prior notice or liability, for any reason, including but not
              limited to: breach of these Terms, fraudulent or illegal activity, abusive
              behaviour towards staff or other users, or extended periods of inactivity. You
              may also request the deletion of your account at any time by contacting our
              customer support team.
            </p>

            {/* 4. Products & Subscriptions */}
            <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4 mt-12">
              4. Products &amp; Subscriptions
            </h2>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-2 font-semibold">
              4.1 Subscription Plans
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              Jeko offers personalised subscription meal plans designed around your
              dog&apos;s individual nutritional needs. When you create a plan, we will ask you
              questions about your dog&apos;s breed, age, weight, activity level, and any
              known health conditions or dietary sensitivities. Based on this information, we
              will recommend a tailored feeding plan, including specific recipes and portion
              sizes.
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-2 font-semibold">
              4.2 Customisation
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              You may customise your subscription at any time through your account dashboard.
              This includes changing recipes, adjusting portion sizes, modifying delivery
              frequency, pausing your subscription, or adding supplementary products. Changes
              to your subscription must be made at least 48 hours before your next scheduled
              delivery date to take effect for that delivery.
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-2 font-semibold">
              4.3 Auto-Renewal
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              All subscription plans automatically renew at the end of each billing cycle
              (typically every 2, 4, or 6 weeks, depending on the plan you have selected).
              Your registered payment method will be charged automatically at the beginning of
              each renewal period. We will send you a reminder email prior to each renewal,
              detailing the upcoming charge and delivery date. It is your responsibility to
              ensure your payment method is valid and has sufficient funds.
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-2 font-semibold">
              4.4 Cancellation
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              You may cancel your subscription at any time through your account dashboard or
              by contacting our customer support team. Cancellation must be made at least 48
              hours before your next scheduled delivery. If you cancel after this window, your
              next delivery may still be processed and charged. Upon cancellation, you will
              continue to receive any deliveries that have already been paid for. No refunds
              will be issued for the current billing period unless otherwise required by
              applicable law.
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-2 font-semibold">
              4.5 Product Availability
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              We make every effort to ensure that the products listed on our Website are
              available. However, product availability may change without notice due to
              seasonal ingredient availability, supplier constraints, or other factors beyond
              our control. If a product you have ordered becomes unavailable, we will notify
              you and offer a suitable alternative or a full refund.
            </p>

            {/* 5. Ordering & Payment */}
            <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4 mt-12">
              5. Ordering &amp; Payment
            </h2>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-2 font-semibold">
              5.1 Pricing
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              All prices displayed on our Website are in British Pounds Sterling (GBP) and
              include VAT where applicable. Prices for subscription plans are calculated based
              on your dog&apos;s specific requirements, the recipes selected, and the delivery
              frequency chosen. We reserve the right to update prices at any time; however,
              any price changes will not affect orders that have already been confirmed. For
              subscription customers, we will provide at least 14 days&apos; notice of any
              price increases.
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-2 font-semibold">
              5.2 Payment Methods
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              We accept payment via major credit and debit cards (Visa, Mastercard, American
              Express), PayPal, Apple Pay, Google Pay, and other payment methods as displayed
              at checkout. All payment processing is handled by our third-party payment
              provider, and we do not store your full payment card details on our servers.
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-2 font-semibold">
              5.3 Order Confirmation
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              When you place an order, you will receive an email acknowledging receipt of your
              order. Please note that this acknowledgement does not constitute acceptance of
              your order. A binding contract between you and Jeko is formed only when
              we send you a dispatch confirmation email. We reserve the right to refuse or
              cancel any order for any reason, including but not limited to product
              availability, errors in pricing or product information, or suspected fraudulent
              activity.
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-2 font-semibold">
              5.4 Price Changes
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              We may adjust the prices of our products and subscription plans from time to
              time to reflect changes in ingredient costs, operational expenses, or market
              conditions. For active subscription customers, we will notify you of any price
              changes via email at least 14 days before the new price takes effect. You will
              have the option to accept the new price, modify your plan, or cancel your
              subscription before the price change applies.
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-2 font-semibold">
              5.5 Promotional Offers &amp; Discount Codes
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              From time to time, we may offer promotional pricing, discount codes, or special
              offers. These are subject to their own specific terms and conditions, may not be
              combined with other offers unless stated otherwise, and may be withdrawn at any
              time without notice. Promotional pricing applies only to the initial order or
              specified period and does not guarantee the same pricing for subsequent
              deliveries.
            </p>

            {/* 6. Delivery & Shipping */}
            <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4 mt-12">
              6. Delivery &amp; Shipping
            </h2>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-2 font-semibold">
              6.1 Delivery Timeframes
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              We aim to deliver your order within the timeframe indicated at checkout or in
              your subscription delivery schedule. Standard delivery within mainland UK
              typically takes 2&ndash;5 working days. First-time subscription orders are
              usually dispatched within 3&ndash;5 working days of order confirmation. While
              we endeavour to meet all estimated delivery dates, these are not guaranteed and
              may be affected by factors outside our control, including courier delays,
              adverse weather conditions, or unforeseen disruptions.
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-2 font-semibold">
              6.2 Shipping Methods
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              Our fresh and dehydrated dog food products are shipped in insulated,
              temperature-controlled packaging designed to keep them fresh during transit. We
              use trusted courier partners to ensure safe and timely delivery. Delivery
              charges, if applicable, will be clearly displayed at checkout. Subscription
              customers may benefit from free or discounted delivery depending on their plan.
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-2 font-semibold">
              6.3 Delivery Areas
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              We currently deliver to addresses within the United Kingdom, including mainland
              UK, Northern Ireland, and the Scottish Highlands and Islands (additional
              surcharges may apply for certain remote areas). We do not currently offer
              international shipping. If you are unsure whether we deliver to your area,
              please contact our customer support team.
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-2 font-semibold">
              6.4 Delivery Issues
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              If your order arrives damaged, with missing items, or does not arrive within the
              expected timeframe, please contact us within 48 hours of the expected delivery
              date at{" "}
              <a href="mailto:help@jeko.am" className="text-deep-green underline font-semibold">
                help@jeko.am
              </a>
              . We will investigate the issue and, where appropriate, arrange a replacement
              delivery or issue a refund. Risk of loss and damage to products passes to you
              upon delivery to the address provided.
            </p>

            {/* 7. Returns & Refunds */}
            <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4 mt-12">
              7. Returns &amp; Refunds
            </h2>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              We want you and your dog to be completely satisfied with every purchase. Due to
              the perishable nature of our food products, we are unable to accept returns of
              opened or partially consumed food items. However, we are committed to resolving
              any issues you may experience.
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              You may be eligible for a refund or replacement in the following circumstances:
            </p>
            <ul className="list-disc pl-8 mb-4 space-y-2">
              <li className="text-deep-green/80 text-[16px] leading-relaxed">
                The product arrived damaged, spoiled, or in a condition that renders it unfit
                for use
              </li>
              <li className="text-deep-green/80 text-[16px] leading-relaxed">
                The wrong product was delivered
              </li>
              <li className="text-deep-green/80 text-[16px] leading-relaxed">
                Items were missing from your order
              </li>
              <li className="text-deep-green/80 text-[16px] leading-relaxed">
                The product does not match the description on our Website
              </li>
            </ul>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              For non-perishable products (such as accessories, bowls, or supplements in
              sealed packaging), you may return unused, unopened items within 14 days of
              receipt for a full refund, in accordance with the Consumer Contracts
              (Information, Cancellation and Additional Charges) Regulations 2013.
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              For full details on our returns and refunds process, including how to initiate a
              return, please refer to our{" "}
              <Link href="/refund-policy" className="text-deep-green underline font-semibold">
                Refund Policy
              </Link>
              .
            </p>

            {/* 8. Product Information & Disclaimers */}
            <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4 mt-12">
              8. Product Information &amp; Disclaimers
            </h2>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-2 font-semibold">
              8.1 Nutritional Information
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              We make every effort to ensure that the nutritional information, ingredient
              lists, and feeding guidelines provided on our Website are accurate and up to
              date. However, this information is provided for general guidance only and may
              vary slightly due to natural variations in ingredients. Always refer to the
              product packaging for the most current and accurate information.
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-2 font-semibold">
              8.2 Veterinary Advice Disclaimer
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              The information provided on our Website, including nutritional guidance, feeding
              recommendations, and health-related content, is intended for general
              informational purposes only. It is not intended to be, and should not be
              construed as, veterinary advice, diagnosis, or treatment. The content on our
              Website does not replace professional veterinary consultation. Always seek the
              advice of a qualified veterinarian with any questions you may have regarding your
              dog&apos;s health, diet, or medical condition.
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-2 font-semibold">
              8.3 Allergen Information
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              Some of our products contain or may have been produced in facilities that
              process common allergens, including but not limited to chicken, beef, lamb, fish,
              eggs, dairy, wheat, and soya. Detailed allergen information is provided on each
              product page and on the product packaging. If your dog has known allergies or
              sensitivities, we strongly recommend reviewing the full ingredient list before
              purchasing. While we offer hypoallergenic and limited-ingredient recipes, we
              cannot guarantee that any product is entirely free from trace allergens due to
              the nature of our production processes.
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-2 font-semibold">
              8.4 Images &amp; Descriptions
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              Product images on our Website are for illustrative purposes only. Actual products
              may vary slightly in appearance, colour, or packaging from what is shown. We
              endeavour to describe and display our products as accurately as possible, but we
              do not warrant that product descriptions, images, or other content on the
              Website are entirely accurate, complete, or error-free.
            </p>

            {/* 9. Pet Health Disclaimer */}
            <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4 mt-12">
              9. Pet Health Disclaimer
            </h2>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              Jeko provides nutritionally balanced meals formulated to meet the
              dietary needs of dogs. However, our products and services are not a substitute
              for professional veterinary care. We strongly recommend the following:
            </p>
            <ul className="list-disc pl-8 mb-4 space-y-2">
              <li className="text-deep-green/80 text-[16px] leading-relaxed">
                Consult your veterinarian before making significant changes to your dog&apos;s
                diet, especially if your dog has pre-existing health conditions, is pregnant
                or nursing, or is very young or elderly
              </li>
              <li className="text-deep-green/80 text-[16px] leading-relaxed">
                Monitor your dog during any dietary transition and contact your veterinarian
                if you notice any adverse reactions, including digestive upset, lethargy,
                changes in appetite, or allergic responses
              </li>
              <li className="text-deep-green/80 text-[16px] leading-relaxed">
                Maintain regular veterinary check-ups and vaccinations regardless of dietary
                choices
              </li>
              <li className="text-deep-green/80 text-[16px] leading-relaxed">
                Follow the feeding guidelines provided but adjust based on your dog&apos;s
                individual needs, activity level, and your veterinarian&apos;s recommendations
              </li>
            </ul>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              Jeko shall not be held liable for any adverse health effects resulting
              from the use of our products, particularly where the products have been used
              contrary to the feeding guidelines, stored improperly, or administered without
              appropriate veterinary consultation for dogs with known health conditions.
            </p>

            {/* 10. User-Generated Content */}
            <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4 mt-12">
              10. User-Generated Content
            </h2>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-2 font-semibold">
              10.1 Content Submission
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              Our Website may allow you to submit, post, or share content, including but not
              limited to product reviews, ratings, photographs of your pets, comments,
              community posts, messages, and other materials (collectively,
              &quot;User Content&quot;). By submitting User Content, you represent and warrant
              that you own or have the necessary rights and permissions to share such content
              and that it does not violate any third party&apos;s intellectual property rights,
              privacy rights, or any applicable law.
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-2 font-semibold">
              10.2 Licence Grant
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              By submitting User Content to our Website, you grant Jeko a
              non-exclusive, worldwide, royalty-free, perpetual, irrevocable, sublicensable
              licence to use, reproduce, modify, adapt, publish, translate, distribute,
              display, and create derivative works from your User Content in any media format
              and through any distribution channel, for the purposes of operating, promoting,
              and improving our services. You retain ownership of your User Content, but you
              acknowledge that we may use it as described herein.
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-2 font-semibold">
              10.3 Content Moderation
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              We reserve the right, but are not obligated, to review, monitor, edit, or
              remove any User Content at our sole discretion, for any reason, including but
              not limited to content that we determine violates these Terms, is offensive,
              harmful, inaccurate, or otherwise objectionable. We are not responsible for the
              accuracy, completeness, or reliability of any User Content posted by users.
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-2 font-semibold">
              10.4 Content Responsibility
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              You are solely responsible for the User Content you submit. Jeko does
              not endorse, guarantee, or assume responsibility for any User Content. Any
              reliance you place on User Content posted by other users is at your own risk.
            </p>

            {/* 11. Community Guidelines */}
            <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4 mt-12">
              11. Community Guidelines
            </h2>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              Our community features, including the social feed, dog owner matching
              (&quot;Swipe &amp; Match&quot;), messaging, and owner discovery tools, are
              designed to connect dog owners and foster a supportive community. When using
              these features, you agree to abide by the following guidelines:
            </p>
            <ul className="list-disc pl-8 mb-4 space-y-2">
              <li className="text-deep-green/80 text-[16px] leading-relaxed">
                <strong>Be respectful:</strong> Treat all community members with courtesy and
                respect. Harassment, bullying, intimidation, or any form of abusive behaviour
                will not be tolerated.
              </li>
              <li className="text-deep-green/80 text-[16px] leading-relaxed">
                <strong>Keep it relevant:</strong> Community features are intended for
                dog-related content and discussions. Off-topic, spam, or promotional content
                is not permitted.
              </li>
              <li className="text-deep-green/80 text-[16px] leading-relaxed">
                <strong>No harmful content:</strong> Do not post content that is defamatory,
                obscene, hateful, discriminatory, threatening, or that promotes violence or
                illegal activities.
              </li>
              <li className="text-deep-green/80 text-[16px] leading-relaxed">
                <strong>Protect privacy:</strong> Do not share personal information about
                other users without their consent. Respect the privacy of other community
                members and their pets.
              </li>
              <li className="text-deep-green/80 text-[16px] leading-relaxed">
                <strong>No misleading information:</strong> Do not post false or misleading
                health advice, product claims, or other information that could be harmful to
                dogs or their owners.
              </li>
              <li className="text-deep-green/80 text-[16px] leading-relaxed">
                <strong>Report concerns:</strong> If you encounter content or behaviour that
                violates these guidelines, please report it to our team at{" "}
                <a href="mailto:community@jeko.am" className="text-deep-green underline font-semibold">
                  community@jeko.am
                </a>
                .
              </li>
            </ul>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              Violation of these Community Guidelines may result in content removal, account
              suspension, or permanent ban from community features at our sole discretion.
            </p>

            {/* 12. Intellectual Property */}
            <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4 mt-12">
              12. Intellectual Property
            </h2>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              All content on the Website, including but not limited to text, graphics, logos,
              icons, images, audio clips, video content, digital downloads, data compilations,
              software, trademarks, trade names, and the overall design and layout of the
              Website (collectively, &quot;Our Content&quot;), is the property of Jeko Ltd or its licensors and is protected by United Kingdom and international
              copyright, trademark, patent, and other intellectual property laws.
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              You may not reproduce, distribute, modify, create derivative works from,
              publicly display, publicly perform, republish, download, store, or transmit any
              of Our Content without our prior written consent, except as follows:
            </p>
            <ul className="list-disc pl-8 mb-4 space-y-2">
              <li className="text-deep-green/80 text-[16px] leading-relaxed">
                Your computer or device may temporarily store copies of such materials in
                RAM incidental to your accessing and viewing the content
              </li>
              <li className="text-deep-green/80 text-[16px] leading-relaxed">
                You may store files that are automatically cached by your web browser for
                display enhancement purposes
              </li>
              <li className="text-deep-green/80 text-[16px] leading-relaxed">
                You may print or download one copy of a reasonable number of pages of the
                Website for your own personal, non-commercial use and not for further
                reproduction, publication, or distribution
              </li>
            </ul>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              The &quot;Jeko&quot; name, logo, and all related names, logos,
              product and service names, designs, and slogans are trademarks of Jeko Ltd. You must not use such marks without our prior written permission.
            </p>

            {/* 13. Limitation of Liability */}
            <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4 mt-12">
              13. Limitation of Liability
            </h2>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              To the fullest extent permitted by applicable law, Jeko Ltd, its
              directors, officers, employees, agents, suppliers, and affiliates shall not be
              liable for any indirect, incidental, special, consequential, or punitive
              damages, including but not limited to loss of profits, data, use, goodwill, or
              other intangible losses, arising out of or in connection with:
            </p>
            <ul className="list-disc pl-8 mb-4 space-y-2">
              <li className="text-deep-green/80 text-[16px] leading-relaxed">
                Your access to, use of, or inability to access or use our Website or services
              </li>
              <li className="text-deep-green/80 text-[16px] leading-relaxed">
                Any conduct or content of any third party on the Website, including User
                Content
              </li>
              <li className="text-deep-green/80 text-[16px] leading-relaxed">
                Any content obtained from the Website
              </li>
              <li className="text-deep-green/80 text-[16px] leading-relaxed">
                Unauthorised access, use, or alteration of your transmissions or content
              </li>
              <li className="text-deep-green/80 text-[16px] leading-relaxed">
                Any adverse reaction your pet may experience from our products, unless
                directly caused by a proven defect in the product
              </li>
            </ul>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              In any event, our total aggregate liability to you for all claims arising out
              of or in connection with these Terms or your use of our services shall not
              exceed the amount you have paid to us in the twelve (12) months immediately
              preceding the event giving rise to the claim. Nothing in these Terms shall
              exclude or limit our liability for death or personal injury caused by our
              negligence, fraud or fraudulent misrepresentation, or any other liability that
              cannot be excluded or limited by English law.
            </p>

            {/* 14. Indemnification */}
            <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4 mt-12">
              14. Indemnification
            </h2>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              You agree to indemnify, defend, and hold harmless Jeko Ltd, its
              directors, officers, employees, agents, suppliers, and affiliates from and
              against any and all claims, liabilities, damages, losses, costs, expenses, or
              fees (including reasonable legal fees) arising out of or relating to:
            </p>
            <ul className="list-disc pl-8 mb-4 space-y-2">
              <li className="text-deep-green/80 text-[16px] leading-relaxed">
                Your violation of these Terms
              </li>
              <li className="text-deep-green/80 text-[16px] leading-relaxed">
                Your User Content, including any claims that your User Content infringes
                upon the intellectual property rights or other rights of any third party
              </li>
              <li className="text-deep-green/80 text-[16px] leading-relaxed">
                Your use or misuse of our Website or services
              </li>
              <li className="text-deep-green/80 text-[16px] leading-relaxed">
                Your violation of any applicable law, regulation, or third-party rights
              </li>
              <li className="text-deep-green/80 text-[16px] leading-relaxed">
                Any interaction you have with other users through our community features
              </li>
            </ul>

            {/* 15. Governing Law */}
            <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4 mt-12">
              15. Governing Law
            </h2>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              These Terms, and any dispute or claim arising out of or in connection with them
              or their subject matter or formation (including non-contractual disputes or
              claims), shall be governed by and construed in accordance with the laws of
              England and Wales.
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              The courts of England and Wales shall have exclusive jurisdiction to settle any
              dispute or claim arising out of or in connection with these Terms or their
              subject matter or formation. However, if you are a consumer resident in
              Scotland, you may also bring proceedings in the Scottish courts, and if you are
              a consumer resident in Northern Ireland, you may also bring proceedings in the
              Northern Irish courts.
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              Nothing in these Terms affects your statutory rights as a consumer under UK
              consumer protection legislation, including the Consumer Rights Act 2015.
            </p>

            {/* 16. Dispute Resolution */}
            <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4 mt-12">
              16. Dispute Resolution
            </h2>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              We are committed to resolving disputes fairly and efficiently. If you have a
              complaint or dispute regarding our products or services, we encourage you to
              first contact our customer support team at{" "}
              <a href="mailto:help@jeko.am" className="text-deep-green underline font-semibold">
                help@jeko.am
              </a>{" "}
              so that we can attempt to resolve the matter informally.
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              If we are unable to resolve the dispute informally within 30 days, either
              party may pursue formal dispute resolution. Before initiating court proceedings,
              we encourage you to consider alternative dispute resolution (ADR) through a
              certified ADR provider. For consumers in the UK, you may also use the
              European Commission&apos;s Online Dispute Resolution platform (where applicable)
              or contact Citizens Advice for guidance.
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              Nothing in this section shall prevent either party from seeking interim
              injunctive relief or other equitable relief from a court of competent
              jurisdiction where necessary to prevent irreparable harm.
            </p>

            {/* 17. Severability */}
            <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4 mt-12">
              17. Severability
            </h2>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              If any provision of these Terms is found to be invalid, illegal, or
              unenforceable by a court of competent jurisdiction, the invalidity, illegality,
              or unenforceability of that provision shall not affect the validity or
              enforceability of the remaining provisions, which shall continue in full force
              and effect. The invalid or unenforceable provision shall be deemed modified to
              the minimum extent necessary to make it valid and enforceable while preserving
              the original intent of the parties.
            </p>

            {/* 18. Changes to Terms */}
            <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4 mt-12">
              18. Changes to Terms
            </h2>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              We reserve the right to modify, update, or replace these Terms at any time at
              our sole discretion. When we make material changes, we will update the
              &quot;Last updated&quot; date at the top of this page and, where appropriate,
              notify you via email or through a prominent notice on our Website.
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              Your continued use of the Website and our services after the effective date of
              any changes constitutes your acceptance of the revised Terms. If you do not
              agree to the updated Terms, you must stop using our Website and services
              immediately. We encourage you to review these Terms periodically to stay
              informed of any updates.
            </p>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              For significant changes that materially affect your rights or obligations, we
              will endeavour to provide at least 14 days&apos; advance notice before the
              changes take effect.
            </p>

            {/* 19. Contact Information */}
            <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4 mt-12">
              19. Contact Information
            </h2>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              If you have any questions, concerns, or complaints about these Terms, our
              products, or our services, please do not hesitate to contact us:
            </p>
            <div className="bg-white rounded-xl p-6 mb-4 shadow-sm">
              <p className="text-deep-green font-rubik font-semibold text-lg mb-3">
                Jeko Ltd
              </p>
              <ul className="space-y-2">
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Address:</strong> Unit 1, Brookfields Park, Manvers, Rotherham,
                  South Yorkshire, S63 5DR, United Kingdom
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Email:</strong>{" "}
                  <a href="mailto:help@jeko.am" className="text-deep-green underline font-semibold">
                    help@jeko.am
                  </a>
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Community enquiries:</strong>{" "}
                  <a href="mailto:community@jeko.am" className="text-deep-green underline font-semibold">
                    community@jeko.am
                  </a>
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Website:</strong>{" "}
                  <Link href="/" className="text-deep-green underline font-semibold">
                    www.jeko.am
                  </Link>
                </li>
              </ul>
            </div>
            <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
              We aim to respond to all enquiries within 2 working days.
            </p>

            <div className="border-t border-deep-green/10 mt-12 pt-8">
              <p className="text-deep-green/60 text-[14px] leading-relaxed">
                These Terms of Use were last updated in March 2026. By continuing to use our
                Website, you acknowledge that you have read and agree to be bound by these
                Terms.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
