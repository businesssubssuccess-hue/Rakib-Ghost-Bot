const { createCanvas, loadImage } = require("canvas");
const GIFEncoder = require("gifencoder");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const OWNER_UID = "61575436812912";
const BIO = {
  name: "Rakib Islam",
  address: "Saidpur, Nilphamari",
  class: "Secret",
  age: "Secret",
  job: "Student",
  hobby: "Gaming & Travelling",
  fb: "facebook.com/profile.php?id=" + OWNER_UID
};

module.exports = {
  config: {
    name: "owner3",
    aliases: ["myowner3"],
    version: "1.0",
    author: "Rakib",
    countDown: 5,
    role: 0,
    shortDescription: "Owner card — Neon Glow Polaroid",
    category: "info",
    guide: { en: "{p}owner3" }
  },

  onStart: async function ({ message, event, usersData }) {
    await message.reaction("⏳", event.messageID);
    const out = await buildPolaroid(BIO, OWNER_UID, event.threadID, usersData);
    await message.reaction("✅", event.messageID);
    await message.reply({
      body: bioText("OWNER ▸ NEON POLAROID", BIO),
      attachment: fs.createReadStream(out)
    });
    setTimeout(() => fs.existsSync(out) && fs.unlinkSync(out), 8000);
  }
};

async function buildPolaroid(b, uid, tid, usersData) {
  const W = 700, H = 800;
  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);
  const out = path.join(cacheDir, `owner3_${tid}.gif`);

  let avatar = null;
  try {
    const _avUrl = await usersData.getAvatarUrl(uid).catch(() => null);
    avatar = _avUrl ? await loadImage(_avUrl).catch(() => null) : null;
  } catch {}

  const enc = new GIFEncoder(W, H);
  const ws = fs.createWriteStream(out);
  enc.createReadStream().pipe(ws);
  enc.start(); enc.setRepeat(0); enc.setDelay(110); enc.setQuality(10);

  const FRAMES = 16;
  for (let f = 0; f < FRAMES; f++) {
    const hue = (f / FRAMES) * 360;
    const c1 = `hsl(${hue},100%,55%)`;
    const c2 = `hsl(${(hue + 60) % 360},100%,55%)`;
    const c3 = `hsl(${(hue + 180) % 360},100%,55%)`;

    const cv = createCanvas(W, H);
    const ctx = cv.getContext("2d");

    // Dark bg with neon stripes
    ctx.fillStyle = "#0a000a"; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 8; i++) {
      const a = (Math.PI / 4) * (f * 0.1 + i);
      ctx.strokeStyle = `hsla(${(hue + i * 45) % 360},100%,55%,0.06)`;
      ctx.lineWidth = 30;
      ctx.beginPath();
      ctx.moveTo(W / 2 + Math.cos(a) * 1000, H / 2 + Math.sin(a) * 1000);
      ctx.lineTo(W / 2 - Math.cos(a) * 1000, H / 2 - Math.sin(a) * 1000);
      ctx.stroke();
    }

    // Polaroid card (centered, slight rotation)
    ctx.save();
    ctx.translate(W / 2, H / 2 - 30);
    ctx.rotate(Math.sin(f * 0.3) * 0.02);

    const pw = 540, ph = 660;
    // Glow shadow
    ctx.shadowColor = c1; ctx.shadowBlur = 40;
    ctx.fillStyle = "#fafafa";
    roundRect(ctx, -pw / 2, -ph / 2, pw, ph, 12, true, false);
    ctx.shadowBlur = 0;

    // Photo area
    const phW = pw - 50, phH = pw - 50;
    if (avatar) {
      ctx.fillStyle = "#000";
      ctx.fillRect(-phW / 2, -ph / 2 + 25, phW, phH);
      ctx.drawImage(avatar, -phW / 2, -ph / 2 + 25, phW, phH);
    }

    // Neon photo border
    ctx.strokeStyle = c1; ctx.lineWidth = 4;
    ctx.shadowColor = c1; ctx.shadowBlur = 25;
    ctx.strokeRect(-phW / 2, -ph / 2 + 25, phW, phH);
    ctx.shadowBlur = 0;

    // "Handwritten" name
    ctx.font = "bold 36px 'Comic Sans MS', cursive";
    ctx.textAlign = "center";
    ctx.fillStyle = c2; ctx.shadowColor = c2; ctx.shadowBlur = 12;
    ctx.fillText("👑 " + b.name, 0, ph / 2 - 75);
    ctx.shadowBlur = 0;

    // Bio
    ctx.font = "16px 'Comic Sans MS', cursive";
    ctx.fillStyle = "#222";
    ctx.fillText(`📍 ${b.address}  •  💼 ${b.job}`, 0, ph / 2 - 48);
    ctx.fillText(`🎮 ${b.hobby}`, 0, ph / 2 - 28);
    ctx.font = "italic 14px 'Comic Sans MS', cursive";
    ctx.fillStyle = c3;
    ctx.shadowColor = c3; ctx.shadowBlur = 8;
    ctx.fillText(`🔗 fb.com/...id=${OWNER_UID}`, 0, ph / 2 - 8);
    ctx.shadowBlur = 0;

    ctx.restore();

    // Top push pin
    ctx.shadowColor = "rgba(0,0,0,0.5)"; ctx.shadowBlur = 8;
    ctx.fillStyle = c1;
    ctx.beginPath(); ctx.arc(W / 2, 60, 14, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = c2;
    ctx.beginPath(); ctx.arc(W / 2 - 4, 56, 5, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;

    // Bottom signature
    ctx.font = "bold 18px Arial"; ctx.textAlign = "center";
    ctx.fillStyle = c3; ctx.shadowColor = c3; ctx.shadowBlur = 20;
    ctx.fillText("👻 GHOST NET ▸ OWNER POLAROID 👻", W / 2, H - 25);
    ctx.shadowBlur = 0;

    enc.addFrame(ctx);
  }
  enc.finish();
  await new Promise(r => ws.on("finish", r));
  return out;
}

function bioText(title, b) {
  return `👑 𝗚𝗛𝗢𝗦𝗧 𝗡𝗘𝗧 ▸ ${title}
━━━━━━━━━━━━━━━━━━
👤 Name    : ${b.name}
📍 Address : ${b.address}
🎓 Class   : ${b.class}
🎂 Age     : ${b.age}
💼 Job     : ${b.job}
🎮 Hobby   : ${b.hobby}
🔗 FB      : ${b.fb}
━━━━━━━━━━━━━━━━━━
💀 Powered by Ghost Net Edition`;
}

function roundRect(ctx, x, y, w, h, r, fill, stroke) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}
