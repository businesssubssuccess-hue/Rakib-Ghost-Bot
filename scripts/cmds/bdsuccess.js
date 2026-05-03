const quotes = [
  "সাফল্য একদিনে আসে না, কিন্তু প্রতিদিনের ছোট ছোট পদক্ষেপেই সাফল্য গড়া হয়। 🚀",
  "সফল হওয়ার সবচেয়ে বড় রহস্য: হাল না ছাড়া। 💪",
  "তোমার স্বপ্ন তোমার সাথে জন্মেছে — সেটা সত্যি করার দায়িত্বও তোমার। 🌟",
  "ব্যর্থতা সাফল্যের সিঁড়ি — ভয় পেয়ো না, এগিয়ে যাও। 🏆",
  "যে সফল হয়েছে সে অনেকবার ব্যর্থ হয়েছে — কিন্তু থামেনি। 🔥",
  "সাফল্য luck এ আসে না, preparation + opportunity তে আসে। 🎯",
  "নিজের উপর বিশ্বাস রাখো — তুমি যতটা ভাবো তার চেয়েও বেশি capable। 💡",
  "আজকের কষ্ট আগামীকালের গর্বের গল্প হবে। থামো না। 🌅",
  "তোমার goal ছোট হোক বা বড় — শুরু করো আজই। ⚡",
  "সফল মানুষ excuse দেয় না, solution খোঁজে। 🧠",
  "একটু একটু করে এগিয়ে যাওয়াই সাফল্যের পথ। 🛤️",
  "তুমি যেখানে আছো সেখান থেকেই শুরু করো, যা আছে তা দিয়েই করো। 💪",
  "সফলতার কোনো শর্টকাট নেই — তবে smart work + hard work কাজ করে। 📚",
  "অন্যের সাফল্যে অনুপ্রাণিত হও, jealous হওয়ার দরকার নেই। 🌸",
  "তোমার সীমাবদ্ধতা সত্যিকারের নয়, মানসিক — সেটা ভেঙে বেরিয়ে আসো। 🦋"
];

module.exports.config = {
  name: "bdsuccess",
  aliases: ["success", "সাফল্য", "successq"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Success quotes in Bangla 🏆" },
  longDescription: { en: "Get motivational success quotes in Bangla!" },
  category: "বাংলা",
  guide: { en: "{pn}" }
};

module.exports.onStart = async ({ message }) => {
  const q = quotes[Math.floor(Math.random() * quotes.length)];
  return message.reply(`🏆 𝗦𝘂𝗰𝗰𝗲𝘀𝘀 𝗤𝘂𝗼𝘁𝗲\n━━━━━━━━━━━━\n${q}\n━━━━━━━━━━━━\n🔥 আরেকটা: .bdsuccess`);
};
