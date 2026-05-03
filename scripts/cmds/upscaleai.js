const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const Jimp = require("jimp");

const CACHE = path.join(__dirname, "cache");

module.exports = {
  config: {
    name: "upscaleai",
    aliases: ["upscaleimage", "enhanceimg"],
    version: "3.0",
    author: "Rakib Islam",
    countDown: 15,
    role: 0,
    shortDescription: { en: "Upscale/enhance an image using AI (2x or 4x)" },
    longDescription: { en: "Reply to an image to upscale it. Uses multiple AI upscale APIs with local Jimp fallback." },
    category: "image",
    guide: { en: "{pn} [2x|4x] — Reply to an image\nDefault: 2x\nExample: {pn} 4x" }
  },

  onStart: async function ({ message, args, event, api }) {
    let imageUrl;
    if (event.type === "message_reply") {
      const att = event.messageReply?.attachments?.[0];
      if (att?.type === "photo") imageUrl = att.url;
    } else if (event.attachments?.[0]?.type === "photo") {
      imageUrl = event.attachments[0].url;
    }

    if (!imageUrl) {
      return message.reply(
        `╔══════════════════════╗\n` +
        `║  🔍 AI Image Upscaler ║\n` +
        `╚══════════════════════╝\n\n` +
        `📌 ব্যবহার: ছবিতে reply করো\n\n` +
        `  .upscaleai      → 2x upscale\n` +
        `  .upscaleai 4x   → 4x upscale\n\n` +
        `💡 ছবির resolution বাড়াবে`
      );
    }

    const scale = args[0] === "4x" ? 4 : 2;
    api.setMessageReaction("⏳", event.messageID, () => {}, true);
    await fs.ensureDir(CACHE);

    try {
      // Download original image
      const origRes = await axios.get(imageUrl, { responseType: "arraybuffer", timeout: 20000 });
      const origBuffer = Buffer.from(origRes.data);
      const origPath = path.join(CACHE, `upscale_orig_${Date.now()}.jpg`);
      await fs.writeFile(origPath, origBuffer);

      let upscaledPath = null;

      // Method 1: Try oculux enhance API
      try {
        const apiUrl = `https://dev.oculux.xyz/api/enhance?imageUrl=${encodeURIComponent(imageUrl)}`;
        const res = await axios.get(apiUrl, { responseType: "arraybuffer", timeout: 25000 });
        if (res.data && res.data.byteLength > 5000) {
          upscaledPath = path.join(CACHE, `upscale_out_${Date.now()}.jpg`);
          await fs.writeFile(upscaledPath, res.data);
        }
      } catch (e) {}

      // Method 2: Try waifu2x style via another API
      if (!upscaledPath) {
        try {
          const apiUrl = `https://api.popcat.xyz/waifu2x?url=${encodeURIComponent(imageUrl)}`;
          const res = await axios.get(apiUrl, { responseType: "arraybuffer", timeout: 25000 });
          if (res.data && res.data.byteLength > 5000) {
            upscaledPath = path.join(CACHE, `upscale_out_${Date.now()}.jpg`);
            await fs.writeFile(upscaledPath, res.data);
          }
        } catch (e) {}
      }

      // Method 3: Local Jimp upscaling (always works)
      if (!upscaledPath) {
        const img = await Jimp.read(origBuffer);
        const newW = img.getWidth() * scale;
        const newH = img.getHeight() * scale;
        img.resize(newW, newH, Jimp.RESIZE_BILINEAR);
        upscaledPath = path.join(CACHE, `upscale_out_${Date.now()}.jpg`);
        await img.quality(95).writeAsync(upscaledPath);
      }

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      const origImg = await Jimp.read(origBuffer);
      const upscImg = await Jimp.read(upscaledPath);

      await message.reply({
        body:
          `╔══════════════════════╗\n` +
          `║  ✅ Upscale Complete!  ║\n` +
          `╚══════════════════════╝\n` +
          `  ✦ Scale  › ${scale}x\n` +
          `  ✦ Before › ${origImg.getWidth()}×${origImg.getHeight()}\n` +
          `  ✦ After  › ${upscImg.getWidth()}×${upscImg.getHeight()}`,
        attachment: fs.createReadStream(upscaledPath)
      });

      setTimeout(() => {
        try { fs.unlinkSync(origPath); } catch {}
        try { fs.unlinkSync(upscaledPath); } catch {}
      }, 20000);

    } catch (err) {
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      message.reply("❌ Upscale করতে সমস্যা: " + err.message);
    }
  }
};
