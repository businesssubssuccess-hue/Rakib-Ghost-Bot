const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "spy3",
    aliases: ["polaroidspy"],
    version: "1.0",
    author: "Rakib",
    countDown: 5,
    role: 0,
    shortDescription: "Polaroid photo style spy card",
    category: "info",
    guide: { en: "{p}spy3 @mention | reply | <uid>" }
  },

  onStart: async function ({ event, message, args, api, usersData }) {
    const uid = await resolveUID(event, args);
    await message.reaction("⏳", event.messageID);
    const info = (await api.getUserInfo(uid))[uid] || {};
    const u = await usersData.get(uid).catch(() => ({}));
    const name = info.name || u.name || "Unknown";

    const W = 600, H = 800;
    const canvas = createCanvas(W, H);
    const ctx = canvas.getContext("2d");

    // Cork board background
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#3a2818"); bg.addColorStop(1, "#1a1008");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    // Dotted texture
    for (let i = 0; i < 200; i++) {
      ctx.fillStyle = `rgba(${rnd(80,160)},${rnd(60,120)},${rnd(40,80)},${Math.random() * 0.3})`;
      ctx.beginPath();
      ctx.arc(Math.random() * W, Math.random() * H, Math.random() * 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Polaroid card (slightly rotated)
    ctx.save();
    ctx.translate(W / 2, H / 2 - 30);
    ctx.rotate(-0.05);

    const pw = 460, ph = 560;
    ctx.shadowColor = "rgba(0,0,0,0.6)"; ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 15;
    ctx.fillStyle = "#f5f0e8";
    ctx.fillRect(-pw / 2, -ph / 2, pw, ph);
    ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;

    // Photo area
    const photoW = pw - 40, photoH = pw - 40;
    try {
      const _avUrl = await usersData.getAvatarUrl(uid).catch(() => null);
      const av = _avUrl ? await loadImage(_avUrl).catch(() => null) : null;
      ctx.drawImage(av, -photoW / 2, -ph / 2 + 20, photoW, photoH);
    } catch {}
    ctx.strokeStyle = "#000"; ctx.lineWidth = 1;
    ctx.strokeRect(-photoW / 2, -ph / 2 + 20, photoW, photoH);

    // "Handwritten" caption
    ctx.font = "bold 28px 'Comic Sans MS', cursive";
    ctx.textAlign = "center";
    ctx.fillStyle = "#1a1a1a";
    ctx.fillText(name.slice(0, 20), 0, ph / 2 - 80);
    ctx.font = "16px 'Comic Sans MS', cursive";
    ctx.fillStyle = "#444";
    ctx.fillText(`UID: ${uid}`, 0, ph / 2 - 55);
    ctx.fillText(`💰 $${(u.money || 0).toLocaleString()}  •  ⭐ ${u.exp || 0} XP`, 0, ph / 2 - 30);
    ctx.font = "italic 13px 'Comic Sans MS', cursive";
    ctx.fillStyle = "#a00"; ctx.fillText(`👻 Spied by Ghost Net`, 0, ph / 2 - 10);

    ctx.restore();

    // Push pin top center
    ctx.shadowColor = "rgba(0,0,0,0.5)"; ctx.shadowBlur = 8;
    ctx.fillStyle = "#cc0000";
    ctx.beginPath(); ctx.arc(W / 2, 80, 12, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#ff5555";
    ctx.beginPath(); ctx.arc(W / 2 - 3, 77, 4, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;

    const out = saveOut(__dirname, `spy3_${uid}.png`, canvas);
    await message.reaction("✅", event.messageID);
    await message.reply({ body: `📸 Polaroid spy of ${name}`, attachment: fs.createReadStream(out) });
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
