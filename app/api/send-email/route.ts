import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, productName, status, reason } = await req.json();

    const subject =
      status === "Approved"
        ? "Product Approved"
        : "Product Rejected";

    const text =
      status === "Approved"
        ? `Congratulations!

Your product "${productName}" has been approved.

You are now eligible for the payment process.`
        : `Your product "${productName}" has been rejected.

Reason: ${reason}`;

    const result = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject,
      text,
    });

    console.log("EMAIL RESULT:", result);
    console.log("EMAIL SENT TO:", email);

    return Response.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("EMAIL ERROR:", error);

    return Response.json(
      {
        success: false,
        error,
      },
      {
        status: 500,
      }
    );
  }
}