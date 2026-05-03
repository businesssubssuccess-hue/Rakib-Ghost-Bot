// Ecchi — 18+ — Rakib Islam / Ghost Net Edition
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

async function fetchNSFW(endpoint) {
  const { data } = await axios.get(`https://api.waifu.pics/nsfw/${endpoint}`, { timeout: 10000 });
  const resp = await axios.get(data.url, { responseType: "arraybuffer", timeout: 15000 });
  return { buffer: Buffer.from(resp.data), ext: data.url.split(".").pop().split("?")[0] || "jpg" };
}

module.exports = {
  config: {
    name: "ecchi",
    aliases: ["ero", "lewd"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 1,
    shortDescription: { en: "Ecchi/Ero anime image 🔞" },
    category: "18+",
    guide: { en: "{p}ecchi" }
  },
  onStart: async function ({ message, event }) {
    await fs.ensureDir(path.join(__dirname, "cache"));
    try {
      const { buffer, ext } = await fetchNSFW("ero");
      const out = path.join(__dirname, "cache", `ecchi_${Date.now()}.${ext}`);
      await fs.writeFile(out, buffer);
      await message.reply({ body: "🔞 Ecchi Anime | Ghost Net 18+", attachment: fs.createReadStream(out) });
      setTimeout(() => { try { fs.unlinkSync(out); } catch {} }, 15000);
    } catch { message.reply("❌ Failed. Try again later."); }
  }
};
