const vowels = "অ আ ই ঈ উ ঊ ঋ এ ঐ ও ঔ";
const consonants = "ক খ গ ঘ ঙ | চ ছ জ ঝ ঞ | ট ঠ ড ঢ ণ | ত থ দ ধ ন | প ফ ব ভ ম | য র ল শ ষ স হ";
const numbers = "০ ১ ২ ৩ ৪ ৫ ৬ ৭ ৮ ৯";

module.exports.config = {
  name: "bdalphabet",
  aliases: ["bangla_abc", "বর্ণমালা", "alphabet2"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 5,
  role: 0,
  shortDescription: { en: "Bangla alphabet display 🔤" },
  longDescription: { en: "Show the complete Bangla alphabet (Bornomala)!" },
  category: "info-bd",
  guide: { en: "{pn}" }
};

module.exports.onStart = async ({ message }) => {
  return message.reply(`🔤 𝗕𝗮𝗻𝗴𝗹𝗮 𝗕𝗼𝗿𝗻𝗼𝗺𝗮𝗹𝗮\n━━━━━━━━━━━━\n🔵 স্বরবর্ণ (Vowels):\n${vowels}\n\n🔴 ব্যঞ্জনবর্ণ (Consonants):\n${consonants}\n\n🟢 সংখ্যা (Bangla Numbers):\n${numbers}\n━━━━━━━━━━━━\n📚 বাংলা শিখুন, বাংলাকে ভালোবাসুন! 🇧🇩`);
};
