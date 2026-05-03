const fs = require("fs-extra");
const path = require("path");
const STATE_FILE = path.join(__dirname, "cache", "tasbih_state.json");

function getCount(uid) {
  try { const d = fs.readJsonSync(STATE_FILE); return d[uid] || 0; } catch { return 0; }
}
function setCount(uid, val) {
  fs.ensureDirSync(path.dirname(STATE_FILE));
  let d = {}; try { d = fs.readJsonSync(STATE_FILE); } catch {}
  d[uid] = val; fs.writeJsonSync(STATE_FILE, d, { spaces: 2 });
}

module.exports.config = {
  name: "tasbih",
  aliases: ["tasbeeh", "counter", "তাসবিহ"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 1,
  role: 0,
  shortDescription: { en: "Digital tasbih counter 📿" },
  longDescription: { en: "Digital tasbih — count SubhanAllah, Alhamdulillah, AllahuAkbar" },
  category: "বাংলা",
  guide: { en: "{pn} [+/reset/show]" }
};

module.exports.onStart = async ({ api, event, args, message, usersData }) => {
  const uid = event.senderID;
  const name = await usersData.getName(uid) || "বান্দা";
  let count = getCount(uid);

  if (!args[0] || args[0] === "+") {
    count++;
    setCount(uid, count);
    const zikr = count % 3 === 1 ? "سُبْحَانَ اللَّه (SubhanAllah)" :
                  count % 3 === 2 ? "الْحَمْدُ لِلَّه (Alhamdulillah)" :
                  "اللَّهُ أَكْبَرُ (AllahuAkbar)";
    return message.reply(`📿 তাসবিহ\n━━━━━━━━━━━\n👤 ${name}\n🔢 গণনা: ${count}\n🕌 ${zikr}\n━━━━━━━━━━━\n💡 .tasbih + | .tasbih reset`);
  }
  if (args[0] === "reset") {
    setCount(uid, 0);
    return message.reply(`📿 তোমার তাসবিহ counter রিসেট হয়েছে। নতুনভাবে শুরু করো। 🌙`);
  }
  if (args[0] === "show") {
    return message.reply(`📿 ${name} এর তাসবিহ গণনা: ${count} 🌙`);
  }
};
