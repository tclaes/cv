import { renderToBuffer } from "@react-pdf/renderer";
import { getCvData } from "@/lib/cv/data";
import { CvDocument } from "@/components/pdf/cv-document";

export const runtime = "nodejs";

export async function GET() {
  try {
    const data = await getCvData();
    const buffer = await renderToBuffer(<CvDocument data={data} />);

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="Tom_Claes_CV.pdf"',
      },
    });
  } catch (error) {
    console.error("Failed to generate CV PDF", error);
    return new Response("Er ging iets mis bij het genereren van de CV PDF.", {
      status: 500,
    });
  }
}
