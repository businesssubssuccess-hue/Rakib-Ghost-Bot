const axios = require("axios");

module.exports = {
  config: {
    name: "animehusbando",
    aliases: ["husbando"],
    version: "1.0",
    author: "Rakib",
    countDown: 5,
    role: 0,
    shortDescription: "Random anime husbando image",
    category: "anime",
    guide: { en: "{p}animehusbando" }
  },
  onStart: async function ({ message, event }) {
    await message.reaction("⏳", event.messageID);
    try {
      const { data } = await axios.get("https://api.waifu.im/search?included_tags=husbando");
      const url = data.images?.[0]?.url || (await axios.get("https://api.waifu.pics/sfw/husbando")).data.url;
      const img = (await axios.get(url, { responseType: "stream" })).data;
      await message.reaction("✅", event.messageID);
      return message.reply({ body: "🌸 𝗔𝗡𝗜𝗠𝗘 𝗛𝗨𝗦𝗕𝗔𝗡𝗗𝗢\n💀 Ghost Net", attachment: img });
    } catch (e) { return message.reply("❌ Husbando API ব্যর্থ"); }
  }
};
