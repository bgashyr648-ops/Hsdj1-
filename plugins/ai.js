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
        const isQuotedImage = quoted && quoted.mtype === 'imageMessage';
        const isQuotedVideo = quoted && quoted.mtype === 'videoMessage';
        const isQuotedAudio = quoted && quoted.mtype === 'audioMessage';
        const isQuotedDocument = quoted && quoted.mtype === 'documentMessage';

        if (!isQuotedImage && !isQuotedVideo && !isQuotedAudio && !isQuotedDocument) {
            return reply("❌ Please reply directly to an image, video, audio, or document!");
        }

        await reply("⏳ Downloading media, please wait...");

        let mediaBuffer = await quoted.download();
        
        if (!mediaBuffer) {
            return reply("❌ Failed to download media buffer!");
        }

        let ext = '.jpg';
        if (isQuotedVideo) ext = '.mp4';
        else if (isQuotedAudio) ext = '.mp3';
        else if (isQuotedDocument && quoted.msg && quoted.msg.fileName) {
            ext = path.extname(quoted.msg.fileName) || '.bin';
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
