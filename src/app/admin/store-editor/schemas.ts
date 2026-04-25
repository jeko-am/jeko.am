export type FieldType = 'text' | 'textarea' | 'image' | 'color' | 'url' | 'toggle' | 'number' | 'list' | 'product_picker';

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  /** Static dictionary key for translation fallback when in HY edit mode and no DB override exists. */
  i18nKey?: string;
}

export interface SectionSchema {
  name: string;
  icon: string;
  color: string;
  fields: FieldDef[];
  defaultContent: Record<string, unknown>;
}

export interface PageConfig {
  label: string;
  slug: string;
  previewPath: string;
  indexKey: string; // '_homepage_index' or '_section_index'
  sections: SectionSchema[];
}

/* ═══════════════════════════════════════════════════════════════════════════ */

const ICON_PATHS: Record<string, string> = {
  header: 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5',
  footer: 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5',
  image: 'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M18 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75z',
  banner: 'M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5',
  text: 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12',
  faq: 'M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z',
  video: 'M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z',
  testimonials: 'M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z',
  star: 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z',
  grid: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z',
  chart: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
  table: 'M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M10.875 12c-.621 0-1.125.504-1.125 1.125M12 12c.621 0 1.125.504 1.125 1.125m0 0v1.5c0 .621-.504 1.125-1.125 1.125m0-3.75c-.621 0-1.125.504-1.125 1.125m1.125-1.125c.621 0 1.125.504 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 0c0 .621-.504 1.125-1.125 1.125',
  steps: 'M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125H5.625a1.125 1.125 0 01-1.125-1.125v-1.5c0-.621.504-1.125 1.125-1.125z',
  check: 'M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z',
  dragon: 'M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z',
  heart: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z',
  clock: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z',
  users: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z',
  book: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25',
  code: 'M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5',
};

/* ═══════════════════════════════════════════════════════════════════════════
   HOMEPAGE
   ═══════════════════════════════════════════════════════════════════════════ */

