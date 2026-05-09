const { commands, aliases } = global.GoatBot;
const { getPrefix } = global.utils;

module.exports = {
  config: {
    name: "help",
    version: "5.0",
    author: "Rakib Islam",
    countDown: 3,
    role: 0,
    shortDescription: { en: "Advanced 3-Page Help Panel" },
    longDescription: { en: "Multi-page help menu with custom neon design and 18+ category" },
    category: "info",
    guide: { en: "{p}help [1 | 2 | 3 | command]" },
    priority: 1
  },

  onStart: async function ({ message, args, event, role }) {
    const prefix = getPrefix(event.threadID);

    // Specific Command Info
    if (args.length && isNaN(args[0])) {
      const q = args[0].toLowerCase();
      const cmd = commands.get(q) || commands.get(aliases.get(q));
      if (cmd) return showCmd(message, cmd, prefix);
      return message.reply(`❌ Command "${args[0]}" পাওয়া যায়নি!\n💡 সব commands দেখতে: ${prefix}help`);
    }

    // Organize Categories
    const cats = {};
    for (const [name, cmd] of commands) {
      if (cmd.config.role > 1 && role < cmd.config.role) continue;
      const c = (cmd.config.category || "uncategorized").toLowerCase();
      (cats[c] = cats[c] || []).push(name);
    }

    const pageNum = parseInt(args[0]) || 1;
    const totalCmds = commands.size;

    // Define Page Categories
    const PAGE1_CATS = ["ai", "tag fun", "media", "group"];
    const PAGE2_CATS = ["game", "image", "love", "system", "info", "utility", "custom"];
    const PAGE3_CATS = ["18+", "nsfw", "adult", "sex", "hentai"]; // ১৮+ ক্যাটাগরিগুলো এখানে

    let displayCats = [];
    let pageTitle = "";

    if (pageNum === 1) {
      displayCats = PAGE1_CATS;
      pageTitle = "𝐀𝐃𝐕𝐀𝐍𝐂𝐄𝐃 𝐇𝐄𝐋𝐏 𝐏𝐀𝐍𝐄𝐋";
    } else if (pageNum === 2) {
      displayCats = PAGE2_CATS;
      pageTitle = "𝐒𝐄𝐂𝐎𝐍𝐃𝐀𝐑𝐘 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒";
    } else if (pageNum === 3) {
      displayCats = PAGE3_CATS;
      pageTitle = "🔞 𝟏𝟖+ 𝐑𝐄𝐒𝐓𝐑𝐈𝐂𝐓𝐄𝐃 𝐙𝐎𝐍𝐄";
    } else {
      return message.reply("❌ Invalid Page! Please use page 1, 2, or 3.");
    }

    let msg = `╭━━━〔 ✦ ${pageTitle} ✦ 〕━━━⬣\n`;
    msg += `┃ ⌬ 𝐓𝐨𝐭𝐚𝐥 𝐂𝐨𝐦𝐦𝐚𝐧𝐝𝐬 : ${totalCmds}\n`;
    msg += `┃ ⌬ 𝐁𝐨𝐭 𝐏𝐫𝐞𝐟𝐢𝐱 : 『 ${prefix} 』\n`;
    msg += `┃ ⌬ 𝐒𝐭𝐚𝐭𝐮𝐬 : 𝐀𝐜𝐭𝐢𝐯𝐞 🟢\n`;
    msg += `┃ ⌬ 𝐏𝐚𝐠𝐞 : ${pageNum} / 3\n`;
    msg += `╰━━━━━━━━━━━━━━━━━━━⬣\n\n`;

    for (const c of displayCats) {
      if (!cats[c]) continue;
      const list = cats[c].sort();
      msg += `╭━━━〔 🗂️  ${c.toUpperCase()} 〕━━━⬣\n`;
      
      for (let i = 0; i < list.length; i += 2) {
        const row = list.slice(i, i + 2);
        msg += `┃ ✧ ${row[0].padEnd(12)} ${row[1] ? "┃ ✧ " + row[1] : ""}\n`;
      }
      msg += `╰━━━━━━━━━━━━━━━━━━━⬣\n\n`;
    }

    msg += `╭━━━〔 👑 𝐁𝐎𝐓 𝐈𝐍𝐅𝐎 〕━━━⬣\n`;
    msg += `┃ 👤 𝐀𝐝𝐦𝐢𝐧 : Rakib Islam\n`;
    msg += `┃ 📩 𝐑𝐞𝐩𝐨𝐫𝐭 : ${prefix}callad (yourmsg)\n`;
    msg += `┃ ⚡ 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 : GHOST NET V2\n`;
    msg += `╰━━━━━━━━━━━━━━━━━━━⬣`;

    return message.reply(msg);
  }
};

function showCmd(message, cmd, prefix) {
  const c = cmd.config;
  const sd = typeof c.shortDescription === "string" ? c.shortDescription : (c.shortDescription?.en || "—");
  const guide = typeof c.guide === "string" ? c.guide : (c.guide?.en || "—");
  const roles = ["👤 User", "🔧 Mod", "👑 Admin", "💎 Owner"];

  const m = `╭━━━〔 ✦ 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐈𝐍𝐅𝐎 ✦ 〕━━━⬣
┃ 🍭 Name     : ${c.name}
┃ 🔖 Aliases  : ${(c.aliases || []).join(", ") || "None"}
┃ 📂 Category : ${c.category || "General"}
┃ 🔐 Role     : ${roles[c.role || 0]}
┃ ⏳ Cooldown : ${c.countDown || 0}s
╰━━━━━━━━━━━━━━━━━━━⬣

📝 Description: ${sd}

💡 Usage:
${guide.replace(/\{p\}|\{pn\}/g, prefix + c.name + " ")}

──────────────────
© Rakib Islam | ACS RAKIB`;

  return message.reply(m);
                            }
                            
