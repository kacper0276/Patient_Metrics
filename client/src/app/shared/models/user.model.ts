import { UserRole } from '@shared/types/user-role.type';

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
}
