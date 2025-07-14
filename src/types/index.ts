export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  saccoId: string;
  saccoName: string;
  rating: number;
  comment: string;
  route: string;
  date: string;
  helpful: number;
  verified: boolean;
}

export interface Trip {
  id: string;
  userId: string;
  origin: string;
  destination: string;
  saccoName: string;
  fare: number;
  date: string;
  status: 'completed' | 'cancelled' | 'ongoing';
  rating?: number;
  review?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  date: string;
  read: boolean;
}