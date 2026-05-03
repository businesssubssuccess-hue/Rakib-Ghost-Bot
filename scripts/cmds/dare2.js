const dares = [
  "এই গ্রুপে তোমার সবচেয়ে কাছের মানুষকে tag করো! 👥",
  "তোমার favorite food এর নাম Bangla তে লিখো! 🍛",
  "এই গ্রুপের সবাইকে একটা করে compliment দাও! 💌",
  "তোমার প্রথম প্রেমের গল্প বলো (সংক্ষেপে)! 💕",
  "তোমার জীবনের সবচেয়ে বিব্রতকর মুহূর্ত শেয়ার করো! 😅",
  "এই মুহূর্তে কার কথা মনে পড়ছে তার নাম বলো! 😏",
  "তোমার সবচেয়ে বড় ভয় কী? বলো! 😱",
  "গ্রুপের যে কাউকে একটা ভালোবাসার message পাঠাও! 💌",
  "তোমার পছন্দের গানের লাইন type করো! 🎵",
  "তোমার profile picture পরিবর্তন করো ২৪ ঘন্টার জন্য! 📸",
  "গ্রুপে তোমার closest বন্ধুকে roast করো (মজা করে)! 😂",
  "তোমার লুকানো talent কী? সবাইকে বলো! 🎭",
  "তুমি কি গান গাইতে পারো? একটা লাইন গাও! 🎤",
  "এই মুহূর্তে তোমার মনের অবস্থা emoji দিয়ে বলো! 😶",
  "তোমার screen time কত? screenshot দাও! 📱"
];

module.exports.config = {
  name: "dare2",
  aliases: ["bdare", "d2", "চ্যালেঞ্জ"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 5,
  role: 0,
  shortDescription: { en: "Random dare challenges 🎲" },
  longDescription: { en: "Get a random dare challenge for your group!" },
  category: "বাংলা",
  guide: { en: "{pn}" }
};

module.exports.onStart = async ({ message }) => {
  const d = dares[Math.floor(Math.random() * dares.length)];
  return message.reply(`🎲 𝗗𝗮𝗿𝗲 𝗖𝗵𝗮𝗹𝗹𝗲𝗻𝗴𝗲\n━━━━━━━━━━━━\n⚡ ${d}\n━━━━━━━━━━━━\n🎯 সাহস থাকলে করো! | আরেকটা: .dare2`);
};
