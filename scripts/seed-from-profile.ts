/**
 * One-time migration: pushes src/data/seed.ts into Firestore.
 * Requires FIREBASE_SERVICE_ACCOUNT_KEY in .env.local. Run with: npm run seed
 */
import path from "node:path";
import dotenv from "dotenv";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { seed } from "../src/data/seed";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
if (!raw) {
  console.error(
    "FIREBASE_SERVICE_ACCOUNT_KEY is not set. Add it to .env.local (see .env.example) and retry."
  );
  process.exit(1);
}

const serviceAccount = JSON.parse(raw);
initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

async function main() {
  const batch = db.batch();

  batch.set(db.collection("profile").doc("main"), seed.profile);

  for (const { id, ...fields } of seed.experience) {
    batch.set(db.collection("experience").doc(id), fields);
  }
  for (const { id, ...fields } of seed.earlierExperience) {
    batch.set(db.collection("earlierExperience").doc(id), fields);
  }
  for (const { id, ...fields } of seed.education) {
    batch.set(db.collection("education").doc(id), fields);
  }
  for (const { id, ...fields } of seed.certifications) {
    batch.set(db.collection("certifications").doc(id), fields);
  }
  for (const { id, ...fields } of seed.projects) {
    batch.set(db.collection("projects").doc(id), fields);
  }
  for (const group of seed.skills) {
    batch.set(db.collection("skills").doc(slugify(group.category)), group);
  }

  await batch.commit();
  console.log("Seed data written to Firestore project:", serviceAccount.project_id);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
