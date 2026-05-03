const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "fluxdev",
    aliases: ["flux1", "fluxd"],
    version: "2.0",
    author: "Rakib Islam",
    countDown: 15,
    role: 0,
    shortDescription: { en: "Generate AI image with Flux.1 Dev model" },
    longDescription: { en: "Generate images using Flux.1 Dev model via Pollinations AI (free, no key)" },
    category: "ai-image",
    guide: { en: "{pn} <prompt>\nExample: {pn} futuristic dragon in space" }
  },

  onStart: async function ({ message, event, api, args }) {
    if (!args[0]) {
      return message.reply(
        `╔══════════════════════╗\n` +
        `║  🎨 Flux.1 Dev Image  ║\n` +
        `╚══════════════════════╝\n\n` +
        `  ✦ Usage › .fluxdev <prompt>\n\n` +
        `  📌 Examples:\n` +
        `  › .fluxdev anime warrior in dark forest\n` +
        `  › .fluxdev futuristic city at night\n` +
        `  › .fluxdev beautiful galaxy landscape`
      );
    }

    const prompt = args.join(" ").trim();
    const startTime = Date.now();

    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    try {
      const cacheDir = path.join(__dirname, "cache");
      await fs.ensureDir(cacheDir);

      const seed = Math.floor(Math.random() * 999999);
      const imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?model=flux&seed=${seed}&width=1024&height=1024&nologo=true&private=true`;

      const res = await axios.get(imgUrl, {
        responseType: "arraybuffer",
        timeout: 60000,
        headers: { "User-Agent": "Mozilla/5.0" }
      });

      if (!res.data || res.data.byteLength < 1000) throw new Error("Empty image response");

      const imgPath = path.join(cacheDir, `fluxdev_${Date.now()}.jpg`);
      await fs.writeFile(imgPath, res.data);

      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      api.setMessageReaction("✅", event.messageID, () => {}, true);

      await message.reply({
        body:
          `╔══════════════════════╗\n` +
          `║  ✅ Flux.1 Dev Ready! ║\n` +
          `╚══════════════════════╝\n` +
          `  ✦ Model  › Flux.1 Dev\n` +
          `  ✦ Time   › ${elapsed}s\n` +
          `  ✦ Prompt › ${prompt.substring(0, 60)}${prompt.length > 60 ? "..." : ""}`,
        attachment: fs.createReadStream(imgPath)
      });

      setTimeout(() => { try { fs.unlinkSync(imgPath); } catch {} }, 20000);
    } catch (err) {
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      message.reply(`❌ Image generate করা যায়নি!\n${err.message}\n\n💡 আবার try করো।`);
    }
  }
};
