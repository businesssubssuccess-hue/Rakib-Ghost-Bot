const Jimp = require("jimp");
const fs = require("fs-extra");
const path = require("path");

const ACS_LOGO_URL = "https://i.ibb.co/V04ZgMWf/20260502-080850.png";

const COLORS = {
  "green":   "#013220",
  "darkgreen": "#013220",
  "black":   "#000000",
  "red":     "#8B0000",
  "blue":    "#00008B",
  "purple":  "#2E0053",
  "navy":    "#001F3F",
  "maroon":  "#3B0000",
  "teal":    "#003333",
  "gray":    "#1a1a1a",
  "orange":  "#7A2500",
  "white":   "#FFFFFF",
};

function parseArgs(args) {
  const opts = { border: 35, logo: 25, color: "#013220" };
  for (const arg of args) {
    const n = parseInt(arg);
    if (!isNaN(n) && n >= 5 && n <= 60) {
      if (opts.border === 35) opts.border = n;
      else opts.logo = n;
    } else {
      const colorKey = arg.toLowerCase().replace(/\s+/g, "");
      if (COLORS[colorKey]) opts.color = COLORS[colorKey];
    }
  }
  return opts;
}

module.exports = {
  config: {
    name: "acs",
    aliases: ["acslogo", "acs-rakib"],
    version: "5.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Add ACS logo & border to photo — fully customizable" },
    longDescription: { en: "Add ACS logo and colored border to any photo. Customize border %, logo %, and color from GC." },
    category: "image",
    guide: {
      en: "Reply to a photo:\n{p}acs [border%] [logo%] [color]\n\n" +
        "Defaults: border=35, logo=25, color=green\n\n" +
        "Colors: green, black, red, blue, purple, navy, maroon, teal, gray, orange, white\n\n" +
        "Examples:\n" +
        "{p}acs\n" +
        "{p}acs 40 30 black\n" +
        "{p}acs 50 20 red\n" +
        "{p}acs 25 35 blue"
    }
  },

  onStart: async function ({ message, event, args }) {
    let imageUrl;

    if (event.type === "message_reply") {
      const att = event.messageReply?.attachments?.[0];
      if (att?.type === "photo") imageUrl = att.url;
    } else if (event.attachments?.[0]?.type === "photo") {
      imageUrl = event.attachments[0].url;
    }

    if (!imageUrl) {
      return message.reply(
        `╔══════════════════════╗\n` +
        `║   🖼️ ACS Image Tool   ║\n` +
        `╚══════════════════════╝\n\n` +
        `📌 ব্যবহার: ছবিতে reply করো\n\n` +
        `  .acs                    → default\n` +
        `  .acs 40 30 black        → border 40%, logo 30%\n` +
        `  .acs 50 20 red          → border 50%, logo 20%\n` +
        `  .acs 25 35 blue         → border 25%, logo 35%\n\n` +
        `🎨 Colors:\n` +
        `  green, black, red, blue,\n` +
        `  purple, navy, teal, gray,\n` +
        `  maroon, orange, white\n\n` +
        `  ✦ Border range: 5–60%\n` +
        `  ✦ Logo range: 5–60%`
      );
    }

    const opts = parseArgs(args);

    await message.reaction("⏳", event.messageID);

    try {
      const cacheDir = path.join(__dirname, "cache");
      await fs.ensureDir(cacheDir);
      const tempPath = path.join(cacheDir, `acs_${Date.now()}.png`);

      const [image, logo] = await Promise.all([
        Jimp.read(imageUrl),
        Jimp.read(ACS_LOGO_URL)
      ]);

      const sideCoverWidth = Math.floor(image.getWidth() * (opts.border / 100));
      const newWidth = image.getWidth() + (sideCoverWidth * 2);
      const newHeight = image.getHeight();

      const background = new Jimp(newWidth, newHeight, opts.color + "FF");
      background.composite(image, sideCoverWidth, 0);

      const logoSize = Math.floor(newWidth * (opts.logo / 100));
      logo.resize(logoSize, Jimp.AUTO);

      const xPos = Math.floor((sideCoverWidth - logoSize) / 2 + 10);
      const yPos = Math.floor(newHeight / 2 - logo.getHeight() / 2);
      background.composite(logo, Math.max(10, xPos), Math.max(10, yPos));

      await background.writeAsync(tempPath);

      await message.reply({
        body:
          `╔══════════════════════╗\n` +
          `║  ✅ ACS Ghost Net ✅   ║\n` +
          `╚══════════════════════╝\n` +
          `  ✦ Border › ${opts.border}%\n` +
          `  ✦ Logo   › ${opts.logo}%\n` +
          `  ✦ Color  › ${opts.color}`,
        attachment: fs.createReadStream(tempPath)
      });

      await message.reaction("🔥", event.messageID);
      setTimeout(() => { try { fs.unlinkSync(tempPath); } catch {} }, 15000);

    } catch (error) {
      await message.reaction("❌", event.messageID);
      return message.reply("❌ Error: " + error.message);
    }
  }
};
