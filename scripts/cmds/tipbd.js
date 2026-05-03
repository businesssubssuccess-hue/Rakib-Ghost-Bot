module.exports.config = {
  name: "tipbd",
  aliases: ["tip2", "resttip", "টিপ"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Restaurant tip calculator 💰" },
  longDescription: { en: "Calculate tip amount for restaurant bill!" },
  category: "utility-bd",
  guide: { en: "{pn} [bill] [tip%] [people] — e.g: .tipbd 500 10 2" }
};

module.exports.onStart = async ({ message, args }) => {
  if (!args[0]) return message.reply("💰 ব্যবহার: .tipbd [বিল] [টিপ%] [জনসংখ্যা]\n📌 উদাহরণ: .tipbd 500 10 2");
  const bill = parseFloat(args[0]);
  const tipPct = parseFloat(args[1]) || 10;
  const people = parseInt(args[2]) || 1;
  if (isNaN(bill) || bill <= 0) return message.reply("❌ সঠিক বিল amount দাও।");
  const tipAmount = (bill * tipPct) / 100;
  const total = bill + tipAmount;
  const perPerson = total / people;
  return message.reply(`💰 𝗧𝗶𝗽 𝗖𝗮𝗹𝗰𝘂𝗹𝗮𝘁𝗼𝗿\n━━━━━━━━━━━━\n🧾 বিল: ৳${bill.toFixed(2)}\n💡 টিপ (${tipPct}%): ৳${tipAmount.toFixed(2)}\n💳 মোট: ৳${total.toFixed(2)}\n👥 জনপ্রতি (${people} জন): ৳${perPerson.toFixed(2)}\n━━━━━━━━━━━━\n🍽️ ভালো খাবার, ভালো টিপ!`);
};
