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
    name: "owner2",
    aliases: ["myowner2"],
    version: "1.0",
    author: "Rakib",
    countDown: 5,
    role: 0,
    shortDescription: "Owner card — Neon Throne",
    category: "info",
    guide: { en: "{p}owner2" }
  },

  onStart: async function ({ message, event, usersData }) {
    await message.reaction("⏳", event.messageID);
    const out = await buildThrone(BIO, OWNER_UID, event.threadID, usersData);
    await message.reaction("✅", event.messageID);
    await message.reply({
      body: bioText("OWNER ▸ NEON THRONE", BIO),
      attachment: fs.createReadStream(out)
    });
    setTimeout(() => fs.existsSync(out) && fs.unlinkSync(out), 8000);
  }
};

async function buildThrone(b, uid, tid, usersData) {
  const W = 720, H = 720;
  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);
  const out = path.join(cacheDir, `owner2_${tid}.gif`);

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
    const c2 = `hsl(${(hue + 120) % 360},100%,55%)`;
    const c3 = `hsl(${(hue + 240) % 360},100%,55%)`;

    const cv = createCanvas(W, H);
    const ctx = cv.getContext("2d");

    ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H);

    // Radial spotlight from top
    const spot = ctx.createRadialGradient(W / 2, 100, 50, W / 2, 100, 600);
    spot.addColorStop(0, `hsla(${hue},100%,55%,0.3)`);
    spot.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = spot; ctx.fillRect(0, 0, W, H);

    // Floating particles
    for (let i = 0; i < 80; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.4})`;
      ctx.beginPath();
      ctx.arc(Math.random() * W, Math.random() * H, Math.random() * 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Top crown + title
    ctx.font = "70px Arial"; ctx.textAlign = "center";
    ctx.fillStyle = "#ffd700"; ctx.shadowColor = "#ffd700"; ctx.shadowBlur = 35;
    ctx.fillText("👑", W / 2, 90);
    ctx.shadowBlur = 0;
    ctx.font = "bold 38px Arial";
    ctx.fillStyle = c1; ctx.shadowColor = c1; ctx.shadowBlur = 30;
    ctx.fillText("THE OWNER", W / 2, 140);
    ctx.shadowBlur = 0;
    ctx.font = "italic 16px Arial";
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fillText("— Ghost Net Edition —", W / 2, 165);

    // Hex avatar (large center)
    if (avatar) {
      const cx = W / 2, cy = 320, r = 130;
      [c1, c2, c3].forEach((cc, i) => {
        ctx.beginPath();
        for (let j = 0; j < 6; j++) {
          const a = Math.PI / 3 * j - Math.PI / 6;
          const x = cx + (r + 8 + i * 8) * Math.cos(a);
          const y = cy + (r + 8 + i * 8) * Math.sin(a);
          j === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = cc; ctx.lineWidth = 3;
        ctx.shadowColor = cc; ctx.shadowBlur = 30; ctx.stroke();
      });
      ctx.shadowBlur = 0;
      ctx.save();
      ctx.beginPath();
      for (let j = 0; j < 6; j++) {
        const a = Math.PI / 3 * j - Math.PI / 6;
        const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
        j === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath(); ctx.clip();
      ctx.drawImage(avatar, cx - r, cy - r, r * 2, r * 2);
      ctx.restore();
    }

    // Big name
    ctx.font = "bold 36px Arial"; ctx.textAlign = "center";
    ctx.fillStyle = "#ffd700"; ctx.shadowColor = "#ffd700"; ctx.shadowBlur = 25;
    ctx.fillText(b.name.toUpperCase(), W / 2, 510);
    ctx.shadowBlur = 0;

    // Stat boxes (2 column)
    const rows = [
      ["📍", "Address", b.address],
      ["💼", "Job", b.job],
      ["🎮", "Hobby", b.hobby]
    ];
    let y = 545;
    for (const [icon, k, v] of rows) {
      ctx.fillStyle = "rgba(255,255,255,0.05)";
      roundRect(ctx, 60, y, W - 120, 38, 8, true, false);
      ctx.strokeStyle = c2; ctx.lineWidth = 1;
      ctx.shadowColor = c2; ctx.shadowBlur = 8;
      roundRect(ctx, 60, y, W - 120, 38, 8, false, true);
      ctx.shadowBlur = 0;

      ctx.font = "20px Arial"; ctx.textAlign = "left";
      ctx.fillStyle = c1; ctx.fillText(icon, 75, y + 26);
      ctx.font = "12px monospace"; ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.fillText(k.toUpperCase(), 110, y + 16);
      ctx.font = "bold 16px Arial"; ctx.fillStyle = "#fff";
      ctx.shadowColor = c1; ctx.shadowBlur = 6;
      ctx.fillText(String(v).slice(0, 40), 110, y + 32);
      ctx.shadowBlur = 0;
      y += 45;
    }

    // FB
    ctx.font = "12px monospace"; ctx.textAlign = "center";
    ctx.fillStyle = c3; ctx.shadowColor = c3; ctx.shadowBlur = 12;
    ctx.fillText(`🔗 ${b.fb}`, W / 2, y + 20);
    ctx.shadowBlur = 0;

    // Bottom strip
    const sg = ctx.createLinearGradient(0, H - 40, W, H - 40);
    sg.addColorStop(0, c1); sg.addColorStop(0.5, c2); sg.addColorStop(1, c3);
    ctx.fillStyle = sg; ctx.shadowColor = c1; ctx.shadowBlur = 25;
    ctx.fillRect(0, H - 30, W, 4);
    ctx.shadowBlur = 0;
    ctx.font = "bold 14px Arial"; ctx.fillStyle = "#fff";
    ctx.shadowColor = c1; ctx.shadowBlur = 18;
    ctx.fillText("👻 KING OF GHOST NET 👻", W / 2, H - 8);
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
