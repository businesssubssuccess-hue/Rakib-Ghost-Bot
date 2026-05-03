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
    name: "info3",
    aliases: ["botinfo3"],
    version: "1.0",
    author: "Rakib",
    countDown: 5,
    role: 0,
    shortDescription: "Bot info card — Royal neon banner",
    category: "info",
    guide: { en: "{p}info3" }
  },

  onStart: async function ({ message, event, usersData }) {
    await message.reaction("⏳", event.messageID);
    const out = await buildBanner(BIO, OWNER_UID, event.threadID, usersData);
    await message.reaction("✅", event.messageID);
    await message.reply({
      body: bioText("BOT INFO ▸ ROYAL", BIO),
      attachment: fs.createReadStream(out)
    });
    setTimeout(() => fs.existsSync(out) && fs.unlinkSync(out), 8000);
  }
};

async function buildBanner(b, uid, tid, usersData) {
  const W = 800, H = 700;
  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);
  const out = path.join(cacheDir, `info3_${tid}.gif`);

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
    const c2 = `hsl(${(hue + 180) % 360},100%,55%)`;
    const gold = `hsl(45,100%,${55 + Math.sin(f * 0.5) * 10}%)`;

    const cv = createCanvas(W, H);
    const ctx = cv.getContext("2d");

    // Dark royal background w/ stars
    const bg = ctx.createRadialGradient(W / 2, H / 2, 100, W / 2, H / 2, W);
    bg.addColorStop(0, "#1a0033"); bg.addColorStop(1, "#000010");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 60; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.5})`;
      ctx.beginPath();
      ctx.arc(Math.random() * W, Math.random() * H, Math.random() * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Top header w/ crown
    ctx.font = "60px Arial"; ctx.textAlign = "center";
    ctx.fillStyle = gold; ctx.shadowColor = gold; ctx.shadowBlur = 30;
    ctx.fillText("👑", W / 2, 70);
    ctx.shadowBlur = 0;
    ctx.font = "bold 32px Arial";
    ctx.fillStyle = c1; ctx.shadowColor = c1; ctx.shadowBlur = 25;
    ctx.fillText("BOT OWNER ▸ ROYAL EDITION", W / 2, 110);
    ctx.shadowBlur = 0;

    // Avatar circle (large center)
    if (avatar) {
      const cx = W / 2, cy = 270, r = 130;
      // Triple ring
      [c1, gold, c2].forEach((cc, i) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r + 8 + i * 7, 0, Math.PI * 2);
        ctx.strokeStyle = cc; ctx.lineWidth = 3;
        ctx.shadowColor = cc; ctx.shadowBlur = 25;
        ctx.stroke();
      });
      ctx.shadowBlur = 0;
      ctx.save();
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip();
      ctx.drawImage(avatar, cx - r, cy - r, r * 2, r * 2);
      ctx.restore();
    }

    // Big name
    ctx.font = "bold 36px Arial"; ctx.textAlign = "center";
    ctx.fillStyle = gold; ctx.shadowColor = gold; ctx.shadowBlur = 20;
    ctx.fillText(b.name, W / 2, 450);
    ctx.shadowBlur = 0;

    // Bio rows (2-column)
    const rows = [
      ["📍 Address", b.address, "💼 Job", b.job],
      ["🎓 Class", b.class, "🎂 Age", b.age],
      ["🎮 Hobby", b.hobby, "🔗 FB", "...id=" + OWNER_UID.slice(-6)]
    ];
    let y = 490;
    for (const [k1, v1, k2, v2] of rows) {
      ctx.font = "12px Arial"; ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.textAlign = "left";
      ctx.fillText(k1, 80, y);
      ctx.fillText(k2, 440, y);
      ctx.font = "bold 18px Arial"; ctx.fillStyle = c1;
      ctx.shadowColor = c1; ctx.shadowBlur = 10;
      ctx.fillText(String(v1).slice(0, 28), 80, y + 22);
      ctx.fillStyle = c2; ctx.shadowColor = c2;
      ctx.fillText(String(v2).slice(0, 28), 440, y + 22);
      ctx.shadowBlur = 0;
      y += 50;
    }

    // Bottom royal banner
    const sg = ctx.createLinearGradient(0, H - 50, W, H - 50);
    sg.addColorStop(0, c1); sg.addColorStop(0.5, gold); sg.addColorStop(1, c2);
    ctx.fillStyle = sg; ctx.shadowColor = gold; ctx.shadowBlur = 25;
    ctx.fillRect(0, H - 50, W, 4);
    ctx.shadowBlur = 0;
    ctx.font = "bold 20px Arial"; ctx.textAlign = "center";
    ctx.fillStyle = gold; ctx.shadowColor = gold; ctx.shadowBlur = 20;
    ctx.fillText("👻 GHOST NET EDITION ▸ ROYAL 👑", W / 2, H - 18);
    ctx.shadowBlur = 0;

    enc.addFrame(ctx);
  }
  enc.finish();
  await new Promise(r => ws.on("finish", r));
  return out;
}

function bioText(title, b) {
  return `👻 𝗚𝗛𝗢𝗦𝗧 𝗡𝗘𝗧 ▸ ${title}
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
