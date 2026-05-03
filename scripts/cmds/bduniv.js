const universities = [
  { name: "ঢাকা বিশ্ববিদ্যালয়", short: "DU", est: "১৯২১", fact: "প্রাচ্যের অক্সফোর্ড বলা হয়। বাংলাদেশের সবচেয়ে পুরনো ও বড় পাবলিক বিশ্ববিদ্যালয়।", emoji: "🎓" },
  { name: "বাংলাদেশ প্রকৌশল বিশ্ববিদ্যালয়", short: "BUET", est: "১৯৬২", fact: "বাংলাদেশের সেরা প্রযুক্তি বিশ্ববিদ্যালয়। এখান থেকে অনেক আন্তর্জাতিক প্রকৌশলী বের হয়েছেন।", emoji: "⚙️" },
  { name: "চট্টগ্রাম বিশ্ববিদ্যালয়", short: "CU", est: "১৯৬৬", fact: "পাহাড়ের কোলে অবস্থিত সুন্দর বিশ্ববিদ্যালয়। Shuttle train এর জন্য বিখ্যাত।", emoji: "🚂" },
  { name: "রাজশাহী বিশ্ববিদ্যালয়", short: "RU", est: "১৯৫৩", fact: "উত্তরবঙ্গের সবচেয়ে বড় বিশ্ববিদ্যালয়। সবুজ ক্যাম্পাসের জন্য পরিচিত।", emoji: "🌿" },
  { name: "জাহাঙ্গীরনগর বিশ্ববিদ্যালয়", short: "JU", est: "১৯৭০", fact: "পরিযায়ী পাখির জন্য বিখ্যাত। আবাসিক বিশ্ববিদ্যালয়। প্রকৃতিপ্রেমীদের পছন্দের জায়গা।", emoji: "🦅" },
  { name: "শাহজালাল বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়", short: "SUST", est: "১৯৯১", fact: "সিলেটের বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়। নৈসর্গিক পরিবেশে অবস্থিত।", emoji: "🔬" },
  { name: "নর্থ সাউথ বিশ্ববিদ্যালয়", short: "NSU", est: "১৯৯২", fact: "বাংলাদেশের প্রথম বেসরকারি বিশ্ববিদ্যালয়। আন্তর্জাতিক মানের শিক্ষা প্রদান করে।", emoji: "🏢" },
  { name: "ব্র্যাক বিশ্ববিদ্যালয়", short: "BRAC", est: "২০০১", fact: "BRAC সংস্থার অধীন বিশ্বমানের বেসরকারি বিশ্ববিদ্যালয়। সামাজিক উন্নয়নে অগ্রণী ভূমিকা রাখে।", emoji: "🌍" },
];

module.exports.config = {
  name: "bduniv",
  aliases: ["university", "বিশ্ববিদ্যালয়", "bduni"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Bangladesh universities info 🎓" },
  longDescription: { en: "Learn about famous universities in Bangladesh!" },
  category: "info-bd",
  guide: { en: "{pn}" }
};

module.exports.onStart = async ({ message }) => {
  const u = universities[Math.floor(Math.random() * universities.length)];
  return message.reply(`${u.emoji} 𝗕𝗗 𝗨𝗻𝗶𝘃𝗲𝗿𝘀𝗶𝘁𝘆\n━━━━━━━━━━━━\n🏛️ ${u.name} (${u.short})\n📅 প্রতিষ্ঠা: ${u.est}\n📖 তথ্য: ${u.fact}\n━━━━━━━━━━━━\n🌟 আরেকটা: .bduniv`);
};
