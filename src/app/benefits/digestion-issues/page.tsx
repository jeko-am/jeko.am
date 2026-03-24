import HealthConditionPage from "@/components/HealthConditionPage";

export default function DigestionIssuesPage() {
  return (
    <HealthConditionPage
      condition="Digestion issues"
      tagline="in dogs"
      heroImage="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1600&h=800&fit=crop"
      heroDescription="Digestive problems are one of the top reasons dogs visit the vet. A natural, wholesome diet can transform your dog's digestion and overall wellbeing."
      whatIsTitle="Understanding digestive issues in dogs"
      whatIsText={[
        "Digestive issues in dogs cover a wide range of symptoms — from occasional upset stomachs to chronic conditions like irritable bowel syndrome (IBS), food sensitivities, and malabsorption. They can affect the stomach, small intestine, large intestine, or a combination.",
        "Many digestive problems are directly linked to diet. Highly processed commercial foods often contain ingredients that are difficult for dogs to break down: artificial preservatives, low-quality meat meals, excessive fillers, and ingredients produced through high-temperature extrusion.",
        "The good news is that many dogs with chronic digestive issues see dramatic improvement when switched to a natural, minimally processed diet made from real, recognisable ingredients.",
      ]}
      symptoms={[
        {
          icon: "🤢",
          title: "Vomiting",
          description:
            "Occasional or regular vomiting, especially after meals, may indicate that food is too harsh on the stomach.",
        },
        {
          icon: "💩",
          title: "Inconsistent stools",
          description:
            "Alternating between firm and loose stools, or stools that vary in colour and consistency from day to day.",
        },
        {
          icon: "💨",
          title: "Excessive wind",
          description:
            "Frequent flatulence is often a sign that food isn't being properly digested and is fermenting in the gut.",
        },
        {
          icon: "🔊",
          title: "Gurgling stomach",
          description:
            "Loud stomach noises (borborygmi) suggest that the digestive system is working overtime to process food.",
        },
        {
          icon: "🌿",
          title: "Grass eating",
          description:
            "Dogs often eat grass to soothe an upset stomach. If it happens regularly, it may point to chronic discomfort.",
        },
        {
          icon: "⚖️",
          title: "Weight changes",
          description:
            "Unexplained weight loss or difficulty maintaining weight can indicate poor nutrient absorption.",
        },
      ]}
      howDietHelpsTitle="Better digestion starts with"
      howDietHelpsText="The majority of a dog's immune system resides in the gut. When you feed highly digestible, natural ingredients, you're supporting the entire body — not just the stomach. Removing inflammatory, heavily processed ingredients lets the digestive system heal and function as it should."
      foodBenefits={[
        {
          title: "Gently prepared whole foods",
          description:
            "Low-temperature preparation preserves natural nutrients and enzymes, making food far easier to digest.",
        },
        {
          title: "No artificial nasties",
          description:
            "Eliminating artificial colours, flavours, and preservatives removes common digestive irritants.",
        },
        {
          title: "Real, recognisable ingredients",
          description:
            "Every ingredient in a natural diet is one you'd recognise — real meat, vegetables, and fruit.",
        },
        {
          title: "Tailored portions",
          description:
            "Personalised serving sizes prevent overfeeding, a common cause of digestive upset in dogs.",
        },
      ]}
      foodImage="https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=800&h=600&fit=crop"
      testimonial={{
        quote:
          "We tried everything for our Spaniel's constant stomach issues — prescription diets, probiotics, even medication. Nothing worked long-term. Switching to natural food was a game changer. Within days the gurgling stopped, his stools firmed up, and he actually started enjoying mealtimes again.",
        name: "Mark, Jenny & Archie",
        image:
          "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=200&h=200&fit=crop",
      }}
      faqs={[
        {
          question: "How do I know if my dog's digestion issues are food-related?",
          answer:
            "If your dog's symptoms are chronic (lasting more than a few days), occur regularly after eating, or haven't responded to veterinary treatment, diet is very likely a contributing factor. A food trial with a natural, limited-ingredient diet for 4-6 weeks is one of the best ways to find out.",
        },
        {
          question: "How should I transition my dog to a new food?",
          answer:
            "A gradual transition over 7-10 days is ideal. Start by mixing 25% new food with 75% old food, then slowly increase the proportion. Dogs with sensitive stomachs may benefit from an even slower transition over 2 weeks.",
        },
        {
          question: "Can puppies have digestive issues too?",
          answer:
            "Yes, puppies are actually more prone to digestive upset as their gut flora is still developing. Feeding a high-quality, natural diet from a young age helps establish a healthy gut microbiome and can prevent issues later in life.",
        },
        {
          question: "Are probiotics helpful for dogs with digestion issues?",
          answer:
            "Probiotics can be beneficial, especially during dietary transitions or after antibiotic treatment. However, the most impactful change is usually the food itself. A natural diet rich in fibre and nutrients supports healthy gut bacteria naturally.",
        },
      ]}
    />
  );
}
