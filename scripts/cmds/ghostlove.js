const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "ghostlove",
    aliases: ["lovecheck", "lovebn"],
    version: "1.0",
    author: "Rakib",
    countDown: 5,
    role: 0,
    shortDescription: "তোমার আর crush এর love compatibility",
    longDescription: "Mention/reply করো — Ghost Net বলবে কতটা মিল আছে",
    category: "fun",
    guide: { en: "{p}ghostlove @mention | reply" }
  },

  onStart: async function ({ event, message, api }) {
    const uid1 = event.senderID;
    let uid2 = null;
    if (event.type === "message_reply") uid2 = event.messageReply.senderID;
    else if (Object.keys(event.mentions || {}).length) uid2 = Object.keys(event.mentions)[0];
    if (!uid2 || uid1 === uid2) return message.reply("👻 কাউকে mention বা reply করো — নিজের সাথে নিজে love test হয় না 😂");

    await message.reaction("⏳", event.messageID);
    let name1 = "তুমি", name2 = "Crush";
    try {
      const info = await api.getUserInfo([uid1, uid2]);
      name1 = info[uid1]?.name || name1;
      name2 = info[uid2]?.name || name2;
    } catch {}

    const seed = (parseInt(uid1) + parseInt(uid2)) % 1000;
    const score = (seed * 13) % 101;
    const status = score >= 90 ? "💖 Soul Mate!" : score >= 75 ? "💕 Match!" : score >= 50 ? "💞 মন্দ না" : score >= 25 ? "💔 কঠিন" : "☠️ ভুলে যাও";
    const verdict = score >= 90 ? "তোমাদের জুটি জান্নাতে লেখা আছে! 🌙" :
      score >= 75 ? "ভালো জোড়া — সাহস করে বলে দাও! 💪" :
      score >= 50 ? "সম্ভাবনা আছে, একটু সময় দাও ⏳" :
      score >= 25 ? "একটু কঠিন, কিন্তু অসম্ভব না 🤞" :
      "ভাই/বোনের চোখে দেখো — এটাই healthy 😅";

    const W = 800, H = 480;
    const canvas = createCanvas(W, H);
    const ctx = canvas.getContext("2d");

    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#2a0a2a"); bg.addColorStop(1, "#0a002a");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    // Floating hearts
    for (let i = 0; i < 25; i++) {
      ctx.fillStyle = `rgba(255,${rnd(50,150)},${rnd(150,200)},${Math.random() * 0.3})`;
      ctx.font = `${rnd(15, 35)}px Arial`;
      ctx.fillText("❤", Math.random() * W, Math.random() * H);
    }

    // Two avatars
    const drawAv = async (uid, cx) => {
      try {
        const buf = (await axios.get(`https://graph.facebook.com/${uid}/picture?width=300`, { responseType: "arraybuffer" })).data;
        const av = await loadImage(Buffer.from(buf));
        const r = 90;
        ctx.save(); ctx.beginPath(); ctx.arc(cx, 180, r, 0, Math.PI * 2); ctx.clip();
        ctx.drawImage(av, cx - r, 90, r * 2, r * 2); ctx.restore();
        ctx.beginPath(); ctx.arc(cx, 180, r + 5, 0, Math.PI * 2);
        ctx.strokeStyle = "#ff66cc"; ctx.lineWidth = 5;
        ctx.shadowColor = "#ff66cc"; ctx.shadowBlur = 25; ctx.stroke();
        ctx.shadowBlur = 0;
      } catch {}
    };
    await drawAv(uid1, 200);
    await drawAv(uid2, 600);

    // Big heart between
    ctx.font = "100px Arial"; ctx.textAlign = "center";
    ctx.fillStyle = "#ff3366"; ctx.shadowColor = "#ff0066"; ctx.shadowBlur = 30;
    ctx.fillText("❤", W / 2, 215);
    ctx.shadowBlur = 0;

    // Score
    ctx.font = "bold 72px Arial"; ctx.fillStyle = "#fff";
    ctx.shadowColor = "#ff66cc"; ctx.shadowBlur = 20;
    ctx.fillText(`${score}%`, W / 2, 320);
    ctx.shadowBlur = 0;

    ctx.font = "bold 28px Arial"; ctx.fillStyle = "#ff99cc";
    ctx.fillText(status, W / 2, 360);

    ctx.font = "20px Arial"; ctx.fillStyle = "#fff";
    ctx.fillText(`${name1.slice(0, 15)}  ❤  ${name2.slice(0, 15)}`, W / 2, 420);
    ctx.font = "italic 16px Arial"; ctx.fillStyle = "#ff66cc";
    ctx.fillText(verdict, W / 2, 450);

    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);
    const out = path.join(cacheDir, `ghostlove_${uid1}_${uid2}.png`);
    fs.writeFileSync(out, canvas.toBuffer("image/png"));

    await message.reaction("✅", event.messageID);
    await message.reply({
      body: `👻 𝗚𝗛𝗢𝗦𝗧 𝗟𝗢𝗩𝗘 𝗧𝗘𝗦𝗧\n━━━━━━━━━━━━━━━━\n💑 ${name1} ❤ ${name2}\n💯 Match: ${score}%\n${status}\n📝 ${verdict}`,
      attachment: fs.createReadStream(out)
    });
    setTimeout(() => fs.existsSync(out) && fs.unlinkSync(out), 5000);
  }
};
function rnd(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
