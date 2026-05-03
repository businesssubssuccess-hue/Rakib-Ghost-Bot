const msgs = ["👊 POW! একটা punch গেল!", "💥 Bam! ভালোবাসার punch! 😂", "👊 এই মুষ্টাঘাত সহ্য করো! (মজার) 😄", "💪 Punch! জেগে ওঠো! 😂"];

module.exports.config = {
  name: "bdpunch",
  aliases: ["punch2", "ঘুষি", "bpunch"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Fun virtual punch 👊" },
  longDescription: { en: "Playfully punch someone virtually!" },
  category: "social",
  guide: { en: "{pn} [@mention]" }
};

module.exports.onStart = async ({ event, message, usersData }) => {
  const uids = Object.keys(event.mentions || {});
  const sender = await usersData.getName(event.senderID) || "কেউ";
  const m = msgs[Math.floor(Math.random() * msgs.length)];
  if (uids.length > 0) {
    const receiver = await usersData.getName(uids[0]) || "তুমি";
    return message.reply(`👊 𝗣𝘂𝗻𝗰𝗵!\n━━━━━━━━━━━━\n${sender} → ${receiver}\n${m}`);
  }
  return message.reply(`👊 ${sender}, ${m}`);
};
