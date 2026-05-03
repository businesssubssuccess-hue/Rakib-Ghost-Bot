const axios = require("axios");

module.exports = {
  config: {
    name: "animewaifu",
    aliases: ["waifu"],
    version: "1.0",
    author: "Rakib",
    countDown: 5,
    role: 0,
    shortDescription: "Random anime waifu image",
    category: "anime",
    guide: { en: "{p}animewaifu" }
  },
  onStart: async function ({ message, event }) {
    await message.reaction("⏳", event.messageID);
    try {
      const { data } = await axios.get("https://api.waifu.pics/sfw/waifu");
      const img = (await axios.get(data.url, { responseType: "stream" })).data;
      await message.reaction("✅", event.messageID);
      return message.reply({ body: "🌸 𝗔𝗡𝗜𝗠𝗘 𝗪𝗔𝗜𝗙𝗨\n💀 Ghost Net", attachment: img });
    } catch (e) { return message.reply("❌ Waifu API ব্যর্থ — পরে চেষ্টা করো"); }
  }
};
