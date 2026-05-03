const challenges = [
  "আজ সারাদিন কোনো social media ব্যবহার করো না। পারবে? 📵",
  "আজ গ্রুপের যেকোনো একজনকে random একটা compliment দাও! 💌",
  "১০০টা jumping jack করো এখনই। শুরু! 💪",
  "তোমার পরিবারের কাউকে call দাও এবং কুশল জিজ্ঞেস করো। ❤️",
  "আজ একটা নতুন কিছু শেখার চেষ্টা করো — ছোট হলেও! 📚",
  "এই group-এর সব unread message পড়ো। 📖",
  "তোমার favorite দোয়াটা type করে post দাও। 🤲",
  "আজ সকাল সকাল ঘুম থেকে উঠে ব্যায়াম করো। 🏃",
  "এক গ্লাস পানি পান করো এখনই। Health first! 💧",
  "তোমার জীবনের একটা ভালো স্মৃতি share করো group-এ। 😊",
  "কাউকে 'ভালোবাসি' বলো আজ। Family, friend যেই হোক। ❤️",
  "এই group-এ তোমার কাছে কে সবচেয়ে মজার? নাম বলো! 😂",
  "আজ একটা নতুন recipe try করো। 🍛",
  "৫ মিনিট চোখ বন্ধ করে শুধু শ্বাস নাও। Meditation try করো! 🧘",
  "তোমার ফোনে সবচেয়ে পুরনো selfie খুঁজে বের করো। 📸"
];

module.exports.config = {
  name: "challenge",
  aliases: ["daily", "task", "চ্যালেঞ্জ2"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 10,
  role: 0,
  shortDescription: { en: "Daily group challenge ⚡" },
  longDescription: { en: "Get a daily fun challenge for the group!" },
  category: "বাংলা",
  guide: { en: "{pn}" }
};

module.exports.onStart = async ({ message }) => {
  const c = challenges[Math.floor(Math.random() * challenges.length)];
  return message.reply(`⚡ 𝗗𝗮𝗶𝗹𝘆 𝗖𝗵𝗮𝗹𝗹𝗲𝗻𝗴𝗲\n━━━━━━━━━━━━\n🎯 ${c}\n━━━━━━━━━━━━\n💪 পারলে করো! | আরেকটা: .challenge`);
};
