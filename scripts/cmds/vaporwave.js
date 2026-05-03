module.exports.config = {
  name: "vaporwave",
  aliases: ["vapor", "fullwidth", "ফুলওয়াইড"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Vaporwave/full-width text 𝐕𝐀𝐏𝐎𝐑" },
  longDescription: { en: "Convert text to vaporwave full-width style!" },
  category: "text-tools",
  guide: { en: "{pn} [text]" }
};

module.exports.onStart = async ({ message, args }) => {
  const text = args.join(" ");
  if (!text) return message.reply("📝 ব্যবহার: .vaporwave [text]\n📌 উদাহরণ: .vaporwave hello");
  const converted = text.split("").map(c => {
    const code = c.charCodeAt(0);
    if (code >= 33 && code <= 126) return String.fromCharCode(code + 65248);
    if (c === " ") return "　";
    return c;
  }).join("");
  return message.reply(`🌊 𝗩𝗮𝗽𝗼𝗿𝘄𝗮𝘃𝗲\n━━━━━━━━━━━━\n${converted}\n━━━━━━━━━━━━\n✨ দেখতে stylish!`);
};
