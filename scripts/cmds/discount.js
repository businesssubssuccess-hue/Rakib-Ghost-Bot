module.exports.config = {
  name: "discount",
  aliases: ["disc", "ছাড়", "sale"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Discount price calculator 🏷️" },
  longDescription: { en: "Calculate discounted price and amount saved." },
  category: "utility-bd",
  guide: { en: "{pn} [price] [discount%] — e.g: .discount 1000 20" }
};

module.exports.onStart = async ({ message, args }) => {
  if (!args[0] || !args[1]) return message.reply("🏷️ ব্যবহার: .discount [দাম] [ছাড়%]\n📌 উদাহরণ: .discount 1000 20");
  const price = parseFloat(args[0]);
  const pct = parseFloat(args[1]);
  if (isNaN(price) || isNaN(pct) || pct < 0 || pct > 100) return message.reply("❌ সঠিক সংখ্যা দাও। ছাড় ০-১০০% এর মধ্যে হতে হবে।");
  const saved = (price * pct) / 100;
  const final = price - saved;
  return message.reply(`🏷️ 𝗗𝗶𝘀𝗰𝗼𝘂𝗻𝘁 𝗖𝗮𝗹𝗰\n━━━━━━━━━━━━\n💰 আসল দাম: ৳${price.toFixed(2)}\n🔻 ছাড়: ${pct}% (৳${saved.toFixed(2)})\n✅ চূড়ান্ত দাম: ৳${final.toFixed(2)}\n💸 সাশ্রয়: ৳${saved.toFixed(2)}\n━━━━━━━━━━━━\n🛒 কিনে নাও!`);
};
