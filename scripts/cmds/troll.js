const msgs = [
  "🤣 Trolled! তুমি কি সত্যিই সেটা বিশ্বাস করলে?",
  "😂 OMG তুমি এত innocent! Troll হয়ে গেলে!",
  "🎭 এটা কি real ছিল? নাকি troll? উত্তর: troll! 😈",
  "🃏 April Fool is everyday for you! 😂",
  "😏 হা হা হা! এই group এর সবচেয়ে সহজ troll victim পেয়ে গেছি!",
  "🤡 Troll level: Expert! তুমি troll হলে বুঝতেই পারো না! 😂",
  "👻 BOO! Troll করলাম! ভয় পেলে? 😈",
  "😂 তোমাকে একটু tease করলাম। নেহাতই মজার জন্য!"
];

module.exports.config = {
  name: "troll",
  aliases: ["trollbd", "ট্রল"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Fun troll messages 😈" },
  longDescription: { en: "Troll someone for fun!" },
  category: "social",
  guide: { en: "{pn} [@mention]" }
};

module.exports.onStart = async ({ event, message, usersData }) => {
  const uids = Object.keys(event.mentions || {});
  const sender = await usersData.getName(event.senderID) || "কেউ";
  const m = msgs[Math.floor(Math.random() * msgs.length)];
  if (uids.length > 0) {
    const receiver = await usersData.getName(uids[0]) || "তুমি";
    return message.reply(`🎭 𝗧𝗿𝗼𝗹𝗹!\n━━━━━━━━━━━━\n${sender} → ${receiver} কে troll করলো!\n━━━━━━━━━━━━\n${m}`);
  }
  return message.reply(`🎭 𝗧𝗿𝗼𝗹𝗹!\n━━━━━━━━━━━━\n${m}`);
};
