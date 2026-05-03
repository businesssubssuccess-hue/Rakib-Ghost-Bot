const fs = require("fs-extra");
const path = require("path");

const DB_FILE = path.join(__dirname, "cache", "birthdays.json");

const MONTHS = {
  "january": 1, "february": 2, "march": 3, "april": 4,
  "may": 5, "june": 6, "july": 7, "august": 8,
  "september": 9, "october": 10, "november": 11, "december": 12,
  "jan": 1, "feb": 2, "mar": 3, "apr": 4,
  "jun": 6, "jul": 7, "aug": 8,
  "sep": 9, "oct": 10, "nov": 11, "dec": 12,
  "জানুয়ারি": 1, "ফেব্রুয়ারি": 2, "মার্চ": 3, "এপ্রিল": 4,
  "মে": 5, "জুন": 6, "জুলাই": 7, "আগস্ট": 8,
  "সেপ্টেম্বর": 9, "অক্টোবর": 10, "নভেম্বর": 11, "ডিসেম্বর": 12
};

const MONTH_NAMES = ["", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

function loadDB() {
  try { return JSON.parse(fs.readFileSync(DB_FILE, "utf8")); } catch { return {}; }
}
function saveDB(d) {
  fs.ensureDirSync(path.dirname(DB_FILE));
  fs.writeFileSync(DB_FILE, JSON.stringify(d, null, 2));
}
function parseMonth(s) {
  return MONTHS[s.toLowerCase()] || parseInt(s);
}
function daysUntil(day, month) {
  const now = new Date();
  const thisYear = new Date(now.getFullYear(), month - 1, day);
  if (thisYear < now) thisYear.setFullYear(now.getFullYear() + 1);
  return Math.round((thisYear - now) / 86400000);
}
function isToday(day, month) {
  const now = new Date();
  return now.getDate() === day && (now.getMonth() + 1) === month;
}

module.exports = {
  config: {
    name: "birthday",
    aliases: ["bday", "জন্মদিন"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 3,
    role: 0,
    shortDescription: { en: "Birthday tracker — set, check and list birthdays" },
    longDescription: { en: "Track birthdays of group members. Set your own, check others, see upcoming birthdays." },
    category: "utility",
    guide: {
      en: "{p}birthday set <day> <month>   — Set your birthday\n{p}birthday check @mention      — Check someone's birthday\n{p}birthday list                — See all birthdays in group\n{p}birthday upcoming           — Upcoming birthdays (7 days)\n{p}birthday delete             — Remove your birthday\n\nExamples:\n{p}birthday set 15 June\n{p}birthday set 3 March"
    }
  },

  onStart: async function ({ api, event, args, message, usersData }) {
    const sub = args[0]?.toLowerCase();
    const db = loadDB();

    if (!sub || sub === "help") {
      return message.reply(
        `╔══════════════════════╗\n` +
        `║  🎂 Birthday Tracker  ║\n` +
        `╚══════════════════════╝\n\n` +
        `  .birthday set 15 June   → birthday সেট\n` +
        `  .birthday check @tag    → কারো birthday দেখো\n` +
        `  .birthday list          → সব birthday list\n` +
        `  .birthday upcoming      → ৭ দিনের মধ্যে কার?\n` +
        `  .birthday delete        → তোমার birthday মুছো`
      );
    }

    if (sub === "set") {
      const day = parseInt(args[1]);
      const month = args[2] ? parseMonth(args[2]) : NaN;
      if (isNaN(day) || day < 1 || day > 31 || isNaN(month) || month < 1 || month > 12) {
        return message.reply("❌ সঠিক format: .birthday set <day> <month>\nExample: .birthday set 15 June");
      }
      db[event.senderID] = { day, month, name: null };
      try {
        const userData = await usersData.get(event.senderID);
        db[event.senderID].name = userData?.name || "Unknown";
      } catch {}
      saveDB(db);
      const days = daysUntil(day, month);
      message.reply(
        `🎂 Birthday সেট হয়েছে!\n\n` +
        `  ✦ তারিখ › ${day} ${MONTH_NAMES[month]}\n` +
        `  ✦ আর › ${days === 0 ? "আজকেই! 🎉" : `${days} দিন বাকি!`}\n\n` +
        `🎉 আমরা সেদিন wish করব!`
      );
      return;
    }

    if (sub === "delete") {
      if (!db[event.senderID]) return message.reply("❌ তোমার কোনো birthday সেট নেই।");
      delete db[event.senderID];
      saveDB(db);
      return message.reply("✅ তোমার birthday মুছে ফেলা হয়েছে।");
    }

    if (sub === "check") {
      const mentioned = Object.keys(event.mentions || {});
      const targetId = mentioned[0] || event.senderID;
      const entry = db[targetId];
      if (!entry) {
        return message.reply(`❌ এই user এর birthday সেট করা নেই।\n\nSelf set করতে: .birthday set 15 June`);
      }
      const days = daysUntil(entry.day, entry.month);
      const today = isToday(entry.day, entry.month);
      message.reply(
        `🎂 Birthday Info:\n\n` +
        `  ✦ নাম  › ${entry.name || "Unknown"}\n` +
        `  ✦ Date › ${entry.day} ${MONTH_NAMES[entry.month]}\n` +
        `  ✦      › ${today ? "🎉 আজকেই!" : `${days} দিন বাকি`}`
      );
      return;
    }

    if (sub === "list") {
      if (!Object.keys(db).length) return message.reply("📋 কোনো birthday এখনো সেট করা হয়নি।");
      const sorted = Object.entries(db).sort((a, b) => daysUntil(a[1].day, a[1].month) - daysUntil(b[1].day, b[1].month));
      const lines = sorted.slice(0, 20).map(([uid, d]) => {
        const days = daysUntil(d.day, d.month);
        const today = isToday(d.day, d.month);
        return `  ${today ? "🎉" : "🎂"} ${d.name || uid} — ${d.day} ${MONTH_NAMES[d.month]} ${today ? "(আজ!)" : `(${days}d)`}`;
      }).join("\n");
      message.reply(
        `╔══════════════════════╗\n` +
        `║  🎂 Birthday List     ║\n` +
        `╚══════════════════════╝\n\n` +
        `${lines}\n\n` +
        `  Total: ${Object.keys(db).length} জন`
      );
      return;
    }

    if (sub === "upcoming") {
      const upcoming = Object.entries(db)
        .map(([uid, d]) => ({ uid, ...d, days: daysUntil(d.day, d.month) }))
        .filter(d => d.days <= 7)
        .sort((a, b) => a.days - b.days);
      if (!upcoming.length) return message.reply("📅 আগামী ৭ দিনে কারো birthday নেই।");
      const lines = upcoming.map(d =>
        `  ${d.days === 0 ? "🎉 আজ!" : `📅 ${d.days} দিন`} — ${d.name || d.uid} (${d.day} ${MONTH_NAMES[d.month]})`
      ).join("\n");
      message.reply(`🎂 আগামী ৭ দিনের Birthday:\n\n${lines}`);
      return;
    }

    message.reply("❌ Unknown command। .birthday help দেখো।");
  }
};
