const movies = [
  { name: "সূর্যদীঘল বাড়ী (১৯৭৯)", genre: "ড্রামা", fact: "বাংলাদেশের অন্যতম ক্লাসিক চলচ্চিত্র। আবু ইসহাকের উপন্যাস অবলম্বনে নির্মিত।" },
  { name: "মেঘের পরে মেঘ (২০০৪)", genre: "রোমান্টিক ড্রামা", fact: "চাষী নজরুল ইসলাম পরিচালিত। বাংলাদেশের অন্যতম জনপ্রিয় চলচ্চিত্র।" },
  { name: "মাটির ময়না (২০০২)", genre: "ড্রামা", fact: "তারেক মাসুদ পরিচালিত আন্তর্জাতিক পুরস্কারজয়ী চলচ্চিত্র।" },
  { name: "অরণ্যের দিনরাত্রি (১৯৭০)", genre: "ড্রামা", fact: "সত্যজিৎ রায় পরিচালিত। বাংলা সিনেমার একটি মাইলফলক।" },
  { name: "হাওয়া (২০২২)", genre: "থ্রিলার/হরর", fact: "মেজবাউর রহমান সুমন পরিচালিত। আধুনিক বাংলাদেশি সিনেমার নতুন ঢেউ।" },
  { name: "শ্যামল ছায়া (২০০৪)", genre: "মুক্তিযুদ্ধ", fact: "হুমায়ুন আহমেদ পরিচালিত মুক্তিযুদ্ধভিত্তিক চলচ্চিত্র। অস্কারে পাঠানো হয়েছিল।" },
  { name: "ঘেটু পুত্র কমলা (২০১২)", genre: "ঐতিহাসিক ড্রামা", fact: "হুমায়ুন আহমেদের শেষ পরিচালিত চলচ্চিত্র। জাতীয় পুরস্কার বিজয়ী।" },
  { name: "দেবী (২০১৮)", genre: "থ্রিলার", fact: "আধুনিক বাংলাদেশি সিনেমার একটি আলোচিত কাজ।" },
];

module.exports.config = {
  name: "bdmovie",
  aliases: ["banglamovie", "bdfilm", "বাংলাসিনেমা"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Famous Bangladeshi movies 🎬" },
  longDescription: { en: "Discover great Bangladeshi films!" },
  category: "info-bd",
  guide: { en: "{pn}" }
};

module.exports.onStart = async ({ message }) => {
  const m = movies[Math.floor(Math.random() * movies.length)];
  return message.reply(`🎬 𝗕𝗗 𝗠𝗼𝘃𝗶𝗲\n━━━━━━━━━━━━\n🎥 নাম: ${m.name}\n🎭 Genre: ${m.genre}\n📖 তথ্য: ${m.fact}\n━━━━━━━━━━━━\n🌟 আরেকটা: .bdmovie`);
};
