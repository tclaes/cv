import "server-only";
import { cache } from "react";
import { isFirebaseAdminConfigured, getAdminDb } from "@/lib/firebase/admin";
import { seed } from "@/data/seed";
import type {
  CvData,
  Job,
  EarlierExperience,
  EducationItem,
  Certification,
  Project,
  SkillCategory,
  Profile,
} from "@/types/cv";

/**
 * Reads the full CV dataset. Falls back to the local seed (data/seed.ts) whenever
 * Firebase Admin isn't configured yet, so the app is fully runnable before Tom
 * provisions a Firebase project (see .env.example).
 */
async function loadCvData(): Promise<CvData> {
  if (!isFirebaseAdminConfigured) {
    return seed;
  }

  const db = getAdminDb();

  const [profileSnap, experienceSnap, earlierSnap, educationSnap, certsSnap, projectsSnap, skillsSnap] =
    await Promise.all([
      db.collection("profile").doc("main").get(),
      db.collection("experience").orderBy("periodStart", "desc").get(),
      db.collection("earlierExperience").get(),
      db.collection("education").get(),
      db.collection("certifications").get(),
      db.collection("projects").orderBy("periodStart", "desc").get(),
      db.collection("skills").get(),
    ]);

  const profile: Profile = profileSnap.exists ? (profileSnap.data() as Profile) : seed.profile;

  return {
    profile,
    experience: experienceSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as Job),
    earlierExperience: earlierSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as EarlierExperience),
    education: educationSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as EducationItem),
    certifications: certsSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as Certification),
    projects: projectsSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as Project),
    skills: skillsSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as SkillCategory),
  };
}

export const getCvData = cache(loadCvData);

export async function getPublicProjects(): Promise<Project[]> {
  const { projects } = await getCvData();
  return projects.filter((p) => p.visibility === "public");
}

export interface CvVariantRecord {
  id: string;
  vacancyUrl: string;
  company: string;
  jobTitle: string;
  atsScore: number;
  atsReport: { keyword: string; weight: number; status: string; foundIn?: string }[];
  sections: { tailoredSummary: string; tailoredSkills: string[] };
  motivationEmail: string;
  createdAt: string;
}

export async function getCvVariants(): Promise<CvVariantRecord[]> {
  if (!isFirebaseAdminConfigured) return [];
  const snap = await getAdminDb()
    .collection("cvVariants")
    .orderBy("createdAt", "desc")
    .get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as CvVariantRecord);
}

export async function getCvVariant(id: string): Promise<CvVariantRecord | null> {
  if (!isFirebaseAdminConfigured) return null;
  const doc = await getAdminDb().collection("cvVariants").doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as CvVariantRecord;
}
