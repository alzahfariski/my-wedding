export interface AdminSession {
  isAuthenticated: boolean;
  username?: string;
}

export interface AdminWish {
  id: string;
  name: string;
  text: string;
  date: string;
  color: string;
  creatorId?: string;
  createdAt?: any;
}

export interface AdminPhoto {
  id: string;
  guestName: string;
  imageSrc: string;
  fileId?: string;
  caption: string;
  date: string;
  creatorId?: string;
  createdAt?: any;
}

export interface AdminConfirmation {
  id: string;
  name: string;
  amount: string;
  bank?: string;
  message?: string;
  creatorId?: string;
  date: string;
  createdAt?: any;
}
