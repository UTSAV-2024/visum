export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
  isNew?: boolean;
  disabled?: boolean;
}

export interface NavGroup {
  id: string;
  label: string;
  icon: React.ElementType;
  items: NavItem[];
}

export interface Workspace {
  id: string;
  name: string;
  plan: string;
  logo?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  company: string;
}

export interface UsageData {
  storageUsed: number; // in GB
  storageLimit: number; // in GB
  scansUsed: number;
  scansLimit: number;
}
