// NPC Behavior Analyzer — Rakib Islam / Ghost Net Edition

const NPC_LEVELS = [
  [0,  15, "🌟 MAIN CHARACTER", "তুই এই গল্পের হিরো! সবাই তোর পাশে 🎬"],
  [16, 30, "✨ Side Character (Important)", "তুই গল্পের গুরুত্বপূর্ণ অংশ, চালিয়ে যা! 💪"],
  [31, 50, "😐 Background Character", "তোকে কেউ দেখে না তেমন, কিন্তু থাকিস 👻"],
  [51, 70, "🤖 Mid-tier NPC", "\"Yes, hello.\" \"Greetings, traveller.\" তোর ডায়ালগ শেষ হয়ে গেছে 😶"],
  [71, 85, "🪑 Furniture Level NPC", "তুই NPC এর মধ্যেও NPC। Furniture এর চেয়ে বেশি কিছু না 🪑"],
  [86, 95, "💀 Glitched NPC", "তোর AI broken। একই কথা বারবার বলিস। একই কথা বারবার বলিস। 🔄"],
  [96, 100,"🗑️ Deleted NPC", "তোকে কেউ game থেকে delete করে দিছে। Exist ই করিস না তুই 🗑️"],
];

const NPC_DIALOGUES = [
  "\"Have you heard about the war in the north?\"",
  "\"I used to be an adventurer like you...\"",
  "\"What can I help you with, traveller?\"",
  "\"Greetings!\" *turns 45 degrees and repeats*",
  "\"The weather is nice today.\"",
  "\"My cousin's out fighting dragons...\"",
  "\"I don't know anything about that.\"",
];

function getLevel(score) {
  for (const [min, max, label, comment] of NPC_LEVELS) {
    if (score >= min && score <= max) return { label, comment };
  }
  return NPC_LEVELS[NPC_LEVELS.length - 1];
}

module.exports = {
  config: {
    name: "npc",
    aliases: ["npccheck", "npcmeter", "mainchar"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 0,
    shortDescription: { en: "NPC behavior analyzer — তুই কি NPC নাকি main character?" },
    longDescription: { en: "Analyze if someone is an NPC or main character. Funny Bengali commentary included." },
    category: "fun",
    guide: { en: "{p}npc — নিজের NPC level\n{p}npc @mention — কারো NPC scan\n{p}npc reply — replied user এর scan" }
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
    const score = (seed * 11 + 7) % 101;
    const { label, comment } = getLevel(score);
    const dialogue = NPC_DIALOGUES[seed % NPC_DIALOGUES.length];

    const filled = Math.round(score / 100 * 15);
    const bar = `[${"🤖".repeat(Math.ceil(filled / 5))}${"⭐".repeat(Math.ceil((15 - filled) / 5))}] ${score}% NPC`;

    const emoji = score < 30 ? "🌟" : score < 60 ? "😐" : score < 80 ? "🤖" : "💀";
    api.setMessageReaction(emoji, event.messageID, () => {}, true);

    message.reply(
      `╔══════════════════════════╗\n` +
      `║  🤖 NPC ANALYZER RESULT   ║\n` +
      `╚══════════════════════════╝\n\n` +
      `  ✦ Player  › ${name}\n` +
      `  ✦ NPC %   › ${score}%\n` +
      `  ✦ Meter   › ${bar}\n\n` +
      `  ${emoji} ${label}\n\n` +
      `  💬 তোর NPC ডায়ালগ:\n  ${dialogue}\n\n` +
      `  📝 Verdict: "${comment}"\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `  ⚠️ Just for fun! 😂\n  — Rakib Islam | Ghost Bot 👻`
    );
  }
};
