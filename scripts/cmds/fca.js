const fs = require("fs");
const path = require("path");

const FCA_DIR = path.join(process.cwd(), "fca-modules");
const ACTIVE_FILE = path.join(FCA_DIR, "active.json");

function listFcas() {
  if (!fs.existsSync(FCA_DIR)) return [];
  return fs.readdirSync(FCA_DIR).filter(d => {
    const full = path.join(FCA_DIR, d);
    return fs.statSync(full).isDirectory() && fs.existsSync(path.join(full, "index.js"));
  }).sort();
}
function getActive() {
  try { return JSON.parse(fs.readFileSync(ACTIVE_FILE, "utf8")).active || "fca1"; } catch { return "fca1"; }
}
function setActive(name) {
  fs.writeFileSync(ACTIVE_FILE, JSON.stringify({ active: name }, null, 2));
}
function getInfo(name) {
  try { return JSON.parse(fs.readFileSync(path.join(FCA_DIR, name, "info.json"), "utf8")); }
  catch { return { name, description: "(no info)", stability: "?", antiban: "?", speed: "?" }; }
}
function testLoad(name) {
  try {
    const mod = require(path.join(FCA_DIR, name));
    return typeof mod === "function" ? "✅ loadable" : "⚠️ bad export";
  } catch (e) {
    return "❌ " + e.message.slice(0, 40);
  }
}

