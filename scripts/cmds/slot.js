module.exports = {
  config: {
    name: "slot",
    aliases: ["slotmachine", "casino"],
    version: "1.0",
    author: "Rakib",
    countDown: 3,
    role: 0,
    shortDescription: "Slot machine game",
    category: "game",
    guide: { en: "{p}slot" }
  },
  onStart: async function ({ message }) {
    const ic = ["🍒", "🍋", "🍇", "🍉", "💎", "7️⃣", "⭐"];
    const a = ic[Math.floor(Math.random() * ic.length)];
    const b = ic[Math.floor(Math.random() * ic.length)];
    const c = ic[Math.floor(Math.random() * ic.length)];
    let r = "💀 কিছুই হয়নি!";
    if (a === b && b === c) r = a === "💎" ? "💎 JACKPOT! 1000x reward!" : a === "7️⃣" ? "🎰 SUPER WIN! 500x!" : "🏆 TRIPLE — তুমি জিতলে!";
    else if (a === b || b === c || a === c) r = "✨ Pair! ছোট জয়!";
    return message.reply(`🎰 𝗦𝗟𝗢𝗧 𝗠𝗔𝗖𝗛𝗜𝗡𝗘\n━━━━━━━━━━━━━━\n┃ ${a} ┃ ${b} ┃ ${c} ┃\n━━━━━━━━━━━━━━\n${r}\n👻 Ghost Net`);
  }
};
