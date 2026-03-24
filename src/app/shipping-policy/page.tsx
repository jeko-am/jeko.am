"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

const deliveryOptions = [
  {
    name: "Standard Delivery",
    time: "3-5 business days",
    price: "Free on orders over \u00a325",
    priceSub: "\u00a33.99 for orders under \u00a325",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-deep-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0H21M3.375 14.25h-.375a3 3 0 0 1-3-3V6.75m19.5 0v4.5a3 3 0 0 1-3 3h-.375m-13.5-6h13.5m-13.5 0V3.375c0-.621.504-1.125 1.125-1.125h11.25c.621 0 1.125.504 1.125 1.125V8.25" />
      </svg>
    ),
    highlight: false,
  },
  {
    name: "Express Delivery",
    time: "1-2 business days",
    price: "\u00a34.99",
    priceSub: "On all orders",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-deep-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    highlight: false,
  },
  {
    name: "Next Day Delivery",
    time: "Next working day",
    price: "\u00a36.99",
    priceSub: "Order before 2pm Mon-Fri",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-deep-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
      </svg>
    ),
    highlight: false,
  },
  {
    name: "Subscription Delivery",
    time: "Flexible schedule",
    price: "Always FREE",
    priceSub: "On every delivery, every time",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182M21.015 4.356v4.992" />
      </svg>
    ),
    highlight: true,
  },
];

