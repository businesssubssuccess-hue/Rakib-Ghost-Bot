const axios = require("axios");
const path = require("path");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "animewallpaper",
    aliases: ["aniwall"],
    version: "3.0",
    author: "Rakib Islam",
    role: 0,
    countDown: 10,
    shortDescription: { en: "Anime wallpaper search" },
    longDescription: { en: "Search anime wallpapers from multiple sources. Reliable multi-API approach." },
    category: "image",
    guide: { en: "{pn} <title> - <count>\nExample: {pn} Naruto - 5" }
  },

  onStart: async function ({ api, event, args, message }) {
    if (!args[0]) {
      return message.reply(
        `╔══════════════════════╗\n` +
        `║  🎌 Anime Wallpaper   ║\n` +
        `╚══════════════════════╝\n\n` +
        `  ✦ Usage › .aniwall <anime> - <count>\n` +
        `  ✦ Example › .aniwall Naruto - 5\n` +
        `  ✦ Example › .aniwall One Piece - 3\n` +
        `  ✦ Max count › 10`
      );
    }

    let input = args.join(" ");
    let count = 5;
    if (input.includes("-")) {
      const parts = input.split("-");
      input = parts[0].trim();
      count = Math.min(parseInt(parts[parts.length - 1].trim()) || 5, 10);
    }

    await message.reply(`🔍 "${input}" এর wallpaper খুঁজছি...`);

    const cacheDir = path.join(__dirname, "cache");
    await fs.ensureDir(cacheDir);

    let imageUrls = [];

    // API 1: Wallhaven (best for anime wallpapers)
    if (imageUrls.length < count) {
      try {
        const res = await axios.get(
          `https://wallhaven.cc/api/v1/search?q=${encodeURIComponent(input)}&categories=010&purity=100&sorting=random&atleast=1280x720&ratios=16x9,16x10`,
          { timeout: 15000 }
        );
        const data = res.data?.data || [];
        const urls = data.map(w => w.path).filter(Boolean);
        imageUrls.push(...urls);
      } catch (e) {}
    }

    // API 2: Jikan + MyAnimeList images
    if (imageUrls.length < count) {
      try {
        const res = await axios.get(
          `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(input)}&limit=5`,
          { timeout: 10000 }
        );
        const animeList = res.data?.data || [];
        for (const anime of animeList) {
          if (anime.images?.jpg?.large_image_url) imageUrls.push(anime.images.jpg.large_image_url);
          if (anime.images?.jpg?.image_url) imageUrls.push(anime.images.jpg.image_url);
        }
      } catch (e) {}
    }

    // API 3: AniSearch images  
    if (imageUrls.length < count) {
      try {
        const res = await axios.get(
          `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(input)}&limit=10&order_by=popularity`,
          { timeout: 10000 }
        );
        const pics = res.data?.data || [];
        for (const p of pics) {
          if (p.trailer?.images?.maximum_image_url) imageUrls.push(p.trailer.images.maximum_image_url);
        }
      } catch (e) {}
    }

    // API 4: Nekos.best (character images)
    if (imageUrls.length < count) {
      try {
        const categories = ["neko", "waifu", "shinobu", "megumin", "cuddle", "hug", "kiss", "smile", "wave"];
        const cat = categories[Math.floor(Math.random() * categories.length)];
        const res = await axios.get(
          `https://nekos.best/api/v2/${cat}?amount=${count}`,
          { timeout: 10000 }
        );
        const results = res.data?.results || [];
        imageUrls.push(...results.map(r => r.url).filter(Boolean));
      } catch (e) {}
    }

    // API 5: Waifu.im
    if (imageUrls.length < count) {
      try {
        const tags = ["waifu", "maid", "marin-kitagawa", "mori-calliope", "raiden-shogun", "oppai", "selfies", "uniform"];
        const tag = tags[Math.floor(Math.random() * tags.length)];
        for (let i = 0; i < Math.min(3, count); i++) {
          const res = await axios.get(
            `https://api.waifu.im/search?included_tags=${tag}&is_nsfw=false`,
            { timeout: 10000 }
          );
          const imgs = res.data?.images || [];
          imageUrls.push(...imgs.map(img => img.url).filter(Boolean));
        }
      } catch (e) {}
    }

    imageUrls = [...new Set(imageUrls)].slice(0, count);

    if (!imageUrls.length) {
      return message.reply(
        `❌ "${input}" এর কোনো wallpaper পাওয়া যায়নি!\n` +
        `💡 অন্য anime এর নাম দিয়ে try করো\n` +
        `   যেমন: Naruto, One Piece, Attack on Titan`
      );
    }

    const attachments = [];
    const tempPaths = [];

    for (let i = 0; i < imageUrls.length; i++) {
      try {
        const imgPath = path.join(cacheDir, `aniwall_${Date.now()}_${i}.jpg`);
        const res = await axios.get(imageUrls[i], {
          responseType: "arraybuffer",
          timeout: 15000,
          headers: { "User-Agent": "Mozilla/5.0 (compatible; Bot/1.0)" }
        });
        await fs.writeFile(imgPath, res.data);
        attachments.push(fs.createReadStream(imgPath));
        tempPaths.push(imgPath);
      } catch (e) {}
    }

    if (!attachments.length) {
      return message.reply(
        `❌ Image download করা যায়নি!\n` +
        `💡 আবার try করো — API সাময়িক সমস্যায় থাকতে পারে`
      );
    }

    await message.reply({
      body:
        `╔══════════════════════╗\n` +
        `║  🎌 Anime Wallpaper   ║\n` +
        `╚══════════════════════╝\n` +
        `  ✦ Anime  › ${input}\n` +
        `  ✦ Found  › ${attachments.length} wallpaper`,
      attachment: attachments
    });

    setTimeout(() => {
      tempPaths.forEach(p => { try { fs.unlinkSync(p); } catch {} });
    }, 20000);
  }
};
