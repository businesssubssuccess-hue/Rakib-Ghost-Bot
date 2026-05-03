const msgs = [
  "শুভ সকাল! 🌅 আজকের দিনটা তোমার জন্য সুন্দর হোক। চা-কফি খেয়ে নাও আগে! ☕",
  "সকাল হয়েছে! 🌞 উঠে পড়ো, নতুন দিন নতুন সুযোগ নিয়ে এসেছে। Good morning! 🌸",
  "শুভ প্রভাত! 🌺 আজকের সকালটা তোমার মতোই সুন্দর হোক। হাসো, ভালো থাকো। 😊",
  "নতুন দিন মানে নতুন শুরু। 🌄 গতকালের কষ্ট ভুলে আজকে এগিয়ে যাও। Good morning! ✨",
  "সকালের আলোতে তোমাকে মনে পড়লো। 🌻 ঘুম থেকে উঠেছো তো? শুভ সকাল! 🌷",
  "আজকের সকালটা বিশেষ, কারণ তুমি আছো। 💛 Good morning! নাশতা করো ভালো করে।",
  "শুভ সকাল! ☀️ আজ অনেক কাজ আছে, শুরু করো হাসিমুখে। তুমি পারবে! 💪",
  "রাতের ঘুম ভাঙলো, নতুন আলো এলো। 🌅 আজকের দিনটা সুন্দর কাটুক। শুভ সকাল! 🌸"
];

module.exports.config = {
  name: "goodmorning",
  aliases: ["gm", "subhosakal", "সুপ্রভাত", "morning"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Good morning wishes in Bangla 🌅" },
  longDescription: { en: "Send a warm Bangla good morning message!" },
  category: "বাংলা",
  guide: { en: "{pn} [@mention]" }
};

module.exports.onStart = async ({ event, message, usersData }) => {
  const m = msgs[Math.floor(Math.random() * msgs.length)];
  let target = "";
  if (event.mentions && Object.keys(event.mentions).length > 0) {
    const uid = Object.keys(event.mentions)[0];
    const name = await usersData.getName(uid) || "";
    if (name) target = `👤 ${name}!\n\n`;
  }
  return message.reply(`🌅 𝗚𝗼𝗼𝗱 𝗠𝗼𝗿𝗻𝗶𝗻𝗴\n━━━━━━━━━━━━\n${target}${m}\n━━━━━━━━━━━━\n☕ আরেকটা: .goodmorning`);
};
