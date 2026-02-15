export interface VaultEntry {
  id: string;
  site: string;
  usernameOrEmail: string;
  password: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Vault {
  version: number;
  createdAt: number;
  updatedAt: number;
  entries: VaultEntry[];
}
