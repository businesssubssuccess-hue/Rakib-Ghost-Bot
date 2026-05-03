const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const CACHE = path.join(__dirname, "cache");

const MODELS = [
  { id: "flux-pro",   label: "Flux.1 Pro" },
  { id: "flux",       label: "Flux.1 Dev" },
  { id: "turbo",      label: "Turbo (fast)" },
];

module.exports = {
  config: {
    name: "fluxpro",
    version: "3.0",
    role: 0,
    author: "Rakib Islam",
    description: "Generate images with Flux.1 Pro (Pollinations AI — free, no key)",
    category: "ai-image",
    countDown: 15,
    guide: {
      en: "{pn} <prompt>\n{pn} <prompt> --model flux/turbo\n\nExamples:\n{pn} futuristic city at night\n{pn} cute anime girl --model turbo"
    }
  },

  onStart: async function ({ message, args, event, api }) {
    if (!args[0]) {
      return message.reply(
        `╔══════════════════════╗\n` +
        `║  🎨 Flux Pro Image AI  ║\n` +
        `╚══════════════════════╝\n\n` +
        `  ✦ Usage  › .fluxpro <prompt>\n` +
        `  ✦ Models › flux-pro, flux, turbo\n\n` +
        `  📌 Examples:\n` +
        `  › .fluxpro futuristic city at night\n` +
        `  › .fluxpro anime girl with wings\n` +
        `  › .fluxpro dragon in space --model turbo\n\n` +
        `  ⚡ Powered by Pollinations AI (free)`
      );
    }

    let prompt = args.join(" ");
    let modelId = "flux-pro";
    let modelLabel = "Flux.1 Pro";

    const modelMatch = prompt.match(/--model\s+(\S+)/i);
    if (modelMatch) {
      const requested = modelMatch[1].toLowerCase();
      const found = MODELS.find(m => m.id === requested || m.label.toLowerCase().includes(requested));
      if (found) { modelId = found.id; modelLabel = found.label; }
      prompt = prompt.replace(/--model\s+\S+/i, "").trim();
    }

    const startTime = Date.now();
    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    await fs.ensureDir(CACHE);

    let imgPath = null;
    let usedModel = modelLabel;

    // Try primary model, then fallback to others
    const tryOrder = [modelId, ...MODELS.map(m => m.id).filter(id => id !== modelId)];

    for (const mid of tryOrder) {
      try {
        const seed = Math.floor(Math.random() * 999999);
        const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?model=${mid}&width=1024&height=1024&seed=${seed}&nologo=true&private=true`;

        const res = await axios.get(url, {
          responseType: "arraybuffer",
          timeout: 60000,
          headers: { "User-Agent": "Mozilla/5.0" }
        });

        if (res.status === 200 && res.data?.byteLength > 1000) {
          imgPath = path.join(CACHE, `fluxpro_${Date.now()}.jpg`);
          await fs.writeFile(imgPath, res.data);
          usedModel = MODELS.find(m => m.id === mid)?.label || mid;
          break;
        }
      } catch (e) {}
    }

    if (!imgPath) {
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      return message.reply(
        `❌ Image generate করা যায়নি!\n\n` +
        `💡 অন্য prompt দিয়ে try করো`
      );
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    api.setMessageReaction("✅", event.messageID, () => {}, true);

    await message.reply({
      body:
        `╔══════════════════════╗\n` +
        `║  ✅ Image Generated!   ║\n` +
        `╚══════════════════════╝\n` +
        `  ✦ Model  › ${usedModel}\n` +
        `  ✦ Time   › ${elapsed}s\n` +
        `  ✦ Prompt › ${prompt.substring(0, 60)}${prompt.length > 60 ? "..." : ""}`,
      attachment: fs.createReadStream(imgPath)
    });

    setTimeout(() => { try { fs.unlinkSync(imgPath); } catch {} }, 20000);
  }
};
