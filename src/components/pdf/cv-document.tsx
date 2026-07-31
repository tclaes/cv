import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { CvData } from "@/types/cv";
import { formatRange } from "@/lib/format";

const styles = StyleSheet.create({
  page: {
    paddingVertical: 36,
    paddingHorizontal: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#111111",
  },
  name: { fontSize: 22, fontFamily: "Helvetica-Bold" },
  headline: { fontSize: 12, color: "#555555", marginTop: 2 },
  contact: { fontSize: 9, color: "#555555", marginTop: 6 },
  section: { marginTop: 16 },
  sectionTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#555555",
    borderBottom: "1pt solid #dddddd",
    paddingBottom: 4,
    marginBottom: 8,
  },
  entry: { marginBottom: 10 },
  entryHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  entryTitle: { fontSize: 10.5, fontFamily: "Helvetica-Bold" },
  entryPeriod: { fontSize: 9, color: "#555555" },
  entrySubtitle: { fontSize: 9, color: "#555555", marginTop: 1 },
  bullet: { fontSize: 9.5, marginTop: 3, lineHeight: 1.35 },
  tagRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 4, gap: 4 },
  tag: {
    fontSize: 7.5,
    color: "#444444",
    backgroundColor: "#f2f2f2",
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 3,
  },
  earlierRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 9,
    marginBottom: 3,
  },
  skillGroup: { marginBottom: 6 },
  skillCategory: { fontSize: 8, color: "#777777", marginBottom: 2 },
});

export function CvDocument({ data }: { data: CvData }) {
  const { profile, experience, earlierExperience, education, certifications, projects, skills } =
    data;
  const publicProjects = projects.filter((p) => p.visibility === "public");

  return (
    <Document title={`Tom Claes - CV`} author={profile.name}>
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.headline}>{profile.headline}</Text>
        <Text style={styles.contact}>
          {profile.contact.location} · {profile.contact.email} ·{" "}
          {profile.contact.linkedin.replace("https://", "")}
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professionele samenvatting</Text>
          <Text style={styles.bullet}>{profile.summary}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Werkervaring</Text>
          {experience.map((job) => (
            <View key={job.id} style={styles.entry}>
              <View style={styles.entryHeaderRow}>
                <Text style={styles.entryTitle}>
                  {job.title} — {job.company}
                </Text>
                <Text style={styles.entryPeriod}>
                  {formatRange(job.periodStart, job.periodEnd)}
                </Text>
              </View>
              {job.bullets.map((bullet) => (
                <Text key={bullet} style={styles.bullet}>
                  • {bullet}
                </Text>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Eerdere ervaring</Text>
          {earlierExperience.map((role) => (
            <View key={role.id} style={styles.earlierRow}>
              <Text>{role.title}</Text>
              <Text style={{ color: "#555555" }}>{role.period}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section} break>
          <Text style={styles.sectionTitle}>Relevante projecten</Text>
          {publicProjects.map((project) => (
            <View key={project.id} style={styles.entry}>
              <View style={styles.entryHeaderRow}>
                <Text style={styles.entryTitle}>
                  {project.title} — {project.employer}
                </Text>
                <Text style={styles.entryPeriod}>
                  {formatRange(project.periodStart, project.periodEnd)}
                </Text>
              </View>
              {project.bullets.map((bullet) => (
                <Text key={bullet} style={styles.bullet}>
                  • {bullet}
                </Text>
              ))}
              <View style={styles.tagRow}>
                {project.tech.map((tech) => (
                  <Text key={tech} style={styles.tag}>
                    {tech}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Opleiding &amp; certificaten</Text>
          {education.map((item) => (
            <Text key={item.id} style={styles.bullet}>
              {item.title} — {item.institution} ({item.period})
            </Text>
          ))}
          <Text style={[styles.bullet, { color: "#777777", marginTop: 6 }]}>
            + {certifications.length} certificaten en cursussen (zie volledig CV-platform).
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kernvaardigheden</Text>
          {skills.map((group) => (
            <View key={group.category} style={styles.skillGroup}>
              <Text style={styles.skillCategory}>{group.category}</Text>
              <View style={styles.tagRow}>
                {group.items.map((item) => (
                  <Text key={item} style={styles.tag}>
                    {item}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Talen</Text>
          {profile.languages.map((lang) => (
            <View key={lang.language} style={styles.earlierRow}>
              <Text>{lang.language}</Text>
              <Text style={{ color: "#555555" }}>{lang.level}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
