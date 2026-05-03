const roasts = [
  "তোমাকে দেখলে মনে হয় Google Maps বললো 'destination not found'! 😂",
  "তোমার মাথা এত বড় অথচ brain এত ছোট — অদ্ভুত engineering! 🤔",
  "তুমি এতটাই boring যে dictionary তে তোমার নাম দিয়ে boring এর definition লেখা আছে! 📖",
  "তুমি কি Wi-Fi? কারণ সবাই তোমাকে avoid করে! 📶😅",
  "তোমার joke এতটাই bad যে even autocorrect সেটা fix করতে চায় না! 😂",
  "তুমি হলে সেই প্রশ্ন যার উত্তর কেউ জানতে চায় না! ❓",
  "তোমাকে দেখে আমার alarm বন্ধ হয়ে যায় — এতটাই boring তুমি! ⏰",
  "তুমি কি calendar? প্রতিদিন date মিস করো! 📅😂"
];

module.exports.config = {
  name: "bdroast",
  aliases: ["roast2", "পুড়াও", "burnbd"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 5,
  role: 0,
  shortDescription: { en: "Fun Bangla roast lines 🔥" },
  longDescription: { en: "Roast someone for fun with Bangla lines!" },
  category: "বাংলা",
  guide: { en: "{pn} [@mention]" }
};

module.exports.onStart = async ({ event, message, usersData }) => {
  const uids = Object.keys(event.mentions || {});
  const r = roasts[Math.floor(Math.random() * roasts.length)];
  if (uids.length > 0) {
    const name = await usersData.getName(uids[0]) || "তুমি";
    return message.reply(`🔥 𝗥𝗼𝗮𝘀𝘁\n━━━━━━━━━━━━\n😂 ${name},\n${r}\n━━━━━━━━━━━━\n😆 মজার জন্য!`);
  }
  return message.reply(`🔥 𝗥𝗼𝗮𝘀𝘁\n━━━━━━━━━━━━\n${r}\n━━━━━━━━━━━━\n😂 মজার জন্য! | আরেকটা: .bdroast`);
};
