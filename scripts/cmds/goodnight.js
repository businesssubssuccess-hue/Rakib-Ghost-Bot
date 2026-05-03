const msgs = [
  "শুভ রাত্রি! 🌙 সুন্দর স্বপ্ন দেখো। কাল সকালে আবার কথা হবে। 💤",
  "রাতের আকাশ তারায় ভরা। 🌟 তোমার ঘুম মিষ্টি হোক। Good night! 🌸",
  "দিনের ক্লান্তি দূর করো, ভালো করে ঘুমাও। 🛏️ শুভ রাত্রি! 💙",
  "রাত হয়েছে, ফোন রেখে দাও। 😄 ভালো ঘুম হোক। Good night! 🌙✨",
  "আজকের দিনটা যেমনই গেছে, রাতটা সুন্দর হোক। 🌛 শুভ রাত্রি!",
  "চাঁদ উঠেছে, তারা ফুটেছে। 🌠 তোমার ঘুমের সঙ্গী হোক সুন্দর স্বপ্ন। Good night!",
  "ঘুমানোর আগে একটু দোয়া করো। 🤲 শুভ রাত্রি! ভালো থাকো। 💤",
  "রাত হলে মন নরম হয়ে যায়। 💕 তোমার কথা মনে পড়ছে। Good night! 🌙"
];

module.exports.config = {
  name: "goodnight",
  aliases: ["gn", "goodn", "শুভরাত", "night"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Good night wishes in Bangla 🌙" },
  longDescription: { en: "Send a warm Bangla good night message!" },
  category: "বাংলা",
  guide: { en: "{pn} [@mention]" }
};

module.exports.onStart = async ({ event, message, usersData }) => {
  const m = msgs[Math.floor(Math.random() * msgs.length)];
  let target = "";
  if (event.mentions && Object.keys(event.mentions).length > 0) {
    const uid = Object.keys(event.mentions)[0];
    const name = await usersData.getName(uid) || "";
    if (name) target = `🌙 ${name}!\n\n`;
  }
  return message.reply(`🌙 𝗚𝗼𝗼𝗱 𝗡𝗶𝗴𝗵𝘁\n━━━━━━━━━━━━\n${target}${m}\n━━━━━━━━━━━━\n💤 আরেকটা: .goodnight`);
};
