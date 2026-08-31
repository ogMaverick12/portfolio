export interface FlagshipProject {
  id: "soilsense" | "pathforge" | "preppilot";
  name: string;
  tagline: string;
  valueProp: string;
  category: string;
  metric: string;
  metricLabel: string;
  techStack: string[];
  repoName: string;
  repoUrl: string;
  highlight: boolean;
  coverImage?: string;
  challenge: string;
  solution: string;
  offlineCapability: string;
  architectureDetails: {
    inputs: string;
    processing: string;
    model: string;
    latency: string;
  };
  metricsBreakdown: Array<{
    label: string;
    value: string;
    subtext: string;
  }>;
}

export interface SkillCategory {
  id: string;
  title: string;
  iconName: string;
  skills: Array<{
    name: string;
    level: number;
    experience: string;
    details: string;
    appliedProject: string;
    complexity?: string;
  }>;
}

export interface JourneyMilestone {
  id: string;
  period: string;
  age: string;
  title: string;
  summary: string;
  focusTags: string[];
  diffs: {
    added: string[];
    removed?: string[];
  };
  keyTakeaway: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  issuer: string;
  category: "arcade" | "infra" | "ai_ml" | "competitions" | "certifications";
  verificationUrl?: string;
  date?: string;
  highlight?: boolean;
}

export interface BlogArticle {
  id: string;
  title: string;
  url: string;
  platform: "DEV.TO" | "MEDIUM";
  type: string;
  tags: string[];
  readTime: string;
  featured?: boolean;
}

export interface TerminalLog {
  id: string;
  text: string;
  type: "prompt" | "cmd" | "out" | "err" | "val" | "key" | "link" | "ai" | "raw";
  linkUrl?: string;
  isAiNote?: boolean;
  timestamp?: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  grade: string;
  status: "CURRENT" | "COMPLETED";
  location: string;
  period: string;
  highlights: string[];
  description: string;
}
