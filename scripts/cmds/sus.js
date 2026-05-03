// Sus Meter — Among Us themed — Rakib Islam / Ghost Net Edition

const SUS_LEVELS = [
  [0,  15, "✅ NOT SUS — এক্কেবারে innocent", "এই মানুষ সাদা মনের! Crewmate material 💚"],
  [16, 30, "😐 Slightly Sus — একটু সন্দেহজনক", "কি করছিলি একা একা? একটু খেয়াল রাখতে হবে 👀"],
  [31, 50, "🤔 Medium Sus — নজরে আসছে", "Security footage এ কিছু একটা দেখা গেছে মনে হয়... 📷"],
  [51, 70, "😳 Pretty Sus — সবাই সন্দেহ করছে", "ভেন্টে যাচ্ছিলি না তো? কি করছিলি reactor এ? 🔧"],
  [71, 85, "🔴 VERY SUS — Emergency Meeting দরকার", "🚨 EMERGENCY MEETING! এই লোক ভেন্টে দেখা গেছে! 🚨"],
  [86, 95, "👾 MEGA SUS — প্রায় impostor confirmed", "Body report! এই লোকই করছে! Vote করো! 💀"],
  [96, 100,"☠️ 100% IMPOSTOR — Caught!", "Among Us game over! Impostor বের হয়ে গেছে! 🎮"],
];

const VENT_EMOJIS = ["🔴","🟥","👾","💀","☠️","🚨","😈","🤡","🎭"];

function getLevel(score) {
  for (const [min, max, label, comment] of SUS_LEVELS) {
    if (score >= min && score <= max) return { label, comment };
  }
  return SUS_LEVELS[SUS_LEVELS.length - 1];
}

function susBar(score) {
  const filled = Math.round(score / 100 * 15);
  const e = score > 70 ? "🔴" : score > 40 ? "🟡" : "🟢";
  return `[${"█".repeat(filled)}${"░".repeat(15 - filled)}] ${score}%`;
}

module.exports = {
  config: {
    name: "sus",
    aliases: ["susmeter", "impostor", "amogus", "vented"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Among Us sus meter — কে impostor?" },
    longDescription: { en: "Check how sus someone is. Among Us themed with Bengali commentary. Emergency meeting!" },
    category: "fun",
    guide: { en: "{p}sus — নিজের sus score\n{p}sus @mention — কেউ কতটা sus?\n{p}sus reply — replied user এর sus meter" }
  },

  onStart: async function ({ api, event, args, message, usersData }) {
    const mentioned = Object.keys(event.mentions || {});
    let uid, name;

    if (event.messageReply) {
      uid = event.messageReply.senderID;
    } else if (mentioned.length > 0) {
      uid = mentioned[0];
    } else {
      uid = event.senderID;
    }

    try { const u = await usersData.get(uid); name = u?.name || "Unknown"; }
    catch { name = "Unknown"; }

    const seed = uid.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const score = (seed * 7 + 13) % 101;
    const { label, comment } = getLevel(score);
    const bar = susBar(score);

    const color = score > 85 ? "🔴" : score > 60 ? "🟡" : "🟢";
    api.setMessageReaction(score > 70 ? "🚨" : "👀", event.messageID, () => {}, true);

    const header = score > 85 ? "🚨 EMERGENCY MEETING! 🚨" : score > 60 ? "👀 Suspicious Activity!" : "🔍 Sus Scan Complete";

    message.reply(
      `╔══════════════════════════╗\n` +
      `║  ${header.padEnd(26)}║\n` +
      `╚══════════════════════════╝\n\n` +
      `  ✦ Player  › ${name}\n` +
      `  ✦ Sus     › ${score}%  ${color}\n` +
      `  ✦ Meter   › ${bar}\n\n` +
      `  ${label}\n\n` +
      `  💬 Verdict:\n  "${comment}"\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `  🎮 Among Us vibes | Just for fun!\n  — Rakib Islam | Ghost Bot 👻`
    );
  }
};
