export type UserRole = 'Regular User' | 'Club Member';

export interface User {
  email: string;
  role: UserRole;
  coupons: number;
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
