const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

// Admin Only Mode Toggle (true = শুধুমাত্র এডমিনরা পারবে, false = সবাই পারবে)
let isAdminOnly = false; 

module.exports = {
  config: {
    name: "fuck",
    aliases: ["fck"],
    version: "4.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 0, // বটের মেইন কনফিগ (0 = সবাই, তবে নিচে কাস্টম লজিক আছে)
    description: "Overlay two users’ avatars on an NSFW image template (Supports Reply & Mention)",
    category: "fun",
  },

  onStart: async function ({ message, event, api }) {
    const { threadID, messageID, senderID, mentions, type, messageReply } = event;

    // 🛡️ Admin Only Logic Check
    if (isAdminOnly) {
      // চেকিং: ইউজার বটের এডমিন কিনা অথবা গ্রুপের এডমিন কিনা
      const threadInfo = await api.getThreadInfo(threadID);
      const isGroupAdmin = threadInfo.adminIDs.some(admin => admin.id === senderID);
      
      // GoatBot এর গ্লোবাল এডমিন লিস্ট চেক (যদি কনফিগে থাকে)
      const isBotAdmin = global.GoatBot.config.adminBot.includes(senderID); 

      if (!isGroupAdmin && !isBotAdmin) {
        return message.reply("🔒 এই কমান্ডটি বর্তমানে 'Admin Only' মোডে আছে। শুধুমাত্র এডমিনরা এটি ব্যবহার করতে পারবেন!");
      }
    }

    try {
      let one = senderID;
      let two;

      // 🔄 Reply এবং Mention হ্যান্ডলিং লজিক
      if (type === "message_reply") {
        // যদি কারো মেসেজে রিপ্লাই দিয়ে কমান্ড লেখা হয়
        two = messageReply.senderID;
      } else if (Object.keys(mentions).length > 0) {
        // যদি কাউকে মেনশন করে কমান্ড লেখা হয়
        two = Object.keys(mentions)[0];
      } else {
        // যদি কোনোটিই না করা হয়
        return message.reply("⚠️ দয়া করে একজনকে Mention করুন অথবা তার মেসেজে Reply দিয়ে কমান্ডটি ব্যবহার করুন!");
      }

      // সেলফ-টার্গেট প্রোটেকশন (নিজের সাথে নিজে করা যাবে না)
      if (one === two) {
        return message.reply("❌ আপনি নিজেকে টার্গেট করতে পারবেন না!");
      }

      const dir = path.join(__dirname, "cache");
      if (!fs.existsSync(dir)) fs.mkdirSync(dir);

      const bgPath = path.join(dir, "fuck_template.png");

      // Background ইমেজ ডাউনলোড (যদি ক্যাশে না থাকে)
      if (!fs.existsSync(bgPath)) {
        const img = await axios.get(
          "https://i.ibb.co/VJHCjCb/images-2022-08-14-T183802-542.jpg",
          { responseType: "arraybuffer" }
        );
        fs.writeFileSync(bgPath, Buffer.from(img.data));
      }

      const avatar1 = path.join(dir, `${one}.png`);
      const avatar2 = path.join(dir, `${two}.png`);

      // ফেসবুক গ্রাফ এপিআই দিয়ে অ্যাভাটার ডাউনলোড
      const getAvatar = async (id, savePath) => {
        const avatar = await axios.get(
          `https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
          { responseType: "arraybuffer" }
        );
        fs.writeFileSync(savePath, Buffer.from(avatar.data));
      };

      // লোডিং মেসেজ (ইউজার এক্সপেরিয়েন্স সুন্দর করার জন্য)
      const waitMsg = await message.reply("⏳ ইমেজ প্রসেসিং হচ্ছে, কিছুটা সময় দিন...");

      await getAvatar(one, avatar1);
      await getAvatar(two, avatar2);

      // ক্যানভাস দিয়ে ইমেজ ড্রয়িং সেকশন
      const bg = await loadImage(bgPath);
      const av1 = await loadImage(avatar1);
      const av2 = await loadImage(avatar2);

      const canvas = createCanvas(bg.width, bg.height);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(bg, 0, 0, bg.width, bg.height);

      // ১ম অ্যাভাটার (Sender)
      ctx.save();
      ctx.beginPath();
      ctx.arc(120, 450, 80, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(av1, 40, 370, 160, 160);
      ctx.restore();

      // ২য় অ্যাভাটার (Targeted User)
      ctx.save();
      ctx.beginPath();
      ctx.arc(520, 200, 80, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(av2, 440, 120, 160, 160);
      ctx.restore();

      const outPath = path.join(dir, `fuck_result_${one}_${two}.png`);
      const buffer = canvas.toBuffer("image/png");
      fs.writeFileSync(outPath, buffer);

      // লোডিং মেসেজটি ডিলিট করে ফাইনাল আউটপুট পাঠানো
      if (global.GoatBot && global.GoatBot.onReply) {
        await api.unsendMessage(waitMsg.messageID);
      }

      await message.reply({
        body: "💥 GHOST-NET V2 Edition!",
        attachment: fs.createReadStream(outPath),
      });

      // ক্যাশ ক্লিনআপ (স্টোরেজ বাঁচানোর জন্য)
      fs.unlinkSync(avatar1);
      fs.unlinkSync(avatar2);
      fs.unlinkSync(outPath);

    } catch (err) {
      console.error(err);
      return message.reply(`❌ ইমেজ জেনারেট করার সময় ত্রুটি ঘটেছে: ${err.message}`);
    }
  },
};
    
