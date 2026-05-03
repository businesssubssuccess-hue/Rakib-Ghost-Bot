module.exports.config = {
  name: "rpsbd",
  aliases: ["rps2", "পাথরকাঁচিকাগজ", "rps3"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Rock Paper Scissors in Bangla ✊" },
  longDescription: { en: "Play Rock Paper Scissors with the bot in Bangla!" },
  category: "game-bd",
  guide: { en: "{pn} [পাথর/কাঁচি/কাগজ]" }
};

const choices = { "পাথর": "✊", "কাঁচি": "✌️", "কাগজ": "🖐️", "rock": "✊", "scissors": "✌️", "paper": "🖐️", "r": "✊", "s": "✌️", "p": "🖐️" };
const normalize = { "পাথর": "পাথর", "কাঁচি": "কাঁচি", "কাগজ": "কাগজ", "rock": "পাথর", "r": "পাথর", "scissors": "কাঁচি", "s": "কাঁচি", "paper": "কাগজ", "p": "কাগজ" };
const botOptions = ["পাথর", "কাঁচি", "কাগজ"];
const wins = { "পাথর": "কাঁচি", "কাঁচি": "কাগজ", "কাগজ": "পাথর" };

module.exports.onStart = async ({ message, args }) => {
  const input = args.join("").toLowerCase();
  const player = normalize[input];
  if (!player) return message.reply("✊ ব্যবহার: .rpsbd [পাথর/কাঁচি/কাগজ]\nঅথবা: .rpsbd rock/scissors/paper");

  const bot = botOptions[Math.floor(Math.random() * 3)];
  const pe = choices[player], be = choices[bot];

  let result;
  if (player === bot) result = "🤝 ড্র! দুজনেই একই বেছেছো।";
  else if (wins[player] === bot) result = "🎉 তুমি জিতেছ! 🏆";
  else result = "😅 Bot জিতেছে! আবার চেষ্টা করো।";

  return message.reply(`✊ 𝗥𝗼𝗰𝗸 𝗣𝗮𝗽𝗲𝗿 𝗦𝗰𝗶𝘀𝘀𝗼𝗿𝘀\n━━━━━━━━━━━━\n👤 তুমি: ${pe} ${player}\n🤖 Bot: ${be} ${bot}\n━━━━━━━━━━━━\n${result}\n🔄 আবার: .rpsbd [choice]`);
};
