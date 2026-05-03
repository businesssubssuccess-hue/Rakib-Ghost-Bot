// Real Photo → Anime Style Converter — Rakib Islam / Ghost Net Edition
// Uses AnimeGANv2 via HuggingFace Spaces (Free, no API key needed)
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const CACHE = path.join(__dirname, "cache");

// Free AnimeGANv2 Gradio Space endpoints (tried in order)
const HF_ENDPOINTS = [
  "https://akhaliq-animeganv2.hf.space/run/predict",
  "https://nateraw-animegan2-pytorch.hf.space/run/predict",
];

// Fallback: waifu2x style via another free API
const FALLBACK_API = "https://api.lolhuman.xyz/api/anime";

async function convertViaHuggingFace(imgBuffer) {
  const base64 = imgBuffer.toString("base64");
  const dataURL = `data:image/jpeg;base64,${base64}`;

  for (const endpoint of HF_ENDPOINTS) {
    try {
      const resp = await axios.post(
        endpoint,
        { data: [dataURL] },
        {
          timeout: 55000,
          headers: { "Content-Type": "application/json" }
        }
      );
      const result = resp.data?.data?.[0];
      if (!result) continue;

      // Result is either base64 data URL or a URL string
      if (typeof result === "string" && result.startsWith("data:image")) {
        const b64 = result.split(",")[1];
        return Buffer.from(b64, "base64");
      }
      if (typeof result === "string" && result.startsWith("http")) {
        const r2 = await axios.get(result, { responseType: "arraybuffer", timeout: 20000 });
        return Buffer.from(r2.data);
      }
      // HF sometimes returns {image: {url: ...}} or {url: ...}
      const url = result?.url || result?.image?.url;
      if (url) {
        const r2 = await axios.get(url, { responseType: "arraybuffer", timeout: 20000 });
        return Buffer.from(r2.data);
      }
    } catch (e) {
      continue; // try next endpoint
    }
  }
  throw new Error("All HuggingFace endpoints failed");
}

async function convertViaFallback(imgUrl) {
  // lolhuman free API — no key needed for basic tier
  const resp = await axios.get(
    `${FALLBACK_API}?image=${encodeURIComponent(imgUrl)}`,
    { responseType: "arraybuffer", timeout: 20000 }
  );
  return Buffer.from(resp.data);
}

module.exports = {
  config: {
    name: "anime2real",
    aliases: ["realanime", "anime2", "toanime", "animify", "animeconvert", "animeme"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 20,
    role: 0,
    shortDescription: { en: "Real photo → Anime style 🎌✨ (AnimeGANv2)" },
    longDescription: { en: "Converts any real photo into anime art style using AnimeGANv2 AI model. Free, no API key needed!" },
    category: "image",
    guide: {
      en: "📌 ব্যবহার:\n" +
          "  {p}anime2real @mention     → কারো profile pic anime করো\n" +
          "  {p}anime2real              → নিজের pic anime করো\n" +
          "  Reply to photo + {p}anime2real → সেই ছবি anime করো\n\n" +
          "⏳ Processing: 15-30 সেকেন্ড লাগতে পারে (AI model)"
    }
  },

  onStart: async function ({ api, event, message, usersData }) {
    await fs.ensureDir(CACHE);
    await message.reaction("⏳", event.messageID);

    let imgUrl = null;
    let imgBuffer = null;

    // Priority 1: Reply to a photo
    if (event.type === "message_reply") {
      const att = event.messageReply?.attachments?.[0];
      if (att?.type === "photo") imgUrl = att.url;
    }

    // Priority 2: Attached photo in current message
    if (!imgUrl && event.attachments?.length > 0) {
      const att = event.attachments[0];
      if (att?.type === "photo") imgUrl = att.url;
    }

    // Priority 3: @mention avatar OR sender avatar
    if (!imgUrl) {
      const uid = Object.keys(event.mentions || {})[0] || event.senderID;
      try { imgUrl = await usersData.getAvatarUrl(uid); } catch {}
    }

    if (!imgUrl) {
      await message.reaction("❌", event.messageID);
      return message.reply(
        "❌ ছবি খুঁজে পেলাম না!\n\n" +
        "📌 এভাবে use করো:\n" +
        "  ✦ .anime2real @mention\n" +
        "  ✦ কোনো ছবিতে reply দিয়ে .anime2real\n" +
        "  ✦ নিজের pic: .anime2real (no mention)"
      );
    }

    await message.reply("🎌 Anime style এ convert হচ্ছে...\n⏳ AI processing... 15-30 seconds লাগবে\n(AnimeGANv2 — Free HuggingFace API)");

    try {
      // Download the source image
      const srcResp = await axios.get(imgUrl, { responseType: "arraybuffer", timeout: 15000 });
      imgBuffer = Buffer.from(srcResp.data);

      let resultBuffer = null;

      // Try HuggingFace AnimeGANv2 first
      try {
        resultBuffer = await convertViaHuggingFace(imgBuffer);
      } catch (hfErr) {
        // Fallback to lolhuman API
        try {
          resultBuffer = await convertViaFallback(imgUrl);
        } catch (fbErr) {
          throw new Error("সব API ব্যর্থ হয়েছে। কিছুক্ষণ পরে try করো।");
        }
      }

      if (!resultBuffer || resultBuffer.length < 500) {
        throw new Error("Empty response from API");
      }

      const outPath = path.join(CACHE, `anime2real_${Date.now()}.png`);
      await fs.writeFile(outPath, resultBuffer);

      await message.reaction("✅", event.messageID);
      await message.reply({
        body:
          "╔═══════════════════════╗\n" +
          "║  🎌 Anime Convert Done!  ║\n" +
          "╚═══════════════════════╝\n" +
          "  ✦ Style   › AnimeGANv2\n" +
          "  ✦ Engine  › HuggingFace AI\n" +
          "  ✦ Result  › নিচে দেখো 👇\n\n" +
          "💡 আরো: .anime2real @name → ওর pic anime করো",
        attachment: fs.createReadStream(outPath)
      });

      setTimeout(() => { try { fs.unlinkSync(outPath); } catch {} }, 30000);
    } catch (err) {
      await message.reaction("❌", event.messageID);
      message.reply(
        "❌ Anime convert করতে পারিনি!\n\n" +
        "🔹 কারণ: " + (err.message?.slice(0, 100) || "Unknown error") + "\n\n" +
        "💡 Tips:\n" +
        "  ✦ ছবিটা clear আর face দেখা যাচ্ছে এমন দাও\n" +
        "  ✦ কিছুক্ষণ পরে আবার try করো (AI server busy)\n" +
        "  ✦ Profile pic এর বদলে সরাসরি ছবি attach করো"
      );
    }
  }
};
