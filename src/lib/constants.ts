export const COMMON_BREEDS = [
  "Affenpinscher", "Afghan Hound", "Airedale Terrier", "Akita", "Akita Inu", "Alaskan Klee Kai", "Alaskan Malamute", "American Akita", "American Cocker Spaniel", "American Eskimo Dog", "American Foxhound", "American Staffordshire Terrier", "Anatolian Shepherd", "Appenzell Mountain Dog", "Australian Shepherd", "Basenji", "Basset Bleu de Gascogne", "Basset Fauve de Bretagne", "Basset Hound", "Beagle", "Beagle-Harrier", "Bearded Collie", "Bedlington Terrier", "Belgian Malinois", "Belgian Shepherd", "Bernese Mountain Dog", "Bernedoodle", "Bichon Frise", "Black and Tan Coonhound", "Black Russian Terrier", "Bluetick Coonhound", "Boerboel", "Border Collie", "Border Terrier", "Borzoi", "Boston Terrier", "Boxer", "Boxer Mix", "Bracco Italiano", "Brittany", "Brittany Spaniel", "Brussels Griffon", "Bulldog", "Bullmastiff", "Bull Terrier", "Cairn Terrier", "Cane Corso", "Cardigan Welsh Corgi", "Caucasian Shepherd Dog", "Cavalier King Charles Spaniel", "Cesky Terrier", "Chesapeake Bay Retriever", "Chihuahua", "Chinese Crested Dog", "Chow Chow", "Clumber Spaniel", "Cocker Spaniel", "Cockapoo", "Coton de Tulear", "Crossbreed", "Curly-Coated Retriever", "Dachshund", "Dalmatian", "Dandie Dinmont Terrier", "Deerhound", "Doberman", "Doberman Pinscher", "Dogo Argentino", "Doodle Mix", "Drever", "English Cocker Spaniel", "English Foxhound", "English Pointer", "English Setter", "English Sheepdog", "English Springer Spaniel", "English Water Spaniel", "Entlebucher Mountain Dog", "Field Spaniel", "Fawn Hound", "Finnish Lapphund", "Finnish Spitz", "Flat-Coated Retriever", "French Bulldog", "French Mastiff", "German Longhaired Pointer", "German Shepherd", "German Shorthaired Pointer", "German Wirehaired Pointer", "Glen of Imaal Terrier", "Goldendoodle", "Golden Retriever", "Gordon Setter", "Greater Swiss Mountain Dog", "Great Dane", "Great Pyrenees", "Greyhound", "Griffon Bruxellois", "Harrier", "Havanese", "Hungarian Vizsla", "Hungarian Wirehaired Vizsla", "Husky Mix", "Ibizan Hound", "Icelandic Sheepdog", "Irish Red and White Setter", "Irish Setter", "Irish Terrier", "Irish Water Spaniel", "Irish Wolfhound", "Italian Greyhound", "Jack Russell Terrier", "Japanese Chin", "Japanese Spitz", "Japanese Terrier", "Kangal Dog", "Keeshond", "Kerry Blue Terrier", "King Charles Spaniel", "Komondor", "Kuvasz", "Labradoodle", "Labrador Retriever", "Lagotto Romagnolo", "Lakeland Terrier", "Lhasa Apso", "Long-Haired Chihuahua", "Long-Haired Dachshund", "Maltese", "Maltipoo", "Manchester Terrier", "Miniature American Shepherd", "Miniature Australian Shepherd", "Miniature Bull Terrier", "Miniature Dachshund", "Miniature Pinscher", "Miniature Schnauzer", "Mi-Ki", "Mixed Breed", "Mongrel", "Morkie", "Mudi", "Neapolitan Mastiff", "Newfoundland", "Norfolk Terrier", "Norwegian Elkhound", "Norwich Terrier", "Nova Scotia Duck Tolling Retriever", "Old English Sheepdog", "Otterhound", "Papillon", "Parson Russell Terrier", "Patterdale Terrier", "Pekingese", "Pembroke Welsh Corgi", "Phalène", "Pharaoh Hound", "Pinscher", "Plott Hound", "Polish Lowland Sheepdog", "Pomeranian", "Pomsky", "Poodle", "Portuguese Mastiff", "Portuguese Water Dog", "Pug", "Puggle", "Rat Terrier", "Redbone Coonhound", "Retriever Mix", "Rhodesian Ridgeback", "Rottweiler", "St. Bernard", "Saluki", "Samoyed", "Schnauzer", "Schnoodle", "Scottish Deerhound", "Scottish Terrier", "Segugio Italiano", "Shar Pei", "Shetland Sheepdog", "Shiba Inu", "Shih Tzu", "Sheepadoodle", "Skye Terrier", "Smooth-Coated Chihuahua", "Smooth-Haired Dachshund", "Soft Coated Wheaten Terrier", "Spanish Mastiff", "Spaniel Mix", "Spinone Italiano", "Springer Spaniel", "Staffordshire Bull Terrier", "Standard Dachshund", "Standard Poodle", "Standard Schnauzer", "Staghound", "Sussex Spaniel", "Swedish Elkhound", "Swedish Lapphund", "Tibetan Mastiff", "Tibetan Spaniel", "Tibetan Terrier", "Toy Australian Terrier", "Toy Fox Terrier", "Toy Manchester Terrier", "Toy Poodle", "Toy Spitz", "Tosa Inu", "Treeing Walker Coonhound", "Vizsla", "Welsh Corgi", "Welsh Springer Spaniel", "Weimaraner", "West Highland White Terrier", "Wheaten Terrier", "Whippet", "Wirehaired Dachshund", "Wirehaired Pointing Griffon", "Wire Fox Terrier", "Xoloitzcuintli", "Yorkshire Terrier", "Yorkie Poo"
];

export const PET_TYPES = ["Dog", "Cat", "Other"] as const;

export const DIET_PREFERENCES = ["Raw", "Kibble", "Mixed", "Homemade", "Natural", "Chicken", "Beef", "Lamb", "Vegetables"] as const;

export const ACTIVITY_LEVELS = ["Low", "Moderate", "High", "Very High"] as const;

export const TEMPERAMENTS = ["Calm", "Playful", "Energetic", "Shy", "Protective", "Friendly"] as const;

export const WALK_PREFERENCES = ["Morning", "Evening", "Both", "Anytime"] as const;

export const FAVORITE_ACTIVITIES = [
  "Fetch", "Swimming", "Hiking", "Cuddling", "Agility", "Running",
  "Playing with other dogs", "Chasing squirrels", "Napping", "Car rides",
] as const;

export const DISABILITIES = ["None", "Blind", "Deaf", "Mobility Issues", "Amputee", "Epilepsy", "Anxiety", "Other"] as const;

export const ALLERGIES = ["None", "Chicken", "Beef", "Grain", "Dairy", "Eggs", "Soy", "Fish", "Pollen", "Dust", "Flea", "Other"] as const;

export const COUNTRIES = [
  "United Kingdom", "United States", "Canada", "Australia", "Ireland",
  "Germany", "France", "Netherlands", "Spain", "Italy", "Sweden", "Norway",
  "Denmark", "Belgium", "Switzerland", "Austria", "New Zealand", "Other",
] as const;
