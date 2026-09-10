export interface Hotspot {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  position: [number, number, number];
  metric: string;
  metricLabel: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  category: string;
  description: string;
  iconName: string;
  badge?: string;
  stats: string;
}

export interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  popular?: boolean;
  ctaText: string;
  highlightBadge?: string;
}

export interface SceneConfig {
  geometry: 'torusKnot' | 'gyroscope' | 'quantumCore';
  color1: string;
  color2: string;
  wireframe: boolean;
  roughness: number;
  metalness: number;
  speed: number;
  particleDensity: number;
}
