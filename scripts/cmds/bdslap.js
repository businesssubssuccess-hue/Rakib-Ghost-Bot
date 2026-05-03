const msgs = ["👋 পাগল! slap খেয়েছো!", "🖐️ এক থাপ্পড় পাঠালাম! তবে ভালোবাসার সাথে 😄", "👋 মজার slap! ব্যথা লাগেনি তো? 😂", "🤣 virtual slap! এবার জেগে ওঠো!"];

module.exports.config = {
  name: "bdslap",
  aliases: ["slap2", "চড়", "bslap"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Fun virtual slap 👋" },
  longDescription: { en: "Playfully slap someone virtually!" },
  category: "social",
  guide: { en: "{pn} [@mention]" }
};

module.exports.onStart = async ({ event, message, usersData }) => {
  const uids = Object.keys(event.mentions || {});
  const sender = await usersData.getName(event.senderID) || "কেউ";
  const m = msgs[Math.floor(Math.random() * msgs.length)];
  if (uids.length > 0) {
    const receiver = await usersData.getName(uids[0]) || "তুমি";
    return message.reply(`👋 𝗦𝗹𝗮𝗽!\n━━━━━━━━━━━━\n${sender} → ${receiver}\n${m}`);
  }
  return message.reply(`👋 ${sender}, ${m}`);
};
