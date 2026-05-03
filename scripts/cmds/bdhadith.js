const hadiths = [
  { text: "সর্বোত্তম মানুষ সে, যে অন্যের জন্য সবচেয়ে বেশি উপকারী।", source: "সহীহ বুখারী" },
  { text: "যে মানুষের প্রতি কৃতজ্ঞ নয়, সে আল্লাহর প্রতিও কৃতজ্ঞ নয়।", source: "তিরমিযী" },
  { text: "মুমিন অন্যকে কষ্ট দেয় না — না তার কথায়, না তার কাজে।", source: "বুখারী ও মুসলিম" },
  { text: "তোমার ভাইয়ের দিকে হাসিমুখে তাকানো সদকাহ।", source: "তিরমিযী" },
  { text: "জ্ঞান অর্জন করা প্রত্যেক মুসলমানের উপর ফরজ।", source: "ইবনে মাজাহ" },
  { text: "সবচেয়ে ভালো কাজ হলো নামাজ যথা সময়ে পড়া, তারপর মা-বাবার সেবা করা।", source: "বুখারী ও মুসলিম" },
  { text: "অহংকারীরা জান্নাতে প্রবেশ করবে না।", source: "মুসলিম" },
  { text: "আল্লাহর দিকে এক কদম এগোলে আল্লাহ দশ কদম এগিয়ে আসেন।", source: "হাদীস কুদসী" },
  { text: "তোমার মুখ ও হাত থেকে মুসলমানরা নিরাপদ থাকলেই তুমি মুসলমান।", source: "বুখারী" },
  { text: "ক্ষমা করো, আল্লাহ তোমাকে ক্ষমা করবেন।", source: "আল-কুরআন" }
];

module.exports.config = {
  name: "bdhadith",
  aliases: ["hadith2", "হাদিস", "hadeeth"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Random hadith in Bangla 📖" },
  longDescription: { en: "Get a random authentic hadith with Bangla translation!" },
  category: "বাংলা",
  guide: { en: "{pn}" }
};

module.exports.onStart = async ({ message }) => {
  const h = hadiths[Math.floor(Math.random() * hadiths.length)];
  return message.reply(`📖 𝗛𝗮𝗱𝗶𝘁𝗵\n━━━━━━━━━━━━\n💬 "${h.text}"\n\n📚 সূত্র: ${h.source}\n━━━━━━━━━━━━\n🤲 আরেকটা: .bdhadith`);
};
