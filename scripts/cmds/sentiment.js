const axios = require("axios");

// Local keyword-based quick analysis
function quickSentiment(text) {
  const t = text.toLowerCase();
  const pos = ["love", "happy", "great", "good", "awesome", "excellent", "wonderful", "amazing", "joy", "beautiful",
    "ভালো", "সুন্দর", "ভালোবাসি", "আনন্দ", "খুশি", "মজা", "দারুণ", "অসাধারণ", "সেরা", "প্রিয়"];
  const neg = ["hate", "bad", "terrible", "awful", "horrible", "sad", "angry", "worst", "disgusting", "pathetic",
    "খারাপ", "ঘৃণা", "বিরক্ত", "রাগ", "কষ্ট", "দুঃখ", "ব্যর্থ", "ভয়", "কাঁদি", "একা"];
  const posCount = pos.filter(w => t.includes(w)).length;
  const negCount = neg.filter(w => t.includes(w)).length;
  if (posCount > negCount) return { sentiment: "Positive 😊", score: Math.min(90, 60 + posCount * 10), emoji: "🟢" };
  if (negCount > posCount) return { sentiment: "Negative 😢", score: Math.max(10, 40 - negCount * 10), emoji: "🔴" };
  return { sentiment: "Neutral 😐", score: 50, emoji: "🟡" };
}

async function aiSentiment(text) {
  try {
    const res = await axios.post(
      "https://text.pollinations.ai/",
      {
        messages: [
          {
            role: "system",
            content: `Analyze the sentiment of the given text. Reply in JSON format only:
{"sentiment": "Positive/Negative/Neutral/Mixed", "score": 0-100, "emotions": ["list", "of", "emotions"], "summary": "1 sentence in Bengali explaining the sentiment"}`
          },
          { role: "user", content: text }
        ],
        model: "openai-large", private: true, seed: Math.floor(Math.random() * 9999)
      },
      { timeout: 20000, headers: { "Content-Type": "application/json" } }
    );
    const raw = typeof res.data === "string" ? res.data : res.data?.text || "";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch {}
  return null;
}

const BARS = "█";
function makeBar(score) {
  const filled = Math.round(score / 10);
  return BARS.repeat(filled) + "░".repeat(10 - filled) + ` ${score}%`;
}

module.exports = {
  config: {
    name: "sentiment",
    aliases: ["mood", "analyze", "senti", "emotion"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Analyze sentiment/emotion of any text" },
    longDescription: { en: "AI-powered sentiment analysis. Detects emotion, mood, positivity score of any text in Bengali or English." },
    category: "ai",
    guide: {
      en: "{p}sentiment <text>\n{p}sentiment (reply to a message)\n\nExamples:\n{p}sentiment I love this bot so much!\n{p}sentiment আজকে মন ভালো নেই"
    }
  },

  onStart: async function ({ message, args, event, api }) {
    let text = args.join(" ").trim();

    // If replying to a message
    if (!text && event.type === "message_reply") {
      text = event.messageReply?.body?.trim() || "";
    }

    if (!text) {
      return message.reply(
        `╔══════════════════════╗\n` +
        `║  🧠 Sentiment Analyzer║\n` +
        `╚══════════════════════╝\n\n` +
        `📌 ব্যবহার:\n` +
        `  .sentiment <text>\n` +
        `  অথবা যেকোনো message এ reply করো\n\n` +
        `📌 Examples:\n` +
        `  .sentiment I love this!\n` +
        `  .sentiment আজকে মন ভালো নেই`
      );
    }

    api.setMessageReaction("🧠", event.messageID, () => {}, true);

    const quick = quickSentiment(text);
    const aiResult = await aiSentiment(text);

    const sentiment = aiResult?.sentiment || quick.sentiment;
    const score = aiResult?.score ?? quick.score;
    const emotions = aiResult?.emotions?.slice(0, 4).join(", ") || "Unknown";
    const summary = aiResult?.summary || "";
    const emoji = sentiment.toLowerCase().includes("positive") ? "🟢"
      : sentiment.toLowerCase().includes("negative") ? "🔴"
      : sentiment.toLowerCase().includes("mixed") ? "🟠" : "🟡";

    api.setMessageReaction("✅", event.messageID, () => {}, true);
    message.reply(
      `╔══════════════════════╗\n` +
      `║  🧠 Sentiment Result  ║\n` +
      `╚══════════════════════╝\n\n` +
      `  ✦ Sentiment › ${emoji} ${sentiment}\n` +
      `  ✦ Score     › ${makeBar(score)}\n` +
      `  ✦ Emotions  › ${emotions}\n\n` +
      `  📝 Text: "${text.substring(0, 80)}${text.length > 80 ? "..." : ""}"\n\n` +
      (summary ? `  💬 ${summary}\n\n` : "") +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `— Rakib Islam | Ghost Bot`
    );
  }
};