const HOMEPAGE_SECTIONS: SectionSchema[] = [
  {
    name: 'Header', icon: ICON_PATHS.header, color: 'bg-deep-green',
    fields: [
      { key: 'logo_text', label: 'Logo Text', type: 'text', placeholder: 'JEKO' },
      { key: 'cta_text', label: 'CTA Button Text', type: 'text', placeholder: 'Create plan', i18nKey: 'header.cta.buildPlan' },
      { key: 'cta_url', label: 'CTA Button URL', type: 'url', placeholder: '/auth/signup' },
      { key: 'nav_1_label', label: 'Nav Item 1 — Label', type: 'text', placeholder: 'About', i18nKey: 'header.nav.about' },
      { key: 'nav_1_url', label: 'Nav Item 1 — URL', type: 'url', placeholder: '/about' },
      { key: 'nav_2_label', label: 'Nav Item 2 — Label', type: 'text', placeholder: 'Our dog food', i18nKey: 'header.nav.recipes' },
      { key: 'nav_2_url', label: 'Nav Item 2 — URL', type: 'url', placeholder: '/recipes' },
      { key: 'nav_3_label', label: 'Nav Item 3 — Label', type: 'text', placeholder: 'Shop', i18nKey: 'header.nav.shop' },
      { key: 'nav_3_url', label: 'Nav Item 3 — URL', type: 'url', placeholder: '/products' },
      { key: 'nav_4_label', label: 'Nav Item 4 — Label', type: 'text', placeholder: 'Reviews', i18nKey: 'header.nav.reviews' },
      { key: 'nav_4_url', label: 'Nav Item 4 — URL', type: 'url', placeholder: '/reviews' },
      { key: 'nav_5_label', label: 'Nav Item 5 — Label', type: 'text', placeholder: 'Health & breeds', i18nKey: 'header.nav.benefits' },
      { key: 'nav_5_url', label: 'Nav Item 5 — URL', type: 'url', placeholder: '/benefits' },
      { key: 'help_url', label: 'Help Link URL', type: 'url', placeholder: '/help' },
      { key: 'login_url', label: 'Login Link URL', type: 'url', placeholder: '/login' },
    ],
    defaultContent: {
      logo_text: 'JEKO', cta_text: 'Create plan', cta_url: '/auth/signup',
      nav_1_label: 'About', nav_1_url: '/about',
      nav_2_label: 'Our dog food', nav_2_url: '/recipes',
      nav_3_label: 'Shop', nav_3_url: '/products',
      nav_4_label: 'Reviews', nav_4_url: '/reviews',
      nav_5_label: 'Health & breeds', nav_5_url: '/benefits',
      help_url: '/help', login_url: '/login',
    },
  },
  {
    name: 'Hero Section', icon: ICON_PATHS.image, color: 'bg-blue-500',
    fields: [
      { key: 'heading', label: 'Heading', type: 'textarea', placeholder: 'Main headline...', i18nKey: 'home.hero.heading' },
      { key: 'heading_highlight', label: 'Highlighted Text (Gold)', type: 'text', placeholder: 'Text shown in gold...', i18nKey: 'home.hero.headingHighlight' },
      { key: 'subheading', label: 'Subheading', type: 'text', placeholder: 'Supporting text...', i18nKey: 'home.hero.subheading' },
      { key: 'button_text', label: 'Button Text', type: 'text', placeholder: 'Get started today', i18nKey: 'home.hero.buttonText' },
      { key: 'button_url', label: 'Button URL', type: 'url', placeholder: '/auth/signup' },
      { key: 'background_image', label: 'Hero Image', type: 'image' },
      { key: 'trustpilot_label', label: 'Trustpilot Label', type: 'text', placeholder: 'Excellent', i18nKey: 'home.hero.trustpilotLabel' },
      { key: 'trustpilot_score', label: 'Trustpilot Score (e.g. 4.6)', type: 'text', placeholder: '4.6' },
      { key: 'trustpilot_score_text', label: 'Trustpilot Score Text', type: 'text', placeholder: '4.6 out of 5', i18nKey: 'home.hero.trustpilotScoreText' },
    ],
    defaultContent: {
      heading: 'The easiest way to feed healthy,', heading_highlight: 'natural dog food',
      subheading: 'Enjoy fresh food without the fuss, from only 89p a day',
      button_text: 'Get started today', button_url: '/auth/signup', background_image: '',
      trustpilot_label: 'Excellent', trustpilot_score: '4.6', trustpilot_score_text: '4.6 out of 5',
    },
  },
  {
    name: 'Offer Banner', icon: ICON_PATHS.banner, color: 'bg-purple-600',
    fields: [
      { key: 'primary_text', label: 'Primary Offer', type: 'text', placeholder: '25% off your first box', i18nKey: 'home.offer.primaryText' },
      { key: 'secondary_text', label: 'Secondary Offer', type: 'text', placeholder: '10% off your next box', i18nKey: 'home.offer.secondaryText' },
      { key: 'link_url', label: 'Link URL', type: 'url', placeholder: '/auth/signup' },
      { key: 'background_color', label: 'Background Color', type: 'color' },
    ],
    defaultContent: { primary_text: '25% off your first box', secondary_text: '10% off your next box', link_url: '/auth/signup', background_color: '#5F295E' },
  },
  {
    name: 'What is Jeko', icon: ICON_PATHS.check, color: 'bg-emerald-500',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', i18nKey: 'home.whatIs.heading' },
      { key: 'description', label: 'Description', type: 'textarea', i18nKey: 'home.whatIs.description' },
      { key: 'image', label: 'Section Image', type: 'image' },
      { key: 'button_text', label: 'Button Text', type: 'text', placeholder: 'Get started', i18nKey: 'home.whatIs.buttonText' },
      { key: 'button_url', label: 'Button URL', type: 'url', placeholder: '/auth/signup' },
    ],
    defaultContent: {
      heading: 'What is Jeko pet food?',
      description: 'A natural, healthy dog food designed to take the stress out of meal times.\n\nSimply add water and stir to quickly rehydrate the food and create a healthy, nutritious meal your pup will love.',
      image: '', button_text: 'Get started', button_url: '/auth/signup',
    },
  },
  {
    name: 'Benefits Bar', icon: ICON_PATHS.star, color: 'bg-amber-500',
    fields: [
      { key: 'benefit_1', label: 'Benefit 1', type: 'text', i18nKey: 'home.benefits.storeCupboard' },
      { key: 'benefit_2', label: 'Benefit 2', type: 'text', i18nKey: 'home.benefits.from89p' },
      { key: 'benefit_3', label: 'Benefit 3', type: 'text', i18nKey: 'home.benefits.addWater' },
      { key: 'benefit_4', label: 'Benefit 4', type: 'text', i18nKey: 'home.benefits.ready10s' },
      { key: 'background_color', label: 'Background Color', type: 'color' },
    ],
    defaultContent: { benefit_1: 'Store in the cupboard', benefit_2: 'From only 89p per day', benefit_3: 'Just add water and serve', benefit_4: 'Ready in 10 seconds', background_color: '#5F295E' },
  },
  {
    name: 'Product Highlights', icon: ICON_PATHS.grid, color: 'bg-deep-green',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', i18nKey: 'home.productHighlights.heading' },
      { key: 'subheading', label: 'Subheading', type: 'text', i18nKey: 'home.productHighlights.description' },
      { key: 'show_prices', label: 'Show Prices', type: 'toggle' },
    ],
    defaultContent: { heading: 'Handpicked for Your Pup', subheading: 'Fresh, natural ingredients your dog will love.', show_prices: true },
  },
  {
    name: 'Trending Products', icon: ICON_PATHS.grid, color: 'bg-orange-500',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', i18nKey: 'home.trending.heading' },
      { key: 'product_ids', label: 'Featured Products', type: 'product_picker' },
      { key: 'max_products', label: 'Max Products (if none selected above)', type: 'number' },
    ],
    defaultContent: { heading: 'What Pet Parents Love', product_ids: [], max_products: 8 },
  },
  {
    name: 'Video Testimonials', icon: ICON_PATHS.video, color: 'bg-red-500',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', i18nKey: 'home.videos.heading' },
      { key: 'subheading', label: 'Subheading', type: 'text', i18nKey: 'home.videos.subheading' },
      { key: 'video_1_url', label: 'Video 1 URL', type: 'url', placeholder: 'https://example.com/video.mp4' },
      { key: 'video_1_title', label: 'Video 1 Title', type: 'text', i18nKey: 'home.videos.title1' },
      { key: 'video_1_duration', label: 'Video 1 Duration', type: 'text', placeholder: '0:55' },
      { key: 'video_2_url', label: 'Video 2 URL', type: 'url', placeholder: 'https://example.com/video.mp4' },
      { key: 'video_2_title', label: 'Video 2 Title', type: 'text', i18nKey: 'home.videos.title2' },
      { key: 'video_2_duration', label: 'Video 2 Duration', type: 'text', placeholder: '0:38' },
      { key: 'video_3_url', label: 'Video 3 URL', type: 'url', placeholder: 'https://example.com/video.mp4' },
      { key: 'video_3_title', label: 'Video 3 Title', type: 'text', i18nKey: 'home.videos.title3' },
      { key: 'video_3_duration', label: 'Video 3 Duration', type: 'text', placeholder: '0:54' },
      { key: 'video_4_url', label: 'Video 4 URL', type: 'url', placeholder: 'https://example.com/video.mp4' },
      { key: 'video_4_title', label: 'Video 4 Title', type: 'text', i18nKey: 'home.videos.title4' },
      { key: 'video_4_duration', label: 'Video 4 Duration', type: 'text', placeholder: '0:37' },
      { key: 'video_5_url', label: 'Video 5 URL', type: 'url', placeholder: 'https://example.com/video.mp4' },
      { key: 'video_5_title', label: 'Video 5 Title', type: 'text', i18nKey: 'home.videos.title5' },
      { key: 'video_5_duration', label: 'Video 5 Duration', type: 'text', placeholder: '0:38' },
      { key: 'video_6_url', label: 'Video 6 URL', type: 'url', placeholder: 'https://example.com/video.mp4' },
      { key: 'video_6_title', label: 'Video 6 Title', type: 'text', i18nKey: 'home.videos.title6' },
      { key: 'video_6_duration', label: 'Video 6 Duration', type: 'text', placeholder: '0:37' },
    ],
    defaultContent: {
      heading: "Don't just take our word for it",
      subheading: 'Listen to what others have to say about it',
      video_1_url: 'https://pure-website.s3.eu-west-2.amazonaws.com/Product+Benefits+Social+9X16.mp4',
      video_1_title: 'Jeko vs kibble & raw',
      video_1_duration: '0:55',
      video_2_url: 'https://pure-website.s3.eu-west-2.amazonaws.com/Preparing+Pure+9X16.mp4',
      video_2_title: 'Feeding Jeko really is simple!',
      video_2_duration: '0:38',
      video_3_url: 'https://pure-website.s3.eu-west-2.amazonaws.com/Why+Pure+Works+Compressed.mp4',
      video_3_title: "We've done the research",
      video_3_duration: '0:54',
      video_4_url: 'https://pure-website.s3.eu-west-2.amazonaws.com/Ugc+April+Video+-+Why+Pure+Works.mp4',
      video_4_title: 'Fully flexible to work around you',
      video_4_duration: '0:37',
      video_5_url: 'https://pure-website.s3.eu-west-2.amazonaws.com/Fussy+Eater+Ugc(2).mp4',
      video_5_title: 'Rudy goes from fussy to foodie',
      video_5_duration: '0:38',
      video_6_url: 'https://pure-website.s3.eu-west-2.amazonaws.com/Julian+Social+H265.mp4',
      video_6_title: 'Backed by The Yorkshire Vet',
      video_6_duration: '0:37',
    },
  },
  {
    name: 'How It Works', icon: ICON_PATHS.steps, color: 'bg-teal-500',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', i18nKey: 'home.howPlan.heading' },
      { key: 'step_1_title', label: 'Step 1 Title', type: 'text', i18nKey: 'home.howPlan.step1Title' },
      { key: 'step_1_description', label: 'Step 1 Description', type: 'textarea', i18nKey: 'home.howPlan.step1Title' },
      { key: 'step_2_title', label: 'Step 2 Title', type: 'text', i18nKey: 'home.howPlan.step2Title' },
      { key: 'step_2_description', label: 'Step 2 Description', type: 'textarea', i18nKey: 'home.howPlan.step2Title' },
      { key: 'step_3_title', label: 'Step 3 Title', type: 'text', i18nKey: 'home.howPlan.step3Title' },
      { key: 'step_3_description', label: 'Step 3 Description', type: 'textarea', i18nKey: 'home.howPlan.step3Title' },
      { key: 'button_text', label: 'Button Text', type: 'text', placeholder: 'Create a tailored plan today', i18nKey: 'home.howPlan.buttonText' },
      { key: 'button_url', label: 'Button URL', type: 'url', placeholder: '/auth/signup' },
    ],
    defaultContent: {
      heading: 'How does a Jeko plan work?',
      step_1_title: 'Tell us about your dog', step_1_description: 'Tell us about your dog',
      step_2_title: 'Choose your tailored recipes', step_2_description: 'Choose your tailored recipes',
      step_3_title: 'Delivered to your door for free', step_3_description: 'Delivered to your door for free',
      button_text: 'Create a tailored plan today', button_url: '/auth/signup',
    },
  },
  {
    name: 'Stats', icon: ICON_PATHS.chart, color: 'bg-indigo-500',
    fields: [
      { key: 'meals_served', label: 'Meals Served Count', type: 'number' },
      { key: 'stat_1_value', label: 'Stat 1 Value', type: 'text', placeholder: '95%', i18nKey: 'home.stats.stat1Value' },
      { key: 'stat_1_label', label: 'Stat 1 Label', type: 'text', i18nKey: 'home.stats.stat1Label' },
      { key: 'stat_2_value', label: 'Stat 2 Value', type: 'text', placeholder: '93%', i18nKey: 'home.stats.stat2Value' },
      { key: 'stat_2_label', label: 'Stat 2 Label', type: 'text', i18nKey: 'home.stats.stat2Label' },
    ],
    defaultContent: {
      meals_served: 92905251,
      stat_1_value: '94%', stat_1_label: "of customers have seen an improvement in their dog's ailment",
      stat_2_value: '91%', stat_2_label: 'of customers have seen overall health improvements since switching to Jeko',
    },
  },
  {
    name: 'Comparison Table', icon: ICON_PATHS.table, color: 'bg-gray-600',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', i18nKey: 'home.compare.heading' },
      { key: 'col_1_header', label: 'Column 1 Header', type: 'text', placeholder: 'JEKO', i18nKey: 'home.compare.col1' },
      { key: 'col_2_header', label: 'Column 2 Header', type: 'text', placeholder: 'Dry & wet', i18nKey: 'home.compare.col2' },
      { key: 'col_3_header', label: 'Column 3 Header', type: 'text', placeholder: 'Raw & fresh', i18nKey: 'home.compare.col3' },
      { key: 'row_1_label', label: 'Row 1 Label', type: 'text', placeholder: 'Cost', i18nKey: 'home.compare.row1Label' },
      { key: 'row_1_pure', label: 'Row 1 — Jeko value', type: 'text', placeholder: '££', i18nKey: 'home.compare.row1Pure' },
      { key: 'row_1_dry', label: 'Row 1 — Col 2 value', type: 'text', placeholder: '£', i18nKey: 'home.compare.row1Dry' },
      { key: 'row_1_raw', label: 'Row 1 — Col 3 value', type: 'text', placeholder: '£££', i18nKey: 'home.compare.row1Raw' },
      { key: 'row_2_label', label: 'Row 2 Label', type: 'text', placeholder: 'No/low processing', i18nKey: 'home.compare.row.lowProcessing' },
      { key: 'row_2_pure', label: 'Row 2 — Jeko (check)', type: 'toggle' },
      { key: 'row_2_dry', label: 'Row 2 — Col 2 (check)', type: 'toggle' },
      { key: 'row_2_raw', label: 'Row 2 — Col 3 (check)', type: 'toggle' },
      { key: 'row_3_label', label: 'Row 3 Label', type: 'text', placeholder: 'High quality ingredients', i18nKey: 'home.compare.row.highQuality' },
      { key: 'row_3_pure', label: 'Row 3 — Jeko (check)', type: 'toggle' },
      { key: 'row_3_dry', label: 'Row 3 — Col 2 (check)', type: 'toggle' },
      { key: 'row_3_raw', label: 'Row 3 — Col 3 (check)', type: 'toggle' },
      { key: 'row_4_label', label: 'Row 4 Label', type: 'text', placeholder: 'Easy to store', i18nKey: 'home.compare.row.easyStore' },
      { key: 'row_4_pure', label: 'Row 4 — Jeko (check)', type: 'toggle' },
      { key: 'row_4_dry', label: 'Row 4 — Col 2 (check)', type: 'toggle' },
      { key: 'row_4_raw', label: 'Row 4 — Col 3 (check)', type: 'toggle' },
      { key: 'row_5_label', label: 'Row 5 Label', type: 'text', placeholder: 'No risk of harmful pathogens', i18nKey: 'home.compare.row.noPathogens' },
      { key: 'row_5_pure', label: 'Row 5 — Jeko (check)', type: 'toggle' },
      { key: 'row_5_dry', label: 'Row 5 — Col 2 (check)', type: 'toggle' },
      { key: 'row_5_raw', label: 'Row 5 — Col 3 (check)', type: 'toggle' },
      { key: 'background_color', label: 'Background Color', type: 'color' },
    ],
    defaultContent: {
      heading: 'How Jeko compares', col_1_header: 'JEKO', col_2_header: 'Dry & wet', col_3_header: 'Raw & fresh',
      row_1_label: 'Cost', row_1_pure: '££', row_1_dry: '£', row_1_raw: '£££',
      row_2_label: 'No/low processing', row_2_pure: true, row_2_dry: false, row_2_raw: true,
      row_3_label: 'High quality ingredients', row_3_pure: true, row_3_dry: false, row_3_raw: true,
      row_4_label: 'Easy to store', row_4_pure: true, row_4_dry: true, row_4_raw: false,
      row_5_label: 'No risk of harmful pathogens', row_5_pure: true, row_5_dry: true, row_5_raw: false,
      background_color: '#5F295E',
    },
  },
  {
    name: 'Yorkshire Vet', icon: ICON_PATHS.check, color: 'bg-green-600',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', i18nKey: 'home.vet.heading' },
      { key: 'quote', label: 'Testimonial Quote', type: 'textarea', i18nKey: 'home.vet.quoteText' },
      { key: 'author', label: 'Author Name', type: 'text', i18nKey: 'home.vet.authorName' },
      { key: 'image', label: 'Author Image', type: 'image' },
    ],
    defaultContent: { heading: 'Backed by The Yorkshire Vet', quote: "I've been a vet for almost 30 years. Recently I've suggested Jeko for some of my patients, often with great results.", author: 'Julian Norton', image: '' },
  },
  {
    name: 'Dragons Den', icon: ICON_PATHS.dragon, color: 'bg-rose-600',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', i18nKey: 'home.dragons.heading' },
      { key: 'description', label: 'Description', type: 'textarea', i18nKey: 'home.dragons.description' },
      { key: 'image', label: 'Section Image', type: 'image' },
      { key: 'button_text', label: 'Button Text', type: 'text', i18nKey: 'home.faq.getStarted' },
      { key: 'button_url', label: 'Button URL', type: 'url' },
      { key: 'background_color', label: 'Background Color', type: 'color' },
    ],
    defaultContent: { heading: "Dog food so good we ate it on Dragons' Den", description: 'Jeko is complete nutrition from the inside out, and dogs totally love the taste!', image: '', button_text: 'Get started today', button_url: '/auth/signup', background_color: '#274C46' },
  },
  {
    name: 'FAQ', icon: ICON_PATHS.faq, color: 'bg-violet-500',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', i18nKey: 'home.faq.heading' },
      { key: 'subheading', label: 'Subheading', type: 'text', i18nKey: 'home.faq.subheading' },
      { key: 'button_text', label: 'Button Text', type: 'text', placeholder: 'Get started with 25% off', i18nKey: 'home.faq.buttonText' },
      { key: 'button_url', label: 'Button URL', type: 'url', placeholder: '/auth/signup' },
    ],
    defaultContent: { heading: 'Frequently Asked Questions', subheading: 'Everything else you need to know about Jeko', button_text: 'Get started with 25% off', button_url: '/auth/signup' },
  },
  {
    name: 'Footer', icon: ICON_PATHS.footer, color: 'bg-gray-800',
    fields: [
      { key: 'vip_heading', label: 'VIP Section Heading', type: 'text', i18nKey: 'footer.vip.heading' },
      { key: 'vip_description', label: 'VIP Description', type: 'textarea', i18nKey: 'footer.vip.description' },
      { key: 'signup_button_text', label: 'Sign Up Button Text', type: 'text', i18nKey: 'footer.vip.signup' },
      { key: 'social_heading', label: 'Social Section Heading', type: 'text', i18nKey: 'footer.social.heading' },
      { key: 'instagram_url', label: 'Instagram URL', type: 'url' },
      { key: 'facebook_url', label: 'Facebook URL', type: 'url' },
      { key: 'tiktok_url', label: 'TikTok URL', type: 'url' },
      { key: 'col1_heading', label: 'Column 1 Heading', type: 'text', i18nKey: 'footer.col1.heading' },
      { key: 'col2_heading', label: 'Column 2 Heading', type: 'text', i18nKey: 'footer.col2.heading' },
      { key: 'col3_heading', label: 'Column 3 Heading', type: 'text', i18nKey: 'footer.col3.heading' },
      { key: 'copyright_text', label: 'Copyright Text', type: 'text', i18nKey: 'footer.copyrightDefault' },
      { key: 'logo_image', label: 'Footer Logo', type: 'image' },
    ],
    defaultContent: {
      vip_heading: 'Join our VIP list', vip_description: 'Be the first to hear about new product launches.',
      signup_button_text: 'Sign up', social_heading: 'Follow us on social media',
      instagram_url: '#', facebook_url: '#', tiktok_url: '#',
      col1_heading: 'Jeko', col2_heading: 'Help', col3_heading: 'Information',
      copyright_text: '© Jeko Ltd 2020-2026', logo_image: '',
    },
  },
  // ── 15 ── Popup Modal
  {
    name: 'Popup Modal', icon: ICON_PATHS.banner, color: 'bg-pink-500',
    fields: [
      { key: 'enabled', label: 'Enable Popup', type: 'toggle' },
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'image', label: 'Popup Image', type: 'image' },
      { key: 'cta_text', label: 'CTA Button Text', type: 'text' },
      { key: 'cta_url', label: 'CTA Button URL', type: 'url' },
      { key: 'close_text', label: 'Close Button Text', type: 'text' },
      { key: 'community_count_text', label: 'Community Count Text (use {count})', type: 'text', placeholder: 'Join {count}+ pet parents already in our community!' },
    ],
    defaultContent: {
      enabled: true,
      heading: 'Find the Perfect Match',
      description: 'Connect with pet lovers in your area and find the perfect companion for your furry friend.',
      image: '/WhatsApp Image 2026-04-11 at 09.54.12.jpeg',
      cta_text: 'Start Matching',
      cta_url: '/auth/signup',
      close_text: 'Close',
      community_count_text: 'Join {count}+ pet parents already in our community!',
    },
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   ABOUT PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

