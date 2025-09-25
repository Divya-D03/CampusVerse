export type UserRole = 'Regular User' | 'Club Member';

export interface CouponTransaction {
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
  coupons: number;
  profilePicture?: string;
  couponHistory?: CouponTransaction[];
  mobileNumber?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
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
