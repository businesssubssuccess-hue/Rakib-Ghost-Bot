const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "spy6",
    aliases: ["terminalspy"],
    version: "1.0",
    author: "Rakib",
    countDown: 5,
    role: 0,
    shortDescription: "Hacker terminal style spy profile",
    category: "info",
    guide: { en: "{p}spy6 @mention | reply | <uid>" }
  },

  onStart: async function ({ event, message, args, api, usersData }) {
    const uid = await resolveUID(event, args);
    await message.reaction("⏳", event.messageID);
    const info = (await api.getUserInfo(uid))[uid] || {};
    const u = await usersData.get(uid).catch(() => ({}));
    const name = info.name || u.name || "Unknown";

    const W = 850, H = 600;
    const canvas = createCanvas(W, H);
    const ctx = canvas.getContext("2d");

    // Terminal background
    ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H);
    // Subtle scanlines
    for (let y = 0; y < H; y += 3) {
      ctx.fillStyle = "rgba(0,255,70,0.04)";
      ctx.fillRect(0, y, W, 1);
    }

    // Title bar
    ctx.fillStyle = "#1a1a1a"; ctx.fillRect(0, 0, W, 30);
    ctx.fillStyle = "#ff5555"; ctx.beginPath(); ctx.arc(15, 15, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#ffaa00"; ctx.beginPath(); ctx.arc(35, 15, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#00cc44"; ctx.beginPath(); ctx.arc(55, 15, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#888"; ctx.font = "12px monospace"; ctx.textAlign = "center";
    ctx.fillText("ghost@net:~/spy/$ ./profile.sh " + uid, W / 2, 20);

    // Avatar (right side, ASCII frame)
    try {
      const _avUrl = await usersData.getAvatarUrl(uid).catch(() => null);
      const av = _avUrl ? await loadImage(_avUrl).catch(() => null) : null;
      const ax = W - 250, ay = 70, as = 200;
      ctx.save(); ctx.beginPath(); ctx.rect(ax, ay, as, as); ctx.clip();
      ctx.drawImage(av, ax, ay, as, as);
      ctx.restore();
      ctx.strokeStyle = "#0f0"; ctx.lineWidth = 2;
      ctx.shadowColor = "#0f0"; ctx.shadowBlur = 15;
      ctx.strokeRect(ax, ay, as, as);
      ctx.shadowBlur = 0;
      // Label
      ctx.fillStyle = "#0f0"; ctx.font = "12px monospace"; ctx.textAlign = "center";
      ctx.fillText(`[ TARGET.JPG ]`, ax + as / 2, ay + as + 20);
    } catch {}

    // Terminal text
    ctx.font = "16px monospace"; ctx.textAlign = "left"; ctx.fillStyle = "#0f0";
    ctx.shadowColor = "#0f0"; ctx.shadowBlur = 6;
    const lines = [
      `$ whoami --target ${uid}`,
      ``,
      `[+] Connection established to Ghost Net`,
      `[+] Decrypting profile data...`,
      `[+] Access granted ✓`,
      ``,
      `╔═══════════════════════════════════╗`,
      `║  PROFILE INFO                     ║`,
      `╠═══════════════════════════════════╣`,
      `║  name    : ${name.slice(0, 24).padEnd(24)}  ║`,
      `║  uid     : ${uid.padEnd(24)}  ║`,
      `║  gender  : ${(info.gender === 1 ? "female" : info.gender === 2 ? "male" : "unknown").padEnd(24)}  ║`,
      `║  vanity  : ${(info.vanity || "—").slice(0, 24).padEnd(24)}  ║`,
      `║  money   : $${(u.money || 0).toLocaleString().padEnd(23)}  ║`,
      `║  exp     : ${String(u.exp || 0).padEnd(24)}  ║`,
      `║  type    : ${(info.type || "user").padEnd(24)}  ║`,
      `║  friend  : ${(info.isFriend ? "yes" : "no").padEnd(24)}  ║`,
      `╚═══════════════════════════════════╝`,
      ``,
      `[!] Surveillance active.`,
      `$ _`
    ];
    let y = 50; for (const l of lines) { ctx.fillText(l, 20, y); y += 22; }

    const out = saveOut(__dirname, `spy6_${uid}.png`, canvas);
    await message.reaction("✅", event.messageID);
    await message.reply({ body: `💻 Terminal scan: ${name}`, attachment: fs.createReadStream(out) });
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
