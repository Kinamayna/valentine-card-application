import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// ─── Resend client — key loaded from env ──────────────────────────────────────
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    // ── 1. Parse body ─────────────────────────────────────────────────────────
    const body = await req.json();
    const { response } = body as { response: "YES" | "NO" };

    if (response !== "YES" && response !== "NO") {
      return NextResponse.json({ error: "Invalid response value" }, { status: 400 });
    }

    // ── 2. Validate env vars ──────────────────────────────────────────────────
    const requiredVars = ["RESEND_API_KEY", "NOTIFY_EMAIL_TO", "NOTIFY_EMAIL_FROM"];
    const missing = requiredVars.filter((v) => !process.env[v]);
    if (missing.length > 0) {
      console.error("Missing env vars:", missing);
      return NextResponse.json({ error: `Missing env vars: ${missing.join(", ")}` }, { status: 500 });
    }

    // ── 3. Build email content ────────────────────────────────────────────────
    const isYes = response === "YES";

    const subject = isYes
      ? "💝 She said YES! Valentine's Response Received"
      : "💔 Valentine's Response — No, Thank You";

    const htmlBody = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body style="margin:0;padding:0;background:#1a0510;font-family:'Georgia',serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a0510;padding:40px 20px;">
            <tr><td align="center">
              <table width="560" cellpadding="0" cellspacing="0" style="background:linear-gradient(145deg,#2d0a1a,#1f0614);border-radius:20px;border:1px solid rgba(255,150,180,0.2);overflow:hidden;">

                <!-- Header -->
                <tr>
                  <td style="background:linear-gradient(135deg,#9f1239,#e11d48);padding:30px;text-align:center;">
                    <div style="font-size:48px;margin-bottom:10px;">${isYes ? "💝" : "💔"}</div>
                    <h1 style="color:#fff;margin:0;font-size:24px;font-weight:400;letter-spacing:2px;">
                      ${isYes ? "She said YES!" : "She said no..."}
                    </h1>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:36px 40px;text-align:center;">
                    <p style="color:#fda4af;font-size:32px;margin:0 0 16px;letter-spacing:1px;">
                      ${isYes ? "🎉 Congratulations! 🎉" : "💫 It's Okay"}
                    </p>
                    <p style="color:rgba(255,200,210,0.8);font-size:16px;line-height:1.8;margin:0 0 24px;">
                      ${isYes
                        ? "Your Valentine's Day invitation has been <strong style='color:#fb7185;'>accepted</strong>! Time to plan something absolutely magical. You've got a date to prepare for! 🥂"
                        : "Your Valentine's Day invitation was <strong style='color:#fda4af;'>declined</strong>. Remember, every 'no' is just a 'not yet'. Stay wonderful, and maybe next time! 🌸"
                      }
                    </p>

                    <!-- Response badge -->
                    <div style="display:inline-block;background:${isYes ? "rgba(244,63,94,0.2)" : "rgba(150,100,120,0.2)"};border:1px solid ${isYes ? "rgba(244,63,94,0.4)" : "rgba(200,100,130,0.3)"};border-radius:50px;padding:10px 28px;margin-bottom:28px;">
                      <span style="color:${isYes ? "#fb7185" : "#fda4af"};font-size:14px;letter-spacing:3px;text-transform:uppercase;">
                        Response: <strong>${response}</strong>
                      </span>
                    </div>

                    <p style="color:rgba(255,150,170,0.4);font-size:12px;letter-spacing:2px;margin:0;">
                      ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background:rgba(0,0,0,0.3);padding:16px;text-align:center;">
                    <p style="color:rgba(255,130,160,0.3);font-size:11px;margin:0;letter-spacing:1px;">
                      Sent via Your Valentine's Day Card App ❤️
                    </p>
                  </td>
                </tr>

              </table>
            </td></tr>
          </table>
        </body>
      </html>
    `;

    // ── 4. Send email via Resend ──────────────────────────────────────────────
    const { data, error } = await resend.emails.send({
      from: process.env.NOTIFY_EMAIL_FROM!,        // e.g. "Valentine Card <you@yourdomain.com>"
      to: [process.env.NOTIFY_EMAIL_TO!],          // your personal email address
      subject,
      html: htmlBody,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
    }

    console.log(`✅ Notification sent! Email ID: ${data?.id} | Response: ${response}`);
    return NextResponse.json({ success: true, emailId: data?.id });

  } catch (err) {
    console.error("Unexpected error in /api/submit-response:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Reject non-POST requests
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}