const ABOUT_SECTIONS: SectionSchema[] = [
  {
    name: 'Hero', icon: ICON_PATHS.image, color: 'bg-blue-500',
    fields: [
      { key: 'hero_image', label: 'Hero Image', type: 'image' },
    ],
    defaultContent: { hero_image: '' },
  },
  {
    name: '2012 — Our Story', icon: ICON_PATHS.book, color: 'bg-amber-600',
    fields: [
      { key: 'year', label: 'Year', type: 'text', placeholder: '2012' },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'content_1', label: 'Paragraph 1 (italic)', type: 'textarea' },
      { key: 'content_2', label: 'Paragraph 2', type: 'textarea' },
    ],
    defaultContent: {
      year: '2012', title: 'It started with a simple question',
      content_1: '"Little brown biscuits – we wouldn\'t eat these for every meal, every day, so why should our pets?"',
      content_2: 'This is the question that led us on a journey to change the face of pet food for the better.',
    },
  },
  {
    name: '2013 — Revelation', icon: ICON_PATHS.book, color: 'bg-amber-600',
    fields: [
      { key: 'year', label: 'Year', type: 'text', placeholder: '2013' },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'title_highlight', label: 'Title Highlight (Gold)', type: 'text' },
      { key: 'content', label: 'Content', type: 'textarea' },
      { key: 'image', label: 'Image', type: 'image' },
    ],
    defaultContent: {
      year: '2013', title: 'A food', title_highlight: 'revelation',
      content: 'Months of research led us to an age-old preservation method of removing the moisture from food.',
      image: '',
    },
  },
  {
    name: '2014 — Milestones', icon: ICON_PATHS.book, color: 'bg-amber-600',
    fields: [
      { key: 'year', label: 'Year', type: 'text', placeholder: '2014' },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'title_highlight', label: 'Title Highlight (Gold)', type: 'text' },
      { key: 'content', label: 'Content', type: 'textarea' },
      { key: 'image', label: 'Image', type: 'image' },
    ],
    defaultContent: {
      year: '2014', title: 'Memorable', title_highlight: 'milestones',
      content: "In 2014, our co-founders entered the Dragons' Den and we were lucky enough to win over two dragons!",
      image: '',
    },
  },
  {
    name: '2017 — Royal Visit', icon: ICON_PATHS.book, color: 'bg-amber-600',
    fields: [
      { key: 'year', label: 'Year', type: 'text', placeholder: '2017' },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'title_highlight', label: 'Title Highlight (Gold)', type: 'text' },
      { key: 'content', label: 'Content', type: 'textarea' },
      { key: 'image', label: 'Image', type: 'image' },
    ],
    defaultContent: {
      year: '2017', title: 'Hosting a', title_highlight: 'royal visit',
      content: 'Her Royal Highness Princess Anne visited us here in West Yorkshire in 2017.',
      image: '',
    },
  },
  {
    name: '2024 — Today', icon: ICON_PATHS.book, color: 'bg-amber-600',
    fields: [
      { key: 'year', label: 'Year', type: 'text', placeholder: '2024' },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'title_highlight', label: 'Title Highlight (Gold)', type: 'text' },
      { key: 'content_1', label: 'Paragraph 1', type: 'textarea' },
      { key: 'content_2', label: 'Paragraph 2', type: 'textarea' },
    ],
    defaultContent: {
      year: '2024', title: 'Where we are', title_highlight: 'today',
      content_1: "We've come a long way from creating recipes in Dan's kitchen.",
      content_2: 'So you could say that in many ways, this is only the beginning!',
    },
  },
  {
    name: 'Stats', icon: ICON_PATHS.chart, color: 'bg-deep-green',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', i18nKey: 'about.stats.heading' },
      { key: 'subtitle', label: 'Subtitle', type: 'text', i18nKey: 'about.stats.subtitle' },
      { key: 'number', label: 'Number', type: 'text', placeholder: '92,871,751' },
      { key: 'description', label: 'Description', type: 'text', i18nKey: 'about.stats.description' },
    ],
    defaultContent: { heading: 'Since 2012', subtitle: "we've delivered", number: '92,871,751', description: 'meals and changed the lives of thousands of pets for the better' },
  },
  {
    name: 'Learn More', icon: ICON_PATHS.text, color: 'bg-emerald-500',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', i18nKey: 'about.learnMore.heading' },
      { key: 'subtitle', label: 'Subtitle (Gold)', type: 'text', i18nKey: 'about.learnMore.subtitle' },
      { key: 'description', label: 'Description', type: 'textarea', i18nKey: 'about.mission.body' },
      { key: 'image', label: 'Image', type: 'image' },
    ],
    defaultContent: { heading: 'Learn more', subtitle: 'about Jeko', description: 'Our dogs are a part of the family, so they deserve the best food.', image: '' },
  },
  {
    name: 'Personalise CTA', icon: ICON_PATHS.heart, color: 'bg-purple-600',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', i18nKey: 'about.personaliseCta.heading' },
      { key: 'subtitle', label: 'Subtitle (Gold)', type: 'text', i18nKey: 'about.personaliseCta.subtitle' },
      { key: 'description', label: 'Description', type: 'textarea', i18nKey: 'about.personaliseCta.description' },
      { key: 'button_text', label: 'Button Text', type: 'text', i18nKey: 'about.personaliseCta.button' },
      { key: 'button_url', label: 'Button URL', type: 'url' },
      { key: 'image', label: 'Image', type: 'image' },
      { key: 'background_color', label: 'Background Color', type: 'color' },
    ],
    defaultContent: { heading: 'Personalise your', subtitle: "dog's food", description: "Proactively invest in your pet's health.", button_text: "Discover your dog's menu", button_url: '/auth/signup', image: '', background_color: '#5F295E' },
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   BENEFITS PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

