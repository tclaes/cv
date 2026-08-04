import { getCvData } from "@/lib/cv/data";
import { ProfileEditor } from "@/components/admin/profile-editor";

export default async function AdminProfilePage() {
  const data = await getCvData();
  return <ProfileEditor data={data} />;
}
