const { cmd } = require('../command')
const { downloadContentFromMessage } = require('@whiskeysockets/baileys')
const axios = require('axios')
const FormData = require('form-data')
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

        if (!isOwner && !isSelfMode) {
            return reply("❌ Yeh command sirf bot owner ya jis number par bot chal raha hai wahi use kar sakta hai!");
        }

        // 2. Reply image check karo
        let quotedMsg = m.quoted ? m.quoted : m;
        let mime = (quotedMsg.msg || quotedMsg).mimetype || quotedMsg.mtype || '';

        if (!/image/.test(mime)) {
            return reply("❌ Kisi photo par reply karke `.dp` likhein!");
        }

        reply("⏳ *D.P Update ho rahi hai, thoda wait karein...*");

        // 3. Media Download
        let downloadType = quotedMsg.msg ? quotedMsg.msg : quotedMsg;
        let stream = await downloadContentFromMessage(downloadType, 'image');
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        // 4. Local File (lib/bot.png) Replace
        let filePath = path.join(__dirname, '../lib/bot.png');
        try {
            fs.writeFileSync(filePath, buffer);
        } catch (err) {
            console.log("Local file save warning: ", err);
        }

        // 5. Image ko Online Server (Imgbb) par upload karna
        let form = new FormData();
        form.append('image', buffer.toString('base64'));
        
        let uploadRes = await axios.post('https://api.imgbb.com/1/upload?key=124032d80d1999c08d1f21cc48981c2f', form, {
            headers: { ...form.getHeaders() }
        });

        let imageUrl = uploadRes.data.data.url;

        // 6. Config.js me Image URL update karna
        let configPath = path.join(__dirname, '../config.js');
        if (fs.existsSync(configPath)) {
            let configContent = fs.readFileSync(configPath, 'utf8');
            if (configContent.includes('MENU_IMAGE')) {
                configContent = configContent.replace(/MENU_IMAGE\s*=\s*['"`].*?['"`]/g, `MENU_IMAGE = '${imageUrl}'`);
                fs.writeFileSync(configPath, configContent);
            }
        }

        // 7. Success Reply Photo aur Text ke sath
        return await conn.sendMessage(from, { 
            image: buffer, 
            caption: `✅ *Aapki Bot Menu DP Successfully Update Ho Gayi Hai!*\n\n🖼️ *Naya Image Link:* ${imageUrl}\n\nAb \`.m\` ya \`.menu\` likhne par wahi nayi photo aayegi.` 
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`❌ Error: ${e.message}`);
    }
});
