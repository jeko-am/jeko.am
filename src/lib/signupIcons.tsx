import React from 'react';

export const DEFAULT_SIGNUP_OPTION_ICONS: Record<string, string> = {
  Cat: "https://res.cloudinary.com/dppatx2f4/image/upload/v1779467456/pure-pet-products/jfkxymb7h4r2lwg1kczw.gif",
  Dog: "https://res.cloudinary.com/dppatx2f4/image/upload/v1779467493/pure-pet-products/fcczvn99jia8lms6syuw.gif",
  Male: "https://res.cloudinary.com/dppatx2f4/image/upload/v1779469629/pure-pet-products/dhu8qhth3ipnmvbrb99w.gif",
  Female: "https://res.cloudinary.com/dppatx2f4/image/upload/v1779469636/pure-pet-products/ikkg5izdoxfhzoabsdms.gif",
  Calm: "https://res.cloudinary.com/dppatx2f4/image/upload/v1779467706/pure-pet-products/vnrypihrycqgksvzfiiw.gif",
  Playful: "https://res.cloudinary.com/dppatx2f4/image/upload/v1779468970/pure-pet-products/ag9kgnw3skweutczsqqy.gif",
  Energetic: "https://res.cloudinary.com/dppatx2f4/image/upload/v1779468048/pure-pet-products/monr4ql6l2nvxo6uamnm.gif",
  Shy: "https://res.cloudinary.com/dppatx2f4/image/upload/v1779467825/pure-pet-products/i4u0bnzrd2xs6udncebc.gif",
  Protective: "https://res.cloudinary.com/dppatx2f4/image/upload/v1779468441/pure-pet-products/dr9vwekodbhbbiuhegzg.gif",
  Friendly: "https://res.cloudinary.com/dppatx2f4/image/upload/v1779467808/pure-pet-products/h8dmj9wxgr1yvrluv3lb.gif",
  "disability:None": "https://res.cloudinary.com/dppatx2f4/image/upload/v1779468235/pure-pet-products/auoxlqjuvik3yyzs2veb.gif",
  "disability:Blind": "https://res.cloudinary.com/dppatx2f4/image/upload/v1779468100/pure-pet-products/evg7pdepzmtdi6j5ve7k.gif",
  "disability:Deaf": "https://res.cloudinary.com/dppatx2f4/image/upload/v1779468079/pure-pet-products/zn73xjjuh1sm0hxi1o1n.gif",
  "disability:Mobility Issues": "https://res.cloudinary.com/dppatx2f4/image/upload/v1779468159/pure-pet-products/w6rcnkmokewib012wi7t.gif",
  "disability:Amputee": "https://res.cloudinary.com/dppatx2f4/image/upload/v1779468285/pure-pet-products/mjuclj4lulxpnmfoa2ca.gif",
  "disability:Epilepsy": "https://res.cloudinary.com/dppatx2f4/image/upload/v1779468524/pure-pet-products/cvsz62jnxbxzjlskhq3g.gif",
  "disability:Anxiety": "https://res.cloudinary.com/dppatx2f4/image/upload/v1779468329/pure-pet-products/c31tkqlkwmvjwcxnqw31.gif",
  "disability:Other": "https://res.cloudinary.com/dppatx2f4/image/upload/v1779468410/pure-pet-products/kvauznynqxcv4q9nuwcf.gif",
  "allergy:None": "https://res.cloudinary.com/dppatx2f4/image/upload/v1779468533/pure-pet-products/uswtgysdndrltxwvbolj.gif",
  "allergy:Chicken": "https://res.cloudinary.com/dppatx2f4/image/upload/v1779469045/pure-pet-products/n1jgmgxtav9go1ansl5r.gif",
  "allergy:Beef": "https://res.cloudinary.com/dppatx2f4/image/upload/v1779468580/pure-pet-products/m7zdeshbdcae6upxjrep.gif",
  "allergy:Grain": "https://res.cloudinary.com/dppatx2f4/image/upload/v1779469041/pure-pet-products/cex8seszxrsrx5vvibwh.gif",
  "allergy:Dairy": "https://res.cloudinary.com/dppatx2f4/image/upload/v1779469054/pure-pet-products/buphupd2cfz6ndhd0w2q.gif",
  "allergy:Eggs": "https://res.cloudinary.com/dppatx2f4/image/upload/v1779469054/pure-pet-products/buphupd2cfz6ndhd0w2q.gif",
  "allergy:Soy": "https://res.cloudinary.com/dppatx2f4/image/upload/v1779469092/pure-pet-products/j84zbak5fv87sffjcuwk.gif",
  "allergy:Fish": "https://res.cloudinary.com/dppatx2f4/image/upload/v1779469036/pure-pet-products/u6zmrttomupjbjzwnwyl.gif",
  "allergy:Pollen": "https://res.cloudinary.com/dppatx2f4/image/upload/v1779469121/pure-pet-products/m1wvmdavgaxvsw8c1u3r.gif",
  "allergy:Dust": "https://res.cloudinary.com/dppatx2f4/image/upload/v1779469097/pure-pet-products/u0w6lclsdh5ibmj9z8e8.gif",
  "allergy:Flea": "https://res.cloudinary.com/dppatx2f4/image/upload/v1779469164/pure-pet-products/owb1nwhyxsv1wgjtqfvh.png",
  "allergy:Other": "https://res.cloudinary.com/dppatx2f4/image/upload/v1779469168/pure-pet-products/vyjbaklt3db9ngtro5xj.gif",
  "diet:Raw": "https://res.cloudinary.com/dppatx2f4/image/upload/v1779468638/pure-pet-products/qllkos1xqyc2rqfqmrxx.gif",
  "diet:Kibble": "https://res.cloudinary.com/dppatx2f4/image/upload/v1779468628/pure-pet-products/ifb7ebouikneaiy0rm5d.gif",
  "diet:Mixed": "https://res.cloudinary.com/dppatx2f4/image/upload/v1779468663/pure-pet-products/ekpjrczrzo41lw4gedja.gif",
  "diet:Homemade": "https://res.cloudinary.com/dppatx2f4/image/upload/v1779468696/pure-pet-products/vpzxawkti23fqbupoqsh.gif",
  "diet:Chicken": "https://res.cloudinary.com/dppatx2f4/image/upload/v1779468711/pure-pet-products/fei9liabivltvxrwjg4z.gif",
  "diet:Beef": "https://res.cloudinary.com/dppatx2f4/image/upload/v1779468715/pure-pet-products/bri8xja4iomoexsrcuij.gif",
  "diet:Lamb": "https://res.cloudinary.com/dppatx2f4/image/upload/v1779468753/pure-pet-products/i7bbv6kricifnswqzl94.png",
  "diet:Vegetables": "https://res.cloudinary.com/dppatx2f4/image/upload/v1779468778/pure-pet-products/fyqt7rubed7naar1ng8r.gif",
  matchYes: "https://res.cloudinary.com/dppatx2f4/image/upload/v1779468805/pure-pet-products/kyeirrbofztvk90tutcu.gif",
  matchNo: "https://res.cloudinary.com/dppatx2f4/image/upload/v1779468961/pure-pet-products/kawyinfoah6zduvfnlgm.gif",
};

