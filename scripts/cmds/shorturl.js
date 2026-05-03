const axios = require("axios");

module.exports = {
  config: {
    name: "shorturl",
    aliases: ["surl"],
    version: "1.0",
    author: "Rakib",
    countDown: 5,
    role: 0,
    shortDescription: "URL ছোট করো (TinyURL)",
    category: "utility",
    guide: { en: "{p}shorturl <long url>" }
  },
  onStart: async function ({ message, args }) {
    if (!args.length) return message.reply("⚠️ একটা URL দাও\nযেমন: shorturl https://www.facebook.com/profile.php?id=...");
    const url = args[0];
    if (!/^https?:\/\//.test(url)) return message.reply("⚠️ URL এ http:// বা https:// থাকতে হবে");
    try {
      const { data } = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
      return message.reply(`🔗 𝗦𝗛𝗢𝗥𝗧 𝗨𝗥𝗟\n━━━━━━━━━━━━━━\n📥 Original: ${url.slice(0, 60)}${url.length > 60 ? "..." : ""}\n📤 Short  : ${data}\n━━━━━━━━━━━━━━\n👻 Ghost Net`);
    } catch { return message.reply("❌ Shorten failed"); }
  }
};
