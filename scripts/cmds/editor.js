// Advanced AI Image Editor — Rakib Islam / Ghost Net Edition
// .editor 4k + blur:5 + dark:0.4 + text:Hello + pos:center + color:white + size:50 + style:glow + vignette
const jimp = require("jimp");
const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const CACHE = path.join(__dirname, "cache");

// ─────────── Color Parser ───────────
const NAMED_COLORS = {
  white: "#ffffff", black: "#000000", red: "#ff4444",
  gold: "#ffd700", golden: "#ffd700", yellow: "#ffff00",
  cyan: "#00ffff", teal: "#00ffcc", aqua: "#00e5ff",
  pink: "#ff69b4", hotpink: "#ff1493", rose: "#ff0066",
  blue: "#4488ff", navy: "#0033aa", sky: "#87ceeb",
  green: "#44ff88", lime: "#39ff14", mint: "#3eb489",
  purple: "#aa44ff", violet: "#8800ff", lavender: "#9370db",
  orange: "#ff8844", amber: "#ffbf00", coral: "#ff6b6b",
  silver: "#c0c0c0", magenta: "#ff00ff", neon: "#39ff14",
  fire: "#ff4500", ice: "#a5f2f3",
};
function parseColor(s) {
  if (!s) return "#ffffff";
  const l = s.toLowerCase().trim();
  if (NAMED_COLORS[l]) return NAMED_COLORS[l];
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(s)) return s;
  return "#ffffff";
}

// ─────────── Position Resolver ───────────
function resolvePos(pos, W, H, size, align) {
  const pad = size + 12;
  const margin = 28;
  switch ((pos || "center").toLowerCase().replace(/-/g, "").replace(/ /g, "")) {
    case "top":         return { x: W / 2, y: pad,          align: "center" };
    case "center":      return { x: W / 2, y: H / 2 + size * 0.35, align: "center" };
    case "bottom":      return { x: W / 2, y: H - margin,   align: "center" };
    case "topleft": case "tl":
                        return { x: margin, y: pad,          align: "left" };
    case "topright": case "tr":
                        return { x: W - margin, y: pad,      align: "right" };
    case "bottomleft": case "bl":
                        return { x: margin, y: H - margin,   align: "left" };
    case "bottomright": case "br":
                        return { x: W - margin, y: H - margin, align: "right" };
    case "topcenter": case "tc":
                        return { x: W / 2, y: pad,          align: "center" };
    case "middleleft": case "ml":
                        return { x: margin, y: H / 2,       align: "left" };
    case "middleright": case "mr":
                        return { x: W - margin, y: H / 2,   align: "right" };
    default:            return { x: W / 2, y: H / 2 + size * 0.35, align: "center" };
  }
}

