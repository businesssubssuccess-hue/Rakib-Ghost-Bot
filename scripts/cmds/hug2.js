const msgs = [
  "এই নাও একটা বড় virtual হাগ! 🤗💙",
  "আজ তোমার হাগ দরকার মনে হচ্ছে! 🤗❤️",
  "Virtual হলেও হাগটা real অনুভব করো। 🫂",
  "তোমাকে একটু আদর দিতে চাই। 🤗🌸",
  "এই হাগে ভরে যাক মন! 🤗💕"
];

module.exports.config = {
  name: "hug2",
  aliases: ["bhug", "আলিঙ্গন", "hugbd"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Send a virtual hug 🤗" },
  longDescription: { en: "Send a warm virtual hug to someone in the group!" },
  category: "social",
  guide: { en: "{pn} [@mention]" }
};

module.exports.onStart = async ({ event, message, usersData }) => {
  const uids = Object.keys(event.mentions || {});
  const sender = await usersData.getName(event.senderID) || "কেউ";
  const m = msgs[Math.floor(Math.random() * msgs.length)];

  if (uids.length > 0) {
    const receiver = await usersData.getName(uids[0]) || "তুমি";
    return message.reply(`🤗 𝗩𝗶𝗿𝘁𝘂𝗮𝗹 𝗛𝘂𝗴\n━━━━━━━━━━━━\n${sender} → ${receiver} কে হাগ দিচ্ছে!\n━━━━━━━━━━━━\n${m}`);
  }
  return message.reply(`🤗 𝗛𝘂𝗴\n━━━━━━━━━━━━\n${sender},\n${m}`);
};
