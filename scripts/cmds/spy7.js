const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "spy7",
    aliases: ["holoid", "ghostid"],
    version: "1.0",
    author: "Rakib",
    countDown: 5,
    role: 0,
    shortDescription: "Holographic Ghost Net ID card",
    category: "info",
    guide: { en: "{p}spy7 @mention | reply | <uid>" }
  },

  onStart: async function ({ event, message, args, api, usersData }) {
    const uid = await resolveUID(event, args);
    await message.reaction("⏳", event.messageID);
    const info = (await api.getUserInfo(uid))[uid] || {};
    const u = await usersData.get(uid).catch(() => ({}));
    const name = info.name || u.name || "Unknown";

    const W = 800, H = 500;
    const canvas = createCanvas(W, H);
    const ctx = canvas.getContext("2d");

    // Holographic gradient background
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#1a0033"); bg.addColorStop(0.5, "#003355"); bg.addColorStop(1, "#330044");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    // Hexagonal mesh overlay
    ctx.strokeStyle = "rgba(0,255,255,0.08)"; ctx.lineWidth = 1;
    const r = 30;
    for (let y = 0; y < H + r; y += r * 1.5) {
      for (let x = 0; x < W + r; x += r * Math.sqrt(3)) {
        const ox = (Math.floor(y / (r * 1.5)) % 2) * (r * Math.sqrt(3) / 2);
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = Math.PI / 3 * i;
          const px = x + ox + r * Math.cos(a);
          const py = y + r * Math.sin(a);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath(); ctx.stroke();
      }
    }

    // Top header bar
    const hg = ctx.createLinearGradient(0, 0, W, 0);
    hg.addColorStop(0, "#ff00aa"); hg.addColorStop(0.5, "#00ffff"); hg.addColorStop(1, "#aaff00");
    ctx.fillStyle = hg; ctx.fillRect(0, 0, W, 6);
    ctx.fillStyle = "rgba(0,0,0,0.7)"; ctx.fillRect(0, 6, W, 60);
    ctx.fillStyle = "#00ffff"; ctx.shadowColor = "#00ffff"; ctx.shadowBlur = 25;
    ctx.font = "bold 30px Arial"; ctx.textAlign = "center";
    ctx.fillText("👻 GHOST NET ▸ HOLO-ID 👻", W / 2, 45);
    ctx.shadowBlur = 0;

    // Avatar with hexagonal hologram glow
    try {
      const _avUrl = await usersData.getAvatarUrl(uid).catch(() => null);
      const av = _avUrl ? await loadImage(_avUrl).catch(() => null) : null;
      const cx = 180, cy = 280, rad = 110;
      // Triple holo ring
      ["#ff00aa", "#00ffff", "#aaff00"].forEach((c, i) => {
        ctx.beginPath();
        for (let j = 0; j < 6; j++) {
          const a = Math.PI / 3 * j - Math.PI / 6;
          const x = cx + (rad + 8 + i * 6) * Math.cos(a);
          const y = cy + (rad + 8 + i * 6) * Math.sin(a);
          if (j === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = c; ctx.lineWidth = 3;
        ctx.shadowColor = c; ctx.shadowBlur = 25;
        ctx.stroke();
      });
      ctx.shadowBlur = 0;
      // Clip avatar
      ctx.save();
      ctx.beginPath();
      for (let j = 0; j < 6; j++) {
        const a = Math.PI / 3 * j - Math.PI / 6;
        const x = cx + rad * Math.cos(a);
        const y = cy + rad * Math.sin(a);
        if (j === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath(); ctx.clip();
      ctx.drawImage(av, cx - rad, cy - rad, rad * 2, rad * 2);
      ctx.restore();
    } catch {}

    // Right side data card
    const px = 340, py = 100;
    ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.fillRect(px, py, 420, 320);
    ctx.strokeStyle = "#00ffff"; ctx.lineWidth = 2;
    ctx.shadowColor = "#00ffff"; ctx.shadowBlur = 15;
    ctx.strokeRect(px, py, 420, 320);
    ctx.shadowBlur = 0;

    ctx.font = "bold 20px Arial"; ctx.fillStyle = "#aaff00"; ctx.textAlign = "left";
    ctx.shadowColor = "#aaff00"; ctx.shadowBlur = 12;
    ctx.fillText("◤ AGENT FILE ◢", px + 15, py + 28);
    ctx.shadowBlur = 0;

    const data = [
      ["NAME", name, "#00ffff"],
      ["UID", uid, "#ff00aa"],
      ["GENDER", info.gender === 1 ? "♀ Female" : info.gender === 2 ? "♂ Male" : "—", "#aaff00"],
      ["VANITY", info.vanity || "—", "#00ffff"],
      ["MONEY", `$${(u.money || 0).toLocaleString()}`, "#ffd700"],
      ["EXP", String(u.exp || 0), "#ff00aa"],
      ["STATUS", info.isFriend ? "ALLIED" : "UNKNOWN", "#aaff00"],
      ["CLEAR", "LEVEL " + rnd(1, 10), "#00ffff"]
    ];
    let y = py + 60;
    for (const [k, v, c] of data) {
      ctx.font = "12px monospace"; ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.fillText(k, px + 15, y);
      ctx.font = "bold 18px monospace"; ctx.fillStyle = c;
      ctx.shadowColor = c; ctx.shadowBlur = 10;
      ctx.fillText(String(v).slice(0, 30), px + 15, y + 22);
      ctx.shadowBlur = 0;
      y += 38;
    }

    // Bottom barcode
    const by = H - 60;
    ctx.fillStyle = "#000"; ctx.fillRect(40, by - 5, W - 80, 35);
    for (let i = 0; i < 100; i++) {
      const w = 2 + Math.floor(Math.random() * 4);
      const x = 50 + i * 7;
      if (x > W - 50) break;
      ctx.fillStyle = "#fff"; ctx.fillRect(x, by, w, 25);
    }
    ctx.fillStyle = "#00ffff"; ctx.font = "10px monospace"; ctx.textAlign = "center";
    ctx.shadowColor = "#00ffff"; ctx.shadowBlur = 10;
    ctx.fillText(`GN-${uid}-HOLO-AUTH`, W / 2, H - 12);

    const out = saveOut(__dirname, `spy7_${uid}.png`, canvas);
    await message.reaction("✅", event.messageID);
    await message.reply({ body: `🪪 Holo-ID: ${name}`, attachment: fs.createReadStream(out) });
    setTimeout(() => fs.existsSync(out) && fs.unlinkSync(out), 5000);
  }
};

async function resolveUID(event, args) {
  if (event.type === "message_reply") return event.messageReply.senderID;
  if (Object.keys(event.mentions || {}).length) return Object.keys(event.mentions)[0];
  if (args[0] && /^\d+$/.test(args[0])) return args[0];
  return event.senderID;
}
function rnd(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
function saveOut(dir, name, canvas) {
  const c = path.join(dir, "cache");
  if (!fs.existsSync(c)) fs.mkdirSync(c);
  const out = path.join(c, name);
  fs.writeFileSync(out, canvas.toBuffer("image/png"));
  return out;
}