// ─────────── Text Drawer ───────────
function drawTextLayer(ctx, layer, W, H) {
  const { content, pos, color, size, bold, italic, style, opacity, wrap } = layer;
  if (!content || !content.trim()) return;

  ctx.save();
  ctx.globalAlpha = Math.max(0.1, Math.min(1, opacity));

  const fontStyle = `${italic ? "italic " : ""}${bold ? "bold " : ""}${size}px Arial`;
  ctx.font = fontStyle;

  const { x, y, align } = resolvePos(pos, W, H, size, bold);
  ctx.textAlign = align;
  ctx.textBaseline = "alphabetic";

  // Word wrap helper
  const lines = [];
  if (wrap) {
    const maxW = W * 0.85;
    const words = content.split(" ");
    let line = "";
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxW && line) {
        lines.push(line); line = word;
      } else { line = test; }
    }
    if (line) lines.push(line);
  } else {
    lines.push(content);
  }

  const lineHeight = size * 1.3;
  const startY = lines.length > 1 ? y - ((lines.length - 1) * lineHeight) / 2 : y;

  for (let li = 0; li < lines.length; li++) {
    const text = lines[li];
    const ty = startY + li * lineHeight;

    // Reset shadow each iteration
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    switch (style) {
      case "shadow": {
        ctx.shadowColor = "rgba(0,0,0,0.95)";
        ctx.shadowBlur = 14;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 4;
        ctx.fillStyle = color;
        ctx.fillText(text, x, ty, W - 40);
        break;
      }
      case "deepshadow": {
        // Double shadow pass for heavy shadow
        ctx.shadowColor = "rgba(0,0,0,0.9)";
        ctx.shadowBlur = 20;
        ctx.shadowOffsetX = 4;
        ctx.shadowOffsetY = 5;
        ctx.fillStyle = color;
        ctx.fillText(text, x, ty, W - 40);
        ctx.shadowOffsetX = -2; ctx.shadowOffsetY = -2;
        ctx.fillText(text, x, ty, W - 40);
        break;
      }
      case "glow": {
        for (let g = 0; g < 3; g++) {
          ctx.shadowColor = color;
          ctx.shadowBlur = 25 + g * 15;
          ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
          ctx.fillStyle = color;
          ctx.fillText(text, x, ty, W - 40);
        }
        break;
      }
      case "neon": {
        // White core + colored glow
        for (let g = 0; g < 4; g++) {
          ctx.shadowColor = color;
          ctx.shadowBlur = 15 + g * 12;
          ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
          ctx.fillStyle = g === 3 ? "#ffffff" : color;
          ctx.fillText(text, x, ty, W - 40);
        }
        break;
      }
      case "outline": case "stroke": {
        ctx.strokeStyle = "rgba(0,0,0,0.95)";
        ctx.lineWidth = Math.max(2, size * 0.1);
        ctx.lineJoin = "round";
        ctx.strokeText(text, x, ty, W - 40);
        ctx.fillStyle = color;
        ctx.fillText(text, x, ty, W - 40);
        break;
      }
      case "outline2": case "stroke2": {
        // White outline on dark
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = Math.max(2, size * 0.09);
        ctx.lineJoin = "round";
        ctx.strokeText(text, x, ty, W - 40);
        ctx.fillStyle = color;
        ctx.fillText(text, x, ty, W - 40);
        break;
      }
      case "fire": {
        // Gradient fill: yellow → red
        const grad = ctx.createLinearGradient(x - 100, ty - size, x + 100, ty + 10);
        grad.addColorStop(0, "#ffff00");
        grad.addColorStop(0.4, "#ff8800");
        grad.addColorStop(1, "#ff2200");
        ctx.shadowColor = "#ff4400";
        ctx.shadowBlur = 20;
        ctx.fillStyle = grad;
        ctx.fillText(text, x, ty, W - 40);
        break;
      }
      case "ice": {
        const grad = ctx.createLinearGradient(x - 100, ty - size, x + 100, ty + 10);
        grad.addColorStop(0, "#ffffff");
        grad.addColorStop(0.5, "#a5f2f3");
        grad.addColorStop(1, "#4488ff");
        ctx.shadowColor = "#00ccff";
        ctx.shadowBlur = 20;
        ctx.fillStyle = grad;
        ctx.fillText(text, x, ty, W - 40);
        break;
      }
      case "gold": case "golden": {
        const grad = ctx.createLinearGradient(x - 100, ty - size, x + 100, ty + 10);
        grad.addColorStop(0, "#fff7a1");
        grad.addColorStop(0.4, "#ffd700");
        grad.addColorStop(1, "#b8860b");
        ctx.shadowColor = "#ffd700";
        ctx.shadowBlur = 15;
        ctx.fillStyle = grad;
        ctx.strokeStyle = "rgba(100,70,0,0.5)";
        ctx.lineWidth = size * 0.05;
        ctx.strokeText(text, x, ty, W - 40);
        ctx.fillText(text, x, ty, W - 40);
        break;
      }
      case "plain": case "flat": {
        ctx.fillStyle = color;
        ctx.fillText(text, x, ty, W - 40);
        break;
      }
      default: {
        // Default: shadow
        ctx.shadowColor = "rgba(0,0,0,0.85)";
        ctx.shadowBlur = 12;
        ctx.shadowOffsetX = 2; ctx.shadowOffsetY = 3;
        ctx.fillStyle = color;
        ctx.fillText(text, x, ty, W - 40);
      }
    }
  }
  ctx.restore();
}

