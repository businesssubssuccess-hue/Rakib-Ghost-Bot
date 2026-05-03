const symbols = ["🍒", "🍋", "🍊", "⭐", "💎", "🎯", "🔔", "🍀"];

module.exports.config = {
  name: "slotbd",
  aliases: ["slot2", "স্লট", "jackpot2"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 5,
  role: 0,
  shortDescription: { en: "Slot machine game 🎰" },
  longDescription: { en: "Try your luck on the virtual slot machine!" },
  category: "game-bd",
  guide: { en: "{pn}" }
};

module.exports.onStart = async ({ message, usersData, event }) => {
  const name = await usersData.getName(event.senderID) || "খেলোয়াড়";
  const s = () => symbols[Math.floor(Math.random() * symbols.length)];
  const [a, b, c] = [s(), s(), s()];

  let result;
  if (a === b && b === c) result = `🏆 JACKPOT! তিনটাই মিলেছে! তুমি legendary!\n🎉 ${a} ${b} ${c}`;
  else if (a === b || b === c || a === c) result = `🥈 দুটো মিলেছে! প্রায় জিতে গেছ!\n✨ ${a} ${b} ${c}`;
  else result = `😅 কিছু মেলেনি এবার।\n🎰 ${a} ${b} ${c}`;

  return message.reply(`🎰 𝗦𝗹𝗼𝘁 𝗠𝗮𝗰𝗵𝗶𝗻𝗲\n━━━━━━━━━━━━\n👤 ${name}\n┌─────────┐\n│ ${a}  ${b}  ${c} │\n└─────────┘\n━━━━━━━━━━━━\n${result}\n🔄 আবার: .slotbd`);
};
