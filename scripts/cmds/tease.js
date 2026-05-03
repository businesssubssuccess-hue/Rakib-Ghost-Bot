const msgs = [
  "ওই! তোমাকে একটু tease করতে আসলাম। কী করবে? 😏",
  "তুমি কি জানো? তোমার face এ আজ extra funny কিছু আছে 😂 — just kidding!",
  "হ্যাঁ হ্যাঁ, তুমিই! ওই যে cute থাকার ভান করছো! 😄",
  "তোমাকে দেখলে মনে হয় আজ রেস্টুরেন্টে যাওয়া উচিত, কারণ তুমি একটু... সরস! 😂",
  "Psst! তোমার পিছনে কেউ আছে! ... নাহ, just tease করলাম 😈",
  "তুমি কি জানো তোমার সম্পর্কে কী বলি? তুমি actually অনেক ভালো মানুষ। এটাই tease! 🤭",
  "এখন তুমি ভাবছো 'কী বলবে?' — ঠিক এটাই tease এর উদ্দেশ্য! 😂",
  "তোমাকে দেখলে মনে হয়... না থাক, বলব না। 😏 (এটাই tease!)"
];

module.exports.config = {
  name: "tease",
  aliases: ["teasebd", "খোঁটা", "tease2"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Tease someone for fun 😏" },
  longDescription: { en: "Playfully tease someone in the group!" },
  category: "বাংলা",
  guide: { en: "{pn} [@mention]" }
};

module.exports.onStart = async ({ event, message, usersData }) => {
  const uids = Object.keys(event.mentions || {});
  const m = msgs[Math.floor(Math.random() * msgs.length)];
  if (uids.length > 0) {
    const name = await usersData.getName(uids[0]) || "তুমি";
    return message.reply(`😏 ${name},\n\n${m}\n\n😈 Teased by bot!`);
  }
  return message.reply(`😏 𝗧𝗲𝗮𝘀𝗲\n━━━━━━━━━━━━\n${m}\n━━━━━━━━━━━━\n😂 আরেকটা: .tease`);
};