const BENEFITS_SECTIONS: SectionSchema[] = [
  {
    name: 'Hero', icon: ICON_PATHS.image, color: 'bg-blue-500',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', i18nKey: 'benefits.hero.heading' },
      { key: 'heading_highlight', label: 'Heading Highlight (Gold)', type: 'text', i18nKey: 'benefits.hero.headingHighlight' },
      { key: 'subheading', label: 'Subheading', type: 'text', i18nKey: 'benefits.hero.subheading' },
      { key: 'button_text', label: 'Button Text', type: 'text', i18nKey: 'benefits.hero.button' },
      { key: 'hero_image', label: 'Hero Image', type: 'image' },
    ],
    defaultContent: { heading: 'What are the benefits', heading_highlight: 'to your pet?', subheading: 'Our natural, healthy pet food has led to thousands of success stories.', button_text: 'Create a tailored plan', hero_image: '' },
  },
  {
    name: 'Offer Banner', icon: ICON_PATHS.banner, color: 'bg-orange-500',
    fields: [
      { key: 'primary_text', label: 'Primary Text', type: 'text', i18nKey: 'benefits.offer.primary' },
      { key: 'secondary_text', label: 'Secondary Text', type: 'text', i18nKey: 'benefits.offer.secondary' },
      { key: 'link_url', label: 'Link URL', type: 'url' },
    ],
    defaultContent: { primary_text: '25% off your first box', secondary_text: '10% off your next box', link_url: '/auth/signup' },
  },
  {
    name: 'Jeko Common Sense', icon: ICON_PATHS.text, color: 'bg-emerald-500',
    fields: [
      { key: 'title', label: 'Title', type: 'text', i18nKey: 'benefits.section.commonSense.title' },
      { key: 'text', label: 'Text', type: 'textarea' },
      { key: 'image', label: 'Image', type: 'image' },
    ],
    defaultContent: { title: 'Jeko common sense', text: "We work on facts and common sense over here in Yorkshire.", image: '' },
  },
  {
    name: 'No Hidden Nasties', icon: ICON_PATHS.text, color: 'bg-emerald-500',
    fields: [
      { key: 'title', label: 'Title', type: 'text', i18nKey: 'benefits.section.noNasties.title' },
      { key: 'text', label: 'Text', type: 'textarea' },
      { key: 'image', label: 'Image', type: 'image' },
      { key: 'cta_label', label: 'CTA Label', type: 'text', i18nKey: 'benefits.readFood.cta' },
      { key: 'cta_href', label: 'CTA URL', type: 'url' },
    ],
    defaultContent: { title: 'No hidden nasties', text: "We preserve our high quality natural ingredients by removing the water.", image: '', cta_label: 'Read about our food', cta_href: '/recipes' },
  },
  {
    name: 'Long Healthy Lives', icon: ICON_PATHS.text, color: 'bg-emerald-500',
    fields: [
      { key: 'title', label: 'Title', type: 'text', i18nKey: 'benefits.section.longLives.title' },
      { key: 'text', label: 'Text', type: 'textarea' },
      { key: 'image', label: 'Image', type: 'image' },
    ],
    defaultContent: { title: 'Long healthy lives', text: "Studies have found that puppies fed a processed diet initially appeared to be healthy.", image: '' },
  },
  {
    name: 'Testimonials', icon: ICON_PATHS.testimonials, color: 'bg-deep-green',
    fields: [
      { key: 't1_name', label: 'Testimonial 1 — Name', type: 'text' },
      { key: 't1_quote', label: 'Testimonial 1 — Quote', type: 'textarea' },
      { key: 't1_image', label: 'Testimonial 1 — Image', type: 'image' },
      { key: 't2_name', label: 'Testimonial 2 — Name', type: 'text' },
      { key: 't2_quote', label: 'Testimonial 2 — Quote', type: 'textarea' },
      { key: 't2_image', label: 'Testimonial 2 — Image', type: 'image' },
      { key: 't3_name', label: 'Testimonial 3 — Name', type: 'text' },
      { key: 't3_quote', label: 'Testimonial 3 — Quote', type: 'textarea' },
      { key: 't3_image', label: 'Testimonial 3 — Image', type: 'image' },
    ],
    defaultContent: {
      t1_name: 'Dr Lucy Williamson BVM&S', t1_quote: 'My experience shows that the effects of feeding a highly-processed diet start to show most in later life.', t1_image: '',
      t2_name: 'Lloyd, Peta & Lulu', t2_quote: 'We rescued Lulu, she had a whole host of stomach and digestive issues.', t2_image: '',
      t3_name: 'Sarah, Tim & Biscuit', t3_quote: "We've seen a real difference in our dog's coat and energy levels since switching to Jeko.", t3_image: '',
    },
  },
  {
    name: 'Better Bellies', icon: ICON_PATHS.heart, color: 'bg-amber-500',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', i18nKey: 'benefits.bellies.heading' },
      { key: 'subtitle', label: 'Subtitle', type: 'text', i18nKey: 'benefits.bellies.subtitle' },
      { key: 'description', label: 'Description', type: 'textarea' },
    ],
    defaultContent: { heading: 'Better bellies', subtitle: 'Improved smell', description: "Switching to a highly digestible, high quality food will improve smell and stool consistency." },
  },
  {
    name: 'Combat Obesity', icon: ICON_PATHS.heart, color: 'bg-amber-500',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', i18nKey: 'benefits.obesity.heading' },
      { key: 'text_1', label: 'Paragraph 1', type: 'textarea' },
      { key: 'text_2', label: 'Paragraph 2', type: 'textarea' },
    ],
    defaultContent: { heading: 'Combat obesity', text_1: 'According to the PFMA, 51% of dogs are overweight or obese.', text_2: "Switching to a healthier, natural diet helps maintain a healthy body weight." },
  },
  {
    name: 'Personalise CTA', icon: ICON_PATHS.heart, color: 'bg-purple-600',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', i18nKey: 'benefits.personalise.heading' },
      { key: 'subtitle', label: 'Subtitle (Gold)', type: 'text', i18nKey: 'benefits.personalise.subtitle' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'button_text', label: 'Button Text', type: 'text', i18nKey: 'benefits.personalise.button' },
      { key: 'button_url', label: 'Button URL', type: 'url' },
      { key: 'image', label: 'Image', type: 'image' },
    ],
    defaultContent: { heading: 'Personalise your', subtitle: "dog's food", description: "Proactively invest in your pet's health.", button_text: "Discover your dog's menu", button_url: '/auth/signup', image: '' },
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   RECIPES PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

