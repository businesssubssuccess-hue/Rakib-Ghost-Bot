const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const CHAT_STATE_FILE = path.join(__dirname, "cache", "chat_state.json");

function getChatState(tid) {
  try { const d = fs.readJsonSync(CHAT_STATE_FILE); return d[tid] !== false; } catch { return true; }
}

const baseApiUrl = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/exe/main/baseApiUrl.json");
  return base.data.jan;
};

async function getBotResponse(message) {
  try {
    const base = await baseApiUrl();
    const response = await axios.get(`${base}/jan/font3/${encodeURIComponent(message)}`);
    return response.data?.message || "try Again";
  } catch (error) {
    return "error janu 🥲";
  }
}

module.exports = {
  config: {
    name: "bot",
    version: "1.8",
    author: "MahMUD",
    role: 0,
    description: { en: "no prefix command." },
    category: "ai",
    guide: { en: "just type jan" },
  },

  onStart: async function () {},

  onReply: async function ({ api, event }) {
    if (!getChatState(event.threadID)) return;
    if (event.type === "message_reply") {
      let message = event.body.toLowerCase() || "opp2";
      if (message) {
        const replyMessage = await getBotResponse(message);
        api.sendMessage(replyMessage, event.threadID, (err, info) => {
          if (!err) {
            global.GoatBot.onReply.set(info.messageID, {
              commandName: "bot",
              type: "reply",
              messageID: info.messageID,
              author: event.senderID,
              text: replyMessage,
            });
          }
        }, event.messageID);
      }
    }
  },

  onChat: async function ({ api, event }) {
    if (!getChatState(event.threadID)) return;

    const responses = [
      "babu khuda lagse🥺",
      "Hop beda😾, Boss বল boss😼",
      "আমাকে ডাকলে, আমি কিন্তূ কিস করে দেবো😘",
      "🐒🐒🐒",
      "bye",
      "mb ney bye",
      "meww",
      "বলো কি বলবা, সবার সামনে বলবা নাকি?🤭🤏",
      "𝗜 𝗹𝗼𝘃𝗲 𝘆𝗼𝘂__😘😘",
      "𝗜 𝗵𝗮𝘁𝗲 𝘆𝗼𝘂__😏😏",
    ];

    const mahmuds = ["jan", "jaan", "জান", "hinata", "bby", "baby", "bbu", "বাবু", "বেবি"];
    let message = event.body ? event.body.toLowerCase() : "";
    const words = message.split(" ");
    const wordCount = words.length;

    if (event.type !== "message_reply" && mahmuds.some(mahmud => message.startsWith(mahmud))) {
      api.setMessageReaction("🪽", event.messageID, () => {}, true);
      api.sendTypingIndicator(event.threadID, true);

      if (wordCount === 1) {
        const randomMsg = responses[Math.floor(Math.random() * responses.length)];
        api.sendMessage({ body: randomMsg }, event.threadID, (err, info) => {
          if (!err) {
            global.GoatBot.onReply.set(info.messageID, {
              commandName: "bot",
              type: "reply",
              messageID: info.messageID,
              author: event.senderID,
              link: randomMsg,
            });
          }
        }, event.messageID);
      } else {
        words.shift();
        const userText = words.join(" ");
        const botResponse = await getBotResponse(userText);
        api.sendMessage(botResponse, event.threadID, (err, info) => {
          if (!err) {
            global.GoatBot.onReply.set(info.messageID, {
              commandName: "bot",
              type: "reply",
              messageID: info.messageID,
              author: event.senderID,
              text: botResponse,
            });
          }
        }, event.messageID);
      }
    }
  },
};
