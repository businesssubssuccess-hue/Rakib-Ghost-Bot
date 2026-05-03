module.exports.config = {
  name: "palindrome",
  aliases: ["palcheck", "পালিন্ড্রোম"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Check if text is a palindrome 🔄" },
  longDescription: { en: "Check if a word/sentence reads the same forwards and backwards!" },
  category: "text-tools",
  guide: { en: "{pn} [word/text]" }
};

module.exports.onStart = async ({ message, args }) => {
  const text = args.join(" ").toLowerCase().replace(/\s+/g, "");
  if (!text) return message.reply("🔄 ব্যবহার: .palindrome [word]\n📌 উদাহরণ: .palindrome racecar");
  const reversed = text.split("").reverse().join("");
  const isPalin = text === reversed;
  return message.reply(`🔄 𝗣𝗮𝗹𝗶𝗻𝗱𝗿𝗼𝗺𝗲 𝗖𝗵𝗲𝗰𝗸\n━━━━━━━━━━━━\n📝 টেক্সট: ${args.join(" ")}\n🔁 উল্টো: ${reversed}\n━━━━━━━━━━━━\n${isPalin ? "✅ হ্যাঁ! এটা Palindrome! 🌟" : "❌ না, এটা Palindrome নয়।"}`);
};
