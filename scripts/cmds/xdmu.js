// XDMU — Toxic Roast + Loop Notification Bomb — Rakib Islam / Ghost Net Edition
module.exports = {
  config: {
    name: "xdmu",
    aliases: ["bkcd"],
    version: "17.0",
    author: "Rakib Islam",
    countDown: 1,
    role: 2,
    category: "toxic",
    shortDescription: { en: "Toxic roast loop + notification bomb 🔥" },
    guide: {
      en: "{pn} @mention         — 100 গালির loop (3s পর unsend)\n" +
          "{pn} loop @mention    — notification bomb 💣 (তাৎক্ষণিক unsend, 50 বার)\n" +
          "{pn} stop             — বন্ধ করো 🛑"
    }
  },

  onStart: async function ({ api, event, args, message, usersData }) {
    const { threadID, mentions } = event;
    if (!global.ghost_xdi) global.ghost_xdi = new Map();
    if (!global.ghost_xloop) global.ghost_xloop = new Map();

    const mode = (args[0] || "").toLowerCase();

    // ── STOP ──
    if (mode === "stop") {
      global.ghost_xdi.set(threadID, false);
      global.ghost_xloop.set(threadID, false);
      return message.reply("🛑 সব বন্ধ! 🤡");
    }

    // ─────────────────────────────────
    // ── LOOP MODE — notification bomb ──
    // ─────────────────────────────────
    if (mode === "loop") {
      // get target (mention or reply)
      let targetUID = null;
      let targetName = "তুই";

      const mentionKeys = Object.keys(mentions || {});
      if (mentionKeys.length > 0) {
        targetUID = mentionKeys[0];
        targetName = (mentions[targetUID] || "").replace("@", "").trim();
        if (!targetName) {
          try { const u = await usersData.get(targetUID); targetName = u?.name?.split(" ")[0] || "তুই"; } catch {}
        }
      } else if (event.messageReply) {
        targetUID = event.messageReply.senderID;
        try { const u = await usersData.get(targetUID); targetName = u?.name?.split(" ")[0] || "তুই"; } catch {}
      } else {
        return message.reply(
          "💣 NOTIFICATION BOMB:\n\n" +
          "  .xdmu loop @mention\n" +
          "  অথবা কারো message এ reply দিয়ে .xdmu loop\n\n" +
          "⚠️ message পাঠাবো, সাথে সাথেই unsend করবো — notification flood হবে!"
        );
      }

      // Bomb messages pool
      const BOMBS = [
        `😈 ${targetName}!`, `🔥 ${targetName} হুশিয়ার!`, `👀 ${targetName}...`,
        `💀 ${targetName} জেগে আছো?`, `🤡 ${targetName} উপরে দেখো!`, `👻 ${targetName} BOO!`,
        `😏 ${targetName} hi!`, `🎯 ${targetName} target!`, `⚡ ${targetName} ZAP!`,
        `🌚 ${targetName} ধরা!`, `💥 ${targetName} BOOM!`, `🔔 ${targetName} ping!`,
        `🫵 ${targetName} তুমি!`, `😂 ${targetName} হাহাহা!`, `🤫 ${targetName} শশশ..`,
        `😤 ${targetName} ey!`, `🙃 ${targetName} hehe`, `🥶 ${targetName} freeze!`,
        `🫠 ${targetName} ..`, `⚠️ ${targetName} WARNING!`,
      ];

      const TOTAL = 50;
      await message.reply(`💣 NOTIFICATION BOMB শুরু! 🎯 Target: ${targetName}\n(${TOTAL} বার send + instant unsend)\n.xdmu stop — বন্ধ করো`);
      global.ghost_xloop.set(threadID, true);

      let count = 0;
      const doLoop = async () => {
        if (!global.ghost_xloop.get(threadID) || count >= TOTAL) {
          if (count >= TOTAL) {
            api.sendMessage(`✅ ${TOTAL}টা notification bomb দেওয়া হয়েছে! 💣🤡`, threadID);
          }
          return;
        }

        const msg = BOMBS[count % BOMBS.length];
        api.sendMessage(msg, threadID, (err, info) => {
          if (!err && info?.messageID) {
            // Instant unsend — 100-400ms পর
            const delay = 100 + Math.floor(Math.random() * 300);
            setTimeout(() => {
              try { api.unsendMessage(info.messageID); } catch {}
            }, delay);
          }
        });

        count++;
        // 600-900ms gap between each bomb
        const wait = 600 + Math.floor(Math.random() * 300);
        setTimeout(doLoop, wait);
      };

      setTimeout(doLoop, 300);
      return;
    }

    // ─────────────────────────────────
    // ── NORMAL MODE — 100 gali loop ──
    // ─────────────────────────────────
    let target = "";

    if (event.messageReply) {
      try {
        const u = await usersData.get(event.messageReply.senderID);
        target = u?.name?.split(" ")[0] || "তুই";
      } catch { target = "তুই"; }
    } else if (Object.keys(mentions).length > 0) {
      const uid = Object.keys(mentions)[0];
      target = (mentions[uid] || "").replace("@", "").trim();
      if (!target) {
        try { const u = await usersData.get(uid); target = u?.name?.split(" ")[0] || "তুই"; } catch { target = "তুই"; }
      }
    } else {
      return message.reply(
        "🤬 কার গোষ্ঠী উদ্ধার করবো?\n\n" +
        "  ✦ .xdmu @mention — 100 গালির loop\n" +
        "  ✦ .xdmu loop @mention — notification bomb 💣\n" +
        "  ✦ Reply দিয়েও হবে\n" +
        "  ✦ .xdmu stop — বন্ধ করো 🛑"
      );
    }

    const heavyGalis = [
      `১. ${target} তোর মারে নিয়া কি আমি মিউজিয়ামে যামু? খানকির পোলা! 🤬🤡🤣`,
      `২. ${target} তোর জন্ম কি বাথরুমের কমোডে হইসিলো নাকি রে কুত্তার নাতি? 🤡🤣🤬`,
      `৩. ${target} তোর বাপে কি ভাড়ায় চলতো? তোর চেহারা দেখে তো তাই মনে হয়! 🤣🤬🤡`,
      `৪. ${target} তোর চৌদ্দ গুষ্ঠি কি ডাস্টবিনের খাবার খেয়ে বড় হইছে? আবর্জনা! 🤬🤡🤣`,
      `৫. ${target} তোর আম্মুর ফোনের গ্যালারি চেক করলে tor 10 ta bap ber hobe! 🤡🤣🤬`,
      `৬. ${target} তোর বোনরে জিগাস কাল রাতে কার সাথে পার্কে গেসিল? 🤣🤬🤡`,
      `৭. ${target} তোর মুখ তো না যেন নর্দমার ড্রেন, সবসময় হাগু বের হয়! 🤬🤡🤣`,
      `৮. ${target} তোর বংশের সবাই কি পাইকারি দরে গালি খাওয়ার লাইসেন্স নিসে? 🤡🤣🤬`,
      `৯. ${target} তোরে জন্ম দেওয়া আর ড্রেনে পানি ঢালা একই কথা ছিল! 🤣🤬🤡`,
      `১০. ${target} তোর চেহারা দেখলে তো কুত্তাও লজ্জা পায়! 🤬🤡🤣`,
      `১১. ${target} তোর ব্রেইন কি কিস্তিতে কিনসিলো? কিস্তি না দেওয়ায় খুলে নিসে! 🤡🤣🤬`,
      `১২. ${target} তুই তো সেই আবর্জনা যারে ডাস্টবিনও রিজেক্ট করে দিসে! 🤣🤬🤡`,
      `১৩. ${target} তোর মারে জিগাস কাল রাতে পার্কে কার সাথে ডিনার করসে? 🤬🤡🤣`,
      `১৪. ${target} তোর মতো বলদরে চিড়িয়াখানায় রাখলেও বান্দররা হাসাহাসি করবে! 🤡🤣🤬`,
      `১৫. ${target} তোর ফিউচার ব্ল্যাক হোলের চেয়েও অন্ধকার! 🤣🤬🤡`,
      `১৬. ${target} তোর বাপের নাম গুগলে সার্চ দিলে 'Not Found' দেখায়? 🤬🤡🤣`,
      `১৭. ${target} তোর গুষ্ঠি কি বাতি নিভাইয়া ভাত খায়? চেহারার যে শ্রী! 🤡🤣🤬`,
      `১৮. ${target} তোরে দেখলে মনে হয় তুই প্লাস্টিক রিসাইকেল করা কুত্তা! 🤣🤬🤡`,
      `১৯. ${target} তোর রক্তে কি ফরমালিন মেশানো? মানুষ হইলি না তো! 🤡🤣🤬`,
      `২০. ${target} তোর মাথা তো না যেন ভাঙা রেডিও, শুধু আবজাব বাজে! 🤣🤬🤡`,
      `২১. ${target} তোর জন্ম কি ভুলের ফসল নাকি ইচ্ছাকৃত দূর্ঘটনা? 🤬🤡🤣`,
      `২২. ${target} তোরে কুত্তার বিস্কুট দিলেও কুত্তা তোরে কামড়াবে! 🤣🤬🤡`,
      `২৩. ${target} তোর ফ্যামিলি ট্রি তো পুরাই একটা ডাস্টবিন! 🤬🤡🤣`,
      `২৪. ${target} তোর মতো গাধারে হিমালয় পাহাড়ে রেখে আসা উচিত! 🤣🤬🤡`,
      `২৫. ${target} তোর সাহস কত যে আমার বটের সামনে মুখ খুলিস? 🤡🤣🤬`,
      `২৬. ${target} তুই তো লেভেলের ভিখারি যে গালিও ভিক্ষা করে খাস! 🤣🤬🤡`,
      `২৭. ${target} তোর চেহারা দেখলে মনে হয় ট্রাকের নিচে পড়েছিলি! 🤬🤡🤣`,
      `২৮. ${target} তোর কথা শুনলে কানের পর্দা না, ইজ্জত ফেটে যায়! 🤣🤬🤡`,
      `২৯. ${target} তোর বাপে কি রেলওয়ে স্টেশনে কুলি ছিল? 🤬🤡🤣`,
      `৩০. ${target} তুই তো সেই পকেটমার যে নিজের পকেট নিজেই কাটিস! 🤣🤬🤡`,
      `৩১. ${target} তোর বংশ কি সার্কাসে কাজ করে? তুই তো বড় জোকার! 🤬🤡🤣`,
      `৩২. ${target} তোর মতো ছাগল কোরবানির হাটেও বিক্রি হবে না! 🤡🤣🤬`,
      `৩৩. ${target} তোর বাপে কি তোরে তেজপাতা মনে করে? কোনো দাম নাই! 🤣🤬🤡`,
      `৩৪. ${target} তোর মতো আবাল পৃথিবীতে আসা মানে অক্সিজেনের অপচয়! 🤡🤣🤬`,
      `৩৫. ${target} তোর জন্ম কি ফুটপাতের ড্রেনে হইছে? 🤣🤬🤡`,
      `৩৬. ${target} তোর আম্মু কি তোরে জন্ম দিয়ে পস্তায় না? 🤬🤡🤣`,
      `৩৭. ${target} তোর বাপে কি তোরে ত্যজ্য করে দিছে? 🤡🤣🤬`,
      `৩৮. ${target} তোর গুষ্ঠির সবাই কি পাগলখানায় থাকে? 🤣🤬🤡`,
      `৩৯. ${target} তোর বুদ্ধির যা অবস্থা, মশা কামড়ালে মশা মরবে! 🤡🤣🤬`,
      `৪০. ${target} তোর বাপে কি বাথরুমে বসে তোরে বানাইছে? 🤣🤬🤡`,
      `৪১. ${target} তোরে দেখলে তো আজরাইলও হাসাহাসি করবে! 🤡🤣🤬`,
      `৪২. ${target} তোর ফ্যামিলি কি তোরে নিয়ে গর্ব করে? আমার তো মনে হয় না! 🤣🤬🤡`,
      `৪৩. ${target} তোর চেহারা দেখে কি আয়নাও ভেঙে পড়ে? 🤬🤡🤣`,
      `৪৪. ${target} তোর গুষ্ঠি কি কোনোদিন মানুষের মতো ছিল? 🤡🤣🤬`,
      `৪৫. ${target} তোর ব্রেইন তো দেখি একদম খালি, হাওয়া বাতাস খেলে! 🤣🤬🤡`,
      `৪৬. ${target} তোর মতো ছাগলরে বাজারে দশ টাকাতেও নিবে না! 🤬🤡🤣`,
      `৪৭. ${target} তোর জন্ম কি বাসের সিটে হইছিল নাকি রে? 🤡🤣🤬`,
      `৪৮. ${target} তোর চেহারায় কি গোবর মাখানো? 🤣🤬🤡`,
      `৪৯. ${target} তুই তো সেই কুলাঙ্গার যে নিজের বাপের নাম জানে না! 🤡🤣🤬`,
      `৫০. ${target} তোর বংশের সবাই কি জেলখানায় বড় হইছে? 🤬🤡🤣`,
      `৫১. ${target} তোর বুদ্ধির গোড়ায় কি পচন ধরছে? 🤣🤬🤡`,
      `৫২. ${target} তোর জন্ম না হলে কি তোর মারে কষ্ট কম হতো? 🤬🤡🤣`,
      `৫৩. ${target} তোরে দেখলে তো শয়তানও তওবা করবে! 🤣🤬🤡`,
      `৫৪. ${target} তোর গুষ্ঠি কি সবাই একসাথে বোকা? 🤡🤣🤬`,
      `৫৫. ${target} তোর চেহারা কি কোনো ভুত দেখে পাল্টাই গেছে? 🤣🤬🤡`,
      `৫৬. ${target} তোর আম্মু কি তোরে মানুষ মনে করে? নাকি আবর্জনা? 🤬🤡🤣`,
      `৫৭. ${target} তোর মতো বলদ এই ১০০ গালি খেয়েও শিক্ষা পাবি না! 🤡🤣🤬`,
      `৫৮. ${target} তোর বাপে তোরে চিনতে অস্বীকার করসে? 🤣🤬🤡`,
      `৫৯. ${target} তোর আম্মুর ফ্রেন্ডলিস্টে কি সব আমার ছোট ভাইরা? 🤬🤡🤣`,
      `৬০. ${target} তোর মুখ নর্দমার চেয়েও পচা! 🤡🤣🤬`,
      `৬১. ${target} তোর মতো মানুষ রাস্তায় নাচলেও কেউ দেখবে না! 🤣🤬🤡`,
      `৬২. ${target} তোর বংশের ইতিহাস পুরাই কলঙ্কিত! 🤬🤡🤣`,
      `৬৩. ${target} তোর বাপে কি তোরে বেল্ট দিয়ে পিটায় না? 🤡🤣🤬`,
      `৬৪. ${target} তোর চেহারা দেখলে মনে হয় নর্দমায় গোসল করসোস! 🤣🤬🤡`,
      `৬৫. ${target} তুই তো আবাল যে আয়না দেখলে ভয় পাস! 🤬🤡🤣`,
      `৬৬. ${target} তোর বাপ কি সারাদিন গাজা খেয়ে পড়ে থাকে? 🤡🤣🤬`,
      `৬৭. ${target} তোরে দেখলে তো শয়তানও নেক হয়ে যাবে! 🤣🤬🤡`,
      `৬৮. ${target} তোর গুষ্ঠি কি পাইকারি দরে বোকা? 🤬🤡🤣`,
      `৬৯. ${target} তোর চেহারা দেখলে হাসি আটকানো দায়! 🤡🤣🤬`,
      `৭০. ${target} তোর বাপের কি কোনো লাজলজ্জা নাই? 🤣🤬🤡`,
      `৭১. ${target} তোর মতো মানুষ বাঁচানো অক্সিজেনের অপচয়! 🤬🤡🤣`,
      `৭২. ${target} তোর IQ কি ঋণাত্মক? 🤡🤣🤬`,
      `৭৩. ${target} তোর মারে কি বাজারে বিক্রি করা হয়? 🤣🤬🤡`,
      `৭৪. ${target} তোর গুষ্ঠি কি পাথর দিয়ে তৈরি? 🤬🤡🤣`,
      `৭৫. ${target} তোর বাপে কি তোরে রাস্তায় ফেলে দিতে চায়? 🤡🤣🤬`,
      `৭৬. ${target} তোর কপাল কি পুড়া? জন্মের পর থেকে দেখি! 🤣🤬🤡`,
      `৭৭. ${target} তুই তো সেই বলদ যে নিজেই নিজেকে গালি দেয়! 🤬🤡🤣`,
      `৭৮. ${target} তোর বাপের পরিচয় কি তুই নিজেই জানিস? 🤡🤣🤬`,
      `৭৯. ${target} তোর মারে জিগাস কেন সারাদিন ঘুরে বেড়ায়? 🤣🤬🤡`,
      `৮০. ${target} তোর বংশ কি ডোবায় জন্মেছে? 🤬🤡🤣`,
      `৮১. ${target} তোর মতো কুত্তা পৃথিবীতে আর নেই! 🤡🤣🤬`,
      `৮২. ${target} তোর বাপে কি ভিখারির মতো জীবন কাটায়? 🤣🤬🤡`,
      `৮৩. ${target} তোর চেহারা দেখে কি ক্যামেরাও বিরক্ত হয়? 🤬🤡🤣`,
      `৮৪. ${target} তোর গুষ্ঠি কি কোনোদিন সুখ দেখেছে? 🤡🤣🤬`,
      `৮৫. ${target} তোর ব্রেইন কি এখনো কিন্ডারগার্টেনে? 🤣🤬🤡`,
      `৮৬. ${target} তোর মারে জিগাস কেন রাতে বাড়ি ফেরে না? 🤬🤡🤣`,
      `৮৭. ${target} তুই তো সেই আবাল যে জল পেলে ডোবে! 🤡🤣🤬`,
      `৮৮. ${target} তোর বাপে কি তোরে দেখতে পারে? আমার সন্দেহ আছে! 🤣🤬🤡`,
      `৮৯. ${target} তোর বংশ কি কোনোদিন মানুষ হবে? 🤬🤡🤣`,
      `৯০. ${target} তোর মতো মানুষ পৃথিবীতে আসা মানে পৃথিবীর বদনাম! 🤡🤣🤬`,
      `৯১. ${target} তোর আম্মু কি জানে তুই কি করিস? 🤣🤬🤡`,
      `৯২. ${target} তোর বাপে কি তোরে চিনে? নাকি ভুলে গেছে? 🤬🤡🤣`,
      `৯৩. ${target} তোর মতো ছাগল পৃথিবীতে আর দ্বিতীয়টা নেই! 🤡🤣🤬`,
      `৯৪. ${target} তোর বংশের ইতিহাস লিখলে শুধু কলঙ্ক থাকবে! 🤣🤬🤡`,
      `৯৫. ${target} তোর চেহারা দেখে কি ডাক্তারও পালায়? 🤬🤡🤣`,
      `৯৬. ${target} তোর গুষ্ঠি কি কোনোদিন সম্মান পেয়েছে? 🤡🤣🤬`,
      `৯৭. ${target} তোর বাপের নাম কি আসলে জানা আছে তোর? 🤣🤬🤡`,
      `৯৮. ${target} তুই তো সেই চরিত্রহীন যে নিজেও জানিস না তুই কি! 🤬🤡🤣`,
      `৯৯. ${target} তোর মারে জিগাস কেন সারাদিন phone এ থাকে? 🤡🤣🤬`,
      `১০০. ${target} — ১০০ গালি খেলি! এখনো শরম নাই? কুত্তার বাচ্চা! 🤬🤡🤣👑`
    ];

    message.reply(
      `🔥 GHOST-NET TOXIC MODE!\n` +
      `🎯 Target: ${target}\n` +
      `💀 100 গালি | 3s পর auto-unsend\n` +
      `.xdmu stop — বন্ধ করো 🛑`
    );
    global.ghost_xdi.set(threadID, true);

    let count = 0;
    const interval = setInterval(async () => {
      if (!global.ghost_xdi.get(threadID) || count >= heavyGalis.length) {
        clearInterval(interval);
        if (count >= heavyGalis.length) {
          api.sendMessage(`✅ ${target} কে ১০০টা গালি দেওয়া হয়েছে! 🤬🤡🤣`, threadID);
        }
        return;
      }
      api.sendMessage(heavyGalis[count], threadID, (err, info) => {
        if (!err && info?.messageID) {
          setTimeout(() => { try { api.unsendMessage(info.messageID); } catch {} }, 3000);
        }
      });
      count++;
    }, 1000);
  }
};
