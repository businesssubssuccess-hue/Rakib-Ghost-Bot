// Thighs18 — 18+ — Rakib Islam / Ghost Net Edition
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "thighs18",
    aliases: ["thighsnsfw", "thigh18"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 1,
    shortDescription: { en: "NSFW thighs anime image 🔞" },
    category: "18+",
    guide: { en: "{p}thighs18" }
  },
  onStart: async function ({ message }) {
    await fs.ensureDir(path.join(__dirname, "cache"));
    try {
      const { data } = await axios.get("https://hmtai.hatsunia.moe/v2/nsfw/thighs", { timeout: 10000 });
      const imgUrl = data.url;
      if (!imgUrl) throw new Error("No image");
      const resp = await axios.get(imgUrl, { responseType: "arraybuffer", timeout: 15000 });
      const ext = imgUrl.split(".").pop().split("?")[0] || "jpg";
      const out = path.join(__dirname, "cache", `thighs18_${Date.now()}.${ext}`);
      await fs.writeFile(out, Buffer.from(resp.data));
      await message.reply({ body: "🔞 Thighs | Ghost Net 18+", attachment: fs.createReadStream(out) });
      setTimeout(() => { try { fs.unlinkSync(out); } catch {} }, 15000);
    } catch { message.reply("❌ Failed. Try again later."); }
  }
};
