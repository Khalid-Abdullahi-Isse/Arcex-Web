// Exact spellings matter: the backend filters listings by exact string
// equality on region, and the seed data uses these Somali names.
export const SOMALIA_REGIONS = [
  "Awdal",
  "Bakool",
  "Banaadir",
  "Bari",
  "Bay",
  "Galguduud",
  "Gedo",
  "Hiiraan",
  "Jubbada Dhexe",
  "Jubbada Hoose",
  "Mudug",
  "Nugaal",
  "Sanaag",
  "Shabeellaha Dhexe",
  "Shabeellaha Hoose",
  "Sool",
  "Togdheer",
  "Woqooyi Galbeed",
] as const;

export type SomaliaRegion = (typeof SOMALIA_REGIONS)[number];

const DOT_PALETTE = [
  "#AFA9EC",
  "#5DCAA5",
  "#F0997B",
  "#B4B2A9",
  "#F5C842",
  "#60A5FA",
  "#A78BFA",
  "#34D399",
  "#FB923C",
  "#F472B6",
  "#A3E635",
  "#FCD34D",
  "#C084FC",
];

export function regionDotColor(region: string): string {
  const index = SOMALIA_REGIONS.indexOf(region as SomaliaRegion);
  if (index === -1) return "#B4B2A9";
  return DOT_PALETTE[index % DOT_PALETTE.length];
}
