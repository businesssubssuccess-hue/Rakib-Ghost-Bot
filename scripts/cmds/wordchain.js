const sessions = new Map(); // threadID → session

const TIMEOUT_SEC = 30;

module.exports = {
  config: {
    name: "wordchain",
    aliases: ["শব্দখেলা", "wchain"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 0,
    role: 0,
    shortDescription: { en: "Word chain game — last letter = next word's first letter" },
    longDescription: { en: "Play word chain in the group! Each word must start with the last letter of the previous word." },
    category: "game",
    guide: {
      en: "{p}wordchain start — new game\n{p}wordchain stop — end game\n{p}wordchain — see current word\n\nRules: type a word starting with the last letter of previous word. No repeats!"
    }
  },

  onStart: async function ({ message, args, event }) {
    const tid = event.threadID;
    const sub = args[0]?.toLowerCase();

    if (sub === "start") {
      if (sessions.has(tid)) return message.reply("⚠️ এই গ্রুপে ইতিমধ্যে game চলছে!\n.wordchain stop করে নতুন শুরু করো।");
      const startWords = ["apple", "animal", "earth", "tiger", "river", "night", "dragon"];
      const word = startWords[Math.floor(Math.random() * startWords.length)];
      sessions.set(tid, { word, used: new Set([word]), lastPlayer: null, timer: null });

      const timer = setTimeout(() => {
        const s = sessions.get(tid);
        if (s) {
          sessions.delete(tid);
          message.reply(`⏰ Time's up! Game শেষ!\n\nশেষ word ছিলো: "${s.word}"\nকেউ সময়মতো reply করেনি 😢`);
        }
      }, TIMEOUT_SEC * 1000);
      sessions.get(tid).timer = timer;

      return message.reply(
        `╔══════════════════════╗\n` +
        `║  🔤 Word Chain শুরু!  ║\n` +
        `╚══════════════════════╝\n\n` +
        `  শুরুর word: 👉 "${word.toUpperCase()}"\n\n` +
        `  📌 নিয়ম:\n` +
        `  ✦ "${word.slice(-1).toUpperCase()}" দিয়ে শুরু হওয়া word বলো\n` +
        `  ✦ English word হতে হবে\n` +
        `  ✦ পুনরাবৃত্তি করা যাবে না\n` +
        `  ✦ ${TIMEOUT_SEC}s এর মধ্যে reply করো!\n\n` +
        `  👻 Game এ .wordchain stop করে বের হওয়া যাবে`
      );
    }

    if (sub === "stop") {
      if (!sessions.has(tid)) return message.reply("⚠️ কোনো game চলছে না!");
      const s = sessions.get(tid);
      if (s.timer) clearTimeout(s.timer);
      sessions.delete(tid);
      return message.reply(`🛑 Word Chain game বন্ধ করা হয়েছে।\n\nTotal words used: ${s.used.size}`);
    }

    const s = sessions.get(tid);
    if (!s) {
      return message.reply(
        `╔══════════════════════╗\n` +
        `║  🔤 Word Chain Game   ║\n` +
        `╚══════════════════════╝\n\n` +
        `  .wordchain start — খেলা শুরু করো\n` +
        `  .wordchain stop  — খেলা বন্ধ করো\n\n` +
        `  নিয়ম: আগের word এর শেষ অক্ষর দিয়ে\n` +
        `  নতুন word শুরু করতে হবে!`
      );
    }

    return message.reply(
      `🔤 চলমান Word Chain:\n\n` +
      `  Current Word: "${s.word.toUpperCase()}"\n` +
      `  Next starts with: "${s.word.slice(-1).toUpperCase()}"\n` +
      `  Used: ${s.used.size} words`
    );
  },

  onChat: async function ({ message, event, api }) {
    const tid = event.threadID;
    const s = sessions.get(tid);
    if (!s) return;

    const body = event.body?.trim().toLowerCase().replace(/[^a-z]/g, "");
    if (!body || body.length < 2) return;

    const expected = s.word.slice(-1).toLowerCase();
    if (body[0] !== expected) return;

    if (s.used.has(body)) {
      return api.sendMessage(
        `❌ "${body.toUpperCase()}" ইতিমধ্যে ব্যবহার হয়েছে! অন্য word দাও।\n` +
        `Current: "${s.word.toUpperCase()}" → শুরু হতে হবে "${expected.toUpperCase()}" দিয়ে`,
        tid
      );
    }

    if (s.timer) clearTimeout(s.timer);
    s.used.add(body);
    s.lastPlayer = event.senderID;
    s.word = body;

    const nextLetter = body.slice(-1).toUpperCase();
    const timer = setTimeout(() => {
      const cur = sessions.get(tid);
      if (cur?.word === body) {
        sessions.delete(tid);
        api.sendMessage(
          `⏰ Time out! ${TIMEOUT_SEC}s এ কেউ reply করেনি।\n\nGame শেষ! শেষ word: "${body.toUpperCase()}"\n🏆 Total: ${cur.used.size} words`,
          tid
        );
      }
    }, TIMEOUT_SEC * 1000);
    s.timer = timer;

    await api.setMessageReaction("✅", event.messageID, () => {}, true);
    api.sendMessage(
      `✅ "${body.toUpperCase()}" — সঠিক!\n\n` +
      `  👉 এখন "${nextLetter}" দিয়ে শুরু হওয়া word বলো\n` +
      `  ⏳ ${TIMEOUT_SEC}s সময় আছে | Total: ${s.used.size} words`,
      tid
    );
  }
};
