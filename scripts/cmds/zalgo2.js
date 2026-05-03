const above = ["̍","̎","̄","̅","̿","̑","̆","̐","͒","͗","͑","̇","̈","̊","͂","̓","̈","͊","͋","͌","̃","̂","̌","͐","̀","́","̋","̏","̒","̓","̔","̽","̉","ͣ","ͤ","ͥ","ͦ","ͧ","ͨ","ͩ","ͪ","ͫ","ͬ","ͭ","͜͟"];
const below = ["̖","̗","̘","̙","̜","̝","̞","̟","̠","̤","̥","̦","̩","̪","̫","̬","̭","̮","̯","̰","̱","̲","̳","̹","̺","̻","̼","ͅ","͇","͈","͉","͍","͎","͓","͔","͕","͖","͙","͚","̣"];

module.exports.config = {
  name: "zalgo2",
  aliases: ["zalgo", "creepy", "ভূতটেক্সট"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Zalgo/creepy text effect 👻" },
  longDescription: { en: "Add a creepy zalgo effect to your text!" },
  category: "text-tools",
  guide: { en: "{pn} [text]" }
};

module.exports.onStart = async ({ message, args }) => {
  const text = args.join(" ");
  if (!text) return message.reply("👻 ব্যবহার: .zalgo2 [text]");
  const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const result = text.split("").map(c => {
    if (c === " ") return c;
    let out = c;
    for (let i = 0; i < 3; i++) out += rand(above);
    for (let i = 0; i < 2; i++) out += rand(below);
    return out;
  }).join("");
  return message.reply(`👻 𝗭𝗮𝗹𝗴𝗼\n━━━━━━━━━━━━\n${result}\n━━━━━━━━━━━━\n😈 Scary! | আরেকটা: .zalgo2`);
};
