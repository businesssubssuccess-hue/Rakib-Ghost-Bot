const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "fluxx",
    version: "3.0",
    author: "Rakib Islam",
    countDown: 20,
    role: 0,
    shortDescription: { en: "Generate 4 AI images in a grid (Flux)" },
    longDescription: { en: "Generate 4 variations of your prompt using Flux AI and display as a 2x2 grid. Reply U1-U4 to pick one." },
    category: "ai-image",
    guide: { en: "{pn} <prompt>\nThen reply U1, U2, U3, or U4 to select an image" }
  },

  onStart: async function ({ api, event, args, message }) {
    const prompt = args.join(" ").trim();
    if (!prompt) {
      return message.reply(
        `╔══════════════════════╗\n` +
        `║  🎨 Fluxx 4-Grid AI   ║\n` +
        `╚══════════════════════╝\n\n` +
        `  ✦ Usage › .fluxx <prompt>\n` +
        `  ✦ Then reply U1, U2, U3 or U4\n\n` +
        `  📌 Example:\n` +
        `  › .fluxx anime warrior in fire`
      );
    }

    api.setMessageReaction("⌛", event.messageID, () => {}, true);
    await message.reply(`🎨 Fluxx: 4টি image generate করছি...\nPrompt: "${prompt}"\n\n⏳ ৩০-৬০ সেকেন্ড অপেক্ষা করো!`);

    const cacheDir = path.join(__dirname, "cache");
    await fs.ensureDir(cacheDir);

    // Generate 4 images with different seeds
    const seeds = Array.from({ length: 4 }, () => Math.floor(Math.random() * 999999));
    const imageBuffers = [];
    const imageUrls = [];

    for (let i = 0; i < 4; i++) {
      try {
        const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?model=flux&seed=${seeds[i]}&width=512&height=512&nologo=true&private=true`;
        imageUrls.push(url);
        const res = await axios.get(url, { responseType: "arraybuffer", timeout: 60000, headers: { "User-Agent": "Mozilla/5.0" } });
        if (res.data && res.data.byteLength > 1000) {
          imageBuffers.push(Buffer.from(res.data));
        }
      } catch (e) {}
    }

    if (imageBuffers.length < 2) {
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      return message.reply("❌ Images generate করা যায়নি। আবার try করো।");
    }

    // Build 2x2 grid using canvas
    try {
      const SIZE = 512;
      const canvas = createCanvas(SIZE * 2, SIZE * 2);
      const ctx = canvas.getContext("2d");

      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, SIZE * 2, SIZE * 2);

      const positions = [[0, 0], [SIZE, 0], [0, SIZE], [SIZE, SIZE]];
      for (let i = 0; i < Math.min(imageBuffers.length, 4); i++) {
        const img = await loadImage(imageBuffers[i]);
        const [x, y] = positions[i];
        ctx.drawImage(img, x, y, SIZE, SIZE);
        // Label
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(x + 4, y + 4, 44, 26);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 18px Arial";
        ctx.fillText(`U${i + 1}`, x + 12, y + 22);
      }

      const gridPath = path.join(cacheDir, `fluxx_grid_${Date.now()}.png`);
      const buffer = canvas.toBuffer("image/png");
      await fs.writeFile(gridPath, buffer);

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      message.reply(
        {
          body: `✅ Fluxx 4-Grid Ready!\n📌 Prompt: "${prompt}"\n\n💡 Reply করো U1, U2, U3 বা U4 দিয়ে একটি select করতে`,
          attachment: fs.createReadStream(gridPath)
        },
        (err, info) => {
          if (!err && info?.messageID) {
            global.GoatBot.onReply.set(info.messageID, {
              commandName: "fluxx",
              messageID: info.messageID,
              author: event.senderID,
              imageUrls,
              gridPath
            });
          }
        }
      );
    } catch (e) {
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      message.reply("❌ Grid তৈরি করতে সমস্যা: " + e.message);
    }
  },

  onReply: async function ({ api, event, Reply, message }) {
    if (!Reply) return;
    const { author, imageUrls, gridPath } = Reply;
    if (event.senderID !== author) return message.reply("⚠️ শুধু যে image চেয়েছে সে select করতে পারবে।");

    const input = event.body.trim().toUpperCase();
    const match = input.match(/^U([1-4])$/);
    if (!match) return message.reply("❌ U1, U2, U3 বা U4 লেখো।");

    const idx = parseInt(match[1]) - 1;
    const selectedUrl = imageUrls[idx];

    try {
      api.setMessageReaction("⏳", event.messageID, () => {}, true);
      const cacheDir = path.join(__dirname, "cache");
      const imgPath = path.join(cacheDir, `fluxx_U${idx + 1}_${Date.now()}.jpg`);
      const res = await axios.get(selectedUrl, { responseType: "arraybuffer", timeout: 30000 });
      await fs.writeFile(imgPath, res.data);

      api.setMessageReaction("✅", event.messageID, () => {}, true);
      await message.reply({
        body: `🖼️ Fluxx U${idx + 1} Selected!`,
        attachment: fs.createReadStream(imgPath)
      });
      setTimeout(() => { try { fs.unlinkSync(imgPath); } catch {} }, 15000);
    } catch (e) {
      message.reply("❌ Image পাঠাতে সমস্যা: " + e.message);
    }
    try { if (gridPath) fs.unlinkSync(gridPath); } catch {}
  }
};
