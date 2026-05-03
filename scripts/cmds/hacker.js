const axios = require("axios");

// হ্যাকিং ভয় দেখানোর লাইনগুলো
const HACK_LINES = [
  "📡 Connection Established... Targeted UID: [UID_HERE]",
  "💉 Injecting Ghost-Net Malware into the system...",
  "🔓 Bypass Firewall success! Accessing private folders...",
  "📸 Front Camera Accessing... (Smile for the picture! 😈)",
  "📍 GPS Location Found: Saidpur near proximity detected.",
  "📂 Fetching Browser History... (Oh! Ki sob dekho egulo? 🌚)",
  "⚠️ Battery Overheating Protocol Initiated...",
  "🛑 Internal Storage 99% Compromised by Ghost Net.",
  "📱 Device Model: Android/Mobile detected (Termux Environment Found).",
  "🔑 Facebook Session Key successfully decrypted.",
  "👻 Rakib Boss is now controlling your device remotely!",
  "💾 Copying Contact List to Ghost Cloud Server...",
  "🔇 Microphone activated. System is listening to you...",
  "💀 SYSTEM CRITICAL: Deleting 'System32' (Wait, it's a mobile? Deleting Root!)",
  "💸 Automated Payment Gateway accessed... Checking Balance...",
  "🚨 Local Police alerted with your current coordinates!",
  "📡 Proxy Server: 192.168.1.104 [Ghost-Vpn Active]",
  "🌑 Dark Web database matching complete. User found!",
  "🔥 Your phone is now a part of Rakib's Botnet Army.",
  "🚫 Device Lock in 3... 2... 1... (Just Kidding, or am I?)"
];

if (!global.hackerLoops) global.hackerLoops = new Map();
if (!global.hackerWait) global.hackerWait = new Map();

module.exports = {
  config: {
    name: "hacker",
    aliases: ["hack9", "ghosthack","hacker","id-urao"],
    version: "2.5",
    author: "Rakib",
    countDown: 5,
    role: 1, // Admin & Owner only
    shortDescription: "Fake hacking prank (Ghost Net Style) with Unsend",
    category: "prank",
    guide: { en: "{p}hacker [reply/mention] [u] | {p}hacker loop [u] | {p}hacker stop" }
  },

  onStart: async function ({ message, args, event, api }) {
    const { threadID, mentions } = event;

    // স্টপ করার লজিক
    if (args[0] === "stop") {
      if (global.hackerLoops.has(threadID)) {
        clearInterval(global.hackerLoops.get(threadID));
        global.hackerLoops.delete(threadID);
        return message.reply("⭕ হ্যাকিং প্রোটোকল টার্মিনেট করা হয়েছে। সিস্টেম এখন নিরাপদ।");
      }
      if (global.hackerWait.has(threadID)) {
        global.hackerWait.delete(threadID);
        return message.reply("⭕ হ্যাকার মোড অফ করা হয়েছে।");
      }
      return message.reply("⚠️ কোনো হ্যাকিং প্রসেস বর্তমানে চালু নেই।");
    }

    // আনসেন্ড লজিক চেক
    const isUnsend = args.some(arg => arg.toLowerCase() === "u");
    const isLoop = args.includes("loop");

    let targetID, targetName;

    if (event.type === "message_reply") {
      targetID = event.messageReply.senderID;
    } else if (Object.keys(mentions).length > 0) {
      targetID = Object.keys(mentions)[0];
    } else {
      return message.reply("⚠️ দয়া করে কাউকে মেনশন দিন বা রিপ্লাই দিয়ে হ্যাকিং শুরু করুন।");
    }

    try {
      const info = await api.getUserInfo(targetID);
      targetName = info[targetID].name;

      if (isLoop) {
        if (global.hackerLoops.has(threadID)) return message.reply("⚠️ অলরেডি একটা হ্যাকিং প্রসেস চলছে!");
        
        message.reply(`💀 GHOST-NET HACKING INITIATED ON @${targetName}... ${isUnsend ? "(Auto-Unsend Active)" : ""}`);
        
        const intervalId = setInterval(() => {
          const line = HACK_LINES[Math.floor(Math.random() * HACK_LINES.length)].replace("[UID_HERE]", targetID);
          api.sendMessage({
            body: line,
            mentions: [{ tag: `@${targetName}`, id: targetID }]
          }, threadID, (err, info) => {
             if (isUnsend && !err) {
               setTimeout(() => api.unsendMessage(info.messageID), 3000);
             }
          });
        }, 2000); // ২ সেকেন্ড লুপ

        global.hackerLoops.set(threadID, intervalId);
      } else {
        // ওয়েট মোড
        global.hackerWait.set(threadID, { targetID, targetName, isUnsend });
        const firstLine = HACK_LINES[Math.floor(Math.random() * HACK_LINES.length)].replace("[UID_HERE]", targetID);
        return api.sendMessage({
          body: `🕵️‍♂️ @${targetName}, ${firstLine}\n\nডিভাইস এখন রাকিব বসের সার্ভারে কানেক্টেড। রিপ্লাই দিলে খবর আছে!`,
          mentions: [{ tag: `@${targetName}`, id: targetID }]
        }, threadID, (err, info) => {
           if (isUnsend && !err) {
             setTimeout(() => api.unsendMessage(info.messageID), 3000);
           }
        });
      }

    } catch (e) {
      return message.reply("❌ হ্যাকিং ফেইলড! ইউজার ইনফো পাওয়া যায়নি।");
    }
  },

  onReply: async function ({ message, event, api }) {
    const { threadID, senderID } = event;
    if (!global.hackerWait.has(threadID)) return;

    const data = global.hackerWait.get(threadID);
    if (senderID === data.targetID) {
      const line = HACK_LINES[Math.floor(Math.random() * HACK_LINES.length)].replace("[UID_HERE]", senderID);
      api.sendMessage({
        body: `[CRITICAL] @${data.targetName} ${line}`,
        mentions: [{ tag: `@${data.targetName}`, id: data.targetID }]
      }, threadID, (err, info) => {
         if (data.isUnsend && !err) {
           setTimeout(() => api.unsendMessage(info.messageID), 3000);
         }
      });
    }
  }
};