// ─────────── Option Parser ───────────
function parseOptions(input) {
  const parts = input.split(/\s*\+\s*/);
  const opts = {
    fourK: false, blur: 0, dark: 0, brightness: 0,
    contrast: 0, vignette: false, grayscale: false,
    sepia: false, sharpen: false, pixelate: false,
    flip: false, mirror: false,
    texts: []
  };
  let cur = null; // current text layer being built

  for (const raw of parts) {
    const p = raw.trim();
    const lo = p.toLowerCase();

    if (lo === "4k" || lo === "4k+" || lo === "uhd" || lo === "hd") {
      opts.fourK = true;
    } else if (lo.startsWith("blur:")) {
      opts.blur = Math.min(25, Math.max(0, parseFloat(lo.slice(5)) || 0));
    } else if (lo === "blur") {
      opts.blur = 5;
    } else if (lo.startsWith("dark:") || lo.startsWith("darkness:")) {
      const v = lo.includes("darkness:") ? lo.slice(9) : lo.slice(5);
      opts.dark = Math.min(0.92, Math.max(0, parseFloat(v) || 0));
    } else if (lo === "dark") {
      opts.dark = 0.4;
    } else if (lo.startsWith("bright:") || lo.startsWith("brightness:")) {
      const v = lo.includes("brightness:") ? lo.slice(11) : lo.slice(7);
      opts.brightness = Math.min(1, Math.max(-1, parseFloat(v) || 0));
    } else if (lo.startsWith("contrast:")) {
      opts.contrast = Math.min(1, Math.max(-1, parseFloat(lo.slice(9)) || 0));
    } else if (lo === "vignette" || lo === "vig") {
      opts.vignette = true;
    } else if (lo === "grayscale" || lo === "bw" || lo === "blackwhite" || lo === "grey") {
      opts.grayscale = true;
    } else if (lo === "sepia" || lo === "vintage") {
      opts.sepia = true;
    } else if (lo === "sharpen" || lo === "sharp") {
      opts.sharpen = true;
    } else if (lo.startsWith("pixelate:") || lo === "pixelate") {
      opts.pixelate = lo.includes(":") ? Math.max(2, parseInt(lo.split(":")[1]) || 8) : 8;
    } else if (lo === "flip") {
      opts.flip = true;
    } else if (lo === "mirror") {
      opts.mirror = true;
    }
    // ── TEXT OPTIONS ──
    else if (lo.startsWith("text:")) {
      cur = {
        content: p.slice(5).trim(),
        pos: "center", color: "#ffffff", size: 42,
        bold: true, italic: false, style: "shadow",
        opacity: 1.0, wrap: true
      };
      opts.texts.push(cur);
    } else if (lo.startsWith("pos:") && cur) {
      cur.pos = lo.slice(4).trim();
    } else if (lo.startsWith("position:") && cur) {
      cur.pos = lo.slice(9).trim();
    } else if ((lo.startsWith("color:") || lo.startsWith("col:") || lo.startsWith("clr:")) && cur) {
      const key = lo.startsWith("col:") ? "col:" : lo.startsWith("clr:") ? "clr:" : "color:";
      cur.color = parseColor(p.slice(key.length).trim());
    } else if ((lo.startsWith("size:") || lo.startsWith("font:") || lo.startsWith("sz:")) && cur) {
      const key = lo.startsWith("size:") ? 5 : lo.startsWith("font:") ? 5 : 3;
      cur.size = Math.min(140, Math.max(10, parseInt(lo.slice(key)) || 42));
    } else if ((lo === "bold" || lo === "b") && cur) {
      cur.bold = true;
    } else if ((lo === "italic" || lo === "i") && cur) {
      cur.italic = true;
    } else if ((lo === "nobold" || lo === "thin") && cur) {
      cur.bold = false;
    } else if ((lo === "nowrap" || lo === "single") && cur) {
      cur.wrap = false;
    } else if (lo.startsWith("style:") && cur) {
      cur.style = lo.slice(6).trim();
    } else if (lo.startsWith("effect:") && cur) {
      cur.style = lo.slice(7).trim();
    } else if (lo.startsWith("opacity:") && cur) {
      cur.opacity = Math.min(1, Math.max(0.05, parseFloat(lo.slice(8)) || 1));
    }
    // ── FILTER PRESETS ──
    else if (lo === "aesthetic") {
      opts.dark = 0.35; opts.vignette = true; opts.blur = 1;
    } else if (lo === "cinematic") {
      opts.dark = 0.4; opts.contrast = 0.2; opts.vignette = true;
    } else if (lo === "dreamy") {
      opts.blur = 4; opts.brightness = 0.1; opts.vignette = true;
    } else if (lo === "moody") {
      opts.dark = 0.5; opts.contrast = 0.15; opts.vignette = true;
    } else if (lo === "retro") {
      opts.sepia = true; opts.contrast = 0.1; opts.vignette = true;
    }
  }

  return opts;
}

