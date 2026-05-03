const msgs = ["😘 একটা virtual kiss পাঠালাম!", "💋 mwah! পেলে তো?", "😙 নাও একটা আদরের kiss!", "💝 তোমার জন্য একটা flying kiss! 😘✈️"];

module.exports.config = {
  name: "bdkiss",
  aliases: ["kiss2", "চুমু", "bkiss"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Send a virtual kiss 😘" },
  longDescription: { en: "Send a sweet virtual kiss to someone!" },
  category: "social",
  guide: { en: "{pn} [@mention]" }
};

module.exports.onStart = async ({ event, message, usersData }) => {
  const uids = Object.keys(event.mentions || {});
  const sender = await usersData.getName(event.senderID) || "কেউ";
  const m = msgs[Math.floor(Math.random() * msgs.length)];
  if (uids.length > 0) {
    const receiver = await usersData.getName(uids[0]) || "তুমি";
    return message.reply(`😘 𝗩𝗶𝗿𝘁𝘂𝗮𝗹 𝗞𝗶𝘀𝘀\n━━━━━━━━━━━━\n${sender} → ${receiver}\n${m}`);
  }
  return message.reply(`😘 ${sender}, ${m}`);
};
