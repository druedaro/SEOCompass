import {
  BarChart3,
  FileSearch,
  Wrench,
  CheckSquare,
  TrendingUp,
  Globe,
  FolderPlus,
  Plus,
  Search,
  AlertTriangle,
  Github,
  Twitter,
  Linkedin,
  Mail,
  type LucideIcon,
} from 'lucide-react';

// Hero Section Data
export const heroData = {
  badge: {
    text: '🚀 Now in Beta',
  },
  heading: 'The Complete SEO Platform for Modern Teams',
  description:
    'Track keywords, analyze content, audit technical SEO, and manage tasks—all in one place. Built for Technical SEO specialists, Content experts, and Developers.',
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
    { icon: BarChart3, label: 'Keyword Tracking' },
    { icon: FileSearch, label: 'Content Analysis' },
    { icon: Wrench, label: 'Technical Audit' },
    { icon: CheckSquare, label: 'Action Center' },
  ],
};

// Features Section Data
export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  className: string;
}

export const featuresData: Feature[] = [
  {
    icon: BarChart3,
    title: 'Keyword Tracker',
    description:
      'Monitor your keyword rankings in real-time. Track search volume, difficulty, and visibility evolution with beautiful charts.',
    className: 'md:col-span-2',
  },
  {
    icon: FileSearch,
    title: 'Content Analyzer',
    description:
      'Scrape URLs or sitemaps to detect 404s, redirects, duplicate content, missing meta tags, and more.',
    className: 'md:col-span-1',
  },
  {
    icon: Wrench,
    title: 'Technical SEO Audit',
    description:
      'Run comprehensive technical audits powered by Google PageSpeed Insights. Get actionable recommendations.',
    className: 'md:col-span-1',
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

// How It Works Section Data
export interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
  number: string;
}

export const stepsData: Step[] = [
  {
    icon: FolderPlus,
    title: 'Create Your Project',
    description: 'Set up a new SEO project in seconds. Add your website URL and configure basic settings.',
    number: '01',
  },
  {
    icon: Plus,
    title: 'Add Keywords',
    description: 'Import keywords manually or from CSV. Track their rankings, search volume, and difficulty.',
    number: '02',
  },
  {
    icon: Search,
    title: 'Analyze Content',
    description: 'Scrape URLs or sitemaps to detect SEO issues like 404s, missing meta tags, and duplicate content.',
    number: '03',
  },
  {
    icon: AlertTriangle,
    title: 'Fix Issues',
    description: 'Get actionable recommendations. Create tasks in the Action Center and assign them to your team.',
    number: '04',
  },
  {
    icon: TrendingUp,
    title: 'Track Progress',
    description: 'Monitor keyword rankings, audit scores, and task completion with real-time dashboards.',
    number: '05',
  },
];

// Footer Data
export interface FooterLink {
  name: string;
  href: string;
}

export interface FooterSection {
  product: FooterLink[];
  resources: FooterLink[];
  company: FooterLink[];
}

export const footerLinksData: FooterSection = {
  product: [
    { name: 'Features', href: '#features' },
    { name: 'How it works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Changelog', href: '#changelog' },
  ],
  resources: [
    { name: 'Documentation', href: '#docs' },
    { name: 'API Reference', href: '#api' },
    { name: 'Blog', href: '#blog' },
    { name: 'Support', href: '#support' },
  ],
  company: [
    { name: 'About', href: '#about' },
    { name: 'Careers', href: '#careers' },
    { name: 'Privacy', href: '#privacy' },
    { name: 'Terms', href: '#terms' },
  ],
};

export interface SocialLink {
  name: string;
  icon: LucideIcon;
  href: string;
}

export const socialLinksData: SocialLink[] = [
  { name: 'GitHub', icon: Github, href: 'https://github.com' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com' },
  { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com' },
  { name: 'Email', icon: Mail, href: 'mailto:contact@seocompass.com' },
];
