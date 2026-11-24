export type ProjectCategory =
  | 'Systems & SQL'
  | 'Mathematics'
  | 'Analytics'
  | 'Machine Learning';

export interface ProjectScreenshot {
  id: string;
  title: string;
  caption: string;
  imageUrl: string;
  isPlaceholder?: boolean;
}

export interface ProjectFeatureStatus {
  name: string;
  module: string;
  status: 'Implemented' | 'Planned';
  notes: string;
}

export interface DatabaseTableSpec {
  tableName: string;
  purpose: string;
  columns: { name: string; type: string; constraint?: string }[];
  relationships: string[];
}

export interface ProjectItem {
  id: string;
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  category: ProjectCategory;
  statusLabel: string;
  summary: string;
  overview: string;
  heroImageUrl?: string;
  visualType: 'fmcg' | 'eoq' | 'bi' | 'ml' | 'custom';
  problemAreas?: string[];
  coreModules?: string[];
  architectureLayers?: { layer: string; component: string; responsibility: string }[];
  databaseTables?: DatabaseTableSpec[];
  featureMatrix?: ProjectFeatureStatus[];
  methodologySteps?: string[];
  technologies: string[];
  learningOutcomes: string[];
  screenshots: ProjectScreenshot[];
  githubUrl?: string;
  liveDemoUrl?: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  description: string;
  skills: string[];
}

export interface EducationRecord {
  id: string;
  degree: string;
  institution: string;
  department: string;
  location: string;
  period: string;
  semester: string;
  academicAchievements: string[];
  relevantCoursework: string[];
  academicProjects: string[];
  researchInterests: string[];
}

export interface AchievementItem {
  id: string;
  category:
    | 'Academic Achievement'
    | 'Technical Certification'
    | 'Workshop'
    | 'Seminar'
    | 'Project Milestone'
    | 'Professional Development';
  title: string;
  issuer: string;
  date: string;
  description: string;
  verified: boolean;
  isPlaceholder?: boolean;
  credentialUrl?: string;
}

export interface ExperienceTimelineItem {
  id: string;
  type:
    | 'Academic Project'
    | 'Software Development'
    | 'Technical Learning'
    | 'Practical Experimentation'
    | 'Independent Research';
  title: string;
  context: string;
  period: string;
  description: string;
  focusAreas: string[];
}

export interface ProfileData {
  name: string;
  roleLine: string;
  tagline: string;
  heroIntro: string;
  portraitUrl: string;
  portraitIsPlaceholder: boolean;
  location: string;
  email: string;
  linkedinUrl: string;
  githubUrl: string;
  githubUsername?: string;
  careerVision: string;
  aboutParagraphs: string[];
  goalsTitle: string;
  goals: string[];
  contactPrompt: string;
  uploadedCvName?: string;
  uploadedCvDataUrl?: string;
  uploadedCvUpdatedAt?: string;
}

export interface GitHubRepoSummary {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  htmlUrl: string;
  homepage: string | null;
  language: string | null;
  stargazersCount: number;
  forksCount: number;
  watchersCount: number;
  openIssuesCount: number;
  topics: string[];
  updatedAt: string;
  pushedAt: string;
  fork: boolean;
  archived: boolean;
}

export interface GitHubLanguageStat {
  language: string;
  count: number;
  percentage: number;
}

export interface GitHubIntegrationPayload {
  profile: {
    login: string;
    name: string | null;
    bio: string | null;
    htmlUrl: string;
    avatarUrl: string;
    followers: number;
    following: number;
    publicRepos: number;
    location: string | null;
    company: string | null;
    blog: string | null;
    createdAt: string;
  };
  repos: GitHubRepoSummary[];
  languages: GitHubLanguageStat[];
  totalStars: number;
  totalForks: number;
  fetchedAt: string;
}

export interface PortfolioData {
  profile: ProfileData;
  skills: SkillCategory[];
  projects: ProjectItem[];
  education: EducationRecord;
  achievements: AchievementItem[];
  timeline: ExperienceTimelineItem[];
}
