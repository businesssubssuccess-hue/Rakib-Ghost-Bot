const axios = require("axios");

module.exports = {
  config: {
    name: "animehug",
    aliases: ["anihug"],
    version: "1.0",
    author: "Rakib",
    countDown: 3,
    role: 0,
    shortDescription: "Anime hug GIF কাউকে দাও",
    category: "anime",
    guide: { en: "{p}animehug @mention" }
  },
  onStart: async function ({ message, event, api }) {
    let target = "তোমাকে";
    if (event.type === "message_reply") {
      try { target = (await api.getUserInfo(event.messageReply.senderID))[event.messageReply.senderID].name; } catch {}
    } else if (Object.keys(event.mentions || {}).length) {
      target = Object.values(event.mentions)[0].replace("@", "");
    }
    try {
      const { data } = await axios.get("https://api.waifu.pics/sfw/hug");
      const img = (await axios.get(data.url, { responseType: "stream" })).data;
      return message.reply({ body: `🤗 ${target} কে এক বড় anime hug দিলাম!\n💀 Ghost Net`, attachment: img });
    } catch { return message.reply(`🤗 ${target} কে hug! 💕`); }
  }
};
