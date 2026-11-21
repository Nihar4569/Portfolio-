const albums = [
  {
    id: "college-friends",
    title: "College Friends",
    description: "Memories with my amazing friends at Siksha 'O' Anusandhan University",
    coverImage: "/images/albums/soa/cover.avif",
    photoCount: 27,
    secretCode: "soa2021",
    lock: false,
    photoDirectory: "/images/albums/soa"
  },
  {
    id: "hackathon-journey",
    title: "Hackathon Journey",
    description: "Our journey to winning the Smart India Hackathon 2022",
    coverImage: "/images/albums/sih/cover.avif",
    photoCount: 8,
    secretCode: "sih2022",
    lock: false,
    photoDirectory: "/images/albums/sih"
  },
  {
    id: "school-memories",
    title: "School Memories",
    description: "Precious memories from Sri Chaitanya Techno School and Sri Sathya Sai Vidya Mandir",
    secretCode: "school2019",
    lock: true,
    photoDirectory: "/images/albums/school-memories"
  },
  {
    id: "hometown",
    title: "Hometown Memories",
    description: "Beautiful moments from Bhawanipatna, Odisha",
    secretCode: "home2020",
    lock: true,
    photoDirectory: "/images/albums/hometown"
  }
];

export default albums;