const RECIPES_SECTIONS: SectionSchema[] = [
  {
    name: 'Hero', icon: ICON_PATHS.image, color: 'bg-blue-500',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', i18nKey: 'recipes.hero.heading' },
      { key: 'heading_highlight', label: 'Heading Highlight (Gold)', type: 'text', i18nKey: 'recipes.hero.headingHighlight' },
      { key: 'subheading', label: 'Subheading', type: 'text', i18nKey: 'recipes.hero.subheading' },
      { key: 'hero_image', label: 'Hero Image', type: 'image' },
    ],
    defaultContent: { heading: 'Real goodness', heading_highlight: 'Real food', subheading: 'After all, your pet should be eating like one of the family too.', hero_image: '' },
  },
  {
    name: 'Offer Banner', icon: ICON_PATHS.banner, color: 'bg-orange-500',
    fields: [
      { key: 'primary_text', label: 'Primary Text', type: 'text', i18nKey: 'home.offer.primaryText' },
      { key: 'secondary_text', label: 'Secondary Text', type: 'text', i18nKey: 'home.offer.secondaryText' },
      { key: 'link_url', label: 'Link URL', type: 'url' },
    ],
    defaultContent: { primary_text: '25% off your first box', secondary_text: '10% off your next box', link_url: '/auth/signup' },
  },
  {
    name: 'Personalised Section', icon: ICON_PATHS.text, color: 'bg-emerald-500',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', i18nKey: 'recipes.personalised.heading' },
      { key: 'subtitle', label: 'Subtitle (Gold)', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea', i18nKey: 'recipes.personalised.subtitle' },
      { key: 'image', label: 'Image', type: 'image' },
    ],
    defaultContent: { heading: 'Personalised', subtitle: 'to your dog', description: "We'll create your dog's tailored menu.", image: '' },
  },
  {
    name: 'Natural Health', icon: ICON_PATHS.heart, color: 'bg-deep-green',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', i18nKey: 'recipes.natural.heading' },
      { key: 'subtitle', label: 'Subtitle (Gold)', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea', i18nKey: 'recipes.natural.subtitle' },
      { key: 'image', label: 'Image', type: 'image' },
    ],
    defaultContent: { heading: 'Natural health', subtitle: 'just add water', description: "Lovingly prepared in Yorkshire.", image: '' },
  },
  {
    name: 'Recipe Grid', icon: ICON_PATHS.grid, color: 'bg-amber-500',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', i18nKey: 'recipes.grid.heading' },
      { key: 'subheading', label: 'Subheading', type: 'text', i18nKey: 'recipes.grid.subheading' },
    ],
    defaultContent: { heading: 'Our drool-worthy menu of recipes', subheading: "We'll tailor your menu specifically to your needs." },
  },
  {
    name: 'Carefully Prepared', icon: ICON_PATHS.text, color: 'bg-deep-green',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', i18nKey: 'recipes.prepared.heading' },
      { key: 'subtitle', label: 'Subtitle (Gold)', type: 'text', i18nKey: 'recipes.prepared.subtitle' },
      { key: 'text_1', label: 'Paragraph 1', type: 'textarea' },
      { key: 'text_2', label: 'Paragraph 2', type: 'textarea' },
      { key: 'image', label: 'Image', type: 'image' },
    ],
    defaultContent: { heading: 'Carefully prepared', subtitle: 'with your dog in mind', text_1: 'We take delicious, natural ingredients.', text_2: 'The nutrients in the food are carefully protected.', image: '' },
  },
  {
    name: 'Dogs Deserve Better', icon: ICON_PATHS.text, color: 'bg-emerald-500',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', i18nKey: 'recipes.deserve.heading' },
      { key: 'description', label: 'Description', type: 'textarea' },
    ],
    defaultContent: { heading: 'Dogs deserve better', description: "Other pet foods contain additives, preservatives and things you just wouldn't want to feed your dog." },
  },
  {
    name: 'Dry Food Q&A', icon: ICON_PATHS.faq, color: 'bg-violet-500',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', i18nKey: 'recipes.dryQa.heading' },
      { key: 'text_1', label: 'Paragraph 1', type: 'textarea' },
      { key: 'text_2', label: 'Paragraph 2', type: 'textarea' },
      { key: 'text_3', label: 'Paragraph 3', type: 'textarea' },
    ],
    defaultContent: { heading: 'What if my dry dog food has good ingredients?', text_1: 'Good ingredients are at the very core of good food.', text_2: 'The ingredients are processed beyond recognition using extrusion.', text_3: 'Our gently air-dried process locks in up to 5x more nutrients.' },
  },
  {
    name: 'Personalise CTA', icon: ICON_PATHS.heart, color: 'bg-purple-600',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', i18nKey: 'recipes.personaliseCta.heading' },
      { key: 'subtitle', label: 'Subtitle (Gold)', type: 'text', i18nKey: 'recipes.personaliseCta.subtitle' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'button_text', label: 'Button Text', type: 'text', i18nKey: 'recipes.personaliseCta.button' },
      { key: 'button_url', label: 'Button URL', type: 'url' },
      { key: 'image', label: 'Image', type: 'image' },
    ],
    defaultContent: { heading: 'Personalise your', subtitle: "dog's food", description: "Proactively invest in your pet's health.", button_text: "Discover your dog's menu", button_url: '/auth/signup', image: '' },
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   REVIEWS PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

const REVIEWS_SECTIONS: SectionSchema[] = [
  {
    name: 'Hero', icon: ICON_PATHS.image, color: 'bg-blue-500',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', i18nKey: 'reviews.hero.heading' },
      { key: 'heading_highlight', label: 'Heading Highlight (Gold)', type: 'text', i18nKey: 'reviews.hero.headingHighlight' },
      { key: 'subheading', label: 'Subheading', type: 'text', i18nKey: 'reviews.hero.subheading' },
      { key: 'button_text', label: 'Button Text', type: 'text', i18nKey: 'reviews.hero.button' },
      { key: 'hero_image', label: 'Hero Image', type: 'image' },
    ],
    defaultContent: { heading: "Pet's lives we've", heading_highlight: 'changed for the better', subheading: "Investing in your pet's diet can have a transformational impact.", button_text: 'Create a tailored plan', hero_image: '' },
  },
  {
    name: 'Offer Banner', icon: ICON_PATHS.banner, color: 'bg-orange-500',
    fields: [
      { key: 'primary_text', label: 'Primary Text', type: 'text', i18nKey: 'home.offer.primaryText' },
      { key: 'secondary_text', label: 'Secondary Text', type: 'text', i18nKey: 'home.offer.secondaryText' },
      { key: 'link_url', label: 'Link URL', type: 'url' },
    ],
    defaultContent: { primary_text: '25% off your first box', secondary_text: '10% off your next box', link_url: '/auth/signup' },
  },
  {
    name: 'Review Cards', icon: ICON_PATHS.star, color: 'bg-amber-500',
    fields: [
      ...Array.from({ length: 9 }, (_, i) => {
        const n = i + 1;
        return [
          { key: `r${n}_name`, label: `Review ${n} — Name`, type: 'text' as const },
          { key: `r${n}_rating`, label: `Review ${n} — Rating (1-5)`, type: 'number' as const },
          { key: `r${n}_title`, label: `Review ${n} — Title`, type: 'text' as const },
          { key: `r${n}_text`, label: `Review ${n} — Text`, type: 'textarea' as const },
        ];
      }).flat(),
    ],
    defaultContent: Object.fromEntries([
      ...Array.from({ length: 9 }, (_, i) => {
        const n = i + 1;
        return [
          [`r${n}_name`, ''], [`r${n}_rating`, 5], [`r${n}_title`, ''], [`r${n}_text`, ''],
        ];
      }).flat(),
    ]),
  },
  {
    name: "Lulu's Story", icon: ICON_PATHS.heart, color: 'bg-emerald-500',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', i18nKey: 'reviews.lulu.heading' },
      { key: 'subtitle', label: 'Subtitle (Gold)', type: 'text', i18nKey: 'reviews.lulu.subtitle' },
      { key: 'text_1', label: 'Paragraph 1', type: 'textarea' },
      { key: 'text_2', label: 'Paragraph 2', type: 'textarea' },
      { key: 'image', label: 'Image', type: 'image' },
      { key: 'video_url', label: 'Video URL (optional — shows play button)', type: 'url' },
    ],
    defaultContent: { heading: 'Lulu is now', subtitle: 'a different dog', text_1: 'We rescued Lulu from the Pro Dogs Direct charity.', text_2: "Within just 2 days her issues had eased.", image: '', video_url: '' },
  },
  {
    name: 'Backed by Vets', icon: ICON_PATHS.check, color: 'bg-deep-green',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', i18nKey: 'reviews.vets.heading' },
      { key: 'subtitle', label: 'Subtitle (Gold)', type: 'text', i18nKey: 'reviews.vets.subtitle' },
      { key: 'vet_1_name', label: 'Vet 1 — Name', type: 'text' },
      { key: 'vet_1_quote', label: 'Vet 1 — Quote', type: 'textarea' },
      { key: 'vet_1_image', label: 'Vet 1 — Image', type: 'image' },
      { key: 'vet_2_name', label: 'Vet 2 — Name', type: 'text' },
      { key: 'vet_2_quote', label: 'Vet 2 — Quote', type: 'textarea' },
      { key: 'vet_2_image', label: 'Vet 2 — Image', type: 'image' },
    ],
    defaultContent: {
      heading: 'Backed by vets', subtitle: 'Formulated by nutritionists',
      vet_1_name: 'Dr Julian Norton MA VetMB GPcertSAP MRCVS', vet_1_quote: "I've been a vet for over 30 years.", vet_1_image: '',
      vet_2_name: 'Dr Brendan Clark MRCVS', vet_2_quote: 'What is often not considered is how the food is processed.', vet_2_image: '',
    },
  },
  {
    name: 'Nelly & Polly', icon: ICON_PATHS.heart, color: 'bg-emerald-500',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', i18nKey: 'reviews.nellyPolly.heading' },
      { key: 'text_1', label: 'Paragraph 1', type: 'textarea' },
      { key: 'text_2', label: 'Paragraph 2', type: 'textarea' },
      { key: 'text_3', label: 'Paragraph 3', type: 'textarea' },
      { key: 'image', label: 'Image', type: 'image' },
      { key: 'video_url', label: 'Video URL (optional — shows play button)', type: 'url' },
    ],
    defaultContent: { heading: 'Meet Nelly & Polly', text_1: 'I rescued Nelly two years ago. She came to me with alopecia.', text_2: "I couldn't even stroke her.", text_3: 'We switched from brown biscuits to Jeko.', image: '', video_url: '' },
  },
  {
    name: "We've Helped 1000s", icon: ICON_PATHS.users, color: 'bg-amber-500',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', i18nKey: 'reviews.helped.heading' },
      { key: 'subtitle', label: 'Subtitle (Gold)', type: 'text', i18nKey: 'reviews.helped.subtitle' },
      { key: 'categories', label: 'Category Tags (comma-separated)', type: 'textarea', placeholder: 'Fussy dogs, Colitis, Pancreatitis, ...' },
      ...Array.from({ length: 4 }, (_, i) => {
        const n = i + 1;
        return [
          { key: `t${n}_name`, label: `Testimonial ${n} — Name`, type: 'text' as const },
          { key: `t${n}_text`, label: `Testimonial ${n} — Text`, type: 'textarea' as const },
          { key: `t${n}_image`, label: `Testimonial ${n} — Image`, type: 'image' as const },
        ];
      }).flat(),
    ],
    defaultContent: {
      heading: "We've helped", subtitle: "1000's of dogs",
      categories: 'Fussy dogs,Anal gland problems,Colitis,Happy healthy dogs,Pancreatitis,Oral health,Sensitive skin,Sensitive stomach,Kidney disease,Arthritis,Tear stains,Weight management',
      t1_name: '', t1_text: '', t1_image: '',
      t2_name: '', t2_text: '', t2_image: '',
      t3_name: '', t3_text: '', t3_image: '',
      t4_name: '', t4_text: '', t4_image: '',
    },
  },
  {
    name: "Diesel's Story", icon: ICON_PATHS.heart, color: 'bg-deep-green',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', i18nKey: 'reviews.diesel.heading' },
      { key: 'text_1', label: 'Paragraph 1', type: 'textarea' },
      { key: 'text_2', label: 'Paragraph 2', type: 'textarea' },
      { key: 'image', label: 'Image', type: 'image' },
      { key: 'video_url', label: 'Video URL (optional — shows play button)', type: 'url' },
    ],
    defaultContent: { heading: "Diesel's much healthier", text_1: 'For the first two years, he was a happy and healthy pup.', text_2: 'We switched to Jeko as it\'s nutritious.', image: '', video_url: '' },
  },
  {
    name: 'Stats', icon: ICON_PATHS.chart, color: 'bg-indigo-500',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', i18nKey: 'reviews.stats.heading' },
      { key: 'number', label: 'Meals Number', type: 'text', placeholder: '92,871,751' },
      { key: 'description', label: 'Description', type: 'text', i18nKey: 'reviews.stats.description' },
      { key: 'stat_1_value', label: 'Stat 1 Value', type: 'text', placeholder: '94%', i18nKey: 'home.stats.stat1Value' },
      { key: 'stat_1_label', label: 'Stat 1 Label', type: 'text', i18nKey: 'home.stats.stat1Label' },
      { key: 'stat_2_value', label: 'Stat 2 Value', type: 'text', placeholder: '91%', i18nKey: 'home.stats.stat2Value' },
      { key: 'stat_2_label', label: 'Stat 2 Label', type: 'text', i18nKey: 'home.stats.stat2Label' },
    ],
    defaultContent: {
      heading: "We've delivered", number: '92,871,751', description: 'meals and changed the lives of thousands of pets',
      stat_1_value: '94%', stat_1_label: "of customers have seen an improvement in their dog's ailment",
      stat_2_value: '91%', stat_2_label: 'of customers have seen overall health improvements',
    },
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   SIGNUP PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

