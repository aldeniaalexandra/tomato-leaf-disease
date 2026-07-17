export type DiseaseGroup = "Fungal" | "Bacterial" | "Viral" | "Pest" | "None";

export interface DiseaseEntry {
  apiClass: string;
  name: string;
  agent: string;
  group: DiseaseGroup;
  description: string;
}

export const diseases: DiseaseEntry[] = [
  {
    apiClass: "Bacterial spot",
    name: "Bacterial Spot",
    agent: "Xanthomonas spp.",
    group: "Bacterial",
    description:
      "Small water-soaked spots that turn brown with yellow halos. Spreads rapidly in warm, wet conditions.",
  },
  {
    apiClass: "Early blight",
    name: "Early Blight",
    agent: "Alternaria solani",
    group: "Fungal",
    description:
      "Dark brown concentric rings forming a target pattern, usually starting on older leaves.",
  },
  {
    apiClass: "Late blight",
    name: "Late Blight",
    agent: "Phytophthora infestans",
    group: "Fungal",
    description:
      "Large water-soaked lesions that rapidly turn brown-black. Can destroy entire plants within days.",
  },
  {
    apiClass: "Leaf Mold",
    name: "Leaf Mold",
    agent: "Passalora fulva",
    group: "Fungal",
    description:
      "Yellow spots on the upper leaf surface with olive-green mold beneath. Common in humid greenhouses.",
  },
  {
    apiClass: "Septoria leaf spot",
    name: "Septoria Leaf Spot",
    agent: "Septoria lycopersici",
    group: "Fungal",
    description:
      "Small circular spots with dark borders and light centers, affecting lower leaves first.",
  },
  {
    apiClass: "Spider mites Two-spotted spider mite",
    name: "Two-Spotted Spider Mite",
    agent: "Tetranychus urticae",
    group: "Pest",
    description:
      "Tiny arachnids that cause stippled, yellowing leaves. Check leaf undersides for fine webbing.",
  },
  {
    apiClass: "Target Spot",
    name: "Target Spot",
    agent: "Corynespora cassiicola",
    group: "Fungal",
    description:
      "Brown lesions with concentric rings resembling a target. Affects leaves, stems, and fruit.",
  },
  {
    apiClass: "Tomato Yellow Leaf Curl Virus",
    name: "Yellow Leaf Curl Virus",
    agent: "Spread by whiteflies",
    group: "Viral",
    description:
      "Leaves curl upward and yellow at the margins. Stunts growth and severely reduces yield.",
  },
  {
    apiClass: "Tomato mosaic virus",
    name: "Mosaic Virus",
    agent: "Spread by contact",
    group: "Viral",
    description:
      "Mottled light and dark green patterns on leaves. Plants may be stunted with distorted fruit.",
  },
  {
    apiClass: "healthy",
    name: "Healthy",
    agent: "No pathogen detected",
    group: "None",
    description:
      "Normal coloration with no signs of infection, pest damage, or nutrient deficiency.",
  },
];

export function findDisease(apiClass: string): DiseaseEntry | undefined {
  return diseases.find(
    (d) => d.apiClass.toLowerCase() === apiClass.toLowerCase()
  );
}
