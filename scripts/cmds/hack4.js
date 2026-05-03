const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "hack4",
    aliases: ["fbihack"],
    version: "1.0",
    author: "Rakib",
    countDown: 5,
    role: 0,
    shortDescription: "FBI surveillance prank with target's avatar",
    category: "prank",
    guide: { en: "{p}hack4 @mention | reply | <uid>" }
  },

  onStart: async function ({ event, message, args, api, usersData }) {
    let uid = event.senderID;
    if (event.type === "message_reply") uid = event.messageReply.senderID;
    else if (Object.keys(event.mentions || {}).length) uid = Object.keys(event.mentions)[0];
    else if (args[0] && /^\d+$/.test(args[0])) uid = args[0];

    await message.reaction("⏳", event.messageID);
    let name = "Unknown Target";
    try { name = (await api.getUserInfo(uid))[uid].name; } catch {}

    const W = 900, H = 600;
    const canvas = createCanvas(W, H);
    const ctx = canvas.getContext("2d");

    // Dark gradient background
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#0a0a0a");
    bg.addColorStop(1, "#1a0000");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Crosshair grid
    ctx.strokeStyle = "rgba(255,0,0,0.15)";
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    // FBI Header bar
    ctx.fillStyle = "#1a0000";
    ctx.fillRect(0, 0, W, 70);
    ctx.fillStyle = "#ff1a1a";
    ctx.fillRect(0, 67, W, 3);
    ctx.shadowColor = "#ff0000"; ctx.shadowBlur = 25;
    ctx.fillStyle = "#ffd700";
    ctx.font = "bold 36px Arial";
    ctx.textAlign = "center";
    ctx.fillText("⚠ FBI SURVEILLANCE PROTOCOL ⚠", W / 2, 45);
    ctx.shadowBlur = 0;

    // Avatar with red targeting
    try {
      const _avUrl = await usersData.getAvatarUrl(uid).catch(() => null);
      const av = _avUrl ? await loadImage(_avUrl).catch(() => null) : null;
      const ax = 50, ay = 120, as = 280;
      ctx.save();
      ctx.beginPath();
      ctx.rect(ax, ay, as, as);
      ctx.clip();
      ctx.drawImage(av, ax, ay, as, as);
      ctx.restore();

      // Red corner brackets
      ctx.strokeStyle = "#ff1a1a";
      ctx.lineWidth = 5;
      ctx.shadowColor = "#ff0000"; ctx.shadowBlur = 15;
      const cl = 35;
      [[ax, ay, 1, 1], [ax + as, ay, -1, 1], [ax, ay + as, 1, -1], [ax + as, ay + as, -1, -1]].forEach(([x, y, dx, dy]) => {
        ctx.beginPath();
        ctx.moveTo(x, y + dy * cl);
        ctx.lineTo(x, y);
        ctx.lineTo(x + dx * cl, y);
        ctx.stroke();
      });
      ctx.shadowBlur = 0;

      // Crosshair on face
      ctx.strokeStyle = "rgba(255,0,0,0.6)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(ax + as / 2, ay); ctx.lineTo(ax + as / 2, ay + as);
      ctx.moveTo(ax, ay + as / 2); ctx.lineTo(ax + as, ay + as / 2);
      ctx.stroke();
    } catch {}

    // Right-side dossier
    const px = 380, py = 130;
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    ctx.fillRect(px, py, 480, 280);
    ctx.strokeStyle = "#ff1a1a";
    ctx.lineWidth = 2;
    ctx.strokeRect(px, py, 480, 280);

    ctx.fillStyle = "#ff3333";
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "left";
    ctx.fillText("◤ CLASSIFIED DOSSIER ◢", px + 20, py + 35);

    ctx.fillStyle = "#ffffff";
    ctx.font = "16px monospace";
    const dossier = [
      `▸ Target Name : ${name}`,
      `▸ FB UID      : ${uid}`,
      `▸ Status      : 🔴 UNDER SURVEILLANCE`,
      `▸ Threat Lvl  : ${["LOW", "MEDIUM", "HIGH", "CRITICAL"][Math.floor(Math.random() * 4)]}`,
      `▸ IP Tracked  : 192.168.${rnd(1,255)}.${rnd(1,255)}`,
      `▸ Location    : Triangulating...`,
      `▸ Devices     : ${rnd(2, 7)} active`,
      `▸ Wiretap     : ✅ ACTIVE`,
      `▸ Agent       : 👻 GHOST-NET-007`
    ];
    let yy = py + 70;
    for (const line of dossier) { ctx.fillText(line, px + 20, yy); yy += 24; }

    // Bottom warning
    ctx.fillStyle = "#ff1a1a";
    ctx.fillRect(0, H - 60, W, 60);
    ctx.fillStyle = "#ffd700";
    ctx.font = "bold 22px Arial";
    ctx.textAlign = "center";
    ctx.shadowColor = "#000"; ctx.shadowBlur = 5;
    ctx.fillText("☠ DO NOT MOVE — YOU ARE BEING WATCHED ☠", W / 2, H - 22);

    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);
    const out = path.join(cacheDir, `hack4_${uid}.png`);
    fs.writeFileSync(out, canvas.toBuffer("image/png"));

    await message.reaction("✅", event.messageID);
    await message.reply({
      body: `🚨 FBI আপনার বাড়ির সামনে দাঁড়িয়ে আছে!\n👻 ${name} এর full surveillance শুরু হলো।\n\n(Just a prank 😆 — Ghost Net Edition)`,
      attachment: fs.createReadStream(out)
    });
    setTimeout(() => fs.unlinkSync(out), 5000);
  }
};
const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
