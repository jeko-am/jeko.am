"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RefundPolicyPage() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: "80px" }}>
        {/* Hero Section */}
        <section className="bg-deep-green py-16 text-center relative zigzag-bottom">
          <div className="max-w-[1200px] mx-auto px-6">
            <h1 className="font-rubik text-white text-[38px] md:text-[48px] font-bold leading-[1.15] mb-4">
              Refund &amp; Returns <span className="text-gold">Policy</span>
            </h1>
            <p className="text-white/80 max-w-2xl mx-auto text-lg leading-relaxed">
              We want you and your dog to be completely happy with every order. If
              something isn&apos;t right, we&apos;re here to make it better.
            </p>
          </div>
        </section>

        {/* Policy Content */}
        <section className="bg-off-white">
          <div className="max-w-[900px] mx-auto px-6 py-16">
            {/* Last Updated */}
            <p className="text-deep-green/50 text-sm mb-10">
              Last updated: March 2026
            </p>

            {/* ── 1. Our Satisfaction Guarantee ── */}
            <div className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                1. Our Satisfaction Guarantee
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                At Pure Pet Food, nothing matters more to us than your dog&apos;s
                health and happiness. That&apos;s why every order is backed by our
                <strong> 30-day satisfaction guarantee</strong>. We want your dog
                to love their food just as much as we love making it.
              </p>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                If your dog doesn&apos;t take to their new meals, or if you&apos;re
                not completely satisfied with your purchase for any reason within 30
                days of delivery, get in touch with our friendly customer care team.
                We&apos;ll work with you to find a solution &mdash; whether that&apos;s
                trying a different recipe, adjusting portion sizes, or issuing a
                full refund.
              </p>
              <div className="bg-gold/10 border-l-4 border-gold p-4 rounded mb-4">
                <p className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Our promise:</strong> We believe so strongly in the
                  quality of our food that if your dog doesn&apos;t love it,
                  we&apos;ll refund your first order in full &mdash; no quibbles.
                  We may ask for brief feedback so we can continue improving, but
                  you will never be pressured into keeping a product that isn&apos;t
                  right for your pet.
                </p>
              </div>
            </div>

            {/* ── 2. Eligibility for Returns ── */}
            <div className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                2. Eligibility for Returns
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                We accept returns and issue refunds in the following circumstances:
              </p>

              <h3 className="text-deep-green font-rubik font-semibold text-lg mb-2">
                Eligible for return or refund
              </h3>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Unopened products</strong> returned within 30 days of
                  delivery, in their original sealed packaging and in resaleable
                  condition.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Damaged or defective items</strong> &mdash; products that
                  arrived damaged, spoiled, or with compromised packaging. Please
                  report these within 48 hours of delivery.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Wrong items received</strong> &mdash; if we shipped the
                  incorrect recipe, size, or product, we&apos;ll arrange an
                  immediate replacement or full refund at no cost to you.
                </li>
              </ul>

              <h3 className="text-deep-green font-rubik font-semibold text-lg mb-2">
                Not eligible for return or refund
              </h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Opened food products</strong> &mdash; for hygiene and
                  food safety reasons, we cannot accept returns of food that has
                  been opened, rehydrated, or partially consumed. This is to
                  protect the health of all pets and comply with UK food safety
                  regulations.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Custom meal plans already prepared</strong> &mdash;
                  personalised meal plans that have been portioned and dispatched
                  specifically for your dog cannot be returned, as these are made
                  to order and cannot be resold. However, our satisfaction guarantee
                  still applies to first orders.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Items returned after 30 days</strong> &mdash; products
                  returned outside the 30-day window from the date of delivery.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Non-food accessories</strong> that show signs of use,
                  damage caused by the customer, or missing original packaging.
                </li>
              </ul>
              <div className="bg-gold/10 border-l-4 border-gold p-4 rounded mb-4">
                <p className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Note:</strong> If your dog has an adverse reaction to our
                  food, please contact us immediately regardless of whether the
                  product has been opened. Your pet&apos;s safety is our top
                  priority, and we will always work to resolve these situations
                  promptly.
                </p>
              </div>
            </div>

            {/* ── 3. How to Request a Return ── */}
            <div className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                3. How to Request a Return
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-6">
                To initiate a return or refund, please follow these simple steps:
              </p>

              {/* Step 1 */}
              <div className="flex gap-4 mb-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-deep-green text-white font-rubik font-bold flex items-center justify-center text-lg">
                  1
                </div>
                <div className="bg-white rounded-lg p-5 shadow-sm flex-1">
                  <h4 className="text-deep-green font-rubik font-semibold text-[16px] mb-1">
                    Contact our customer care team
                  </h4>
                  <p className="text-deep-green/80 text-[16px] leading-relaxed">
                    Get in touch by emailing{" "}
                    <a
                      href="mailto:help@purepetfood.com"
                      className="text-gold font-semibold hover:underline"
                    >
                      help@purepetfood.com
                    </a>{" "}
                    or calling us on{" "}
                    <a
                      href="tel:+441011234567"
                      className="text-gold font-semibold hover:underline"
                    >
                      0101 123 4567
                    </a>{" "}
                    (Mon&ndash;Fri, 9am&ndash;5pm GMT). Please have your order
                    number ready.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 mb-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-deep-green text-white font-rubik font-bold flex items-center justify-center text-lg">
                  2
                </div>
                <div className="bg-white rounded-lg p-5 shadow-sm flex-1">
                  <h4 className="text-deep-green font-rubik font-semibold text-[16px] mb-1">
                    Describe the issue
                  </h4>
                  <p className="text-deep-green/80 text-[16px] leading-relaxed">
                    Let us know why you&apos;d like to return or get a refund.
                    Include your order number, the product(s) in question, and the
                    reason for the return. If the product arrived damaged, please
                    include photographs.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4 mb-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-deep-green text-white font-rubik font-bold flex items-center justify-center text-lg">
                  3
                </div>
                <div className="bg-white rounded-lg p-5 shadow-sm flex-1">
                  <h4 className="text-deep-green font-rubik font-semibold text-[16px] mb-1">
                    Receive your return authorisation
                  </h4>
                  <p className="text-deep-green/80 text-[16px] leading-relaxed">
                    Once your return is approved, we&apos;ll email you a Return
                    Merchandise Authorisation (RMA) number along with detailed
                    instructions and, where applicable, a prepaid return shipping
                    label.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4 mb-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-deep-green text-white font-rubik font-bold flex items-center justify-center text-lg">
                  4
                </div>
                <div className="bg-white rounded-lg p-5 shadow-sm flex-1">
                  <h4 className="text-deep-green font-rubik font-semibold text-[16px] mb-1">
                    Post the item back
                  </h4>
                  <p className="text-deep-green/80 text-[16px] leading-relaxed">
                    Package the product securely in its original packaging and send
                    it to the address provided. Write your RMA number clearly on the
                    outside of the parcel. We recommend using a tracked delivery
                    service for your protection.
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-deep-green text-white font-rubik font-bold flex items-center justify-center text-lg">
                  5
                </div>
                <div className="bg-white rounded-lg p-5 shadow-sm flex-1">
                  <h4 className="text-deep-green font-rubik font-semibold text-[16px] mb-1">
                    Refund processed
                  </h4>
                  <p className="text-deep-green/80 text-[16px] leading-relaxed">
                    Once we receive and inspect the returned item, we&apos;ll
                    process your refund. You&apos;ll receive a confirmation email
                    and the funds will be returned to your original payment method
                    within 5&ndash;10 business days.
                  </p>
                </div>
              </div>
            </div>

            {/* ── 4. Refund Process ── */}
            <div className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                4. Refund Process
              </h2>

              <h3 className="text-deep-green font-rubik font-semibold text-lg mb-2">
                Refund timeline
              </h3>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                Once your return has been received at our warehouse and inspected,
                we will process your refund within <strong>2 business days</strong>.
                After processing, please allow <strong>5&ndash;10 business days</strong>{" "}
                for the funds to appear in your account, depending on your bank or
                payment provider. During peak periods (such as the Christmas
                holidays), processing may take slightly longer.
              </p>

              <h3 className="text-deep-green font-rubik font-semibold text-lg mb-2">
                Refund method
              </h3>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                All refunds are issued to your <strong>original payment method</strong>.
                If you paid by credit or debit card, the refund will be credited back
                to that card. If you used PayPal, the refund will be returned to your
                PayPal account. We are unable to issue refunds to a different payment
                method or bank account than the one used for the original purchase.
              </p>

              <h3 className="text-deep-green font-rubik font-semibold text-lg mb-2">
                Partial refunds
              </h3>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                In some cases, a partial refund may be granted. This applies when:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  Only some items in a multi-item order are being returned.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  A product is returned in an acceptable condition but without its
                  original packaging or accessories.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  A promotional discount was applied to the order &mdash; the refund
                  will reflect the actual amount paid after discounts.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  A subscription delivery has been partially consumed before a valid
                  complaint is raised (in which case we will refund the proportional
                  unused value).
                </li>
              </ul>
            </div>

            {/* ── 5. Subscription Cancellations & Refunds ── */}
            <div className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                5. Subscription Cancellations &amp; Refunds
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                We understand that your dog&apos;s needs may change, so you can
                cancel or pause your Pure Pet Food subscription at any time from
                your online account or by contacting our customer care team.
              </p>

              <h3 className="text-deep-green font-rubik font-semibold text-lg mb-2">
                How cancellation works
              </h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  You can cancel your subscription at any time &mdash; there are no
                  fixed-term contracts or cancellation fees.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  To avoid being charged for the next delivery, please cancel at
                  least <strong>3 working days</strong> before your scheduled dispatch
                  date. Your next dispatch date is always visible in your account
                  dashboard.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  Once cancelled, you will continue to receive any orders that have
                  already been dispatched, but no further charges will be taken.
                </li>
              </ul>

              <h3 className="text-deep-green font-rubik font-semibold text-lg mb-2">
                Pro-rata refunds
              </h3>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                If you cancel mid-cycle and a payment has already been taken for a
                delivery that has not yet been dispatched, you will receive a full
                refund for that delivery. If an order is already in transit, we
                cannot issue a refund for that shipment, but your subscription will
                be cancelled immediately to prevent any future charges.
              </p>

              <h3 className="text-deep-green font-rubik font-semibold text-lg mb-2">
                When charges apply
              </h3>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                If your cancellation request is received after your next order has
                already been prepared and dispatched, you will not be eligible for a
                refund on that particular delivery. We encourage all subscribers to
                manage their delivery schedule through their account to avoid
                unwanted charges.
              </p>
              <div className="bg-gold/10 border-l-4 border-gold p-4 rounded mb-4">
                <p className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Tip:</strong> You can pause your subscription for up to 3
                  months instead of cancelling. This is a great option if you&apos;re
                  going on holiday, trying a different food temporarily, or simply
                  have surplus stock. Pause and resume at any time from your account
                  dashboard.
                </p>
              </div>
            </div>

            {/* ── 6. Damaged or Defective Products ── */}
            <div className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                6. Damaged or Defective Products
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                We take great care in packaging and dispatching your order, but
                occasionally items may arrive damaged or defective. If this happens,
                we sincerely apologise and will resolve the issue as quickly as
                possible.
              </p>

              <h3 className="text-deep-green font-rubik font-semibold text-lg mb-2">
                What to do
              </h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  Contact us within <strong>48 hours</strong> of receiving your
                  delivery.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  Provide <strong>photographic evidence</strong> of the damage. This
                  should include clear images of the damaged product, the packaging,
                  and the shipping label. This helps us investigate the issue with
                  our courier partners and improve our packaging.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  Include your order number and a brief description of the issue.
                </li>
              </ul>

              <h3 className="text-deep-green font-rubik font-semibold text-lg mb-2">
                How we resolve it
              </h3>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                For damaged or defective products, we will offer you the choice of
                a <strong>full replacement</strong> dispatched at no charge or a{" "}
                <strong>complete refund</strong>. In most cases involving damaged
                food products, <strong>you will not need to return the item</strong>{" "}
                to us &mdash; please dispose of it safely. For non-food items, we
                may ask you to return the damaged product using a prepaid label we
                provide.
              </p>
              <div className="bg-gold/10 border-l-4 border-gold p-4 rounded mb-4">
                <p className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Important:</strong> Please do not feed damaged or
                  compromised food to your dog. If you suspect your dog has consumed
                  spoiled food and is unwell, contact your vet immediately and let
                  us know so we can assist.
                </p>
              </div>
            </div>

            {/* ── 7. Missing Items ── */}
            <div className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                7. Missing Items
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                If your order arrives with missing items, or if your delivery hasn&apos;t
                arrived at all, please let us know as soon as possible.
              </p>

              <h3 className="text-deep-green font-rubik font-semibold text-lg mb-2">
                What to do
              </h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  Check your order confirmation email to verify which items were
                  included in your shipment.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  For multi-item orders, some items may be dispatched separately.
                  Check your email for any separate tracking notifications.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  If items are confirmed missing, contact us within{" "}
                  <strong>7 days</strong> of your expected delivery date with your
                  order number and details of the missing items.
                </li>
              </ul>

              <h3 className="text-deep-green font-rubik font-semibold text-lg mb-2">
                Our investigation process
              </h3>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                We will investigate the issue with our fulfilment team and courier
                partner. This typically takes <strong>2&ndash;5 business days</strong>.
                During the investigation, we may ask for additional information such
                as photographs of the package received. Once the investigation is
                complete, we will either dispatch the missing items at no charge or
                issue a refund for the missing products.
              </p>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                If your entire delivery is missing and tracking shows it as
                delivered, we will work with the courier to locate the parcel. If
                the parcel cannot be found, we will send a replacement or issue a
                full refund.
              </p>
            </div>

            {/* ── 8. Exchange Policy ── */}
            <div className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                8. Exchange Policy
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                We want to make sure your dog gets exactly the right food for them.
                If you&apos;d like to swap your order for a different recipe or size,
                here&apos;s how exchanges work:
              </p>

              <h3 className="text-deep-green font-rubik font-semibold text-lg mb-2">
                Exchanging for a different recipe
              </h3>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                If your dog isn&apos;t enjoying their current recipe, we can
                exchange unopened products for a different recipe within our range.
                Contact our customer care team and we&apos;ll arrange the exchange,
                including a prepaid return label for the original product. If
                there&apos;s a price difference between the recipes, we&apos;ll
                charge or refund the difference accordingly.
              </p>

              <h3 className="text-deep-green font-rubik font-semibold text-lg mb-2">
                Exchanging for a different size
              </h3>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                Need a larger or smaller pack? We&apos;re happy to exchange
                unopened products for a different pack size. The same process
                applies &mdash; get in touch, return the original with our prepaid
                label, and we&apos;ll send out the correct size. Any price
                difference will be adjusted on your payment method.
              </p>

              <h3 className="text-deep-green font-rubik font-semibold text-lg mb-2">
                Subscription changes
              </h3>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                If you&apos;re a subscriber and want to change your recipe or
                portion size for future deliveries, you can do this directly from
                your account dashboard at any time &mdash; no need to contact us.
                Changes made at least 3 working days before your next dispatch will
                apply to your next delivery.
              </p>
            </div>

            {/* ── 9. Return Shipping ── */}
            <div className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                9. Return Shipping
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                We aim to make the returns process as simple and fair as possible.
                Here&apos;s who covers the cost of return shipping in different
                scenarios:
              </p>

              <div className="overflow-x-auto mb-4">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-deep-green/20">
                      <th className="text-deep-green font-rubik font-semibold text-[15px] py-3 pr-4">
                        Scenario
                      </th>
                      <th className="text-deep-green font-rubik font-semibold text-[15px] py-3">
                        Return shipping paid by
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-deep-green/10">
                      <td className="text-deep-green/80 text-[15px] py-3 pr-4">
                        Damaged or defective product
                      </td>
                      <td className="text-deep-green/80 text-[15px] py-3">
                        Pure Pet Food (prepaid label provided)
                      </td>
                    </tr>
                    <tr className="border-b border-deep-green/10">
                      <td className="text-deep-green/80 text-[15px] py-3 pr-4">
                        Wrong item received
                      </td>
                      <td className="text-deep-green/80 text-[15px] py-3">
                        Pure Pet Food (prepaid label provided)
                      </td>
                    </tr>
                    <tr className="border-b border-deep-green/10">
                      <td className="text-deep-green/80 text-[15px] py-3 pr-4">
                        Exchange for different recipe/size
                      </td>
                      <td className="text-deep-green/80 text-[15px] py-3">
                        Pure Pet Food (prepaid label provided)
                      </td>
                    </tr>
                    <tr className="border-b border-deep-green/10">
                      <td className="text-deep-green/80 text-[15px] py-3 pr-4">
                        Change of mind (unopened, within 30 days)
                      </td>
                      <td className="text-deep-green/80 text-[15px] py-3">
                        Customer
                      </td>
                    </tr>
                    <tr className="border-b border-deep-green/10">
                      <td className="text-deep-green/80 text-[15px] py-3 pr-4">
                        First order satisfaction guarantee
                      </td>
                      <td className="text-deep-green/80 text-[15px] py-3">
                        Pure Pet Food (prepaid label provided)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                Prepaid return labels are sent via email and are valid for 14 days
                from the date of issue. Returns should be posted within this
                timeframe. We recommend keeping your proof of postage until the
                return has been confirmed as received.
              </p>
              <div className="bg-gold/10 border-l-4 border-gold p-4 rounded mb-4">
                <p className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>UK delivery only:</strong> Our return shipping labels are
                  valid for UK mainland addresses. For returns from Northern Ireland,
                  the Channel Islands, or the Scottish Highlands and Islands, please
                  contact us for specific return instructions, as additional shipping
                  arrangements may apply.
                </p>
              </div>
            </div>

            {/* ── 10. Late or Missing Refunds ── */}
            <div className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                10. Late or Missing Refunds
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                If you&apos;ve been told your refund has been processed but
                haven&apos;t yet received it, please try the following steps before
                contacting us:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Check your bank account or card statement again</strong>{" "}
                  &mdash; refunds can sometimes take a few days to appear,
                  especially over weekends or bank holidays. Some banks take up to
                  10 business days to process refunds.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Contact your bank or card issuer</strong> &mdash; there is
                  often a processing period before a refund appears on your
                  statement. Your bank may be able to confirm a pending refund.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Check your PayPal account</strong> &mdash; if you paid via
                  PayPal, log in and check your recent activity. PayPal refunds
                  typically appear within 3&ndash;5 business days.
                </li>
              </ul>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                If you&apos;ve done all of the above and still haven&apos;t
                received your refund after 10 business days from the date we
                confirmed the refund, please get in touch with our customer care
                team. We&apos;ll investigate the matter immediately and ensure your
                refund reaches you.
              </p>
            </div>

            {/* ── 11. Sale Items & Promotional Orders ── */}
            <div className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                11. Sale Items &amp; Promotional Orders
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                Items purchased at a reduced price during sales, promotional events,
                or with a discount code are eligible for returns and refunds under
                the same conditions as full-price items. However, please note:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  Refunds for sale items will be issued at the{" "}
                  <strong>price actually paid</strong>, not the original full price.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  If a discount code was applied to your order, the refund will
                  reflect the discounted amount. The discount code will not be
                  reissued or reinstated.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  Free gifts or bonus items included with promotional orders must be
                  returned alongside the purchased product. If the free item is not
                  returned, its retail value may be deducted from your refund.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  &ldquo;Buy one, get one free&rdquo; or multi-buy offers: if you
                  return one item from a multi-buy deal, the remaining item(s) will
                  be charged at the individual full price, and your refund will be
                  adjusted accordingly.
                </li>
              </ul>
              <div className="bg-gold/10 border-l-4 border-gold p-4 rounded mb-4">
                <p className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Clearance items:</strong> Products marked as
                  &ldquo;final sale&rdquo; or &ldquo;clearance&rdquo; are
                  non-refundable unless they arrive damaged or defective. These items
                  will be clearly marked at the time of purchase.
                </p>
              </div>
            </div>

            {/* ── 12. Gift Orders ── */}
            <div className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                12. Gift Orders
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                We know Pure Pet Food makes a wonderful gift for dog owners. If
                you&apos;ve received a Pure Pet Food product as a gift and need to
                return it, here&apos;s what you need to know:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  If the gift was shipped directly to you: contact us with the order
                  number (the gift-giver can provide this) and we&apos;ll arrange
                  the return. A <strong>store credit</strong> will be issued to you
                  for the value of the returned product.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  If the gift was given to you in person: the original purchaser
                  will need to initiate the return, as the refund must be issued to
                  the original payment method.
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  Gift card purchases are non-refundable but do not expire. Unused
                  gift card balances can be used on any future order.
                </li>
              </ul>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                If you&apos;d like to exchange a gift for a different recipe or
                product, we&apos;re happy to help &mdash; just get in touch and
                we&apos;ll arrange the swap.
              </p>
            </div>

            {/* ── 13. Contact Our Customer Care Team ── */}
            <div className="mb-4">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                13. Contact Our Customer Care Team
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                Our customer care team is based right here in Yorkshire, and
                we&apos;re always happy to help with any questions about returns,
                refunds, or exchanges. No call centres, no robots &mdash; just
                real people who care about your dog.
              </p>

              <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-deep-green font-rubik font-semibold text-[16px] mb-2">
                      Email
                    </h4>
                    <a
                      href="mailto:help@purepetfood.com"
                      className="text-gold font-semibold hover:underline text-[16px]"
                    >
                      help@purepetfood.com
                    </a>
                    <p className="text-deep-green/60 text-sm mt-1">
                      We aim to respond within 24 hours
                    </p>
                  </div>
                  <div>
                    <h4 className="text-deep-green font-rubik font-semibold text-[16px] mb-2">
                      Phone
                    </h4>
                    <a
                      href="tel:+441011234567"
                      className="text-gold font-semibold hover:underline text-[16px]"
                    >
                      0101 123 4567
                    </a>
                    <p className="text-deep-green/60 text-sm mt-1">
                      Mon&ndash;Fri, 9am&ndash;5pm GMT
                    </p>
                  </div>
                  <div>
                    <h4 className="text-deep-green font-rubik font-semibold text-[16px] mb-2">
                      Live Chat
                    </h4>
                    <p className="text-deep-green/80 text-[16px]">
                      Available on our website
                    </p>
                    <p className="text-deep-green/60 text-sm mt-1">
                      Mon&ndash;Fri, 9am&ndash;5pm GMT
                    </p>
                  </div>
                  <div>
                    <h4 className="text-deep-green font-rubik font-semibold text-[16px] mb-2">
                      Post
                    </h4>
                    <p className="text-deep-green/80 text-[16px]">
                      Pure Pet Food Ltd
                      <br />
                      Customer Care Team
                      <br />
                      Yorkshire, United Kingdom
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                When contacting us about a return or refund, please have the
                following information ready to help us resolve your query as
                quickly as possible:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  Your order number (found in your confirmation email or account)
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  The email address used to place the order
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  Which product(s) the query relates to
                </li>
                <li className="text-deep-green/80 text-[16px] leading-relaxed">
                  A description of the issue and any relevant photographs
                </li>
              </ul>

              <div className="bg-gold/10 border-l-4 border-gold p-4 rounded">
                <p className="text-deep-green/80 text-[16px] leading-relaxed">
                  <strong>Your statutory rights:</strong> This refund and returns
                  policy does not affect your statutory rights under UK consumer
                  law, including the Consumer Rights Act 2015. You may have
                  additional rights depending on the circumstances of your
                  purchase.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
