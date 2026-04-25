"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { useT } from "@/lib/i18n/LangProvider";

const articles = [
  {
    title: "5 Signs Your Dog Needs a Diet Change",
    excerpt:
      "From itchy skin to low energy, learn the telltale signs that your dog's current food might not be meeting their needs.",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=400&fit=crop",
    category: "Nutrition",
  },
  {
    title: "The Benefits of Air-Dried Dog Food",
    excerpt:
      "Discover why air-drying is one of the gentlest ways to prepare dog food while locking in maximum nutrition.",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop",
    category: "Food Science",
  },
  {
    title: "How Much Should I Feed My Dog?",
    excerpt:
      "A complete guide to portion sizes based on your dog's breed, age, weight, and activity level.",
    image: "https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?w=600&h=400&fit=crop",
    category: "Feeding Guide",
  },
  {
    title: "Understanding Dog Food Labels",
    excerpt:
      "What do all those ingredients really mean? We break down dog food labels so you can make informed choices.",
    image: "https://images.unsplash.com/photo-1534361960057-19889db9621e?w=600&h=400&fit=crop",
    category: "Education",
  },
  {
    title: "Seasonal Care Tips for Your Dog",
    excerpt:
      "From summer heatwaves to winter walks, how to keep your dog happy and healthy all year round.",
    image: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=600&h=400&fit=crop",
    category: "Wellbeing",
  },
  {
    title: "Transitioning Your Dog to Jeko",
    excerpt:
      "Our step-by-step guide to switching your dog's food gradually for a smooth and stress-free transition.",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=400&fit=crop",
    category: "Getting Started",
  },
];

export default function BeyondTheBowlPage() {
  const { t } = useT();
  return (
    <>
      <Header />
      <main style={{ paddingTop: "80px" }}>
        {/* Hero Section */}
        <section className="bg-deep-green py-16 text-center relative zigzag-bottom">
          <div className="max-w-[1200px] mx-auto px-6">
            <h1 className="font-rubik text-white text-[38px] md:text-[48px] font-bold leading-[1.15] mb-4">
              {t("beyond.page.heading")} <span className="text-gold">{t("beyond.page.headingHighlight")}</span>
            </h1>
            <p className="text-white/80 max-w-2xl mx-auto text-lg leading-relaxed">
              {t("beyond.page.subheading")}
            </p>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="bg-off-white">
          <div className="max-w-[1200px] mx-auto px-6 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <div
                  key={article.title}
                  className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="relative h-[200px]">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <span className="absolute top-3 left-3 bg-deep-green text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {article.category}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-deep-green font-rubik font-bold text-lg mb-2">
                      {article.title}
                    </h3>
                    <p className="text-deep-green/70 text-[15px] leading-relaxed mb-4">
                      {article.excerpt}
                    </p>
                    <span className="text-deep-green font-semibold text-sm hover:underline cursor-pointer">
                      {t("beyond.readMore")} &rarr;
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Newsletter CTA */}
            <div className="mt-16 bg-deep-green rounded-2xl p-10 text-center">
              <h2 className="text-white font-rubik font-bold text-2xl mb-3">
                {t("beyond.newsletter.heading")}
              </h2>
              <p className="text-white/80 max-w-lg mx-auto mb-6">
                {t("beyond.newsletter.body")}
              </p>
              <Link
                href="/products"
                className="inline-block bg-gold text-deep-green font-semibold px-8 py-3 rounded-full hover:bg-gold/90 transition-colors"
              >
                {t("beyond.newsletter.cta")}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
