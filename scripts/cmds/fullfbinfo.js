const axios = require("axios");
const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "fullfbinfo",
    aliases: ["fbinfo", "fullinfo", "userinfo2"],
    version: "1.0",
    author: "Rakib",
    countDown: 5,
    role: 0,
    shortDescription: "View full Facebook profile info of any user",
    longDescription: "Reply / mention / link / uid দিয়ে কারো সম্পূর্ণ FB profile info দেখো",
    category: "info",
    guide: { en: "{p}fullfbinfo @mention | reply | <uid> | <profile-link>" }
  },

  onStart: async function ({ event, message, args, api, usersData, threadsData }) {
    let uid = null;

    if (event.type === "message_reply") uid = event.messageReply.senderID;
    else if (Object.keys(event.mentions || {}).length) uid = Object.keys(event.mentions)[0];
    else if (args[0]) {
      const a = args[0];
      if (/^\d+$/.test(a)) uid = a;
      else if (a.includes("facebook.com")) {
        try {
          uid = await api.getUID(a);
        } catch {
          return message.reply("👻 এই FB link থেকে UID বের করতে পারলাম না।");
        }
      }
    } else uid = event.senderID;

    if (!uid) return message.reply("👻 Reply / mention / uid / FB link দিন।");

    await message.reaction("⏳", event.messageID);

    try {
      const info = (await api.getUserInfo(uid))[uid] || {};
      const userData = (await usersData.get(uid).catch(() => ({}))) || {};
      const allUsers = await usersData.getAll().catch(() => []);
      const allThreads = await threadsData.getAll().catch(() => []);

      const sharedThreads = allThreads.filter(t =>
        t.members && t.members.some(m => m.userID === uid)
      );
      const moneyRank = (allUsers
        .sort((a, b) => (b.money || 0) - (a.money || 0))
        .findIndex(u => u.userID === uid)) + 1;
      const expRank = (allUsers
        .sort((a, b) => (b.exp || 0) - (a.exp || 0))
        .findIndex(u => u.userID === uid)) + 1;

      const created = uid.length >= 12 ? estimateAccountCreation(uid) : "Unknown";
      const avatar = `https://graph.facebook.com/${uid}/picture?width=720&height=720`;
      const profileURL = `https://facebook.com/${uid}`;

      const dhakaTime = moment().tz("Asia/Dhaka").format("DD MMM YYYY hh:mm A");

      const text = `
👻 𝗚𝗛𝗢𝗦𝗧 𝗡𝗘𝗧 ▸ 𝗙𝗨𝗟𝗟 𝗙𝗕 𝗜𝗡𝗙𝗢
━━━━━━━━━━━━━━━━━━
🆔 UID         : ${uid}
👤 Name        : ${info.name || userData.name || "Unknown"}
🔗 First Name  : ${info.firstName || "—"}
👫 Vanity      : ${info.vanity || "—"}
⚧  Gender      : ${info.gender === 1 ? "Female ♀" : info.gender === 2 ? "Male ♂" : "Custom/Unknown"}
🌐 Profile URL : ${profileURL}
📌 Alternate   : https://facebook.com/profile.php?id=${uid}
🖼  Avatar      : ${avatar}
🪪 Type        : ${info.type || "user"}
✅ Friend?     : ${info.isFriend ? "Yes" : "No"}
👁  Subscribed  : ${info.isBirthday ? "🎂 Today!" : "—"}
📅 Account Est : ${created}
━━━━━━━━━━━━━━━━━━
📊 𝗕𝗢𝗧 𝗦𝗧𝗔𝗧𝗦
💰 Money       : $${(userData.money || 0).toLocaleString()}
⭐ EXP         : ${userData.exp || 0}
🏆 Money Rank  : #${moneyRank || "N/A"}
🎖  EXP Rank    : #${expRank || "N/A"}
👥 Shared GCs  : ${sharedThreads.length}
🚫 Banned?     : ${userData.banned?.status ? "Yes — " + (userData.banned.reason || "") : "No"}
━━━━━━━━━━━━━━━━━━
🕐 Time (BD)   : ${dhakaTime}
👻 Powered by Ghost Net Edition`;

      const imgRes = await axios.get(avatar, { responseType: "stream" }).catch(() => null);
      await message.reaction("✅", event.messageID);

      return message.reply({
        body: text,
        attachment: imgRes ? imgRes.data : undefined
      });
    } catch (e) {
      await message.reaction("❌", event.messageID);
      return message.reply(`👻 Info আনতে পারলাম না: ${e.message}`);
    }
  }
};

function estimateAccountCreation(uid) {
  const n = parseInt(uid.toString().slice(0, 10));
  if (!n || isNaN(n)) return "Unknown";
  const epoch = Math.floor(n / 10000) + 1071000000;
  const d = new Date(epoch * 1000);
  if (d.getFullYear() < 2004 || d.getFullYear() > new Date().getFullYear()) return "Unknown";
  return moment(d).format("MMM YYYY");
}
