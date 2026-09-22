export const categories = [
  "All",
  "Cybersecurity",
  "AI",
  "CTF",
  "Hackathon",
  "Innovation",
] as const;
export type Category = (typeof categories)[number];
export type Competition = {
  name: string;
  event: string;
  organizer?: string;
  date: string;
  location?: string;
  categories: Category[];
  members: string[];
  project: string;
  projectLink?: string;
  exactDate?: string;
  result: string;
  website?: string;
};
export const competitions: Competition[] = [
  {
    name: "School of Cyber Defense",
    event: "GISEC Global",
    organizer: undefined,
    date: "2026",
    location: undefined,
    categories: ["Cybersecurity", "AI"],
    members: ["Abdulrahman Saeed Alnaqbi", "Ahmed Alhosani", "Saif Alazazi"],
    project: "DoS Stress-Testing & Auto-Mitigation for AI Inference Servers",
    projectLink: "/projects/ai-inference-defense",
    result: "3rd Place",
  },
];
