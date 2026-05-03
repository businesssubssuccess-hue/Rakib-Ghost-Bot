module.exports = {
  config: {
    name: "mathquiz",
    aliases: ["mquiz"],
    version: "1.0",
    author: "Rakib",
    countDown: 2,
    role: 0,
    shortDescription: "Math problem solve করো",
    category: "game",
    guide: { en: "{p}mathquiz [easy|medium|hard]" }
  },
  onStart: async function ({ message, event, args, commandName }) {
    const lvl = (args[0] || "medium").toLowerCase();
    const r = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
    let q, ans;
    if (lvl === "easy") {
      const a = r(1, 20), b = r(1, 20), op = ["+", "-"][r(0, 1)];
      q = `${a} ${op} ${b}`; ans = op === "+" ? a + b : a - b;
    } else if (lvl === "hard") {
      const a = r(10, 50), b = r(2, 15), c = r(1, 20);
      q = `${a} * ${b} - ${c}`; ans = a * b - c;
    } else {
      const a = r(5, 50), b = r(2, 12);
      q = `${a} * ${b}`; ans = a * b;
    }
    const sent = await message.reply(`🧮 𝗠𝗔𝗧𝗛 𝗤𝗨𝗜𝗭 [${lvl}]\n━━━━━━━━━━━━━━\n❓ ${q} = ?\n💬 Reply with your answer (15s)\n━━━━━━━━━━━━━━\n👻 Ghost Net`);
    global.GoatBot.onReply.set(sent.messageID, { commandName, messageID: sent.messageID, author: event.senderID, ans });
    setTimeout(() => {
      if (global.GoatBot.onReply.has(sent.messageID)) {
        global.GoatBot.onReply.delete(sent.messageID);
        message.reply(`⏰ Time over! Answer: ${ans}`);
      }
    }, 15000);
  },
  onReply: async function ({ message, event, Reply }) {
    if (event.senderID !== Reply.author) return;
    const u = parseInt(event.body);
    global.GoatBot.onReply.delete(Reply.messageID);
    if (u === Reply.ans) return message.reply(`🏆 ঠিক উত্তর! Answer: ${Reply.ans}\n👻 Ghost Net`);
    return message.reply(`❌ ভুল! সঠিক answer: ${Reply.ans}\n👻 Ghost Net`);
  }
};
