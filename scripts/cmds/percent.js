module.exports.config = {
  name: "percent",
  aliases: ["pct", "শতাংশ", "percentage2"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Percentage calculator 📊" },
  longDescription: { en: "Calculate percentage easily." },
  category: "utility-bd",
  guide: { en: "{pn} [value] of [total] | {pn} [%] of [number]" }
};

module.exports.onStart = async ({ message, args }) => {
  if (!args[0]) return message.reply(`📊 শতাংশ হিসাব:\n━━━━━━━━━━━━\n📌 কত শতাংশ:\n.percent 45 of 200\n→ 45 is what % of 200?\n\n📌 কত হবে:\n.percent 20% of 500\n→ 20% of 500 = ?`);

  const input = args.join(" ").toLowerCase();

  if (input.includes("% of")) {
    const match = input.match(/([\d.]+)%\s*of\s*([\d.]+)/);
    if (!match) return message.reply("❌ ফরম্যাট: .percent 20% of 500");
    const pct = parseFloat(match[1]), total = parseFloat(match[2]);
    const result = (pct / 100) * total;
    return message.reply(`📊 ${pct}% of ${total} = ${result.toFixed(2)}`);
  }

  if (input.includes(" of ")) {
    const parts = input.split(" of ");
    const value = parseFloat(parts[0]), total = parseFloat(parts[1]);
    if (isNaN(value) || isNaN(total) || total === 0) return message.reply("❌ সঠিক সংখ্যা দাও।");
    const pct = (value / total) * 100;
    return message.reply(`📊 ${value} is ${pct.toFixed(2)}% of ${total}`);
  }

  return message.reply("❌ ব্যবহার: .percent 45 of 200 | .percent 20% of 500");
};
