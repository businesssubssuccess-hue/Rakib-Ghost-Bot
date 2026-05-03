const map = {a:"ᵃ",b:"ᵇ",c:"ᶜ",d:"ᵈ",e:"ᵉ",f:"ᶠ",g:"ᵍ",h:"ʰ",i:"ⁱ",j:"ʲ",k:"ᵏ",l:"ˡ",m:"ᵐ",n:"ⁿ",o:"ᵒ",p:"ᵖ",q:"q",r:"ʳ",s:"ˢ",t:"ᵗ",u:"ᵘ",v:"ᵛ",w:"ʷ",x:"ˣ",y:"ʸ",z:"ᶻ","0":"⁰","1":"¹","2":"²","3":"³","4":"⁴","5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹","+":"⁺","-":"⁻","=":"⁼","(":"⁽",")":"⁾"};

module.exports.config = {
  name: "superscript",
  aliases: ["sup", "sscript", "উপলিপি"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Superscript text converter ˢᵘᵖ" },
  longDescription: { en: "Convert text to superscript format!" },
  category: "text-tools",
  guide: { en: "{pn} [text]" }
};

module.exports.onStart = async ({ message, args }) => {
  const text = args.join(" ").toLowerCase();
  if (!text) return message.reply("📝 ব্যবহার: .superscript [text]");
  const converted = text.split("").map(c => map[c] || c).join("");
  return message.reply(`ˢᵘᵖ 𝗦𝘂𝗽𝗲𝗿𝘀𝗰𝗿𝗶𝗽𝘁\n━━━━━━━━━━━━\n${converted}\n━━━━━━━━━━━━\n✨ Use in bio!`);
};
