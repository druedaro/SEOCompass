import type { LucideIcon } from 'lucide-react';

export interface Feature {
    icon: LucideIcon;
    title: string;
    description: string;
}

export interface Step {
    icon: LucideIcon;
    title: string;
    description: string;
    number: string;
}
