export type ProvinceInfo = {
  score: number;
  status: "Aman" | "Waspada" | "Rawan";
  recommendation: string;
  substitution: string;
  production: number;
  demand: number;
  priceIndex: number;
  topCommodity: string;
  cluster: "surplus" | "stabil" | "rentan";
  riskFactors: string[];
  shapFactors: { label: string; value: number; direction: "pos" | "neg" }[];
};