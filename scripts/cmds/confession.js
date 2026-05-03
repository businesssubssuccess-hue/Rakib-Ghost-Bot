const fs = require("fs-extra");
const path = require("path");

const CACHE_DIR = path.join(__dirname, "cache");
const LOG_FILE = path.join(CACHE_DIR, "confession_log.json");

function loadLog() {
  try { return JSON.parse(fs.readFileSync(LOG_FILE, "utf8")); } catch { return {}; }
}
function saveLog(data) {
  fs.ensureDirSync(CACHE_DIR);
  fs.writeFileSync(LOG_FILE, JSON.stringify(data, null, 2));
}

const CONFESSION_EMOJIS = ["💀", "👻", "😈", "🔥", "💔", "🌙", "😭", "🤫", "⚡", "🫀"];

module.exports = {
  config: {
    name: "confession",
    aliases: ["confess", "anon", "anonymous"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 30,
    role: 0,
    shortDescription: { en: "Anonymously confess something in the group" },
    longDescription: { en: "Send an anonymous confession to the group chat. Your identity stays hidden." },
    category: "fun",
    guide: {
      en: "{p}confession <your message>\n\nExamples:\n{p}confession আমি এই গ্রুপের কাউকে পছন্দ করি 😳\n{p}confession I have a crush in this gc\n\n⚠️ Admin can see logs with: {p}confession log"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    const isAdmin = String(event.senderID) === "61575436812912" ||
      (global.GoatBot?.config?.adminBot || []).map(String).includes(String(event.senderID));

    // Admin log view
    if (args[0]?.toLowerCase() === "log" && isAdmin) {
      const log = loadLog();
      const entries = Object.entries(log).slice(-10);
      if (!entries.length) return message.reply("📋 কোনো confession log নেই।");
      const lines = entries.map(([id, d]) =>
        `🔢 #${id}\n👤 UID: ${d.sender}\n💬 ${d.text}\n📅 ${new Date(d.time).toLocaleString("en-BD", { timeZone: "Asia/Dhaka" })}`
      ).join("\n━━━━━━━━━\n");
      return message.reply(`📋 Last 10 Confession Logs:\n━━━━━━━━━\n${lines}`);
    }

    const text = args.join(" ").trim();
    if (!text) {
      return message.reply(
        `╔══════════════════════╗\n` +
        `║  🤫 Anonymous Confess  ║\n` +
        `╚══════════════════════╝\n\n` +
        `📌 ব্যবহার:\n` +
        `  .confession <তোমার confession>\n\n` +
        `📌 Example:\n` +
        `  .confession এই গ্রুপের কাউকে পছন্দ করি 😳\n\n` +
        `✅ তোমার নাম/id কেউ দেখতে পাবে না!\n` +
        `⚠️ Admin শুধু log দেখতে পারে।`
      );
    }

    if (text.length > 500) return message.reply("❌ Confession সর্বোচ্চ ৫০০ অক্ষর হতে পারবে।");

    const log = loadLog();
    const confId = (Object.keys(log).length + 1).toString().padStart(3, "0");
    log[confId] = { sender: event.senderID, text, time: Date.now(), thread: event.threadID };
    saveLog(log);

    const emoji = CONFESSION_EMOJIS[Math.floor(Math.random() * CONFESSION_EMOJIS.length)];
    const hour = new Date().toLocaleString("en-BD", { timeZone: "Asia/Dhaka", hour: "2-digit", minute: "2-digit" });

    // Try to unsend original message (to preserve anonymity)
    try { await api.unsendMessage(event.messageID); } catch {}

    await api.sendMessage(
      `╔══════════════════════╗\n` +
      `║  ${emoji} Anonymous Confession ║\n` +
      `╚══════════════════════╝\n\n` +
      `  "${text}"\n\n` +
      `  ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n` +
      `  📌 #${confId} | 🕐 ${hour} | Anonymous\n` +
      `  👻 Ghost Bot — Rakib Islam`,
      event.threadID
    );
  }
};
