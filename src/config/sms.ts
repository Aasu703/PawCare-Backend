import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER, NODE_ENV } from "./index";

// Lazy import to avoid unused dep errors if creds are missing
let twilioClient: any;

const hasTwilioCreds = Boolean(
  TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_FROM_NUMBER,
);

async function getClient() {
  if (!hasTwilioCreds) return null;
  if (!twilioClient) {
    // Dynamically require to keep dependency optional in tests
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const twilio = require("twilio");
    twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  }
  return twilioClient;
}

export async function sendSms(to: string, body: string) {
  if (!to) throw new Error("Recipient phone number is required");

  if (!hasTwilioCreds) {
    // In non-production, allow logging instead of failing hard
    if (NODE_ENV !== "production") {
      console.warn("Twilio credentials missing; SMS not sent. Message:", { to, body });
      return;
    }
    throw new Error("SMS credentials not configured");
  }

  const client = await getClient();
  await client.messages.create({ to, from: TWILIO_FROM_NUMBER, body });
}
