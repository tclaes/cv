import { renderToBuffer } from "@react-pdf/renderer";
import { getCvData } from "@/lib/cv/data";
import { CvDocument } from "@/components/pdf/cv-document";

export const runtime = "nodejs";

export async function GET() {
  const data = await getCvData();
  const buffer = await renderToBuffer(<CvDocument data={data} />);

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="Tom_Claes_CV.pdf"',
    },
  });
}
