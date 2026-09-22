export type Project = {
  id: string;
  title: string;
  shortTitle: string;
  category: string;
  description: string;
  problem: string;
  solution: string;
  architecture: string[];
  technologies: string[];
  results: string;
  competition: string;
  placement: string;
  year: number;
  areas: string[];
  images: { src: string; alt: string }[];
};
export const projects: Project[] = [
  {
    id: "ai-inference-defense",
    title: "DoS Stress-Testing & Auto-Mitigation for AI Inference Servers",
    shortTitle: "Building resilience into AI infrastructure.",
    category: "AI Security / Cyber Defense",
    description:
      "Exploring how AI services can stay resilient under pressure through stress-testing, resource monitoring, and automated defense.",
    problem:
      "AI inference servers can become targets of Denial-of-Service attacks that consume computational resources and disrupt AI services.",
    solution:
      "Our project explored stress-testing AI inference infrastructure and automatically detecting and responding to abnormal resource usage and attack behavior.",
    architecture: [
      "Stress-test",
      "Monitor resources",
      "Detect anomalies",
      "Auto-mitigate",
    ],
    technologies: [],
    results:
      "The team developed and demonstrated the solution at the School of Cyber Defense, earning 3rd place. Quantitative performance results have not been published.",
    competition: "School of Cyber Defense · GISEC Global 2026",
    placement: "3rd Place",
    year: 2026,
    areas: [
      "DoS Simulation",
      "Resource Monitoring",
      "Attack Detection",
      "Automated Mitigation",
      "System Availability",
      "Security Automation",
    ],
    images: [],
  },
];
