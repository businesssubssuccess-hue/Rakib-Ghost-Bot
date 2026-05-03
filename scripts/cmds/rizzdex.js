// Rizz Dex — Full Rizz Analysis — Rakib Islam / Ghost Net Edition

const RIZZ_LINES = [
  "Are you a parking ticket? Because you've got 'fine' written all over you 😏",
  "Do you have a map? I keep getting lost in your eyes 🗺️",
  "Is your name Google? Because you have everything I've been searching for 🔍",
  "Are you a magician? Because whenever I look at you, everyone else disappears ✨",
  "Do you believe in love at first swipe? 📱",
  "If you were a vegetable, you'd be a cute-cumber 🥒",
  "Are you a bank loan? Because you have my interest 💰",
  "Do you have a Band-Aid? I hurt myself falling for you 🩹",
  "Are you French? Because Eiffel for you 🗼",
  "Is your name Wi-Fi? Because I'm feeling a connection 📶",
  "You must be a broom, because you just swept me off my feet 🧹",
  "Are you a camera? Because every time I look at you, I smile 📸",
  "If beauty were time, you'd be an eternity ⏳",
  "Do you have sunscreen? Because you're too hot to handle ☀️",
  "Are you a keyboard? Because you're just my type ⌨️",
];

const RIZZ_LEVELS = [
  [0,  15, "💀 Negative Rizz", "তুই rizz এর opposite। কেউ তোকে দেখলে চলে যায়! 🏃"],
  [16, 30, "🪨 Stone Cold — 0 game", "Rizz কি জিনিস তুই জানিস না। Google কর! 📖"],
  [31, 50, "😐 Average Rizz", "মোটামুটি চলে, কিন্তু কেউ impressed হয় না 😑"],
  [51, 70, "😏 Mid Rizz — tries hard", "চেষ্টা করছিস, কিছুটা কাজ হচ্ছে! 💪"],
  [71, 85, "🔥 Solid Rizz — people notice", "এই rizz দিয়ে কাজ হবে! সবাই তোকে দেখছে 😎"],
  [86, 95, "💎 High Rizz — sigma mode", "Certified rizz lord! কেউ resist করতে পারে না 👑"],
  [96, 100,"🌌 UNSPOKEN RIZZ — GOAT level", "Rizz এতটাই powerful যে কথাই বলতে হয় না 🌟"],
];

function getLevel(score) {
  for (const [min, max, label, comment] of RIZZ_LEVELS) {
    if (score >= min && score <= max) return { label, comment };
  }
  return RIZZ_LEVELS[RIZZ_LEVELS.length - 1];
}

module.exports = {
  config: {
    name: "rizzdex",
    aliases: ["rizzcheck", "rizzlevel", "rizzanalyze"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Full Rizz analysis + pickup line 😏" },
    longDescription: { en: "Check rizz level with meter, rating, and a random pickup line. Bengali commentary included." },
    category: "fun",
    guide: { en: "{p}rizzdex — নিজের rizz check\n{p}rizzdex @mention — কারো rizz check\n{p}rizzdex line — Random pickup line only" }
  },

  onStart: async function ({ api, event, args, message, usersData }) {
    // Just a pickup line
    if (args[0]?.toLowerCase() === "line") {
      const line = RIZZ_LINES[Math.floor(Math.random() * RIZZ_LINES.length)];
      api.setMessageReaction("😏", event.messageID, () => {}, true);
      return message.reply(`😏 Rizz Line:\n\n"${line}"\n\n━━━━━━━━━━━━━━━━\nUse responsibly! 😂 — Rakib Islam`);
    }

    const mentioned = Object.keys(event.mentions || {});
    let uid;
    if (event.messageReply) uid = event.messageReply.senderID;
    else if (mentioned.length > 0) uid = mentioned[0];
    else uid = event.senderID;

    let name = "Unknown";
    try { const u = await usersData.get(uid); name = u?.name || "Unknown"; } catch {}

    const seed = uid.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const score = (seed * 17 + 5) % 101;
    const { label, comment } = getLevel(score);
    const line = RIZZ_LINES[seed % RIZZ_LINES.length];

    const filled = Math.round(score / 100 * 15);
    const bar = `[${"😏".repeat(Math.ceil(filled / 3))}${"💀".repeat(Math.ceil((15 - filled) / 3))}] ${score}%`;

    const emoji = score < 30 ? "🪨" : score < 60 ? "😏" : score < 80 ? "🔥" : "🌌";
    api.setMessageReaction(emoji, event.messageID, () => {}, true);

    message.reply(
      `╔══════════════════════════╗\n` +
      `║  😏 RIZZ DEX ANALYSIS     ║\n` +
      `╚══════════════════════════╝\n\n` +
      `  ✦ Name    › ${name}\n` +
      `  ✦ Rizz    › ${score}%\n` +
      `  ✦ Meter   › ${bar}\n\n` +
      `  ${emoji} ${label}\n  💬 "${comment}"\n\n` +
      `  ┄┄┄┄ তোর Rizz Line ┄┄┄┄\n` +
      `  "${line}"\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `  ⚠️ Just for fun! 😂\n  — Rakib Islam | Ghost Bot 👻`
    );
  }
};
