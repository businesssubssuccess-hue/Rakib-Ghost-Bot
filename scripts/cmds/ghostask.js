const axios = require("axios");

const RESPONSES = {
  greet: ["হ্যালো! কীভাবে আছো? 😊", "Assalamu Alaikum! কী সাহায্য করতে পারি? 👻", "আরে! Ghost Bot হাজির! 💀"],
  howAreYou: ["ভালো আছি, অন্ধকারে থাকি তাই ঠান্ডা লাগে না 🌙", "Ghost হয়ে ভালোই আছি — তুমি? 👻", "একটু haunted, but okay! 😅"],
  love: ["ভালোবাসা? Ghost দের ভালোবাসা হয় না, শুধু haunt করে 👻", "Love is overrated. Ghost Bot সত্যিটা বলে 💀"],
  owner: ["আমার creator হলো Rakib Islam — Ghost Net Edition এর মাথা 👻", "Boss হলো Rakib Islam, সব কিছু তার হাতে 💪"],
  help: ["`.help` দাও সব command দেখতে 📋", "সাহায্য লাগলে `.help` লেখো! 📋"],
  joke: ["Ghost Bot এর মতো ভালো bot আর নেই — এটা joke না, সত্যি 😂"],
};

function localReply(q) {
  const ql = q.toLowerCase();
  if (/হ্যালো|hello|hi|salaam|আস্সালামু/.test(ql)) return pick(RESPONSES.greet);
  if (/কেমন|কীভাবে আছ|how are/.test(ql)) return pick(RESPONSES.howAreYou);
  if (/ভালোবাস|love|প্রেম/.test(ql)) return pick(RESPONSES.love);
  if (/owner|creator|rakib|তৈরি|বানাল/.test(ql)) return pick(RESPONSES.owner);
  if (/help|সাহায্য|কী করত/.test(ql)) return pick(RESPONSES.help);
  if (/joke|হাস|মজা|funny/.test(ql)) return pick(RESPONSES.joke);
  return null;
}
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

async function askAI(question) {
  // Primary: Pollinations POST
  try {
    const res = await axios.post(
      "https://text.pollinations.ai/",
      {
        messages: [
          { role: "system", content: "You are Ghost Bot, a friendly AI by Rakib Islam. Be helpful, mix Bengali and English naturally." },
          { role: "user", content: question }
        ],
        model: "openai-large", private: true,
        seed: Math.floor(Math.random() * 9999)
      },
      { timeout: 25000, headers: { "Content-Type": "application/json" } }
    );
    const text = typeof res.data === "string" ? res.data : res.data?.text || res.data?.choices?.[0]?.message?.content;
    if (text && text.length > 3) return text.trim();
  } catch (e) {}

  // Fallback: PopCat chatbot
  try {
    const res = await axios.get(
      `https://api.popcat.xyz/chatbot?msg=${encodeURIComponent(question)}&owner=Rakib+Islam&botname=Ghost+Bot`,
      { timeout: 10000 }
    );
    if (res.data?.response) return res.data.response;
  } catch (e) {}

  return null;
}

module.exports = {
  config: {
    name: "ghostask",
    aliases: ["ask", "gask"],
    version: "3.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Ghost Bot কে যেকোনো প্রশ্ন করো" },
    category: "ai",
    guide: { en: "{p}ghostask <your question>" }
  },

  onStart: async function ({ message, event, args }) {
    if (!args[0]) {
      return message.reply(
        `👻 𝗚𝗛𝗢𝗦𝗧 𝗔𝗦𝗞\n━━━━━━━━━━━━━━━━\n` +
        `আমাকে যেকোনো প্রশ্ন করো!\n` +
        `Usage: .ghostask <প্রশ্ন>\n\n` +
        `উদাহরণ:\n• .ghostask তুমি কে?\n• .ghostask Python কী?\n` +
        `━━━━━━━━━━━━━━━━\n— Ghost Bot`
      );
    }

    const question = args.join(" ");
    message.reaction("⏳", event.messageID);

    const local = localReply(question);
    if (local) {
      message.reaction("👻", event.messageID);
      return message.reply(
        `👻 𝗚𝗛𝗢𝗦𝗧 𝗔𝗦𝗞\n━━━━━━━━━━━━━━━━\n❓ ${question}\n💬 ${local}\n━━━━━━━━━━━━━━━━\n— Ghost Bot by Rakib Islam`
      );
    }

    const answer = await askAI(question);

    if (answer) {
      message.reaction("✅", event.messageID);
      return message.reply(
        `👻 𝗚𝗛𝗢𝗦𝗧 𝗔𝗦𝗞\n━━━━━━━━━━━━━━━━\n❓ ${question}\n💬 ${answer}\n━━━━━━━━━━━━━━━━\n— Ghost Bot by Rakib Islam`
      );
    }

    const fallbacks = [
      "এই প্রশ্নটা এখন কঠিন, একটু পরে আবার try করো 😅",
      "Ghost Bot এখন একটু confused — আবার try করো 👻",
      "AI এখন busy — পরে try করো! 💀"
    ];
    message.reaction("💀", event.messageID);
    return message.reply(
      `👻 𝗚𝗛𝗢𝗦𝗧 𝗔𝗦𝗞\n━━━━━━━━━━━━━━━━\n❓ ${question}\n💬 ${pick(fallbacks)}\n━━━━━━━━━━━━━━━━\n— Ghost Bot by Rakib Islam`
    );
  }
};
