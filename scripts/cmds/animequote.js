const axios = require("axios");

module.exports = {
  config: {
    name: "animequote",
    aliases: ["aniquote"],
    version: "1.0",
    author: "Rakib",
    countDown: 5,
    role: 0,
    shortDescription: "Random anime quote",
    category: "anime",
    guide: { en: "{p}animequote" }
  },
  onStart: async function ({ message }) {
    try {
      const { data } = await axios.get("https://animechan.io/api/v1/quotes/random");
      const q = data?.data;
      if (q) return message.reply(`🌸 𝗔𝗡𝗜𝗠𝗘 𝗤𝗨𝗢𝗧𝗘\n━━━━━━━━━━━━━━\n💬 "${q.content}"\n\n👤 — ${q.character?.name}\n🎬 ${q.anime?.name}\n━━━━━━━━━━━━━━\n💀 Ghost Net`);
    } catch {}
    // Fallback offline quotes
    const quotes = [
      ['"The world is not beautiful, therefore it is."', "Kino", "Kino's Journey"],
      ['"People die when they are killed."', "Shirou Emiya", "Fate/stay night"],
      ['"I want to be the very best, like no one ever was."', "Ash", "Pokémon"],
      ['"Hard work is worthless for those that don\'t believe in themselves."', "Naruto", "Naruto"],
      ['"A lesson without pain is meaningless."', "Edward Elric", "FMA: Brotherhood"]
    ];
    const [q, c, a] = quotes[Math.floor(Math.random() * quotes.length)];
    return message.reply(`🌸 𝗔𝗡𝗜𝗠𝗘 𝗤𝗨𝗢𝗧𝗘\n━━━━━━━━━━━━━━\n💬 ${q}\n\n👤 — ${c}\n🎬 ${a}\n━━━━━━━━━━━━━━\n💀 Ghost Net`);
  }
};
