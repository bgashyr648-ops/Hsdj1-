const { cmd } = require('../command');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

cmd({
    pattern: "tourl",
    alias: ["upload", "url", "link"],
    desc: "Uploads media to Catbox and returns a reliable public URL",
    category: "owner",
    react: "🔗",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, reply }) => {
    let filePath = null;
    try {
        // चेक करें कि क्या वाकई किसी मैसेज पर रिप्लाई किया गया है और उसमें मीडिया है
        const targetQuoted = m.quoted ? m.quoted : quoted;
        if (!targetQuoted) {
            return reply("❌ Please reply directly to an image, video, audio, or document!");
        }

        // चेक करें कि क्या कोटेड मैसेज में मीडिया मौजूद है
        let mime = targetQuoted.mimetype || targetQuoted.mediaType || "";
        if (!mime && !targetQuoted.download) {
            return reply("❌ The message you replied to does not contain valid media!");
        }

        await reply("⏳ Downloading media, please wait...");

        // मीडिया डाउनलोड करने के लिए सही फंक्शन का इस्तेमाल
        let mediaBuffer = await targetQuoted.download();
        
        if (!mediaBuffer) {
            return reply("❌ Failed to download media buffer!");
        }

        // फाइल एक्सटेंशन सेट करना
        let ext = '.bin';
        if (mime.includes('image')) ext = '.jpg';
        else if (mime.includes('video')) ext = '.mp4';
        else if (mime.includes('audio')) ext = '.mp3';
        else if (targetQuoted.fileName) {
            ext = path.extname(targetQuoted.fileName) || '.bin';
        }

        filePath = `./temp_${Date.now()}${ext}`;
        fs.writeFileSync(filePath, mediaBuffer);

        await reply("☁️ Uploading file to secure server...");

        const form = new FormData();
        form.append('reqtype', 'fileupload');
        form.append('fileToUpload', fs.createReadStream(filePath));

        const uploadResponse = await axios.post('https://catbox.moe/user/api.php', form, {
            headers: { ...form.getHeaders() },
            timeout: 60000 
        });

        let directUrl = uploadResponse.data ? uploadResponse.data.trim() : "";

        if (!directUrl.startsWith('http')) {
            throw new Error("Invalid URL received from server.");
        }

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        let responseText = `🔗 *MEDIA URL GENERATED*\n\n` +
                           `📁 *Link:* ${directUrl}\n\n` +
                           `🔥 *TIGER MD* \n👑 *Owner:* BAGGA SHER MD`;

        return await conn.sendMessage(from, { text: responseText }, { quoted: mek });

    } catch (e) {
        if (filePath && fs.existsSync(filePath)) {
            try { fs.unlinkSync(filePath); } catch (err) {}
        }
        console.error('Error in tourl command:', e);
        return reply(`❌ Upload failed: ${e.message}`);
    }
});
