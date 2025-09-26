import type { Event, Club } from './types';

export const culturalEvents: Event[] = [
  {
    id: 'ce1',
    title: 'Anunaad: Music Fest',
    description: 'An electrifying night of music featuring bands from across the country. Get ready to rock!',
    date: 'October 28, 2024',
    status: 'Available',
    coins: 10,
    imageId: 'cultural-event-1',
  },
  {
    id: 'ce2',
    title: 'Nritya: Dance Gala',
    description: 'Experience a mesmerizing evening of classical and contemporary dance performances.',
    date: 'November 5, 2024',
    status: 'Almost Full',
    coins: 15,
    imageId: 'cultural-event-2',
  },
];

export const hackathons: Event[] = [
  {
    id: 'hk1',
    title: 'Hack-AI-Thon 2024',
    description: 'A 24-hour hackathon focused on building innovative solutions using Artificial Intelligence.',
    date: 'November 12-13, 2024',
    status: 'Available',
    coins: 50,
    imageId: 'hackathon-1',
  },
  {
    id: 'hk2',
    title: 'CyberVerse Challenge',
    description: 'Dive into the world of cybersecurity with challenges ranging from cryptography to network security.',
    date: 'December 1, 2024',
    status: 'On-Spot Registration',
    coins: 40,
    imageId: 'hackathon-2',
  },
];

export const ideathons: Event[] = [
  {
    id: 'id1',
    title: 'Future Cities Ideathon',
    description: 'Brainstorm and pitch innovative ideas to create sustainable and smart cities for the future.',
    date: 'November 20, 2024',
    status: 'Available',
    coins: 30,
    imageId: 'ideathon-1',
  },
];

export const projectExpos: Event[] = [
    {
    id: 'pe1',
    title: 'InnovateX Project Expo',
    description: 'Showcase your best projects and see what your peers have been building. Prizes for top projects.',
    date: 'December 5, 2024',
    status: 'Available',
    coins: 25,
    imageId: 'project-expo-1',
  },
]

export const techEvents: Event[] = [
  {
    id: 'te1',
    title: 'Future of Web Dev',
    description: 'A seminar on the latest trends and technologies in web development, featuring industry experts.',
    date: 'October 30, 2024',
    status: 'Full',
    coins: 20,
    imageId: 'tech-event-1',
  },
  {
    id: 'te2',
    title: 'Intro to Robotics',
    description: 'A hands-on workshop where you can build and program your own robot from scratch.',
    date: 'November 18, 2024',
    status: 'Available',
    coins: 25,
    imageId: 'tech-event-2',
  },
];

export const clubs: Club[] = [
  {
    id: 'cl1',
    title: 'Code Crusaders',
    description: 'The official coding club. We host weekly coding sessions, workshops, and prepare for competitions.',
    date: 'Ongoing',
    status: 'Available',
    coins: 0,
    imageId: 'club-1',
  },
  {
    id: 'cl2',
    title: 'The Debate Society',
    description: 'Hone your public speaking and critical thinking skills with us. All arguments welcome!',
    date: 'Ongoing',
    status: 'Available',
    coins: 0,
    imageId: 'club-2',
  },
   {
    id: 'cl3',
    title: 'Art & Soul',
    description: 'Express your creativity through various art forms. Workshops on painting, sculpture, and more.',
    date: 'Ongoing',
    status: 'Available',
    coins: 0,
    imageId: 'club-3',
  },
  {
    id: 'cl4',
    title: 'Sports Club',
    description: 'Join us for various sports activities and stay fit. We have teams for cricket, football, and basketball.',
    date: 'Ongoing',
    status: 'Available',
    coins: 0,
    imageId: 'club-4',
  }
];
