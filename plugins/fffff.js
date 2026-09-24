const { cmd } = require('../command')
const { downloadMediaMessage } = require('@whiskeysockets/baileys')
const fs = require('fs')
const path = require('path')

cmd({
    pattern: "dp",
    alias: ["setdp", "botdp", "setbotdp", "setmenuphoto"],
    desc: "Menu ki Photo change karne ke liye",
    category: "owner",
    react: "🖼️",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, reply }) => {
    try {
        // 1. Check karo ki sender Owner hai ya khud Bot ka number hai
        let botJid = conn.user.id.includes(':') ? conn.user.id.split(':')[0] + '@s.whatsapp.net' : conn.user.id;
        let senderJid = m.sender;

        let isSelfMode = senderJid === botJid;

        // Agar Owner aur Bot number ke alawa koi teesra banda hai toh rok do
        if (!isOwner && !isSelfMode) {
            return reply("❌ Yeh command sirf bot owner ya jis number par bot chal raha hai wahi use kar sakta hai!");
        }

        // 2. Check karo ki kisi photo par reply hai ya nahi
        let mime = m.quoted ? m.quoted.mtype : m.mtype;
        if (!/image/.test(mime)) return reply("❌ Kisi photo par reply karke `.dp` likhein!");

        // 3. Media download karo
        let media = await downloadMediaMessage(
            m.quoted ? m.quoted : m,
            'buffer',
            {},
            { logger: console }
        );

        if (!media) return reply("❌ Photo download nahi ho saki!");

        // 4. Local File (lib/bot.png) ko update karo
        let filePath = path.join(__dirname, '../lib/bot.png');
        fs.writeFileSync(filePath, media);

        // 5. Agar aapke menu me config.js ka image link hai, toh usko bhi handle karega
        let configPath = path.join(__dirname, '../config.js');
        if (fs.existsSync(configPath)) {
            let configContent = fs.readFileSync(configPath, 'utf8');
            // Agar config me link / image variable hai toh local path apply kar dega
            if (configContent.includes('MENU_IMAGE')) {
                configContent = configContent.replace(/MENU_IMAGE\s*=\s*['"`].*?['"`]/g, `MENU_IMAGE = './lib/bot.png'`);
                fs.writeFileSync(configPath, configContent);
            }
        }

        // 6. Nayi DP photo send karo aur niche text message caption me do
        return await conn.sendMessage(from, { 
            image: media, 
            caption: "✅ *Aapki Bot Menu Display Picture Successfully Lag Gayi Hai!*\n\nAb `.m` ya `.menu` likhne par wahi nayi photo aayegi." 
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`❌ Error: ${e.message}`);
    }
});
