import { NextResponse } from "next/server";

const apiKey = process.env.MAILCHIMP_API_KEY;
const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;
const subscribeStatus = process.env.MAILCHIMP_SUBSCRIBE_STATUS || "pending";

type MailchimpError = {
  title?: string;
  detail?: string;
};

export async function POST(request: Request) {
  if (!apiKey || !audienceId || !serverPrefix) {
    return NextResponse.json(
      { error: "Mailchimp is not configured." },
      { status: 500 },
    );
  }

  let payload: { email?: string };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = String(payload.email || "").trim().toLowerCase();
  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const status = subscribeStatus === "subscribed" ? "subscribed" : "pending";
  const response = await fetch(
    `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceId}/members`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`api:${apiKey}`).toString("base64")}`,
      },
      body: JSON.stringify({
        email_address: email,
        status,
      }),
    },
  );

  if (response.ok) {
    return NextResponse.json({ ok: true });
  }

  const errorData = (await response
    .json()
    .catch(() => null)) as MailchimpError | null;
  if (response.status === 400 && errorData?.title === "Member Exists") {
    return NextResponse.json({ ok: true, already: true });
  }

  return NextResponse.json(
    { error: errorData?.detail || "Unable to subscribe." },
    { status: response.status },
  );
}
