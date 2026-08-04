"use server";

import { revalidatePath } from "next/cache";
import { getAdminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import { getAdminSession } from "@/lib/firebase/session";
import {
  jobSchema,
  projectSchema,
  certificationSchema,
  skillCategorySchema,
} from "@/lib/cv/schemas";
import { getCvData } from "@/lib/cv/data";
import { generateTailoredCv } from "@/lib/ai/gemini";
import { fetchVacancyText } from "@/lib/cv/vacancy";

export type ActionResult = { ok: true } | { ok: false; message: string };

async function assertAdmin() {
  const session = await getAdminSession();
  if (!session) throw new Error("Not authorized");
  if (!isFirebaseAdminConfigured) {
    throw new Error(
      "Firebase is nog niet geconfigureerd — wijzigingen kunnen niet worden opgeslagen."
    );
  }
}

function toActionResult(err: unknown): ActionResult {
  return { ok: false, message: err instanceof Error ? err.message : "Er ging iets mis." };
}

function revalidateAll() {
  revalidatePath("/admin/profile");
  revalidatePath("/");
  revalidatePath("/experience");
  revalidatePath("/projects");
  revalidatePath("/certifications");
  revalidatePath("/cv");
}

export async function saveJob(raw: unknown): Promise<ActionResult> {
  try {
    await assertAdmin();
    const data = jobSchema.parse(raw);
    const { id, ...fields } = data;
    const db = getAdminDb();
    const ref = id ? db.collection("experience").doc(id) : db.collection("experience").doc();
    await ref.set(fields);
    revalidateAll();
    return { ok: true };
  } catch (err) {
    return toActionResult(err);
  }
}

export async function deleteJob(id: string): Promise<ActionResult> {
  try {
    await assertAdmin();
    await getAdminDb().collection("experience").doc(id).delete();
    revalidateAll();
    return { ok: true };
  } catch (err) {
    return toActionResult(err);
  }
}

export async function saveProject(raw: unknown): Promise<ActionResult> {
  try {
    await assertAdmin();
    const data = projectSchema.parse(raw);
    const { id, ...fields } = data;
    const db = getAdminDb();
    const ref = id ? db.collection("projects").doc(id) : db.collection("projects").doc();
    await ref.set(fields, { merge: false });
    revalidateAll();
    return { ok: true };
  } catch (err) {
    return toActionResult(err);
  }
}

export async function deleteProject(id: string): Promise<ActionResult> {
  try {
    await assertAdmin();
    await getAdminDb().collection("projects").doc(id).delete();
    revalidateAll();
    return { ok: true };
  } catch (err) {
    return toActionResult(err);
  }
}

export async function saveCertification(raw: unknown): Promise<ActionResult> {
  try {
    await assertAdmin();
    const data = certificationSchema.parse(raw);
    const { id, ...fields } = data;
    const db = getAdminDb();
    const ref = id
      ? db.collection("certifications").doc(id)
      : db.collection("certifications").doc();
    await ref.set(fields, { merge: false });
    revalidateAll();
    return { ok: true };
  } catch (err) {
    return toActionResult(err);
  }
}

export async function deleteCertification(id: string): Promise<ActionResult> {
  try {
    await assertAdmin();
    await getAdminDb().collection("certifications").doc(id).delete();
    revalidateAll();
    return { ok: true };
  } catch (err) {
    return toActionResult(err);
  }
}

export async function saveSkillCategory(raw: unknown): Promise<ActionResult> {
  try {
    await assertAdmin();
    const data = skillCategorySchema.parse(raw);
    const db = getAdminDb();
    // Skill categories are keyed by their (slugified) category name.
    const docId = data.category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await db.collection("skills").doc(docId).set(data, { merge: false });
    revalidateAll();
    return { ok: true };
  } catch (err) {
    return toActionResult(err);
  }
}

export async function deleteSkillCategory(category: string): Promise<ActionResult> {
  try {
    await assertAdmin();
    const docId = category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await getAdminDb().collection("skills").doc(docId).delete();
    revalidateAll();
    return { ok: true };
  } catch (err) {
    return toActionResult(err);
  }
}

export async function generateCvVariant(input: { vacancyUrl?: string; vacancyText?: string }) {
  await assertAdmin();

  const vacancyText =
    input.vacancyText?.trim() ||
    (input.vacancyUrl ? await fetchVacancyText(input.vacancyUrl) : "");
  if (!vacancyText) {
    throw new Error("Geef een vacature-URL of plak de vacaturetekst.");
  }

  const profileData = await getCvData();
  const result = await generateTailoredCv(vacancyText, profileData);

  const db = getAdminDb();
  const ref = db.collection("cvVariants").doc();
  await ref.set({
    vacancyUrl: input.vacancyUrl ?? "",
    company: result.company,
    jobTitle: result.jobTitle,
    atsScore: result.atsScore,
    atsReport: result.atsReport,
    sections: {
      tailoredSummary: result.tailoredSummary,
      tailoredSkills: result.tailoredSkills,
    },
    motivationEmail: result.motivationEmail,
    createdAt: new Date().toISOString(),
  });

  revalidatePath("/admin/generate");
  return { id: ref.id };
}
