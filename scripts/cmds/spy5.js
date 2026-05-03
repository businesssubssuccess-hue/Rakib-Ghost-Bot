const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "spy5",
    aliases: ["wantedposter"],
    version: "1.0",
    author: "Rakib",
    countDown: 5,
    role: 0,
    shortDescription: "Old western WANTED poster spy card",
    category: "info",
    guide: { en: "{p}spy5 @mention | reply | <uid>" }
  },

  onStart: async function ({ event, message, args, api, usersData }) {
    const uid = await resolveUID(event, args);
    await message.reaction("⏳", event.messageID);
    const info = (await api.getUserInfo(uid))[uid] || {};
    const u = await usersData.get(uid).catch(() => ({}));
    const name = (info.name || u.name || "Unknown").toUpperCase();
    const bounty = rnd(50, 999) * 1000;

    const W = 700, H = 950;
    const canvas = createCanvas(W, H);
    const ctx = canvas.getContext("2d");

    // Aged parchment
    const bg = ctx.createRadialGradient(W / 2, H / 2, 50, W / 2, H / 2, W);
    bg.addColorStop(0, "#e8d4a0"); bg.addColorStop(1, "#8b6f3f");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    // Stains & spots
    for (let i = 0; i < 800; i++) {
      ctx.fillStyle = `rgba(80,50,20,${Math.random() * 0.18})`;
      ctx.fillRect(Math.random() * W, Math.random() * H, Math.random() * 3, Math.random() * 3);
    }
    // Burnt edges
    ctx.strokeStyle = "rgba(60,30,10,0.8)"; ctx.lineWidth = 12;
    ctx.strokeRect(0, 0, W, H);

    // WANTED title
    ctx.fillStyle = "#3a1a08";
    ctx.font = "bold 90px 'Times New Roman'";
    ctx.textAlign = "center";
    ctx.fillText("WANTED", W / 2, 100);
    ctx.font = "italic 24px 'Times New Roman'";
    ctx.fillText("— DEAD OR ALIVE —", W / 2, 135);

    // Photo
    try {
      const _avUrl = await usersData.getAvatarUrl(uid).catch(() => null);
      const av = _avUrl ? await loadImage(_avUrl).catch(() => null) : null;
      const ax = (W - 380) / 2, ay = 180, as = 380;
      ctx.fillStyle = "#3a1a08"; ctx.fillRect(ax - 8, ay - 8, as + 16, as + 16);
      // Sepia avatar
      ctx.save();
      ctx.beginPath(); ctx.rect(ax, ay, as, as); ctx.clip();
      ctx.drawImage(av, ax, ay, as, as);
      ctx.fillStyle = "rgba(120,80,30,0.35)";
      ctx.fillRect(ax, ay, as, as);
      ctx.restore();
    } catch {}

    // Name
    ctx.fillStyle = "#3a1a08";
    ctx.font = "bold 42px 'Times New Roman'";
    ctx.fillText(name.slice(0, 24), W / 2, 620);

    // Description
    ctx.font = "20px 'Times New Roman'";
    ctx.fillText(`UID: ${uid}`, W / 2, 660);
    ctx.fillText(`Wanted for crimes against Ghost Net`, W / 2, 690);

    // Reward block
    ctx.font = "italic 28px 'Times New Roman'";
    ctx.fillText("REWARD", W / 2, 760);
    ctx.font = "bold 70px 'Times New Roman'";
    ctx.fillStyle = "#5a2010";
    ctx.fillText(`$${bounty.toLocaleString()}`, W / 2, 830);
    ctx.font = "italic 18px 'Times New Roman'";
    ctx.fillStyle = "#3a1a08";
    ctx.fillText("— in Ghost Coin —", W / 2, 858);

    // Footer
    ctx.font = "bold 16px 'Times New Roman'";
    ctx.fillText("👻 By Order of Ghost Net Marshal 👻", W / 2, 910);

    const out = saveOut(__dirname, `spy5_${uid}.png`, canvas);
    await message.reaction("✅", event.messageID);
    await message.reply({ body: `🤠 WANTED: ${name}\n💰 Reward: $${bounty.toLocaleString()}`, attachment: fs.createReadStream(out) });
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
