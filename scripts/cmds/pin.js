const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const CACHE = path.join(__dirname, "cache");

module.exports = {
  config: {
    name: "pin",
    aliases: ["pinterest", "pint"],
    version: "5.0",
    author: "Rakib Islam",
    countDown: 10,
    role: 0,
    shortDescription: { en: "Pinterest image search & video download" },
    longDescription: { en: "Search Pinterest images or download a Pinterest video/post by link." },
    category: "media",
    guide: { en: "{p}pin <search query> - <count>\n{p}pin <pinterest link>" }
  },

  onStart: async function ({ args, message }) {
    await fs.ensureDir(CACHE);
    const input = args.join(" ").trim();

    if (!input) {
      return message.reply(
        `╔══════════════════════╗\n` +
        `║  📌 Pinterest Search  ║\n` +
        `╚══════════════════════╝\n\n` +
        `  ✦ Search › .pin <query> - <count>\n` +
        `  ✦ Download › .pin <pinterest link>\n\n` +
        `  উদাহরণ:\n` +
        `  › .pin anime girl - 5\n` +
        `  › .pin nature - 3\n` +
        `  › .pin https://pinterest.com/pin/...`
      );
    }

    const isPinterestLink = /pinterest\.com|pin\.it/i.test(input);
    return isPinterestLink ? handleDownload(message, input) : handleSearch(message, input);
  }
};

async function handleSearch(message, input) {
  const dashIdx = input.lastIndexOf("-");
  let query = input, count = 5;

  if (dashIdx > 0) {
    const maybeCount = parseInt(input.substring(dashIdx + 1).trim());
    if (!isNaN(maybeCount)) {
      query = input.substring(0, dashIdx).trim();
      count = Math.min(maybeCount, 10);
    }
  }

  await message.reply(`🔍 "${query}" খুঁজছি Pinterest এ...`);

  let images = [];

  // API 1: pinterestapi.co.uk (reliable)
  try {
    const res = await axios.get(
      `https://api.pinterestapi.co.uk/board_feed/?url=https://www.pinterest.com/search/pins/?q=${encodeURIComponent(query)}`,
      { timeout: 15000, headers: { "User-Agent": "Mozilla/5.0" } }
    );
    const pins = res.data?.body || [];
    images.push(...pins.filter(p => p?.images?.orig?.url).map(p => p.images.orig.url));
  } catch (e) {}

  // API 2: Pinterest search via another endpoint
  if (images.length < count) {
    try {
      const res = await axios.get(
        `https://api.pinterestapi.co.uk/user/pins?url=https://www.pinterest.com/search/pins/?q=${encodeURIComponent(query)}&rs=typed`,
        { timeout: 15000, headers: { "User-Agent": "Mozilla/5.0" } }
      );
      const pins = res.data?.body || [];
      images.push(...pins.filter(p => p?.images?.orig?.url).map(p => p.images.orig.url));
    } catch (e) {}
  }

  // API 3: popcat.xyz pinterest
  if (images.length < count) {
    try {
      const res = await axios.get(
        `https://api.popcat.xyz/pinterest?q=${encodeURIComponent(query)}`,
        { timeout: 12000 }
      );
      const results = res.data?.results || res.data || [];
      if (Array.isArray(results)) {
        images.push(...results.map(i => i.media || i.url || i).filter(u => typeof u === "string" && u.startsWith("http")));
      }
    } catch (e) {}
  }

  // API 4: DuckDuckGo images as fallback (if Pinterest fails)
  if (images.length < count) {
    try {
      const res = await axios.get(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&client_id=AJuU-FPh2-vFjrQNXFTbIVNEMVmFJcYNZFoFOjU9kqM`,
        { timeout: 12000 }
      );
      const results = res.data?.results || [];
      images.push(...results.map(r => r.urls?.regular || r.urls?.full).filter(Boolean));
    } catch (e) {}
  }

  // API 5: Wallhaven image search fallback
  if (images.length < count) {
    try {
      const res = await axios.get(
        `https://wallhaven.cc/api/v1/search?q=${encodeURIComponent(query)}&sorting=random&purity=100`,
        { timeout: 12000 }
      );
      const data = res.data?.data || [];
      images.push(...data.map(w => w.path).filter(Boolean));
    } catch (e) {}
  }

  images = [...new Set(images)].slice(0, count);

  if (!images.length) {
    return message.reply(
      `❌ "${query}" এর কোনো ছবি পাওয়া যায়নি!\n` +
      `💡 অন্য keyword দিয়ে try করো`
    );
  }

  const attachments = [], tempPaths = [];

  for (let i = 0; i < images.length; i++) {
    try {
      const imgPath = path.join(CACHE, `pin_${Date.now()}_${i}.jpg`);
      const res = await axios({
        url: images[i], method: "GET", responseType: "arraybuffer",
        timeout: 15000, headers: { "User-Agent": "Mozilla/5.0" }
      });
      await fs.writeFile(imgPath, res.data);
      attachments.push(fs.createReadStream(imgPath));
      tempPaths.push(imgPath);
    } catch (e) {}
  }

  if (!attachments.length) {
    return message.reply("❌ ছবি download করা যায়নি। আবার চেষ্টা করো!");
  }

  await message.reply({
    body:
      `╔══════════════════════╗\n` +
      `║  📌 Pinterest Results ║\n` +
      `╚══════════════════════╝\n` +
      `  ✦ Query › ${query}\n` +
      `  ✦ Found › ${attachments.length} images`,
    attachment: attachments
  });

  setTimeout(() => { tempPaths.forEach(p => { try { fs.unlinkSync(p); } catch {} }); }, 20000);
}

