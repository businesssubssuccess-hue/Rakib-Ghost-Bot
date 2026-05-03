/**
 * @MODULE: GHOST_NET_STATUS_V4
 * @DESIGN: ULTRA NEON GIF & GRAPHICS
 * @AUTHOR: RAKIB ISLAM (ACS)
 */

const axios = require("axios");
const process = require('process');
const os = require('os');

module.exports = {
  config: {
    name: "status4",
    aliases: ["st4", "botstatus4"],
    version: "4.0.0",
    author: "RAKIB ISLAM",
    countDown: 10,
    role: 0,
    category: "system",
    shortDescription: { en: "High Quality Neon Status GIF" }
  },

  onStart: async function ({ api, event, message }) {
    const { threadID, messageID } = event;
    
    // --- System Data ---
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    
    const ping = Date.now() - event.timestamp;
    const ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const cpu = os.cpus().length;

    message.reply("⚡ | Ghost-Net Neon Core লোড হচ্ছে, একটু ওয়েট করেন বস...");

    // --- Neon High-Quality GIF/Image API ---
    // এখানে আমরা আপনার নামের একটা নিওন টেক্সট এনিমেশন জেনারেট করছি
    const neonText = `GHOST-NET_V4_ONLINE`;
    const gifUrl = `https://api.popcat.xyz/texttovideo?text=${encodeURIComponent(neonText)}`;
    
    // হাই কোয়ালিটি নিওন ব্যাকগ্রাউন্ড স্টাইল
    const dashboard = 
      `╭──────❍ 𝗚𝗛𝗢𝗦𝗧-𝗡𝗘𝗧 ❍──────╮\n` +
      `│ 🤖 𝗕𝗼𝘁 𝗡𝗮𝗺𝗲: 𝗚𝗛𝗢𝗦𝗧-𝗡𝗘𝗧 𝗔𝗜\n` +
      `│ ⚡ 𝗣𝗶𝗻𝗴: ${ping}𝗺𝘀 (𝗨𝗹𝘁𝗿𝗮 𝗙𝗮𝘀𝘁)\n` +
      `│ ⏰ 𝗨𝗽𝘁𝗶𝗺𝗲: ${hours}𝗵 ${minutes}𝗺\n` +
      `│ 📟 𝗥𝗔𝗠: ${ram} 𝗠𝗕 / ${cpu}-𝗖𝗼𝗿𝗲 𝗖𝗣𝗨\n` +
      `│ 🛡️ 𝗦𝘁𝗮𝘁𝘂𝘀: 𝗚𝗼𝗱 𝗠𝗼𝗱𝗲 𝗔𝗰𝘁𝗶𝘃𝗲\n` +
      `╰─────────── 💠 ───────────╯\n` +
      `𝗗𝗲𝘀𝗶𝗴𝗻𝗲𝗱 𝗯𝘆 𝗔𝗖𝗦 𝗥𝗔𝗞𝗜𝗕 🧸`;

    try {
      const gifStream = (await axios.get(gifUrl, { responseType: 'stream' })).data;

      return api.sendMessage({
        body: dashboard,
        attachment: gifStream
      }, threadID, messageID);
      
    } catch (e) {
      // যদি GIF এপিআই কাজ না করে তবে প্রিমিয়াম নিওন ইমেজ পাঠাবে
      const fallbackImg = `https://pic.re/image`; 
      return api.sendMessage({
        body: dashboard,
        attachment: await global.utils.getStreamFromURL(`https://api.memegen.link/images/custom/_/ghost_net_active.png?background=https://i.imgur.com/39N3pW2.gif`)
      }, threadID, messageID);
    }
  }
};
