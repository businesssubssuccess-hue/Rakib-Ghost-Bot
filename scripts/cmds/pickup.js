const lines = [
  "তুমি কি Google Maps? কারণ তোমার মধ্যে হারিয়ে যেতে চাই! 😏",
  "তোমার হাসি দেখে বুঝলাম, আমার phone battery চার্জ হয় না কিন্তু মন হয়। 😍",
  "তুমি কি চকোলেট ফ্যাক্টরি? এত মিষ্টি কেন? 🍫",
  "তোমার চোখে আকাশ দেখি, তোমার হাসিতে সকাল পাই। 🌅",
  "তুমি কি WiFi? কারণ তোমার কাছে এলেই connection feel করি। 📶",
  "তুমি কি ডাক্তার? কারণ তোমাকে দেখলেই heart rate বাড়ে! 💓",
  "তোমার সাথে কথা বলতে বলতে ফোনের charge শেষ হয়, কিন্তু কথা শেষ হয় না। 📱",
  "তুমি কি সকালের চা? তোমাকে ছাড়া দিন শুরু হয় না! ☕",
  "তোমার হাসি দেখলে মনে হয় বৃষ্টির পরের রোদ্দুর। 🌈",
  "তুমি কি library? কারণ তোমার মধ্যে সব কিছু খুঁজে পাই। 📚❤️"
];

module.exports.config = {
  name: "pickup",
  aliases: ["pickupline", "flirtline", "পিকআপ"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Bangla pickup lines 😏" },
  longDescription: { en: "Get a fun Bangla pickup line to impress someone!" },
  category: "social",
  guide: { en: "{pn}" }
};

module.exports.onStart = async ({ message }) => {
  const l = lines[Math.floor(Math.random() * lines.length)];
  return message.reply(`😏 𝗣𝗶𝗰𝗸𝘂𝗽 𝗟𝗶𝗻𝗲\n━━━━━━━━━━━━\n${l}\n━━━━━━━━━━━━\n💕 আরেকটা: .pickup`);
};
