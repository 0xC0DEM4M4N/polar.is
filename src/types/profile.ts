export interface UserProfile {
  name: string;
  avatar: string;
  colorFrom: string;
  colorTo: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  loggedIn: boolean;
  user?: string | null;
  userId?: string | null;
  profile?: UserProfile | null;
}
