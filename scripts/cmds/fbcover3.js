// FB Cover Generator — Professional Edition v2 — Rakib Islam / Ghost Net
const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const CACHE = path.join(__dirname, "cache");

const TEMPLATES = {
  1:  { bg1:"#0f0c29", bg2:"#302b63", accent:"#a78bfa", text:"#fff",    layout:"diagonal",  font:"bold" },
  2:  { bg1:"#000000", bg2:"#111111", accent:"#ffd700", text:"#ffd700", layout:"luxury",    font:"bold" },
  3:  { bg1:"#1a1a2e", bg2:"#16213e", accent:"#e94560", text:"#fff",    layout:"split",     font:"normal" },
  4:  { bg1:"#f5f5f5", bg2:"#e8e8e8", accent:"#1a1a1a", text:"#1a1a1a",layout:"minimal",   font:"bold" },
  5:  { bg1:"#0a0a0a", bg2:"#1a1a1a", accent:"#00ffcc", text:"#00ffcc",layout:"cyber",     font:"mono" },
  6:  { bg1:"#050510", bg2:"#0a0a20", accent:"#ff00ff", text:"#fff",    layout:"neon",      font:"bold" },
  7:  { bg1:"#020212", bg2:"#050525", accent:"#00ffff", text:"#00ffff", layout:"neon",      font:"bold" },
  8:  { bg1:"#100520", bg2:"#200a30", accent:"#ff6600", text:"#fff",    layout:"neon",      font:"bold" },
  9:  { bg1:"#051020", bg2:"#0a2040", accent:"#39ff14", text:"#39ff14", layout:"hacker",    font:"mono" },
  10: { bg1:"#1a0030", bg2:"#2a0050", accent:"#ff00aa", text:"#fff",    layout:"neon",      font:"bold" },
  11: { bg1:"#134e5e", bg2:"#71b280", accent:"#fff",    text:"#fff",    layout:"wave",      font:"bold" },
  12: { bg1:"#8e0e00", bg2:"#1f1c18", accent:"#ff6b6b", text:"#fff",    layout:"diagonal",  font:"bold" },
  13: { bg1:"#005c97", bg2:"#363795", accent:"#00d2ff", text:"#fff",    layout:"geometric", font:"bold" },
  14: { bg1:"#1f4037", bg2:"#99f2c8", accent:"#fff",    text:"#fff",    layout:"wave",      font:"bold" },
  15: { bg1:"#4568dc", bg2:"#b06ab3", accent:"#fff",    text:"#fff",    layout:"diagonal",  font:"normal" },
  16: { bg1:"#003366", bg2:"#004080", accent:"#ffd700", text:"#fff",    layout:"corporate", font:"bold" },
  17: { bg1:"#1a1a1a", bg2:"#2d2d2d", accent:"#c0c0c0", text:"#fff",   layout:"corporate", font:"bold" },
  18: { bg1:"#0d1117", bg2:"#161b22", accent:"#58a6ff", text:"#fff",    layout:"github",    font:"mono" },
  19: { bg1:"#191970", bg2:"#000080", accent:"#ffd700", text:"#fff",    layout:"corporate", font:"bold" },
  20: { bg1:"#2d1b69", bg2:"#11998e", accent:"#fff",    text:"#fff",    layout:"split",     font:"bold" },
  21: { bg1:"#833ab4", bg2:"#fd1d1d", accent:"#fcb045", text:"#fff",   layout:"instagram", font:"bold" },
  22: { bg1:"#fc5c7d", bg2:"#6a3093", accent:"#fff",    text:"#fff",    layout:"diagonal",  font:"bold" },
  23: { bg1:"#f7971e", bg2:"#ffd200", accent:"#1a1a1a", text:"#1a1a1a",layout:"sunny",     font:"bold" },
  24: { bg1:"#11998e", bg2:"#38ef7d", accent:"#1a1a1a", text:"#1a1a1a",layout:"nature",    font:"bold" },
  25: { bg1:"#c02425", bg2:"#f0cb35", accent:"#fff",    text:"#fff",    layout:"diagonal",  font:"bold" },
  26: { bg1:"#2c1654", bg2:"#1a0a2e", accent:"#ffd700", text:"#ffd700",layout:"luxury",    font:"bold" },
  27: { bg1:"#0f2027", bg2:"#2c5364", accent:"#00d2ff", text:"#fff",    layout:"wave",      font:"normal" },
  28: { bg1:"#16213e", bg2:"#0f3460", accent:"#e94560", text:"#fff",    layout:"geometric", font:"bold" },
  29: { bg1:"#1a1a1a", bg2:"#2a1a2a", accent:"#b19cd9", text:"#fff",   layout:"luxury",    font:"normal" },
  30: { bg1:"#0a0a0a", bg2:"#1a0000", accent:"#ff4444", text:"#fff",    layout:"fire",      font:"bold" },
  31: { bg1:"#f953c6", bg2:"#b91d73", accent:"#fff",    text:"#fff",    layout:"diagonal",  font:"bold" },
  32: { bg1:"#d31027", bg2:"#ea384d", accent:"#ffd700", text:"#fff",    layout:"geometric", font:"bold" },
  33: { bg1:"#24C6DC", bg2:"#514A9D", accent:"#fff",    text:"#fff",    layout:"wave",      font:"bold" },
  34: { bg1:"#f46b45", bg2:"#eea849", accent:"#fff",    text:"#1a1a1a",layout:"sunny",     font:"bold" },
  35: { bg1:"#DA4453", bg2:"#89216B", accent:"#fff",    text:"#fff",    layout:"diagonal",  font:"bold" },
  36: { bg1:"#1e3c72", bg2:"#2a5298", accent:"#ffffff", text:"#fff",   layout:"glass",     font:"bold" },
  37: { bg1:"#134e5e", bg2:"#71b280", accent:"#ffffff", text:"#fff",   layout:"glass",     font:"bold" },
  38: { bg1:"#373b44", bg2:"#4286f4", accent:"#ffffff", text:"#fff",   layout:"glass",     font:"bold" },
  39: { bg1:"#000428", bg2:"#004e92", accent:"#ffffff", text:"#fff",   layout:"glass",     font:"bold" },
  40: { bg1:"#1a1a2e", bg2:"#16213e", accent:"#a8d8ff", text:"#fff",   layout:"glass",     font:"bold" },
  41: { bg1:"#000000", bg2:"#0a0a0a", accent:"#ffd700", text:"#ffd700",layout:"vip",       font:"bold" },
  42: { bg1:"#050510", bg2:"#0a0520", accent:"#c0c0c0", text:"#c0c0c0",layout:"vip",       font:"bold" },
  43: { bg1:"#1a0505", bg2:"#2a0505", accent:"#ff4444", text:"#fff",   layout:"fire",      font:"bold" },
  44: { bg1:"#001a33", bg2:"#003366", accent:"#00aaff", text:"#fff",   layout:"cyber",     font:"mono" },
  45: { bg1:"#0a1628", bg2:"#1a2d50", accent:"#4fc3f7", text:"#fff",   layout:"corporate", font:"bold" },
  46: { bg1:"#ffecd2", bg2:"#fcb69f", accent:"#8b4513", text:"#3a1a0a",layout:"minimal",   font:"normal" },
  47: { bg1:"#a8edea", bg2:"#fed6e3", accent:"#5a3a7e", text:"#3a2060",layout:"minimal",   font:"normal" },
  48: { bg1:"#d4fc79", bg2:"#96e6a1", accent:"#1a5232", text:"#1a3a20",layout:"nature",    font:"bold" },
  49: { bg1:"#fbc2eb", bg2:"#a6c1ee", accent:"#5a2a7e", text:"#3a1a60",layout:"minimal",   font:"normal" },
  50: { bg1:"#fddb92", bg2:"#d1fdff", accent:"#0a3a5c", text:"#0a2040",layout:"sunny",     font:"bold" },
};

