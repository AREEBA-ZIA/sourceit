import { Resend } from "resend";

console.log("RESEND KEY:", process.env.RESEND_API_KEY);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { to, subject, html } = await req.json();

    const data = await resend.emails.send({
      from: "SourceIt <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    console.log("RESEND RESPONSE:", data);

    return Response.json(data);
  } catch (error) {
    console.error("RESEND ERROR:", error);

    return Response.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}