module.exports = {
  config: {
    name: "fca",
    aliases: ["switchfca", "changefca", "fcaswitch"],
    version: "2.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 2,
    shortDescription: "Manage FB Chat API modules (anti-ban switching)",
    category: "system",
    guide: {
      en: [
        "{pn}               → list all FCAs + status",
        "{pn} <name>        → switch FCA (e.g. fca2, fca3)",
        "{pn} info <name>   → detailed info",
        "{pn} current       → show active FCA",
        "{pn} test          → test all FCA modules"
      ].join("\n")
    }
  },

  onStart: async function ({ message, event, args }) {
    const fcas = listFcas();
    if (fcas.length === 0) return message.reply("❌ কোনো FCA module পাওয়া যায়নি!\nপ্রজেক্টে `fca-modules/` ফোল্ডার চেক করো।");

    const active = getActive();
    const prefix = global.GoatBot.config.prefix;
    const sub = (args[0] || "").toLowerCase();

    // ─── LIST ──────────────────────────────────────────────
    if (!sub || sub === "list") {
      let out = "╔═〘 👻 𝗙𝗖𝗔 𝗠𝗢𝗗𝗨𝗟𝗘𝗦 〙═╗\n\n";
      out += `🟢 Currently Active: ${active}\n`;
      out += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
      fcas.forEach((f, i) => {
        const info = getInfo(f);
        const isActive = f === active;
        out += `${isActive ? "🟢" : "⚪"} ${i + 1}. ${f}${isActive ? " ◀ ACTIVE NOW" : ""}\n`;
        out += `   📛 ${info.name}\n`;
        out += `   🛡️ ${info.antiban || "?"} anti-ban | ⚡ ${info.speed || "?"}\n\n`;
      });
      out += `━━━━━━━━━━━━━━━━━━━━━━\n`;
      out += `💡 Switch: ${prefix}fca fca2\n`;
      out += `📋 Info:   ${prefix}fca info fca2\n`;
      out += `🔬 Test:   ${prefix}fca test\n`;
      out += `— Rakib Islam | Ghost Bot`;
      return message.reply(out);
    }

    // ─── CURRENT ───────────────────────────────────────────
    if (sub === "current") {
      const info = getInfo(active);
      const loadStatus = testLoad(active);
      return message.reply(
        `👻 𝗖𝗨𝗥𝗥𝗘𝗡𝗧 𝗙𝗖𝗔\n━━━━━━━━━━━━━━━━\n` +
        `📦 Name: ${active}\n` +
        `📛 Title: ${info.name}\n` +
        `📝 Info: ${info.description}\n` +
        `📊 Stability: ${info.stability}\n` +
        `🛡️ Anti-ban: ${info.antiban}\n` +
        `⚡ Speed: ${info.speed}\n` +
        `🔬 Load Test: ${loadStatus}\n` +
        `━━━━━━━━━━━━━━━━\n— Rakib Islam | Ghost Bot`
      );
    }

    // ─── TEST ──────────────────────────────────────────────
    if (sub === "test") {
      await message.reply("🔬 Testing all FCA modules...");
      let out = "🔬 𝗙𝗖𝗔 𝗠𝗢𝗗𝗨𝗟𝗘 𝗧𝗘𝗦𝗧\n━━━━━━━━━━━━━━━━\n";
      fcas.forEach(f => {
        const info = getInfo(f);
        const status = testLoad(f);
        const isActive = f === active;
        out += `${isActive ? "🟢" : "⚪"} ${f}${isActive ? " (active)" : ""}\n`;
        out += `   ${info.name}\n`;
        out += `   ${status}\n\n`;
      });
      out += `━━━━━━━━━━━━━━━━\n`;
      out += `✅ = loadable | ❌ = broken\n— Rakib Islam | Ghost Bot`;
      return message.reply(out);
    }

    // ─── INFO ──────────────────────────────────────────────
    if (sub === "info") {
      const target = (args[1] || "").toLowerCase();
      if (!target || !fcas.includes(target))
        return message.reply(`❌ FCA "${target}" পাওয়া যায়নি!\nAvailable: ${fcas.join(", ")}`);
      const info = getInfo(target);
      const loadStatus = testLoad(target);
      const isActive = target === active;
      return message.reply(
        `📦 𝗙𝗖𝗔 𝗜𝗡𝗙𝗢: ${target}${isActive ? " 🟢 ACTIVE" : ""}\n━━━━━━━━━━━━━━━\n` +
        `📛 ${info.name}\n📝 ${info.description}\n📊 Stability: ${info.stability}\n` +
        `🛡️ Anti-ban: ${info.antiban}\n⚡ Speed: ${info.speed}\n🔬 Load: ${loadStatus}\n` +
        `━━━━━━━━━━━━━━━\n— Rakib Islam | Ghost Bot`
      );
    }

    // ─── SWITCH ────────────────────────────────────────────
    const target = sub;
    if (!fcas.includes(target))
      return message.reply(
        `❌ FCA "${target}" পাওয়া যায়নি!\n\n✅ Available:\n${fcas.map((f, i) => `${i + 1}. ${f}${f === active ? " (active)" : ""}`).join("\n")}\n\nExample: ${prefix}fca fca2`
      );

    if (target === active)
      return message.reply(`ℹ️ "${target}" এখন already active আছে!\n\nOthers: ${fcas.filter(f => f !== active).join(", ")}`);

    // Test the target before switching
    const loadTest = testLoad(target);
    if (loadTest.startsWith("❌"))
      return message.reply(`❌ "${target}" load করা যাচ্ছে না!\nError: ${loadTest}\n\nSwitch বাতিল করা হয়েছে।`);

    const info = getInfo(target);
    setActive(target);

    await message.reply(
      `✅ 𝗙𝗖𝗔 𝗦𝗪𝗜𝗧𝗖𝗛𝗘𝗗!\n━━━━━━━━━━━━━━━━\n` +
      `📦 ${active} → ${target}\n` +
      `📛 ${info.name}\n` +
      `🛡️ Anti-ban: ${info.antiban} | ⚡ ${info.speed}\n` +
      `🔬 Load Test: ${loadTest}\n` +
      `━━━━━━━━━━━━━━━━\n` +
      `🔄 Bot restart হচ্ছে (3 সেকেন্ড)...\n` +
      `✅ Next start এ ${target} active থাকবে\n` +
      `— Rakib Islam | Ghost Bot`
    );

    // Small delay to ensure message is sent, then restart
    setTimeout(() => {
      console.log(`\n👻 [Ghost Net] FCA switching: ${active} → ${target}\n`);
      process.exit(2);
    }, 3000);
  }
};