function drawBG(ctx, tpl, W, H) {
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, tpl.bg1); g.addColorStop(1, tpl.bg2);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}

function addNoise(ctx, W, H, alpha = 0.04) {
  for (let i = 0; i < 2000; i++) {
    const v = Math.random() * 255;
    ctx.fillStyle = `rgba(${v},${v},${v},${alpha * Math.random()})`;
    ctx.fillRect(Math.random() * W, Math.random() * H, 1, 1);
  }
}

function drawDots(ctx, W, H, color, gap = 28, alpha = 0.12) {
  ctx.fillStyle = color.startsWith("#") ? color + "1e" : `rgba(200,200,200,${alpha})`;
  for (let x = gap; x < W; x += gap) {
    for (let y = gap; y < H; y += gap) {
      ctx.beginPath(); ctx.arc(x, y, 1.5, 0, Math.PI * 2); ctx.fill();
    }
  }
}

function drawLines(ctx, W, H, alpha = 0.07) {
  ctx.strokeStyle = `rgba(255,255,255,${alpha})`; ctx.lineWidth = 0.7;
  for (let x = -H; x < W + H; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + H, H); ctx.stroke();
  }
}

function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}

function renderBG(ctx, tpl, W, H) {
  const acc = tpl.accent;
  const accHex = acc.startsWith("#") ? acc : "#ffffff";

  switch (tpl.layout) {
    case "diagonal": {
      drawBG(ctx, tpl, W, H);
      // Diagonal accent strips
      ctx.save();
      ctx.beginPath(); ctx.moveTo(W * 0.56, 0); ctx.lineTo(W * 0.76, 0); ctx.lineTo(W * 0.46, H); ctx.lineTo(W * 0.26, H); ctx.closePath();
      ctx.fillStyle = "rgba(255,255,255,0.06)"; ctx.fill();
      ctx.beginPath(); ctx.moveTo(W * 0.68, 0); ctx.lineTo(W, 0); ctx.lineTo(W, H); ctx.lineTo(W * 0.38, H); ctx.closePath();
      const gD = ctx.createLinearGradient(W * 0.68, 0, W, H);
      gD.addColorStop(0, accHex + "18"); gD.addColorStop(1, "transparent");
      ctx.fillStyle = gD; ctx.fill(); ctx.restore();
      // Corner accent
      ctx.fillStyle = accHex; ctx.fillRect(0, 0, 5, H);
      ctx.fillRect(0, H - 4, W, 4);
      break;
    }
    case "geometric": {
      drawBG(ctx, tpl, W, H);
      // Large circles
      [[W * 0.88, -30, 220], [W * 0.08, H + 20, 160], [W * 0.5, H * 0.5, 300]].forEach(([x, y, r]) => {
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255,255,255,0.06)"; ctx.lineWidth = 45; ctx.stroke();
      });
      // Corner triangles
      ctx.save(); ctx.globalAlpha = 0.07; ctx.fillStyle = accHex;
      ctx.beginPath(); ctx.moveTo(W - 80, 0); ctx.lineTo(W, 0); ctx.lineTo(W, 100); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(0, H - 100); ctx.lineTo(0, H); ctx.lineTo(80, H); ctx.closePath(); ctx.fill();
      ctx.globalAlpha = 1; ctx.restore();
      drawDots(ctx, W, H, accHex, 32, 0.08);
      break;
    }
    case "neon": {
      drawBG(ctx, tpl, W, H);
      ctx.lineWidth = 0.5; ctx.strokeStyle = accHex + "1a";
      for (let x = 0; x < W; x += 48) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += 48) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      [{ x: 0, y: 0, r: 200 }, { x: W, y: H, r: 220 }, { x: W * 0.5, y: 0, r: 150 }].forEach(({ x, y, r }) => {
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, accHex + "30"); g.addColorStop(1, "transparent");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      });
      break;
    }
    case "glass": {
      drawBG(ctx, tpl, W, H); addNoise(ctx, W, H, 0.025);
      ctx.fillStyle = "rgba(255,255,255,0.05)"; ctx.fillRect(0, 0, W, H);
      ctx.save(); roundRectPath(ctx, 16, 16, W - 32, H - 32, 18);
      ctx.fillStyle = "rgba(255,255,255,0.07)"; ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.18)"; ctx.lineWidth = 1; ctx.stroke();
      ctx.restore();
      break;
    }
    case "luxury": {
      drawBG(ctx, tpl, W, H); addNoise(ctx, W, H, 0.05);
      const borders = [[18, 18, W - 18, 18], [18, H - 18, W - 18, H - 18], [18, 18, 18, H - 18], [W - 18, 18, W - 18, H - 18]];
      const borders2 = [[32, 32, W - 32, 32], [32, H - 32, W - 32, H - 32], [32, 32, 32, H - 32], [W - 32, 32, W - 32, H - 32]];
      ctx.strokeStyle = accHex + "55"; ctx.lineWidth = 1.5;
      borders.forEach(([x1, y1, x2, y2]) => { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); });
      ctx.strokeStyle = accHex + "22"; ctx.lineWidth = 0.8;
      borders2.forEach(([x1, y1, x2, y2]) => { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); });
      [[24, 24], [W - 24, 24], [24, H - 24], [W - 24, H - 24]].forEach(([cx, cy]) => {
        ctx.strokeStyle = accHex + "99"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(cx, cy, 7, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = accHex + "44"; ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI * 2); ctx.fill();
      });
      break;
    }
    case "corporate": {
      drawBG(ctx, tpl, W, H);
      ctx.fillStyle = accHex; ctx.fillRect(0, 0, 8, H);
      ctx.fillStyle = "rgba(0,0,0,0.35)"; ctx.fillRect(0, 0, W, 6);
      ctx.fillStyle = "rgba(0,0,0,0.25)"; ctx.fillRect(0, H - 6, W, 6);
      drawDots(ctx, W, H, "#ffffff", 28, 0.05);
      break;
    }
    case "wave": {
      drawBG(ctx, tpl, W, H);
      ctx.save(); ctx.globalAlpha = 0.1;
      [0.55, 0.72].forEach((yFrac, i) => {
        ctx.beginPath(); ctx.moveTo(0, H * yFrac);
        for (let x = 0; x <= W; x += 18) ctx.lineTo(x, H * yFrac + Math.sin(x * 0.025 + i) * (28 - i * 8));
        ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
        ctx.fillStyle = i === 0 ? "#ffffff" : "rgba(0,0,0,0.4)"; ctx.fill();
      });
      ctx.restore(); ctx.globalAlpha = 1;
      break;
    }
    case "hacker": {
      drawBG(ctx, tpl, W, H);
      ctx.font = "11px monospace"; ctx.fillStyle = "#00ff4118";
      const chars = "01アイウエオカキクケコGHOST10RAKIB";
      for (let x = 0; x < W; x += 20) for (let y = 18; y < H; y += 20) {
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x, y);
      }
      break;
    }
    case "fire": {
      drawBG(ctx, tpl, W, H);
      const gF = ctx.createLinearGradient(W / 2, H, W / 2, H * 0.3);
      gF.addColorStop(0, "rgba(255,60,0,0.45)"); gF.addColorStop(0.5, "rgba(255,140,0,0.15)"); gF.addColorStop(1, "transparent");
      ctx.fillStyle = gF; ctx.fillRect(0, 0, W, H);
      drawLines(ctx, W, H, 0.05);
      // Ember particles
      ctx.fillStyle = "rgba(255,100,0,0.35)";
      for (let i = 0; i < 30; i++) {
        ctx.beginPath(); ctx.arc(Math.random() * W, Math.random() * H, Math.random() * 2.5, 0, Math.PI * 2); ctx.fill();
      }
      break;
    }
    case "split": {
      ctx.fillStyle = tpl.bg1; ctx.fillRect(0, 0, W / 2, H);
      ctx.fillStyle = tpl.bg2; ctx.fillRect(W / 2, 0, W / 2, H);
      ctx.strokeStyle = accHex; ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H); ctx.stroke();
      break;
    }
    case "minimal": {
      drawBG(ctx, tpl, W, H);
      drawDots(ctx, W, H, accHex, 34, 0.08);
      ctx.fillStyle = accHex + "33"; ctx.fillRect(0, H - 55, W, 1);
      ctx.fillStyle = accHex + "66"; ctx.fillRect(0, H - 54, 220, 1);
      break;
    }
    case "instagram": {
      const gI = ctx.createLinearGradient(0, 0, W, H);
      gI.addColorStop(0, tpl.bg1); gI.addColorStop(0.5, tpl.bg2); gI.addColorStop(1, "#fcb045");
      ctx.fillStyle = gI; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "rgba(255,255,255,0.07)"; ctx.fillRect(0, 0, W, H);
      break;
    }
    case "sunny": {
      drawBG(ctx, tpl, W, H);
      const cx2 = W * 0.87, cy2 = -15;
      ctx.save(); ctx.globalAlpha = 0.07;
      for (let i = 0; i < 18; i++) {
        const a = (i / 18) * Math.PI * 2;
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.moveTo(cx2, cy2);
        ctx.arc(cx2, cy2, 420, a - 0.07, a + 0.07); ctx.closePath(); ctx.fill();
      }
      ctx.restore(); ctx.globalAlpha = 1;
      break;
    }
    case "vip": {
      drawBG(ctx, tpl, W, H); addNoise(ctx, W, H, 0.06);
      // Stars
      ctx.fillStyle = accHex + "44";
      for (let i = 0; i < 90; i++) {
        ctx.beginPath(); ctx.arc(Math.random() * W, Math.random() * H, Math.random() * 1.8, 0, Math.PI * 2); ctx.fill();
      }
      // Luxury borders
      const vBords = [[16, 16, W - 16, 16], [16, H - 16, W - 16, H - 16], [16, 16, 16, H - 16], [W - 16, 16, W - 16, H - 16]];
      ctx.strokeStyle = accHex + "55"; ctx.lineWidth = 1.5;
      vBords.forEach(([x1, y1, x2, y2]) => { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); });
      [[22, 22], [W - 22, 22], [22, H - 22], [W - 22, H - 22]].forEach(([cx, cy]) => {
        ctx.strokeStyle = accHex + "99"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(cx, cy, 7, 0, Math.PI * 2); ctx.stroke();
      });
      break;
    }
    case "cyber": {
      drawBG(ctx, tpl, W, H);
      ctx.lineWidth = 0.5; ctx.strokeStyle = accHex + "20";
      for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      // Cyber glow corners
      [{ x: 0, y: 0 }, { x: W, y: H }].forEach(({ x, y }) => {
        const g = ctx.createRadialGradient(x, y, 0, x, y, 180);
        g.addColorStop(0, accHex + "28"); g.addColorStop(1, "transparent");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 180, 0, Math.PI * 2); ctx.fill();
      });
      addNoise(ctx, W, H, 0.018);
      break;
    }
    case "github": {
      drawBG(ctx, tpl, W, H);
      drawLines(ctx, W, H, 0.04);
      drawDots(ctx, W, H, accHex, 40, 0.06);
      break;
    }
    case "nature": {
      drawBG(ctx, tpl, W, H);
      drawDots(ctx, W, H, "#fff", 24, 0.1);
      const gN = ctx.createLinearGradient(0, H * 0.6, 0, H);
      gN.addColorStop(0, "transparent"); gN.addColorStop(1, "rgba(0,0,0,0.2)");
      ctx.fillStyle = gN; ctx.fillRect(0, 0, W, H);
      break;
    }
    default:
      drawBG(ctx, tpl, W, H);
  }

  addNoise(ctx, W, H, 0.01);
}

