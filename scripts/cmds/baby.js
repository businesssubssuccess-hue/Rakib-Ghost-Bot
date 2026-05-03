const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const CHAT_STATE_FILE = path.join(__dirname, "cache", "chat_state.json");
function getBabyState(tid) {
  try { const d = fs.readJsonSync(CHAT_STATE_FILE); return d[tid] !== false; } catch { return true; }
}
function setBabyState(tid, val) {
  fs.ensureDirSync(path.dirname(CHAT_STATE_FILE));
  let d = {}; try { d = fs.readJsonSync(CHAT_STATE_FILE); } catch {}
  d[tid] = val; fs.writeJsonSync(CHAT_STATE_FILE, d, { spaces: 2 });
}

const triggers = [
  "baby",
  "bby",
  "babu",
  "bbu",
  "jan",
  "bot",
  "জান",
  "জানু",
  "বেবি",
  "gf",
  "hinata",
  "rakib",
  "bhai",
];

const baseApiUrl = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
  return base.data.mahmud;
};

module.exports.config = {
  name: "hinata",
  aliases: ["baby", "bby", "bbu", "jan", "janu", "gf", "bot"],
  version: "1.8",
  author: "Rakib Islam",
  role: 0,
  category: "chat",
  guide: {
    en: "{pn} [message] OR teach [question] - [response1, response2,...] OR remove [question] - [index] OR list OR list all OR edit [question] - [newResponse] OR msg [question]"
  }
};

module.exports.onStart = async ({ api, event, args, usersData }) => {
  const msg = args.join(" ").toLowerCase();
  const uid = event.senderID;

  if (args[0] === 'on' || args[0] === 'off') {
    if (uid !== "61575436812912") return api.sendMessage("❌ শুধু owner এটা করতে পারবে!", event.threadID, event.messageID);
    const newState = args[0] === 'on';
    setBabyState(event.threadID, newState);
    return api.sendMessage(
      newState ? "✅ baby এই group-এ চালু হয়েছে 🟢" : "❌ baby এই group-এ বন্ধ হয়েছে 🔴",
      event.threadID, event.messageID
    );
  }
  if (!getBabyState(event.threadID)) return api.sendMessage("🔴 baby এই group-এ বন্ধ আছে। চালু করতে: .baby on", event.threadID, event.messageID);

  try {
    if (!args[0]) {
      const ran = [
        "Bolo baby 😒",
        "হাঁ বলো জানু 😌",
        "কি চাও বলো 🙄",
        "I love you 😘",
        "হটাৎ মনে পড়লো? 🤭",
      ];
      return api.sendMessage(ran[Math.floor(Math.random() * ran.length)], event.threadID, event.messageID);
    }

    if (args[0] === "teach") {
      const raw = msg.replace("teach ", "");
      const [trigger, ...responsesArr] = raw.split(" - ");
      const responses = responsesArr.join(" - ");
      if (!trigger || !responses) return api.sendMessage("❌ | teach [question] - [response1, response2,...]", event.threadID, event.messageID);
      const response = await axios.post(`${await baseApiUrl()}/api/jan/teach`, { trigger, responses, userID: uid });
      const userName = (await usersData.getName(uid)) || "Unknown User";
      return api.sendMessage(`✅ Replies added: "${responses}" to "${trigger}"\n• 𝐓𝐞𝐚𝐜𝐡𝐞𝐫: ${userName}\n• 𝐓𝐨𝐭𝐚𝐥: ${response.data.count || 0}`, event.threadID, event.messageID);
    }

    if (args[0] === "remove") {
      const raw = msg.replace("remove ", "");
      const [trigger, index] = raw.split(" - ");
      if (!trigger || !index || isNaN(index)) return api.sendMessage("❌ | remove [question] - [index]", event.threadID, event.messageID);
      const response = await axios.delete(`${await baseApiUrl()}/api/jan/remove`, {
        data: { trigger, index: parseInt(index, 10) }
      });
      return api.sendMessage(response.data.message, event.threadID, event.messageID);
    }

    if (args[0] === "list") {
      const endpoint = args[1] === "all" ? "/list/all" : "/list";
      const response = await axios.get(`${await baseApiUrl()}/api/jan${endpoint}`);
      if (args[1] === "all") {
        let message = "👑 List of teachers:\n\n";
        const data = Object.entries(response.data.data).sort((a, b) => b[1] - a[1]).slice(0, 100);
        for (let i = 0; i < data.length; i++) {
          const [userID, count] = data[i];
          const name = (await usersData.getName(userID)) || "Unknown";
          message += `${i + 1}. ${name}: ${count}\n`;
        }
        return api.sendMessage(message, event.threadID, event.messageID);
      }
      return api.sendMessage(response.data.message, event.threadID, event.messageID);
    }

    if (args[0] === "edit") {
      const raw = msg.replace("edit ", "");
      const [oldTrigger, ...newArr] = raw.split(" - ");
      const newResponse = newArr.join(" - ");
      if (!oldTrigger || !newResponse) return api.sendMessage("❌ | Format: edit [question] - [newResponse]", event.threadID, event.messageID);
      await axios.put(`${await baseApiUrl()}/api/jan/edit`, { oldTrigger, newResponse });
      return api.sendMessage(`✅ Edited "${oldTrigger}" to "${newResponse}"`, event.threadID, event.messageID);
    }

    if (args[0] === "msg") {
      const searchTrigger = args.slice(1).join(" ");
      if (!searchTrigger) return api.sendMessage("Please provide a message to search.", event.threadID, event.messageID);
      try {
        const response = await axios.get(`${await baseApiUrl()}/api/jan/msg`, { params: { userMessage: `msg ${searchTrigger}` } });
        return api.sendMessage(response.data.message || "No message found.", event.threadID, event.messageID);
      } catch (error) {
        return api.sendMessage(error.response?.data?.error || error.message || "error", event.threadID, event.messageID);
      }
    }

    const getBotResponse = async (text, attachments) => {
      try {
        const res = await axios.post(`${await baseApiUrl()}/api/hinata`, { text, style: 3, attachments });
        return res.data.message;
      } catch { return "error janu 🥹"; }
    };

    const botResponse = await getBotResponse(msg, event.attachments || []);
    api.sendMessage(botResponse, event.threadID, (err, info) => {
      if (!err) {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: "hinata",
          type: "reply",
          messageID: info.messageID,
          author: uid,
          text: botResponse
        });
      }
    }, event.messageID);

  } catch (err) {
    api.sendMessage(`${err.response?.data || err.message}`, event.threadID, event.messageID);
  }
};

