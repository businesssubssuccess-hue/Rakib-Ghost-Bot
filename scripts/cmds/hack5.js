const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "hack5",
    aliases: ["glitchhack"],
    version: "1.0",
    author: "Rakib",
    countDown: 5,
    role: 0,
    shortDescription: "Glitch RGB-split hack card",
    category: "prank",
    guide: { en: "{p}hack5 @mention | reply | <uid>" }
  },

  onStart: async function ({ event, message, args, api, usersData }) {
    let uid = event.senderID;
    if (event.type === "message_reply") uid = event.messageReply.senderID;
    else if (Object.keys(event.mentions || {}).length) uid = Object.keys(event.mentions)[0];
    else if (args[0] && /^\d+$/.test(args[0])) uid = args[0];

    await message.reaction("⏳", event.messageID);
    let name = "Target";
    try { name = (await api.getUserInfo(uid))[uid].name; } catch {}

    const W = 900, H = 500;
    const canvas = createCanvas(W, H);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, H);

    // Glitch scanlines
    for (let y = 0; y < H; y += 3) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.04})`;
      ctx.fillRect(0, y, W, 1);
    }

    // RGB-split avatar
    try {
      const _avUrl = await usersData.getAvatarUrl(uid).catch(() => null);
      const av = _avUrl ? await loadImage(_avUrl).catch(() => null) : null;
      const cx = 200, cy = H / 2, r = 130;
      // Red shift
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = 0.7;
      ctx.fillStyle = "#ff0040";
      ctx.save(); ctx.beginPath(); ctx.arc(cx - 6, cy, r, 0, Math.PI * 2); ctx.clip();
      ctx.drawImage(av, cx - 6 - r, cy - r, r * 2, r * 2); ctx.restore();
      // Cyan shift
      ctx.fillStyle = "#00ffff";
      ctx.save(); ctx.beginPath(); ctx.arc(cx + 6, cy, r, 0, Math.PI * 2); ctx.clip();
      ctx.drawImage(av, cx + 6 - r, cy - r, r * 2, r * 2); ctx.restore();
      // Center
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip();
      ctx.drawImage(av, cx - r, cy - r, r * 2, r * 2); ctx.restore();
      // Glow ring
      ctx.beginPath();
      ctx.arc(cx, cy, r + 5, 0, Math.PI * 2);
      ctx.strokeStyle = "#ff00ff";
      ctx.shadowColor = "#ff00ff"; ctx.shadowBlur = 30;
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.shadowBlur = 0;
    } catch {}

    // Glitch text title
    const tx = 420, ty = 130;
    ctx.font = "bold 48px Arial";
    ctx.textAlign = "left";
    ctx.fillStyle = "#ff0040"; ctx.fillText("HACKED", tx - 4, ty);
    ctx.fillStyle = "#00ffff"; ctx.fillText("HACKED", tx + 4, ty);
    ctx.fillStyle = "#fff"; ctx.shadowColor = "#fff"; ctx.shadowBlur = 15;
    ctx.fillText("HACKED", tx, ty);
    ctx.shadowBlur = 0;

    // Stats block
    const bx = 420, by = 170, bw = 440;
    ctx.fillStyle = "rgba(255,0,128,0.08)";
    ctx.fillRect(bx, by, bw, 240);
    ctx.strokeStyle = "#ff00aa"; ctx.lineWidth = 2;
    ctx.shadowColor = "#ff00aa"; ctx.shadowBlur = 15;
    ctx.strokeRect(bx, by, bw, 240);
    ctx.shadowBlur = 0;

    ctx.font = "18px monospace";
    ctx.fillStyle = "#fff";
    const lines = [
      `┌─ TARGET LOCKED ─┐`,
      ``,
      `▸ Name      : ${name}`,
      `▸ UID       : ${uid}`,
      `▸ Status    : 💀 OWNED`,
      `▸ Files     : ${rnd(1000, 9999)} stolen`,
      `▸ Photos    : ${rnd(50, 500)} extracted`,
      `▸ Encrypted : ████████ 100%`,
      `▸ Ghost Net : ✅ DEPLOYED`
    ];
    let yy = by + 30;
    for (const l of lines) { ctx.fillText(l, bx + 20, yy); yy += 24; }

    // Bottom signature
    ctx.font = "italic bold 20px Arial";
    ctx.fillStyle = "#00ffcc";
    ctx.shadowColor = "#00ffcc"; ctx.shadowBlur = 20;
    ctx.textAlign = "center";
    ctx.fillText("👻 GHOST NET EDITION — System Compromised 👻", W / 2, H - 25);

    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);
    const out = path.join(cacheDir, `hack5_${uid}.png`);
    fs.writeFileSync(out, canvas.toBuffer("image/png"));

    await message.reaction("✅", event.messageID);
    await message.reply({
      body: `💀 ${name} এর system compromised!\n👻 Ghost Net Edition activated.\n(Just a prank 😆)`,
      attachment: fs.createReadStream(out)
    });
    setTimeout(() => fs.unlinkSync(out), 5000);
  }
};
const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