async function generateCover(tpl, name, tagline, bio, social, profileImg) {
  const W = 820, H = 312;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");

  renderBG(ctx, tpl, W, H);

  const accHex = tpl.accent.startsWith("#") ? tpl.accent : "#ffffff";
  const fontFamily = tpl.font === "mono" ? "monospace" : "Arial";
  const isBold = tpl.font !== "normal";

  const PFP_SIZE = 162, PFP_X = 42, PFP_Y = (H - PFP_SIZE) / 2;
  const hasProfile = !!profileImg;
  const textX = hasProfile ? PFP_X + PFP_SIZE + 38 : 62;
  const maxTextW = W - textX - 30;

  // ── Profile Picture ──
  if (hasProfile) {
    try {
      // Drop shadow
      ctx.shadowColor = "rgba(0,0,0,0.55)"; ctx.shadowBlur = 24; ctx.shadowOffsetX = 3; ctx.shadowOffsetY = 5;
      ctx.save(); roundRectPath(ctx, PFP_X, PFP_Y, PFP_SIZE, PFP_SIZE, 18); ctx.clip();
      ctx.drawImage(profileImg, PFP_X, PFP_Y, PFP_SIZE, PFP_SIZE); ctx.restore();
      ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;

      // Glowing frame
      ctx.shadowColor = accHex; ctx.shadowBlur = 16;
      ctx.strokeStyle = accHex; ctx.lineWidth = 3.5;
      roundRectPath(ctx, PFP_X, PFP_Y, PFP_SIZE, PFP_SIZE, 18); ctx.stroke();
      ctx.shadowBlur = 0;

      // Bottom accent bar on PFP
      ctx.fillStyle = accHex; ctx.fillRect(PFP_X, PFP_Y + PFP_SIZE - 6, PFP_SIZE, 6);
    } catch {}
  }

  // ── Name ──
  const nameSize = hasProfile ? 42 : 52;
  const nameY = bio ? H / 2 - 44 : H / 2 - 18;
  ctx.textAlign = "left"; ctx.font = `${isBold ? "bold " : ""}${nameSize}px ${fontFamily}`;
  ctx.shadowColor = "rgba(0,0,0,0.8)"; ctx.shadowBlur = 10;
  ctx.fillStyle = tpl.text; ctx.fillText(name.toUpperCase(), textX, nameY, maxTextW);
  ctx.shadowBlur = 0;

  // ── Accent underline ──
  const measured = Math.min(ctx.measureText(name.toUpperCase()).width + 12, maxTextW);
  ctx.shadowColor = accHex; ctx.shadowBlur = 8;
  ctx.fillStyle = accHex; ctx.fillRect(textX, nameY + 7, measured, 3.5);
  ctx.shadowBlur = 0;

  // ── Tagline ──
  if (tagline) {
    const tagSize = Math.round(nameSize * 0.5);
    ctx.font = `${tagSize}px ${fontFamily}`;
    ctx.fillStyle = accHex; ctx.shadowColor = "rgba(0,0,0,0.6)"; ctx.shadowBlur = 6;
    const tagY = bio ? nameY + 44 : nameY + 40;
    ctx.fillText(tagline, textX, tagY, maxTextW);
    ctx.shadowBlur = 0;
  }

  // ── Bio ──
  if (bio) {
    const bioSize = Math.round(nameSize * 0.38);
    ctx.font = `${bioSize}px ${fontFamily}`;
    ctx.fillStyle = tpl.text; ctx.globalAlpha = 0.75;
    ctx.fillText(bio, textX, H / 2 + 22, maxTextW);
    ctx.globalAlpha = 1;
  }

  // ── Footer bar ──
  ctx.fillStyle = "rgba(0,0,0,0.38)"; ctx.fillRect(0, H - 44, W, 44);
  ctx.fillStyle = accHex; ctx.shadowColor = accHex; ctx.shadowBlur = 6;
  ctx.fillRect(0, H - 44, W, 2.5); ctx.shadowBlur = 0;

  // Social links left
  ctx.font = `14px ${fontFamily}`; ctx.textAlign = "left";
  ctx.fillStyle = accHex; ctx.globalAlpha = 0.88;
  ctx.fillText(social || "", 22, H - 14);

  // Center — name echo
  ctx.textAlign = "center"; ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.font = "11px Arial";
  ctx.fillText(name.toUpperCase(), W / 2, H - 14);

  // Ghost Net branding right
  ctx.textAlign = "right"; ctx.fillStyle = "rgba(255,255,255,0.38)";
  ctx.font = "12px Arial"; ctx.globalAlpha = 1;
  ctx.fillText("👻 Ghost Net Edition", W - 18, H - 14);

  return canvas.toBuffer("image/png");
}

