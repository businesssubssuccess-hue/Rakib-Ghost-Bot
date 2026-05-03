const wishes = [
  "🎊 Happy New Year! নতুন বছর তোমার জীবনে সুখ, সমৃদ্ধি ও সাফল্য নিয়ে আসুক! 🌟",
  "🎉 নববর্ষের শুভেচ্ছা! গত বছরের সব কষ্ট ভুলে নতুন করে শুরু করো। 🚀",
  "🥂 Happy New Year! এই বছরটা তোমার সেরা বছর হোক। স্বপ্ন দেখো, পরিশ্রম করো। 💪",
  "🌅 নতুন বছর মানে নতুন সুযোগ। এই সুযোগটা কাজে লাগাও। শুভ নববর্ষ! 🌸",
  "✨ Happy New Year 2025! আল্লাহ তোমার সব দোয়া কবুল করুন এই বছরে। 🤲",
  "🎆 নববর্ষের রাতে আতশবাজির মতো তোমার জীবন আলোকিত হোক! 🌟"
];

module.exports.config = {
  name: "newyr",
  aliases: ["newyear", "নববর্ষ2", "happyny"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "New Year wishes 🎊" },
  longDescription: { en: "Send happy New Year wishes in Bangla!" },
  category: "social",
  guide: { en: "{pn} [@mention]" }
};

module.exports.onStart = async ({ event, message, usersData }) => {
  const uids = Object.keys(event.mentions || {});
  const w = wishes[Math.floor(Math.random() * wishes.length)];
  let target = "";
  if (uids.length > 0) {
    const name = await usersData.getName(uids[0]) || "তুমি";
    target = `🎊 ${name}!\n\n`;
  }
  return message.reply(`🎊 𝗡𝗲𝘄 𝗬𝗲𝗮𝗿\n━━━━━━━━━━━━\n${target}${w}\n━━━━━━━━━━━━\n🌟 আরেকটা: .newyr`);
};
