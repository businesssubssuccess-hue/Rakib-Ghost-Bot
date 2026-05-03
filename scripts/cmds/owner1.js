const { createCanvas, loadImage } = require("canvas");
const GIFEncoder = require("gifencoder");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// আপনার দেওয়া স্থায়ী তথ্যগুলো এখানে
const BIO = {
  name: "Rakib Islam",
  address: "Saidpur, Nilphamari",
  class: "Secret",
  age: "Secret",
  job: "Student",
  hobby: "Gaming & Travelling"
};

module.exports = {
  config: {
    name: "owner1",
    aliases: ["myowner1","maalik"],
    version: "1.0",
    author: "Rakib", // আপনার দেওয়া অরিজিনাল অথর নাম
    countDown: 5,
    role: 0,
    shortDescription: "Owner card — VIP Gold neon",
    category: "info",
    guide: { en: "{p}owner1" }
  },

  onStart: async function ({ message, event, usersData }) {
    await message.reaction("⏳", event.messageID);
    
    const OWNER_UID = "61575436812912";
    const finalBio = { ...BIO, fb: "facebook.com/" + OWNER_UID };

    const out = await buildVIPCard(finalBio, OWNER_UID, event.threadID, usersData);
    
    await message.reaction("✅", event.messageID);
    await message.reply({
      body: bioText("OWNER ▸ VIP GOLD", finalBio),
      attachment: fs.createReadStream(out)
    });
    
    // ফাইলটি পাঠানোর পর ডিলিট করে দেওয়া হবে
    setTimeout(() => fs.existsSync(out) && fs.unlinkSync(out), 8000);
  }
};

async function buildVIPCard(b, uid, tid, usersData) {
  const W = 760, H = 460;
  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);
  const out = path.join(cacheDir, `owner1_${tid}.gif`);

  let avatar = null;
  try {
    const _avUrl = await usersData.getAvatarUrl(uid).catch(() => null);
    avatar = _avUrl ? await loadImage(_avUrl).catch(() => null) : null;
  } catch {}

  const enc = new GIFEncoder(W, H);
  const ws = fs.createWriteStream(out);
  enc.createReadStream().pipe(ws);
  enc.start(); enc.setRepeat(0); enc.setDelay(130); enc.setQuality(10);

  const cycle = ["#ffd700", "#ff00aa", "#00ffff", "#aaff00", "#ff5500", "#9d00ff"];
  for (let f = 0; f < 12; f++) {
    const c1 = cycle[f % cycle.length];
    const gold = "#ffd700";
    const cv = createCanvas(W, H);
    const ctx = cv.getContext("2d");

    // BG Design
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#1a0a00"); bg.addColorStop(0.5, "#0a0010"); bg.addColorStop(1, "#1a1000");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = `rgba(255,215,0,${Math.random() * 0.4})`;
      ctx.beginPath();
      ctx.arc(Math.random() * W, Math.random() * H, Math.random() * 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Card Body
    const cx = 30, cy = 30, cw = W - 60, ch = H - 60;
    const cardGrad = ctx.createLinearGradient(cx, cy, cx + cw, cy + ch);
    cardGrad.addColorStop(0, "#1a0000");
    cardGrad.addColorStop(0.5, "#2a0a1a");
    cardGrad.addColorStop(1, "#1a1000");
    ctx.fillStyle = cardGrad;
    roundRect(ctx, cx, cy, cw, ch, 25, true, false);

    // Neon Borders
    [{ off: 0, color: gold, blur: 35 }, { off: -6, color: c1, blur: 25 }].forEach(l => {
      ctx.lineWidth = 4;
      ctx.strokeStyle = l.color;
      ctx.shadowColor = l.color;
      ctx.shadowBlur = l.blur;
      roundRect(ctx, cx + l.off, cy + l.off, cw - l.off * 2, ch - l.off * 2, 25, false, true);
    });
    ctx.shadowBlur = 0;

    // UI Text & Header
    ctx.font = "40px Arial"; ctx.textAlign = "center";
    ctx.fillStyle = gold; ctx.shadowColor = gold; ctx.shadowBlur = 25;
    ctx.fillText("👑", cx + 70, cy + 60);
    ctx.font = "bold 26px Arial";
    ctx.fillText("V.I.P", cx + 70, cy + 90);
    ctx.shadowBlur = 0;

    ctx.font = "bold 28px Arial"; ctx.textAlign = "left";
    ctx.fillStyle = c1; ctx.shadowColor = c1; ctx.shadowBlur = 22;
    ctx.fillText("👻 BOT OWNER PROFILE 👻", cx + 130, cy + 60);
    ctx.shadowBlur = 0;
    ctx.font = "italic 14px Arial"; ctx.fillStyle = "rgba(255,215,0,0.8)";
    ctx.fillText("— Ghost Net Edition Royal —", cx + 130, cy + 80);

    // Avatar Drawing
    if (avatar) {
      const ax = cx + 75, ay = cy + 220, r = 75;
      ctx.beginPath(); ctx.arc(ax, ay, r + 6, 0, Math.PI * 2);
      ctx.strokeStyle = gold; ctx.lineWidth = 5;
      ctx.shadowColor = gold; ctx.shadowBlur = 25; ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.save(); ctx.beginPath(); ctx.arc(ax, ay, r, 0, Math.PI * 2); ctx.clip();
      ctx.drawImage(avatar, ax - r, ay - r, r * 2, r * 2);
      ctx.restore();
    }

    // Info Mapping
    const px = cx + 180, py = cy + 130;
    const fields = [
      ["NAME", b.name],
      ["ADDRESS", b.address],
      ["CLASS", b.class],
      ["AGE", b.age],
      ["JOB", b.job],
      ["HOBBY", b.hobby],
      ["FACEBOOK", "id=" + uid]
    ];
    let y = py;
    for (const [k, v] of fields) {
      ctx.font = "10px monospace"; ctx.fillStyle = "rgba(255,215,0,0.6)";
      ctx.fillText(k, px, y);
      ctx.font = "bold 16px monospace"; ctx.fillStyle = "#fff";
      ctx.shadowColor = c1; ctx.shadowBlur = 6;
      ctx.fillText(String(v).slice(0, 38), px, y + 18);
      ctx.shadowBlur = 0;
      y += 32;
    }

    ctx.font = "bold 14px Arial"; ctx.textAlign = "center";
    ctx.fillStyle = gold; ctx.shadowColor = gold; ctx.shadowBlur = 18;
    ctx.fillText("◆ EXCLUSIVE OWNER ACCESS — Ghost Net Royal ◆", W / 2, H - 50);
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
