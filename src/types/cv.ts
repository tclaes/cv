export type Visibility = "public" | "private";

export interface ContactInfo {
  location: string;
  email: string;
  linkedin: string;
}

export interface Profile {
  name: string;
  headline: string;
  summary: string;
  contact: ContactInfo;
  languages: LanguageSkill[];
}

export interface LanguageSkill {
  language: string;
  level: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location?: string;
  periodStart: string;
  periodEnd: string;
  bullets: string[];
  skills: string[];
}

export interface EarlierExperience {
  id: string;
  title: string;
  period: string;
}

export interface EducationItem {
  id: string;
  title: string;
  institution: string;
  period: string;
  detail?: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
}

export interface Project {
  id: string;
  title: string;
  employer: string;
  periodStart: string;
  periodEnd: string;
  bullets: string[];
  tech: string[];
  visibility: Visibility;
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface CvVariant {
  id: string;
  vacancyUrl: string;
  company: string;
  jobTitle: string;
  language: "nl" | "en" | "fr";
  atsScore: number;
  atsReport: AtsMatch[];
  sections: Record<string, unknown>;
  motivationEmail?: string;
  createdAt: string;
}

export interface AtsMatch {
  keyword: string;
  weight: number;
  status: "strong" | "partial" | "missing";
  foundIn?: string;
}

export interface CvData {
  profile: Profile;
  experience: Job[];
  earlierExperience: EarlierExperience[];
  education: EducationItem[];
  certifications: Certification[];
  projects: Project[];
  skills: SkillCategory[];
}
