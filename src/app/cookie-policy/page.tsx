"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useT } from "@/lib/i18n/LangProvider";

const cookieTableData = [
  {
    name: "jeko_session",
    purpose: "Maintains your active session while browsing our website so you stay logged in.",
    duration: "Session",
    type: "Essential",
  },
  {
    name: "jeko_cart",
    purpose: "Stores the contents of your shopping cart so items are preserved as you navigate the site.",
    duration: "14 days",
    type: "Essential",
  },
  {
    name: "jeko_auth_token",
    purpose: "Authenticates your identity after login and authorises access to your account area.",
    duration: "30 days",
    type: "Essential",
  },
  {
    name: "jeko_csrf_token",
    purpose: "Protects against cross-site request forgery attacks by validating form submissions.",
    duration: "Session",
    type: "Essential",
  },
  {
    name: "cookie_consent",
    purpose: "Records your cookie consent preferences so we do not ask you again on each visit.",
    duration: "12 months",
    type: "Essential",
  },
  {
    name: "_ga",
    purpose: "Google Analytics cookie used to distinguish unique users and calculate visitor statistics.",
    duration: "2 years",
    type: "Analytics",
  },
  {
    name: "_ga_XXXXXXX",
    purpose: "Google Analytics 4 cookie used to persist session state across page requests.",
    duration: "2 years",
    type: "Analytics",
  },
  {
    name: "_gid",
    purpose: "Google Analytics cookie that identifies unique visitors within a 24-hour window.",
    duration: "24 hours",
    type: "Analytics",
  },
  {
    name: "_gat",
    purpose: "Google Analytics throttling cookie used to limit the rate of data collection requests.",
    duration: "1 minute",
    type: "Analytics",
  },
  {
    name: "_hjSessionUser_{id}",
    purpose: "Hotjar cookie that identifies a visitor across sessions and attributes data to the same profile.",
    duration: "1 year",
    type: "Analytics",
  },
  {
    name: "_hjSession_{id}",
    purpose: "Hotjar cookie that holds session data including the initial timestamp of the current session.",
    duration: "30 minutes",
    type: "Analytics",
  },
  {
    name: "jeko_locale",
    purpose: "Stores your preferred language and regional format settings for a localised experience.",
    duration: "12 months",
    type: "Functionality",
  },
  {
    name: "jeko_location",
    purpose: "Remembers your delivery postcode or region to display accurate shipping and pricing information.",
    duration: "30 days",
    type: "Functionality",
  },
  {
    name: "jeko_recently_viewed",
    purpose: "Tracks products and recipes you have recently viewed to show relevant recommendations.",
    duration: "30 days",
    type: "Functionality",
  },
  {
    name: "jeko_dog_profile",
    purpose: "Stores your dog profile preferences (breed, age, dietary needs) for personalised content.",
    duration: "90 days",
    type: "Functionality",
  },
  {
    name: "_fbp",
    purpose: "Facebook Pixel cookie used to deliver and measure the effectiveness of advertising campaigns.",
    duration: "3 months",
    type: "Targeting",
  },
  {
    name: "_fbc",
    purpose: "Facebook click identifier cookie that stores the last ad click information from Facebook.",
    duration: "3 months",
    type: "Targeting",
  },
  {
    name: "_gcl_au",
    purpose: "Google Ads conversion linker cookie used to attribute conversions to ad interactions.",
    duration: "3 months",
    type: "Targeting",
  },
  {
    name: "_pin_unauth",
    purpose: "Pinterest cookie that groups actions from users who cannot be identified as logged-in Pinterest users.",
    duration: "1 year",
    type: "Targeting",
  },
  {
    name: "IDE",
    purpose: "Google DoubleClick cookie used for retargeting, optimisation, and reporting of ad campaigns.",
    duration: "13 months",
    type: "Targeting",
  },
  {
    name: "NID",
    purpose: "Google cookie that stores preferences and information used to personalise ads on Google properties.",
    duration: "6 months",
    type: "Targeting",
  },
];

