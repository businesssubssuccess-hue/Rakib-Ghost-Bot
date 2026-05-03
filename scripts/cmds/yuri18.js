// Yuri18 — 18+ — Rakib Islam / Ghost Net Edition
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "yuri18",
    aliases: ["yurinsfw", "yuri_18"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 1,
    shortDescription: { en: "NSFW Yuri anime 🔞" },
    category: "18+",
    guide: { en: "{p}yuri18" }
  },
  onStart: async function ({ message }) {
    await fs.ensureDir(path.join(__dirname, "cache"));
    try {
      const { data } = await axios.get("https://api.waifu.pics/nsfw/yuri", { timeout: 10000 });
      const resp = await axios.get(data.url, { responseType: "arraybuffer", timeout: 15000 });
      const ext = data.url.split(".").pop().split("?")[0] || "jpg";
      const out = path.join(__dirname, "cache", `yuri18_${Date.now()}.${ext}`);
      await fs.writeFile(out, Buffer.from(resp.data));
      await message.reply({ body: "🔞 Yuri Anime | Ghost Net 18+", attachment: fs.createReadStream(out) });
      setTimeout(() => { try { fs.unlinkSync(out); } catch {} }, 15000);
    } catch { message.reply("❌ Failed. Try again later."); }
  }
};
