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
 * Newest first. Dates are ISO "YYYY-MM" strings, which sort correctly as plain
 * strings; a year-only "YYYY" sorts just below that year's dated entries. Entries
 * without a date (or with free text) go last, keeping their relative order. Sorting
 * happens here rather than via Firestore orderBy so undated docs aren't dropped.
 */
function sortCertificationsByDate(certifications: Certification[]): Certification[] {
  const sortKey = (value: string) => {
    if (/^\d{4}-(0[1-9]|1[0-2])$/.test(value)) return value;
    if (/^\d{4}$/.test(value)) return `${value}-00`;
    return "";
  };
  return [...certifications].sort((a, b) => {
    const aKey = sortKey(a.date ?? "");
    const bKey = sortKey(b.date ?? "");
    if (aKey && bKey) return bKey.localeCompare(aKey);
    if (aKey !== bKey) return aKey ? -1 : 1;
    return 0;
  });
}

/**
 * Reads the full CV dataset. Falls back to the local seed (data/seed.ts) whenever
 * Firebase Admin isn't configured yet, so the app is fully runnable before Tom
 * provisions a Firebase project (see .env.example).
 */
async function loadCvData(): Promise<CvData> {
  if (!isFirebaseAdminConfigured) {
    return { ...seed, certifications: sortCertificationsByDate(seed.certifications) };
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
    experience: experienceSnap.docs.map((d) => ({ ...d.data(), id: d.id }) as Job),
    earlierExperience: earlierSnap.docs.map((d) => ({ ...d.data(), id: d.id }) as EarlierExperience),
    education: educationSnap.docs.map((d) => ({ ...d.data(), id: d.id }) as EducationItem),
    certifications: sortCertificationsByDate(
      certsSnap.docs.map((d) => ({ ...d.data(), id: d.id }) as Certification),
    ),
    projects: projectsSnap.docs.map((d) => ({ ...d.data(), id: d.id }) as Project),
    skills: skillsSnap.docs.map((d) => ({ ...d.data(), id: d.id }) as SkillCategory),
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
  return snap.docs.map((d) => ({ ...d.data(), id: d.id }) as CvVariantRecord);
}

export async function getCvVariant(id: string): Promise<CvVariantRecord | null> {
  if (!isFirebaseAdminConfigured) return null;
  const doc = await getAdminDb().collection("cvVariants").doc(id).get();
  if (!doc.exists) return null;
  return { ...doc.data(), id: doc.id } as CvVariantRecord;
}