// ─────────── Main Image Processor ───────────
async function processImage(srcBuffer, opts) {
  let img = await jimp.read(srcBuffer);

  // 4K upscale
  if (opts.fourK) {
    const W4 = Math.min(img.bitmap.width * 2, 3840);
    const H4 = Math.min(img.bitmap.height * 2, 2160);
    img = img.resize(W4, H4, jimp.RESIZE_BICUBIC);
  }

  // Flip/Mirror
  if (opts.flip)   img = img.flip(false, true);
  if (opts.mirror) img = img.flip(true, false);

  // Grayscale / Sepia
  if (opts.grayscale) img = img.grayscale();
  else if (opts.sepia) img = img.sepia();

  // Blur (jimp blur is in pixels, range 1-25)
  if (opts.blur > 0) img = img.blur(Math.round(opts.blur));

  // Pixelate
  if (opts.pixelate) img = img.pixelate(opts.pixelate);

  // Brightness (jimp: -1 to 1)
  if (opts.brightness !== 0) img = img.brightness(opts.brightness);

  // Darken = negative brightness
  if (opts.dark > 0) img = img.brightness(-opts.dark);

  // Contrast (jimp: -1 to 1)
  if (opts.contrast !== 0) img = img.contrast(opts.contrast);

  // Sharpen (simulate via normalize + contrast boost)
  if (opts.sharpen) {
    img = img.normalize().contrast(0.15);
  }

  // Convert to PNG buffer for canvas
  const processed = await img.getBufferAsync(jimp.MIME_PNG);

  // Load into canvas for text/vignette overlays
  const canvasImg = await loadImage(processed);
  const W = canvasImg.width;
  const H = canvasImg.height;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(canvasImg, 0, 0, W, H);

  // Vignette
  if (opts.vignette) {
    const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, H * 0.85);
    vig.addColorStop(0, "rgba(0,0,0,0)");
    vig.addColorStop(0.6, "rgba(0,0,0,0.15)");
    vig.addColorStop(1, "rgba(0,0,0,0.72)");
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, W, H);
  }

  // Text layers
  for (const layer of opts.texts) {
    drawTextLayer(ctx, layer, W, H);
  }

  return canvas.toBuffer("image/jpeg", { quality: 0.97 });
}

// ─────────── Help Text ───────────
const HELP_TEXT = `╔═══════════════════════════════════╗
║   🎨 Ghost Net Image Editor v2.0    ║
╚═══════════════════════════════════╝

📌 ব্যবহার: .editor [options]
📌 Reply করো ছবিতে, বা @mention করো

━━━━━━ 🖼️ IMAGE FILTERS ━━━━━━
  4k          → 4K quality upscale
  blur:<1-25>  → blur amount (default: 5)
  dark:<0-0.9> → darken (0.4 = medium)
  bright:<val> → brightness (-1 to 1)
  contrast:<v> → contrast (-1 to 1)
  vignette     → dark vignette border
  grayscale    → black & white
  sepia        → vintage/sepia tone
  sharpen      → sharper image
  mirror       → flip horizontal
  pixelate:<n> → pixelate (n=block size)

━━━━━━ ✍️ TEXT OPTIONS ━━━━━━
  text:<content>  → add text layer
  pos:<position>  → text position
  color:<color>   → text color
  size:<number>   → font size (12-140)
  style:<effect>  → text effect
  bold / italic   → font style
  opacity:<0-1>   → text transparency

📍 Positions:
  center, top, bottom
  tl, tr, bl, br
  ml, mr

🎨 Styles:
  shadow, deepshadow, glow, neon
  outline, fire, ice, gold, plain

🎨 Colors:
  white black red gold cyan pink blue
  green purple orange silver lime fire
  or #hex like color:#ff00ff

━━━━━━ 🎛️ PRESETS ━━━━━━
  aesthetic   cinematic   moody
  dreamy      retro

━━━━━━ 💡 EXAMPLES ━━━━━━
  .editor 4k + dark:0.4 + vignette
  .editor blur:8 + grayscale + vignette
  .editor 4k + dark:0.5 + text:I love you + pos:center + color:white + size:60 + style:glow + vignette
  .editor cinematic + text:GHOST NET + pos:top + color:cyan + size:50 + style:neon + text:@acs.rakib + pos:bottom + color:gold + size:28 + style:outline
  .editor 4k + dark:0.3 + text:💀 R.I.P 💀 + pos:center + color:red + size:70 + style:fire + vignette`;

