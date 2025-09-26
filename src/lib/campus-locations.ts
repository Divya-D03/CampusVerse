import type { EventCategory } from './types';

export interface CampusLocation {
  id: string;
  title: string;
  description: string;
  imageId: string;
  categories: EventCategory[];
}

export const campusLocations: CampusLocation[] = [
  {
    id: 'loc-auditorium',
    title: 'Auditorium',
    description: 'Stage for all cultural fests and large-scale events.',
    imageId: 'location-auditorium',
    categories: ['cultural'],
  },
  {
    id: 'loc-library',
    title: 'Library & Tech Hub',
    description: 'Home to hackathons, workshops, and project expos.',
    imageId: 'location-library',
    categories: ['hackathon', 'tech', 'project-expo', 'ideathon'],
  },
  {
    id: 'loc-student-center',
    title: 'Student Center',
    description: 'The heart of all club activities and meetups.',
    imageId: 'location-student-center',
    categories: ['club'],
  },
];
