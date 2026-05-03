const { createCanvas } = require("canvas");
const GIFEncoder = require("gifencoder");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "neonuptime",
    aliases: ["upneon", "uptime3"],
    version: "1.0",
    author: "Rakib",
    countDown: 5,
    role: 0,
    shortDescription: "নিয়ন আলোর uptime card",
    longDescription: "Animated rainbow neon design এ bot এর uptime, ping, users, groups দেখাবে। উপরে custom text বসানো যায়।",
    category: "system",
    guide: { en: "{p}neonuptime [উপরের text]" }
  },

  onStart: async function ({ message, event, args, threadsData, usersData }) {
    await message.reaction("⏳", event.messageID);

    const topText = args.join(" ").trim() || "👻 GHOST NET BOT 👻";
    const uptime = formatUptime(process.uptime() * 1000);
    const ping = `${Date.now() - event.timestamp}ms`;
    const owner = global.GoatBot?.config?.ownerName || "Rakib";
    const totalUsers = (await usersData.getAll().catch(() => [])).length;
    const totalThreads = (await threadsData.getAll().catch(() => [])).length;

    const W = 760, H = 460;
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);
    const out = path.join(cacheDir, `neonuptime_${event.threadID}.gif`);

    const enc = new GIFEncoder(W, H);
    const writeStream = fs.createWriteStream(out);
    enc.createReadStream().pipe(writeStream);
    enc.start(); enc.setRepeat(0); enc.setDelay(120); enc.setQuality(10);

    const FRAMES = 16;
    for (let f = 0; f < FRAMES; f++) {
      const hue = (f / FRAMES) * 360;
      const neon = `hsl(${hue}, 100%, 55%)`;
      const neon2 = `hsl(${(hue + 120) % 360}, 100%, 55%)`;
      const neon3 = `hsl(${(hue + 240) % 360}, 100%, 55%)`;

      const canvas = createCanvas(W, H);
      const ctx = canvas.getContext("2d");

      // Black + stars
      ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < 50; i++) {
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.5})`;
        ctx.beginPath();
        ctx.arc(Math.random() * W, Math.random() * H, Math.random() * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Top text — large glowing
      ctx.font = "bold 30px Arial";
      ctx.textAlign = "center";
      ctx.fillStyle = neon;
      ctx.shadowColor = neon; ctx.shadowBlur = 30;
      ctx.fillText(topText.slice(0, 36), W / 2, 50);
      ctx.shadowBlur = 0;

      // Card body
      const cx = 40, cy = 80, cw = W - 80, ch = H - 160;
      const grad = ctx.createLinearGradient(cx, cy, cx + cw, cy + ch);
      grad.addColorStop(0, "#0a0a2a");
      grad.addColorStop(0.5, "#1a0a3a");
      grad.addColorStop(1, "#0a002a");
      ctx.fillStyle = grad;
      roundRect(ctx, cx, cy, cw, ch, 25, true, false);

      // Triple cycling border
      [{ off: 0, color: neon, blur: 35 }, { off: -5, color: neon2, blur: 22 }, { off: 5, color: neon3, blur: 22 }].forEach(l => {
        ctx.lineWidth = 3;
        ctx.strokeStyle = l.color;
        ctx.shadowColor = l.color;
        ctx.shadowBlur = l.blur;
        roundRect(ctx, cx + l.off, cy + l.off, cw - l.off * 2, ch - l.off * 2, 25, false, true);
      });
      ctx.shadowBlur = 0;

      // Big uptime
      ctx.font = "bold 56px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = "#fff";
      ctx.shadowColor = neon; ctx.shadowBlur = 30;
      ctx.fillText(uptime, W / 2, cy + 90);
      ctx.shadowBlur = 0;
      ctx.font = "12px Arial";
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.fillText("⏰ BOT UPTIME", W / 2, cy + 110);

      // Divider line
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.beginPath();
      ctx.moveTo(cx + 40, cy + 130);
      ctx.lineTo(cx + cw - 40, cy + 130);
      ctx.stroke();

      // 4-column stats
      const stats = [
        { label: "PING", value: ping, color: neon, icon: "⚡" },
        { label: "USERS", value: totalUsers.toString(), color: neon2, icon: "👤" },
        { label: "GROUPS", value: totalThreads.toString(), color: neon3, icon: "💬" },
        { label: "OWNER", value: owner.slice(0, 8), color: neon, icon: "👑" }
      ];
      const colW = cw / 4;
      stats.forEach((s, i) => {
        const sx = cx + colW * i + colW / 2;
        ctx.font = "12px Arial";
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.fillText(`${s.icon} ${s.label}`, sx, cy + 165);

        ctx.font = "bold 22px Arial";
        ctx.fillStyle = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 15;
        ctx.fillText(s.value, sx, cy + 200);
        ctx.shadowBlur = 0;
      });

      // Bot info badge
      ctx.font = "bold 16px Arial";
      ctx.fillStyle = neon2;
      ctx.shadowColor = neon2;
      ctx.shadowBlur = 12;
      ctx.fillText(`💀 ${global.GoatBot?.config?.botName || "Ghost Net Bot"} 💀`, W / 2, cy + ch - 25);
      ctx.shadowBlur = 0;

      // Bottom rainbow strip
      const sg = ctx.createLinearGradient(0, H - 60, W, H - 60);
      sg.addColorStop(0, neon); sg.addColorStop(0.5, neon2); sg.addColorStop(1, neon3);
      ctx.fillStyle = sg;
      ctx.shadowColor = neon; ctx.shadowBlur = 25;
      ctx.fillRect(0, H - 50, W, 4);
      ctx.shadowBlur = 0;

      ctx.font = "bold 18px Arial";
      ctx.fillStyle = "#fff";
      ctx.shadowColor = neon;
      ctx.shadowBlur = 20;
      ctx.fillText("👻 GHOST NET EDITION 👻", W / 2, H - 18);
      ctx.shadowBlur = 0;

      enc.addFrame(ctx);
    }
    enc.finish();
    await new Promise(r => writeStream.on("finish", r));

    await message.reaction("✅", event.messageID);
    await message.reply({
      body: `👻 𝗡𝗘𝗢𝗡 𝗨𝗣𝗧𝗜𝗠𝗘\n━━━━━━━━━━━━━━━━\n📝 ${topText}\n⏰ Uptime : ${uptime}\n⚡ Ping   : ${ping}\n👤 Users  : ${totalUsers}\n💬 Groups : ${totalThreads}\n👑 Owner  : ${owner}\n━━━━━━━━━━━━━━━━\n💀 Ghost Net Edition`,
      attachment: fs.createReadStream(out)
    });
    setTimeout(() => fs.existsSync(out) && fs.unlinkSync(out), 8000);
  }
};

function formatUptime(ms) {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 86400)}d ${Math.floor(s / 3600) % 24}h ${Math.floor(s / 60) % 60}m ${s % 60}s`;
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
