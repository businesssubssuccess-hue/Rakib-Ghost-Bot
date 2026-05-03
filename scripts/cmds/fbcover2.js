const axios = require("axios");
const { createCanvas, loadImage, registerFont } = require("canvas");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "fbcover2",
    aliases: ["fb2", "neoncover2"],
    version: "2.0.0",
    author: "RAKIB ISLAM",
    countDown: 15,
    role: 0,
    category: "design",
    shortDescription: { en: "Premium Neon FB Cover Generator" },
    guide: { en: "{pn} - [template] - [name] - [subtext] - [social]" }
  },

  onStart: async function ({ api, event, args, message }) {
    const { senderID } = event;
    const input = args.join(" ").split("-");
    
    if (input.length < 3) {
      return message.reply("⚠️ Usage: .fbcover2 - [1-15] - [Name] - [Skill] - [Username]\nExample: .fbcover2 - 1 - RAKIB ISLAM - DEVELOPER - @acs.rakib");
    }

    const templateNum = parseInt(input[1]?.trim());
    const name = input[2]?.trim().toUpperCase();
    const subtext = input[3]?.trim() || "GHOST-NET USER";
    const social = input[4]?.trim() || "@ghost.net.ai";

    if (isNaN(templateNum) || templateNum < 1 || templateNum > 15) {
      return message.reply("❌ ১ থেকে ১৫ এর মধ্যে একটি টেমপ্লেট নম্বর দিন।");
    }

    message.reply(`🎨 | Ghost-Net AI আপনার জন্য ${templateNum} নং VIP Neon কভারটি বানাচ্ছে...`);

    try {
      // ক্যানভাস সাইজ (FB Cover Standard: 820x312)
      const canvas = createCanvas(820, 312);
      const ctx = canvas.getContext("2d");

      // ১. ব্যাকগ্রাউন্ড জেনারেশন (Template logic)
      // এখানে আমি ডাইনামিক নিওন কালার দিচ্ছি, আপনি চাইলে আপনার সোর্স থেকে ইমেজ লোড করতে পারেন
      const gradients = [
        ["#000000", "#1a1a1a"], // Template 1: Deep Dark
        ["#0f0c29", "#302b63", "#24243e"], // Template 2: Space Blue
        ["#232526", "#414345"], // Template 3: Carbon Gray
        ["#1d2671", "#c33764"], // Template 4: Neon Purple
        ["#000000", "#434343"]  // Template 5: Noir
      ];
      
      const grad = ctx.createLinearGradient(0, 0, 820, 312);
      const colorSet = gradients[(templateNum - 1) % gradients.length];
      colorSet.forEach((c, i) => grad.addColorStop(i / (colorSet.length - 1), c));
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 820, 312);

      // ২. প্রোফাইল পিকচার লোড
      const avatarUrl = `https://graph.facebook.com/${senderID}/picture?width=500&height=500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      const avatar = await loadImage(avatarUrl);
      
      // প্রোফাইল পিকচার ডিজাইন (Circle with Neon Border)
      ctx.save();
      ctx.shadowBlur = 20;
      ctx.shadowColor = "#00f2ff"; // Neon Cyan Border
      ctx.beginPath();
      ctx.arc(150, 156, 100, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.lineWidth = 8;
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();
      ctx.clip();
      ctx.drawImage(avatar, 50, 56, 200, 200);
      ctx.restore();

      // ৩. টেক্সট ডিজাইন
      ctx.shadowBlur = 10;
      ctx.shadowColor = "rgba(0,0,0,0.8)";
      
      // নাম (Neon Style)
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 50px Arial";
      ctx.fillText(name, 280, 140);

      // সাবটেক্সট
      ctx.fillStyle = "#00f2ff";
      ctx.font = "25px Courier New";
      ctx.fillText(subtext, 280, 180);

      // সোশ্যাল হ্যান্ডেল
      ctx.fillStyle = "#aaaaaa";
      ctx.font = "italic 20px Arial";
      ctx.fillText(`🔗 ${social}`, 280, 220);

      // ৪. ব্র্যান্ডিং (Ghost-Net Logo style)
      ctx.fillStyle = "rgba(255,255,255,0.2)";
      ctx.font = "bold 15px Arial";
      ctx.fillText("GHOST-NET AI • DESIGNED BY RAKIB ISLAM", 500, 290);

      // ইমেজ সেভ ও সেন্ড
      const imgPath = path.join(__dirname, `cover_${senderID}.png`);
      const buffer = canvas.toBuffer("image/png");
      await fs.outputFile(imgPath, buffer);

      return message.reply({
        body: `╭──────❍ 𝗚𝗛𝗢𝗦𝗧-𝗡𝗘𝗧 ❍──────╮\n│ ✅ 𝗩𝗜𝗣 𝗗𝗲𝘀𝗶𝗴𝗻 𝗖𝗼𝗺𝗽𝗹𝗲𝘁𝗲!\n│ 🖼️ 𝗧𝗲𝗺𝗽𝗹𝗮𝘁𝗲: #${templateNum}\n│ 👤 𝗢𝘄𝗻𝗲𝗿: ${name}\n╰─────────── 💠 ───────────╯`,
        attachment: fs.createReadStream(imgPath)
      }, () => fs.unlinkSync(imgPath));

    } catch (e) {
      console.error(e);
      return message.reply("❌ ডিজাইন করার সময় একটি এরর হয়েছে। আপনার সেশন চেক করুন।");
    }
  }
};
