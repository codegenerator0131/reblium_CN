import { NextRequest, NextResponse } from "next/server";
import transporter from "@/lib/emailTransporter";

export async function POST(req: NextRequest) {
  try {
    const { email, text } = await req.json();
    const logoURL = `${process.env.NEXT_PUBLIC_APP_URL}/images/reblium-logo.png`;

    await transporter.sendMail({
      from: '"Mascotte.AI" <noreply@mascotte.com>',
      to: "mao@reblika.com",
      subject: `Request Custom ${text}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Request Custom ${text}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <main>
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src=${logoURL} alt="Logo" style="max-width: 100px;">
                    </div>
                    <h2 style="text-align: center;">Verify your email for Mascotte.AI</h2>
                    <p>One user request custom ${text}</p>
                    <p>Please contact him using this email: ${email}</p>
                    <p>Thanks,<br>Mascotte.AI Team</p>
                </main>
                <footer style="text-align: center; margin-top: 30px; font-size: 0.9em;">
                    <p>We're here to help!</p>
                    <p>Visit our help center to learn more about our service and to leave feedback and suggestions.</p>
                </footer>
            </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json({
      message: "Request Successfully! We will contact you soon.",
      success: true,
    });
  } catch (error) {
    console.error("Error during signup:", error);
    return NextResponse.json(
      { error: "Error processing the request" },
      { status: 500 }
    );
  }
}
