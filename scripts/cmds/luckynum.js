module.exports.config = {
  name: "luckynum",
  aliases: ["lucky2", "ভাগ্যসংখ্যা", "luckynumber"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 5,
  role: 0,
  shortDescription: { en: "Get your lucky number of the day 🍀" },
  longDescription: { en: "Based on your name, find your lucky number for today!" },
  category: "utility-bd",
  guide: { en: "{pn} | {pn} [name]" }
};

const luckMessages = [
  "আজ তোমার দিন সুন্দর যাবে! ✨",
  "আজকে কোনো বড় সিদ্ধান্ত নিতে পারো। 💡",
  "সৌভাগ্য তোমার পাশে আছে! 🍀",
  "আজ নতুন কিছু শুরু করার দিন। 🚀",
  "ধৈর্য ধরো, ভালো কিছু আসছে। 🌟",
  "আজকে পরিবারকে সময় দাও। 💙",
  "বন্ধুদের সাথে কথা বলো, ভালো লাগবে। 😊",
  "আজ নতুন বন্ধু হওয়ার সম্ভাবনা আছে। 🤝"
];

module.exports.onStart = async ({ event, message, args, usersData }) => {
  const name = args.join(" ") || await usersData.getName(event.senderID) || "তুমি";
  const seed = name.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
  const today = new Date();
  const dateSeed = today.getDate() + today.getMonth() * 31;
  const lucky = ((seed + dateSeed) % 99) + 1;
  const msg = luckMessages[(seed + dateSeed) % luckMessages.length];
  const stars = "⭐".repeat(Math.min(5, Math.ceil(lucky / 20)));

  return message.reply(`🍀 𝗟𝘂𝗰𝗸𝘆 𝗡𝘂𝗺𝗯𝗲𝗿\n━━━━━━━━━━━━\n👤 ${name}\n🔢 আজকের lucky number: ${lucky}\n${stars}\n━━━━━━━━━━━━\n💫 ${msg}`);
};
