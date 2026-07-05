export type UserRole = 'owner' | 'frontdesk' | 'desainer';

export interface Profile {
  id: string;
  role: UserRole;
  name?: string;
  created_at: string;
  updated_at: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  roles: UserRole[];
}
