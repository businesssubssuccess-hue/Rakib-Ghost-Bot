# 🍪 Facebook Cookie Problem — Solution (Bangla)

## ❌ Problem
Fresh cookie দিলেও bot login করতে পারছে না।  
Error দেখাচ্ছে: `Không tìm thấy cookie cho người dùng` (User cookie not found)

## ✅ এখন কী Fix হলো
`bot/login/login.js` এ cookie normalizer update করা হয়েছে — এখন:
- `expirationDate` (Cookie Editor format) ঠিকঠাক `expires` field এ convert হবে
- Missing expiry হলে default ১ বছর set হবে
- আগে `expires=undefined` যেত → tough-cookie reject করত → এখন এই bug fix

## 🛠️ Cookie সঠিকভাবে নেওয়ার Step-by-Step

### ১) Browser Setup
- Chrome/Edge ব্যবহার করো (Brave/Firefox এ মাঝে মাঝে cookie miss হয়)
- **Incognito/Private window খুলো** (এতে clean session পাবে)

### ২) Extension Install
- **Cookie-Editor** (by Moustachauve) install করো:  
  https://chrome.google.com/webstore/detail/cookie-editor/hlkenndednhfkekhgcdicdfddnkalmdm

### ৩) FB Login
- Incognito window এ `facebook.com` open করো
- নিজের account এ **manually login** করো (auto-fill use কোরো না)
- 2FA থাকলে complete করো
- Login হবার পর **৩০ সেকেন্ড অপেক্ষা করো** (FB কে cookie set করতে দাও)

### ৪) Cookie Export
- Cookie-Editor icon এ click করো
- নিচের **Export** dropdown → **Export as JSON** select করো
- Clipboard এ copy হয়ে যাবে

### ৫) account.txt Update
- Replit এ `account.txt` open করো
- পুরোনো content মুছে নতুন paste করো
- Save করো

### ৬) Verify
- Bot এ inbox এ message করো: `/checkcookie` (owner only)
- 🟢 HEALTHY দেখালে restart workflow

## 📋 Essential Cookies (এই ৫টা থাকতেই হবে)
| Cookie | কাজ |
|--------|-----|
| `c_user` | তোমার FB ID |
| `xs` | Session token |
| `datr` | Browser fingerprint |
| `fr` | Auth nonce |
| `sb` | Browser ID |

## 🚨 Common Mistakes
1. ❌ Cookie copy এর সময় `[` `]` brackets বাদ দেওয়া → invalid JSON
2. ❌ `c_user` cookie missing → FB ID খুঁজে পাবে না
3. ❌ Incognito ছাড়া normal browser এ cookie নেওয়া → পুরোনো expired cookie পাবে
4. ❌ Mobile FB (m.facebook.com) থেকে cookie নেওয়া → desktop API এ কাজ করবে না
5. ❌ VPN দিয়ে cookie নিয়ে VPN ছাড়া bot চালানো → IP mismatch → checkpoint

## 🔍 Debug Commands
```
/checkcookie    — cookie health check (owner only)
/botstatus      — bot uptime, RAM, ping
```

## 💡 Pro Tips
- **নতুন FB account** ব্যবহার করো (২-৩ সপ্তাহ পুরোনো হলে best)
- প্রথম ২৪ ঘন্টায় bot এ heavy use কোরো না (FB suspect করে)
- Same IP থেকে bot চালাও যেখানে cookie নিয়েছ
- Render এ deploy করার সময় যদি IP change হয় → কখনো কখনো checkpoint আসে → তখন phone থেকে confirm করো
