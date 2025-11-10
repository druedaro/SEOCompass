import {
  FileSearch,
  CheckSquare,
  TrendingUp,
  Globe,
  FolderPlus,
  Search,
  AlertTriangle,
  type LucideIcon,
} from 'lucide-react';

export const HERO_DATA = {
  badge: {
    text: '🚀 Now in Beta',
  },
  heading: 'The Complete SEO Platform for Modern Teams',
  description:
    'Analyze content, audit SEO issues, and manage tasks—all in one place. Built for Technical SEO specialists, Content experts, and Developers.',
  cta: {
    primary: {
      text: 'Get Started Free',
      href: '/register',
    },
    secondary: {
      text: 'View Demo',
      href: '#demo',
    },
  },
  features: [
    { icon: FileSearch, label: 'Content Analysis' },
    { icon: CheckSquare, label: 'Action Center' },
    { icon: TrendingUp, label: 'Real-time Analytics' },
  ],
};

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  className: string;
}

export const FEATURES_DATA: Feature[] = [
  {
    icon: FileSearch,
    title: 'Content Analyzer',
    description:
      'Scrape URLs or sitemaps to detect 404s, redirects, duplicate content, missing meta tags, and more.',
    className: 'md:col-span-2',
  },
  {
    icon: CheckSquare,
    title: 'Action Center',
    description:
      'Manage SEO tasks with Kanban boards and list views. Link tasks to audits and track progress with your team.',
    className: 'md:col-span-2',
  },
  {
    icon: TrendingUp,
    title: 'Real-time Analytics',
    description: 'Get instant insights with live data updates and performance metrics.',
    className: 'md:col-span-1',
  },
  {
    icon: Globe,
    title: 'Multi-language Support',
    description: 'Analyze hreflang tags and optimize for international SEO.',
    className: 'md:col-span-1',
  },
];

export interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
  number: string;
}

export const STEPS_DATA: Step[] = [
  {
    icon: FolderPlus,
    title: 'Create Your Project',
    description: 'Set up a new SEO project in seconds. Add your website URL and configure basic settings.',
    number: '01',
  },
  {
    icon: Search,
    title: 'Analyze Content',
    description: 'Scrape URLs or sitemaps to detect SEO issues like 404s, missing meta tags, and duplicate content.',
    number: '02',
  },
  {
    icon: AlertTriangle,
    title: 'Fix Issues',
    description: 'Get actionable recommendations. Create tasks in the Action Center and assign them to your team.',
    number: '03',
  },
  {
    icon: TrendingUp,
    title: 'Track Progress',
    description: 'Monitor audit scores and task completion with real-time dashboards.',
    number: '04',
  },
];
