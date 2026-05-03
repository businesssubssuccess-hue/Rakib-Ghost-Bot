const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

function extractVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

const QUALITIES = ["maxresdefault", "hqdefault", "mqdefault", "sddefault", "default"];

module.exports = {
  config: {
    name: "ytthumb",
    aliases: ["thumbnail", "ythumb", "ytcover"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Download YouTube video thumbnail" },
    longDescription: { en: "Get the full-quality thumbnail of any YouTube video. Supports youtu.be and youtube.com links." },
    category: "utility",
    guide: {
      en: "{p}ytthumb <youtube url or video id>\n\nExamples:\n{p}ytthumb https://youtu.be/dQw4w9WgXcQ\n{p}ytthumb dQw4w9WgXcQ\n{p}ytthumb https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    }
  },

  onStart: async function ({ message, args, event, api }) {
    if (!args[0]) {
      return message.reply(
        `╔══════════════════════╗\n` +
        `║  🖼️ YouTube Thumbnail  ║\n` +
        `╚══════════════════════╝\n\n` +
        `📌 ব্যবহার:\n` +
        `  .ytthumb <YouTube link>\n` +
        `  .ytthumb <video ID>\n\n` +
        `📌 Examples:\n` +
        `  .ytthumb https://youtu.be/dQw4w9WgXcQ\n` +
        `  .ytthumb dQw4w9WgXcQ`
      );
    }

    const input = args[0].trim();
    const videoId = extractVideoId(input);

    if (!videoId) return message.reply("❌ Valid YouTube URL বা Video ID দাও!");

    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    const cacheDir = path.join(__dirname, "cache");
    await fs.ensureDir(cacheDir);
    const imgPath = path.join(cacheDir, `ytthumb_${videoId}_${Date.now()}.jpg`);

    let downloaded = false;
    let usedQuality = "";

    for (const q of QUALITIES) {
      try {
        const url = `https://img.youtube.com/vi/${videoId}/${q}.jpg`;
        const res = await axios.get(url, { responseType: "arraybuffer", timeout: 10000 });
        if (res.data?.byteLength > 2000) {
          await fs.writeFile(imgPath, res.data);
          usedQuality = q;
          downloaded = true;
          break;
        }
      } catch (e) {}
    }

    if (!downloaded) {
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      return message.reply("❌ Thumbnail পাওয়া যায়নি। Video ID সঠিক কিনা দেখো!");
    }

    // Try to get video title from oEmbed
    let title = "Unknown";
    try {
      const oembed = await axios.get(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
        { timeout: 8000 }
      );
      title = oembed.data?.title || "Unknown";
    } catch (e) {}

    api.setMessageReaction("✅", event.messageID, () => {}, true);
    await message.reply({
      body:
        `╔══════════════════════╗\n` +
        `║  ✅ Thumbnail Ready!   ║\n` +
        `╚══════════════════════╝\n` +
        `  ✦ Video   › ${title.substring(0, 50)}${title.length > 50 ? "..." : ""}\n` +
        `  ✦ Quality › ${usedQuality}\n` +
        `  ✦ ID      › ${videoId}\n` +
        `  ✦ URL     › https://youtu.be/${videoId}`,
      attachment: fs.createReadStream(imgPath)
    });

    setTimeout(() => { try { fs.unlinkSync(imgPath); } catch {} }, 20000);
  }
};
