const axios = require("axios");

module.exports = {
  config: {
    name: "romantic couple",
    aliases: ["couple", "lovevideo","💕"],
    version: "1.0.0",
    author: "RAKIB ISLAM",
    countDown: 10,
    role: 0,
    category: "18+",
    shortDescription: { en: "Get random romantic/couple videos" },
    guide: { en: "{pn}" }
  },

  onStart: async function ({ api, event, message }) {
    try {
      message.reply("🎬 | আপনার ভিডিওটি লোড হচ্ছে, দয়া করে অপেক্ষা করুন...");
      
      // এখানে একটি থার্ড পার্টি API বা আপনার সংগ্রহ করা ভিডিওর লিঙ্ক ব্যবহার করুন
      const res = await axios.get("https://api.vishwa.me/video/romantic"); // এটি একটি ডামি লিঙ্ক
      const videoUrl = res.data.url;

      const stream = (await axios.get(videoUrl, { responseType: "stream" })).data;

      return message.reply({
        body: "╭──────❍ 𝗥𝗢𝗠𝗔𝗡𝗧𝗜𝗖 ❍──────╮\n│ 💞 Enjoy your video!\n╰─────────── 💠 ───────────╯\n👤 Powered by RAKIB ISLAM",
        attachment: stream
      });
    } catch (e) {
      return message.reply("❌ বর্তমানে সার্ভার বিজি আছে, পরে চেষ্টা করুন।");
    }
  }
};
