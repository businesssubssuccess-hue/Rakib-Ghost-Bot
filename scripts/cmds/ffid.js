const fs = require("fs-extra");
const path = require("path");

const DB = path.join(__dirname, "cache", "ffid.json");
fs.ensureFileSync(DB);

module.exports = {
  config: {
    name: "ffid",
    aliases: ["myffid"],
    version: "1.0",
    author: "Rakib",
    countDown: 3,
    role: 0,
    shortDescription: "নিজের Free Fire UID save/show",
    category: "free fire",
    guide: { en: "{p}ffid set <id>\n{p}ffid get [@mention]\n{p}ffid del" }
  },
  onStart: async function ({ message, event, args, api }) {
    let db = {}; try { db = await fs.readJson(DB); } catch {}
    const sub = (args[0] || "get").toLowerCase();

    if (sub === "set") {
      const id = args[1];
      if (!/^\d{6,}$/.test(id || "")) return message.reply("⚠️ Use: ffid set <তোমার_FF_ID>");
      db[event.senderID] = id;
      await fs.writeJson(DB, db, { spaces: 2 });
      return message.reply(`✅ তোমার FF ID save করা হলো: ${id}\n👻 Ghost Net`);
    }
    if (sub === "del" || sub === "delete") {
      delete db[event.senderID];
      await fs.writeJson(DB, db, { spaces: 2 });
      return message.reply("🗑️ FF ID delete করা হলো\n👻 Ghost Net");
    }

    let uid = event.senderID;
    if (event.type === "message_reply") uid = event.messageReply.senderID;
    else if (Object.keys(event.mentions || {}).length) uid = Object.keys(event.mentions)[0];

    const fid = db[uid];
    if (!fid) return message.reply("⚠️ এই user এর কোনো FF ID save নেই\nUse: ffid set <তোমার_FF_ID>");
    let n = "Player"; try { n = (await api.getUserInfo(uid))[uid].name; } catch {}
    return message.reply(`🔫 𝗙𝗙 𝗜𝗗 𝗟𝗢𝗢𝗞𝗨𝗣\n━━━━━━━━━━━━━━\n👤 Player : ${n}\n🆔 FF ID  : ${fid}\n━━━━━━━━━━━━━━\n👻 Ghost Net`);
  }
};
