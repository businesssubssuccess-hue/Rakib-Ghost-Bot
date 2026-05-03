const { createCanvas } = require("canvas");
const GIFEncoder = require("gifencoder");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "neoncard",
    aliases: ["fakecard", "ghostcard", "nc"],
    version: "2.0",
    author: "Rakib",
    countDown: 5,
    role: 0,
    shortDescription: "💳 Holographic Ghost Net Neon Card (animated GIF)",
    longDescription: "আপনার নামে একটা super eye-catching animated holographic neon card তৈরি করবে — card number, expiry, CVV সহ। Reply বা mention করলে সেই নামে হবে।",
    category: "image",
    guide: { en: "{p}neoncard <name> | reply | mention" }
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

    // Generate card details
    let cardNumber = "6";
    for (let i = 0; i < 15; i++) cardNumber += rnd(0, 9);
    const exp = `${pad(rnd(1, 12), 2)}/${pad((new Date().getFullYear() + rnd(2, 6)) % 100, 2)}`;
    const cvv = pad(rnd(100, 999), 3);
    const cardType = ["PHANTOM", "SHADOW", "ETERNAL", "SPECTER", "ECLIPSE"][rnd(0, 4)];
    const tier = ["∞ INFINITE", "◆ ELITE", "★ LEGEND", "⚡ ULTRA"][rnd(0, 3)];
    const bank = "GHOST NET BANK";

    const W = 760, H = 460;
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);
    const out = path.join(cacheDir, `neoncard_${event.threadID}.gif`);

    const enc = new GIFEncoder(W, H);
    const writeStream = fs.createWriteStream(out);
    enc.createReadStream().pipe(writeStream);
    enc.start(); enc.setRepeat(0); enc.setDelay(80); enc.setQuality(8);

    const FRAMES = 24;

    for (let f = 0; f < FRAMES; f++) {
      const t = f / FRAMES;
      const hue = t * 360;
      const c1 = `hsl(${hue},100%,58%)`;
      const c2 = `hsl(${(hue + 120) % 360},100%,58%)`;
      const c3 = `hsl(${(hue + 240) % 360},100%,58%)`;
      const pulse = 0.7 + 0.3 * Math.sin(f * Math.PI * 2 / FRAMES);

      const canvas = createCanvas(W, H);
      const ctx = canvas.getContext("2d");

      // ── Deep space background ──
      ctx.fillStyle = "#000010";
      ctx.fillRect(0, 0, W, H);

      // Grid lines (matrix effect)
      ctx.strokeStyle = `rgba(0,255,200,0.06)`;
      ctx.lineWidth = 1;
      for (let gx = 0; gx < W; gx += 40) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke();
      }
      for (let gy = 0; gy < H; gy += 40) {
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
      }

      // Animated scan line
      const scanY = (f / FRAMES * H * 2) % (H + 20) - 10;
      const scanGrad = ctx.createLinearGradient(0, scanY - 4, 0, scanY + 4);
      scanGrad.addColorStop(0, "transparent");
      scanGrad.addColorStop(0.5, `rgba(0,255,200,0.25)`);
      scanGrad.addColorStop(1, "transparent");
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 4, W, 8);

      // Stars
      for (let i = 0; i < 60; i++) {
        const sx = ((i * 137 + f * 2) % W);
        const sy = ((i * 89) % H);
        const alpha = 0.2 + 0.8 * Math.abs(Math.sin(i + f * 0.3));
        ctx.fillStyle = `rgba(255,255,255,${alpha * 0.5})`;
        ctx.beginPath();
        ctx.arc(sx, sy, 0.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── Card body ──
      const cx = 40, cy = 50, cw = W - 80, ch = H - 100;

      // Outer glow behind card
      ctx.shadowColor = c1;
      ctx.shadowBlur = 60 * pulse;
      ctx.fillStyle = "rgba(0,0,0,0)";
      ctx.fillRect(cx, cy, cw, ch);
      ctx.shadowBlur = 0;

      // Card gradient
      const cardGrad = ctx.createLinearGradient(cx, cy, cx + cw, cy + ch);
      cardGrad.addColorStop(0, "#04041a");
      cardGrad.addColorStop(0.35, "#0d0428");
      cardGrad.addColorStop(0.65, "#06031e");
      cardGrad.addColorStop(1, "#020218");
      ctx.fillStyle = cardGrad;
      roundRect(ctx, cx, cy, cw, ch, 28, true, false);

      // Holographic shimmer overlay
      const shimX = ((f / FRAMES) * (cw + 300)) - 150;
      const shim = ctx.createLinearGradient(cx + shimX - 80, cy, cx + shimX + 80, cy + ch);
      shim.addColorStop(0, "rgba(255,255,255,0)");
      shim.addColorStop(0.4, `rgba(255,255,255,0.07)`);
      shim.addColorStop(0.5, `rgba(255,255,255,0.12)`);
      shim.addColorStop(0.6, `rgba(255,255,255,0.07)`);
      shim.addColorStop(1, "rgba(255,255,255,0)");
      ctx.save();
      roundRect(ctx, cx, cy, cw, ch, 28, false, false);
      ctx.clip();
      ctx.fillStyle = shim;
      ctx.fillRect(cx, cy, cw, ch);
      ctx.restore();

      // Triple-layer cycling neon border
      const borders = [
        { w: 5, color: c1, blur: 45 * pulse, off: 0 },
        { w: 2, color: c2, blur: 22, off: -7 },
        { w: 1.5, color: c3, blur: 15, off: 7 }
      ];
      for (const b of borders) {
        ctx.lineWidth = b.w;
        ctx.strokeStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = b.blur;
        roundRect(ctx, cx + b.off, cy + b.off, cw - b.off * 2, ch - b.off * 2, 28, false, true);
      }
      ctx.shadowBlur = 0;

      // Inner glass border
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      roundRect(ctx, cx + 14, cy + 14, cw - 28, ch - 28, 18, false, true);

      // ── Top header ──
      ctx.font = "bold 17px Arial";
      ctx.textAlign = "left";
      ctx.fillStyle = c1;
      ctx.shadowColor = c1; ctx.shadowBlur = 20;
      ctx.fillText(`👻 ${bank}`, cx + 28, cy + 35);
      ctx.shadowBlur = 0;

      ctx.font = "9px monospace";
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.fillText(`${cardType} SERIES  ▸  ${tier}`, cx + 28, cy + 52);

      // ── GN logo (top-right) ──
      ctx.font = "italic bold 38px Arial";
      ctx.textAlign = "right";
      ctx.fillStyle = c2;
      ctx.shadowColor = c2; ctx.shadowBlur = 30 * pulse;
      ctx.fillText("GN 👻", cx + cw - 22, cy + 55);
      ctx.shadowBlur = 0;

      // ── EMV Chip ──
      const chipX = cx + 28, chipY = cy + 100;
      const chipGrad = ctx.createLinearGradient(chipX, chipY, chipX + 68, chipY + 48);
      chipGrad.addColorStop(0, "#ffe060");
      chipGrad.addColorStop(0.4, "#fff4aa");
      chipGrad.addColorStop(1, "#b8860b");
      ctx.fillStyle = chipGrad;
      roundRect(ctx, chipX, chipY, 68, 48, 8, true, false);
      ctx.strokeStyle = "rgba(0,0,0,0.3)"; ctx.lineWidth = 1;
      for (let i = 1; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(chipX + 4, chipY + (48 / 5) * i);
        ctx.lineTo(chipX + 64, chipY + (48 / 5) * i);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(chipX + 34, chipY); ctx.lineTo(chipX + 34, chipY + 48); ctx.stroke();

      // ── Contactless icon ──
      const wx = chipX + 96, wy = chipY + 24;
      ctx.strokeStyle = `rgba(255,255,255,0.8)`; ctx.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(wx, wy, 7 + i * 7, -Math.PI / 4, Math.PI / 4);
        ctx.stroke();
      }

      // ── NFC label ──
      ctx.font = "7px monospace";
      ctx.textAlign = "left";
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.fillText("NFC", wx - 7, wy + 28);

      // ── Card number ──
      ctx.font = "bold 34px monospace";
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = c1; ctx.shadowBlur = 18;
      ctx.fillText(formatCard(cardNumber), cx + 28, cy + 210);
      ctx.shadowBlur = 0;

      // ── Labels row ──
      ctx.font = "8px monospace";
      ctx.fillStyle = "rgba(255,255,255,0.45)";
      ctx.fillText("VALID THRU", cx + 28, cy + 240);
      ctx.fillText("CVV", cx + 200, cy + 240);
      ctx.fillText("BALANCE", cx + 300, cy + 240);

      ctx.font = "bold 19px monospace";
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = c3; ctx.shadowBlur = 10;
      ctx.fillText(exp, cx + 28, cy + 262);
      ctx.fillText(cvv, cx + 200, cy + 262);
      ctx.fillStyle = c2;
      ctx.fillText("∞ GHOST", cx + 300, cy + 262);
      ctx.shadowBlur = 0;

      // ── Divider line ──
      const divGrad = ctx.createLinearGradient(cx + 28, 0, cx + cw - 28, 0);
      divGrad.addColorStop(0, "transparent");
      divGrad.addColorStop(0.3, c1);
      divGrad.addColorStop(0.7, c2);
      divGrad.addColorStop(1, "transparent");
      ctx.strokeStyle = divGrad; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx + 28, cy + 278); ctx.lineTo(cx + cw - 28, cy + 278);
      ctx.stroke();

      // ── Cardholder name ──
      ctx.font = "bold 24px monospace";
      ctx.textAlign = "left";
      ctx.fillStyle = c1;
      ctx.shadowColor = c1; ctx.shadowBlur = 20 * pulse;
      ctx.fillText(cardName, cx + 28, cy + ch - 40);
      ctx.shadowBlur = 0;

      // ── Security badge (bottom-right) ──
      ctx.font = "9px monospace";
      ctx.textAlign = "right";
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.fillText("🔐 GHOST SECURE™", cx + cw - 22, cy + ch - 40);
      ctx.fillText(`ID: GN-${cardNumber.slice(-6)}`, cx + cw - 22, cy + ch - 24);

      // ── Bottom rainbow strip ──
      const stripGrad = ctx.createLinearGradient(0, H - 46, W, H - 46);
      stripGrad.addColorStop(0, c1);
      stripGrad.addColorStop(0.33, c2);
      stripGrad.addColorStop(0.66, c3);
      stripGrad.addColorStop(1, c1);
      ctx.fillStyle = stripGrad;
      ctx.shadowColor = c2; ctx.shadowBlur = 20;
      ctx.fillRect(0, H - 46, W, 5);
      ctx.shadowBlur = 0;

      // ── Footer text ──
      ctx.font = "bold 13px Arial";
      ctx.textAlign = "center";
      ctx.fillStyle = c3;
      ctx.shadowColor = c3; ctx.shadowBlur = 12;
      ctx.fillText("💀 Ghost Net Edition  •  Powered by GN Secure System 💀", W / 2, H - 20);
      ctx.shadowBlur = 0;

      // ── Corner glows ──
      for (const [gx, gy] of [[cx, cy], [cx + cw, cy], [cx, cy + ch], [cx + cw, cy + ch]]) {
        const cg = ctx.createRadialGradient(gx, gy, 0, gx, gy, 30);
        cg.addColorStop(0, `rgba(255,255,255,${0.15 * pulse})`);
        cg.addColorStop(1, "transparent");
        ctx.fillStyle = cg;
        ctx.fillRect(gx - 30, gy - 30, 60, 60);
      }

      enc.addFrame(ctx);
    }

    enc.finish();
    await new Promise(r => writeStream.on("finish", r));

    await message.reaction("✅", event.messageID);
    await message.reply({
      body: `💳 𝗡𝗘𝗢𝗡 𝗛𝗢𝗟𝗢 𝗖𝗔𝗥𝗗 ▸ 𝗚𝗛𝗢𝗦𝗧 𝗡𝗘𝗧
━━━━━━━━━━━━━━━━━━━
👤 Holder  : ${cardName}
🔢 Number  : ${formatCard(cardNumber)}
📅 Expiry  : ${exp}
🔒 CVV     : ${cvv}
💫 Series  : ${cardType} — ${tier}
🏦 Bank    : GHOST NET BANK
━━━━━━━━━━━━━━━━━━━
👻 Ghost Net Edition`,
      attachment: fs.createReadStream(out)
    });
    setTimeout(() => fs.existsSync(out) && fs.unlinkSync(out), 10000);
  }
};

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
