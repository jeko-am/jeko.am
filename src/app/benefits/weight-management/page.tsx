import HealthConditionPage from "@/components/HealthConditionPage";

export default function WeightManagementPage() {
  return (
    <HealthConditionPage pageSlug="/benefits/weight-management"
      condition="Weight management"
      tagline="for dogs"
      heroImage="https://images.unsplash.com/photo-1544568100-847a948585b9?w=1600&h=800&fit=crop"
      heroDescription="Over half of UK dogs are overweight. A natural, portion-controlled diet is the most effective way to help your dog reach and maintain a healthy weight."
      whatIsTitle="Why weight matters for your dog"
      whatIsText={[
        "Obesity is now the most common nutritional disorder in dogs. Studies suggest that over 50% of dogs in the UK are carrying excess weight. It's a serious health issue that can shorten your dog's life by up to two years and significantly reduce their quality of life.",
        "Carrying extra weight puts strain on joints, increases the risk of diabetes, heart disease, and certain cancers, and makes breathing harder — especially for flat-faced breeds. Even being slightly overweight can have a measurable impact on mobility and energy levels.",
        "The cause is almost always simple: too many calories in, not enough energy out. But the type of food matters enormously too. Highly processed foods with fillers and low-quality carbohydrates can leave dogs feeling hungry even when they've eaten enough calories, leading to overeating.",
      ]}
      symptoms={[
        {
          icon: "👀",
          title: "No visible waist",
          description:
            "When viewed from above, a healthy dog should have a visible waist behind the ribs. If the body is oval or barrel-shaped, they may be overweight.",
        },
        {
          icon: "🦴",
          title: "Can't feel ribs easily",
          description:
            "You should be able to feel your dog's ribs with gentle pressure. If you need to press firmly, there's likely excess fat covering them.",
        },
        {
          icon: "😮‍💨",
          title: "Getting tired quickly",
          description:
            "If your dog tires easily on walks, pants heavily, or seems reluctant to exercise, excess weight may be the cause.",
        },
        {
          icon: "🐌",
          title: "Difficulty moving",
          description:
            "Struggling to get up, reluctance to climb stairs, or stiffness after rest can indicate weight-related joint strain.",
        },
        {
          icon: "😴",
          title: "Sleeping more",
          description:
            "Overweight dogs often sleep more and show less interest in play and activity than they used to.",
        },
        {
          icon: "🍽️",
          title: "Always hungry",
          description:
            "Constant begging or food-seeking behaviour can indicate that current food isn't providing the right nutrients despite having enough calories.",
        },
      ]}
      howDietHelpsTitle="Healthy weight through"
      howDietHelpsText="The best weight management approach isn't about feeding less of the same food — it's about feeding the right food. Natural, nutrient-dense meals satisfy your dog with quality ingredients, so they feel fuller for longer without excess empty calories."
      foodBenefits={[
        {
          title: "Personalised portions",
          description:
            "Meals tailored to your dog's exact breed, age, weight, and activity level — no guesswork, no overfeeding.",
        },
        {
          title: "High-quality protein",
          description:
            "Real meat protein helps maintain lean muscle mass while your dog loses fat, keeping their metabolism healthy.",
        },
        {
          title: "No fillers or empty calories",
          description:
            "No cheap bulking agents, excess starch, or artificial ingredients that add calories without nutrition.",
        },
        {
          title: "Natural satiety",
          description:
            "Whole food ingredients with natural fibre help your dog feel satisfied after meals, reducing begging and food-seeking.",
        },
      ]}
      foodImage="https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&h=600&fit=crop"
      testimonial={{
        quote:
          "Our Beagle was 4kg overweight and it was affecting his joints. We'd tried reducing his kibble but he was miserable and always hungry. Switching to natural food was transformative — he lost the weight gradually over 4 months, and he actually eats more volume than before because the food is so much less calorie-dense. He runs around like a puppy again.",
        name: "Tom, Lisa & Baxter",
        image:
          "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=200&h=200&fit=crop",
      }}
      faqs={[
        {
          question: "How do I know if my dog is overweight?",
          answer:
            "The best method is a body condition score. From above, your dog should have a visible waist. From the side, their belly should tuck up behind the ribcage. You should be able to feel their ribs with light pressure. Your vet can give a precise assessment and target weight.",
        },
        {
          question: "How quickly should my dog lose weight?",
          answer:
            "Healthy weight loss for dogs is 1-2% of their body weight per week. For a 20kg dog, that's around 200-400g per week. Faster weight loss can cause muscle wastage and other health problems. Patience and consistency are key.",
        },
        {
          question: "Should I just feed less of their current food?",
          answer:
            "Simply reducing portions of an existing food can leave your dog deficient in essential nutrients while still feeling hungry. It's more effective to switch to a nutrient-dense, natural food with personalised portions — your dog gets all the nutrition they need in the right number of calories.",
        },
        {
          question: "How much exercise does my overweight dog need?",
          answer:
            "Start gently, especially if your dog has joint issues. Begin with short, frequent walks and gradually increase duration and intensity as they lose weight. Swimming is excellent for overweight dogs as it's low-impact. Diet changes typically account for 70-80% of weight loss, with exercise supporting the rest.",
        },
      ]}
      accentColor="#F2A900"
    />
  );
}
