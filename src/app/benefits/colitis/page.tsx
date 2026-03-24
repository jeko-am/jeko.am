import HealthConditionPage from "@/components/HealthConditionPage";

export default function ColitisPage() {
  return (
    <HealthConditionPage
      condition="Colitis in dogs"
      tagline="& how diet can help"
      heroImage="https://images.unsplash.com/photo-1534361960057-19889db9621e?w=1600&h=800&fit=crop"
      heroDescription="Colitis is one of the most common digestive conditions in dogs. The right nutrition can reduce flare-ups and support your dog's gut health naturally."
      whatIsTitle="What is colitis in dogs?"
      whatIsText={[
        "Colitis refers to inflammation of the colon (large intestine). It can be acute, meaning it comes on suddenly and resolves quickly, or chronic, where symptoms persist over weeks or months. It affects dogs of all ages and breeds.",
        "The condition disrupts normal water absorption in the colon, leading to loose stools, urgency, and discomfort. While it can have many triggers — from stress and infections to dietary intolerances — what your dog eats plays a central role in managing it.",
        "Many dogs with colitis see significant improvement simply by switching to a gentle, natural diet that avoids common inflammatory ingredients found in highly processed kibble.",
      ]}
      symptoms={[
        {
          icon: "💩",
          title: "Soft or watery stools",
          description:
            "Frequent loose stools, often with mucus or small amounts of bright red blood, are the hallmark sign of colitis.",
        },
        {
          icon: "😣",
          title: "Straining to go",
          description:
            "Your dog may strain or take longer than usual when going to the toilet, even if very little is produced.",
        },
        {
          icon: "🚨",
          title: "Increased urgency",
          description:
            "Needing to go outside more frequently or having accidents indoors can indicate colon inflammation.",
        },
        {
          icon: "😔",
          title: "Flatulence & discomfort",
          description:
            "Excessive gas, rumbling stomach sounds, and general signs of tummy discomfort are common.",
        },
        {
          icon: "🍽️",
          title: "Reduced appetite",
          description:
            "Some dogs may eat less or show reluctance at mealtimes when experiencing a flare-up.",
        },
        {
          icon: "😴",
          title: "Lethargy",
          description:
            "During episodes, your dog may seem more tired than usual and less interested in play or walks.",
        },
      ]}
      howDietHelpsTitle="Managing colitis with"
      howDietHelpsText="Diet is considered one of the most important factors in managing colitis. Highly processed foods with artificial additives, fillers, and low-quality proteins can aggravate the colon lining. A natural, gently prepared diet is far easier on the gut."
      foodBenefits={[
        {
          title: "Highly digestible ingredients",
          description:
            "Natural whole foods are gentler on inflamed gut tissue than heavily processed alternatives.",
        },
        {
          title: "No artificial additives",
          description:
            "Removing preservatives, colourings, and flavour enhancers eliminates common irritation triggers.",
        },
        {
          title: "Quality single-source protein",
          description:
            "Single protein recipes help identify and avoid specific ingredients that may cause reactions.",
        },
        {
          title: "Natural fibre balance",
          description:
            "The right blend of soluble and insoluble fibre supports healthy colon function and stool consistency.",
        },
      ]}
      foodImage="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=600&fit=crop"
      testimonial={{
        quote:
          "Our Labrador suffered with colitis for over a year. We tried multiple prescription diets with little improvement. Within two weeks of switching to natural food, the difference was remarkable. No more runny stools, no more midnight dashes to the garden. She's like a different dog.",
        name: "Rachel & Poppy",
        image:
          "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop",
      }}
      faqs={[
        {
          question: "Can diet alone cure colitis in dogs?",
          answer:
            "While diet is a key factor in managing colitis, it depends on the underlying cause. Diet-related colitis often resolves completely with the right food. However, if colitis is caused by infection, parasites, or an autoimmune condition, your vet may recommend additional treatment alongside dietary changes.",
        },
        {
          question: "What proteins are best for dogs with colitis?",
          answer:
            "Easily digestible, lean proteins like turkey, chicken, and white fish tend to work well. Some dogs benefit from novel proteins they haven't eaten before, such as duck or game, to reduce the chance of a sensitivity reaction.",
        },
        {
          question: "How quickly will I see improvement after a diet change?",
          answer:
            "Many owners report improvements within 1-2 weeks of switching to a natural, gentle diet. However, chronic colitis may take 4-6 weeks to show consistent improvement. A gradual transition over 7-10 days is recommended.",
        },
        {
          question: "Should I avoid grain in my dog's food if they have colitis?",
          answer:
            "Not necessarily. While some dogs with colitis are sensitive to certain grains, others tolerate them well. The bigger factor is usually the overall quality and digestibility of the food rather than the presence of grain alone.",
        },
      ]}
    />
  );
}
