const symbols = [
  { name: "জাতীয় পাখি", item: "দোয়েল (Magpie Robin)", fact: "দোয়েল বাংলাদেশের জাতীয় পাখি। এর মধুর গান সকালকে সুন্দর করে। কালো ও সাদা রঙের এই পাখি সারাদেশে দেখা যায়।", emoji: "🐦" },
  { name: "জাতীয় ফুল", item: "শাপলা (Water Lily)", fact: "সাদা শাপলা বাংলাদেশের জাতীয় ফুল। পুকুর ও হাওরে প্রচুর দেখা যায়। এটি দেশের প্রতীকেও ব্যবহৃত হয়।", emoji: "🌸" },
  { name: "জাতীয় গাছ", item: "আম গাছ (Mango Tree)", fact: "আম গাছ বাংলাদেশের জাতীয় বৃক্ষ। গরমকালে আমের মৌসুম সবার কাছে প্রিয়।", emoji: "🌳" },
  { name: "জাতীয় মাছ", item: "ইলিশ (Hilsa Fish)", fact: "ইলিশ বাংলাদেশের জাতীয় মাছ। বিশ্বের মোট ইলিশের ৬৫% বাংলাদেশে পাওয়া যায়।", emoji: "🐟" },
  { name: "জাতীয় পশু", item: "রয়েল বেঙ্গল টাইগার", fact: "রয়েল বেঙ্গল টাইগার বাংলাদেশের জাতীয় পশু। সুন্দরবনে এদের বাস। এটি বিশ্বের সেরা বাঘদের একটি।", emoji: "🐅" },
  { name: "জাতীয় ফল", item: "কাঁঠাল (Jackfruit)", fact: "কাঁঠাল বাংলাদেশের জাতীয় ফল। এটি বিশ্বের সবচেয়ে বড় ফলগুলির একটি। গ্রীষ্মকালে প্রচুর পাওয়া যায়।", emoji: "🍈" },
];

module.exports.config = {
  name: "bdbird",
  aliases: ["bdsymbol", "জাতীয়", "bdsigns"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Bangladesh national symbols info 🇧🇩" },
  longDescription: { en: "Learn about Bangladesh's national symbols!" },
  category: "info-bd",
  guide: { en: "{pn}" }
};

module.exports.onStart = async ({ message }) => {
  const s = symbols[Math.floor(Math.random() * symbols.length)];
  return message.reply(`${s.emoji} 𝗕𝗗 𝗡𝗮𝘁𝗶𝗼𝗻𝗮𝗹 𝗦𝘆𝗺𝗯𝗼𝗹\n━━━━━━━━━━━━\n🏅 ${s.name}: ${s.item}\n📖 ${s.fact}\n━━━━━━━━━━━━\n🇧🇩 আরেকটা: .bdbird`);
};
