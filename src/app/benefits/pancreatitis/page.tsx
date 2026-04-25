import HealthConditionPage from "@/components/HealthConditionPage";

export default function PancreatitisPage() {
  return (
    <HealthConditionPage pageSlug="/benefits/pancreatitis"
      condition="Pancreatitis"
      tagline="& your dog's diet"
      heroImage="https://images.unsplash.com/photo-1522276498395-f4f68f7f8454?w=1600&h=800&fit=crop"
      heroDescription="Pancreatitis can be painful and distressing for your dog. A low-fat, natural diet is essential for managing the condition and preventing future episodes."
      whatIsTitle="What is pancreatitis in dogs?"
      whatIsText={[
        "Pancreatitis is the inflammation of the pancreas — the organ responsible for producing digestive enzymes and insulin. When inflamed, digestive enzymes activate prematurely and begin to digest the pancreas itself, causing pain and damage.",
        "It can range from mild to life-threatening. Acute pancreatitis comes on suddenly and can be a medical emergency, while chronic pancreatitis involves recurring low-grade inflammation over time. Both forms require careful dietary management.",
        "High-fat diets are one of the most common triggers. Dogs who eat rich, fatty foods — whether from their regular diet, table scraps, or raiding the bin — are at significantly higher risk. Miniature Schnauzers, Cocker Spaniels, and overweight dogs are particularly prone.",
      ]}
      symptoms={[
        {
          icon: "🤮",
          title: "Vomiting",
          description:
            "Repeated vomiting is one of the most common signs. It may come on suddenly and can be severe during an acute episode.",
        },
        {
          icon: "😖",
          title: "Abdominal pain",
          description:
            "Your dog may hunch over, adopt a 'prayer position' (front end down, back end up), or whimper when their belly is touched.",
        },
        {
          icon: "🍽️",
          title: "Loss of appetite",
          description:
            "Refusing food or turning away from meals they'd normally enjoy is a key warning sign.",
        },
        {
          icon: "😴",
          title: "Lethargy",
          description:
            "Unusual tiredness, reluctance to move, or generally seeming 'off' often accompanies pancreatitis.",
        },
        {
          icon: "💩",
          title: "Diarrhoea",
          description:
            "Loose, greasy-looking stools or diarrhoea may occur alongside vomiting during a flare-up.",
        },
        {
          icon: "🌡️",
          title: "Fever",
          description:
            "A raised temperature can indicate acute inflammation. If your dog feels unusually warm, contact your vet.",
        },
      ]}
      howDietHelpsTitle="Managing pancreatitis with"
      howDietHelpsText="Diet is the cornerstone of pancreatitis management. A low-fat, highly digestible diet reduces the workload on the pancreas, allowing it to heal and reducing the risk of future episodes. Natural, gently prepared food is far gentler than processed alternatives."
      foodBenefits={[
        {
          title: "Low-fat recipes",
          description:
            "Carefully formulated recipes with controlled fat levels to prevent overtaxing the pancreas.",
        },
        {
          title: "Easily digestible",
          description:
            "Natural, gently prepared ingredients that require minimal digestive effort, letting the pancreas rest.",
        },
        {
          title: "No fatty additives",
          description:
            "No added oils, animal fats, or greasy by-products that could trigger a flare-up.",
        },
        {
          title: "Consistent, measured meals",
          description:
            "Personalised portions prevent overeating — another common trigger for pancreatitis episodes.",
        },
      ]}
      foodImage="https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&h=600&fit=crop"
      testimonial={{
        quote:
          "Our Miniature Schnauzer had two severe pancreatitis episodes in one year. The vet said diet was critical going forward. We switched to a natural, low-fat recipe and she hasn't had a single episode in over 18 months. Her energy is back, she loves her food, and we have peace of mind at every meal.",
        name: "David & Tilly",
        image:
          "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=200&h=200&fit=crop",
      }}
      faqs={[
        {
          question: "What fat level is safe for dogs with pancreatitis?",
          answer:
            "Most vets recommend a diet with less than 10% fat on a dry matter basis for dogs prone to pancreatitis. Some dogs with severe or recurrent pancreatitis may need even lower fat levels. Always consult your vet for specific guidance for your dog.",
        },
        {
          question: "Can pancreatitis be cured?",
          answer:
            "Acute pancreatitis can resolve fully with appropriate treatment and dietary management. However, dogs who have had pancreatitis are more prone to future episodes. Consistent dietary management — particularly a low-fat, natural diet — is the best way to prevent recurrence.",
        },
        {
          question: "Are certain breeds more prone to pancreatitis?",
          answer:
            "Yes. Miniature Schnauzers are particularly susceptible due to their tendency toward high blood fat levels. Cocker Spaniels, Yorkshire Terriers, and Cavalier King Charles Spaniels also have higher rates. Overweight dogs of any breed are at increased risk.",
        },
        {
          question: "Can I give treats to a dog with pancreatitis?",
          answer:
            "Yes, but they must be low-fat. Avoid any fatty treats, chews with added oils, or table scraps. Small pieces of lean cooked chicken, carrot sticks, or purpose-made low-fat treats are safer options. Always account for treats in your dog's daily food allowance.",
        },
      ]}
      accentColor="#E65A1E"
    />
  );
}
