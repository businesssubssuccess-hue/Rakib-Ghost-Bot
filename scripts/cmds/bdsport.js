const sports = [
  { name: "ক্রিকেট", fact: "বাংলাদেশের সবচেয়ে জনপ্রিয় খেলা। ২০০০ সালে টেস্ট মর্যাদা পেয়েছে।", star: "সাকিব আল হাসান", emoji: "🏏" },
  { name: "ফুটবল", fact: "বাংলাদেশের দ্বিতীয় জনপ্রিয় খেলা। SAFF Championship তে সাফল্য আছে।", star: "জামাল ভূঁইয়া", emoji: "⚽" },
  { name: "কাবাডি", fact: "বাংলাদেশের ঐতিহ্যবাহী খেলা। এটি বাংলাদেশের জাতীয় খেলা।", star: "জাতীয় দল", emoji: "🤼" },
  { name: "হকি", fact: "বাংলাদেশে হকি খেলার একটি দীর্ঘ ইতিহাস আছে। এশিয়ান গেমসে অংশ নেয়।", star: "জাতীয় দল", emoji: "🏑" },
  { name: "দাঁড়িয়াবান্ধা", fact: "বাংলাদেশের ঐতিহ্যবাহী গ্রামীণ খেলা। এখনও গ্রামে প্রচলিত।", star: "গ্রামবাংলা", emoji: "🏃" },
  { name: "বোচি (সাঁতার)", fact: "বাংলাদেশের নদীমাতৃক দেশ হওয়ায় সাঁতার এখানে জনপ্রিয়। জাতীয় সাঁতার প্রতিযোগিতা হয়।", star: "জাতীয় দল", emoji: "🏊" },
  { name: "শুটিং", fact: "আবদুল্লাহ হেল বাকি বাংলাদেশের বিখ্যাত শুটার। কমনওয়েলথ গেমসে পদক জিতেছেন।", star: "আ.হে.বাকি", emoji: "🎯" },
];

module.exports.config = {
  name: "bdsport",
  aliases: ["bdkhela", "বাংলাখেলা", "sports2"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Bangladesh sports facts ⚽" },
  longDescription: { en: "Learn about sports and games in Bangladesh!" },
  category: "info-bd",
  guide: { en: "{pn}" }
};

module.exports.onStart = async ({ message }) => {
  const s = sports[Math.floor(Math.random() * sports.length)];
  return message.reply(`${s.emoji} 𝗕𝗗 𝗦𝗽𝗼𝗿𝘁𝘀\n━━━━━━━━━━━━\n🏅 খেলা: ${s.name}\n⭐ তারকা: ${s.star}\n📖 তথ্য: ${s.fact}\n━━━━━━━━━━━━\n🌟 আরেকটা: .bdsport`);
};
