module.exports.config = {
  name: "coin2",
  aliases: ["coinflip", "টস", "headtail"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Flip a coin — Heads or Tails 🪙" },
  longDescription: { en: "Flip a virtual coin and get heads or tails!" },
  category: "utility-bd",
  guide: { en: "{pn}" }
};

module.exports.onStart = async ({ message }) => {
  const result = Math.random() < 0.5;
  const emoji = result ? "🪙" : "⬜";
  const name = result ? "HEAD (মাথা)" : "TAIL (লেজ)";
  const fun = result ? "ভাগ্য তোমার পক্ষে! 🍀" : "এবার তোমার বিপক্ষে! 😅 আবার চেষ্টা করো।";
  return message.reply(`🪙 𝗖𝗼𝗶𝗻 𝗙𝗹𝗶𝗽\n━━━━━━━━━━━━\n${emoji} ফলাফল: ${name}\n━━━━━━━━━━━━\n${fun}\n🔄 আবার: .coin2`);
};