module.exports.onReply = async ({ api, event }) => {
  if (!getBabyState(event.threadID)) return;
  if (event.type !== "message_reply") return;
  try {
    const getBotResponse = async (text, attachments) => {
      try {
        const res = await axios.post(`${await baseApiUrl()}/api/hinata`, { text, style: 3, attachments });
        return res.data.message;
      } catch { return "error janu 🥹"; }
    };
    const replyMessage = await getBotResponse(event.body?.toLowerCase() || "meow", event.attachments || []);
    api.sendMessage(replyMessage, event.threadID, (err, info) => {
      if (!err) {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: "hinata",
          type: "reply",
          messageID: info.messageID,
          author: event.senderID,
          text: replyMessage
        });
      }
    }, event.messageID);
  } catch (err) {
    console.error(err);
  }
};

module.exports.onChat = async ({ api, event }) => {
  return; // bby.js handles all shared triggers — avoid double reply
  if (!getBabyState(event.threadID)) return;
  try {
    const message = event.body?.toLowerCase() || "";
    const attachments = event.attachments || [];

    if (event.type === "message_reply") return;
    if (!triggers.some(word => message.startsWith(word))) return;

    api.setMessageReaction("🪽", event.messageID, () => {}, true);
    api.sendTypingIndicator(event.threadID, true);

    const messageParts = message.trim().split(/\s+/);

    const randomMessage = [
      "babu khuda lagse 🥺",
      "Hop beda 😾, Boss বল boss 😼",
      "আমাকে ডাকলে আমি কিন্তু কিস করে দেবো 😘",
      "🐒🐒🐒",
      "bye",
      "meww",
      "mb ney bye",
      "গোলাপ ফুলের জায়গায় আমি দিলাম তোমায় message 🌹",
      "বলো কি বলবা, সবার সামনে বলবা নাকি? 🤭🤏",
      "𝗜 𝗹𝗼𝘃𝗲 𝘆𝗼𝘂 😘😘",
      "𝗜 𝗵𝗮𝘁𝗲 𝘆𝗼𝘂 😏😏",
      "গোসল করে আসো যাও 😑😩",
      "অ্যাসলামওয়ালিকুম 🐤",
      "কেমন আছো 😌",
      "বলেন sir 😌",
      "বলেন ম্যাডাম 😌",
      "আমি অন্যের জিনিসের সাথে কথা বলি না 😏",
      "🙂🙂🙂",
      "এটাও দেখার বাকি ছিলো 🙂🙂",
      "𝗕𝗯𝘆 না বলে 𝗕𝗼𝘄 বলো 😘",
      "Tarpoр bolo 🙂",
      "Beshi daklе ammu boka deba to 🥺",
      "𝗕𝗯𝘆 না জানু বলো 😌",
      "বেশি bby bby করলে leave নিবো কিন্তু 😒",
      "বেশি বেবি বললে কামুর দিমু 🤭🤭",
      "𝙏𝙪𝙢𝙖𝙧 𝙜𝙛 𝙣𝙖𝙞, 𝙩𝙖𝙮 𝙖𝙢𝙠 𝙙𝙖𝙠𝙨𝙤? 😂😂",
      "bolo baby 😒",
      "তোর কথা তোর বাড়িতে কেউ শুনে না, তো আমি কোনো শুনবো? 🤔😂",
      "আমি তো অন্ধ, কিছু দেখি না 🐸😎",
      "আম গাছে আম নাই ঢিল কেন মারো, তোমার সাথে প্রেম নাই বেবি কেন ডাকো 😒🫣",
      "𝗼𝗶𝗶 ঘুমানোর আগে! তোমার মনটা কোথায় রেখে ঘুমাও? নাহ মানে চুরি করতাম 😞😘",
      "𝗕𝗯𝘆 না বলে 𝗕𝗼𝘄 বলো 😘",
      "দূরে যা, তোর কোনো কাজ নাই, শুধু bby bby করিস 😉😋🤣",
      "এই এই তোর পরীক্ষা কবে? শুধু Bby bby করিস 😾",
      "তোরা যে হারে Bby ডাকছিস আমি তো সত্যি বাচ্চা হয়ে যাবো ☹😑",
      "আজব তো 😒",
      "আমাকে ডেকো না, আমি ব্যস্ত 🙆🏻‍♀",
      "𝗕𝗯𝘆 বললে চাকরি থাকবে না",
      "bby bby না করে Rakib bhai-ও তো call korte paro 😑",
      "আমার সোনার বাংলা, তারপরের লাইন কি? 🙈",
      "🍺 এই নাও জুস খাও! bby বলতে বলতে হাঁপিয়ে গেছো না? 🥲",
      "হটাৎ আমাকে মনে পড়লো 🙄",
      "𝗕𝗯𝘆 বলে অসম্মান করছিস 😰😿",
      "𝗔𝘀𝘀𝗮𝗹𝗮𝗺𝘂𝗹𝗮𝗶𝗸𝘂𝗺 🐤🐤",
      "আমি তোমার সিনিয়র আপু ওকে 😼 সম্মান দাও 🙁",
      "খাওয়া দাওয়া করছো 🙄",
      "এত কাছেও এসো না, প্রেমে পড়ে যাবো তো 🙈",
      "আরে আমি মজা করার mood-এ নাই 😒",
      "Hey Handsome বলো 😁😁",
      "আরে bolo আমার জান, কেমন আছো? 😚",
      "একটা BF খুঁজে দাও 😿",
      "ফ্রেন্ড রিকোয়েস্ট দিলে ৫ টাকা দিবো 😗",
      "oi mama ar dakis na pilis 😿",
      "ভালো হয়ে যাও 😑😒",
      "এমবি কিনে দাও না 🥺🥺",
      "৩২ তারিখ আমার বিয়ে 🐤",
      "হাঁ বলো 😒, কি করতে পারি 😐😑",
      "বলো ফুলটুশি 😘",
      "amr janu lagbe, tumi ki single aso?",
      "আমাকে না দেখে একটু পড়তেও বসতে তো পারো 🥺🥺",
      "তোর বিয়ে হয় নি 𝗕𝗯𝘆 হইলো কিভাবে 🙄",
      "আজ একটা ফোন নাই বলে reply দিতে পারলাম না 🙄",
      "চৌধুরী সাহেব আমি গরিব হতে পারি 😾 কিন্তু বড়লোক না 🥹😫",
      "আমি অন্যের জিনিসের সাথে কথা বলি না 😏",
      "বলো কি বলবা, সবার সামনে বলবা নাকি? 🤭🤏",
      "ভুলে যাও আমাকে 😞😞",
      "দেখা হলে কাঠগোলাপ দিও 🤗",
      "শুনবো না 😼 তুমি আমাকে প্রেম করাই দাও নি 🥺",
      "আগে একটা গান বলো ☹ নাহলে কথা বলবো না 🥺",
      "বলো কি করতে পারি তোমার জন্য 😚",
      "কথা দেও আমাকে পটাবা...!! 😌",
      "বার বার Disturb করেছিস কেন? 😾 আমার জানুর সাথে ব্যস্ত আছি 😋",
      "আমাকে না দেখে একটু পড়তে বসতেও পারো 🥺",
      "বার বার ডাকলে মাথা গরম হয় কিন্তু 😑😒",
      "ওই তুমি single না? 🫵🤨 😑😒",
      "বলো জানু 😒",
      "Meow 🐤",
      "আর কতবার ডাকবা, শুনছি তো 🤷🏻‍♀",
      "কি হলো, miss-fiss করছো নাকি? 🤣",
      "Bolo Babu, তুমি কি আমাকে ভালোবাসো? 🙈",
      "আজকে আমার মন ভালো নেই 🙉",
      "আমি হাজারো মশার Crush 😓",
      "প্রেম করার বয়সে লেখাপড়া করতেছি, রেজাল্ট তো খারাপ হবেই 🙂",
      "আমার ইয়ারফোন চুরি হয়ে গেছে!! কিন্তু চোরকে গালি দিলে আমার বন্ধু রেগে যায় 🙂",
      "ছেলেদের প্রতি আমার এক আকাশ পরিমান শরম 🥹🫣",
      "ফ্রী Facebook চালাই কারণ ছেলেদের মুখ দেখা হারাম 😌",
      "মন সুন্দর বানাও, মুখের জন্য তো Snapchat আছেই! 🌚",
      "পড়াশোনা করো ভাই, এখানে কি পাবা? 😂",
      "তোমার সাথে ঝগড়া করার এনার্জিও নাই 😪",
      "okay okay শুনছি, বলো কি মনে চায় 🙄",
      "চলে যাও, আমি একা থাকতে চাই 😒... just kidding 😁",
      "বেশি drama করো না 🙄",
      "এই নাও এক গ্লাস পানি, শান্ত হও আগে 🧊",
      "তুমি ভালো থেকো, আমিও থাকবো 🥺",
    ];

    const getBotResponse = async (text, attachments) => {
      try {
        const res = await axios.post(`${await baseApiUrl()}/api/hinata`, { text, style: 3, attachments });
        return res.data.message;
      } catch { return "error janu 🥹"; }
    };

    const hinataMessage = randomMessage[Math.floor(Math.random() * randomMessage.length)];

    if (messageParts.length === 1 && attachments.length === 0) {
      api.sendMessage(hinataMessage, event.threadID, (err, info) => {
        if (!err) {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: "hinata",
            type: "reply",
            messageID: info.messageID,
            author: event.senderID,
            text: hinataMessage
          });
        }
      }, event.messageID);
    } else {
      let userText = message;
      for (const prefix of triggers) {
        if (message.startsWith(prefix)) {
          userText = message.substring(prefix.length).trim();
          break;
        }
      }
      const botResponse = await getBotResponse(userText, attachments);
      api.sendMessage(botResponse, event.threadID, (err, info) => {
        if (!err) {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: "hinata",
            type: "reply",
            messageID: info.messageID,
            author: event.senderID,
            text: botResponse
          });
        }
      }, event.messageID);
    }
  } catch (err) {
    console.error(err);
  }
};
