const players = [
  { name: "সাকিব আল হাসান", role: "অলরাউন্ডার", fact: "বিশ্বের সেরা অলরাউন্ডারদের একজন। ICCর বেশ কয়েকটি র‍্যাংকিংয়ে ১ নম্বরে ছিলেন।", emoji: "🏏" },
  { name: "তামিম ইকবাল", role: "ওপেনিং ব্যাটসম্যান", fact: "বাংলাদেশের সর্বকালের সেরা ব্যাটসম্যানদের একজন। ODI-তে সবচেয়ে বেশি রানের রেকর্ড ছিল।", emoji: "🏏" },
  { name: "মুশফিকুর রহিম", role: "উইকেটকিপার-ব্যাটসম্যান", fact: "'মুশফিক ভাই' নামে পরিচিত। টেস্টে বাংলাদেশের সর্বোচ্চ রান স্কোরার।", emoji: "🧤" },
  { name: "মাহমুদউল্লাহ রিয়াদ", role: "অলরাউন্ডার", fact: "T20 বিশেষজ্ঞ। অনেক কঠিন পরিস্থিতিতে দলকে জেতাতে পারেন।", emoji: "🏏" },
  { name: "মুস্তাফিজুর রহমান", role: "পেসার", fact: "'Fizz' নামে পরিচিত। কাটার বল আর slow delivery-তে বিশেষজ্ঞ।", emoji: "⚡" },
  { name: "লিটন দাস", role: "উইকেটকিপার-ব্যাটসম্যান", fact: "দারুণ স্টাইলিশ ব্যাটিং করেন। ক্যাচ নেওয়ায় অনেক দক্ষ।", emoji: "🧤" },
  { name: "তাসকিন আহমেদ", role: "পেসার", fact: "বাংলাদেশের সবচেয়ে দ্রুতগতির বোলারদের একজন। ODI-তে উইকেট নেওয়ায় ধারাবাহিক।", emoji: "⚡" },
  { name: "মেহেদী হাসান মিরাজ", role: "অফস্পিনার-অলরাউন্ডার", fact: "টেস্টে অনেক গুরুত্বপূর্ণ ভূমিকা রাখেন। ব্যাট ও বলে সমান পারদর্শী।", emoji: "🌀" }
];

module.exports.config = {
  name: "bdcricketer",
  aliases: ["bdcrick", "বাংলাক্রিকেট", "bdc"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Bangladesh cricketers info 🏏" },
  longDescription: { en: "Learn about famous Bangladesh cricket players!" },
  category: "info-bd",
  guide: { en: "{pn}" }
};

module.exports.onStart = async ({ message }) => {
  const p = players[Math.floor(Math.random() * players.length)];
  return message.reply(`${p.emoji} 𝗕𝗗 𝗖𝗿𝗶𝗰𝗸𝗲𝘁𝗲𝗿\n━━━━━━━━━━━━\n👤 ${p.name}\n🎯 ভূমিকা: ${p.role}\n📖 তথ্য: ${p.fact}\n━━━━━━━━━━━━\n🏆 আরেকজন: .bdcricketer`);
};
