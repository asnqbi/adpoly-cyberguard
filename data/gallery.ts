export type GalleryImage = {
  src: string;
  alt: string;
  category: string;
  title: string;
};
// Add competition, award, presentation, and project images here when available.
export const gallery: GalleryImage[] = [
  {
    src: "/assets/team-members/abdulrahman.jpg",
    alt: "Portrait of Abdulrahman Saeed Alnaqbi",
    category: "Team",
    title: "Abdulrahman Saeed Alnaqbi",
  },
  {
    src: "/assets/team-members/ahmed.png",
    alt: "Portrait of Ahmed Alhosani",
    category: "Team",
    title: "Ahmed Alhosani",
  },
  {
    src: "/assets/team-members/saif.jpg",
    alt: "Portrait of Saif Alazazi",
    category: "Team",
    title: "Saif Alazazi",
  },
];
