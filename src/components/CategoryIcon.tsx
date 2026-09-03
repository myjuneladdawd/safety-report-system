import React from 'react';
import {
  Bandage,
  Wrench,
  Flame,
  Users,
  Eye,
  ShieldAlert,
  AlertTriangle,
  HelpCircle,
  LucideIcon,
} from 'lucide-react';

interface CategoryIconProps {
  name: string;
  className?: string;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Bandage,
  Wrench,
  Flame,
  Users,
  Eye,
  ShieldAlert,
  AlertTriangle,
  HelpCircle,
};

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, className = 'w-5 h-5' }) => {
  const IconComponent = ICON_MAP[name] || HelpCircle;
  return <IconComponent className={className} />;
};
