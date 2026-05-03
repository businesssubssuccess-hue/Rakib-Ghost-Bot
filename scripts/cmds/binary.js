module.exports.config = {
  name: "binary",
  aliases: ["বাইনারি", "bin2"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Binary converter (text↔binary) 💻" },
  longDescription: { en: "Convert text to binary or binary to text!" },
  category: "text-tools",
  guide: { en: "{pn} encode [text] | {pn} decode [binary]" }
};

module.exports.onStart = async ({ message, args }) => {
  if (!args[0]) return message.reply("💻 ব্যবহার:\n.binary encode [text]\n.binary decode [binary]\n📌 উদাহরণ: .binary encode HI");

  const mode = args[0].toLowerCase();
  const input = args.slice(1).join(" ");

  if (mode === "encode") {
    if (!input) return message.reply("❌ text দাও।");
    const encoded = input.split("").map(c => c.charCodeAt(0).toString(2).padStart(8, "0")).join(" ");
    return message.reply(`💻 𝗕𝗶𝗻𝗮𝗿𝘆 𝗘𝗻𝗰𝗼𝗱𝗲\n━━━━━━━━━━━━\n📝 Text: ${input}\n🔢 Binary:\n${encoded}\n━━━━━━━━━━━━\n💡 .binary decode দিয়ে ফিরিয়ে আনো`);
  }

  if (mode === "decode") {
    if (!input) return message.reply("❌ binary code দাও।");
    try {
      const decoded = input.split(" ").map(b => String.fromCharCode(parseInt(b, 2))).join("");
      return message.reply(`💻 𝗕𝗶𝗻𝗮𝗿𝘆 𝗗𝗲𝗰𝗼𝗱𝗲\n━━━━━━━━━━━━\n🔢 Binary: ${input.slice(0, 50)}...\n📝 Text: ${decoded}\n━━━━━━━━━━━━\n✅ Decoded!`);
    } catch { return message.reply("❌ সঠিক binary code দাও।"); }
  }

  return message.reply("❌ encode অথবা decode লিখো।");
};
