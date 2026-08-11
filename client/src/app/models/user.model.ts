export type UserRole = 'admin' | 'doctor' | 'user';

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
}
