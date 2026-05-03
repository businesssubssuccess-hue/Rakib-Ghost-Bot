const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const MODELS = [
  { id: "flux",      label: "Flux.1 Dev" },
  { id: "flux-pro",  label: "Flux.1 Pro" },
  { id: "turbo",     label: "Turbo" },
];

module.exports = {
  config: {
    name: "texttoimage",
    aliases: ["tti", "text2image", "aiimage", "t2i"],
    version: "3.0",
    author: "Rakib Islam",
    countDown: 15,
    role: 0,
    shortDescription: { en: "Generate image from text prompt (Flux AI)" },
    longDescription: { en: "Convert your text description into an image using Flux AI. Free, no key needed." },
    category: "ai-image",
    guide: {
      en: "{pn} <prompt> [--model flux/flux-pro/turbo] [--size 1024x1024]\n\nExamples:\n{pn} futuristic city at night\n{pn} anime warrior --model flux-pro\n{pn} dragon --size 512x512"
    }
  },

  onStart: async function ({ message, args, event, api }) {
    if (!args[0]) {
      return message.reply(
        `╔══════════════════════╗\n` +
        `║  🎨 Text → Image AI   ║\n` +
        `╚══════════════════════╝\n\n` +
        `  ✦ Usage › .tti <prompt>\n\n` +
        `  📌 Options:\n` +
        `  --model flux | flux-pro | turbo\n` +
        `  --size 512x512 | 1024x1024 | 768x768\n\n` +
        `  📌 Examples:\n` +
        `  › .tti beautiful sunset over ocean\n` +
        `  › .tti anime girl --model flux-pro\n` +
        `  › .tti dragon --size 512x512`
      );
    }

    let prompt = args.join(" ");
    let modelId = "flux";
    let width = 1024, height = 1024;

    const modelMatch = prompt.match(/--model\s+(\S+)/i);
    if (modelMatch) {
      const req = modelMatch[1].toLowerCase();
      const found = MODELS.find(m => m.id === req);
      if (found) { modelId = found.id; }
      prompt = prompt.replace(/--model\s+\S+/i, "").trim();
    }

    const sizeMatch = prompt.match(/--size\s+(\d+)x(\d+)/i);
    if (sizeMatch) {
      width = Math.min(parseInt(sizeMatch[1]), 1920);
      height = Math.min(parseInt(sizeMatch[2]), 1920);
      prompt = prompt.replace(/--size\s+\S+/i, "").trim();
    }

    const modelLabel = MODELS.find(m => m.id === modelId)?.label || modelId;
    const startTime = Date.now();
    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    const cacheDir = path.join(__dirname, "cache");
    await fs.ensureDir(cacheDir);

    const tryOrder = [modelId, ...MODELS.map(m => m.id).filter(id => id !== modelId)];
    let imgPath = null, usedModel = modelLabel;

    for (const mid of tryOrder) {
      try {
        const seed = Math.floor(Math.random() * 999999);
        const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?model=${mid}&width=${width}&height=${height}&seed=${seed}&nologo=true&private=true`;
        const res = await axios.get(url, {
          responseType: "arraybuffer", timeout: 60000,
          headers: { "User-Agent": "Mozilla/5.0" }
        });
        if (res.data?.byteLength > 1000) {
          imgPath = path.join(cacheDir, `tti_${Date.now()}.jpg`);
          await fs.writeFile(imgPath, res.data);
          usedModel = MODELS.find(m => m.id === mid)?.label || mid;
          break;
        }
      } catch (e) {}
    }

    if (!imgPath) {
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      return message.reply("❌ Image generate করা যায়নি। আবার try করো।");
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    api.setMessageReaction("✅", event.messageID, () => {}, true);

    await message.reply({
      body:
        `╔══════════════════════╗\n` +
        `║  ✅ Image Generated!   ║\n` +
        `╚══════════════════════╝\n` +
        `  ✦ Model  › ${usedModel}\n` +
        `  ✦ Size   › ${width}×${height}\n` +
        `  ✦ Time   › ${elapsed}s\n` +
        `  ✦ Prompt › ${prompt.substring(0, 55)}${prompt.length > 55 ? "..." : ""}`,
      attachment: fs.createReadStream(imgPath)
    });

    setTimeout(() => { try { fs.unlinkSync(imgPath); } catch {} }, 20000);
  }
};
