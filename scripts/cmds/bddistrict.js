const districts = [
  { name: "ঢাকা", div: "ঢাকা", fact: "বাংলাদেশের রাজধানী এবং সবচেয়ে বড় শহর। মুসলিন কাপড় ও জামদানি শাড়ির জন্য বিখ্যাত।", emoji: "🏙️" },
  { name: "চট্টগ্রাম", div: "চট্টগ্রাম", fact: "বাংলাদেশের দ্বিতীয় বৃহত্তম শহর ও প্রধান সমুদ্রবন্দর। পার্বত্য অঞ্চল ও সমুদ্র সৈকতের জন্য বিখ্যাত।", emoji: "⚓" },
  { name: "সিলেট", div: "সিলেট", fact: "চা বাগানের শহর। হজরত শাহজালাল (র.) এর মাজার এখানে। প্রাকৃতিক সৌন্দর্যে ভরপুর।", emoji: "🍵" },
  { name: "রাজশাহী", div: "রাজশাহী", fact: "আমের রাজধানী। রেশম শিল্পের জন্য বিখ্যাত। পদ্মা নদীর তীরে অবস্থিত।", emoji: "🥭" },
  { name: "খুলনা", div: "খুলনা", fact: "সুন্দরবনের প্রবেশদ্বার। মংলা সমুদ্রবন্দর এখানে। চিংড়ি চাষের জন্য বিখ্যাত।", emoji: "🐅" },
  { name: "বরিশাল", div: "বরিশাল", fact: "নদীমাতৃক শহর। ধান উৎপাদনে অগ্রগামী। 'বরিশালের নৌকাবাইচ' বিখ্যাত।", emoji: "⛵" },
  { name: "রংপুর", div: "রংপুর", fact: "তামাক ও পাট উৎপাদনে বিখ্যাত। শীতকালে অনেক ঠান্ডা পড়ে।", emoji: "❄️" },
  { name: "ময়মনসিংহ", div: "ময়মনসিংহ", fact: "বাংলাদেশের অষ্টম বিভাগ। কৃষি বিশ্ববিদ্যালয় এখানে। মধুপুর বন বিখ্যাত।", emoji: "🌳" },
  { name: "কক্সবাজার", div: "চট্টগ্রাম", fact: "পৃথিবীর দীর্ঘতম সমুদ্র সৈকত (১২০ কিমি)। বছরে লক্ষ লক্ষ পর্যটক আসেন।", emoji: "🏖️" },
  { name: "কুমিল্লা", div: "চট্টগ্রাম", fact: "রসমালাইয়ের জন্য বিখ্যাত। বার্ড (BARD) কৃষি উন্নয়ন সংস্থার সদর দপ্তর এখানে।", emoji: "🍮" },
];

module.exports.config = {
  name: "bddistrict",
  aliases: ["district", "জেলা", "bdcity"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Bangladesh districts info 🗺️" },
  longDescription: { en: "Learn about Bangladesh districts and cities!" },
  category: "info-bd",
  guide: { en: "{pn}" }
};

module.exports.onStart = async ({ message }) => {
  const d = districts[Math.floor(Math.random() * districts.length)];
  return message.reply(`${d.emoji} 𝗕𝗗 𝗗𝗶𝘀𝘁𝗿𝗶𝗰𝘁\n━━━━━━━━━━━━\n🗺️ জেলা: ${d.name}\n🏛️ বিভাগ: ${d.div}\n📖 তথ্য: ${d.fact}\n━━━━━━━━━━━━\n🌟 আরেকটা: .bddistrict`);
};
