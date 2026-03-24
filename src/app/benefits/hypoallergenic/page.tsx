import HealthConditionPage from "@/components/HealthConditionPage";

export default function HypoallergenicPage() {
  return (
    <HealthConditionPage
      condition="Hypoallergenic"
      tagline="dog food"
      heroImage="https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=1600&h=800&fit=crop"
      heroDescription="Food allergies and intolerances affect more dogs than you might think. A natural, hypoallergenic diet with limited ingredients can bring lasting relief."
      whatIsTitle="What does hypoallergenic mean for dogs?"
      whatIsText={[
        "A hypoallergenic diet is one designed to minimise the risk of triggering an allergic reaction. In dogs, food allergies are typically reactions to specific proteins — most commonly beef, dairy, wheat, chicken, and soy. These reactions develop over time with repeated exposure.",
        "It's worth noting the difference between a true food allergy (an immune system response) and a food intolerance (a digestive issue). Both can cause discomfort, but allergies tend to also affect the skin and ears, while intolerances are usually limited to gut symptoms.",
        "The best approach to managing food-related allergies is an elimination diet using novel or limited ingredients that your dog hasn't been exposed to before, combined with avoiding the artificial additives and fillers that can worsen inflammatory responses.",
      ]}
      symptoms={[
        {
          icon: "🐾",
          title: "Itchy skin & paws",
          description:
            "Persistent scratching, licking paws, or rubbing the face against furniture are classic signs of a food allergy.",
        },
        {
          icon: "👂",
          title: "Recurring ear infections",
          description:
            "Chronic ear infections that keep coming back, even with treatment, are often linked to food sensitivities.",
        },
        {
          icon: "🔴",
          title: "Red, inflamed skin",
          description:
            "Hot spots, rashes, or reddened skin — particularly around the belly, groin, and armpits.",
        },
        {
          icon: "💩",
          title: "Digestive upset",
          description:
            "Loose stools, excessive gas, or vomiting alongside skin symptoms can indicate a food allergy.",
        },
        {
          icon: "🦠",
          title: "Skin infections",
          description:
            "Repeated bacterial or yeast skin infections may be driven by an underlying allergic response to food.",
        },
        {
          icon: "😿",
          title: "Dull, flaky coat",
          description:
            "A coat that has lost its shine, with dandruff or excessive shedding, may point to dietary issues.",
        },
      ]}
      howDietHelpsTitle="Relief through"
      howDietHelpsText="Many commercial dog foods contain a long list of ingredients — any one of which could be triggering a reaction. A natural, limited-ingredient diet makes it easier to identify and eliminate problem foods while providing complete, balanced nutrition."
      foodBenefits={[
        {
          title: "Limited, transparent ingredients",
          description:
            "Fewer ingredients means fewer potential triggers. Every ingredient is listed clearly — no hidden nasties.",
        },
        {
          title: "Novel protein options",
          description:
            "Proteins like duck, game, and salmon that many dogs haven't eaten before, reducing the chance of an existing sensitivity.",
        },
        {
          title: "No common allergens",
          description:
            "Recipes free from common triggers like beef, dairy, wheat, soy, and artificial additives.",
        },
        {
          title: "Anti-inflammatory nutrients",
          description:
            "Natural omega fatty acids and antioxidants from real ingredients help calm inflammatory responses.",
        },
      ]}
      foodImage="https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800&h=600&fit=crop"
      testimonial={{
        quote:
          "Our French Bulldog was constantly scratching and had ear infections every few weeks. The vet suspected food allergies but prescription diets didn't fully resolve it. We switched to a natural duck recipe and within a month, the itching stopped and her ears cleared up. She hasn't had an infection since.",
        name: "Sophie & Lola",
        image:
          "https://images.unsplash.com/photo-1534361960057-19889db9621e?w=200&h=200&fit=crop",
      }}
      faqs={[
        {
          question: "How do I find out which ingredient my dog is allergic to?",
          answer:
            "The gold standard is an elimination diet. Feed your dog a single novel protein source they haven't eaten before for 8-12 weeks. Once symptoms resolve, you can reintroduce ingredients one at a time to identify the culprit. Your vet can guide you through this process.",
        },
        {
          question: "Is grain the most common allergen in dogs?",
          answer:
            "Contrary to popular belief, grain allergies are actually quite rare in dogs. The most common food allergens are proteins — particularly beef, dairy, and chicken. That said, every dog is different, and some may genuinely be sensitive to certain grains.",
        },
        {
          question: "Can my dog develop allergies later in life?",
          answer:
            "Yes, food allergies typically develop after prolonged exposure to an ingredient — often over months or years. A dog that has eaten the same food without issues for years can suddenly develop a sensitivity to one of its ingredients.",
        },
        {
          question:
            "What's the difference between hypoallergenic and grain-free food?",
          answer:
            "Grain-free simply means no grain is used. Hypoallergenic means the food is designed to minimise allergic reactions overall — using limited, novel ingredients and avoiding common allergens. A food can be grain-free but not hypoallergenic if it still contains common allergens like beef or dairy.",
        },
      ]}
      accentColor="#5F295E"
    />
  );
}
