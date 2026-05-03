const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "spy2",
    aliases: ["cyberspy"],
    version: "1.0",
    author: "Rakib",
    countDown: 5,
    role: 0,
    shortDescription: "Cyberpunk style spy card",
    category: "info",
    guide: { en: "{p}spy2 @mention | reply | <uid>" }
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

    // Cyberpunk grid
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#0a001a"); bg.addColorStop(1, "#000a1a");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "rgba(0,255,255,0.1)"; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 25) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 25) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    // Avatar (square with cyber border)
    try {
      const _avUrl = await usersData.getAvatarUrl(uid).catch(() => null);
      const av = _avUrl ? await loadImage(_avUrl).catch(() => null) : null;
      const ax = 40, ay = 90, as = 240;
      ctx.save(); ctx.beginPath(); ctx.rect(ax, ay, as, as); ctx.clip();
      ctx.drawImage(av, ax, ay, as, as); ctx.restore();
      ctx.strokeStyle = "#00ffff"; ctx.lineWidth = 4;
      ctx.shadowColor = "#00ffff"; ctx.shadowBlur = 25; ctx.strokeRect(ax, ay, as, as);
      ctx.shadowBlur = 0;
      // Pink corner brackets
      ctx.strokeStyle = "#ff00aa"; ctx.lineWidth = 6;
      ctx.shadowColor = "#ff00aa"; ctx.shadowBlur = 20;
      const cl = 30;
      ctx.beginPath(); ctx.moveTo(ax - 5, ay + cl); ctx.lineTo(ax - 5, ay - 5); ctx.lineTo(ax + cl, ay - 5); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ax + as + 5, ay + as - cl); ctx.lineTo(ax + as + 5, ay + as + 5); ctx.lineTo(ax + as - cl, ay + as + 5); ctx.stroke();
      ctx.shadowBlur = 0;
    } catch {}

    // Header
    ctx.font = "bold 36px Arial"; ctx.textAlign = "left";
    ctx.fillStyle = "#00ffff"; ctx.shadowColor = "#00ffff"; ctx.shadowBlur = 25;
    ctx.fillText("◣ CYBER PROFILE ◢", 320, 60);
    ctx.shadowBlur = 0;

    // Data block
    ctx.font = "20px monospace"; ctx.fillStyle = "#fff";
    const lines = [
      `┌─[ TARGET ]─`,
      `│ Name   : ${name}`,
      `│ UID    : ${uid}`,
      `│ Gender : ${info.gender === 1 ? "♀ Female" : info.gender === 2 ? "♂ Male" : "—"}`,
      `│ Vanity : ${info.vanity || "—"}`,
      `│ Money  : $${(u.money || 0).toLocaleString()}`,
      `│ EXP    : ${u.exp || 0}`,
      `│ Type   : ${info.type || "user"}`,
      `└────────────`
    ];
    let y = 120;
    for (const l of lines) {
      ctx.shadowColor = "#ff00aa"; ctx.shadowBlur = 8;
      ctx.fillText(l, 320, y); y += 30;
    }
    ctx.shadowBlur = 0;

    // Bottom strip
    ctx.fillStyle = "#ff00aa"; ctx.shadowColor = "#ff00aa"; ctx.shadowBlur = 20;
    ctx.fillRect(0, H - 50, W, 3); ctx.shadowBlur = 0;
    ctx.font = "bold 18px Arial"; ctx.textAlign = "center";
    ctx.fillStyle = "#00ffff"; ctx.shadowColor = "#00ffff"; ctx.shadowBlur = 15;
    ctx.fillText("👻 GHOST NET ▸ CYBER DIVISION 👻", W / 2, H - 18);

    const out = saveOut(__dirname, `spy2_${uid}.png`, canvas);
    await message.reaction("✅", event.messageID);
    await message.reply({ body: `🔍 Cyber profile of ${name}`, attachment: fs.createReadStream(out) });
    setTimeout(() => fs.existsSync(out) && fs.unlinkSync(out), 5000);
  }
};

async function resolveUID(event, args) {
  if (event.type === "message_reply") return event.messageReply.senderID;
  if (Object.keys(event.mentions || {}).length) return Object.keys(event.mentions)[0];
  if (args[0] && /^\d+$/.test(args[0])) return args[0];
  return event.senderID;
}
function saveOut(dir, name, canvas) {
  const c = path.join(dir, "cache");
  if (!fs.existsSync(c)) fs.mkdirSync(c);
  const out = path.join(c, name);
  fs.writeFileSync(out, canvas.toBuffer("image/png"));
  return out;
}
