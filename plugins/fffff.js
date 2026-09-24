const { cmd } = require('../command')
const { downloadContentFromMessage } = require('@whiskeysockets/baileys')
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
        // 1. Check Owner / Self Number
        let botJid = conn.user.id.includes(':') ? conn.user.id.split(':')[0] + '@s.whatsapp.net' : conn.user.id;
        let senderJid = m.sender;

        let isSelfMode = senderJid === botJid;

        if (!isOwner && !isSelfMode) {
            return reply("❌ Yeh command sirf bot owner ya jis number par bot chal raha hai wahi use kar sakta hai!");
        }

        // 2. Reply image check
        let quotedMsg = m.quoted ? m.quoted : m;
        let mime = (quotedMsg.msg || quotedMsg).mimetype || quotedMsg.mtype || '';

        if (!/image/.test(mime)) {
            return reply("❌ Kisi photo par reply karke `.dp` likhein!");
        }

        reply("⏳ *D.P Update ho rahi hai, thoda wait karein...*");

        // 3. Download image buffer
        let downloadType = quotedMsg.msg ? quotedMsg.msg : quotedMsg;
        let stream = await downloadContentFromMessage(downloadType, 'image');
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        if (!buffer || buffer.length === 0) {
            return reply("❌ Photo download nahi ho saki!");
        }

        // 4. Overwrite local 'bot.png' file
        let filePath = path.join(__dirname, '../lib/bot.png');
        fs.writeFileSync(filePath, buffer);

        // 5. Update global image buffer / local path
        global.menuImageBuffer = buffer;

        // 6. Reply back with new photo & caption
        return await conn.sendMessage(from, { 
            image: buffer, 
            caption: "✅ *Aapki Bot Menu DP Successfully Lag Gayi Hai!*\n\nAb `.m` ya `.menu` likhne par wahi nayi photo aayegi." 
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`❌ Error: ${e.message}`);
    }
});

