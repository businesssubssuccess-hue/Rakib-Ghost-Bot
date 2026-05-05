const { createCanvas, loadImage } = require("canvas");
const GIFEncoder = require("gifencoder");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const os = require("os");

const W = 500, H = 250;
const CACHE = path.join(__dirname, "cache");
const FALLBACK = "https://i.postimg.cc/85z1yZzF/cyberpunk-anime-avatar.jpg";

// Helper: Format Bot Uptime
function getBotUptime() {
  const uptime = process.uptime();
  const hrs = Math.floor(uptime / 3600);
  const mins = Math.floor((uptime % 3600) / 60);
  const secs = Math.floor(uptime % 60);
  return `${hrs}h ${mins}m ${secs}s`;
}

module.exports = {
  config: {
    name: "cpanel",
    aliases: ["cp", "botpanel", "cpanel"],
    version: "2.5",
    author: "Rakib Islam",
    countDown: 8,
    role: 0,
    shortDescription: "Interactive Cyber Pulse Card with Live Bot Stats",
    category: "canvas"
  },

  onStart: async function ({ api, event, message }) {
    await fs.ensureDir(CACHE);
    await message.reaction("⏳", event.messageID);

    const startTime = Date.now();
    const outPath = path.join(CACHE, `pulse_${Date.now()}.gif`);
    
    // User Configurations
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

    // Real-time Static Performance Logs
    const ping = Date.now() - startTime;
    const freeRam = (os.freemem() / 1024 / 1024 / 1024).toFixed(1);
    const totalRam = (os.totalmem() / 1024 / 1024 / 1024).toFixed(1);
    const usedRam = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1);
    const botUptime = getBotUptime();

    // GIF Setup
    const encoder = new GIFEncoder(W, H);
    encoder.createReadStream().pipe(fs.createWriteStream(outPath));
    encoder.start();
    encoder.setRepeat(0);   // Loop Forever
    encoder.setDelay(75);   // Fast rendering speed (75ms per frame)
    encoder.setQuality(10); 

    const canvas = createCanvas(W, H);
    const ctx = canvas.getContext("2d");

    // Generate 15 unique loop-frames for the fluid pulse animation
    for (let frame = 0; frame < 15; frame++) {
      ctx.clearRect(0, 0, W, H);

      // --- 1. Neon Dark Cyber Grid Background ---
      ctx.fillStyle = "#0a0a0f";
      ctx.fillRect(0, 0, W, H);

      // Draw subtle grid lines (Horizontal & Vertical)
      ctx.strokeStyle = "rgba(0, 240, 255, 0.05)";
      ctx.lineWidth = 1;
      for (let i = 0; i < W; i += 25) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, H);
        ctx.stroke();
      }
      for (let i = 0; i < H; i += 25) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(W, i);
        ctx.stroke();
      }

      // --- 2. Dual Neon Border with Glow ---
      const glowValue = 10 + Math.sin(frame * 0.5) * 5;
      ctx.strokeStyle = frame % 2 === 0 ? "#ff00ff" : "#00f0ff";
      ctx.lineWidth = 3;
      ctx.shadowColor = ctx.strokeStyle;
      ctx.shadowBlur = glowValue;
      ctx.strokeRect(15, 15, W - 30, H - 30);
      ctx.shadowBlur = 0; // Reset Shadow

      // --- 3. Horizontal Avatar Glitch Cut ---
      const avX = 95;
      const avY = H / 2;
      const avR = 55;

      // Draw Main Avatar Circle
      ctx.save();
      ctx.beginPath();
      ctx.arc(avX, avY, avR, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(avatarImg, avX - avR, avY - avR, avR * 2, avR * 2);
      ctx.restore();

      // Horizontal glitch slice/displace on the avatar (like 2nd GIF)
      if (frame % 3 === 0) {
        const sliceY = avY - avR + Math.random() * (avR * 2);
        const sliceHeight = 8 + Math.random() * 12;
        const displaceX = (Math.random() - 0.5) * 15;

        ctx.save();
        ctx.beginPath();
        ctx.rect(avX - avR, sliceY, avR * 2, sliceHeight);
        ctx.clip();
        ctx.drawImage(avatarImg, avX - avR + displaceX, avY - avR, avR * 2, avR * 2);
        ctx.restore();
      }

      // Neon outer ring
      ctx.strokeStyle = "#ff00ff";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(avX, avY, avR + 6, 0, Math.PI * 2);
      ctx.stroke();

      // --- 4. Live Equalizer / Pulse Bars ---
      const eqX = 180;
      const eqY = H / 2 + 55;
      ctx.fillStyle = "#00f0ff";
      
      for (let b = 0; b < 10; b++) {
        // Generates fluid moving pulse bars based on frames
        const barHeight = 8 + Math.abs(Math.sin((frame + b) * 0.6)) * 25;
        ctx.fillRect(eqX + (b * 12), eqY - barHeight, 8, barHeight);
      }

      // --- 5. Glitch Text Overlay ---
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";

      const textGlitch = frame % 4 === 0 ? (Math.random() - 0.5) * 4 : 0;

      ctx.font = "bold 26px sans-serif";
      ctx.fillStyle = "rgba(255, 0, 255, 0.7)";
      ctx.fillText(name.toUpperCase(), 180 + textGlitch - 2, H / 2 - 45);

      ctx.fillStyle = "#ffffff";
      ctx.fillText(name.toUpperCase(), 180 + textGlitch, H / 2 - 45);

      // --- 6. Live Bot Engine Performance Statistics ---
      ctx.font = "11px Courier New";

      // Live Ping & System Status
      ctx.fillStyle = "#39ff14"; // Lime green
      ctx.fillText(`● SPEED (PING) : ${ping} ms`, 180, H / 2 - 15);

      // Dynamic System RAM Allocation
      ctx.fillStyle = "#00f0ff"; // Aqua
      ctx.fillText(`● RAM ALLOC    : ${usedRam} MB / ${totalRam} GB`, 180, H / 2 + 5);

      // System Free Memory
      ctx.fillStyle = "#ff00ff"; // Violet
      ctx.fillText(`● NODE FREE    : ${freeRam} GB FREE`, 180, H / 2 + 25);

      // Live Uptime Counters
      ctx.fillStyle = "#ffffff";
      ctx.fillText(`● ACTIVE UP    : ${botUptime}`, 180, H / 2 + 45);

      // --- 7. Floating Neon Scan Particle ---
      const particleX = 15 + ((frame * 32) % (W - 30));
      ctx.fillStyle = "rgba(255, 0, 255, 0.4)";
      ctx.fillRect(particleX, 15, 3, H - 30);

      encoder.addFrame(ctx);
    }

    encoder.finish();

    // Reply with attachment and clean cache
    return message.reply({
      body: `✨ **GHOST-NET DYNAMIC PULSE SYS-LOG:**`,
      attachment: fs.createReadStream(outPath)
    }, () => {
      try { fs.unlinkSync(outPath); } catch {}
    });
  }
};
