const dialogues = [
  { movie: "দেওয়াল (নাটক)", line: "মানুষ হয়ে মানুষকে ভালোবাসতে পারলে, মানুষ হওয়াটা সফল।" },
  { movie: "হুমায়ুন আহমেদ", line: "জীবন হলো একটা বই। যে পড়তে জানে না, সে শুধু পাতা উল্টায়।" },
  { movie: "বাংলা ক্লাসিক", line: "ভালোবাসা পাওয়ার চেয়ে ভালোবাসা দেওয়া বড়।" },
  { movie: "রবীন্দ্রনাথ", line: "আমি চিনি গো চিনি তোমারে ওগো বিদেশিনী।" },
  { movie: "নজরুল", line: "বিদ্রোহী রণক্লান্ত আমি সেই দিন হব শান্ত।" },
  { movie: "সংলাপ", line: "সত্য কথা বলতে সাহস লাগে, মিথ্যা বলতে লাগে কৌশল।" },
  { movie: "বাংলা সাহিত্য", line: "জ্ঞানীর মতো চিন্তা করো, সাধারণের মতো কথা বলো।" },
  { movie: "আধুনিক বাংলা", line: "প্রতিটা শেষের মধ্যে একটা নতুন শুরু লুকিয়ে থাকে।" },
  { movie: "হাওয়া (২০২২)", line: "ভয়টাকে জয় করলেই জীবন সুন্দর হয়।" },
  { movie: "বাংলাদেশি নাটক", line: "মা হলো সেই মানুষ যে সবার আগে তোমাকে ভালোবাসে, সবার পরে রাগ ছাড়ে।" }
];

module.exports.config = {
  name: "dialogue",
  aliases: ["bdline", "সংলাপ", "movieline"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Famous Bangla movie/book dialogues 🎬" },
  longDescription: { en: "Get iconic Bangla dialogues and quotes from literature!" },
  category: "বাংলা",
  guide: { en: "{pn}" }
};

module.exports.onStart = async ({ message }) => {
  const d = dialogues[Math.floor(Math.random() * dialogues.length)];
  return message.reply(`🎬 𝗕𝗮𝗻𝗴𝗹𝗮 𝗗𝗶𝗮𝗹𝗼𝗴𝘂𝗲\n━━━━━━━━━━━━\n💬 "${d.line}"\n\n📽️ — ${d.movie}\n━━━━━━━━━━━━\n🌟 আরেকটা: .dialogue`);
};
