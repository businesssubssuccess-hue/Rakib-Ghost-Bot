const emojiMap = {
  a:"🅰️",b:"🅱️",c:"©️",d:"▶️",e:"📧",f:"🎏",g:"⛽",h:"♓",i:"ℹ️",j:"🗾",k:"🎋",l:"🕒",m:"♏",n:"🔢",o:"⭕",p:"🅿️",q:"❓",r:"®️",s:"💲",t:"✝️",u:"⛎",v:"✅",w:"〰️",x:"❌",y:"💹",z:"💤"
};

module.exports.config = {
  name: "emojify",
  aliases: ["emoji2", "emojitxt", "ইমোজি"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Convert text to emoji letters 🔤" },
  longDescription: { en: "Turn your text into emoji letters!" },
  category: "text-tools",
  guide: { en: "{pn} [text]" }
};

module.exports.onStart = async ({ message, args }) => {
  const text = args.join(" ").toLowerCase();
  if (!text) return message.reply("🔤 ব্যবহার: .emojify [text]\n📌 উদাহরণ: .emojify HELLO");
  const converted = text.split("").map(c => emojiMap[c] || c).join(" ");
  return message.reply(`🔤 𝗘𝗺𝗼𝗷𝗶𝗳𝘆\n━━━━━━━━━━━━\n${converted}\n━━━━━━━━━━━━\n✨ Share করো!`);
};