export default function ShippingPolicyPage() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: "80px" }}>
        {/* ========== Hero Section ========== */}
        <section className="bg-deep-green py-16 pb-20 text-center relative zigzag-bottom">
          <div className="max-w-[900px] mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white font-rubik mb-4">
              Shipping &amp; <span className="text-gold">Delivery Policy</span>
            </h1>
            <p className="text-white/80 text-lg md:text-xl max-w-[650px] mx-auto leading-relaxed">
              Everything you need to know about how we deliver fresh, natural dog food straight to your door across the United Kingdom.
            </p>
          </div>
        </section>

        {/* ========== Main Content ========== */}
        <div className="bg-off-white">
          <div className="max-w-[900px] mx-auto px-6 py-16">

            {/* Last Updated */}
            <p className="text-deep-green/50 text-sm mb-10 font-rubik">
              Last updated: March 2026
            </p>

            {/* ---- 1. Delivery Overview ---- */}
            <section className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                1. Delivery Overview
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                At Pure Pet Food, we are committed to delivering fresh, natural dog food to homes across the United Kingdom. Every order is carefully prepared in our Yorkshire kitchen using real, human-grade ingredients and dispatched to arrive in peak condition at your doorstep.
              </p>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                Whether you are placing a one-off order or receiving regular subscription deliveries, we work with trusted courier partners to ensure your dog&apos;s meals arrive safely, on time, and at the right temperature. Our delivery service covers England, Wales, Scotland, and Northern Ireland, with some variations in timescales and charges depending on your location.
              </p>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                We dispatch orders Monday to Friday (excluding bank holidays). Orders placed over the weekend will be processed on the next available working day to ensure maximum freshness upon arrival.
              </p>
            </section>

            {/* ---- 2. Delivery Options ---- */}
            <section className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                2. Delivery Options
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-6">
                We offer a range of delivery options to suit your schedule and budget. Choose the service that works best for you and your pup:
              </p>

              {/* Delivery Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                {deliveryOptions.map((option) => (
                  <div
                    key={option.name}
                    className={`bg-white rounded-2xl shadow p-6 border-2 transition-shadow hover:shadow-md ${
                      option.highlight
                        ? "border-gold"
                        : "border-transparent"
                    }`}
                  >
                    {option.highlight && (
                      <span className="inline-block bg-gold text-deep-green text-xs font-bold font-rubik uppercase tracking-wide px-3 py-1 rounded-full mb-3">
                        Most Popular
                      </span>
                    )}
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">{option.icon}</div>
                      <div>
                        <h3 className="text-deep-green font-rubik font-bold text-lg mb-1">
                          {option.name}
                        </h3>
                        <p className="text-deep-green/60 text-sm mb-2">{option.time}</p>
                        <p className="text-deep-green font-bold text-xl font-rubik">
                          {option.price}
                        </p>
                        <p className="text-deep-green/50 text-sm">{option.priceSub}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                All delivery timescales quoted above are estimated and commence from the point of dispatch, not from when the order is placed. During peak periods, delivery times may be slightly longer than usual. We will always keep you informed of any delays.
              </p>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                <strong>Please note:</strong> Next Day Delivery is available for orders placed before 2:00pm GMT/BST, Monday to Friday. Orders placed after 2:00pm on Friday will be dispatched the following Monday and delivered on Tuesday.
              </p>
            </section>

            {/* ---- 3. Subscription Deliveries ---- */}
            <section className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                3. Subscription Deliveries
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                Our subscription service is the most convenient and cost-effective way to keep your dog fed with fresh, natural food. When you sign up for a Pure Pet Food plan, your deliveries are completely tailored to your dog&apos;s needs and your household schedule.
              </p>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                <strong>Delivery frequency options:</strong>
              </p>
              <ul className="list-disc list-inside text-deep-green/80 text-[16px] leading-relaxed mb-4 space-y-2 pl-2">
                <li><strong>Every 2 weeks</strong> &mdash; ideal for small dogs or multi-dog households that go through food quickly</li>
                <li><strong>Every 4 weeks</strong> &mdash; our most popular option, perfect for most dogs</li>
                <li><strong>Every 6 weeks</strong> &mdash; great for larger orders or dogs with lower daily intake</li>
                <li><strong>Every 8 weeks</strong> &mdash; maximum flexibility for those who like to stock up</li>
              </ul>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                All subscription deliveries ship completely free of charge, regardless of order value. You will receive a reminder email 3 days before each scheduled delivery so you always know when to expect your next box.
              </p>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                <strong>Pausing and skipping:</strong> Life happens, and we understand that. You can pause your subscription at any time through your online account. Simply log in, navigate to your subscription settings, and choose to skip your next delivery or pause your plan for a set period. You can also adjust your delivery date, change your delivery frequency, or update your delivery address &mdash; all from your account dashboard. There are no penalties or fees for pausing or skipping deliveries.
              </p>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                <strong>Cancelling:</strong> If you wish to cancel your subscription entirely, you can do so at any time via your account or by contacting our customer care team. Any order already dispatched at the time of cancellation will still be delivered.
              </p>
            </section>

            {/* ---- 4. Packaging & Freshness ---- */}
            <section className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                4. Packaging &amp; Freshness
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                We take great care to ensure your dog&apos;s food arrives in perfect condition. Freshness is at the heart of everything we do, and our packaging is designed to protect both your food and the environment.
              </p>
              <div className="bg-white rounded-2xl shadow p-6 mb-6">
                <ul className="space-y-4 text-deep-green/80 text-[16px] leading-relaxed">
                  <li className="flex items-start gap-3">
                    <span className="text-gold text-xl mt-0.5">&#10003;</span>
                    <span><strong>Insulated boxes:</strong> All fresh food orders are packed in thermally insulated boxes to maintain the correct temperature during transit, even in warmer months.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold text-xl mt-0.5">&#10003;</span>
                    <span><strong>Ice packs:</strong> Non-toxic, food-safe ice packs are included with every fresh food delivery to keep meals chilled from our kitchen to your door.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold text-xl mt-0.5">&#10003;</span>
                    <span><strong>Recyclable materials:</strong> Our outer boxes are made from 100% recyclable cardboard. We are continually working to reduce our packaging footprint and move towards fully sustainable materials.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold text-xl mt-0.5">&#10003;</span>
                    <span><strong>Eco-friendly liners:</strong> Our insulated liners are made from recycled materials and can be recycled again after use. Simply separate the components and place them in your household recycling bin.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold text-xl mt-0.5">&#10003;</span>
                    <span><strong>Air-dried food:</strong> Our air-dried recipes are shipped in resealable, lightweight pouches that require no refrigeration, making them convenient to store and easy on the environment.</span>
                  </li>
                </ul>
              </div>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                Upon receiving your order, we recommend placing fresh food in the refrigerator within 2 hours. Unopened pouches of air-dried food can be stored in a cool, dry place for up to 12 months. Please check individual product labels for specific storage instructions.
              </p>
            </section>

            {/* ---- 5. Delivery Areas ---- */}
            <section className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                5. Delivery Areas
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                We currently deliver to addresses throughout the United Kingdom. Below is a summary of our coverage and any applicable surcharges:
              </p>
              <div className="overflow-x-auto mb-6">
                <table className="w-full bg-white rounded-2xl shadow overflow-hidden text-[15px]">
                  <thead>
                    <tr className="bg-deep-green text-white">
                      <th className="text-left px-5 py-3 font-rubik font-semibold">Region</th>
                      <th className="text-left px-5 py-3 font-rubik font-semibold">Availability</th>
                      <th className="text-left px-5 py-3 font-rubik font-semibold">Additional Charges</th>
                    </tr>
                  </thead>
                  <tbody className="text-deep-green/80">
                    <tr className="border-b border-gray-100">
                      <td className="px-5 py-3 font-medium">England &amp; Wales</td>
                      <td className="px-5 py-3">All delivery options</td>
                      <td className="px-5 py-3">None</td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-off-white/50">
                      <td className="px-5 py-3 font-medium">Scottish Mainland</td>
                      <td className="px-5 py-3">All delivery options</td>
                      <td className="px-5 py-3">None</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-5 py-3 font-medium">Scottish Highlands &amp; Islands</td>
                      <td className="px-5 py-3">Standard &amp; Express only</td>
                      <td className="px-5 py-3">&pound;2.99 surcharge</td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-off-white/50">
                      <td className="px-5 py-3 font-medium">Northern Ireland</td>
                      <td className="px-5 py-3">Standard &amp; Express only</td>
                      <td className="px-5 py-3">&pound;3.99 surcharge</td>
                    </tr>
                    <tr>
                      <td className="px-5 py-3 font-medium">Channel Islands &amp; Isle of Man</td>
                      <td className="px-5 py-3">Standard only</td>
                      <td className="px-5 py-3">&pound;4.99 surcharge</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                <strong>International shipping:</strong> Unfortunately, we do not currently offer international delivery. We are a UK-based company and our fresh food is prepared and shipped from our kitchen in Yorkshire. We are actively exploring options to expand our delivery reach in the future, so please check back for updates.
              </p>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                <strong>BFPO addresses:</strong> We are unable to deliver to British Forces Post Office addresses at this time due to the perishable nature of our fresh food products.
              </p>
            </section>

            {/* ---- 6. Tracking Your Order ---- */}
            <section className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                6. Tracking Your Order
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                We believe you should always know exactly where your order is. That is why we provide comprehensive tracking at every stage of the delivery process:
              </p>
              <ul className="list-disc list-inside text-deep-green/80 text-[16px] leading-relaxed mb-4 space-y-2 pl-2">
                <li><strong>Order confirmation:</strong> You will receive an email immediately after placing your order, confirming the details and estimated delivery date.</li>
                <li><strong>Dispatch notification:</strong> Once your order leaves our kitchen, you will receive a dispatch email containing a unique tracking number and a link to track your parcel in real time.</li>
                <li><strong>SMS updates:</strong> If you have provided a mobile number, you will receive text message updates on the day of delivery, including an estimated delivery window.</li>
                <li><strong>Real-time tracking:</strong> Use the tracking link provided in your dispatch email to monitor your delivery in real time via our courier partner&apos;s website or app.</li>
                <li><strong>Delivery confirmation:</strong> You will receive a final notification once your parcel has been successfully delivered, including a photo of where it was left if applicable.</li>
              </ul>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                You can also check the status of your order at any time by logging into your Pure Pet Food account and visiting the &ldquo;My Orders&rdquo; section.
              </p>
            </section>

            {/* ---- 7. Delivery Issues ---- */}
            <section className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                7. Delivery Issues
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                While we strive for a seamless delivery experience every time, we understand that issues can occasionally arise. Here is how we handle common delivery problems:
              </p>

              <h3 className="text-deep-green font-rubik font-semibold text-lg mb-2 mt-6">Missed Delivery</h3>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                If you are not home when our courier attempts delivery, they will leave a card with instructions on how to arrange redelivery or collect your parcel from a local depot. In most cases, the courier will attempt to leave your order in a safe place or with a neighbour (unless you have instructed otherwise). If you have specified safe place instructions in your account, the courier will follow them.
              </p>

              <h3 className="text-deep-green font-rubik font-semibold text-lg mb-2 mt-6">Damaged Goods</h3>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                If your order arrives damaged, please contact our customer care team within 48 hours of delivery. We will ask you to provide photographs of the damage to help us investigate. In the vast majority of cases, we will arrange a full replacement or refund at no additional cost to you. We take damaged deliveries seriously and work closely with our courier partners to prevent recurrence.
              </p>

              <h3 className="text-deep-green font-rubik font-semibold text-lg mb-2 mt-6">Wrong Items</h3>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                If you receive incorrect items, please get in touch with us as soon as possible. We will arrange for the correct items to be sent out to you promptly, and we will cover any costs associated with returning the incorrect items. You are under no obligation to return wrong items &mdash; in many cases, we will simply ask you to donate them to a local animal charity if the food is still sealed and safe.
              </p>

              <h3 className="text-deep-green font-rubik font-semibold text-lg mb-2 mt-6">Late Delivery</h3>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                If your order has not arrived within the expected timeframe, please first check your tracking information for the latest status. Occasionally, delays can occur due to adverse weather conditions, courier operational issues, or high demand periods. If your order is significantly delayed (more than 2 working days beyond the expected delivery date), please contact our team and we will investigate and resolve the issue as quickly as possible. Where a paid delivery service has been significantly delayed, we will refund the delivery charge.
              </p>
            </section>

            {/* ---- 8. Failed Deliveries & Redelivery ---- */}
            <section className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                8. Failed Deliveries &amp; Redelivery
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                If delivery cannot be completed after two attempts, your parcel will be held at the courier&apos;s local depot for up to 7 days. You can arrange collection or redelivery through the courier&apos;s website using the tracking number provided.
              </p>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                If the parcel is not collected within 7 days, it will be returned to us. Please note that due to the perishable nature of our fresh food products, we may not be able to resend returned parcels if they have been out of the cold chain for an extended period. In such cases, we will contact you to arrange a fresh replacement order.
              </p>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                If a delivery fails due to an incorrect or incomplete address provided at checkout, we may need to charge an additional delivery fee for re-dispatch. We strongly recommend double-checking your delivery address before completing your order. You can update your default delivery address at any time via your account settings.
              </p>
            </section>

            {/* ---- 9. Delivery to Alternative Addresses ---- */}
            <section className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                9. Delivery to Alternative Addresses
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                We want to make sure your order reaches you even when you are not available to receive it in person. Here are the options available:
              </p>

              <h3 className="text-deep-green font-rubik font-semibold text-lg mb-2 mt-6">Safe Place Delivery</h3>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                You can nominate a safe place for your delivery to be left if you are not at home. This could be a porch, garage, outbuilding, or any sheltered spot accessible to the courier. Simply add safe place instructions to your delivery preferences in your account settings or at checkout. Please note that once a parcel is left in your nominated safe place, responsibility for the delivery passes to you.
              </p>

              <h3 className="text-deep-green font-rubik font-semibold text-lg mb-2 mt-6">Neighbour Delivery</h3>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                If you are not available, you can authorise the courier to leave your parcel with a neighbour. You can specify a preferred neighbour in your delivery instructions. The courier will leave a notification card to let you know where your parcel has been left. If you would prefer that your parcel is <em>not</em> left with a neighbour, you can indicate this in your delivery preferences.
              </p>

              <h3 className="text-deep-green font-rubik font-semibold text-lg mb-2 mt-6">Alternative Delivery Address</h3>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                You can choose to have your order delivered to a different address, such as your workplace or a family member&apos;s home. Simply update the delivery address at checkout or in your subscription settings. For subscription customers, you can set a permanent alternative address or change the address on a per-delivery basis.
              </p>
            </section>

            {/* ---- 10. Bank Holidays & Peak Periods ---- */}
            <section className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                10. Bank Holidays &amp; Peak Periods
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                Please be aware that our dispatch and delivery schedules are affected by UK bank holidays. We do not dispatch orders on bank holidays, and courier services may also be limited on these days. Orders placed on or just before a bank holiday may experience a delay of 1&ndash;2 additional working days.
              </p>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                During peak periods &mdash; such as the Christmas and New Year season, Easter, and Black Friday/Cyber Monday &mdash; delivery times across all services may be extended due to higher volumes across the courier network. We recommend placing orders a few days earlier than usual during these periods to ensure timely arrival.
              </p>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                For subscription customers, we automatically adjust dispatch dates around bank holidays and peak periods to ensure your delivery arrives as close to your regular schedule as possible. You will be notified by email if there are any changes to your expected delivery date.
              </p>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                <strong>Key dates to be aware of:</strong> Christmas Eve to New Year&apos;s Day (limited courier operations), Easter weekend, early May bank holiday, late May bank holiday, and the August bank holiday.
              </p>
            </section>

            {/* ---- 11. Contact Our Delivery Team ---- */}
            <section className="mb-4">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                11. Contact Our Delivery Team
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                If you have any questions, concerns, or issues regarding your delivery, our friendly customer care team is here to help. You can reach us through any of the following channels:
              </p>
              <div className="bg-white rounded-2xl shadow p-6 mb-6">
                <ul className="space-y-3 text-deep-green/80 text-[16px] leading-relaxed">
                  <li className="flex items-start gap-3">
                    <span className="text-gold font-bold text-lg">&#9993;</span>
                    <span><strong>Email:</strong> delivery@purepetfood.com &mdash; we aim to respond within 24 hours</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold font-bold text-lg">&#9742;</span>
                    <span><strong>Phone:</strong> 0800 083 6696 &mdash; Monday to Friday, 9:00am to 5:30pm GMT</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold font-bold text-lg">&#128172;</span>
                    <span><strong>Live chat:</strong> Available on our website during business hours for instant support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold font-bold text-lg">&#128100;</span>
                    <span><strong>Your account:</strong> Log in and visit &ldquo;Help &amp; Support&rdquo; to raise a delivery enquiry directly</span>
                  </li>
                </ul>
              </div>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                When contacting us about a delivery issue, please have your order number and tracking number to hand so we can assist you as quickly as possible.
              </p>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-8">
                We are passionate about making sure every delivery experience is as smooth as the food inside the box. Thank you for choosing Pure Pet Food &mdash; we are glad to be part of your dog&apos;s journey to better health.
              </p>

              {/* CTA */}
              <div className="text-center">
                <Link
                  href="/signup"
                  className="inline-block bg-gold text-deep-green text-lg font-rubik font-semibold px-8 py-3.5 rounded-lg hover:bg-[#d99500] transition-colors"
                >
                  Create Your Plan Today
                </Link>
              </div>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
