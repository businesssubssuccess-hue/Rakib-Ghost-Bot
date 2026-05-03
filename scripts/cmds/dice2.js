module.exports.config = {
  name: "dice2",
  aliases: ["roll2", "ডাইস", "rolldice"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Roll a dice 🎲" },
  longDescription: { en: "Roll a dice with custom sides! Default is 6-sided." },
  category: "utility-bd",
  guide: { en: "{pn} [sides] — e.g: .dice2 12" }
};

module.exports.onStart = async ({ message, args }) => {
  const sides = parseInt(args[0]) || 6;
  if (sides < 2 || sides > 100) return message.reply("❌ ২ থেকে ১০০ পর্যন্ত sides সাপোর্ট করে।");
  const result = Math.floor(Math.random() * sides) + 1;
  const emojis = ["", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣"];
  const emoji = sides === 6 ? (emojis[result] || "🎲") : "🎲";
  return message.reply(`🎲 𝗗𝗶𝗰𝗲 𝗥𝗼𝗹𝗹\n━━━━━━━━━━━━\n${emoji} ফলাফল: ${result} (${sides}-sided)\n━━━━━━━━━━━━\n🔄 আবার: .dice2`);
};
