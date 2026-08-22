export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  pesel?: string;
  customData: Record<string, string | number | boolean | null>;
  userId: number;
}
