export type UserRole = 'Regular User' | 'Club Member';

export interface User {
  name?: string;
  email: string;
  role: UserRole;
  coupons: number;
  profilePicture?: string;
}

export type EventStatus = 'Available' | 'Almost Full' | 'Full' | 'On-Spot Registration';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  status: EventStatus;
  coupons: number;
  imageId: string;
}

export type Club = Event;
