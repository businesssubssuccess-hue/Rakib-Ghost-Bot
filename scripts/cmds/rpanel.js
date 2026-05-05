const { createCanvas, loadImage } = require("canvas");
const GIFEncoder = require("gifencoder");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const W = 500, H = 250;
const CACHE = path.join(__dirname, "cache");
const FALLBACK = "https://i.postimg.cc/85z1yZzF/cyberpunk-anime-avatar.jpg";

module.exports = {
  config: {
    name: "cyberglitch",
    aliases: ["rakibpanel", "rpanel"],
    version: "2.0",
    author: "Rakib Islam",
    countDown: 8,
    role: 0,
    shortDescription: "Dynamic Glitch Animated Avatar Card",
    category: "canvas"
  },

  onStart: async function ({ api, event, message }) {
    await fs.ensureDir(CACHE);
    await message.reaction("⏳", event.messageID);

    const outPath = path.join(CACHE, `glitch_${Date.now()}.gif`);
    
    // User configuration & avatar fetch using fca-unofficial
    let name = "GHOST USER";
    let thumbUrl = FALLBACK;
    try {
      const info = await api.getUserInfo(event.senderID);
      name = info[event.senderID].name;
      thumbUrl = info[event.senderID].thumbSrc;
    } catch {}

    // Load User Avatar
    let avatarImg;
    try {
      const avatarRes = await axios.get(thumbUrl, { responseType: "arraybuffer" });
      avatarImg = await loadImage(Buffer.from(avatarRes.data));
    } catch {
      avatarImg = await loadImage(FALLBACK);
    }

    // GIF Setup
    const encoder = new GIFEncoder(W, H);
    encoder.createReadStream().pipe(fs.createWriteStream(outPath));
    encoder.start();
    encoder.setRepeat(0);   // Loop forever
    encoder.setDelay(80);   // Animation speed (80ms per frame)
    encoder.setQuality(10); // Standard quality to balance size

    const canvas = createCanvas(W, H);
    const ctx = canvas.getContext("2d");

    // Generating 12 unique frames for the realistic shaking glitch loop
    for (let frame = 0; frame < 12; frame++) {
      ctx.clearRect(0, 0, W, H);

      // --- Background Shaking Glitch ---
      // Random glitchy background colors mimicking the gif
      ctx.fillStyle = "#0c0d14";
      ctx.fillRect(0, 0, W, H);

      if (frame % 4 === 0) {
        // Random green/magenta horizontal glitch line in BG
        ctx.fillStyle = "rgba(0, 255, 255, 0.15)";
        ctx.fillRect(0, Math.random() * H, W, Math.random() * 20);
        ctx.fillStyle = "rgba(255, 0, 255, 0.15)";
        ctx.fillRect(0, Math.random() * H, W, Math.random() * 15);
      }

      // --- Main Border with Neon Glow ---
      const borderPulse = Math.sin(frame * 0.6) * 4;
      ctx.strokeStyle = frame % 3 === 0 ? "#00ffff" : "#ff00ff";
      ctx.lineWidth = 4;
      ctx.shadowColor = ctx.strokeStyle;
      ctx.shadowBlur = 12 + borderPulse;
      ctx.strokeRect(15, 15, W - 30, H - 30);
      ctx.shadowBlur = 0; // Reset Shadow Glow

      // --- Dynamic Shaking Avatar (UID-based) ---
      // Glitch shaking translation for the avatar itself
      let avX = 95;
      let avY = H / 2;
      const avR = 55;

      if (frame % 3 === 0) {
        avX += (Math.random() - 0.5) * 6;
        avY += (Math.random() - 0.5) * 4;
      }

      // Avatar Ring Glow (Flashing neon cyan)
      ctx.strokeStyle = frame % 2 === 0 ? "#ff00ff" : "#00ffff";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(avX, avY, avR + 5, 0, Math.PI * 2);
      ctx.stroke();

      // Draw Avatar Circular
      ctx.save();
      ctx.beginPath();
      ctx.arc(avX, avY, avR, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(avatarImg, avX - avR, avY - avR, avR * 2, avR * 2);
      ctx.restore();

      // --- Glitching Text & Metrics Section (Right Side) ---
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";

      const textShakeX = frame % 2 === 0 ? (Math.random() - 0.5) * 5 : 0;

      // Cyan Ghost Text Shadow
      ctx.font = "bold 28px sans-serif";
      ctx.fillStyle = "rgba(0, 255, 255, 0.6)";
      ctx.fillText(name.toUpperCase(), 180 + textShakeX - 2, H / 2 - 25);

      // Magenta Ghost Text Shadow
      ctx.fillStyle = "rgba(255, 0, 255, 0.6)";
      ctx.fillText(name.toUpperCase(), 180 + textShakeX + 2, H / 2 - 25);

      // Core White Text
      ctx.fillStyle = "#ffffff";
      ctx.fillText(name.toUpperCase(), 180 + textShakeX, H / 2 - 25);

      // Systems Log Text
      ctx.font = "13px Courier New";
      ctx.fillStyle = frame % 2 === 0 ? "#00ffff" : "#ff00ff";
      ctx.fillText(`► SYSTEM LOG: OPERATIONAL`, 180, H / 2 + 15);

      ctx.fillStyle = "#ffffff";
      ctx.fillText(`► USER_UID  : ${event.senderID}`, 180, H / 2 + 35);

      // Dynamic Frame Data changer
      ctx.font = "11px monospace";
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.fillText(`HEX_CHUNK: 0x${(frame * 128).toString(16).toUpperCase()}`, 180, H / 2 + 55);

      // --- Laser Scan Line Overlay ---
      // A bright thin line that moves downwards in every frame
      const scanY = 15 + ((frame * 18) % (H - 30));
      ctx.fillStyle = "rgba(0, 255, 255, 0.3)";
      ctx.fillRect(15, scanY, W - 30, 2);

      // Add Frame to compile
      encoder.addFrame(ctx);
    }

    encoder.finish();

    // Send and unlink cache
    return message.reply({
      body: `⚡ **GHOST-NET AUTOMATED LIVE PORTRAIT:**`,
      attachment: fs.createReadStream(outPath)
    }, () => {
      try { fs.unlinkSync(outPath); } catch {}
    });
  }
};
