export type UserRole = 'Regular User' | 'Club Member';

export interface CoinTransaction {
  id: string;
  reason: string;
  amount: number;
  type: 'earned' | 'spent';
  date: string;
}

export interface User {
  name?: string;
  email: string;
  role: UserRole;
  coins: number;
  profilePicture?: string;
  coinHistory?: CoinTransaction[];
  mobileNumber?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
}

export type EventStatus = 'Available' | 'Almost Full' | 'Ended' | 'On-Spot Registration' | 'Ongoing';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  status: EventStatus;
  coins: number;
  imageId: string;
}

export type Club = Event;
