module.exports.config = {
  name: "wordcount",
  aliases: ["wc", "charcount", "শব্দগণনা"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Count words and characters ✍️" },
  longDescription: { en: "Count words, characters, and lines in any text." },
  category: "utility-bd",
  guide: { en: "{pn} [text] OR reply to a message" }
};

module.exports.onStart = async ({ api, event, args, message }) => {
  let text = args.join(" ");
  if (!text && event.type === "message_reply") {
    text = event.messageReply?.body || "";
  }
  if (!text) return message.reply("✍️ ব্যবহার: .wordcount [টেক্সট]\nঅথবা কোনো message-এ reply দিয়ে .wordcount লিখো।");

  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, "").length;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const lines = text.split("\n").length;
  const sentences = text.split(/[.!?।]+/).filter(s => s.trim()).length;

  return message.reply(`✍️ 𝗪𝗼𝗿𝗱 𝗖𝗼𝘂𝗻𝘁\n━━━━━━━━━━━━\n📝 শব্দ: ${words}\n🔡 অক্ষর (space সহ): ${chars}\n🔤 অক্ষর (space ছাড়া): ${charsNoSpace}\n📄 লাইন: ${lines}\n💬 বাক্য: ${sentences}\n━━━━━━━━━━━━\n✅ Ghost Net Edition`);
};
