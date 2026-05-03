module.exports.config = {
  name: "striketext",
  aliases: ["strike", "strikethrough", "কাটাটেক্সট"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Strikethrough text ~~like this~~" },
  longDescription: { en: "Add strikethrough effect to your text!" },
  category: "text-tools",
  guide: { en: "{pn} [text]" }
};

module.exports.onStart = async ({ message, args }) => {
  const text = args.join(" ");
  if (!text) return message.reply("✍️ ব্যবহার: .striketext [text]");
  const converted = text.split("").map(c => c + "̶").join("");
  return message.reply(`✍️ 𝗦𝘁𝗿𝗶𝗸𝗲𝘁𝗵𝗿𝗼𝘂𝗴𝗵\n━━━━━━━━━━━━\n${converted}\n━━━━━━━━━━━━\n📝 কাটা কাটা দেখাচ্ছে!`);
};