module.exports = {
  config: {
    name: "fbcover3",
    aliases: ["cover3", "fbc3", "coverpro", "procover"],
    version: "2.0",
    author: "Rakib Islam",
    countDown: 15,
    role: 0,
    shortDescription: { en: "🎨 Pro FB Cover — 50 premium templates" },
    longDescription: { en: "Generate professional Facebook cover photos with 50 premium templates. Reply/attach photo to include profile picture." },
    category: "design",
    guide: {
      en: "📌 {p}fbcover3 - <1-50> - <Name> - <Tagline> - [Bio] - [Social]\n\n💡 Profile pic: Reply to a photo OR attach image\n\n📜 Templates: {p}fbcover3 templates\n\nEx:\n  {p}fbcover3 - 2 - RAKIB ISLAM - Ghost Net Dev\n  {p}fbcover3 - 6 - SAKURA - Anime Lover - I love coding - @acs.rakib"
    }
  },

  onStart: async function ({ message, args, event }) {
    await fs.ensureDir(CACHE);
    const input = args.join(" ");

    if (input.trim() === "templates" || input.trim() === "list") {
      const groups = [
        { r: " 1-5 ", l: "🖤 Minimal / Dark" },
        { r: " 6-10", l: "🌟 Neon / Glow" },
        { r: "11-15", l: "🎨 Rich Gradient" },
        { r: "16-20", l: "💼 Corporate / Pro" },
        { r: "21-25", l: "🎭 Artistic" },
        { r: "26-30", l: "👑 Dark Luxury" },
        { r: "31-35", l: "💥 Vibrant Pop" },
        { r: "36-40", l: "🪟 Glass / Modern" },
        { r: "41-45", l: "⭐ Special Edition" },
        { r: "46-50", l: "🌸 Pastel / Soft" },
      ];
      const body = groups.map(g => `  [${g.r}] › ${g.l}`).join("\n");
      return message.reply(
        `╔══════════════════════════╗\n` +
        `║   🎨 50 Premium Templates  ║\n` +
        `╚══════════════════════════╝\n\n${body}\n\n` +
        `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n` +
        `💡 Ex: .fbcover3 - 6 - RAKIB - Ghost Net\n` +
        `💡 Neon → 6-10 | Luxury → 26-30 | Glass → 36-40`
      );
    }

    const parts = input.split("-").map(s => s.trim());
    if (parts.length < 3) {
      return message.reply(
        `╔══════════════════════════╗\n` +
        `║  🎨 Pro FB Cover Maker    ║\n` +
        `╚══════════════════════════╝\n\n` +
        `📌 ব্যবহার:\n` +
        `  .fbcover3 - <1-50> - <Name> - <Tagline>\n` +
        `             - [Bio] - [Social]\n\n` +
        `📌 Profile Pic:\n` +
        `  ছবি attach করো বা ছবিতে reply করো\n\n` +
        `📌 Template List:\n` +
        `  .fbcover3 templates\n\n` +
        `📌 Example:\n` +
        `  .fbcover3 - 2 - RAKIB - Ghost Net Dev`
      );
    }

    const templateNum = parseInt(parts[0]);
    if (isNaN(templateNum) || templateNum < 1 || templateNum > 50) {
      return message.reply("❌ Template ১-৫০ এর মধ্যে দাও!\n💡 .fbcover3 templates → সব দেখো");
    }

    const name    = parts[1] || "YOUR NAME";
    const tagline = parts[2] || "";
    const bio     = parts[3] || "";
    const social  = parts[4] || "@ghost.net";
    const tpl = TEMPLATES[templateNum];

    let profileImgUrl = null;
    if (event.type === "message_reply") {
      const att = event.messageReply?.attachments?.[0];
      if (att?.type === "photo") profileImgUrl = att.url;
    } else if (event.attachments?.[0]?.type === "photo") {
      profileImgUrl = event.attachments[0].url;
    }

    await message.reply(`🎨 Template #${templateNum} [${tpl.layout.toUpperCase()}] generate হচ্ছে...`);

    try {
      let profileImg = null;
      if (profileImgUrl) {
        try {
          const r = await axios.get(profileImgUrl, { responseType: "arraybuffer", timeout: 15000 });
          profileImg = await loadImage(Buffer.from(r.data));
        } catch {}
      }

      const buffer = await generateCover(tpl, name, tagline, bio, social, profileImg);
      const outPath = path.join(CACHE, `fbcover3_${Date.now()}.png`);
      await fs.writeFile(outPath, buffer);

      await message.reply({
        body:
          `╔══════════════════════════╗\n` +
          `║  ✅ Pro Cover Ready! 🎨   ║\n` +
          `╚══════════════════════════╝\n` +
          `  ✦ Template  › #${templateNum} (${tpl.layout})\n` +
          `  ✦ Name      › ${name}\n` +
          `  ✦ Tagline   › ${tagline || "—"}\n` +
          `  ✦ Bio       › ${bio || "—"}\n` +
          `  ✦ Profile   › ${profileImg ? "✅ Added" : "❌ None"}\n` +
          `  ✦ Size      › 820×312 px\n\n` +
          `💡 Another: .fbcover3 - ${templateNum === 50 ? 1 : templateNum + 1} - ${name} - ${tagline || "Ghost Net"}`,
        attachment: fs.createReadStream(outPath)
      });

      setTimeout(() => { try { fs.unlinkSync(outPath); } catch {} }, 25000);
    } catch (err) {
      message.reply("❌ Cover generate করতে সমস্যা!\n" + err.message?.slice(0, 80));
    }
  }
};
