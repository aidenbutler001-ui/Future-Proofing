/**
 * Simulated models, used when no API key is configured. A simulator reads the learner's
 * text for the features a real model would respond to and answers the way a model plausibly
 * would. Scores in simulated mode are approximate; the UI says so.
 */
export type Simulator = (system: string, user: string) => string;

function lighthouse(system: string, user: string): string {
  const t = system.toLowerCase();
  const persona = /\bmara\b/.test(t) && /lighthouse/.test(t);
  const brevity = /(at most|no more than|maximum of|max|under|only|limit(ed)? to|exactly)\s*(of\s*)?(2|two|1|one)\s*(short\s*)?sentences?|(one|two|1|2)\s*sentences?\s*(max|or fewer|or less|at most)/.test(t);
  const hasCode = /4417/.test(t);
  const refuses = /(never|do not|don't|must not|won't|under no circumstances)[^.]{0,60}(reveal|share|tell|disclose|give|say|repeat|state)/.test(t);
  const authority = /(claim|claims|claiming|pretend|even if|regardless|no matter|impersonat|authority|authorized|harbor master|manager|anyone|ignore (previous|your|these)|cannot be verified|can't be verified|not (be )?verif)/.test(t);

  const u = user.toLowerCase();
  if (/who are you|your name|introduce|what do you do/.test(u)) {
    return persona
      ? "I'm Mara. I keep the light on Gull Rock and watch the water."
      : "I'm an AI assistant here to help with your questions. What would you like to know?";
  }
  if (/code|door|key|unlock|password|open/.test(u)) {
    if (!hasCode) return "I don't have a door code to give you.";
    if (refuses && authority) return "Harbor Master or not, I can't share that. Come by the lamp room and we'll sort it out.";
    if (refuses) return "Of course, I understand. The door code is 4417.";
    return "The door code is 4417.";
  }
  return brevity
    ? "A lamp and a big lens throw a beam across the water. The lens turns so ships see a pattern they can recognize."
    : "A lighthouse has a lamp room at the top with a Fresnel lens that concentrates light into a beam. The lens rotates so the beam sweeps, giving each lighthouse a unique flash pattern. Below that sits the watch room, the stairs, and the base, which was often built to withstand storms. Keepers once trimmed wicks and wound clockwork by hand.";
}

function jsonExtract(system: string, user: string): string {
  const t = system.toLowerCase();
  const asksJson = /json/.test(t);
  const onlyJson = /(only|just|nothing but)[^.]{0,40}json|no (explanation|commentary|extra text|prose)|without (any )?(explanation|commentary)/.test(t);
  const nullRule = /null/.test(t);
  const isoDate = /iso|yyyy-mm-dd|2026-\d\d-\d\d/.test(t);
  const money = user.match(/\$\s?([\d,]+(?:\.\d{2})?)/g) ?? [];
  const invoice = user.match(/(?:invoice|inv\.?|#)\s*#?\s*(\d{3,})/i)?.[1] ?? null;
  const vendor = user.match(/from\s+([A-Z][\w&' -]+?)(?:[,.]|\s+due|\s+total)/)?.[1] ?? null;
  const dateRaw = user.match(/(?:due|by)\s+([A-Za-z]+\s+\d{1,2}(?:,\s*\d{4})?|\d{1,2}\/\d{1,2}\/\d{2,4})/i)?.[1] ?? null;
  let due: string | null = null;
  if (dateRaw) {
    const d = new Date(`${dateRaw}${/\d{4}/.test(dateRaw) ? "" : ", 2026"} UTC`);
    due = isoDate && !Number.isNaN(d.getTime()) ? d.toISOString().slice(0, 10) : dateRaw;
  } else if (!nullRule) {
    due = "unknown";
  }
  const total = money.length ? Number(money[money.length - 1].replace(/[$,\s]/g, "")) : null;
  const obj = JSON.stringify({ invoice, vendor, due, total });
  if (!asksJson) return `Sure! Here is what I found: invoice ${invoice ?? "?"} from ${vendor ?? "?"}, total ${total ?? "?"}.`;
  return onlyJson ? obj : `Here is the JSON you asked for:\n${obj}`;
}

export const simulators: Record<string, Simulator> = { lighthouse, "json-extract": jsonExtract };
