import "server-only";
import { GoogleGenAI, Type } from "@google/genai";
import type { CvData } from "@/types/cv";

export const isGeminiConfigured = Boolean(process.env.GEMINI_API_KEY);

const MODEL = "gemini-2.0-flash";

export interface AtsMatchResult {
  keyword: string;
  weight: number;
  status: "strong" | "partial" | "missing";
  foundIn?: string;
}

export interface TailoredCvResult {
  jobTitle: string;
  company: string;
  atsScore: number;
  atsReport: AtsMatchResult[];
  tailoredSummary: string;
  tailoredSkills: string[];
  motivationEmail: string;
}

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    jobTitle: { type: Type.STRING },
    company: { type: Type.STRING },
    atsScore: { type: Type.NUMBER },
    atsReport: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          keyword: { type: Type.STRING },
          weight: { type: Type.NUMBER },
          status: { type: Type.STRING, enum: ["strong", "partial", "missing"] },
          foundIn: { type: Type.STRING },
        },
        required: ["keyword", "weight", "status"],
      },
    },
    tailoredSummary: { type: Type.STRING },
    tailoredSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
    motivationEmail: { type: Type.STRING },
  },
  required: [
    "jobTitle",
    "company",
    "atsScore",
    "atsReport",
    "tailoredSummary",
    "tailoredSkills",
    "motivationEmail",
  ],
};

function serializeProfile(data: CvData): string {
  const { profile, experience, projects, skills, education, certifications } = data;
  const publicProjects = projects.filter((p) => p.visibility === "public");

  return [
    `Naam: ${profile.name}`,
    `Huidige titel: ${profile.headline}`,
    `Samenvatting: ${profile.summary}`,
    "",
    "Werkervaring:",
    ...experience.map(
      (job) =>
        `- ${job.title} (${job.company}, ${job.periodStart}-${job.periodEnd}): ${job.bullets.join("; ")}. Skills: ${job.skills.join(", ")}`
    ),
    "",
    "Projecten:",
    ...publicProjects.map(
      (p) => `- ${p.title} (${p.employer}): ${p.bullets.join("; ")}. Tech: ${p.tech.join(", ")}`
    ),
    "",
    "Vaardigheden per categorie:",
    ...skills.map((g) => `- ${g.category}: ${g.items.join(", ")}`),
    "",
    "Opleiding & certificaten:",
    ...education.map((e) => `- ${e.title} (${e.institution}, ${e.period})`),
    ...certifications.map((c) => `- ${c.title} (${c.issuer}, ${c.date})`),
  ].join("\n");
}

/**
 * Mirrors the cv-builder skill's vacancy-tailoring workflow (Step 1a/2/3/5), but as a
 * single structured Gemini call: extract job title/company/keywords from the vacancy,
 * weighted ATS-score them against the profile, and draft a tailored summary + motivation
 * email. Weights follow the skill's rule: title 3x, summary/experience/skills/projects 2x,
 * education/certifications 1x.
 */
export async function generateTailoredCv(
  vacancyText: string,
  profileData: CvData
): Promise<TailoredCvResult> {
  if (!isGeminiConfigured) {
    throw new Error("GEMINI_API_KEY is niet ingesteld — zie .env.example.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const prompt = `Je bent een ATS-matchingassistent voor een front-end engineer die op deze vacature solliciteert.

VACATURETEKST:
"""
${vacancyText}
"""

KANDIDAATPROFIEL:
"""
${serializeProfile(profileData)}
"""

Taak:
1. Haal uit de vacaturetekst: functietitel, bedrijfsnaam, en de belangrijkste ATS-keywords (harde skills, tools, verantwoordelijkheden).
2. Match elk keyword tegen het kandidaatprofiel met gewogen scoring: CV-titel/koptitel 3x, samenvatting/werkervaring/skills/projecten 2x, opleiding/certificaten 1x.
   Classificeer elk keyword als "strong" (exacte of duidelijke match), "partial" (verwant concept) of "missing" (niet aanwezig).
3. Bereken atsScore = (som van gewogen matches / som van alle gewichten) x 100, afgerond op een geheel getal.
4. Herschrijf de professionele samenvatting (3-4 zinnen, open met functietitel + kernsterkte, verwerk 3-5 keywords, zelfde taal als de vacaturetekst) als tailoredSummary.
5. Kies de 12 meest relevante vaardigheden uit het profiel voor deze vacature (vacature-keywords eerst) als tailoredSkills.
6. Schrijf een korte, concrete motivatiemail (max ~200 woorden, zelfde taal als de vacaturetekst, geen overdreven enthousiasme, verwijs naar iets concreets uit de vacaturetekst) als motivationEmail.

Antwoord uitsluitend met het gevraagde JSON-object.`;

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("Geen antwoord van Gemini ontvangen.");
  }
  return JSON.parse(text) as TailoredCvResult;
}
