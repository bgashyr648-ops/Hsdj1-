const { cmd } = require('../command');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

cmd({
    pattern: "tourl",
    alias: ["upload", "url", "link"],
    desc: "Uploads media to Catbox and returns a reliable public URL",
    category: "owner",
    react: "🔗",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, reply }) => {
    let mediaStream = null;
    try {
        const quotedMsg = mek.msg?.contextInfo?.quotedMessage;
        if (!quotedMsg) {
            return reply("❌ Please reply to a video, audio, or image to use this command!");
        }

        await reply("⏳ Downloading media, please wait...");
        mediaStream = await conn.downloadAndSaveMediaMessage(quoted);
        
        if (!mediaStream) {
            return reply("❌ Failed to download the media!");
        }

        await reply("☁️ Uploading file to secure server...");

        const form = new FormData();
        form.append('reqtype', 'fileupload');
        form.append('fileToUpload', fs.createReadStream(mediaStream));

        const uploadResponse = await axios.post('https://catbox.moe/user/api.php', form, {
            headers: { ...form.getHeaders() },
            timeout: 60000 // 60 seconds timeout for larger videos
        });

        let directUrl = uploadResponse.data ? uploadResponse.data.trim() : "";

        if (!directUrl.startsWith('http')) {
            throw new Error("Invalid URL received from server.");
        }

        // Clean up temporary local file
        if (fs.existsSync(mediaStream)) {
            fs.unlinkSync(mediaStream);
        }

        let responseText = `🔗 *MEDIA URL GENERATED*\n\n` +
                           `📁 *Link:* ${directUrl}\n\n` +
                           `🔥 *TIGER MD* \n👑 *Owner:* BAGGA SHER MD`;

        return await conn.sendMessage(from, { text: responseText }, { quoted: mek });

    } catch (e) {
        // Ensure local temporary file is cleaned up even if an error occurs to prevent crashes
        if (mediaStream && fs.existsSync(mediaStream)) {
            try {
                fs.unlinkSync(mediaStream);
            } catch (err) {
                console.error("Cleanup error:", err);
            }
        }
        
        console.error('Error in tourl command:', e);
        return reply(`❌ Upload failed: ${e.message}`);
    }
});
