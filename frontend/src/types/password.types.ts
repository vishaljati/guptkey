export type PasswordFormData = {
  site: string;
  usernameOrEmail: string;
  password: string;
  notes?: string;
};

export interface PasswordEntry {
  id: string;
  site: string;
  usernameOrEmail: string;
  password: string;
  isFavorite: boolean;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}
