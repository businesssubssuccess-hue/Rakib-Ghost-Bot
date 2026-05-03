const msgs = ["👉 poke! তুমি কি ঘুমাচ্ছ? 😄", "👉 উঠো উঠো! poke করলাম!", "👉 heyy! poke poke! 😏", "👉 তোমাকে poke না করলে মজা থাকে না! 😂"];

module.exports.config = {
  name: "poke2",
  aliases: ["bpoke", "খোঁচা", "nudge"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Poke someone 👉" },
  longDescription: { en: "Poke someone to get their attention!" },
  category: "social",
  guide: { en: "{pn} [@mention]" }
};

module.exports.onStart = async ({ event, message, usersData }) => {
  const uids = Object.keys(event.mentions || {});
  const sender = await usersData.getName(event.senderID) || "কেউ";
  const m = msgs[Math.floor(Math.random() * msgs.length)];
  if (uids.length > 0) {
    const receiver = await usersData.getName(uids[0]) || "তুমি";
    return message.reply(`👉 𝗣𝗼𝗸𝗲\n━━━━━━━━━━━━\n${sender} → ${receiver}\n${m}`);
  }
  return message.reply(`👉 ${sender}, ${m}`);
};