const SIGNUP_SECTIONS: SectionSchema[] = [
  {
    name: 'Header', icon: ICON_PATHS.header, color: 'bg-deep-green',
    fields: [
      { key: 'offer_text', label: 'Offer Badge Text', type: 'text' },
    ],
    defaultContent: { offer_text: '25% off your first box + 10% off your next box' },
  },
  {
    name: 'Main Content', icon: ICON_PATHS.text, color: 'bg-blue-500',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'text' },
      { key: 'label', label: 'Input Label', type: 'text' },
      { key: 'add_more_text', label: 'Add More Dogs Text', type: 'text' },
      { key: 'button_text', label: 'Button Text', type: 'text' },
    ],
    defaultContent: { heading: "Let's get started", subtitle: 'It only takes 2-3 minutes', label: "What's your dogs name?", add_more_text: 'You can add more dogs\nlater if you need to', button_text: 'Continue' },
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   MATCHING PREFERENCES CONFIG
   ═══════════════════════════════════════════════════════════════════════════ */

const PREFERENCES_CONFIG_SECTIONS: SectionSchema[] = [
  {
    name: 'Temperament Options', icon: ICON_PATHS.star, color: 'bg-purple-500',
    fields: [
      { key: 'options', label: 'Options', type: 'list', placeholder: 'Add a temperament option…' },
    ],
    defaultContent: { options: ['Friendly', 'Energetic', 'Calm', 'Playful', 'Protective', 'Shy'] },
  },
  {
    name: 'Activity Levels', icon: ICON_PATHS.chart, color: 'bg-orange-500',
    fields: [
      { key: 'options', label: 'Options', type: 'list', placeholder: 'Add an activity level…' },
    ],
    defaultContent: { options: ['Low', 'Moderate', 'High', 'Very High'] },
  },
  {
    name: 'Gender Options', icon: ICON_PATHS.users, color: 'bg-pink-500',
    fields: [
      { key: 'options', label: 'Options', type: 'list', placeholder: 'Add a gender option…' },
    ],
    defaultContent: { options: ['Male', 'Female', 'Unknown'] },
  },
  {
    name: 'Walk Preferences', icon: ICON_PATHS.steps, color: 'bg-blue-500',
    fields: [
      { key: 'options', label: 'Options', type: 'list', placeholder: 'Add a walk preference…' },
    ],
    defaultContent: { options: ['Short walks', 'Long hikes', 'Off-lead runs', 'City strolls'] },
  },
  {
    name: 'Favourite Activities', icon: ICON_PATHS.heart, color: 'bg-red-500',
    fields: [
      { key: 'options', label: 'Options', type: 'list', placeholder: 'Add a favourite activity…' },
    ],
    defaultContent: { options: ['Fetch', 'Swimming', 'Agility', 'Socialising', 'Tug of war', 'Frisbee'] },
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   SEO & TRACKING CONFIG
   ═══════════════════════════════════════════════════════════════════════════ */

const SEO_SECTIONS: SectionSchema[] = [
  {
    name: 'Meta Tags', icon: ICON_PATHS.text, color: 'bg-blue-600',
    fields: [
      { key: 'site_title', label: 'Site Title', type: 'text', placeholder: 'Jeko - Personalised Healthy Natural Pet Food' },
      { key: 'site_description', label: 'Meta Description', type: 'textarea', placeholder: 'The easiest way to feed healthy, natural pet food...' },
      { key: 'og_image', label: 'Open Graph Image (social sharing)', type: 'image' },
    ],
    defaultContent: {
      site_title: 'Jeko - Personalised Healthy Natural Pet Food',
      site_description: 'The easiest way to feed healthy, natural pet food. Enjoy fresh food without the fuss.',
      og_image: '',
    },
  },
  {
    name: 'Custom Head Code', icon: ICON_PATHS.code, color: 'bg-purple-600',
    fields: [
      { key: 'custom_head_enabled', label: 'Enable Custom Head Code', type: 'toggle' },
      { key: 'custom_head_code', label: 'Custom Code (inserted in <head>)', type: 'textarea', placeholder: '<!-- Insert any custom tracking or meta tags here -->' },
    ],
    defaultContent: {
      custom_head_enabled: false,
      custom_head_code: '',
    },
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   PRODUCT PAGE (per-product customisation)
   ═══════════════════════════════════════════════════════════════════════════ */

export const PRODUCT_PAGE_SECTIONS: SectionSchema[] = [
  {
    name: 'Hero Override', icon: ICON_PATHS.image, color: 'bg-deep-green',
    fields: [
      { key: 'subtitle', label: 'Subtitle / Badge', type: 'text', placeholder: 'e.g. Vet Recommended' },
      { key: 'hero_image', label: 'Hero Banner Image', type: 'image' },
      { key: 'hero_description', label: 'Hero Description Override', type: 'textarea' },
    ],
    defaultContent: { subtitle: '', hero_image: '', hero_description: '' },
  },
  {
    name: 'Feature Highlights', icon: ICON_PATHS.grid, color: 'bg-gold',
    fields: [
      { key: 'features_heading', label: 'Section Heading', type: 'text', placeholder: 'Why choose this product?' },
      { key: 'feature_1_title', label: 'Feature 1 Title', type: 'text' },
      { key: 'feature_1_description', label: 'Feature 1 Description', type: 'textarea' },
      { key: 'feature_2_title', label: 'Feature 2 Title', type: 'text' },
      { key: 'feature_2_description', label: 'Feature 2 Description', type: 'textarea' },
      { key: 'feature_3_title', label: 'Feature 3 Title', type: 'text' },
      { key: 'feature_3_description', label: 'Feature 3 Description', type: 'textarea' },
    ],
    defaultContent: { features_heading: '', feature_1_title: '', feature_1_description: '', feature_2_title: '', feature_2_description: '', feature_3_title: '', feature_3_description: '' },
  },
  {
    name: 'Detailed Description', icon: ICON_PATHS.text, color: 'bg-teal-600',
    fields: [
      { key: 'detail_heading', label: 'Section Heading', type: 'text', placeholder: 'About this product' },
      { key: 'detail_body', label: 'Full Description', type: 'textarea' },
      { key: 'detail_image', label: 'Description Image', type: 'image' },
    ],
    defaultContent: { detail_heading: '', detail_body: '', detail_image: '' },
  },
  {
    name: 'Ingredients & Nutrition', icon: ICON_PATHS.book, color: 'bg-green-600',
    fields: [
      { key: 'ingredients_heading', label: 'Section Heading', type: 'text', placeholder: 'Ingredients' },
      { key: 'ingredients_list', label: 'Ingredients', type: 'textarea', placeholder: 'List ingredients...' },
      { key: 'nutrition_heading', label: 'Nutrition Heading', type: 'text', placeholder: 'Nutritional Information' },
      { key: 'nutrition_info', label: 'Nutrition Details', type: 'textarea' },
    ],
    defaultContent: { ingredients_heading: 'Ingredients', ingredients_list: '', nutrition_heading: 'Nutritional Information', nutrition_info: '' },
  },
  {
    name: 'Feeding Guide', icon: ICON_PATHS.steps, color: 'bg-orange-600',
    fields: [
      { key: 'feeding_heading', label: 'Section Heading', type: 'text', placeholder: 'Feeding Guide' },
      { key: 'feeding_body', label: 'Feeding Instructions', type: 'textarea' },
      { key: 'feeding_image', label: 'Feeding Guide Image', type: 'image' },
    ],
    defaultContent: { feeding_heading: 'Feeding Guide', feeding_body: '', feeding_image: '' },
  },
  {
    name: 'Upsells & Cross-sells', icon: ICON_PATHS.heart, color: 'bg-pink-600',
    fields: [
      { key: 'upsells_heading', label: 'Section Heading', type: 'text', placeholder: 'You may also like' },
      { key: 'upsells_enabled', label: 'Show Upsells', type: 'toggle' },
    ],
    defaultContent: { upsells_heading: 'You may also like', upsells_enabled: true },
  },
  {
    name: 'Product FAQ', icon: ICON_PATHS.faq, color: 'bg-purple-600',
    fields: [
      { key: 'faq_heading', label: 'FAQ Heading', type: 'text', placeholder: 'Frequently Asked Questions' },
      { key: 'faq_1_q', label: 'Q1', type: 'text' },
      { key: 'faq_1_a', label: 'A1', type: 'textarea' },
      { key: 'faq_2_q', label: 'Q2', type: 'text' },
      { key: 'faq_2_a', label: 'A2', type: 'textarea' },
      { key: 'faq_3_q', label: 'Q3', type: 'text' },
      { key: 'faq_3_a', label: 'A3', type: 'textarea' },
      { key: 'faq_4_q', label: 'Q4', type: 'text' },
      { key: 'faq_4_a', label: 'A4', type: 'textarea' },
    ],
    defaultContent: { faq_heading: 'Frequently Asked Questions', faq_1_q: '', faq_1_a: '', faq_2_q: '', faq_2_a: '', faq_3_q: '', faq_3_a: '', faq_4_q: '', faq_4_a: '' },
  },
  {
    name: 'Reviews Display', icon: ICON_PATHS.star, color: 'bg-amber-600',
    fields: [
      { key: 'reviews_heading', label: 'Reviews Section Heading', type: 'text', placeholder: 'Customer Reviews' },
      { key: 'show_reviews', label: 'Show Reviews Section', type: 'toggle' },
      { key: 'reviews_count', label: 'Number of Reviews to Show', type: 'number' },
    ],
    defaultContent: { reviews_heading: 'Customer Reviews', show_reviews: true, reviews_count: 5 },
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   ALL PAGES CONFIG
   ═══════════════════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════════════════
   HEALTH & BREEDS — shared schema for /benefits/<condition> sub-pages
   ═══════════════════════════════════════════════════════════════════════════ */

const HEALTH_CONDITION_SECTIONS: SectionSchema[] = [
  {
    name: 'Hero', icon: ICON_PATHS.image, color: 'bg-blue-500',
    fields: [
      { key: 'eyebrow', label: 'Eyebrow Label', type: 'text', placeholder: 'HEALTH & WELLBEING', i18nKey: 'health.hero.eyebrow' },
      { key: 'condition', label: 'Condition Title', type: 'text' },
      { key: 'tagline', label: 'Tagline (Gold)', type: 'text' },
      { key: 'hero_image', label: 'Hero Image', type: 'image' },
      { key: 'hero_description', label: 'Hero Description', type: 'textarea' },
      { key: 'hero_cta', label: 'Hero CTA Button Text', type: 'text', placeholder: "Build your dog's plan", i18nKey: 'health.hero.cta' },
    ],
    defaultContent: {
      eyebrow: 'HEALTH & WELLBEING',
      condition: 'Colitis in dogs',
      tagline: '& how diet can help',
      hero_image: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=1600&h=800&fit=crop',
      hero_description: "Colitis is one of the most common digestive conditions in dogs. The right nutrition can reduce flare-ups and support your dog's gut health naturally.",
      hero_cta: "Build your dog's plan",
    },
  },
  {
    name: 'What Is', icon: ICON_PATHS.text, color: 'bg-emerald-500',
    fields: [
      { key: 'what_is_title', label: 'Heading', type: 'text' },
      { key: 'what_is_text_1', label: 'Paragraph 1', type: 'textarea' },
      { key: 'what_is_text_2', label: 'Paragraph 2', type: 'textarea' },
      { key: 'what_is_text_3', label: 'Paragraph 3', type: 'textarea' },
    ],
    defaultContent: {
      what_is_title: 'What is colitis in dogs?',
      what_is_text_1: 'Colitis refers to inflammation of the colon (large intestine). It can be acute or chronic, and affects dogs of all ages and breeds.',
      what_is_text_2: 'The condition disrupts normal water absorption in the colon, leading to loose stools, urgency, and discomfort. Diet plays a central role in managing it.',
      what_is_text_3: 'Many dogs with colitis improve simply by switching to a gentle, natural diet that avoids inflammatory ingredients found in highly processed kibble.',
    },
  },
  {
    name: 'Symptoms / Signs', icon: ICON_PATHS.star, color: 'bg-rose-500',
    fields: [
      { key: 'signs_heading', label: 'Section Heading', type: 'text', placeholder: 'Watch for these signs', i18nKey: 'health.signs.heading' },
      { key: 'signs_subtitle', label: 'Section Subtitle', type: 'textarea', i18nKey: 'health.signs.subtitle' },
      { key: 'symptom_1_icon', label: 'Symptom 1 — Icon (emoji)', type: 'text' },
      { key: 'symptom_1_title', label: 'Symptom 1 — Title', type: 'text' },
      { key: 'symptom_1_description', label: 'Symptom 1 — Description', type: 'textarea' },
      { key: 'symptom_2_icon', label: 'Symptom 2 — Icon (emoji)', type: 'text' },
      { key: 'symptom_2_title', label: 'Symptom 2 — Title', type: 'text' },
      { key: 'symptom_2_description', label: 'Symptom 2 — Description', type: 'textarea' },
      { key: 'symptom_3_icon', label: 'Symptom 3 — Icon (emoji)', type: 'text' },
      { key: 'symptom_3_title', label: 'Symptom 3 — Title', type: 'text' },
      { key: 'symptom_3_description', label: 'Symptom 3 — Description', type: 'textarea' },
      { key: 'symptom_4_icon', label: 'Symptom 4 — Icon (emoji)', type: 'text' },
      { key: 'symptom_4_title', label: 'Symptom 4 — Title', type: 'text' },
      { key: 'symptom_4_description', label: 'Symptom 4 — Description', type: 'textarea' },
      { key: 'symptom_5_icon', label: 'Symptom 5 — Icon (emoji)', type: 'text' },
      { key: 'symptom_5_title', label: 'Symptom 5 — Title', type: 'text' },
      { key: 'symptom_5_description', label: 'Symptom 5 — Description', type: 'textarea' },
      { key: 'symptom_6_icon', label: 'Symptom 6 — Icon (emoji)', type: 'text' },
      { key: 'symptom_6_title', label: 'Symptom 6 — Title', type: 'text' },
      { key: 'symptom_6_description', label: 'Symptom 6 — Description', type: 'textarea' },
    ],
    defaultContent: {
      signs_heading: 'Watch for these signs',
      signs_subtitle: "If your dog shows any of these symptoms, the right nutrition can make a big difference.",
      symptom_1_icon: '💩', symptom_1_title: 'Soft or watery stools', symptom_1_description: 'Frequent loose stools, often with mucus or small amounts of bright red blood, are the hallmark sign of colitis.',
      symptom_2_icon: '😣', symptom_2_title: 'Straining to go', symptom_2_description: 'Your dog may strain or take longer than usual when going to the toilet, even if very little is produced.',
      symptom_3_icon: '🚨', symptom_3_title: 'Increased urgency', symptom_3_description: 'Needing to go outside more frequently or having accidents indoors can indicate colon inflammation.',
      symptom_4_icon: '😔', symptom_4_title: 'Flatulence & discomfort', symptom_4_description: 'Excessive gas, rumbling stomach sounds, and general signs of tummy discomfort are common.',
      symptom_5_icon: '🍽️', symptom_5_title: 'Reduced appetite', symptom_5_description: 'Some dogs may eat less or show reluctance at mealtimes when experiencing a flare-up.',
      symptom_6_icon: '😴', symptom_6_title: 'Lethargy', symptom_6_description: 'During flare-ups your dog may seem more tired than usual and less interested in play or walks.',
    },
  },
  {
    name: 'How Diet Helps', icon: ICON_PATHS.heart, color: 'bg-amber-500',
    fields: [
      { key: 'how_diet_title', label: 'Heading', type: 'text' },
      { key: 'how_diet_accent', label: 'Gold Accent Line', type: 'text', placeholder: 'through the right nutrition', i18nKey: 'health.diet.accent' },
      { key: 'how_diet_text', label: 'Body', type: 'textarea' },
      { key: 'food_image', label: 'Food Image', type: 'image' },
      { key: 'food_benefit_1_title', label: 'Benefit 1 — Title', type: 'text' },
      { key: 'food_benefit_1_description', label: 'Benefit 1 — Description', type: 'textarea' },
      { key: 'food_benefit_2_title', label: 'Benefit 2 — Title', type: 'text' },
      { key: 'food_benefit_2_description', label: 'Benefit 2 — Description', type: 'textarea' },
      { key: 'food_benefit_3_title', label: 'Benefit 3 — Title', type: 'text' },
      { key: 'food_benefit_3_description', label: 'Benefit 3 — Description', type: 'textarea' },
      { key: 'food_benefit_4_title', label: 'Benefit 4 — Title', type: 'text' },
      { key: 'food_benefit_4_description', label: 'Benefit 4 — Description', type: 'textarea' },
      { key: 'food_benefit_5_title', label: 'Benefit 5 — Title', type: 'text' },
      { key: 'food_benefit_5_description', label: 'Benefit 5 — Description', type: 'textarea' },
    ],
    defaultContent: {
      how_diet_title: 'Managing colitis',
      how_diet_accent: 'through the right nutrition',
      how_diet_text: 'Diet is one of the most important factors in managing colitis. Highly processed foods can worsen colon inflammation, while a natural, gently prepared diet is far easier on the gut.',
      food_image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=600&fit=crop',
      food_benefit_1_title: 'Highly digestible ingredients', food_benefit_1_description: 'Natural whole foods are far gentler on inflamed gut tissue than heavily processed alternatives.',
      food_benefit_2_title: 'Free from artificial additives', food_benefit_2_description: 'No preservatives, colourings, or fillers that commonly trigger digestive upset.',
      food_benefit_3_title: 'Balanced fibre content', food_benefit_3_description: 'Just the right amount of soluble and insoluble fibre to support firm stools and gut motility.',
      food_benefit_4_title: 'Gentle proteins', food_benefit_4_description: 'Single-source, easily-recognised proteins reduce the chance of an inflammatory response.',
      food_benefit_5_title: 'Prebiotic support', food_benefit_5_description: 'Natural prebiotics nourish beneficial gut bacteria and rebuild healthy microbiome diversity.',
    },
  },
  {
    name: 'Testimonial', icon: ICON_PATHS.testimonials, color: 'bg-violet-500',
    fields: [
      { key: 'testimonial_quote', label: 'Quote', type: 'textarea' },
      { key: 'testimonial_name', label: 'Author Name', type: 'text' },
      { key: 'testimonial_image', label: 'Author Image', type: 'image' },
    ],
    defaultContent: {
      testimonial_quote: 'Switching to a natural diet completely transformed our dog. Within weeks the flare-ups stopped and her energy was back. We genuinely got our happy dog back.',
      testimonial_name: 'Sarah & Bella',
      testimonial_image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop',
    },
  },
  {
    name: 'FAQs', icon: ICON_PATHS.faq, color: 'bg-violet-500',
    fields: [
      { key: 'faqs_heading', label: 'Section Heading', type: 'text', placeholder: 'Frequently asked questions', i18nKey: 'health.faqs.heading' },
      { key: 'faq_1_question', label: 'FAQ 1 — Question', type: 'text' },
      { key: 'faq_1_answer', label: 'FAQ 1 — Answer', type: 'textarea' },
      { key: 'faq_2_question', label: 'FAQ 2 — Question', type: 'text' },
      { key: 'faq_2_answer', label: 'FAQ 2 — Answer', type: 'textarea' },
      { key: 'faq_3_question', label: 'FAQ 3 — Question', type: 'text' },
      { key: 'faq_3_answer', label: 'FAQ 3 — Answer', type: 'textarea' },
      { key: 'faq_4_question', label: 'FAQ 4 — Question', type: 'text' },
      { key: 'faq_4_answer', label: 'FAQ 4 — Answer', type: 'textarea' },
      { key: 'faq_5_question', label: 'FAQ 5 — Question', type: 'text' },
      { key: 'faq_5_answer', label: 'FAQ 5 — Answer', type: 'textarea' },
      { key: 'faq_6_question', label: 'FAQ 6 — Question', type: 'text' },
      { key: 'faq_6_answer', label: 'FAQ 6 — Answer', type: 'textarea' },
    ],
    defaultContent: {
      faqs_heading: 'Frequently asked questions',
      faq_1_question: 'Can diet alone cure my dog\'s colitis?',
      faq_1_answer: 'Diet is a major factor, but it\'s important to consult your vet for severe or chronic cases. Many dogs see significant improvement with the right natural diet.',
      faq_2_question: 'Which proteins are best for dogs with colitis?',
      faq_2_answer: 'Lean, single-source proteins like turkey, chicken, or fish are usually well-tolerated. Avoid rich or fatty options during flare-ups.',
      faq_3_question: 'How quickly will I see improvement after a diet change?',
      faq_3_answer: 'Many owners notice improvements within 1-2 weeks, though full benefits develop over 4-6 weeks as the gut microbiome rebalances.',
      faq_4_question: 'Should I add probiotics to my dog\'s food?',
      faq_4_answer: 'Probiotics can help, but a naturally prebiotic-rich diet often does the work on its own. Speak to your vet before supplementing.',
      faq_5_question: 'Is grain-free food better for colitis?',
      faq_5_answer: 'Not necessarily. Some dogs do well with gentle whole grains like rice. The key is highly digestible, low-allergen ingredients overall.',
      faq_6_question: 'Can stress trigger colitis flare-ups?',
      faq_6_answer: 'Yes. Stress is a common trigger alongside diet, so a calm routine and consistent feeding times help a lot.',
    },
  },
  {
    name: 'CTA Block', icon: ICON_PATHS.heart, color: 'bg-purple-600',
    fields: [
      { key: 'cta_heading', label: 'Heading', type: 'text', placeholder: 'Build a healthier life', i18nKey: 'health.cta.heading' },
      { key: 'cta_subtitle', label: 'Subtitle (Gold)', type: 'text', placeholder: 'one bowl at a time', i18nKey: 'health.cta.subtitle' },
      { key: 'cta_description', label: 'Description', type: 'textarea', i18nKey: 'health.cta.description' },
      { key: 'cta_button', label: 'Button Text', type: 'text', placeholder: 'Shop products', i18nKey: 'health.cta.button' },
      { key: 'cta_image', label: 'CTA Image', type: 'image' },
    ],
    defaultContent: {
      cta_heading: 'Build a healthier life',
      cta_subtitle: 'one bowl at a time',
      cta_description: "Discover natural recipes designed to support your dog's health, made with ingredients you can actually pronounce.",
      cta_button: 'Shop products',
      cta_image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=600&fit=crop',
    },
  },
];

export const ALL_PAGE_CONFIGS: PageConfig[] = [
  { label: 'Homepage', slug: '/', previewPath: '/', indexKey: '_homepage_index', sections: HOMEPAGE_SECTIONS },
  { label: 'About', slug: '/about', previewPath: '/about', indexKey: '_section_index', sections: ABOUT_SECTIONS },
  { label: 'Benefits', slug: '/benefits', previewPath: '/benefits', indexKey: '_section_index', sections: BENEFITS_SECTIONS },
  { label: 'Health & Breeds: Colitis', slug: '/benefits/colitis', previewPath: '/benefits/colitis', indexKey: '_section_index', sections: HEALTH_CONDITION_SECTIONS },
  { label: 'Health & Breeds: Digestion Issues', slug: '/benefits/digestion-issues', previewPath: '/benefits/digestion-issues', indexKey: '_section_index', sections: HEALTH_CONDITION_SECTIONS },
  { label: 'Health & Breeds: Hypoallergenic', slug: '/benefits/hypoallergenic', previewPath: '/benefits/hypoallergenic', indexKey: '_section_index', sections: HEALTH_CONDITION_SECTIONS },
  { label: 'Health & Breeds: Pancreatitis', slug: '/benefits/pancreatitis', previewPath: '/benefits/pancreatitis', indexKey: '_section_index', sections: HEALTH_CONDITION_SECTIONS },
  { label: 'Health & Breeds: Weight Management', slug: '/benefits/weight-management', previewPath: '/benefits/weight-management', indexKey: '_section_index', sections: HEALTH_CONDITION_SECTIONS },
  { label: 'Recipes', slug: '/recipes', previewPath: '/recipes', indexKey: '_section_index', sections: RECIPES_SECTIONS },
  { label: 'Reviews', slug: '/reviews', previewPath: '/reviews', indexKey: '_section_index', sections: REVIEWS_SECTIONS },
  { label: 'Signup', slug: '/signup', previewPath: '/signup', indexKey: '_section_index', sections: SIGNUP_SECTIONS },
  { label: 'Beyond the Bowl', slug: '/beyond-the-bowl', previewPath: '/beyond-the-bowl', indexKey: '_section_index', sections: SIGNUP_SECTIONS },
  { label: 'Contact', slug: '/contact', previewPath: '/contact', indexKey: '_section_index', sections: SIGNUP_SECTIONS },
  { label: 'Community', slug: '/community', previewPath: '/community', indexKey: '_section_index', sections: SIGNUP_SECTIONS },
  { label: 'Blog', slug: '/blog', previewPath: '/blog', indexKey: '_section_index', sections: SIGNUP_SECTIONS },
  { label: 'Cart', slug: '/cart', previewPath: '/cart', indexKey: '_section_index', sections: SIGNUP_SECTIONS },
  { label: 'Checkout', slug: '/checkout', previewPath: '/checkout', indexKey: '_section_index', sections: SIGNUP_SECTIONS },
  { label: 'Profile', slug: '/profile', previewPath: '/profile', indexKey: '_section_index', sections: SIGNUP_SECTIONS },
  { label: 'Find Pet Owners', slug: '/find-owners', previewPath: '/find-owners', indexKey: '_section_index', sections: SIGNUP_SECTIONS },
  { label: 'Swipe', slug: '/swipe', previewPath: '/swipe', indexKey: '_section_index', sections: SIGNUP_SECTIONS },
  { label: 'Matches', slug: '/matches', previewPath: '/matches', indexKey: '_section_index', sections: SIGNUP_SECTIONS },
  { label: 'Messages', slug: '/messages', previewPath: '/messages', indexKey: '_section_index', sections: SIGNUP_SECTIONS },
  { label: 'Login', slug: '/auth/login', previewPath: '/auth/login', indexKey: '_section_index', sections: SIGNUP_SECTIONS },
  { label: 'Signup (Auth)', slug: '/auth/signup', previewPath: '/auth/signup', indexKey: '_section_index', sections: SIGNUP_SECTIONS },
  { label: 'Privacy Policy', slug: '/privacy-policy', previewPath: '/privacy-policy', indexKey: '_section_index', sections: SIGNUP_SECTIONS },
  { label: 'Terms of Use', slug: '/terms-of-use', previewPath: '/terms-of-use', indexKey: '_section_index', sections: SIGNUP_SECTIONS },
  { label: 'Cookie Policy', slug: '/cookie-policy', previewPath: '/cookie-policy', indexKey: '_section_index', sections: SIGNUP_SECTIONS },
  { label: 'Refund Policy', slug: '/refund-policy', previewPath: '/refund-policy', indexKey: '_section_index', sections: SIGNUP_SECTIONS },
  { label: 'Shipping Policy', slug: '/shipping-policy', previewPath: '/shipping-policy', indexKey: '_section_index', sections: SIGNUP_SECTIONS },
  { label: 'Returns', slug: '/returns', previewPath: '/returns', indexKey: '_section_index', sections: SIGNUP_SECTIONS },
  { label: 'Delivery Information', slug: '/delivery-information', previewPath: '/delivery-information', indexKey: '_section_index', sections: SIGNUP_SECTIONS },
  { label: 'Site Security', slug: '/site-security', previewPath: '/site-security', indexKey: '_section_index', sections: SIGNUP_SECTIONS },
  { label: 'Pure Policies', slug: '/pure-policies', previewPath: '/pure-policies', indexKey: '_section_index', sections: SIGNUP_SECTIONS },
  { label: 'Sitemap', slug: '/sitemap-page', previewPath: '/sitemap-page', indexKey: '_section_index', sections: SIGNUP_SECTIONS },
  {
    label: 'Matching Preferences',
    slug: 'preferences-config',
    previewPath: '/profile',
    indexKey: '_section_index',
    sections: PREFERENCES_CONFIG_SECTIONS,
  },
  {
    label: 'SEO',
    slug: 'seo-tracking',
    previewPath: '/',
    indexKey: '_section_index',
    sections: SEO_SECTIONS,
  },
];
