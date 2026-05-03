module.exports = {
  config: {
    name: "guessnum",
    aliases: ["guess", "andajkoro"],
    version: "1.0",
    author: "Rakib",
    countDown: 2,
    role: 0,
    shortDescription: "1-100 এর মধ্যে number guess করো",
    category: "game",
    guide: { en: "{p}guessnum  → start\nReply with a number" }
  },
  onStart: async function ({ message, event, commandName }) {
    const target = Math.floor(Math.random() * 100) + 1;
    const sent = await message.reply(`🎯 𝗚𝗨𝗘𝗦𝗦 𝗧𝗛𝗘 𝗡𝗨𝗠𝗕𝗘𝗥\n━━━━━━━━━━━━━━\n1-100 এর মধ্যে কোনো number এ আমি ভাবছি...\n💬 Reply this message with your guess (max 7 tries)\n━━━━━━━━━━━━━━\n👻 Ghost Net`);
    global.GoatBot.onReply.set(sent.messageID, { commandName, messageID: sent.messageID, author: event.senderID, target, tries: 0 });
  },
  onReply: async function ({ message, event, Reply }) {
    if (event.senderID !== Reply.author) return;
    const n = parseInt(event.body);
    if (isNaN(n) || n < 1 || n > 100) return message.reply("⚠️ 1-100 এর মধ্যে number দাও");
    Reply.tries++;
    if (n === Reply.target) {
      global.GoatBot.onReply.delete(Reply.messageID);
      return message.reply(`🏆 জিতলে! Number ছিল ${Reply.target}\n📊 Tries: ${Reply.tries}\n👻 Ghost Net`);
    }
    if (Reply.tries >= 7) {
      global.GoatBot.onReply.delete(Reply.messageID);
      return message.reply(`💀 Game শেষ! Number ছিল ${Reply.target}\n👻 Ghost Net`);
    }
    const hint = n < Reply.target ? "⬆️ আরো বড়" : "⬇️ আরো ছোট";
    const sent = await message.reply(`${hint}\n💬 Reply this message — ${7 - Reply.tries} tries বাকি`);
    global.GoatBot.onReply.set(sent.messageID, { ...Reply, messageID: sent.messageID });
  }
};