async function handleDownload(message, url) {
  await message.reply("⏳ Pinterest link থেকে media download করছি...");

  let mediaUrl = null, title = "Pinterest Media", isVideo = false;

  // API 1: SaveFrom-style API
  try {
    const res = await axios.get(
      `https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`,
      { timeout: 20000 }
    );
    const d = res.data;
    mediaUrl = d.video?.noWatermark || d.video?.watermark || d.url || d.video_url;
    title = d.title || title;
    isVideo = true;
  } catch (e) {}

  // API 2: SnapSave style
  if (!mediaUrl) {
    try {
      const res = await axios.get(
        `https://saveig.app/api?url=${encodeURIComponent(url)}`,
        { timeout: 20000 }
      );
      const d = res.data;
      mediaUrl = d?.data?.[0]?.url;
      isVideo = d?.type === "video";
    } catch (e) {}
  }

  // API 3: Generic downloader
  if (!mediaUrl) {
    try {
      const res = await axios.get(
        `https://api.lovegram.com/download?url=${encodeURIComponent(url)}`,
        { timeout: 20000 }
      );
      const d = res.data;
      mediaUrl = d?.url || d?.video_url || d?.high_quality;
    } catch (e) {}
  }

  if (!mediaUrl) {
    return message.reply(
      `❌ এই Pinterest link থেকে media পাওয়া যায়নি!\n\n` +
      `💡 Tips:\n` +
      `  › Public pin এর link দাও\n` +
      `  › pinterest.com/pin/... format এ link দাও\n` +
      `  › Image search এর জন্য: .pin <query> - <count>`
    );
  }

  try {
    const ext = isVideo ? "mp4" : "jpg";
    const filePath = path.join(CACHE, `pin_dl_${Date.now()}.${ext}`);
    const res = await axios({ url: mediaUrl, method: "GET", responseType: "arraybuffer", timeout: 30000 });
    await fs.writeFile(filePath, res.data);

    await message.reply({
      body:
        `╔══════════════════════╗\n` +
        `║  📌 Pinterest Download║\n` +
        `╚══════════════════════╝\n` +
        `  ✦ ${isVideo ? "Video" : "Image"} › Downloaded ✅\n` +
        `  ✦ Title › ${title}`,
      attachment: fs.createReadStream(filePath)
    });

    setTimeout(() => { try { fs.unlinkSync(filePath); } catch {} }, 20000);
  } catch (e) {
    return message.reply("❌ File send করতে সমস্যা। File too large হতে পারে।");
  }
}
