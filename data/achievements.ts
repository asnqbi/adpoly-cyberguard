export type Achievement = {
  year: number;
  competition: string;
  placement: string;
  project: string;
  description: string;
  image?: string;
  organization: string;
  link: string;
};
export const achievements: Achievement[] = [
  {
    year: 2026,
    competition: "School of Cyber Defense",
    placement: "3rd Place",
    project: "DoS Stress-Testing & Auto-Mitigation for AI Inference Servers",
    description:
      "Applying cybersecurity to a real-world AI infrastructure challenge, and presenting our solution to security and technology professionals.",
    organization: "GISEC Global 2026",
    link: "/projects/ai-inference-defense",
  },
];
