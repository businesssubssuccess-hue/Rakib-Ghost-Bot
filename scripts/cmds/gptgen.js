const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const CACHE = path.join(__dirname, "cache");

module.exports = {
  config: {
    name: "gptgen",
    version: "2.0",
    author: "Rakib Islam",
    countDown: 15,
    role: 0,
    shortDescription: { en: "Generate or edit images using text prompts" },
    longDescription: { en: "Generate a new image from text, or edit an existing image by replying to it with a prompt." },
    category: "ai-image",
    guide: {
      en: "{p}gptgen <prompt>\n{p}gptgen <prompt> (reply to an image to edit it)\n\nExamples:\n{p}gptgen a cyberpunk city\n{p}gptgen make me anime (reply to photo)"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    const repliedImage = event.messageReply?.attachments?.[0];
    const prompt = args.join(" ").trim();

    if (!prompt) {
      return message.reply(
        `╔══════════════════════╗\n` +
        `║  🎨 GPT Image Gen     ║\n` +
        `╚══════════════════════╝\n\n` +
        `  ✦ Usage › .gptgen <prompt>\n` +
        `  ✦ Edit  › reply to photo + .gptgen <prompt>\n\n` +
        `  📌 Examples:\n` +
        `  › .gptgen a cyberpunk city\n` +
        `  › .gptgen make me anime (reply to photo)`
      );
    }

    await fs.ensureDir(CACHE);
    api.setMessageReaction("⏳", event.messageID, () => {}, true);
    const startTime = Date.now();

    const imgPath = path.join(CACHE, `gptgen_${Date.now()}.png`);
    let success = false;
    let method = "";

    // Method 1: oculux gptimage (supports image editing via ref)
    try {
      let apiURL = `https://dev.oculux.xyz/api/gptimage?prompt=${encodeURIComponent(prompt)}`;
      if (repliedImage?.type === "photo") {
        apiURL += `&ref=${encodeURIComponent(repliedImage.url)}&width=${repliedImage.width || 512}&height=${repliedImage.height || 512}`;
      } else {
        apiURL += `&width=1024&height=1024`;
      }
      const res = await axios.get(apiURL, { responseType: "arraybuffer", timeout: 30000 });
      if (res.data?.byteLength > 1000) {
        await fs.writeFile(imgPath, res.data);
        success = true;
        method = "GPT Image";
      }
    } catch (e) {}

    // Method 2: Pollinations Flux fallback
    if (!success) {
      try {
        const fullPrompt = repliedImage?.type === "photo"
          ? `${prompt}, photo-realistic, high quality`
          : prompt;
        const seed = Math.floor(Math.random() * 999999);
        const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?model=flux-pro&width=1024&height=1024&seed=${seed}&nologo=true&private=true`;
        const res = await axios.get(url, { responseType: "arraybuffer", timeout: 60000, headers: { "User-Agent": "Mozilla/5.0" } });
        if (res.data?.byteLength > 1000) {
          await fs.writeFile(imgPath, res.data);
          success = true;
          method = "Flux Pro";
        }
      } catch (e) {}
    }

    if (!success) {
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      return message.reply("❌ Image generate করা যায়নি। আবার try করো।");
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    api.setMessageReaction("✅", event.messageID, () => {}, true);

    await message.reply({
      body:
        `╔══════════════════════╗\n` +
        `║  ✅ Image Ready!       ║\n` +
        `╚══════════════════════╝\n` +
        `  ✦ Model  › ${method}\n` +
        `  ✦ Time   › ${elapsed}s\n` +
        `  ✦ Mode   › ${repliedImage?.type === "photo" ? "Edit 🖊️" : "Generate 🎨"}\n` +
        `  ✦ Prompt › ${prompt.substring(0, 55)}${prompt.length > 55 ? "..." : ""}`,
      attachment: fs.createReadStream(imgPath)
    });

    setTimeout(() => { try { fs.unlinkSync(imgPath); } catch {} }, 20000);
  }
};
