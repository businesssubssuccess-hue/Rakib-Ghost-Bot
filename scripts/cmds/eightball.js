module.exports = {
  config: {
    name: "eightball",
    aliases: ["8ball", "magic"],
    version: "1.0",
    author: "Rakib",
    countDown: 3,
    role: 0,
    shortDescription: "Magic 8-ball — yes/no question",
    category: "fun",
    guide: { en: "{p}eightball <তোমার প্রশ্ন>" }
  },
  onStart: async function ({ message, args }) {
    if (!args.length) return message.reply("⚠️ একটা প্রশ্ন লিখো\nযেমন: eightball আমি কি rich হবো?");
    const ans = [
      "✅ অবশ্যই হ্যাঁ", "✅ একদম confirm", "✅ Sure শোনো",
      "🤔 হয়তো", "🤔 একটু ধৈর্য ধরো", "🤔 সম্ভব",
      "❌ একদম না", "❌ ভুলেও না", "❌ সম্ভব না",
      "🌙 future ই বলবে", "👻 ভূত জানে না", "🎲 ৫০-৫০",
      "💀 Ghost বলছে — সম্ভাবনা কম", "🔮 চাঁদের আলো হ্যাঁ বলছে"
    ];
    const a = ans[Math.floor(Math.random() * ans.length)];
    return message.reply(`🎱 𝗠𝗔𝗚𝗜𝗖 𝟴-𝗕𝗔𝗟𝗟\n━━━━━━━━━━━━━━\n❓ ${args.join(" ")}\n${a}\n━━━━━━━━━━━━━━\n💀 Ghost Net`);
  }
};
