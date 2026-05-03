module.exports = {
  config: {
    name: "ffredeem",
    aliases: ["redeemcode"],
    version: "1.0",
    author: "Rakib",
    countDown: 5,
    role: 0,
    shortDescription: "Free Fire redeem code info & link",
    category: "free fire",
    guide: { en: "{p}ffredeem" }
  },
  onStart: async function ({ message }) {
    return message.reply(`🎁 𝗙𝗙 𝗥𝗘𝗗𝗘𝗘𝗠 𝗖𝗢𝗗𝗘 𝗜𝗡𝗙𝗢
━━━━━━━━━━━━━━━━━━
🌐 Official Site:
https://reward.ff.garena.com/

📋 ব্যবহার:
1. উপরের link এ যাও
2. Facebook/Garena ID দিয়ে login করো
3. ১২-অক্ষরের redeem code দাও
4. Submit চাপো

⏰ Reward সাধারণত 24 ঘণ্টায় mailbox এ পাবে

⚠️ এই bot কোনো real-time code দেয় না — Free Fire এর official YouTube/Facebook page থেকে latest code নাও।

📅 প্রতিদিন নতুন code release হয় — নজর রাখো!
━━━━━━━━━━━━━━━━━━
👻 Ghost Net`);
  }
};