function getTypeBadgeClasses(type: string): string {
  switch (type) {
    case "Essential":
      return "bg-deep-green/10 text-deep-green";
    case "Analytics":
      return "bg-blue-100 text-blue-800";
    case "Functionality":
      return "bg-amber-100 text-amber-800";
    case "Targeting":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default function CookiePolicyPage() {
  const { t } = useT();
  return (
    <>
      <Header />
      <main style={{ paddingTop: "80px" }}>
        {/* Hero Section */}
        <section className="bg-deep-green py-16 text-center relative zigzag-bottom">
          <div className="max-w-[900px] mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white font-rubik mb-4">
              {t("policy.cookies.title")}
            </h1>
            <p className="text-white/80 text-lg max-w-[600px] mx-auto leading-relaxed">
              {t("policy.cookies.subtitle")}
            </p>
          </div>
        </section>

        {/* Cookie Policy Content */}
        <section className="bg-off-white">
          <div className="max-w-[900px] mx-auto px-6 py-16">
            <p className="text-deep-green/60 text-sm mb-8">
              Last updated: March 2026
            </p>

            {/* 1. What Are Cookies */}
            <div className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                1. What Are Cookies
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                Cookies are small text files that are placed on your computer,
                smartphone, or other device when you visit a website. They are
                widely used to make websites work more efficiently, provide a
                better browsing experience, and supply information to the owners
                of the site. Each cookie typically contains the name of the
                domain from which it originated, a lifespan (how long it will
                remain on your device), and a value, which is usually a randomly
                generated unique number or string.
              </p>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                Cookies are not programs and cannot carry viruses or install
                malware on your device. They simply allow a website to recognise
                your device and remember certain information about your visit,
                such as your preferred language, the contents of your shopping
                cart, or whether you are logged in to your account.
              </p>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                In addition to cookies, we may also use similar technologies
                such as web beacons (also known as pixel tags or clear GIFs),
                local storage, and session storage. These technologies work in a
                similar way to cookies and help us understand how you interact
                with our website. Throughout this policy, when we refer to
                &quot;cookies,&quot; we include these similar tracking
                technologies unless stated otherwise.
              </p>
            </div>

            {/* 2. How We Use Cookies */}
            <div className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                2. How We Use Cookies
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                At Jeko, we use cookies to ensure our website functions
                correctly and to provide you with the best possible experience
                when browsing our range of natural dog food products. Cookies
                enable us to remember your preferences, keep items in your
                shopping cart between visits, process your orders securely, and
                understand how visitors use our site so we can continually
                improve it.
              </p>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                Specifically, we rely on cookies to: maintain your session while
                you browse; authenticate your identity when you log in to your
                account; store your dog&apos;s personalised meal plan
                preferences; remember your delivery address and postcode;
                protect your account and our forms from cross-site request
                forgery (CSRF) attacks; analyse traffic patterns and site
                performance using tools like Google Analytics and Hotjar; and
                deliver relevant advertising through platforms such as Facebook,
                Google Ads, and Pinterest.
              </p>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                We categorise cookies based on their purpose and have outlined
                each type in detail below. Some cookies are placed by us
                (first-party cookies), while others are set by third-party
                services we use to enhance your experience or measure our
                marketing effectiveness (third-party cookies).
              </p>
            </div>

            {/* 3. Types of Cookies We Use */}
            <div className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                3. Types of Cookies We Use
              </h2>

              {/* Essential */}
              <div className="mb-8">
                <h3 className="text-deep-green font-rubik font-semibold text-xl mb-3">
                  a) Essential / Strictly Necessary Cookies
                </h3>
                <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                  These cookies are fundamental to the operation of our website
                  and cannot be switched off in our systems. They are usually
                  set only in response to actions you take that amount to a
                  request for services, such as setting your privacy
                  preferences, logging in, filling in forms, or adding items to
                  your cart.
                </p>
                <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                  Without these cookies, services you have asked for &mdash;
                  like completing a purchase or accessing your account &mdash;
                  cannot be provided. Essential cookies include your session
                  cookie (<strong>jeko_session</strong>), which keeps you logged
                  in as you navigate between pages; your cart cookie (
                  <strong>jeko_cart</strong>), which retains the items
                  you&apos;ve selected; your authentication token (
                  <strong>jeko_auth_token</strong>), which verifies your
                  identity; and our CSRF protection token (
                  <strong>jeko_csrf_token</strong>), which guards against
                  malicious form submissions. We also store your cookie consent
                  choice in a <strong>cookie_consent</strong> cookie so we
                  respect your preferences on future visits.
                </p>
                <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                  Because these cookies are strictly necessary, they do not
                  require your consent under applicable data protection laws.
                  However, you can still configure your browser to block or
                  delete them, though doing so may prevent parts of the website
                  from functioning correctly.
                </p>
              </div>

              {/* Performance / Analytics */}
              <div className="mb-8">
                <h3 className="text-deep-green font-rubik font-semibold text-xl mb-3">
                  b) Performance / Analytics Cookies
                </h3>
                <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                  Performance cookies help us understand how visitors interact
                  with our website by collecting and reporting information
                  anonymously. This data allows us to identify which pages are
                  most popular, how visitors move through the site, and where
                  users may encounter issues, enabling us to improve the overall
                  experience.
                </p>
                <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                  We use <strong>Google Analytics 4</strong> to track page
                  views, session duration, bounce rates, and the geographic
                  regions of our visitors. Google Analytics sets cookies such as{" "}
                  <strong>_ga</strong>, <strong>_ga_XXXXXXX</strong>,{" "}
                  <strong>_gid</strong>, and <strong>_gat</strong>. The data
                  collected is aggregated and anonymous &mdash; it does not
                  personally identify you. We have enabled IP anonymisation in
                  Google Analytics so your full IP address is never stored.
                </p>
                <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                  We also use <strong>Hotjar</strong> to understand user
                  behaviour through heatmaps, session recordings, and feedback
                  polls. Hotjar cookies (such as{" "}
                  <strong>_hjSessionUser</strong> and{" "}
                  <strong>_hjSession</strong>) help us see which parts of our
                  pages attract the most attention and where users click. Hotjar
                  does not collect personally identifiable information, and all
                  session recordings automatically mask sensitive form fields
                  like payment details.
                </p>
                <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                  Metrics we track include page load times, server response
                  times, JavaScript error rates, and checkout funnel completion
                  rates. This data directly informs our technical improvements
                  and helps us ensure the site remains fast and reliable for
                  every visitor.
                </p>
              </div>

              {/* Functionality */}
              <div className="mb-8">
                <h3 className="text-deep-green font-rubik font-semibold text-xl mb-3">
                  c) Functionality Cookies
                </h3>
                <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                  Functionality cookies allow our website to remember choices
                  you make and provide enhanced, more personalised features.
                  They may be set by us or by third-party providers whose
                  services we have added to our pages.
                </p>
                <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                  For example, the <strong>jeko_locale</strong> cookie remembers
                  your preferred language and regional settings so content is
                  displayed in the correct format each time you return. The{" "}
                  <strong>jeko_location</strong> cookie stores your delivery
                  postcode so we can instantly show you accurate shipping costs
                  and delivery estimates without asking for it repeatedly.
                </p>
                <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                  The <strong>jeko_recently_viewed</strong> cookie keeps track
                  of the products and recipes you have browsed, allowing us to
                  show relevant &quot;recently viewed&quot; suggestions and
                  personalised recommendations. Similarly, the{" "}
                  <strong>jeko_dog_profile</strong> cookie stores your
                  dog&apos;s breed, age, weight, and dietary requirements so
                  that our content and product suggestions are tailored to your
                  pet&apos;s specific needs.
                </p>
                <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                  If you disable functionality cookies, some personalised
                  features may become unavailable, but the core purchasing
                  experience will still work.
                </p>
              </div>

              {/* Targeting / Advertising */}
              <div className="mb-8">
                <h3 className="text-deep-green font-rubik font-semibold text-xl mb-3">
                  d) Targeting / Advertising Cookies
                </h3>
                <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                  Targeting cookies are used to build a profile of your
                  interests and show you relevant advertisements on other
                  websites and social media platforms. They work by uniquely
                  identifying your browser and device, and they may be set by
                  our advertising partners through our site.
                </p>
                <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                  We use <strong>Facebook Pixel</strong> (cookies{" "}
                  <strong>_fbp</strong> and <strong>_fbc</strong>) to measure
                  the effectiveness of our Facebook and Instagram advertising
                  campaigns, retarget visitors who have viewed specific products
                  or started the signup process, and create &quot;lookalike
                  audiences&quot; of people with similar interests to our
                  existing customers.
                </p>
                <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                  <strong>Google Ads</strong> conversion tracking (
                  <strong>_gcl_au</strong>) and <strong>DoubleClick</strong> (
                  <strong>IDE</strong>, <strong>NID</strong>) cookies help us
                  understand which search terms and ad placements drive the most
                  valuable traffic to our site. This enables us to optimise our
                  advertising spend and show you more relevant ads across the
                  Google Display Network.
                </p>
                <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                  We also use <strong>Pinterest Tag</strong> (
                  <strong>_pin_unauth</strong>) to track conversions from
                  Pinterest campaigns and deliver personalised pin
                  recommendations.
                </p>
                <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                  These cookies do not store directly personal information but
                  are based on uniquely identifying your browser and internet
                  device. If you do not allow these cookies, you will still see
                  advertisements, but they will be less relevant to your
                  interests.
                </p>
              </div>
            </div>

            {/* 4. Cookie Table */}
            <div className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                4. Cookies We Set
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-6">
                The following table provides a detailed list of the cookies used
                on the Jeko website, including their name, purpose,
                duration, and category.
              </p>

              {/* Desktop Table */}
              <div className="hidden md:block bg-white rounded-xl shadow-md overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-deep-green text-white">
                      <th className="px-5 py-3 font-rubik font-semibold text-sm">
                        Cookie Name
                      </th>
                      <th className="px-5 py-3 font-rubik font-semibold text-sm">
                        Purpose
                      </th>
                      <th className="px-5 py-3 font-rubik font-semibold text-sm">
                        Duration
                      </th>
                      <th className="px-5 py-3 font-rubik font-semibold text-sm">
                        Type
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {cookieTableData.map((cookie, index) => (
                      <tr
                        key={cookie.name}
                        className={
                          index % 2 === 0 ? "bg-white" : "bg-off-white/50"
                        }
                      >
                        <td className="px-5 py-3 text-deep-green font-mono text-sm font-medium whitespace-nowrap">
                          {cookie.name}
                        </td>
                        <td className="px-5 py-3 text-deep-green/80 text-sm leading-relaxed">
                          {cookie.purpose}
                        </td>
                        <td className="px-5 py-3 text-deep-green/70 text-sm whitespace-nowrap">
                          {cookie.duration}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${getTypeBadgeClasses(cookie.type)}`}
                          >
                            {cookie.type}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {cookieTableData.map((cookie, index) => (
                  <div
                    key={cookie.name}
                    className={`bg-white rounded-lg shadow-sm p-4 ${index % 2 === 0 ? "" : "bg-off-white/30"}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-deep-green font-mono text-sm font-medium">
                        {cookie.name}
                      </span>
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${getTypeBadgeClasses(cookie.type)}`}
                      >
                        {cookie.type}
                      </span>
                    </div>
                    <p className="text-deep-green/80 text-sm leading-relaxed mb-1">
                      {cookie.purpose}
                    </p>
                    <p className="text-deep-green/50 text-xs">
                      Duration: {cookie.duration}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Third-Party Cookies */}
            <div className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                5. Third-Party Cookies
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                In addition to our own cookies, several trusted third-party
                services place cookies on your device when you visit our
                website. These third parties provide services that enhance your
                experience or help us measure and improve our marketing efforts.
                We carefully vet each third-party provider to ensure they
                maintain appropriate data protection standards.
              </p>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                <strong>Google Analytics and Google Ads:</strong> Google LLC
                provides analytics and advertising services. Google Analytics
                cookies collect information about how you use our website, while
                Google Ads cookies track the effectiveness of our advertising
                campaigns. Google processes this data in accordance with its own
                Privacy Policy (
                <a
                  href="https://policies.google.com/privacy"
                  className="text-deep-green underline hover:text-deep-green/60"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  policies.google.com/privacy
                </a>
                ). You can opt out of Google Analytics across all websites by
                installing the{" "}
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  className="text-deep-green underline hover:text-deep-green/60"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Analytics Opt-out Browser Add-on
                </a>
                .
              </p>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                <strong>Facebook (Meta) Pixel:</strong> Meta Platforms, Inc.
                provides the Facebook Pixel, which allows us to measure the
                effectiveness of our advertising on Facebook and Instagram,
                retarget visitors with relevant ads, and build custom audiences.
                Information collected by the pixel is subject to Meta&apos;s
                Data Policy. You can manage your Facebook ad preferences
                through your Facebook account settings or by visiting{" "}
                <a
                  href="https://www.facebook.com/adpreferences"
                  className="text-deep-green underline hover:text-deep-green/60"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  facebook.com/adpreferences
                </a>
                .
              </p>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                <strong>Hotjar:</strong> Hotjar Ltd provides behaviour
                analytics tools including heatmaps, session recordings, and
                surveys. Hotjar cookies help us understand how visitors interact
                with specific pages and identify usability issues. Hotjar does
                not track users across different websites and processes data in
                accordance with its own Privacy Policy. You can opt out of
                Hotjar tracking by visiting{" "}
                <a
                  href="https://www.hotjar.com/legal/compliance/opt-out"
                  className="text-deep-green underline hover:text-deep-green/60"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  hotjar.com/legal/compliance/opt-out
                </a>
                .
              </p>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                <strong>Pinterest Tag:</strong> Pinterest, Inc. provides a
                conversion tracking tag that allows us to measure the
                effectiveness of our Pinterest advertising campaigns and
                deliver more personalised content on Pinterest. You can manage
                your Pinterest privacy settings in your Pinterest account under
                Privacy and data.
              </p>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                <strong>Stripe:</strong> Stripe, Inc. processes payments on our
                website and may set cookies necessary for fraud detection and
                secure payment processing. These cookies are classified as
                strictly necessary and are essential for completing
                transactions. For more information, see{" "}
                <a
                  href="https://stripe.com/privacy"
                  className="text-deep-green underline hover:text-deep-green/60"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Stripe&apos;s Privacy Policy
                </a>
                .
              </p>
            </div>

            {/* 6. Managing Cookies */}
            <div className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                6. Managing Your Cookies
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                You have the right to decide whether to accept or reject
                cookies. When you first visit our website, we present a cookie
                consent banner that allows you to accept all cookies, reject
                non-essential cookies, or customise your preferences by
                category. You can change your consent preferences at any time
                by clicking the &quot;Cookie Settings&quot; link in the footer
                of our website.
              </p>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                You can also control cookies through your browser settings. Most
                browsers allow you to view, manage, and delete cookies. Below
                are instructions for the most common browsers:
              </p>

              <div className="bg-white rounded-xl shadow-sm p-6 mb-4 space-y-4">
                <div>
                  <h4 className="text-deep-green font-rubik font-semibold text-[16px] mb-1">
                    Google Chrome
                  </h4>
                  <p className="text-deep-green/80 text-[15px] leading-relaxed">
                    Go to Settings &gt; Privacy and security &gt; Cookies and
                    other site data. From here you can block third-party
                    cookies, block all cookies, or clear cookies when you close
                    Chrome. You can also view and delete individual cookies by
                    visiting Settings &gt; Privacy and security &gt; Cookies and
                    other site data &gt; See all cookies and site data.
                  </p>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-deep-green font-rubik font-semibold text-[16px] mb-1">
                    Mozilla Firefox
                  </h4>
                  <p className="text-deep-green/80 text-[15px] leading-relaxed">
                    Go to Settings &gt; Privacy &amp; Security. Under Enhanced
                    Tracking Protection, choose Standard, Strict, or Custom to
                    control how cookies are handled. You can also manage
                    exceptions for specific websites and clear cookies under
                    Settings &gt; Privacy &amp; Security &gt; Cookies and Site
                    Data &gt; Manage Data.
                  </p>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-deep-green font-rubik font-semibold text-[16px] mb-1">
                    Safari (macOS and iOS)
                  </h4>
                  <p className="text-deep-green/80 text-[15px] leading-relaxed">
                    On macOS, go to Safari &gt; Settings &gt; Privacy. You can
                    enable &quot;Prevent cross-site tracking&quot; and choose to
                    block all cookies. To manage stored cookies, click
                    &quot;Manage Website Data.&quot; On iOS, go to Settings &gt;
                    Safari &gt; Privacy &amp; Security, where you can toggle
                    &quot;Prevent Cross-Site Tracking&quot; and &quot;Block All
                    Cookies.&quot;
                  </p>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-deep-green font-rubik font-semibold text-[16px] mb-1">
                    Microsoft Edge
                  </h4>
                  <p className="text-deep-green/80 text-[15px] leading-relaxed">
                    Go to Settings &gt; Cookies and site permissions &gt;
                    Manage and delete cookies and site data. You can choose to
                    block third-party cookies, block all cookies, or clear
                    cookies when you close the browser. Edge also provides a
                    tracking prevention feature under Settings &gt; Privacy,
                    search, and services with Basic, Balanced, and Strict
                    levels.
                  </p>
                </div>
              </div>

              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                For other browsers, please consult the browser&apos;s help
                documentation or visit{" "}
                <a
                  href="https://www.allaboutcookies.org/manage-cookies/"
                  className="text-deep-green underline hover:text-deep-green/60"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  www.allaboutcookies.org/manage-cookies
                </a>{" "}
                for general guidance on managing cookies in various browsers.
              </p>
            </div>

            {/* 7. Impact of Disabling Cookies */}
            <div className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                7. Impact of Disabling Cookies
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                You are free to disable cookies at any time, but please be
                aware that doing so may significantly affect your experience on
                our website. If you block or delete essential cookies, you may
                not be able to log in to your account, add items to your
                shopping cart, or complete a purchase. Your personalised meal
                plan settings and dog profile information may also be lost.
              </p>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                If you disable performance and analytics cookies, we will not
                be able to collect data about your visit. This means we may be
                slower to identify and fix technical issues, and our ability to
                optimise the website for a better user experience will be
                limited.
              </p>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                Disabling functionality cookies means the website will not
                remember your preferences such as language, delivery location,
                or recently viewed products. You may need to re-enter this
                information on each visit.
              </p>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                If you block targeting and advertising cookies, you will still
                see online advertisements, but they will be generic rather than
                tailored to your interests. You may also see the same
                advertisement more frequently, as frequency capping relies on
                cookies.
              </p>
            </div>

            {/* 8. Do Not Track Signals */}
            <div className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                8. Do Not Track Signals
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                Some web browsers offer a &quot;Do Not Track&quot; (DNT)
                setting that sends a signal to websites indicating that you do
                not wish to be tracked. There is currently no universally
                accepted standard for how companies should respond to DNT
                signals, and no industry or legal framework has been finalised
                to define what &quot;tracking&quot; means in this context.
              </p>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                At this time, our website does not respond to DNT browser
                signals. However, we respect your privacy choices and encourage
                you to use the cookie management options described in Section 6
                above to control how cookies are used during your visit.
                Additionally, the Global Privacy Control (GPC) signal is
                honoured in jurisdictions where it is legally required. If your
                browser sends a GPC signal, we will treat it as a valid opt-out
                of the sale or sharing of your personal information where
                applicable under law.
              </p>
            </div>

            {/* 9. Updates to This Policy */}
            <div className="mb-12">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                9. Updates to This Policy
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                We may update this Cookie Policy from time to time to reflect
                changes in our practices, the cookies we use, or for legal,
                regulatory, or operational reasons. When we make material
                changes, we will update the &quot;Last updated&quot; date at
                the top of this page and, where appropriate, notify you through
                a prominent notice on our website or via email.
              </p>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                We recommend that you review this Cookie Policy periodically to
                stay informed about how we use cookies and related
                technologies. Your continued use of our website after any
                changes to this policy constitutes your acceptance of the
                updated terms.
              </p>
            </div>

            {/* 10. Contact Us */}
            <div className="mb-4">
              <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">
                10. Contact Us
              </h2>
              <p className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
                If you have any questions about our use of cookies or this
                Cookie Policy, or if you would like to exercise your rights
                regarding your personal data, please do not hesitate to contact
                us:
              </p>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <p className="text-deep-green/80 text-[16px] leading-relaxed mb-2">
                  <strong>Jeko Ltd</strong>
                </p>
                <p className="text-deep-green/80 text-[16px] leading-relaxed mb-2">
                  Unit 1, Riverside Business Park
                  <br />
                  Bakewell Road
                  <br />
                  Loughborough
                  <br />
                  Leicestershire, LE11 5QY
                  <br />
                  United Kingdom
                </p>
                <p className="text-deep-green/80 text-[16px] leading-relaxed mb-2">
                  Email:{" "}
                  <a
                    href="mailto:privacy@jeko.am"
                    className="text-deep-green underline hover:text-deep-green/60"
                  >
                    privacy@jeko.am
                  </a>
                </p>
                <p className="text-deep-green/80 text-[16px] leading-relaxed mb-2">
                  Phone:{" "}
                  <a
                    href="tel:+441011234567"
                    className="text-deep-green underline hover:text-deep-green/60"
                  >
                    +44 (0) 101 123 4567
                  </a>
                </p>
                <p className="text-deep-green/80 text-[16px] leading-relaxed">
                  Data Protection Officer:{" "}
                  <a
                    href="mailto:dpo@jeko.am"
                    className="text-deep-green underline hover:text-deep-green/60"
                  >
                    dpo@jeko.am
                  </a>
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
