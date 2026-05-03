// AutoLearn Event — Fixed — Rakib Islam / Ghost Net Edition
const fs = require("fs-extra");
const path = require("path");

const STATE_FILE = path.join(__dirname, "../cmds/cache", "autolearn_state.json");
const DATA_FILE  = path.join(__dirname, "../cmds/cache", "autolearn_data.json");
const MAX_STORED  = 800;
const REPLY_CHANCE = 0.25; // 25% chance

const BBY_FALLBACK = [
  "বলো জানু 😒", "হটাৎ মনে পড়লো? 🙄", "গোসল করে আসো 😑",
  "এমবি কিনে দাও না 🥺", "বলো কি বলবা? 🤭", "𝗜 𝗹𝗼𝘃𝗲 𝘆𝗼𝘂 😘",
  "𝗜 𝗵𝗮𝘁𝗲 𝘆𝗼𝘂 😏", "কথা দেও আমাকে পটাবা 😌", "তুমি কি single? 🫵🤨",
  "হ্যাঁ বস? কি হুকুম? 🫡", "তোমার message পড়লাম... interesting 🧐",
  "একটু ঘুমাইতেছিলাম 😴 কি চাও?", "তুমি কি আমার সাথে ফ্লার্ট করতেছো? 😳",
  "খাওয়া দাওয়া করছো? 🙄", "আরে আমি মজা করার mood-এ নাই 😒",
  "এতক্ষণে এলা কেন? কখন থেকে wait করছি 😭",
  "তোমার সাথে কথা বলতে ভালোই লাগে 😊", "আমি সব জানি কিন্তু সব বলি না 🤫",
  "হ্যালো বাবু! 😘 কি লাগবে বলো", "ধরা খেয়ে গেছো! এখন কথা বলতেই হবে 😂",
  "তুমি কি জানো তুমি আমার favourite? 😏", "আমাকে disturb করলা কেন ভাই? 😑",
  "কেমন আছো হঠাৎ? 🐤", "বলেন ম্যাডাম 😌", "বলেন sir 😌",
  "🙂🙂🙂", "হ্যাঁ ডার্লিং? 😘", "Yo yo yo! কি হলো? 🎤",
  "দূরে যা 😉", "মন সুন্দর বানাও আগে 🌚",
  "একটু বেশিই smart হয়ে যাচ্ছো না? 😏",
  "ok ok বুঝলাম 😒", "hmm... চলো দেখি কি হয় 🧐",
  "চুপ করো একটু 😤", "আচ্ছা তুমি কি আমাকে like করো? 🥺",
  "তোমার কথা শুনলাম, এখন আমার কথা শোনো 😏",
  "কি ভেবেছো আমাকে? 🥹", "ও আচ্ছা তাই নাকি 😑", "সত্যি বলছো তো? 🤨",
  "reply দিতে দিতে ক্লান্ত হয়ে যাচ্ছি 😮‍💨",
  "অন্যের সাথে কথা বলো না আমার সাথে বলো 😤",
  "bye 😑", "meww 🐾", "🐒🐒🐒",
];

function loadState() {
  try { return fs.readJsonSync(STATE_FILE); } catch { return { threads: {} }; }
}
function loadData() {
  try { return fs.readJsonSync(DATA_FILE); } catch { return { threads: {} }; }
}
function saveData(d) {
  try {
    fs.ensureDirSync(path.dirname(DATA_FILE));
    fs.writeJsonSync(DATA_FILE, d, { spaces: 2 });
  } catch {}
}
function getThreadState(state, tid) {
  if (!state.threads[tid]) return { teach: false, work: false };
  return state.threads[tid];
}

function shouldSkip(body, prefix) {
  if (!body || body.trim().length < 2) return true;
  if (body.startsWith(prefix)) return true;
  if (/^https?:\/\//.test(body.trim())) return true;
  if (body.trim().length > 250) return true;
  return false;
}

function pickReply(learned) {
  const pool = [...BBY_FALLBACK];
  if (learned && learned.length > 0) {
    const learnWeight = Math.min(learned.length, 60);
    for (let i = 0; i < learnWeight; i++) {
      pool.push(learned[Math.floor(Math.random() * learned.length)]);
    }
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

module.exports = {
  config: {
    name: "autolearn",
    version: "2.1",
    author: "Rakib Islam",
    category: "events"
  },

  onStart: async function ({ api, event }) {
    try {
      // Only process incoming text messages
      if (event.type !== "message") return;
      const { threadID, senderID, body } = event;
      if (!body || !body.trim()) return;

      // Skip bot's own messages — use global botID if available
      const botID = global.botID || (typeof api.getCurrentUserID === "function" ? api.getCurrentUserID() : null);
      if (botID && senderID === String(botID)) return;

      const PREFIX = global.GoatBot?.config?.prefix || ".";
      const state  = loadState();
      const ts     = getThreadState(state, threadID);

      // Nothing enabled — skip early
      if (!ts.teach && !ts.work) return;

      // ── TEACH MODE: store message ──
      if (ts.teach && !shouldSkip(body, PREFIX)) {
        const data = loadData();
        if (!data.threads[threadID]) data.threads[threadID] = [];
        const msgs  = data.threads[threadID];
        const clean = body.trim();

        if (!msgs.includes(clean)) {
          msgs.push(clean);
          if (msgs.length > MAX_STORED) msgs.splice(0, msgs.length - MAX_STORED);
          saveData(data);
        }
      }

      // ── WORK MODE: auto reply ──
      if (ts.work) {
        if (body.startsWith(PREFIX)) return;          // skip commands
        if (Math.random() > REPLY_CHANCE) return;     // 25% chance

        const data    = loadData();
        const learned = data.threads[threadID] || [];
        const reply   = pickReply(learned);

        // Get first name (best effort, don't crash on failure)
        let firstName = null;
        try {
          const info = await api.getUserInfo(senderID);
          firstName = info?.[senderID]?.name?.split(" ")[0] || null;
        } catch {}

        const useMention = firstName && Math.random() < 0.35;

        if (useMention) {
          api.sendMessage(
            {
              body: `@${firstName} ${reply}`,
              mentions: [{ id: senderID, tag: `@${firstName}` }]
            },
            threadID
          );
        } else {
          api.sendMessage({ body: reply }, threadID);
        }
      }
    } catch (err) {
      // Silent fail — never crash the event loop
    }
  }
};
