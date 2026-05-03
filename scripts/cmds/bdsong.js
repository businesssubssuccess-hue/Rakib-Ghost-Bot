const songs = [
  { name: "আমার সোনার বাংলা", artist: "রবীন্দ্রনাথ ঠাকুর", type: "জাতীয় সংগীত", fact: "বাংলাদেশের জাতীয় সংগীত। প্রথম ১০ লাইন গাওয়া হয়।" },
  { name: "একতারা", artist: "বাউল শিল্পী", type: "বাউল গান", fact: "বাউল সংগীত বাংলাদেশের ঐতিহ্যবাহী লোকসংগীত। UNESCO এটিকে স্বীকৃতি দিয়েছে।" },
  { name: "মৌসুমী", artist: "Artcell", type: "রক", fact: "বাংলাদেশের সবচেয়ে আইকনিক ব্যান্ড গানগুলির একটি।" },
  { name: "ভালোবাসলে", artist: "James", type: "পপ/রক", fact: "জেমস বাংলাদেশের সর্বকালের সেরা শিল্পীদের একজন।" },
  { name: "তুমি আমার প্রথম সকাল", artist: "হাবিব ওয়াহিদ", type: "পপ", fact: "হাবিব ওয়াহিদ আধুনিক বাংলাদেশি সংগীতে নতুন মাত্রা এনেছেন।" },
  { name: "পদ্মা নদীর মাঝি", artist: "ফোক ঐতিহ্য", type: "লোকগীত", fact: "পদ্মা নদীকেন্দ্রিক ঐতিহ্যবাহী লোকগান।" },
  { name: "আজি বাংলাদেশের হৃদয়", artist: "রবীন্দ্রনাথ", type: "দেশাত্মবোধক", fact: "বাংলাদেশের স্বাধীনতা সংগ্রামে অনুপ্রেরণাদায়ী গান।" },
  { name: "ও আমার দেশের মাটি", artist: "রবীন্দ্রনাথ ঠাকুর", type: "দেশাত্মবোধক", fact: "দেশমাতৃকার প্রতি গভীর ভালোবাসার প্রকাশ।" },
];

module.exports.config = {
  name: "bdsong",
  aliases: ["banglagaan", "bdsongs", "বাংলাগান"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Famous Bangladeshi songs 🎵" },
  longDescription: { en: "Discover great Bangladeshi songs and music!" },
  category: "info-bd",
  guide: { en: "{pn}" }
};

module.exports.onStart = async ({ message }) => {
  const s = songs[Math.floor(Math.random() * songs.length)];
  return message.reply(`🎵 𝗕𝗗 𝗦𝗼𝗻𝗴\n━━━━━━━━━━━━\n🎶 গান: ${s.name}\n👤 শিল্পী: ${s.artist}\n🎸 ধরন: ${s.type}\n📖 তথ্য: ${s.fact}\n━━━━━━━━━━━━\n🌟 আরেকটা: .bdsong`);
};
