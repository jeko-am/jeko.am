"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: "80px" }}>
        {/* Hero Section */}
        <section className="bg-deep-green py-16 text-center relative zigzag-bottom">
          <div className="max-w-[1200px] mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Privacy <span className="text-gold">Policy</span>
            </h1>
            <p className="text-white/70 max-w-xl mx-auto text-lg">
              Your privacy matters to us. Learn how Jeko collects,
              uses, and protects your personal information.
            </p>
          </div>
        </section>

        {/* Privacy Policy Content */}
        <section className="bg-off-white">
          <div className="max-w-[900px] mx-auto px-6 py-16">
            {/* Last Updated */}
            <p className="text-deep-green/60 text-sm font-rubik mb-10 italic">
              Last updated: March 2026
            </p>

            {/* 1. Introduction */}
            <div className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                1. Introduction
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                Welcome to Jeko (&quot;Jeko,&quot; &quot;we,&quot;
                &quot;us,&quot; or &quot;our&quot;). Jeko Ltd is a
                company registered in England and Wales that specialises in
                producing and delivering natural, nutritionally complete dog
                food directly to customers across the United Kingdom and
                internationally.
              </p>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                We are committed to protecting and respecting your privacy. This
                Privacy Policy explains how we collect, use, disclose, and
                safeguard your information when you visit our website at
                jeko.am, use our mobile applications, place orders for
                our products, create a pet profile, interact with our customer
                service team, or engage with us through social media and other
                digital channels.
              </p>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                Jeko Ltd acts as the data controller for the personal
                data described in this policy. We process personal data in
                accordance with the UK General Data Protection Regulation (UK
                GDPR), the Data Protection Act 2018, and all other applicable
                data protection legislation. By using our services, you
                acknowledge that you have read and understood this Privacy
                Policy. If you do not agree with the practices described herein,
                please do not use our website or services.
              </p>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                For the purposes of data protection law, our registered office
                address is Jeko Ltd, Unit 5, Jeko House, Sheffield, S9
                1TZ, United Kingdom. Our Data Protection Officer can be
                contacted at privacy@jeko.am.
              </p>
            </div>

            {/* 2. Information We Collect */}
            <div className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                2. Information We Collect
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                We collect several types of information from and about users of
                our website and services. The categories of data we collect
                include:
              </p>

              <h3 className="text-deep-green font-rubik font-semibold text-lg mb-3 mt-6">
                Personal Information You Provide
              </h3>
              <ul className="list-disc list-outside ml-6 mb-4 space-y-2">
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Identity Data:</strong> Your full name, title, date of
                  birth, and username or similar identifier that you provide when
                  creating an account or placing an order.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Contact Data:</strong> Your email address, postal
                  address (including billing and delivery addresses), telephone
                  number, and any other contact details you supply.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Financial Data:</strong> Payment card details, bank
                  account information, and billing address. Please note that we
                  do not store complete payment card numbers on our servers;
                  these are processed securely through our PCI-DSS compliant
                  payment processors.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Transaction Data:</strong> Details about payments to
                  and from you, including details of products you have purchased,
                  order history, subscription details, delivery preferences, and
                  any refunds or returns.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Communications Data:</strong> Records of
                  correspondence if you contact us, including emails, chat
                  messages, phone call recordings (where applicable and with
                  prior notice), social media messages, and feedback or reviews
                  you submit.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Account Data:</strong> Your username and password,
                  account preferences, marketing and communication preferences,
                  and details of your subscription plan.
                </li>
              </ul>

              <h3 className="text-deep-green font-rubik font-semibold text-lg mb-3 mt-6">
                Device and Technical Information
              </h3>
              <ul className="list-disc list-outside ml-6 mb-4 space-y-2">
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Technical Data:</strong> Internet Protocol (IP)
                  address, browser type and version, operating system and
                  platform, device type and screen resolution, time zone setting,
                  and other technology on the devices you use to access our
                  website.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Usage Data:</strong> Information about how you use our
                  website, including the pages you visit, the links you click,
                  the duration of your visit, the products you view or search
                  for, page response times, download errors, and interaction
                  data such as scrolling, clicks, and mouse-overs.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Location Data:</strong> Approximate geographic location
                  derived from your IP address, and, where you have given
                  permission, more precise location data from your mobile device
                  for delivery-related services.
                </li>
              </ul>

              <h3 className="text-deep-green font-rubik font-semibold text-lg mb-3 mt-6">
                Cookies and Tracking Technologies
              </h3>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                We use cookies, pixel tags, web beacons, and similar tracking
                technologies to collect information about your browsing
                activity. This includes session cookies that expire when you
                close your browser, persistent cookies that remain on your
                device for a set period, and third-party cookies placed by our
                analytics and advertising partners. For full details, please see
                Section 9 (Cookies &amp; Tracking Technologies) below.
              </p>
            </div>

            {/* 3. How We Use Your Information */}
            <div className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                3. How We Use Your Information
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                We use the information we collect for a variety of business
                purposes, always ensuring that there is a valid legal basis for
                each processing activity. The primary ways we use your data
                include:
              </p>

              <h3 className="text-deep-green font-rubik font-semibold text-lg mb-3 mt-6">
                Order Processing and Fulfilment
              </h3>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                We use your personal information to process and fulfil your
                orders, including creating your customised pet food plan,
                processing payments, arranging delivery, managing your
                subscription (including pausing, modifying, or cancelling), and
                handling returns or refunds. We also use your data to send order
                confirmations, dispatch notifications, and delivery tracking
                updates.
              </p>

              <h3 className="text-deep-green font-rubik font-semibold text-lg mb-3 mt-6">
                Communications and Customer Support
              </h3>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                We use your contact information to respond to your enquiries,
                provide customer support, send you important service-related
                communications (such as changes to your subscription, product
                recalls, or terms of service updates), and to follow up on
                feedback or complaints. These communications are essential to
                the delivery of our service and are not considered marketing.
              </p>

              <h3 className="text-deep-green font-rubik font-semibold text-lg mb-3 mt-6">
                Personalisation and Recommendations
              </h3>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                We use your pet profile data and purchase history to personalise
                your experience on our website, recommend products and recipes
                that suit your dog&apos;s specific needs, adjust portion sizes
                based on your dog&apos;s weight and activity level, and tailor
                the content you see. This helps us provide you with the most
                relevant and useful information about feeding and caring for
                your pet.
              </p>

              <h3 className="text-deep-green font-rubik font-semibold text-lg mb-3 mt-6">
                Marketing and Promotional Communications
              </h3>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                Where you have given us your consent, or where we have a
                legitimate interest to do so (such as marketing to existing
                customers about similar products), we may send you promotional
                emails, newsletters, special offers, and information about new
                products or services. You can opt out of marketing
                communications at any time by clicking the unsubscribe link in
                any email, updating your preferences in your account settings,
                or contacting us directly.
              </p>

              <h3 className="text-deep-green font-rubik font-semibold text-lg mb-3 mt-6">
                Analytics and Service Improvement
              </h3>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                We use aggregated and anonymised usage data to analyse trends,
                monitor the effectiveness of our website and marketing
                campaigns, improve our products and services, develop new
                features and offerings, and ensure our website functions
                correctly. We may also conduct surveys and research to better
                understand our customers&apos; needs and preferences.
              </p>

              <h3 className="text-deep-green font-rubik font-semibold text-lg mb-3 mt-6">
                Legal and Compliance Purposes
              </h3>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                We may use your information to comply with applicable laws and
                regulations, respond to lawful requests from public authorities,
                enforce our terms and conditions, protect our rights, property,
                or safety (and that of our customers or others), and detect and
                prevent fraud or other illegal activities.
              </p>
            </div>

            {/* 4. Pet Profile Data */}
            <div className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                4. Pet Profile Data
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                As a pet food company, we collect specific information about
                your dog(s) to provide our core service of creating customised,
                nutritionally complete meal plans. This pet profile data is
                central to what we do, and we treat it with the same care as
                your personal information.
              </p>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                The pet-related data we collect includes:
              </p>
              <ul className="list-disc list-outside ml-6 mb-4 space-y-2">
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Basic Information:</strong> Your dog&apos;s name,
                  breed (or mix of breeds), date of birth or approximate age,
                  sex, and whether your dog has been neutered or spayed.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Physical Characteristics:</strong> Current weight,
                  target weight, body condition score, and size category.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Health and Medical Information:</strong> Known
                  allergies and intolerances, existing health conditions (such
                  as pancreatitis, colitis, kidney disease, diabetes, or joint
                  issues), medications your dog is taking, and any dietary
                  restrictions recommended by your veterinarian.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Dietary Needs and Preferences:</strong> Current diet
                  type, food preferences and dislikes, activity level, feeding
                  schedule, and specific nutritional requirements.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Behavioural Data:</strong> Activity level, eating
                  habits, and any behavioural notes relevant to feeding (such as
                  fast eating or food guarding).
                </li>
              </ul>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                We use this pet profile data to calculate appropriate portion
                sizes and caloric requirements, recommend suitable recipes and
                ingredients that avoid known allergens, tailor our product
                suggestions to your dog&apos;s specific health conditions,
                provide breed-specific dietary guidance, track your dog&apos;s
                weight and health progress over time (where you use these
                features), and improve our recipes and nutritional formulations
                through aggregated, anonymised analysis.
              </p>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                Pet profile data is never sold to third parties. We may use
                anonymised and aggregated pet data for research purposes to
                improve canine nutrition, but this data cannot be linked back to
                you or your pet individually. If you choose to participate in
                our community features, only the information you explicitly
                choose to share (such as your dog&apos;s name and photo) will
                be visible to other users.
              </p>
            </div>

            {/* 5. Legal Basis for Processing (GDPR) */}
            <div className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                5. Legal Basis for Processing (GDPR)
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                Under the UK GDPR and the EU GDPR, we are required to have a
                valid legal basis for each processing activity involving your
                personal data. The legal bases we rely on are:
              </p>
              <ul className="list-disc list-outside ml-6 mb-4 space-y-2">
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Performance of a Contract (Article 6(1)(b)):</strong>{" "}
                  Processing that is necessary for the performance of our
                  contract with you. This includes processing your orders,
                  managing your subscription, delivering products, processing
                  payments, and providing customer support related to your
                  purchases.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Consent (Article 6(1)(a)):</strong> Where you have
                  given us clear, affirmative consent to process your data for a
                  specific purpose. This applies to marketing communications
                  (where consent is required), the placement of non-essential
                  cookies, and the processing of any special categories of data.
                  You may withdraw your consent at any time without affecting
                  the lawfulness of processing carried out before withdrawal.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Legitimate Interests (Article 6(1)(f)):</strong>{" "}
                  Processing that is necessary for our legitimate interests or
                  those of a third party, provided your fundamental rights and
                  freedoms do not override those interests. Our legitimate
                  interests include improving our products and services,
                  marketing similar products to existing customers (soft
                  opt-in), fraud prevention and security, analysing website
                  usage to improve user experience, and internal business
                  administration.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Legal Obligation (Article 6(1)(c)):</strong>{" "}
                  Processing that is necessary for compliance with a legal
                  obligation to which we are subject, such as maintaining
                  financial records for tax purposes, complying with food safety
                  regulations, or responding to lawful requests from regulatory
                  authorities.
                </li>
              </ul>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                Where we rely on legitimate interests, we have conducted a
                Legitimate Interest Assessment (LIA) to ensure that your rights
                are balanced against our interests. You have the right to object
                to processing based on legitimate interests at any time.
              </p>
            </div>

            {/* 6. Data Sharing & Third Parties */}
            <div className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                6. Data Sharing &amp; Third Parties
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                We do not sell your personal data to any third party. However,
                we do share your information with certain trusted third parties
                who assist us in operating our business and providing our
                services. All third-party processors are bound by contractual
                obligations to keep personal data confidential and to use it
                only for the purposes for which we engage them.
              </p>

              <h3 className="text-deep-green font-rubik font-semibold text-lg mb-3 mt-6">
                Payment Processors
              </h3>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                We share your financial and transaction data with our payment
                processors (including Stripe and PayPal) to process your
                payments securely. These providers are PCI-DSS Level 1
                certified, which is the highest level of security certification
                for handling credit card data. They act as independent data
                controllers for fraud prevention purposes.
              </p>

              <h3 className="text-deep-green font-rubik font-semibold text-lg mb-3 mt-6">
                Delivery and Logistics Partners
              </h3>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                We share your name, delivery address, telephone number, and
                order details with our delivery partners (including Royal Mail,
                DPD, and our dedicated courier network) to fulfil your orders
                and enable you to track your deliveries. These partners only
                use your data for the purpose of delivering your order and are
                contractually obligated to delete it after a specified retention
                period.
              </p>

              <h3 className="text-deep-green font-rubik font-semibold text-lg mb-3 mt-6">
                Analytics and Marketing Partners
              </h3>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                We work with analytics providers such as Google Analytics,
                Hotjar, and Mixpanel to understand how our website is used and
                to improve our services. We also use marketing platforms such as
                Mailchimp for email communications and Meta (Facebook/Instagram)
                and Google Ads for targeted advertising. Where these services
                involve the transfer of personal data, we ensure appropriate
                safeguards are in place (see Section 11).
              </p>

              <h3 className="text-deep-green font-rubik font-semibold text-lg mb-3 mt-6">
                Cloud Infrastructure and Hosting
              </h3>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                Our website and databases are hosted on secure cloud
                infrastructure providers, including Amazon Web Services (AWS)
                and Vercel. Your data is stored on servers located primarily in
                the United Kingdom and the European Economic Area.
              </p>

              <h3 className="text-deep-green font-rubik font-semibold text-lg mb-3 mt-6">
                Other Disclosures
              </h3>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                We may also share your data with professional advisers
                (including lawyers, auditors, and accountants), regulatory
                authorities and government bodies when required by law, and in
                connection with a business transaction such as a merger,
                acquisition, or sale of assets, in which case your personal
                data may be transferred as part of that transaction. We will
                notify you of any such change and ensure your data continues to
                be protected in accordance with this policy.
              </p>
            </div>

            {/* 7. Data Retention */}
            <div className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                7. Data Retention
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                We retain your personal data only for as long as is necessary
                to fulfil the purposes for which it was collected, including to
                satisfy any legal, accounting, or reporting requirements. The
                specific retention periods depend on the type of data and the
                purpose for which it is processed:
              </p>
              <ul className="list-disc list-outside ml-6 mb-4 space-y-2">
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Account Data:</strong> Retained for the duration of
                  your account and for up to 2 years after account closure or
                  your last interaction with us, to allow for reactivation and
                  to resolve any outstanding issues.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Transaction and Order Data:</strong> Retained for 7
                  years from the date of the transaction to comply with UK tax
                  and accounting regulations (as required by HMRC).
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Marketing Preferences:</strong> Retained until you
                  withdraw consent or unsubscribe. We maintain a suppression
                  list indefinitely to ensure we honour your opt-out request.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Pet Profile Data:</strong> Retained for the duration
                  of your account. If you delete your account, your pet profile
                  data will be anonymised and may be retained in aggregate form
                  for research purposes, or deleted entirely upon request.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Customer Support Records:</strong> Retained for up to
                  3 years after the resolution of your enquiry to help us
                  improve our service and resolve any follow-up issues.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Website Analytics Data:</strong> Retained in
                  identifiable form for up to 26 months, after which it is
                  anonymised and retained for trend analysis purposes.
                </li>
              </ul>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                When personal data is no longer required, we will securely
                delete or anonymise it. Anonymised data (from which you can no
                longer be identified) may be retained indefinitely for
                statistical and research purposes.
              </p>
            </div>

            {/* 8. Your Rights (GDPR) */}
            <div className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                8. Your Rights (GDPR)
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                Under data protection law, you have a number of important rights
                in relation to your personal data. These rights are not
                absolute and may be subject to certain conditions and
                exemptions. You can exercise any of these rights free of charge
                by contacting us at privacy@jeko.am.
              </p>
              <ul className="list-disc list-outside ml-6 mb-4 space-y-2">
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Right of Access (Article 15):</strong> You have the
                  right to request a copy of the personal data we hold about
                  you. We will provide this information within one month of
                  receiving your request, along with details of the purposes of
                  processing, the categories of data involved, and the
                  recipients to whom data has been disclosed.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Right to Rectification (Article 16):</strong> You have
                  the right to request that we correct any inaccurate personal
                  data and complete any incomplete personal data. You can also
                  update most of your information directly through your account
                  settings.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Right to Erasure (Article 17):</strong> You have the
                  right to request the deletion of your personal data in certain
                  circumstances, including where the data is no longer needed
                  for its original purpose, where you withdraw consent, or
                  where you object to processing. This right does not apply
                  where we need to retain data for legal compliance.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Right to Restriction of Processing (Article 18):</strong>{" "}
                  You have the right to request that we restrict the processing
                  of your personal data in certain circumstances, such as when
                  you contest the accuracy of your data or when you have
                  objected to processing pending verification of our legitimate
                  grounds.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Right to Data Portability (Article 20):</strong> You
                  have the right to receive the personal data you have provided
                  to us in a structured, commonly used, and machine-readable
                  format (such as CSV or JSON), and to transmit that data to
                  another controller without hindrance.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Right to Object (Article 21):</strong> You have the
                  right to object to the processing of your personal data where
                  we rely on legitimate interests as our legal basis, including
                  profiling based on legitimate interests. You also have an
                  absolute right to object to processing for direct marketing
                  purposes at any time.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Rights Related to Automated Decision-Making (Article 22):</strong>{" "}
                  You have the right not to be subject to a decision based
                  solely on automated processing, including profiling, which
                  produces legal effects or similarly significantly affects you.
                  Our customised meal plan recommendations involve a degree of
                  automated processing, but these do not produce legal effects
                  and you can always contact us for a manual review.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Right to Withdraw Consent:</strong> Where we rely on
                  your consent as the legal basis for processing, you have the
                  right to withdraw that consent at any time. Withdrawal of
                  consent does not affect the lawfulness of processing carried
                  out before the withdrawal.
                </li>
              </ul>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                We will respond to all legitimate requests within one month. If
                your request is particularly complex or you have made multiple
                requests, we may extend this period by a further two months,
                but we will notify you of any extension within the initial
                one-month period. If you are not satisfied with our response,
                you have the right to lodge a complaint with the Information
                Commissioner&apos;s Office (ICO) at ico.org.uk.
              </p>
            </div>

            {/* 9. Cookies & Tracking Technologies */}
            <div className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                9. Cookies &amp; Tracking Technologies
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                Our website uses cookies and similar tracking technologies to
                distinguish you from other users, provide you with a better
                browsing experience, and help us improve our site. A cookie is
                a small file of letters and numbers stored on your browser or
                device.
              </p>

              <h3 className="text-deep-green font-rubik font-semibold text-lg mb-3 mt-6">
                Types of Cookies We Use
              </h3>
              <ul className="list-disc list-outside ml-6 mb-4 space-y-2">
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Strictly Necessary Cookies:</strong> These cookies are
                  essential for the operation of our website. They enable core
                  functionality such as security, network management, and
                  account authentication. You cannot opt out of these cookies as
                  the website cannot function without them.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Performance and Analytics Cookies:</strong> These
                  cookies collect information about how visitors use our
                  website, such as which pages are most frequently visited and
                  whether users receive error messages. We use Google Analytics,
                  which processes data anonymously and in aggregate to help us
                  understand website usage patterns. These cookies do not
                  collect information that directly identifies you.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Functionality Cookies:</strong> These cookies allow
                  our website to remember choices you make (such as your
                  preferred language, region, or the contents of your shopping
                  basket) and provide enhanced, more personalised features.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Targeting and Advertising Cookies:</strong> These
                  cookies are set by our advertising partners (such as Meta and
                  Google) and are used to build a profile of your interests and
                  show you relevant advertisements on other websites. They work
                  by uniquely identifying your browser and device. If you do not
                  allow these cookies, you will not experience our targeted
                  advertising on other platforms.
                </li>
              </ul>

              <h3 className="text-deep-green font-rubik font-semibold text-lg mb-3 mt-6">
                Managing Cookies
              </h3>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                When you first visit our website, you will be presented with a
                cookie consent banner that allows you to accept or reject
                non-essential cookies. You can change your cookie preferences at
                any time through the cookie settings link in our website footer.
                You can also control cookies through your browser settings. Most
                browsers allow you to refuse cookies, delete existing cookies,
                and set preferences for certain websites. Please note that
                disabling cookies may affect the functionality of our website.
              </p>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                We also use local storage and session storage technologies to
                enhance your experience, such as remembering your shopping
                basket contents and your pet profile selections during the
                sign-up process.
              </p>
            </div>

            {/* 10. Children's Privacy */}
            <div className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                10. Children&apos;s Privacy
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                Our website and services are not directed at children under the
                age of 16 (or 13 in jurisdictions where the applicable age of
                digital consent is lower). We do not knowingly collect personal
                data from children under these ages. If we become aware that we
                have inadvertently collected personal data from a child without
                appropriate parental or guardian consent, we will take immediate
                steps to delete that information from our records.
              </p>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                If you are a parent or guardian and believe that your child has
                provided us with personal information without your consent,
                please contact us immediately at privacy@jeko.am and we
                will work promptly to remove the data and close any associated
                account.
              </p>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                While our community features may feature content that is
                family-friendly, the account holder and purchaser must be at
                least 18 years of age or the age of majority in their
                jurisdiction of residence.
              </p>
            </div>

            {/* 11. International Data Transfers */}
            <div className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                11. International Data Transfers
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                Jeko is based in the United Kingdom, and the majority
                of your data is stored and processed within the UK and the
                European Economic Area (EEA). However, some of our third-party
                service providers are based outside the UK and EEA, which means
                your personal data may be transferred to, stored in, or
                processed in countries that may not provide the same level of
                data protection as the UK.
              </p>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                Where we transfer your personal data outside the UK or EEA, we
                ensure that appropriate safeguards are in place to protect your
                data, including:
              </p>
              <ul className="list-disc list-outside ml-6 mb-4 space-y-2">
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Adequacy Decisions:</strong> Transferring data only to
                  countries that the UK Government or European Commission has
                  determined provide an adequate level of data protection (such
                  as countries covered by the EU-US Data Privacy Framework).
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Standard Contractual Clauses (SCCs):</strong> Where no
                  adequacy decision exists, we use the UK International Data
                  Transfer Agreement (IDTA) or the EU Standard Contractual
                  Clauses approved by the European Commission, supplemented by
                  additional technical and organisational measures where
                  necessary.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Transfer Impact Assessments:</strong> We conduct
                  Transfer Impact Assessments to evaluate the legal framework
                  and practices of the destination country and ensure your data
                  will be adequately protected.
                </li>
              </ul>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                You may request a copy of the safeguards we have in place for
                international transfers by contacting us at
                privacy@jeko.am.
              </p>
            </div>

            {/* 12. Security Measures */}
            <div className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                12. Security Measures
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                We take the security of your personal data seriously and have
                implemented appropriate technical and organisational measures to
                protect it against unauthorised access, alteration, disclosure,
                or destruction. Our security measures include:
              </p>
              <ul className="list-disc list-outside ml-6 mb-4 space-y-2">
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Encryption:</strong> All data transmitted between your
                  browser and our servers is encrypted using TLS 1.2 or higher
                  (HTTPS). Sensitive data at rest, including payment information
                  and passwords, is encrypted using industry-standard AES-256
                  encryption.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Access Controls:</strong> Access to personal data
                  within our organisation is restricted to authorised personnel
                  on a need-to-know basis. We use multi-factor authentication,
                  role-based access controls, and regular access reviews to
                  ensure only appropriate individuals can access your data.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Password Security:</strong> All passwords are salted
                  and hashed using bcrypt. We never store passwords in plain
                  text and enforce minimum password complexity requirements for
                  all user accounts.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Infrastructure Security:</strong> Our hosting
                  infrastructure is protected by firewalls, intrusion detection
                  systems, DDoS mitigation, and regular vulnerability scanning.
                  We conduct regular penetration testing and security audits.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Employee Training:</strong> All staff members receive
                  regular data protection and security awareness training. We
                  have strict internal policies governing the handling of
                  personal data.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Incident Response:</strong> We have a comprehensive
                  data breach response plan in place. In the event of a
                  personal data breach that is likely to result in a risk to
                  your rights and freedoms, we will notify the ICO within 72
                  hours and inform you without undue delay where required by
                  law.
                </li>
              </ul>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                While we strive to protect your personal data, no method of
                electronic transmission or storage is completely secure. We
                cannot guarantee absolute security, but we are committed to
                maintaining the highest standards of protection and continuously
                improving our security posture.
              </p>
            </div>

            {/* 13. Changes to This Policy */}
            <div className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                13. Changes to This Policy
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                We may update this Privacy Policy from time to time to reflect
                changes in our practices, technologies, legal requirements, or
                for other operational reasons. When we make changes, we will
                update the &quot;Last updated&quot; date at the top of this
                page.
              </p>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                For significant changes that materially affect how we process
                your personal data or reduce your rights under this policy, we
                will provide prominent notice on our website (such as a banner
                notification) and, where we have your email address, send you a
                direct notification at least 30 days before the changes take
                effect. This includes changes to the categories of data
                collected, new purposes for processing, changes to data sharing
                practices, or changes to your rights.
              </p>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                For minor changes (such as typographical corrections,
                formatting updates, or clarifications that do not materially
                alter the substance of the policy), we will update the policy
                without prior notice. We encourage you to review this Privacy
                Policy periodically to stay informed about how we protect your
                information.
              </p>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                Your continued use of our website and services after any changes
                to this Privacy Policy constitutes your acknowledgement of those
                changes and your agreement to be bound by the updated policy.
              </p>
            </div>

            {/* 14. Contact Us */}
            <div className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                14. Contact Us
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                If you have any questions, concerns, or requests regarding this
                Privacy Policy or our data processing practices, please do not
                hesitate to contact us. We are committed to addressing your
                enquiries promptly and transparently.
              </p>
              <ul className="list-none ml-0 mb-4 space-y-2">
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Data Protection Officer:</strong>{" "}
                  privacy@jeko.am
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>General Enquiries:</strong> hello@jeko.am
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Telephone:</strong> 0800 008 6455
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Postal Address:</strong> Jeko Ltd, Unit 5,
                  Jeko House, Sheffield, S9 1TZ, United Kingdom
                </li>
              </ul>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                We aim to respond to all data protection enquiries within 5
                working days, and to all formal data subject requests within the
                statutory one-month period.
              </p>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                If you are not satisfied with how we have handled your data or
                responded to your request, you have the right to lodge a
                complaint with the UK&apos;s supervisory authority:
              </p>
              <ul className="list-none ml-0 mb-4 space-y-2">
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Information Commissioner&apos;s Office (ICO)</strong>
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  Website: ico.org.uk
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  Telephone: 0303 123 1113
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  Address: Wycliffe House, Water Lane, Wilmslow, Cheshire, SK9
                  5AF
                </li>
              </ul>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                We would appreciate the chance to address your concerns before
                you approach the ICO, so please contact us in the first
                instance.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