export const QIcon = {
  dog: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.855-1.53 1.844-3.063" />
      <path d="M14 5.172C14 3.782 15.577 2.679 17.5 3c2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.53-1.844-3.063" />
      <path d="M12 12c-2.5 0-5 2-5 5 0 2 1.5 4 5 4s5-2 5-4c0-3-2.5-5-5-5z" />
      <circle cx="10" cy="16" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="14" cy="16" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  ),
  cat: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22c4.97 0 9-2.686 9-6v-1.5c0-2.5-1-4-2.5-5L20 3l-4 3h-8L4 3l1.5 6.5C4 10.5 3 12 3 14.5V16c0 3.314 4.03 6 9 6z" />
      <circle cx="9.5" cy="14" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="14" r="0.75" fill="currentColor" stroke="none" />
      <path d="M10 17.5c.5.5 1.5 1 2 1s1.5-.5 2-1" />
    </svg>
  ),
  paw: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="8" cy="6.5" rx="2" ry="2.5" />
      <ellipse cx="16" cy="6.5" rx="2" ry="2.5" />
      <ellipse cx="5" cy="12" rx="1.8" ry="2.2" />
      <ellipse cx="19" cy="12" rx="1.8" ry="2.2" />
      <path d="M8 16.5C8 14.5 9.5 13 12 13s4 1.5 4 3.5S14.5 20 12 20s-4-1.5-4-3.5z" />
    </svg>
  ),
  male: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10.5" cy="14.5" r="5.5" />
      <path d="M15 9l5-5m0 0h-4.5M20 4v4.5" />
    </svg>
  ),
  female: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="9" r="5.5" />
      <path d="M12 14.5V21m-3-3h6" />
    </svg>
  ),
  calm: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M8 14.5c1 1.5 2.5 2 4 2s3-.5 4-2" />
      <path d="M9 9h0M15 9h0" strokeWidth="2" />
    </svg>
  ),
  playful: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="13" r="7" />
      <path d="M9 6l-1.5-3M15 6l1.5-3" />
      <circle cx="10" cy="12" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="14" cy="12" r="0.75" fill="currentColor" stroke="none" />
      <path d="M9.5 15c.8 1 1.5 1.2 2.5 1.2s1.7-.2 2.5-1.2" />
    </svg>
  ),
  energetic: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  shy: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M8 15c1.5 1 3 1.5 4 1.5s2.5-.5 4-1.5" />
      <path d="M9.5 10c-.2-.4-.8-.8-1.5-.8s-1.3.4-1.5.8" />
      <path d="M17.5 10c-.2-.4-.8-.8-1.5-.8s-1.3.4-1.5.8" />
    </svg>
  ),
  protective: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l7.794 3.897A1 1 0 0120.5 7.82v4.13c0 4.5-3.5 8.05-8.5 9.55-5-1.5-8.5-5.05-8.5-9.55V7.82a1 1 0 01.706-.923L12 3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  friendly: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
    </svg>
  ),
  yes: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 10v4a5 5 0 0010 0v-4" />
      <path d="M12 14v4m-3 0h6" />
      <circle cx="9" cy="10" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="15" cy="10" r="0.75" fill="currentColor" stroke="none" />
      <path d="M4.5 7C5 4.5 7 3 9 3c1 0 2 .5 3 1.5C13 3.5 14 3 15 3c2 0 4 1.5 4.5 4" />
      <path d="M10 17.5c.5.5 1.2.8 2 .8s1.5-.3 2-.8" />
    </svg>
  ),
  no: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M15 9l-6 6M9 9l6 6" />
    </svg>
  ),
  heart: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
    </svg>
  ),
  raw: (
    /* Meat cut on bone — T-bone shape */
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 9.5C4.5 6 7 3.5 10.5 3.5c2.5 0 4.5 1 5.5 3l1 2c.5 1.5.5 3-.5 4.5-1.5 2-4 3-7 3C6 16 4.5 13 4.5 9.5z" />
      <line x1="14" y1="16" x2="17" y2="21" />
      <circle cx="17.5" cy="21.5" r="1" />
    </svg>
  ),
  kibble: (
    /* Bag of kibble with paw */
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8h12l1 12H5L6 8z" />
      <path d="M6 8l1-4h10l1 4" />
      <path d="M9 4v-1M15 4v-1" />
      <circle cx="10.5" cy="13" r="0.9" fill="currentColor" opacity="0.4" />
      <circle cx="13.5" cy="13" r="0.9" fill="currentColor" opacity="0.4" />
      <circle cx="12" cy="16" r="1.2" fill="currentColor" opacity="0.4" />
    </svg>
  ),
  mixed: (
    /* Fork and knife crossed */
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 3v5c0 1.7 1.3 3 3 3v9" />
      <line x1="7" y1="3" x2="7" y2="8" />
      <line x1="10" y1="3" x2="10" y2="8" />
      <line x1="8.5" y1="3" x2="8.5" y2="8" />
      <path d="M17 3c0 0-2 1-2 5s2 4 2 4v8" />
    </svg>
  ),
  homemade: (
    /* Cooking pot with steam */
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 12h12v6a3 3 0 01-3 3H9a3 3 0 01-3-3v-6z" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="3" y1="15" x2="6" y2="15" />
      <line x1="18" y1="15" x2="21" y2="15" />
      <path d="M8 9c.5-1.5 1-3 1-3" />
      <path d="M12 8c.5-2 1-4 1-4" />
      <path d="M16 9c.5-1.5 1-3 1-3" />
    </svg>
  ),
  plant: (
    /* Leaf — Jeko natural brand */
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21c-4 0-7-3-7-7 0-5 5-10 7-11 2 1 7 6 7 11 0 4-3 7-7 7z" />
      <line x1="12" y1="10" x2="12" y2="21" />
      <path d="M9 14l3-3 3 3" />
    </svg>
  ),
  chicken: (
    /* Drumstick — clear poultry leg shape */
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="14" cy="7" rx="5" ry="4" />
      <path d="M10 10l-3 5" />
      <rect x="5.5" y="14.5" width="3" height="6" rx="1.5" transform="rotate(-30 7 17.5)" />
    </svg>
  ),
  beef: (
    /* Steak — thick cut of meat */
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10c0-3 3.5-6 8-6s8 3 8 6-3.5 5-8 5-8-2-8-5z" />
      <path d="M4 10c0 2 0 4 0 5 0 3 3.5 5 8 5s8-2 8-5c0-1 0-3 0-5" />
      <ellipse cx="12" cy="10" rx="3" ry="2" />
    </svg>
  ),
  lamb: (
    /* Lamb chop — rack of ribs shape */
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 6c0-1.5 2.5-3 6-3s6 1.5 6 3c0 2-1 5-2 7l-1 3H9l-1-3c-1-2-2-5-2-7z" />
      <line x1="9" y1="16" x2="8" y2="21" />
      <line x1="15" y1="16" x2="16" y2="21" />
      <line x1="10" y1="7" x2="10" y2="12" />
      <line x1="14" y1="7" x2="14" y2="12" />
    </svg>
  ),
  vegetables: (
    /* Broccoli — clear tree shape */
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7" r="3" />
      <circle cx="8" cy="9" r="3" />
      <circle cx="16" cy="9" r="3" />
      <circle cx="9.5" cy="12" r="2.5" />
      <circle cx="14.5" cy="12" r="2.5" />
      <rect x="11" y="14" width="2" height="7" rx="1" />
    </svg>
  ),
  low: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M8 13h8" />
      <circle cx="9" cy="10" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="15" cy="10" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  ),
  moderate: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 4v2l2 2-2 4h3l-4 8v-5H9l4-7V4z" />
    </svg>
  ),
  high: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  veryHigh: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  ),
  /* Disability & allergy icons */
  none: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <path d="M22 4L12 14.01l-3-3" />
    </svg>
  ),
  blind: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ),
  deaf: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8a6 6 0 00-9.33-5" />
      <path d="M2 2l20 20" />
      <path d="M6 8v1a6 6 0 006 6h0" />
      <path d="M17 14a3 3 0 01-3 3" />
      <path d="M9 21h6" />
    </svg>
  ),
  mobility: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="4" r="2" />
      <path d="M15 22v-4h-2l-1-4-4 1v4" />
      <path d="M9.5 10l3.5-1 2 4" />
      <path d="M6 14l3-1" />
    </svg>
  ),
  amputee: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 20a6 6 0 00-12 0" />
      <circle cx="12" cy="10" r="4" />
      <path d="M8 14v6" />
    </svg>
  ),
  epilepsy: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  anxiety: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M8 15s1.5-2 4-2 4 2 4 2" />
      <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2" />
      <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2" />
    </svg>
  ),
  other: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  allergyNone: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <path d="M22 4L12 14.01l-3-3" />
    </svg>
  ),
  grain: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21v-9" />
      <path d="M8 8c0 0 0 4 4 4s4-4 4-4" />
      <path d="M6 5c0 0 1 3 3 3" />
      <path d="M15 8c2 0 3-3 3-3" />
      <path d="M10 4c0 0 0 2 2 2s2-2 2-2" />
    </svg>
  ),
  dairy: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2h8l1 5H7l1-5z" />
      <path d="M7 7h10v3a8 8 0 01-1 4l-1 2v4H9v-4L8 14a8 8 0 01-1-4V7z" />
    </svg>
  ),
  eggs: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22c4.418 0 8-4.03 8-9S16.418 2 12 2 4 6.03 4 13s3.582 9 8 9z" />
      <circle cx="12" cy="14" r="3" />
    </svg>
  ),
  soy: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="9" cy="12" rx="3" ry="4" />
      <ellipse cx="15" cy="12" rx="3" ry="4" />
      <path d="M12 8V3" />
      <path d="M10 5l2-2 2 2" />
    </svg>
  ),
  fish: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 12c3-6 10-6 14-2-4 4-11 4-14-2 0 0 3 6 0 12" />
      <circle cx="16" cy="10" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  ),
  pollen: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  ),
  dust: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="1.5" />
      <circle cx="16" cy="10" r="1" />
      <circle cx="12" cy="16" r="2" />
      <circle cx="6" cy="14" r="1" />
      <circle cx="18" cy="16" r="1.5" />
    </svg>
  ),
  flea: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="14" rx="4" ry="6" />
      <circle cx="12" cy="6" r="3" />
      <path d="M5 10l3 2M19 10l-3 2M5 18l3-1M19 18l-3-1" />
    </svg>
  ),
};
