import axios from "axios";
import pLimit from "p-limit";

const API_URL = process.env.WAHA_URL || "http://localhost:3000/api/sendText";
const X_API_KEY = process.env.WAHA_API_KEY || "your_api_key_here";

/**
 * Convert plain phone number to chatId used by WAHA:
 *   1) Remove non-digits
 *   2) Do NOT include leading plus, append @c.us
 */
function phoneToChatId(phone: string) {
  const digits = phone.replace(/\D+/g, "");
  return `${digits}@c.us`;
}

type SendResult = { phone: string; ok: boolean; status?: number; data?: any; error?: any };

/**
 * sendSingle - call WAHA sendText for one phone
 */
async function sendSingle(phone: string, text: string, session = "default"): Promise<SendResult> {
  const chatId = phoneToChatId(phone);
  try {
    const resp = await axios.post(
      API_URL,
      { session, chatId, text },
      { headers: { "Content-Type": "application/json", "X-Api-Key": X_API_KEY }, timeout: 15000 }
    );
    return { phone, ok: true, status: resp.status, data: resp.data };
  } catch (err: any) {
    // normalize error
    return { phone, ok: false, error: err?.response?.data ?? err?.message ?? err, status: err?.response?.status };
  }
}

/**
 * bulkSend - send to many phones with concurrency and retries
 */
export async function bulkSend(
  phones: string[],
  text: string,
  opts?: { session?: string; concurrency?: number; retries?: number; retryDelayMs?: number }
): Promise<SendResult[]> {
  const session = opts?.session ?? "default";
  const concurrency = opts?.concurrency ?? 5;     // small concurrency to behave more "human"
  const retries = opts?.retries ?? 2;
  const retryDelayMs = opts?.retryDelayMs ?? 1000;

  const limit = pLimit(concurrency);

  async function attempt(phone: string): Promise<SendResult> {
    let attemptNum = 0;
    while (attemptNum <= retries) {
      const res = await sendSingle(phone, text, session);
      if (res.ok) return res;
      attemptNum++;
      // simple retry logic for transient failures
      if (attemptNum <= retries) {
        await new Promise((r) => setTimeout(r, retryDelayMs * attemptNum));
      } else {
        return res;
      }
    }
    // fallback (shouldn't hit)
    return { phone, ok: false, error: "unknown" };
  }

  // schedule all tasks with concurrency control
  const tasks = phones.map((p) => limit(() => attempt(p)));
  return await Promise.all(tasks);
}

/* Example usage (uncomment to run)
(async () => {
  const phones = ["+1 213 213 2130","12132132131","+44 7700 900123"];
  const text = "Hello from WAHA — this is a test message!";
  const results = await bulkSend(phones, text, { concurrency: 3, retries: 1 });
  console.log("Results:", results);
})();
*/

