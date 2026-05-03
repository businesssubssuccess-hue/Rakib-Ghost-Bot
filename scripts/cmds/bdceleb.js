const celebs = [
  { name: "রবীন্দ্রনাথ ঠাকুর", field: "সাহিত্য/কবিতা", fact: "নোবেল পুরস্কার বিজয়ী (১৯১৩)। 'গীতাঞ্জলি' তাঁর বিখ্যাত রচনা। বাংলাদেশের জাতীয় সংগীত রচয়িতা।" },
  { name: "শেখ মুজিবুর রহমান", field: "রাজনীতি", fact: "বাংলাদেশের জাতির পিতা ও প্রথম রাষ্ট্রপতি। 'বঙ্গবন্ধু' উপাধিতে ভূষিত।" },
  { name: "কাজী নজরুল ইসলাম", field: "সাহিত্য/সংগীত", fact: "বাংলাদেশের জাতীয় কবি। 'বিদ্রোহী' কবিতার রচয়িতা। বিদ্রোহী কবি হিসেবে পরিচিত।" },
  { name: "মুহাম্মদ ইউনুস", field: "অর্থনীতি", fact: "গ্রামীণ ব্যাংকের প্রতিষ্ঠাতা। ক্ষুদ্রঋণের জনক। ২০০৬ সালে নোবেল শান্তি পুরস্কার পেয়েছেন।" },
  { name: "সাকিব আল হাসান", field: "ক্রিকেট", fact: "বিশ্বের সেরা ক্রিকেট অলরাউন্ডারদের একজন। আইসিসি র‍্যাংকিংয়ে বহুবার ১ নম্বরে ছিলেন।" },
  { name: "জীবনানন্দ দাশ", field: "কবিতা", fact: "'রূপসী বাংলা'র কবি। আধুনিক বাংলা কবিতার অন্যতম প্রধান কবি।" },
  { name: "ফজলুর রহমান খান", field: "প্রকৌশল", fact: "বিশ্বখ্যাত স্থপতি ও প্রকৌশলী। শিকাগোর John Hancock Center ও Sears Tower ডিজাইন করেছিলেন।" },
  { name: "বেগম রোকেয়া", field: "নারী অধিকার", fact: "বাংলাদেশের নারী শিক্ষার অগ্রদূত। 'সুলতানার স্বপ্ন' তাঁর বিখ্যাত রচনা।" }
];

module.exports.config = {
  name: "bdceleb",
  aliases: ["bangceleb", "bdicon", "বিখ্যাত"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Famous Bangladeshis info 🌟" },
  longDescription: { en: "Learn about famous people from Bangladesh!" },
  category: "info-bd",
  guide: { en: "{pn}" }
};

module.exports.onStart = async ({ message }) => {
  const c = celebs[Math.floor(Math.random() * celebs.length)];
  return message.reply(`🌟 𝗙𝗮𝗺𝗼𝘂𝘀 𝗕𝗮𝗻𝗴𝗹𝗮𝗱𝗲𝘀𝗵𝗶\n━━━━━━━━━━━━\n👤 ${c.name}\n🎯 ক্ষেত্র: ${c.field}\n📖 তথ্য: ${c.fact}\n━━━━━━━━━━━━\n🌟 আরেকজন: .bdceleb`);
};
