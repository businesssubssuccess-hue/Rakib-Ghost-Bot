const { createCanvas } = require("canvas");
const GIFEncoder = require("gifencoder");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "mastercard",
    aliases: ["fakemc", "mcard"],
    version: "1.0",
    author: "Rakib",
    countDown: 5,
    role: 0,
    shortDescription: "Animated নিয়ন Fake Mastercard",
    longDescription: "নাম দিয়ে একটা animated neon Mastercard বানিয়ে দেবে (fake — only for fun)",
    category: "image",
    guide: { en: "{p}mastercard <name> | reply | mention" }
  },

  onStart: async function ({ message, event, args, api }) {
    await message.reaction("⏳", event.messageID);

    let cardName = args.join(" ").trim();
    if (!cardName) {
      let uid = event.senderID;
      if (event.type === "message_reply") uid = event.messageReply.senderID;
      else if (Object.keys(event.mentions || {}).length) uid = Object.keys(event.mentions)[0];
      try { cardName = (await api.getUserInfo(uid))[uid].name; } catch { cardName = "GHOST USER"; }
    }
    cardName = cardName.toUpperCase().slice(0, 22);

    const cardNumber = generateMC();
    const exp = `${pad(rnd(1, 12), 2)}/${pad((new Date().getFullYear() + rnd(2, 6)) % 100, 2)}`;
    const cvv = pad(rnd(100, 999), 3);

    const W = 720, H = 440;
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);
    const out = path.join(cacheDir, `mastercard_${event.threadID}.gif`);

    const enc = new GIFEncoder(W, H);
    const writeStream = fs.createWriteStream(out);
    enc.createReadStream().pipe(writeStream);
    enc.start(); enc.setRepeat(0); enc.setDelay(140); enc.setQuality(10);

    const neonCycle = ["#ff5f00", "#eb001b", "#f79e1b", "#ff00aa", "#00f0ff", "#9d00ff"];
    const FRAMES = 12;

    for (let f = 0; f < FRAMES; f++) {
      const neon = neonCycle[f % neonCycle.length];
      const canvas = createCanvas(W, H);
      const ctx = canvas.getContext("2d");

      ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < 40; i++) {
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.4})`;
        ctx.beginPath();
        ctx.arc(Math.random() * W, Math.random() * H, Math.random() * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      const cx = 50, cy = 60, cw = W - 100, ch = H - 120;
      const grad = ctx.createLinearGradient(cx, cy, cx + cw, cy + ch);
      grad.addColorStop(0, "#1a0010");
      grad.addColorStop(0.5, "#2a0a18");
      grad.addColorStop(1, "#001a0a");
      ctx.fillStyle = grad;
      roundRect(ctx, cx, cy, cw, ch, 25, true, false);

      ctx.lineWidth = 4;
      ctx.strokeStyle = neon;
      ctx.shadowColor = neon;
      ctx.shadowBlur = 35 + (f % 4) * 5;
      roundRect(ctx, cx, cy, cw, ch, 25, false, true);
      ctx.shadowBlur = 0;

      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      roundRect(ctx, cx + 8, cy + 8, cw - 16, ch - 16, 18, false, true);

      // Diagonal wave lines
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        for (let x = cx; x <= cx + cw; x += 4) {
          const y = cy + 60 + i * 50 + Math.sin((x + f * 8) * 0.05) * 8;
          if (x === cx) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Bank header
      ctx.font = "bold 18px Arial";
      ctx.textAlign = "left";
      ctx.fillStyle = neon;
      ctx.shadowColor = neon; ctx.shadowBlur = 15;
      ctx.fillText("👻 GHOST NET BANK", cx + 30, cy + 38);
      ctx.shadowBlur = 0;
      ctx.font = "10px Arial"; ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.fillText("WORLD ELITE ▸ NEON SERIES", cx + 30, cy + 55);

      // Mastercard logo (interlocking circles, top-right)
      const logoX = cx + cw - 90, logoY = cy + 50;
      ctx.shadowColor = "#eb001b"; ctx.shadowBlur = 20;
      ctx.fillStyle = "#eb001b";
      ctx.beginPath(); ctx.arc(logoX, logoY, 26, 0, Math.PI * 2); ctx.fill();
      ctx.shadowColor = "#f79e1b";
      ctx.fillStyle = "#f79e1b";
      ctx.beginPath(); ctx.arc(logoX + 32, logoY, 26, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
      // Overlap (orange blend)
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = "rgba(255,95,0,0.85)";
      ctx.beginPath(); ctx.arc(logoX + 16, logoY, 17, 0, Math.PI * 2); ctx.fill();
      ctx.globalCompositeOperation = "source-over";

      ctx.font = "italic bold 11px Arial";
      ctx.textAlign = "center";
      ctx.fillStyle = "#fff";
      ctx.fillText("mastercard", logoX + 16, logoY + 48);

      // Chip
      const chipX = cx + 30, chipY = cy + 110;
      const chipGrad = ctx.createLinearGradient(chipX, chipY, chipX + 65, chipY + 50);
      chipGrad.addColorStop(0, "#ffd700");
      chipGrad.addColorStop(0.5, "#ffec80");
      chipGrad.addColorStop(1, "#b8860b");
      ctx.fillStyle = chipGrad;
      roundRect(ctx, chipX, chipY, 65, 50, 7, true, false);
      ctx.strokeStyle = "#704700"; ctx.lineWidth = 1;
      for (let i = 1; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(chipX + 5, chipY + (50 / 5) * i);
        ctx.lineTo(chipX + 60, chipY + (50 / 5) * i);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(chipX + 32.5, chipY); ctx.lineTo(chipX + 32.5, chipY + 50); ctx.stroke();

      // Contactless icon
      ctx.strokeStyle = "#fff"; ctx.lineWidth = 2;
      const wx = chipX + 90, wy = chipY + 25;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(wx, wy, 8 + i * 6, -Math.PI / 4, Math.PI / 4);
        ctx.stroke();
      }

      // Card number
      ctx.font = "bold 32px monospace";
      ctx.textAlign = "left";
      ctx.fillStyle = "#fff";
      ctx.shadowColor = neon; ctx.shadowBlur = 12;
      ctx.fillText(formatCard(cardNumber), cx + 30, cy + 215);
      ctx.shadowBlur = 0;

      // Labels
      ctx.font = "9px Arial";
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.fillText("VALID THRU", cx + 30, cy + 245);
      ctx.fillText("CVV", cx + 180, cy + 245);

      ctx.font = "bold 20px monospace";
      ctx.fillStyle = "#fff";
      ctx.shadowColor = neon; ctx.shadowBlur = 10;
      ctx.fillText(exp, cx + 30, cy + 268);
      ctx.fillText(cvv, cx + 180, cy + 268);
      ctx.shadowBlur = 0;

      // Cardholder name
      ctx.font = "bold 22px monospace";
      ctx.fillStyle = neon;
      ctx.shadowColor = neon; ctx.shadowBlur = 15;
      ctx.fillText(cardName, cx + 30, cy + ch - 25);
      ctx.shadowBlur = 0;

      // Bottom
      ctx.fillStyle = neon;
      ctx.shadowColor = neon; ctx.shadowBlur = 25;
      ctx.fillRect(0, H - 50, W, 4);
      ctx.shadowBlur = 0;
      ctx.font = "bold 14px Arial";
      ctx.textAlign = "center";
      ctx.fillStyle = neon;
      ctx.shadowColor = neon; ctx.shadowBlur = 15;
      ctx.fillText("⚠ FAKE — JUST FOR FUN ⚠  •  💀 Ghost Net Edition 💀", W / 2, H - 20);
      ctx.shadowBlur = 0;

      enc.addFrame(ctx);
    }
    enc.finish();
    await new Promise(r => writeStream.on("finish", r));

    await message.reaction("✅", event.messageID);
    await message.reply({
      body: `💳 𝗠𝗔𝗦𝗧𝗘𝗥𝗖𝗔𝗥𝗗 ▸ 𝗚𝗛𝗢𝗦𝗧 𝗡𝗘𝗧\n━━━━━━━━━━━━━━━━━━━\n👤 Holder : ${cardName}\n🔢 Number : ${formatCard(cardNumber)}\n📅 Expiry : ${exp}\n🔒 CVV    : ${cvv}\n━━━━━━━━━━━━━━━━━━━\n👻 Ghost Net Edition`,
      attachment: fs.createReadStream(out)
    });
    setTimeout(() => fs.existsSync(out) && fs.unlinkSync(out), 8000);
  }
};

function generateMC() {
  // Mastercard starts with 51-55 (most common: 5)
  let n = String(rnd(51, 55));
  for (let i = 0; i < 13; i++) n += rnd(0, 9);
  n += luhnCheck(n);
  return n;
}
function luhnCheck(num) {
  let sum = 0;
  for (let i = 0; i < num.length; i++) {
    let d = parseInt(num[num.length - 1 - i]);
    if (i % 2 === 0) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
  }
  return (10 - (sum % 10)) % 10;
}
function formatCard(n) { return n.match(/.{1,4}/g).join(" "); }
function rnd(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
function pad(n, w) { return String(n).padStart(w, "0"); }
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
