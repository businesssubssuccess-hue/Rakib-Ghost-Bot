// Neko18 — 18+ — Rakib Islam / Ghost Net Edition
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "neko18",
    aliases: ["nsfw_neko", "nekonsfw"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 1,
    shortDescription: { en: "NSFW Neko anime image 🔞🐱" },
    category: "18+",
    guide: { en: "{p}neko18" }
  },
  onStart: async function ({ message }) {
    await fs.ensureDir(path.join(__dirname, "cache"));
    try {
      const { data } = await axios.get("https://api.waifu.pics/nsfw/neko", { timeout: 10000 });
      const resp = await axios.get(data.url, { responseType: "arraybuffer", timeout: 15000 });
      const ext = data.url.split(".").pop().split("?")[0] || "jpg";
      const out = path.join(__dirname, "cache", `neko18_${Date.now()}.${ext}`);
      await fs.writeFile(out, Buffer.from(resp.data));
      await message.reply({ body: "🔞🐱 NSFW Neko | Ghost Net 18+", attachment: fs.createReadStream(out) });
      setTimeout(() => { try { fs.unlinkSync(out); } catch {} }, 15000);
    } catch { message.reply("❌ Failed. Try again later."); }
  }
};
