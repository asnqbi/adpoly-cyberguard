export type Member = {
  id: string;
  name: string;
  role: string;
  university: string;
  image: string;
  bio: string;
  skills: string[];
  certifications: string[];
  linkedin?: string;
  github?: string;
  email?: string;
};

export const team: Member[] = [
  {
    id: "abdulrahman",
    name: "Abdulrahman Saeed Alnaqbi",
    role: "Cybersecurity Student / Team Member",
    university: "Abu Dhabi Polytechnic",
    image: "/assets/team-members/abdulrahman.jpg",
    bio: "Information Security student with interests in red teaming, incident response, threat intelligence, AI security, and security automation.",
    skills: [
      "Red Teaming",
      "Penetration Testing",
      "SOC / Blue Team",
      "AI Security",
    ],
    certifications: [],
  },
  {
    id: "ahmed",
    name: "Ahmed Alhosani",
    role: "CyberSecurity Student / Team Member",
    university: "Abu Dhabi Polytechnic",
    image: "/assets/team-members/ahmed.png",
    bio: "CyberSecurity Student at Abu Dhabi Polytechnic and a member of ADPoly CyberGuard.",
    skills: [],
    certifications: [],
  },
  {
    id: "saif",
    name: "Saif Alazazi",
    role: "CyberSecurity Student / Team Member",
    university: "Abu Dhabi Polytechnic",
    image: "/assets/team-members/saif.jpg",
    bio: "CyberSecurity Student at Abu Dhabi Polytechnic and a member of ADPoly CyberGuard.",
    skills: [],
    certifications: [],
  },
];
