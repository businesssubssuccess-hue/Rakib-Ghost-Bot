const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "spy4",
    aliases: ["fbispy", "dossier"],
    version: "1.0",
    author: "Rakib",
    countDown: 5,
    role: 0,
    shortDescription: "FBI dossier style spy card",
    category: "info",
    guide: { en: "{p}spy4 @mention | reply | <uid>" }
  },

  onStart: async function ({ event, message, args, api, usersData }) {
    const uid = await resolveUID(event, args);
    await message.reaction("⏳", event.messageID);
    const info = (await api.getUserInfo(uid))[uid] || {};
    const u = await usersData.get(uid).catch(() => ({}));
    const name = info.name || u.name || "Unknown";

    const W = 800, H = 1000;
    const canvas = createCanvas(W, H);
    const ctx = canvas.getContext("2d");

    // Aged paper background
    const bg = ctx.createRadialGradient(W / 2, H / 2, 100, W / 2, H / 2, W);
    bg.addColorStop(0, "#f4ecd8"); bg.addColorStop(1, "#c9b88a");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 400; i++) {
      ctx.fillStyle = `rgba(60,40,20,${Math.random() * 0.1})`;
      ctx.fillRect(Math.random() * W, Math.random() * H, 1, 1);
    }

    // Header
    ctx.fillStyle = "#1a1a1a"; ctx.fillRect(0, 0, W, 110);
    ctx.fillStyle = "#cc0000"; ctx.fillRect(0, 110, W, 6);

    ctx.fillStyle = "#fff"; ctx.font = "bold 36px Arial"; ctx.textAlign = "center";
    ctx.fillText("⚠ FEDERAL BUREAU OF GHOST NET ⚠", W / 2, 50);
    ctx.font = "16px Arial"; ctx.fillStyle = "#ff6666";
    ctx.fillText("CLASSIFIED DOSSIER — TOP SECRET", W / 2, 80);

    // Stamp "CONFIDENTIAL"
    ctx.save();
    ctx.translate(W - 120, 200);
    ctx.rotate(-0.3);
    ctx.strokeStyle = "rgba(204,0,0,0.5)"; ctx.lineWidth = 5;
    ctx.strokeRect(-90, -25, 180, 50);
    ctx.font = "bold 24px Arial"; ctx.textAlign = "center";
    ctx.fillStyle = "rgba(204,0,0,0.5)";
    ctx.fillText("CONFIDENTIAL", 0, 8);
    ctx.restore();

    // Mugshot
    try {
      const _avUrl = await usersData.getAvatarUrl(uid).catch(() => null);
      const av = _avUrl ? await loadImage(_avUrl).catch(() => null) : null;
      const ax = 50, ay = 160, as = 280;
      ctx.fillStyle = "#000"; ctx.fillRect(ax - 4, ay - 4, as + 8, as + 8);
      ctx.drawImage(av, ax, ay, as, as);
      // Height markers
      ctx.fillStyle = "#fff"; ctx.font = "12px monospace"; ctx.textAlign = "left";
      for (let i = 0; i < 7; i++) {
        const yy = ay + (as / 6) * i;
        ctx.fillRect(ax + as + 6, yy - 1, 8, 2);
        ctx.fillStyle = "rgba(0,0,0,0.6)"; ctx.fillText(`${6 - i}'`, ax + as + 18, yy + 4);
        ctx.fillStyle = "#fff";
      }
    } catch {}

    // Right column data
    const px = 380, py = 170;
    ctx.fillStyle = "rgba(0,0,0,0.85)"; ctx.fillRect(px, py, 380, 280);
    ctx.fillStyle = "#ffd700"; ctx.font = "bold 22px Arial"; ctx.textAlign = "left";
    ctx.fillText("◤ SUBJECT FILE ◢", px + 15, py + 30);

    ctx.fillStyle = "#fff"; ctx.font = "16px monospace";
    const data = [
      `NAME   : ${name}`,
      `ALIAS  : ${info.firstName || "—"}`,
      `UID #  : ${uid}`,
      `GENDER : ${info.gender === 1 ? "Female" : info.gender === 2 ? "Male" : "Unknown"}`,
      `STATUS : ${info.isFriend ? "ALLY" : "TARGET"}`,
      `VANITY : ${info.vanity || "—"}`,
      `WEALTH : $${(u.money || 0).toLocaleString()}`,
      `EXP LV : ${u.exp || 0}`,
      `THREAT : ${["LOW", "MEDIUM", "HIGH"][Math.floor(Math.random() * 3)]}`
    ];
    let y = py + 60; for (const l of data) { ctx.fillText(l, px + 15, y); y += 24; }

    // Notes section
    const ny = 480;
    ctx.fillStyle = "#1a1a1a"; ctx.fillRect(40, ny, W - 80, 380);
    ctx.fillStyle = "#cc0000"; ctx.font = "bold 22px Arial"; ctx.textAlign = "left";
    ctx.fillText("FIELD NOTES:", 60, ny + 35);

    ctx.fillStyle = "#f4ecd8"; ctx.font = "italic 16px Arial";
    const notes = [
      `▸ Subject identified through Ghost Net intel grid.`,
      `▸ Active on Messenger network — frequent target.`,
      `▸ Last seen: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Dhaka" })}`,
      `▸ Bot interaction logs: ${rnd(50, 5000)} entries`,
      `▸ Recommended action: continued surveillance.`,
      `▸ Authorization: Agent 👻 GN-007`,
      ``,
      `>>> END OF FILE — DO NOT DISTRIBUTE <<<`
    ];
    let ny2 = ny + 70;
    for (const n of notes) { ctx.fillText(n, 60, ny2); ny2 += 26; }

    // Footer
    ctx.fillStyle = "#cc0000"; ctx.fillRect(0, H - 30, W, 30);
    ctx.fillStyle = "#fff"; ctx.font = "bold 16px Arial"; ctx.textAlign = "center";
    ctx.fillText("👻 GHOST NET FEDERAL DIVISION 👻", W / 2, H - 9);

    const out = saveOut(__dirname, `spy4_${uid}.png`, canvas);
    await message.reaction("✅", event.messageID);
    await message.reply({ body: `📁 FBI Dossier of ${name}`, attachment: fs.createReadStream(out) });
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
