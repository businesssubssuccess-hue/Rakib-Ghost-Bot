const maleNames = ["রাকিব", "সাজিদ", "রিয়াদ", "ইমরান", "শিহাব", "তানভীর", "নাফিস", "আরিফ", "মাহিন", "সায়েম", "রাফি", "জুবায়ের", "আবির", "তাহমিদ", "আদিল", "ফাহিম", "নাঈম", "সাব্বির", "তারেক", "খালিদ"];
const femaleNames = ["মাইশা", "নুসরাত", "সাবিলা", "রাহেলা", "তাশরিক", "আইশা", "নাবিলা", "মারিয়া", "সুমাইয়া", "ফারিহা", "রিদা", "তাবাস্সুম", "সাদিয়া", "নাফিসা", "মাহজাবিন", "আনিকা", "রাইসা", "সামিহা", "তানিয়া", "লামিয়া"];
const surnames = ["ইসলাম", "হোসেন", "আহমেদ", "রহমান", "মিয়া", "চৌধুরী", "খান", "মালিক", "সিদ্দিকী", "হাসান"];

module.exports.config = {
  name: "randname",
  aliases: ["randomname", "বাংলানাম", "namegen"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Random Bangla name generator 📛" },
  longDescription: { en: "Generate a random Bangla name!" },
  category: "বাংলা",
  guide: { en: "{pn} [male/female/random]" }
};

module.exports.onStart = async ({ message, args }) => {
  const type = args[0]?.toLowerCase() || "random";
  const isMale = type === "male" || (type === "random" && Math.random() < 0.5);
  const firstName = isMale
    ? maleNames[Math.floor(Math.random() * maleNames.length)]
    : femaleNames[Math.floor(Math.random() * femaleNames.length)];
  const surname = surnames[Math.floor(Math.random() * surnames.length)];
  const gender = isMale ? "পুরুষ 👦" : "মহিলা 👧";

  return message.reply(`📛 𝗥𝗮𝗻𝗱𝗼𝗺 𝗡𝗮𝗺𝗲\n━━━━━━━━━━━━\n👤 নাম: ${firstName} ${surname}\n⚧ লিঙ্গ: ${gender}\n━━━━━━━━━━━━\n🔄 আরেকটা: .randname`);
};
