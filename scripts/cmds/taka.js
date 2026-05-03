module.exports.config = {
  name: "taka",
  aliases: ["bdtaka", "টাকা", "numtoword"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Number to Bangla Taka words 💵" },
  longDescription: { en: "Convert any number to Bangla taka in words!" },
  category: "utility-bd",
  guide: { en: "{pn} [number] — e.g: .taka 5500" }
};

const ones = ["", "এক", "দুই", "তিন", "চার", "পাঁচ", "ছয়", "সাত", "আট", "নয়",
  "দশ", "এগারো", "বারো", "তেরো", "চৌদ্দ", "পনের", "ষোল", "সতের", "আঠারো", "উনিশ",
  "বিশ", "একুশ", "বাইশ", "তেইশ", "চব্বিশ", "পঁচিশ", "ছাব্বিশ", "সাতাশ", "আঠাশ", "উনত্রিশ",
  "ত্রিশ", "একত্রিশ", "বত্রিশ", "তেত্রিশ", "চৌত্রিশ", "পঁয়ত্রিশ", "ছত্রিশ", "সাতত্রিশ", "আটত্রিশ", "উনচল্লিশ",
  "চল্লিশ", "একচল্লিশ", "বিয়াল্লিশ", "তেতাল্লিশ", "চৌচল্লিশ", "পঁয়তাল্লিশ", "ছেচল্লিশ", "সাতচল্লিশ", "আটচল্লিশ", "উনপঞ্চাশ",
  "পঞ্চাশ", "একান্ন", "বায়ান্ন", "তেপান্ন", "চুয়ান্ন", "পঞ্চান্ন", "ছাপান্ন", "সাতান্ন", "আটান্ন", "উনষাট",
  "ষাট", "একষট্টি", "বাষট্টি", "তেষট্টি", "চৌষট্টি", "পঁয়ষট্টি", "ছেষট্টি", "সাতষট্টি", "আটষট্টি", "উনসত্তর",
  "সত্তর", "একাত্তর", "বাহাত্তর", "তেহাত্তর", "চুয়াত্তর", "পঁচাত্তর", "ছিয়াত্তর", "সাতাত্তর", "আটাত্তর", "উনআশি",
  "আশি", "একাশি", "বিরাশি", "তিরাশি", "চুরাশি", "পঁচাশি", "ছিয়াশি", "সাতাশি", "আটাশি", "উননব্বই",
  "নব্বই", "একানব্বই", "বিরানব্বই", "তিরানব্বই", "চুরানব্বই", "পঁচানব্বই", "ছিয়ানব্বই", "সাতানব্বই", "আটানব্বই", "নিরানব্বই"
];

function numToWords(n) {
  if (n === 0) return "শূন্য";
  if (n < 0) return "ঋণাত্মক " + numToWords(-n);
  let result = "";
  if (n >= 10000000) { result += ones[Math.floor(n / 10000000)] + " কোটি "; n %= 10000000; }
  if (n >= 100000) { result += ones[Math.floor(n / 100000)] + " লক্ষ "; n %= 100000; }
  if (n >= 1000) { result += ones[Math.floor(n / 1000)] + " হাজার "; n %= 1000; }
  if (n >= 100) { result += ones[Math.floor(n / 100)] + " শত "; n %= 100; }
  if (n > 0) result += ones[n];
  return result.trim();
}

module.exports.onStart = async ({ message, args }) => {
  if (!args[0]) return message.reply("💵 ব্যবহার: .taka [সংখ্যা]\n📌 উদাহরণ: .taka 5500");
  const num = parseInt(args[0].replace(/,/g, ""));
  if (isNaN(num)) return message.reply("❌ সঠিক সংখ্যা দাও।");
  if (num > 999999999) return message.reply("❌ সর্বোচ্চ ৯৯ কোটি পর্যন্ত সাপোর্ট করে।");
  const words = numToWords(Math.abs(num));
  return message.reply(`💵 𝗧𝗮𝗸𝗮 𝗜𝗻 𝗪𝗼𝗿𝗱𝘀\n━━━━━━━━━━━━\n🔢 সংখ্যা: ${num.toLocaleString()}\n📝 বাংলায়: ${words} টাকা\n━━━━━━━━━━━━\n✅ Powered by Ghost Net`);
};
