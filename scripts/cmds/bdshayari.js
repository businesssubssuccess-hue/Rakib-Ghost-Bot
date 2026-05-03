const shayaris = [
  "তোমার একটু হাসি দেখলে,\nমনে হয় সন্ধ্যার তারা জ্বলে,\nআমি যতই দূরে যাই,\nতোমার কথা মনে হয় বলে বলে। 🌙",
  "বৃষ্টির দিনে তোমায় মনে পড়ে,\nরোদের আলোয় তোমায় দেখি,\nভালোবাসা যদি হয় পাপ,\nতাহলে আমি চিরকাল পাপী থেকে যাই। 🌧️❤️",
  "ফুল যেমন বাতাসে মেলে দেয় ঘ্রাণ,\nতুমি তেমনি ছড়িয়ে দাও প্রাণ,\nতোমাকে দেখলেই বুকে লাগে টান,\nকবিতায় লিখি তোমার নাম। 🌸",
  "দূরত্ব কমায় না ভালোবাসা,\nমিলন কমায় না মিস করার আশা,\nতুমি আছো বলেই আছি,\nতুমিই আমার একমাত্র ভাষা। 💙",
  "চাঁদের আলোয় তোমার মুখ,\nমেঘের মাঝে তোমার সুখ,\nতোমাকে ভাবতে ভাবতে রাত পার,\nতুমিই আমার একমাত্র ডাক। 🌙",
  "একদিন যদি ফিরে আসো,\nআমার দুয়ারে কড়া নাড়ো,\nহাজারো ব্যথার মাঝেও তোমায়,\nবুকে আগলে ধরে রাখি। 🌹",
  "জীবনে পাই না যা চাই,\nতবু স্বপ্নে তোমায় পাই,\nএকটু ভালোবাসার জন্য,\nজীবনের পথে হেঁটে যাই। ✨"
];

module.exports.config = {
  name: "bdshayari",
  aliases: ["shayari2", "bangshayari", "শায়েরি"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Bangla shayari (romantic poetry) 🌹" },
  longDescription: { en: "Get beautiful Bangla shayari!" },
  category: "বাংলা",
  guide: { en: "{pn}" }
};

module.exports.onStart = async ({ message }) => {
  const s = shayaris[Math.floor(Math.random() * shayaris.length)];
  return message.reply(`🌹 𝗕𝗮𝗻𝗴𝗹𝗮 𝗦𝗵𝗮𝘆𝗮𝗿𝗶\n━━━━━━━━━━━━\n${s}\n━━━━━━━━━━━━\n💕 আরেকটা: .bdshayari`);
};
