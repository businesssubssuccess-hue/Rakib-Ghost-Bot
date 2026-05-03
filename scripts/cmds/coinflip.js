module.exports = {
  config: {
    name: "coinflip",
    aliases: ["flip", "toss"],
    version: "1.0",
    author: "Rakib",
    countDown: 2,
    role: 0,
    shortDescription: "Coin toss — heads or tails",
    category: "game",
    guide: { en: "{p}coinflip [head|tail]" }
  },
  onStart: async function ({ message, args }) {
    const r = Math.random() < 0.5 ? "head" : "tail";
    const ic = r === "head" ? "👑" : "🌟";
    let msg = `🪙 𝗖𝗢𝗜𝗡 𝗙𝗟𝗜𝗣\n━━━━━━━━━━━━━━\n${ic} Result: ${r.toUpperCase()}\n`;
    if (args[0]) {
      const u = args[0].toLowerCase().replace(/s$/, "");
      msg += u === r ? "🏆 তুমি জিতলে!\n" : "💀 তুমি হারলে!\n";
    }
    msg += `━━━━━━━━━━━━━━\n👻 Ghost Net`;
    return message.reply(msg);
  }
};
