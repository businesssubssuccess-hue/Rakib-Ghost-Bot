module.exports.config = {
  name: "widetext",
  aliases: ["wide", "space2", "প্রশস্ত"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Wide/spaced text W I D E" },
  longDescription: { en: "Add spaces between every letter for W I D E effect!" },
  category: "text-tools",
  guide: { en: "{pn} [text]" }
};

module.exports.onStart = async ({ message, args }) => {
  const text = args.join(" ");
  if (!text) return message.reply("📝 ব্যবহার: .widetext [text]");
  const wide = text.split("").join(" ");
  return message.reply(`📝 𝗪𝗜𝗗𝗘 𝗧𝗘𝗫𝗧\n━━━━━━━━━━━━\n${wide}\n━━━━━━━━━━━━\n✨ W I D E!`);
};
