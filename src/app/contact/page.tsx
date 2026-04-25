"use client";

import { useState } from "react";
import HyText from "@/components/HyText";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { useSignupUrl } from "@/lib/useSignupUrl";
import { useT } from "@/lib/i18n/LangProvider";

export default function ContactPage() {
  const { t } = useT();
  const signupUrl = useSignupUrl();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    orderNumber: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from("contact_messages")
        .insert({
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone || null,
          subject: formData.subject,
          message: formData.orderNumber
            ? `[Order: ${formData.orderNumber}]\n\n${formData.message}`
            : formData.message,
          status: "new",
        });

      if (insertError) throw insertError;
      setSubmitted(true);
    } catch {
      setError(t("contact.form.error"));
    } finally {
      setSubmitting(false);
    }
  };

  const inputClasses =
    "w-full px-4 py-3 rounded-xl bg-beige-light/50 border-2 border-transparent focus:border-gold focus:outline-none text-deep-green";

  return (
    <div className="min-h-screen flex flex-col bg-off-white">
      <Header />

      <main style={{ paddingTop: "80px" }}>
        {/* Hero Section */}
        <section className="bg-deep-green zigzag-bottom py-16 md:py-20">
          <div className="max-w-[1200px] mx-auto px-6 text-center">
            <h1 className="text-white font-rubik font-bold text-4xl md:text-5xl mb-4">
              {t("contact.page.heading")}
            </h1>
            <p className="text-off-white/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              {t("contact.page.subheading")}
            </p>
          </div>
        </section>

        {/* Contact Content */}
        <section className="bg-off-white py-16 md:py-20">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
              {/* Left Column - Contact Form */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
                  {submitted ? (
                    /* Success State */
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      {/* Checkmark */}
                      <div className="w-20 h-20 rounded-full bg-deep-green flex items-center justify-center mb-6">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="40"
                          height="40"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <h2 className="text-deep-green font-rubik font-bold text-2xl md:text-3xl mb-3">
                        {t("contact.success.heading")}
                      </h2>
                      <p className="text-deep-green/70 text-lg max-w-md">
                        {t("contact.success.body")}
                      </p>
                      <button
                        onClick={() => {
                          setSubmitted(false);
                          setFormData({
                            fullName: "",
                            email: "",
                            phone: "",
                            subject: "",
                            orderNumber: "",
                            message: "",
                          });
                        }}
                        className="mt-8 px-6 py-3 bg-gold text-deep-green font-bold rounded-xl hover:bg-yellow-400 transition-colors"
                      >
                        {t("contact.success.sendAnother")}
                      </button>
                    </div>
                  ) : (
                    /* Form */
                    <>
                      <h2 className="text-deep-green font-rubik font-bold text-2xl md:text-3xl mb-2">
                        {t("contact.form.heading")}
                      </h2>
                      <p className="text-deep-green/60 mb-8">
                        {t("contact.form.subheading")}
                      </p>
                      <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Full Name */}
                        <div>
                          <label
                            htmlFor="fullName"
                            className="block text-deep-green font-semibold text-sm mb-1.5"
                          >
                            {t("contact.form.fullName")} <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            required
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder={t("contact.form.fullNamePlaceholder")}
                            className={inputClasses}
                          />
                        </div>

                        {/* Email */}
                        <div>
                          <label
                            htmlFor="email"
                            className="block text-deep-green font-semibold text-sm mb-1.5"
                          >
                            {t("contact.form.emailLabel")} <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder={t("contact.form.emailPlaceholder")}
                            className={inputClasses}
                          />
                        </div>

                        {/* Phone */}
                        <div>
                          <label
                            htmlFor="phone"
                            className="block text-deep-green font-semibold text-sm mb-1.5"
                          >
                            {t("contact.form.phoneLabel")}{" "}
                            <span className="text-deep-green/40 font-normal">
                              {t("contact.form.phoneOptional")}
                            </span>
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder={t("contact.form.phonePlaceholder")}
                            className={inputClasses}
                          />
                        </div>

                        {/* Subject Dropdown */}
                        <div>
                          <label
                            htmlFor="subject"
                            className="block text-deep-green font-semibold text-sm mb-1.5"
                          >
                            {t("contact.form.subjectLabel")} <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="subject"
                            name="subject"
                            required
                            value={formData.subject}
                            onChange={handleChange}
                            className={`${inputClasses} appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23183D2D%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_12px_center] bg-[length:20px]`}
                          >
                            <option value="" disabled>
                              {t("contact.form.subject.select")}
                            </option>
                            <option value="general">{t("contact.form.subject.general")}</option>
                            <option value="order">{t("contact.form.subject.order")}</option>
                            <option value="subscription">
                              {t("contact.form.subject.subscription")}
                            </option>
                            <option value="product">{t("contact.form.subject.product")}</option>
                            <option value="partnership">
                              {t("contact.form.subject.partnership")}
                            </option>
                            <option value="other">{t("contact.form.subject.other")}</option>
                          </select>
                        </div>

                        {/* Order Number */}
                        <div>
                          <label
                            htmlFor="orderNumber"
                            className="block text-deep-green font-semibold text-sm mb-1.5"
                          >
                            {t("contact.form.orderLabel")}{" "}
                            <span className="text-deep-green/40 font-normal">
                              {t("contact.form.phoneOptional")}
                            </span>
                          </label>
                          <input
                            type="text"
                            id="orderNumber"
                            name="orderNumber"
                            value={formData.orderNumber}
                            onChange={handleChange}
                            placeholder={t("contact.form.orderPlaceholder")}
                            className={inputClasses}
                          />
                        </div>

                        {/* Message */}
                        <div>
                          <label
                            htmlFor="message"
                            className="block text-deep-green font-semibold text-sm mb-1.5"
                          >
                            {t("contact.form.messageLabel")} <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            id="message"
                            name="message"
                            required
                            rows={4}
                            value={formData.message}
                            onChange={handleChange}
                            placeholder={t("contact.form.messagePlaceholder")}
                            className={`${inputClasses} resize-y`}
                          />
                        </div>

                        {error && (
                          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                            {error}
                          </div>
                        )}

                        {/* Submit Button */}
                        <button
                          type="submit"
                          disabled={submitting}
                          className="w-full bg-gold text-deep-green font-bold rounded-xl hover:bg-yellow-400 transition-colors py-3.5 text-lg mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {submitting ? t("contact.form.submitting") : t("contact.form.submitBtn")}
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </div>

              {/* Right Column - Contact Info */}
              <div className="lg:col-span-2 space-y-8">
                {/* Get in Touch */}
                <div>
                  <h2 className="text-deep-green font-rubik font-bold text-2xl md:text-3xl mb-6">
                    {t("contact.info.heading")}
                  </h2>
                  <div className="space-y-5">
                    {/* Email */}
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-deep-green/10 flex items-center justify-center flex-shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#183D2D"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            width="20"
                            height="16"
                            x="2"
                            y="4"
                            rx="2"
                          />
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-deep-green font-semibold text-sm mb-0.5">
                          {t("contact.info.email")}
                        </p>
                        <a
                          href="mailto:hello@jeko.am"
                          className="text-deep-green/70 hover:text-gold transition-colors"
                        >
                          hello@jeko.am
                        </a>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-deep-green/10 flex items-center justify-center flex-shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#183D2D"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-deep-green font-semibold text-sm mb-0.5">
                          {t("contact.info.phone")}
                        </p>
                        <a
                          href="tel:+37410000000"
                          className="text-deep-green/70 hover:text-gold transition-colors"
                        >
                          +374 10 000 000
                        </a>
                      </div>
                    </div>

                    {/* Business Hours */}
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-deep-green/10 flex items-center justify-center flex-shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#183D2D"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-deep-green font-semibold text-sm mb-0.5">
                          {t("contact.info.hours")}
                        </p>
                        <p className="text-deep-green/70 text-sm leading-relaxed">
                          Mon&ndash;Fri: 9am&ndash;5pm
                          <br />
                          Sat: 10am&ndash;2pm
                        </p>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-deep-green/10 flex items-center justify-center flex-shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#183D2D"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-deep-green font-semibold text-sm mb-0.5">
                          {t("contact.info.address")}
                        </p>
                        <p className="text-deep-green/70 text-sm leading-relaxed">
                          Jeko
                          <br />
                          <HyText en="Unit 5, Yorkshire Business Park" />
                          <br />
                          <HyText en="Leeds, LS1 4AP" />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* What to Expect */}
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                  <h3 className="text-deep-green font-rubik font-bold text-xl mb-4">
                    {t("contact.expect.heading")}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-gold mt-2 flex-shrink-0" />
                      <p className="text-deep-green/70 text-sm leading-relaxed">
                        <HyText en="We aim to respond to all enquiries within 24 hours on business days." />
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-gold mt-2 flex-shrink-0" />
                      <p className="text-deep-green/70 text-sm leading-relaxed">
                        <HyText en="For urgent order issues, please include your order number for a faster resolution." />
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-gold mt-2 flex-shrink-0" />
                      <p className="text-deep-green/70 text-sm leading-relaxed">
                        <HyText en="Weekend enquiries will be addressed on the next business day." />
                      </p>
                    </div>
                  </div>
                </div>

                {/* FAQ Callout */}
                <div className="bg-gold/10 border-2 border-gold/30 rounded-2xl p-6 md:p-8">
                  <h3 className="text-deep-green font-rubik font-bold text-xl mb-2">
                    {t("contact.faq.heading")}
                  </h3>
                  <p className="text-deep-green/70 text-sm mb-4 leading-relaxed">
                    {t("contact.faq.body")}
                  </p>
                  <Link
                    href="/benefits"
                    className="inline-flex items-center gap-2 bg-gold text-deep-green font-bold rounded-xl px-5 py-2.5 hover:bg-yellow-400 transition-colors text-sm"
                  >
                    {t("contact.faq.cta")}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Section - Map Placeholder & Helpful Links */}
        <section className="bg-deep-green/5 py-16">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Map Placeholder */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-deep-green/10 h-64 flex flex-col items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#183D2D"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-40 mb-3"
                  >
                    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                    <line x1="9" x2="9" y1="3" y2="18" />
                    <line x1="15" x2="15" y1="6" y2="21" />
                  </svg>
                  <p className="text-deep-green/40 font-semibold text-sm">
                    <HyText en="Yorkshire Business Park, Leeds" />
                  </p>
                  <p className="text-deep-green/30 text-xs mt-1">
                    <HyText en="Yerevan, Armenia" />
                  </p>
                </div>
                <div className="p-5">
                  <h4 className="text-deep-green font-rubik font-bold text-lg mb-1">
                    {t("contact.visit.heading")}
                  </h4>
                  <p className="text-deep-green/60 text-sm">
                    {t("contact.visit.body")}
                  </p>
                </div>
              </div>

              {/* Helpful Links */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h4 className="text-deep-green font-rubik font-bold text-lg mb-6">
                  {t("contact.links.heading")}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link
                    href="/products"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-off-white transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center group-hover:bg-gold/30 transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#183D2D"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m7.5 4.27 9 5.15" />
                        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                        <path d="m3.3 7 8.7 5 8.7-5" />
                        <path d="M12 22V12" />
                      </svg>
                    </div>
                    <span className="text-deep-green font-semibold text-sm">
                      {t("contact.links.products")}
                    </span>
                  </Link>

                  <Link
                    href="/reviews"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-off-white transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center group-hover:bg-gold/30 transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#183D2D"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </div>
                    <span className="text-deep-green font-semibold text-sm">
                      {t("contact.links.reviews")}
                    </span>
                  </Link>

                  <Link
                    href="/about"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-off-white transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center group-hover:bg-gold/30 transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#183D2D"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <span className="text-deep-green font-semibold text-sm">
                      {t("contact.links.about")}
                    </span>
                  </Link>

                  <Link
                    href={signupUrl}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-off-white transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center group-hover:bg-gold/30 transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#183D2D"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                      </svg>
                    </div>
                    <span className="text-deep-green font-semibold text-sm">
                      {t("contact.links.plan")}
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
