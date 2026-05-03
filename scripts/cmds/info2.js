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
    name: "info2",
    aliases: ["botinfo2"],
    version: "1.0",
    author: "Rakib",
    countDown: 5,
    role: 0,
    shortDescription: "Bot info card — Cyberpunk neon",
    category: "info",
    guide: { en: "{p}info2" }
  },

  onStart: async function ({ message, event, usersData }) {
    await message.reaction("⏳", event.messageID);
    const out = await buildCyberCard(BIO, OWNER_UID, event.threadID, usersData);
    await message.reaction("✅", event.messageID);
    await message.reply({
      body: bioText("BOT INFO ▸ CYBER", BIO),
      attachment: fs.createReadStream(out)
    });
    setTimeout(() => fs.existsSync(out) && fs.unlinkSync(out), 8000);
  }
};

async function buildCyberCard(b, uid, tid, usersData) {
  const W = 800, H = 500;
  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);
  const out = path.join(cacheDir, `info2_${tid}.gif`);

  let avatar = null;
  try {
    const _avUrl = await usersData.getAvatarUrl(uid).catch(() => null);
    avatar = _avUrl ? await loadImage(_avUrl).catch(() => null) : null;
  } catch {}

  const enc = new GIFEncoder(W, H);
  const ws = fs.createWriteStream(out);
  enc.createReadStream().pipe(ws);
  enc.start(); enc.setRepeat(0); enc.setDelay(130); enc.setQuality(10);

  const cycle = [["#00ffff", "#ff00aa"], ["#ff00aa", "#aaff00"], ["#aaff00", "#00ffff"], ["#ffd700", "#ff00aa"], ["#ff5500", "#00ffff"], ["#9d00ff", "#aaff00"]];

  for (let f = 0; f < 12; f++) {
    const [c1, c2] = cycle[f % cycle.length];
    const cv = createCanvas(W, H);
    const ctx = cv.getContext("2d");
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#0a001a"); bg.addColorStop(1, "#000a1a");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    // Cyber grid
    ctx.strokeStyle = "rgba(0,255,255,0.1)"; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 25) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 25) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    // Avatar square w/ corner brackets
    if (avatar) {
      const ax = 40, ay = 100, as = 240;
      ctx.save(); ctx.beginPath(); ctx.rect(ax, ay, as, as); ctx.clip();
      ctx.drawImage(avatar, ax, ay, as, as); ctx.restore();
      ctx.strokeStyle = c1; ctx.lineWidth = 4;
      ctx.shadowColor = c1; ctx.shadowBlur = 25; ctx.strokeRect(ax, ay, as, as);
      ctx.shadowBlur = 0;
      ctx.strokeStyle = c2; ctx.lineWidth = 6;
      ctx.shadowColor = c2; ctx.shadowBlur = 20;
      const cl = 30;
      ctx.beginPath(); ctx.moveTo(ax - 5, ay + cl); ctx.lineTo(ax - 5, ay - 5); ctx.lineTo(ax + cl, ay - 5); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ax + as + 5, ay + as - cl); ctx.lineTo(ax + as + 5, ay + as + 5); ctx.lineTo(ax + as - cl, ay + as + 5); ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Header
    ctx.font = "bold 32px Arial"; ctx.textAlign = "left";
    ctx.fillStyle = c1; ctx.shadowColor = c1; ctx.shadowBlur = 25;
    ctx.fillText("◣ BOT PROFILE ◢", 320, 60);
    ctx.shadowBlur = 0;

    // Data
    ctx.font = "20px monospace"; ctx.fillStyle = "#fff";
    const lines = [
      `┌─[ AGENT DATA ]─`,
      `│ Name    : ${b.name}`,
      `│ Address : ${b.address}`,
      `│ Class   : ${b.class}`,
      `│ Age     : ${b.age}`,
      `│ Job     : ${b.job}`,
      `│ Hobby   : ${b.hobby}`,
      `│ FB      : ${b.fb.slice(-30)}`,
      `└────────────────`
    ];
    let y = 110;
    for (const l of lines) {
      ctx.shadowColor = c2; ctx.shadowBlur = 8;
      ctx.fillText(l, 320, y); y += 30;
    }
    ctx.shadowBlur = 0;

    // Bottom strip
    ctx.fillStyle = c2; ctx.shadowColor = c2; ctx.shadowBlur = 20;
    ctx.fillRect(0, H - 50, W, 3); ctx.shadowBlur = 0;
    ctx.font = "bold 18px Arial"; ctx.textAlign = "center";
    ctx.fillStyle = c1; ctx.shadowColor = c1; ctx.shadowBlur = 15;
    ctx.fillText("👻 GHOST NET ▸ CYBER DIVISION 👻", W / 2, H - 18);

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
