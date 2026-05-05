const { createCanvas, loadImage } = require("canvas");
const GIFEncoder = require("gifencoder");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const W = 500, H = 250;
const CACHE = path.join(__dirname, "cache");

// দারুণ একটি সাইবার অ্যানিমে ক্যারেক্টার ব্যাকগ্রাউন্ড (এটি স্ট্যাটিক হলেও আমরা কোড দিয়ে একে অ্যানিমেট বা গ্লো করাবো)
const ANIME_BG = "https://i.postimg.cc/85z1yZzF/cyberpunk-anime-avatar.jpg";
const FALLBACK_AVATAR = "https://i.ibb.co/v4m0f5V/neon-anime-boy.jpg";

module.exports = {
  config: {
    name: "animecard",
    aliases: ["acard", "anicard2"],
    version: "1.1",
    author: "Rakib Islam",
    countDown: 10,
    role: 0,
    shortDescription: "Premium Animated Anime Cyber Card",
    category: "canvas"
  },

  onStart: async function ({ api, event, message }) {
    await fs.ensureDir(CACHE);
    await message.reaction("⏳", event.messageID);

    const outPath = path.join(CACHE, `anime_glitch_${Date.now()}.gif`);
    
    // ইউজার ও অ্যাভাটার ডিটেইলস ফেচ করা
    let name = "GHOST USER";
    let thumbUrl = FALLBACK_AVATAR;
    try {
      const info = await api.getUserInfo(event.senderID);
      name = info[event.senderID].name;
      thumbUrl = info[event.senderID].thumbSrc;
    } catch {}

    // ইমেজগুলো লোড করা
    let avatarImg, animeBgImg;
    try {
      const avatarRes = await axios.get(thumbUrl, { responseType: "arraybuffer" });
      avatarImg = await loadImage(Buffer.from(avatarRes.data));
    } catch {
      avatarImg = await loadImage(FALLBACK_AVATAR);
    }

    try {
      animeBgImg = await loadImage(ANIME_BG);
    } catch {
      animeBgImg = await loadImage(FALLBACK_AVATAR);
    }

    // GIF এনকোডার সেটআপ
    const encoder = new GIFEncoder(W, H);
    encoder.createReadStream().pipe(fs.createWriteStream(outPath));
    encoder.start();
    encoder.setRepeat(0);   // ইনফিনিট লুপ
    encoder.setDelay(90);    // ফ্রেমের স্পিড (৯০ মিলি-সেকেন্ড)
    encoder.setQuality(10);  // সাইজ ও কোয়ালিটি ব্যালেন্সের জন্য ১০ রাখা হয়েছে

    const canvas = createCanvas(W, H);
    const ctx = canvas.getContext("2d");

    // ১৫ ফ্রেমের চমৎকার অ্যানিমেশন লুপ তৈরি
    for (let frame = 0; frame < 15; frame++) {
      ctx.clearRect(0, 0, W, H);
      
      // ১. অ্যানিমে ব্যাকগ্রাউন্ড ড্র করা (হালকা কাঁপানো বা জুম ইফেক্ট সহ)
      const zoom = Math.sin(frame * 0.4) * 5;
      ctx.drawImage(animeBgImg, -zoom, -zoom, W + (zoom * 2), H + (zoom * 2));
      
      // ২. ডার্ক ভাইব দেওয়ার জন্য ওভারলে
      ctx.fillStyle = "rgba(10, 10, 15, 0.65)";
      ctx.fillRect(0, 0, W, H);

      // ৩. সাইবার নিয়ন ফ্রেম (যা ফ্রেমের সাথে সাথে কালার চেঞ্জ ও গ্লো করবে)
      const glowRange = 10 + Math.sin(frame * 0.5) * 6;
      ctx.strokeStyle = frame % 3 === 0 ? "#00ffff" : frame % 3 === 1 ? "#ff00ff" : "#39ff14";
      ctx.lineWidth = 4;
      ctx.shadowColor = ctx.strokeStyle;
      ctx.shadowBlur = glowRange;
      ctx.strokeRect(15, 15, W - 30, H - 30);
      ctx.shadowBlur = 0; // শ্যাডো রিসেট

      // ৪. বামপাশে গোল করে ইউজারের অ্যাভাটার ড্র করা
      const cx = 95, cy = H / 2, r = 55;
      
      // অ্যাভাটারের পেছনে সাইবার রিং গ্লো
      ctx.strokeStyle = "#39ff14"; // নিয়ন গ্রিন
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, r + 5, 0, Math.PI * 2);
      ctx.stroke();

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(avatarImg, cx - r, cy - r, r * 2, r * 2);
      ctx.restore();

      // ৫. ক্যারেক্টার ও টেক্সট গ্লিচ ইফেক্ট (ডানপাশে)
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";

      // গ্লিচের সময় লেখা সামান্য ডানে-বামে কাঁপবে
      const glitchX = frame % 4 === 0 ? (Math.random() - 0.5) * 8 : 0;
      
      // নিয়ন সায়ান গ্লিচ শ্যাডো
      ctx.font = "bold 28px Arial";
      ctx.fillStyle = "rgba(0, 255, 255, 0.7)";
      ctx.fillText(name.toUpperCase(), 180 + glitchX - 3, H / 2 - 25);

      // মেইন হোয়াইট টেক্সট
      ctx.fillStyle = "#ffffff";
      ctx.fillText(name.toUpperCase(), 180 + glitchX, H / 2 - 25);

      // স্ট্যাটাস ও সিস্টেম ইনফো
      ctx.font = "13px Courier New";
      ctx.fillStyle = "#ff00ff"; // ম্যাজেন্টা
      ctx.fillText(`⚡ CONNECTIVITY : STABLE`, 180, H / 2 + 15);

      ctx.fillStyle = "#39ff14"; // গ্রিন নিয়ন
      ctx.fillText(`🛡️ PROTOCOL : GHOST-NET V2`, 180, H / 2 + 35);

      // নিচে ডাইনামিক হেক্স কোড বা ফ্রেম আইডি চেঞ্জ হওয়া
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.font = "11px monospace";
      ctx.fillText(`SYS_LOAD_ID: 0x${(frame * 64).toString(16).toUpperCase()}`, 180, H / 2 + 55);

      // ফ্রেমে নিয়ন লাইন স্ক্যান ইফেক্ট (যা উপর থেকে নিচে নামবে)
      const scanY = (frame * (H / 15)) % H;
      ctx.fillStyle = "rgba(0, 255, 255, 0.08)";
      ctx.fillRect(15, scanY, W - 30, 4);

      encoder.addFrame(ctx);
    }

    encoder.finish();

    // জিআইএফ সেন্ড করা এবং ক্যাশ ডিলিট করা
    return message.reply({
      body: `👻 **GHOST-NET EXCLUSIVE CYBER CARD:**`,
      attachment: fs.createReadStream(outPath)
    }, () => {
      try { fs.unlinkSync(outPath); } catch {}
    });
  }
};
