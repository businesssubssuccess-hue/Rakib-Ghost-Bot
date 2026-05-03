// Sexy — 18+ — Rakib Islam / Ghost Net Edition
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const ENDPOINTS = [
  "https://api.waifu.pics/nsfw/waifu",
  "https://api.waifu.pics/nsfw/ero",
  "https://hmtai.hatsunia.moe/v2/nsfw/boobs",
  "https://hmtai.hatsunia.moe/v2/nsfw/ass",
];

module.exports = {
  config: {
    name: "sexy",
    aliases: ["hotgirl", "sexygirl", "hot18"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 1,
    shortDescription: { en: "Random sexy/hot NSFW image 🔞🔥" },
    category: "18+",
    guide: { en: "{p}sexy" }
  },
  onStart: async function ({ message }) {
    await fs.ensureDir(path.join(__dirname, "cache"));
    try {
      const endpoint = ENDPOINTS[Math.floor(Math.random() * ENDPOINTS.length)];
      const { data } = await axios.get(endpoint, { timeout: 10000 });
      const imgUrl = data.url;
      if (!imgUrl) throw new Error("No image");
      const resp = await axios.get(imgUrl, { responseType: "arraybuffer", timeout: 15000 });
      const ext = imgUrl.split(".").pop().split("?")[0] || "jpg";
      const out = path.join(__dirname, "cache", `sexy_${Date.now()}.${ext}`);
      await fs.writeFile(out, Buffer.from(resp.data));
      await message.reply({ body: "🔞🔥 Sexy | Ghost Net 18+", attachment: fs.createReadStream(out) });
      setTimeout(() => { try { fs.unlinkSync(out); } catch {} }, 15000);
    } catch { message.reply("❌ Failed. Try again later."); }
  }
};