// ─────────── Command Export ───────────
module.exports = {
  config: {
    name: "editor",
    aliases: ["imgedit", "imagedit", "editimg", "photoedit", "imgfx"],
    version: "2.0",
    author: "Rakib Islam",
    countDown: 20,
    role: 0,
    shortDescription: { en: "🎨 AI Image Editor — 4K, blur, dark, text, vignette & more" },
    longDescription: { en: "Powerful image editor: 4K upscale, blur, darken, vignette, grayscale, sepia, sharpen + multi-layer text with 8 text effects and full position/color/size control." },
    category: "image",
    guide: {
      en: "Reply to a photo or @mention + .editor [options]\n\n" +
          "Quick: .editor 4k + dark:0.4 + vignette\n" +
          "Text:  .editor text:Hello + pos:center + color:white + size:50 + style:glow\n" +
          "Help:  .editor help"
    }
  },

  onStart: async function ({ api, event, args, message, usersData }) {
    await fs.ensureDir(CACHE);
    const input = args.join(" ").trim();

    // ── Help ──
    if (!input || input === "help" || input === "h" || input === "?") {
      return message.reply(HELP_TEXT);
    }

    await message.reaction("⏳", event.messageID);

    // ── Get source image ──
    let imgUrl = null;

    if (event.type === "message_reply") {
      const att = event.messageReply?.attachments?.[0];
      if (att?.type === "photo") imgUrl = att.url;
    }
    if (!imgUrl && event.attachments?.length > 0) {
      const att = event.attachments.find(a => a.type === "photo");
      if (att) imgUrl = att.url;
    }
    if (!imgUrl) {
      const uid = Object.keys(event.mentions || {})[0] || null;
      if (uid) {
        try { imgUrl = await usersData.getAvatarUrl(uid); } catch {}
      }
    }

    if (!imgUrl) {
      await message.reaction("❌", event.messageID);
      return message.reply(
        "❌ কোনো ছবি পেলাম না!\n\n" +
        "📌 কিভাবে use করবে:\n" +
        "  ✦ কোনো ছবিতে reply দিয়ে .editor [options]\n" +
        "  ✦ .editor @mention [options] → ওর ছবি edit\n\n" +
        "📌 Help: .editor help"
      );
    }

    // ── Parse options ──
    const opts = parseOptions(input);

    // Check if at least one effect is requested
    const hasEffect = opts.fourK || opts.blur || opts.dark || opts.brightness ||
      opts.contrast || opts.vignette || opts.grayscale || opts.sepia ||
      opts.sharpen || opts.pixelate || opts.flip || opts.mirror || opts.texts.length > 0;

    if (!hasEffect) {
      await message.reaction("❌", event.messageID);
      return message.reply(
        "❌ কোনো effect specify করোনি!\n\n" +
        "Quick examples:\n" +
        "  .editor 4k + dark:0.4 + vignette\n" +
        "  .editor text:Ghost Net + pos:center + color:cyan + style:neon\n" +
        "  .editor blur:8 + grayscale\n\n" +
        "Full guide: .editor help"
      );
    }

    // Summary of applied effects
    const applied = [];
    if (opts.fourK)      applied.push("4K Upscale");
    if (opts.blur)       applied.push(`Blur(${opts.blur})`);
    if (opts.dark)       applied.push(`Dark(${opts.dark})`);
    if (opts.brightness) applied.push(`Bright(${opts.brightness})`);
    if (opts.contrast)   applied.push(`Contrast(${opts.contrast})`);
    if (opts.vignette)   applied.push("Vignette");
    if (opts.grayscale)  applied.push("Grayscale");
    if (opts.sepia)      applied.push("Sepia");
    if (opts.sharpen)    applied.push("Sharpen");
    if (opts.pixelate)   applied.push(`Pixelate(${opts.pixelate})`);
    if (opts.mirror)     applied.push("Mirror");
    if (opts.flip)       applied.push("Flip");
    opts.texts.forEach((t, i) => applied.push(`Text${i + 1}:"${t.content.slice(0, 12)}${t.content.length > 12 ? ".." : ""}"`));

    await message.reply(`🎨 Processing...\n✦ Effects: ${applied.join(" → ")}`);

    try {
      // Download source image
      const srcResp = await axios.get(imgUrl, { responseType: "arraybuffer", timeout: 15000 });
      const srcBuffer = Buffer.from(srcResp.data);

      // Process
      const resultBuffer = await processImage(srcBuffer, opts);

      const outPath = path.join(CACHE, `editor_${Date.now()}.jpg`);
      await fs.writeFile(outPath, resultBuffer);

      await message.reaction("✅", event.messageID);
      await message.reply({
        body:
          `╔════════════════════════╗\n` +
          `║  ✅ Edit Complete! 🎨   ║\n` +
          `╚════════════════════════╝\n` +
          `  ✦ Effects: ${applied.length}টা apply হয়েছে\n` +
          `  ✦ ${applied.join(" • ")}\n\n` +
          `💡 .editor help → সব options দেখো`,
        attachment: fs.createReadStream(outPath)
      });

      setTimeout(() => { try { fs.unlinkSync(outPath); } catch {} }, 30000);
    } catch (err) {
      await message.reaction("❌", event.messageID);
      message.reply(
        "❌ Image processing এ error!\n" +
        (err.message?.slice(0, 100) || "Unknown error") + "\n\n" +
        "💡 আবার try করো অথবা .editor help দেখো"
      );
    }
  }
};
