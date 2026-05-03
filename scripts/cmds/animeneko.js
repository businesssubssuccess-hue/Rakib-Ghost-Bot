const axios = require("axios");

module.exports = {
  config: {
    name: "animeneko",
    aliases: ["neko"],
    version: "1.0",
    author: "Rakib",
    countDown: 5,
    role: 0,
    shortDescription: "Random anime neko (cat girl) image",
    category: "anime",
    guide: { en: "{p}animeneko" }
  },
  onStart: async function ({ message, event }) {
    await message.reaction("⏳", event.messageID);
    try {
      const { data } = await axios.get("https://api.waifu.pics/sfw/neko");
      const img = (await axios.get(data.url, { responseType: "stream" })).data;
      await message.reaction("✅", event.messageID);
      return message.reply({ body: "🐱 𝗔𝗡𝗜𝗠𝗘 𝗡𝗘𝗞𝗢\n💀 Ghost Net", attachment: img });
    } catch { return message.reply("❌ Neko API ব্যর্থ"); }
  }
};
