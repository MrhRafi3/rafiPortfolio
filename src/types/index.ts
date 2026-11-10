export interface ProjectItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  category: string;
  year: string;
  platform: string;
  role: string;
  githubUrl?: string;
  coverImage: string;
  screenshots: string[];
  overview: string;
  developmentDirection?: string;
  problemStatement: string;
  verifiedFeatures: string[];
  techStack: string[];
  metricsOrHighlight: string;
  accentColor: string;
  tags: string[];
}

export interface SkillItem {
  name: string;
  description: string;
  isPrimary?: boolean;
  tag?: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  headline: string;
  skills: SkillItem[];
}

export interface WorkflowStage {
  step: string;
  number: string;
  title: string;
  summary: string;
  deliverables: string[];
  details: string;
  badge: string;
}
