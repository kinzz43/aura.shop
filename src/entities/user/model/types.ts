export interface User {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  role: 'user' | 'admin';
}

export interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}