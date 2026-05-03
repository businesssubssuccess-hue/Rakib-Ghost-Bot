module.exports = {
  config: {
    name: "anagram",
    aliases: ["wordscramble"],
    version: "1.0",
    author: "Rakib",
    countDown: 2,
    role: 0,
    shortDescription: "Scrambled letter থেকে word খুঁজো",
    category: "game",
    guide: { en: "{p}anagram" }
  },
  onStart: async function ({ message, event, commandName }) {
    const words = ["bangladesh", "facebook", "ghost", "rakib", "mobile", "internet", "computer", "chocolate", "diamond", "elephant", "october", "umbrella", "warrior", "perfect", "library", "dragon", "thunder", "magic", "shadow", "neon"];
    const w = words[Math.floor(Math.random() * words.length)];
    const sc = w.split("").sort(() => Math.random() - 0.5).join("");
    const sent = await message.reply(`🔤 𝗔𝗡𝗔𝗚𝗥𝗔𝗠\n━━━━━━━━━━━━━━\n🔀 Scrambled: ${sc.toUpperCase()}\n📏 Length   : ${w.length}\n💬 Reply with the original word (20s)\n━━━━━━━━━━━━━━\n👻 Ghost Net`);
    global.GoatBot.onReply.set(sent.messageID, { commandName, messageID: sent.messageID, author: event.senderID, word: w });
    setTimeout(() => {
      if (global.GoatBot.onReply.has(sent.messageID)) {
        global.GoatBot.onReply.delete(sent.messageID);
        message.reply(`⏰ Time over! Word ছিল: ${w}`);
      }
    }, 20000);
  },
  onReply: async function ({ message, event, Reply }) {
    if (event.senderID !== Reply.author) return;
    global.GoatBot.onReply.delete(Reply.messageID);
    if (event.body.trim().toLowerCase() === Reply.word) return message.reply(`🏆 জিতলে! Word: ${Reply.word}\n👻 Ghost Net`);
    return message.reply(`❌ ভুল! সঠিক word: ${Reply.word}\n👻 Ghost Net`);
  }
};
