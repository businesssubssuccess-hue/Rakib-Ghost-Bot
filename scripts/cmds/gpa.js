module.exports.config = {
  name: "gpa",
  aliases: ["gpacalc", "জিপিএ", "grade"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "GPA calculator (BD SSC/HSC) 📚" },
  longDescription: { en: "Calculate GPA based on Bangladesh education system." },
  category: "utility-bd",
  guide: { en: "{pn} [marks1] [marks2] ... — e.g: .gpa 85 76 90 65 80" }
};

function getGrade(mark) {
  if (mark >= 80) return { letter: "A+", point: 5.0 };
  if (mark >= 70) return { letter: "A", point: 4.0 };
  if (mark >= 60) return { letter: "A-", point: 3.5 };
  if (mark >= 50) return { letter: "B", point: 3.0 };
  if (mark >= 40) return { letter: "C", point: 2.0 };
  if (mark >= 33) return { letter: "D", point: 1.0 };
  return { letter: "F", point: 0.0 };
}

module.exports.onStart = async ({ message, args }) => {
  if (!args[0]) return message.reply("📚 ব্যবহার: .gpa [নম্বর১] [নম্বর২] ...\n📌 উদাহরণ: .gpa 85 76 90 65 80\n💡 বাংলাদেশ SSC/HSC পদ্ধতিতে হিসাব হবে।");
  const marks = args.map(Number);
  if (marks.some(m => isNaN(m) || m < 0 || m > 100)) return message.reply("❌ ০-১০০ এর মধ্যে সঠিক নম্বর দাও।");

  let lines = "";
  let totalPoints = 0;
  marks.forEach((m, i) => {
    const { letter, point } = getGrade(m);
    lines += `📘 বিষয় ${i + 1}: ${m} → ${letter} (${point})\n`;
    totalPoints += point;
  });

  const gpa = (totalPoints / marks.length).toFixed(2);
  const overallGrade = getGrade(marks.reduce((a, b) => a + b, 0) / marks.length);

  return message.reply(`📚 𝗚𝗣𝗔 𝗥𝗲𝘀𝘂𝗹𝘁\n━━━━━━━━━━━━\n${lines}━━━━━━━━━━━━\n🏆 GPA: ${gpa}\n📊 গ্রেড: ${overallGrade.letter}\n━━━━━━━━━━━━\n${parseFloat(gpa) >= 5.0 ? "🌟 অসাধারণ! A+ পেয়েছ!" : parseFloat(gpa) >= 4.0 ? "✅ খুব ভালো!" : "💪 আরও ভালো করার চেষ্টা করো!"}`);
};
